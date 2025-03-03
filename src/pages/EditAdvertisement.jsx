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
      books: doc.books ? doc.books : []
    };

    if (name) {
      payload.name = name;
    }

    if (selected.length && calendarType === 'book') {
      const booksCopy = { ...doc.books };

      const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

      houses.forEach((value) => {
        booksCopy[value] = [...booksCopy[value], ...selectedDates];
      });


      payload.books = booksCopy;
    } else if (calendarType === 'delete') {
      const booksCopy = { ...doc.books };

      const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

      houses.forEach((value) => {
        booksCopy[value] = [...selectedDates];
      });


      payload.books = booksCopy;
    }

    console.log(payload);

    WebApp.sendData(JSON.stringify(payload));
  };

  useEffect(() => {
    if (doc.count === 1) {
      setHouses([1]);
    }
  }, []);



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
      price: pricesObj,
      name,
      books: selectedDays
    };

    const docObj = {
      city: doc.city,
      address: doc.address,
      phone: doc.phone,
      // count: parseInt(doc.count),
      price: doc.price,
      name: doc.name ? doc.name : '',
      books: doc.books ? doc.books : {}
    }

    const isObjectChanged = deepEqual(payload, docObj);

    return (city && address && phone && name && isSomeprice && !isObjectChanged) || (houses.length && selected.length);
  }, [city, address, phone, price, name, selected, doc, houses]);

  useEffect(() => {
    WebApp.onEvent('mainButtonClicked', onSendData);

    return () => {
      WebApp.offEvent('mainButtonClicked', onSendData);
    };
  }, [city, address, count, phone, price, selected, doc]);

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
        const booksByHouseNumber = doc.books[value];
        acc.push(...booksByHouseNumber);

        return acc;
      }, []);

      const setFromArr = new Set(housesBookedDays);

      return Array.from(setFromArr).map((d) => new Date(d));
    }

    const commonDates = Object.values(doc.books);

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
        const disabled = selectedDates.some((d) => doc.books[key].includes(d));

        arr.push({ number: key, disabled });
      });

      return arr;
    }

    return Object.keys(doc.books).map((v) => ({ number: v, disabled: false }));
  }, [doc.books, selected]);


  useEffect(() => {
    if (calendarType === 'delete' && houses.length) {
      const housesBookedDays = houses.reduce((acc, value) => {
        const booksByHouseNumber = doc.books[value];
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
    setHouses([]);
    handleSelect([]);
  }, [calendarType])


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

      {/* <button onClick={onSendData}>btn</button> */}
    </div>
  )
}

export default EditAdvertisement;
