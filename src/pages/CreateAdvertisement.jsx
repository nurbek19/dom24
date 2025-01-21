import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useIMask } from 'react-imask';
import { useSearchParams } from 'react-router-dom';

import PriceField from '../components/PriceField';
import '../App.css';


export const DICTIONARY = {
  'ru': {
    city: 'Город',
    address: 'Адрес',
    phone: 'Номер телефона',
    roomCount: 'Количество комнат',
    price: 'Цена',
    day: 'День',
    night: 'Ночь',
    hour: 'Час',
    day_night: 'Сутки',
    shortRoomCount: 'Кол-во комнат',
    back: 'Назад',
    find: 'Найти',
    rentType: 'Тип аренды',
    free: 'Свободно',
    busy: 'Занято',
    showNumber: 'Показать номер',
    numberCopied: 'Номер телефона скопировано'
  },
  'kg': {
    city: 'Шаар',
    address: 'Дарек',
    phone: 'Телефон номер',
    roomCount: 'Комната саны',
    price: 'Баа',
    day: 'Күндүз',
    night: 'Түн',
    hour: 'Саат',
    day_night: 'Күн',
    shortRoomCount: 'Комната саны',
    back: 'Артка кайтуу',
    find: 'Табуу',
    rentType: 'Ижара түрү',
    free: 'Бош',
    busy: 'Бош эмес',
    showNumber: 'Номер көрсөтүү',
    numberCopied: 'Телефон номер көчүрүлдү'
  }
}


export const CITIES = ['Бишкек', 'Нарын', 'Каракол', 'Ош'];

function CreateAdvertisement() {
  const [city, setCity] = useState(CITIES[0]);
  const [address, setAddress] = useState('');
  const [room, setRoom] = useState(null);
  const [price, setPrice] = useState({
    hour: '',
    day: '',
    night: '',
    day_night: ''
  });
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const [lang, setLang] = useState('ru');

  const {
    ref,
    value: phone,
  } = useIMask({ mask: '+{996}(000)000-000' });


  const priceChangeHandler = (name, value) => {
    const copyObj = { ...price };

    copyObj[name] = value;

    setPrice(copyObj);
  }

  const onSendData = useCallback(() => {
    let pricesObj = {};

    for (let key in price) {
      if (price[key]) {
        pricesObj[key] = parseInt(price[key]);
      }
    }

    const payload = {
      city,
      address,
      phone,
      room_count: parseInt(room),
      price: pricesObj
    };

    console.log(payload);

    // if (data) {
      WebApp.sendData(JSON.stringify(payload));
    // }
  }, [city, address, room, phone, price]);

  useEffect(() => {
    WebApp.expand();
  }, []);

  useEffect(() => {
    const language = searchParams.get('lang');

    if (language) {
      setLang(language);
    }
    
  }, []);

  const isFormValid = useMemo(() => {
    const isSomeprice = Object.values(price).some((value) => value);

    const valid = city && address && room && phone && isSomeprice;

    return valid;

  }, [city, address, room, phone, price]);

  useEffect(() => {
    const isSomeprice = Object.values(price).some((value) => value);

    if (city && address && room && phone && isSomeprice) {
      let pricesObj = {};

      for (let key in price) {
        if (price[key]) {
          pricesObj[key] = parseInt(price[key]);
        }
      }

      const payload = {
        city,
        address,
        phone,
        room_count: parseInt(room),
        price: pricesObj
      };

      console.log(payload, 'payload');

      setData(payload);
      WebApp.onEvent('mainButtonClicked', onSendData);
    } else {
      setData(null)
    }

    return () => {
      // WebApp.MainButton.hide();
      WebApp.offEvent('mainButtonClicked', onSendData);
    };
  }, [city, address, room, phone, price, setData]);

  useEffect(() => {
    WebApp.MainButton.text = 'Создать объявление';
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

  }, [isFormValid])


  return (
    <div>

      <div className="field-wrapper select-wrapper">
        <label htmlFor="city" className="field-label">{DICTIONARY[lang].city}</label>

        <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
          {CITIES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
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
        <span className="field-label">{DICTIONARY[lang].roomCount}</span>

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
        <span className="field-label">Цена</span>

        <PriceField label={DICTIONARY[lang].hour} name="hour" value={price.hour} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].day} name="day" value={price.day} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].night} name="night" value={price.night} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].day_night} name="day_night" value={price.day_night} onChange={priceChangeHandler} />
      </div>
    </div>
  )
}

export default CreateAdvertisement;
