import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { DayPicker } from "react-day-picker";
import { format, isAfter, sub } from "date-fns";
import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";
import { useSearchParams } from 'react-router-dom';
import ImageSlider from "../components/ImageSlider";
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';
import HouseItem from '../components/HouseItem';
import logo from '../images/booklink.png';
import gis from '../images/2gis.png';
import noPartner from '../images/icon-no-partner.svg';
import checkIcon from '../images/check-icon.png';

import { BottomDrawer } from './BottomDrawer';
import { ExpandableText } from './ExpandableText';
import { api } from '../api';

const SingleAdvertisement = ({ item, lang, onBackHandler, hideButton }) => {
    const [show, setShow] = useState(false);
    const [showText, setShowText] = useState(false);
    const [selected, setSelected] = useState([]);
    const [searchParams] = useSearchParams();
    const [name, setName] = useState('');
    const [houses, setHouses] = useState([]);
    const byLink = searchParams.get('bylink');
    const [phone, setPhone] = useState('');
    const [open, setOpen] = useState(false);
    const [showPhoto, setShowPhoto] = useState(false);
    const [showExtraInfo, setExtraInfo] = useState(false);

    const copyHandler = () => {
        navigator.clipboard.writeText(item.phone);
        setShowText(true);
    }

    const bookedDays = useMemo(() => {
        if (!item.books) {
            return [];
        }

        if (houses.length) {
            const housesBookedDays = houses.reduce((acc, value) => {
                const booksByHouseNumber = item.books[value].map((entity) => entity.book_date);
                acc.push(...booksByHouseNumber);

                return acc;
            }, []);

            const setFromArr = new Set(housesBookedDays);

            return Array.from(setFromArr).map((d) => new Date(d));
        }


        const commonDates = Object.values(item.books).map((arr) => (arr.map((el) => el.book_date)));

        if (commonDates.length === 0) {
            return [];
        }

        return commonDates.reduce((acc, arr) => acc.filter(el => arr.includes(el))).map(date => new Date(date));

    }, [item.books, houses]);


    const housesList = useMemo(() => {
        if (!item.books) {
            return [];
        }

        if (selected.length) {
            const arr = [];
            const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

            Object.keys(item.books).forEach((key) => {
                const disabled = selectedDates.some((d) => item.books[key].map((obj) => (obj.book_date)).includes(d));

                arr.push({ number: key, disabled });
            });

            return arr;
        }

        return Object.keys(item.books).map((v) => ({ number: v, disabled: false }));
    }, [item.books, selected])

    const onSendData = () => {
        const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

        const books = houses.reduce((acc, value) => {
            acc[value] = selectedDates;

            return acc;
        }, {});

        console.log({
            house_id: item._id,
            books,
            comment: `${name} ${phone}`
        });

        WebApp.sendData(JSON.stringify({
            house_id: item._id,
            books,
            comment: `${name} ${phone}`
        }));
    }

    useEffect(() => {
        if (item.count === 1) {
            setHouses([1]);
        }
    }, [])

    useEffect(() => {
        WebApp.onEvent('mainButtonClicked', onSendData);

        return () => {
            WebApp.offEvent('mainButtonClicked', onSendData);
        };
    }, [phone, selected]);

    const isValid = useMemo(() => {
        return phone.length && selected.length && name;
    }, [selected, phone, name]);

    useEffect(() => {
        WebApp.MainButton.text = DICTIONARY[lang].book;

        if (isValid) {
            WebApp.MainButton.show();

        } else {
            WebApp.MainButton.hide();
        }

        return () => {
            WebApp.MainButton.hide();
        };
    }, [isValid]);

    const handleSelect = (newSelected) => {
        if (!item.mbank_link && !item.finik_account_id && item.owner_id !== 5592038531) {
            setOpen(true);
        }

        setSelected(newSelected);
    };

    const buttonClickHandler = () => {
        const chat_id = searchParams.get('chat_id');

        api.post('/click', { 'house_id': item._id, chat_id: parseInt(chat_id) });
    }

    useEffect(() => {
        if (showPhoto) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'relative';
        } else {
          document.body.style.overflow = 'unset';
          document.body.style.position = 'static';
        }
    
      }, [showPhoto])

    return (
        <div className='search-container'>
            {!hideButton && (<div className="back-button" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>)}
            <div className={clsx('single-result-card', { 'card-padding': selected.length && houses.length })}>
                <div className="">
                    <div className="single-card">
                        {item.photo_ids && !byLink && (
                            <ImageSlider imageIds={item.photo_ids} />
                        )}
                        <div className="card-detail single-card-detail">
                            {item.house_type && (
                                <div className='house-type'>
                                    {item.house_type}
                                </div>
                            )}

                            {<p className="bold-title">
                                {item.name}

                                {/* {(item.mbank_link || item.finik_account_id || item.owner_id === 5592038531) && (
                                    <img src={checkIcon} alt="check icon" />
                                )} */}
                            </p>}
                            {!byLink && <p><span>{DICTIONARY[lang].city}:</span> {item.city}</p>}
                            {!byLink && <p className='address-link-wrapper'><span>{DICTIONARY[lang].address}: </span>
                                <a className='address-link' href={`https://2gis.kg/search/${encodeURIComponent(item.city + ' ' + item.address)}`} target='_blank'>
                                    {item.address}
                                    <img src={gis} alt="2 gis icon" />
                                </a></p>}
                            {/* <p><span>{DICTIONARY[lang].roomCount}:</span> {item.count}</p> */}

                            {(!byLink && !item.mbank_link) || (!byLink && !item.finik_account_id) && (
                                <div className="card-prices single-card-prices">
                                    {Object.entries(item.price).map(([key, value]) => {
                                        if (!value) {
                                            return null;
                                        }

                                        return (
                                            <div key={key}>{DICTIONARY[lang][key]} <br /> {value}</div>
                                        );
                                    })}
                                </div>
                            )}

                            {!byLink && item.description && (
                                <p className='advertisement-description'><span>Описание:</span> <br />
                                    <ExpandableText>
                                        {item.description}
                                    </ExpandableText>

                                </p>
                            )}

                            {/* {!byLink && (
                                show ? (
                                    <div>

                                        <div className='phone-number' onClick={copyHandler}>
                                            {item.phone}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                        </div>

                                        {showText && (<p className='copy-text'>{DICTIONARY[lang].numberCopied}</p>)}
                                    </div>
                                ) : (
                                    <div className='call-btn'>
                                        {DICTIONARY[lang].showNumber}
                                    </div>
                                )
                            )} */}
                        </div>
                    </div>
                </div>

                <div className='book-calendar'>
                    <p>{DICTIONARY[lang].bookLabel}:</p>
                    <DayPicker
                        locale={ru}
                        mode="multiple"
                        selected={selected}
                        onSelect={handleSelect}
                        disabled={[{ before: new Date() }, ...bookedDays.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))]}
                        modifiers={{
                            booked: bookedDays.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))
                        }}
                        modifiersClassNames={{
                            booked: "my-booked-class"
                        }}
                    />
                </div>

                {((housesList.length !== 1 && item.mbank_link) || (housesList.length !== 1 && item.finik_account_id) || item.owner_id === 5592038531) && (
                    <div className='houses-container'>
                        <p>Выберите номер дома для бронирования:</p>
                        <div className='houses-list'>
                            {housesList.map((obj) => (
                                <HouseItem key={obj.number} number={obj.number} disabled={obj.disabled} setHouses={setHouses} />
                            ))}
                        </div>
                    </div>
                )}

                {item.description && (
                    <p className='extra-info-button' onClick={() => setExtraInfo(true)}>
                        Пожалуйста ознакомтесь с описанием домов
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
                    </p>
                ) }

                <div className={clsx('field-wrapper hide-name-field', { 'show-name-field': selected.length && houses.length })}>
                    <label htmlFor="name" className="field-label">Введите ваше имя</label>

                    <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className={clsx('field-wrapper phone-field', { 'show-number': selected.length && houses.length })}>
                    <label htmlFor="phone" className="field-label">{DICTIONARY[lang].bookPhone}</label>

                    <input
                        type="tel"
                        pattern="[0-9]*"
                        noValidate id="phone"
                        className="text-field"
                        placeholder="0555 555 555"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10} />
                </div>


                {item.map_photo && (
                    <button className='edit-data-button' onClick={() => setShowPhoto(true)}>Посмотреть расположение домов</button>
                )}

                {/* <button onClick={onSendData}>btn</button> */}
            </div>

            {showPhoto && (
                <div className='note-modal partner-page-modal' onClick={() => setShowPhoto(false)}>
                    <img src={`https://booklink.pro/bl/houses/photo?id=${item.map_photo}`} onClick={(e) => e.stopPropagation()} alt="company" />
                </div>
            )}

            <BottomDrawer isOpen={showExtraInfo} onClose={() => setExtraInfo(false)} handleSelect={() => {}}>
                <div className='extra-description-text'>
                    {item.description && (
                        item.description
                    )}
                </div>
            </BottomDrawer>


            <BottomDrawer isOpen={open} onClose={() => setOpen(false)} handleSelect={handleSelect}>
                <div className='not-partner'>
                    <img src={noPartner} alt="no partner" />
                    <h4>Спасибо за ваш интерес!</h4>

                    <p>На данный момент этот объект еще не зарегистрирован в нашей системе, поэтому забронировать его через Booklink, к сожалению, не получится.</p>
                    <p>Рекомендуем связаться с представителями объекта напрямую. Надеемся, что в ближайшее время он станет доступен на нашем сервисе.</p>

                    <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Здравствуйте! Мы нашли вас через сервис https://booklink.pro/ . Можем уточнить информацию о свободных датах? Хотим забронировать.')}`} className='whatsapp-btn' onClick={buttonClickHandler}>
                        Написать в WhatsApp
                    </a>

                    <p className='check-text'>Хотим напомнить, что данный объект не проходил проверку на нашей платформе. Поэтому рекомендуем воздержаться от предоплаты до тех пор, пока вы не убедитесь в его надежности и достоверности.</p>
                </div>
            </BottomDrawer>

            <div className="footer">
                <p>Хотите такой же календарь для бронирования? 👇</p>
                <a href="https://booklink.pro/" target="_blank">
                    <img src={logo} alt="logotype" />
                </a>
            </div>
        </div>
    )
}

export default SingleAdvertisement;