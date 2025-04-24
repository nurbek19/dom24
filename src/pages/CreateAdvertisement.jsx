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
    roomCount: 'Количество комнат / мест',
    price: 'Цена',
    day: 'Будни',
    night: 'Ночь',
    hour: 'Час',
    day_night: 'Сутки',
    day_off: 'Выходные',
    shortRoomCount: 'Кол-во комнат / мест',
    back: 'Назад',
    find: 'Найти',
    rentType: 'Тип аренды',
    free: 'Свободно',
    busy: 'Занято',
    showNumber: 'Показать номер',
    numberCopied: 'Номер телефона скопировано',
    notFound: 'Нету подходящих квартир с текущими параметрами. Попробуйте другие параметры.',
    name: 'Название (для отелей)',
    nameLabel: 'Название',
    book: 'Запросить бронь',
    recentDays: 'Ближайшие свободные даты',
    bookLabel: 'Выберите даты для бронирования',
    bookPhone: 'Оставьте номер для брони',
    notBookLabel: 'Выберите недоступные дни'
  },
  'kg': {
    city: 'Шаар',
    address: 'Дарек',
    phone: 'Телефон номер',
    roomCount: 'Комната саны / орун',
    price: 'Баа',
    day: 'Күндүз',
    night: 'Түн',
    hour: 'Саат',
    day_night: 'Күн',
    day_off: 'Иш эмес күндөр',
    shortRoomCount: 'Комната саны / орун',
    back: 'Артка кайтуу',
    find: 'Издөө',
    rentType: 'Ижара түрү',
    free: 'Бош',
    busy: 'Бош эмес',
    showNumber: 'Номер көрсөтүү',
    numberCopied: 'Телефон номер көчүрүлдү',
    notFound: 'Учурдагы тандоолор менен ылайыктуу батирлер жок. Башка тандоолорду колдонуп көрүңүз.',
    name: 'Аты-жөнү (мейманкана үчүн)',
    nameLabel: 'Аты-жөнү',
    book: 'Брондоо',
    recentDays: 'Жакынкы бош күндөр',
    bookLabel: 'Брондоо үчүн даталарды тандаңыз',
    bookPhone: 'брондоо үчүн номериңизди калтырыңыз',
    notBookLabel: 'Бош эмес күндөрдү белгилеңиз'
  }
}


export const CITIES = ['Бишкек', 'Нарын', 'Каракол', 'Ош', 'Чолпон - Ата', 'Иссык - Куль'];
export const HOUSE_TYPES = ['А - фрейм', 'Глемпинг', 'Коттедж', 'Барнхаус', 'Гостевой дом', 'Юрта'];

function CreateAdvertisement() {
  const [city, setCity] = useState(CITIES[0]);
  const [address, setAddress] = useState('');
  const [count, setCount] = useState('');
  const [price, setPrice] = useState({
    day: '',
    day_off: '',
  });
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const [lang, setLang] = useState('ru');
  const [name, setName] = useState('');
  const [prepayment, setPrepayment] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [houseType, setHouseType] = useState(HOUSE_TYPES[0]);
  const [description, setDescription] = useState('');

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
      count: parseInt(count),
      prepayment_sum: parseInt(prepayment),
      mbank_link: paymentLink,
      price: pricesObj,
      house_type: houseType,
      finik_account_id: paymentId,
      description,
    };

    if (name) {
      payload.name = name;
    }

    console.log(payload);

    // if (data) {
    WebApp.sendData(JSON.stringify(payload));
    // }
  }, [city, address, count, phone, price, name, prepayment, paymentLink, houseType, paymentId, description]);

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

    const valid = city && address && count && phone && isSomeprice && prepayment && houseType;

    return valid;

  }, [city, address, count, phone, price, prepayment, paymentLink, houseType, paymentId, description]);

  useEffect(() => {
    const isSomeprice = Object.values(price).some((value) => value);

    if (city && address && count && phone && isSomeprice) {
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
        count: parseInt(count),
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
  }, [city, address, count, phone, price, name, setData, prepayment, paymentLink, houseType, paymentId, description]);

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
    <div className='container-padding'>

      <div className="field-wrapper select-wrapper">
        <label htmlFor="city" className="field-label">{DICTIONARY[lang].city}</label>

        <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
          {CITIES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="field-wrapper select-wrapper">
        <label htmlFor="house-type" className="field-label">Выберите тип жилья</label>

        <select name="house-type" id="house-type" value={houseType} onChange={(e) => setHouseType(e.target.value)} className="select-field">
          {HOUSE_TYPES.map((v) => (
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
        <span className="field-label">Количество домов</span>

        <input type="number" id="count" className="text-field" value={count} onChange={(e) => setCount(e.target.value)} />
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
        <label htmlFor="payment-id" className="field-label">Finik id</label>

        <input type="text" id="payment-id" className="text-field" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
      </div>

      {/* <div className="field-wrapper">
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
      </div> */}

      <div className="field-wrapper">
        <span className="field-label">Цена</span>

        <PriceField label={DICTIONARY[lang].day} name="day" value={price.day} onChange={priceChangeHandler} />
        <PriceField label={DICTIONARY[lang].day_off} name="day_off" value={price.day_off} onChange={priceChangeHandler} />
      </div>

      <div className="field-wrapper">
        <label htmlFor="description" className="field-label">Описание</label>

        <textarea id="description" rows="6" className="text-field" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>

      {/* <button onClick={onSendData}>btn</button> */}
    </div>
  )
}

export default CreateAdvertisement;
