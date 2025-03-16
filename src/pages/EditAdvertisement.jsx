import { useCallback, useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";
import { useIMask } from 'react-imask';
import deepEqual from 'deep-equal';

import PriceField from '../components/PriceField';
import HouseItem from '../components/HouseItem';
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';


const CITIES = ['Бишкек', 'Нарын', 'Каракол', 'Ош'];

function EditAdvertisement({ doc, lang, onBackHandler }) {
  const [city, setCity] = useState(doc.city);
  const [address, setAddress] = useState(doc.address);
  const [price, setPrice] = useState({ ...doc.price });
  const [name, setName] = useState(doc.name ? doc.name : '');
  const [selected, setSelected] = useState([]);
  const [houses, setHouses] = useState([]);
  const [calendarType, setCalendarType] = useState('book');
  const [count, setCount] = useState('');
  const [prepayment, setPrepayment] = useState(doc.prepayment_sum);
  const [paymentLink, setPaymentLink] = useState(doc.mbank_link);
  const [note, setNote] = useState('');

  const {
    ref,
    value: phone,
    setValue,
  } = useIMask({ mask: '+{996}(000)000-000' });


  const priceChangeHandler = (name, value) => {
    const copyObj = { ...price };

    copyObj[name] = value;

    setPrice(copyObj);
  }

  const onSendData = () => {
    let pricesObj = {};

    for (let key in price) {
      if (price[key]) {
        pricesObj[key] = parseInt(price[key]);
      }
    }

    const payload = {
      _id: doc._id,
      city,
      address,
      phone,
      count: doc.count,
      price: pricesObj,
      prepayment_sum: parseInt(prepayment),
      mbank_link: paymentLink,
      books: doc.books ? doc.books : [],
      delete_books: false
    };

    if (name) {
      payload.name = name;
    }

    if (selected.length && calendarType === 'book') {
      const booksCopy = {};

      const selectedDates = selected.map((date) => ({ book_date: format(date, 'MM/dd/yyyy'), book_comment: note }));

      houses.forEach((value) => {
        booksCopy[value] = [...selectedDates];
      });


      payload.books = booksCopy;
    } else if (calendarType === 'delete') {
      const booksCopy = {};

      const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

      houses.forEach((value) => {
        // booksCopy[value] = [...selectedDates];

        booksCopy[value] = [...doc.books[value]].reduce((acc, obj) => {
          if (!selectedDates.includes(obj.book_date)) {
            acc.push(obj);
          }

          return acc;
        }, []);
      });


      payload.books = booksCopy;
      payload.delete_books = true;
    }

    console.log(JSON.stringify(payload));
    console.log(payload);

    WebApp.sendData(JSON.stringify(payload));
  };



  const isFormValid = useMemo(() => {
    const isSomeprice = Object.values(price).some((value) => value);

    let pricesObj = {
      day: 0,
      day_off: 0,
    };

    for (let key in price) {
      if (price[key] || price[key] === 0) {
        pricesObj[key] = parseInt(price[key]);
      }
    }

    let selectedDays = doc.books;

    if (selected.length) {
      const booksCopy = { ...doc.books };

      const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

      houses.forEach((value) => {
        booksCopy[value] = [...booksCopy[value], ...selectedDates];
      });


      selectedDays = booksCopy;
    }

    const payload = {
      city,
      address,
      phone,
      // count: parseInt(count),
      prepayment_sum: prepayment,
      mbank_link: paymentLink,
      price: pricesObj,
      name,
      books: selectedDays
    };

    const docObj = {
      city: doc.city,
      address: doc.address,
      phone: doc.phone,
      prepayment_sum: doc.prepayment_sum,
      mbank_link: doc.mbank_link,
      // count: parseInt(doc.count),
      price: doc.price,
      name: doc.name ? doc.name : '',
      books: doc.books ? doc.books : {}
    }

    const isObjectChanged = deepEqual(payload, docObj);

    console.log(houses.length, selected.length);

    return (city && address && phone && name && isSomeprice && prepayment && paymentLink && !isObjectChanged) || (houses.length && selected.length);
  }, [city, address, phone, price, name, selected, doc, houses, prepayment, paymentLink]);

  useEffect(() => {
    WebApp.onEvent('mainButtonClicked', onSendData);

    return () => {
      WebApp.offEvent('mainButtonClicked', onSendData);
    };
  }, [city, address, count, phone, price, selected, houses, prepayment, paymentLink, note, doc]);

  useEffect(() => {
    WebApp.MainButton.text = 'Применить изменения';
    // WebApp.onEvent('mainButtonClicked', onSendData);

    if (isFormValid) {
      WebApp.MainButton.show();
    } else {
      WebApp.MainButton.hide();
    }


    return () => {
      WebApp.MainButton.hide();
      // WebApp.offEvent('mainButtonClicked', onSendData);
    };

  }, [isFormValid]);

  useEffect(() => {
    WebApp.expand();
    setValue(doc.phone);
  }, []);

  const handleSelect = (days) => {
    setSelected(days);
  };

  const bookedDays = useMemo(() => {
    if (!doc.books) {
      return [];
    }

    if (calendarType === 'delete') {
      return [];
    }

    if (houses.length) {
      const housesBookedDays = houses.reduce((acc, value) => {
        const booksByHouseNumber = doc.books[value].map((entity) => entity.book_date);
        acc.push(...booksByHouseNumber);

        return acc;
      }, []);

      const setFromArr = new Set(housesBookedDays);

      return Array.from(setFromArr).map((d) => new Date(d));
    }

    const commonDates = Object.values(doc.books).map((arr) => (arr.map((el) => el.book_date)));;

    if (commonDates.length === 0) {
      return [];
    }

    return commonDates.reduce((acc, arr) => acc.filter(el => arr.includes(el))).map(date => new Date(date));

  }, [doc.books, houses, calendarType]);


  const housesList = useMemo(() => {
    if (!doc.books) {
      return [];
    }

    if (calendarType === 'delete') {
      return Object.keys(doc.books).map((v) => ({ number: v, disabled: false }));
    }

    if (selected.length) {
      const arr = [];
      const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

      Object.keys(doc.books).forEach((key) => {
        const disabled = selectedDates.some((d) => doc.books[key].map((obj) => (obj.book_date)).includes(d));

        arr.push({ number: key, disabled });
      });

      return arr;
    }

    return Object.keys(doc.books).map((v) => ({ number: v, disabled: false }));
  }, [doc.books, selected]);


  useEffect(() => {
    if (calendarType === 'delete' && houses.length) {
      const housesBookedDays = houses.reduce((acc, value) => {
        const booksByHouseNumber = doc.books[value].map((entity) => entity.book_date);
        acc.push(...booksByHouseNumber);

        return acc;
      }, []);

      const setFromArr = new Set(housesBookedDays);

      const arr = Array.from(setFromArr).map((d) => new Date(d));
      handleSelect(arr);
    } else if (calendarType === 'delete' && !houses.length) {
      handleSelect([]);
    }

  }, [houses, calendarType]);

  useEffect(() => {
    if (doc.count === 1) {
      setHouses([1]);
    } else {
      setHouses([]);
    }
    handleSelect([]);
  }, [calendarType]);


  return (
    <div>
      <div className="back-button" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>

      <div className="field-wrapper select-wrapper">
        <label htmlFor="city" className="field-label">{DICTIONARY[lang].city}</label>

        <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
          {CITIES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="field-wrapper">
        <label htmlFor="name" className="field-label">{DICTIONARY[lang].name}</label>

        <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="field-wrapper">
        <label htmlFor="address" className="field-label">{DICTIONARY[lang].address}</label>

        <input type="text" id="address" className="text-field" maxLength={50} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="field-wrapper">
        <label htmlFor="phone" className="field-label">{DICTIONARY[lang].phone}</label>

        <input type="tel" pattern="[0-9]*" noValidate id="phone" className="text-field" ref={ref} />
      </div>

      <div className="field-wrapper">
        <label htmlFor="prepayment" className="field-label">Минимальная сумма предоплаты</label>

        <input type="number" id="prepayment" pattern="[0-9]*" inputMode="numeric" className="text-field" value={prepayment} onChange={(e) => setPrepayment(e.target.value)} />
      </div>

      <div className="field-wrapper">
        <label htmlFor="payment-link" className="field-label">Ссылка для предоплаты</label>

        <input type="text" id="payment-link" className="text-field" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} />
      </div>

      <div className="field-wrapper">
        <span className="field-label">{DICTIONARY[lang].price}</span>

        <PriceField label={DICTIONARY[lang].day} name="day" value={price.day} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].day_off} name="day_off" value={price.day_off} onChange={priceChangeHandler} />
      </div>

      <div className="field-wrapper">
        <span className="field-label">Выберите подходящий календарь для:</span>

        <div className="calendar-type-buttons">
          <label className="radio-input-label">
            <input type="radio" name="calendarType" value="book" className="radio-input" checked={calendarType === 'book'} onChange={(e) => setCalendarType(e.target.value)} />
            <span className="radio-input-text">бронирования</span>
          </label>
          <label className="radio-input-label">
            <input type="radio" name="calendarType" value="delete" className="radio-input" checked={calendarType === 'delete'} onChange={(e) => setCalendarType(e.target.value)} />
            <span className="radio-input-text">отмены</span>
          </label>
        </div>
      </div>

      {housesList.length !== 1 && (
        <div className='houses-container'>
          <p>Выберите номер дома для бронирования:</p>
          <div className='houses-list'>
            {housesList.map((obj) => (
              <HouseItem key={obj.number} number={obj.number} disabled={obj.disabled} setHouses={setHouses} calendarType={calendarType} />
            ))}
          </div>
        </div>
      )}

      <div className={clsx('book-calendar', { 'partner-calendar': calendarType === 'delete' })}>
        <p>{DICTIONARY[lang].notBookLabel}:</p>
        <DayPicker
          locale={ru}
          mode="multiple"
          selected={selected}
          onSelect={handleSelect}
          disabled={[{ before: new Date() }, ...bookedDays]}
          modifiers={{
            booked: bookedDays
          }}
          modifiersClassNames={{
            booked: "my-booked-class"
          }}
        />
      </div>

      <div className={clsx('field-wrapper hide-name-field note-field', { 'show-name-field': selected.length && houses.length && calendarType === 'book' })}>
        <label htmlFor="note" className="field-label">Введите заметку</label>

        <input type="text" id="note" className="text-field" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <button onClick={onSendData}>btn</button>
    </div>
  )
}

export default EditAdvertisement;
