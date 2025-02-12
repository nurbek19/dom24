import { useCallback, useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";
import { useIMask } from 'react-imask';
import deepEqual from 'deep-equal';

import PriceField from '../components/PriceField';
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';


const CITIES = ['Бишкек', 'Нарын', 'Каракол', 'Ош'];

function EditAdvertisement({ doc, lang, onBackHandler }) {
  const [city, setCity] = useState(doc.city);
  const [address, setAddress] = useState(doc.address);
  const [room, setRoom] = useState(doc.room_count.toString());
  const [price, setPrice] = useState({ ...doc.price });
  const [data, setData] = useState(null);
  const [name, setName] = useState(doc.name ? doc.name : '');
  const [selected, setSelected] = useState([]);

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
      room_count: parseInt(room),
      price: pricesObj,
      books: doc.books ? doc.books : []
    };

    if (name) {
      payload.name = name;
    }

    if (selected) {
      const selectedDays = selected.forEach((date) => {
        return format(date, 'dd/mm/yyyy');
      });

      payload.books = [...payload.books, ...selectedDays];
    }

    console.log(payload);

    WebApp.sendData(JSON.stringify(payload));
  };

  useEffect(() => {
    WebApp.expand();
    setValue(doc.phone);
  }, []);

  const isFormValid = useMemo(() => {
    const isSomeprice = Object.values(price).some((value) => value);

    let pricesObj = {
      hour: 0,
      day: 0,
      night: 0,
      day_night: 0
    };
    for (let key in price) {
      if (price[key] || price[key] === 0) {
        pricesObj[key] = parseInt(price[key]);
      }
    }

    let selectedDays = [];

    if (doc.books) {
      selectedDays = [ ...doc.books ];
    }

    if (selected.length) {
      selected.forEach((date) => {
        const formattedDate = format(date, 'dd/mm/yyyy');

        selectedDays.push(formattedDate);
      })
    }

    const payload = {
      city,
      address,
      phone,
      room_count: parseInt(room),
      price: pricesObj,
      name,
      books: selectedDays
    };

    const docObj = {
      city: doc.city,
      address: doc.address,
      phone: doc.phone,
      room_count: parseInt(doc.room_count),
      price: doc.price,
      name: doc.name ? doc.name : '',
      books: doc.books ? doc.books : []
    }

    console.log('Price', price, doc.price, pricesObj);
    console.log(payload, docObj);

    const isObjectChanged = deepEqual(payload, docObj);

    return city && address && room && phone && name && isSomeprice && !isObjectChanged;
  }, [city, address, room, phone, price, name, selected, doc]);

  useEffect(() => {
    WebApp.onEvent('mainButtonClicked', onSendData);

    return () => {
      WebApp.offEvent('mainButtonClicked', onSendData);
    };
  }, [city, address, room, phone, price, selected, doc])

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


  const bookedDays = useMemo(() => {
    if (!doc.books) {
      return [];
    }

    return doc.books.map((date) => new Date(date));
  }, [doc.books]);


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
        <span className="field-label">{DICTIONARY[lang].room}</span>

        <div className="room-buttons">
          <label className="radio-input-label">
            <input type="radio" name="room" value="1" className="radio-input" checked={room === '1'} onChange={(e) => setRoom(e.target.value)} />
            <span className="radio-input-text">1</span>
          </label>
          <label className="radio-input-label">
            <input type="radio" name="room" value="2" className="radio-input" checked={room === '2'} onChange={(e) => setRoom(e.target.value)} />
            <span className="radio-input-text">2</span>
          </label>
          <label className="radio-input-label">
            <input type="radio" name="room" value="3" className="radio-input" checked={room === '3'} onChange={(e) => setRoom(e.target.value)} />
            <span className="radio-input-text">3</span>
          </label>
          <label className="radio-input-label">
            <input type="radio" name="room" value="4" className="radio-input" checked={room === '4'} onChange={(e) => setRoom(e.target.value)} />
            <span className="radio-input-text">4</span>
          </label>
          <label className="radio-input-label">
            <input type="radio" name="room" value="5" className="radio-input" checked={room === '5'} onChange={(e) => setRoom(e.target.value)} />
            <span className="radio-input-text">5</span>
          </label>
        </div>
      </div>

      <div className="field-wrapper">
        <span className="field-label">{DICTIONARY[lang].price}</span>

        {/* <PriceField label={DICTIONARY[lang].hour} name="hour" value={price.hour} onChange={priceChangeHandler} /> */}
        <PriceField label={DICTIONARY[lang].day} name="day" value={price.day} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].night} name="night" value={price.night} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].day_night} name="day_night" value={price.day_night} onChange={priceChangeHandler} />
      </div>

      <div className='book-calendar'>
        <DayPicker
          locale={ru}
          mode="multiple"
          selected={selected}
          onSelect={setSelected}
          disabled={[{ before: new Date() }, ...bookedDays]}
          modifiers={{
            booked: bookedDays
          }}
          modifiersClassNames={{
            booked: "my-booked-class"
          }}
        />
      </div>
    </div>
  )
}

export default EditAdvertisement;
