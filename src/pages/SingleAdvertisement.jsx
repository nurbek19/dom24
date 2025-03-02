import { useMemo, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";
import { useSearchParams } from 'react-router-dom';
import { useIMask } from 'react-imask';
import ImageSlider from "../components/ImageSlider";
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';
import HouseItem from '../components/HouseItem';

const SingleAdvertisement = ({ item, lang, onBackHandler }) => {
    const [show, setShow] = useState(false);
    const [showText, setShowText] = useState(false);
    const [selected, setSelected] = useState([]);
    const [searchParams] = useSearchParams();
    const [name, setName] = useState('');
    const [houses, setHouses] = useState([]);
    const byLink = searchParams.get('bylink');

    const {
        ref,
        value: phone,
    } = useIMask({ mask: '+{996}(000)000-000' });

    const callHandler = () => {
        const id = searchParams.get('user_id');
        const { _id, owner_id, phone } = item;

        setShow(true);

        axios.post('https://ainur-khakimov.ru/dom24/houses/call', { house_id: _id, owner_id, phone, caller_id: parseInt(id) });
    }

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
                const booksByHouseNumber = item.books[value];
                acc.push(...booksByHouseNumber);

                return acc;
            }, []);

            const setFromArr = new Set(housesBookedDays);

            return Array.from(setFromArr).map((d) => new Date(d));
        }

        const commonDates = Object.values(item.books);

        if (commonDates.length === 0) {
            return 0;
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
                const disabled = selectedDates.some((d) => item.books[key].includes(d));

                arr.push({ number: key, disabled });
            });

            return arr;
        }

        return Object.keys(item.books).map((v) => ({ number: v, disabled: false }));
    }, [item.books, selected])

    const onSendData = () => {
        const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

        const books = houses.reduce((acc, value) => {
            console.log(acc, value);    

            acc[value] = selectedDates;

            return acc;
        }, {});

        console.log({
            house_id: item._id,
            books,
            contact_phone: phone
        });

        WebApp.sendData(JSON.stringify({
            house_id: item._id,
            books,
            contact_phone: phone
        }));
    }

    useEffect(() => {
        WebApp.onEvent('mainButtonClicked', onSendData);

        return () => {
            WebApp.offEvent('mainButtonClicked', onSendData);
        };
    }, [phone, selected]);

    const isValid = useMemo(() => {
        return phone.length === 16 && selected.length;
    }, [selected, phone]);

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

        setSelected(newSelected);
      };

    return (
        <div className='search-container'>
            <div className="back-button" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>
            <div className={clsx('single-result-card', { 'card-padding': selected.length && houses.length })}>
                <div className="">
                    <div className="single-card">
                        {item.photo_ids && !byLink && (
                            <ImageSlider imageIds={item.photo_ids} />
                        )}
                        <div className="card-detail single-card-detail">
                            {item.name && (<p className={clsx({ 'bold-title': byLink })}>{!byLink && <span>{DICTIONARY[lang].nameLabel}:</span>} {item.name}</p>)}
                            {!byLink && <p><span>{DICTIONARY[lang].city}:</span> {item.city}</p>}
                            {!byLink && <p><span>{DICTIONARY[lang].address}:</span> <a href={`https://2gis.kg/search/${encodeURIComponent(item.city + ' ' + item.address)}`} target='_blank'>{item.address}</a></p>}
                            {/* <p><span>{DICTIONARY[lang].roomCount}:</span> {item.count}</p> */}
                            {!byLink && (
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

                            {/* <div className='card-status'>
                                {item.active ? <div className='free'>{DICTIONARY[lang].free}</div> : <div className='busy'>{DICTIONARY[lang].busy}</div>}
                            </div> */}

                            {!byLink && (
                                show ? (
                                    <div>
    
                                        <div className='phone-number' onClick={copyHandler}>
                                            {item.phone}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                        </div>
    
                                        {showText && (<p className='copy-text'>{DICTIONARY[lang].numberCopied}</p>)}
                                    </div>
                                ) : (
                                    <div className='call-btn' onClick={(e) => callHandler(e, item._id, item.owner_id, item.phone)}>
                                        {DICTIONARY[lang].showNumber}
                                    </div>
                                )
                            )}
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
                        disabled={[{ before: new Date() }, ...bookedDays]}
                        modifiers={{
                            booked: bookedDays
                        }}
                        modifiersClassNames={{
                            booked: "my-booked-class"
                        }}
                    />
                </div>

                <div className='houses-container'>
                <p>Выберите номер дома для бронирования:</p>
                <div className='houses-list'>
                    {housesList.map((obj) => (
                        <HouseItem number={obj.number} disabled={obj.disabled} setHouses={setHouses} />
                    ))}
                </div>
                </div>

                {/* <div className="field-wrapper">
                    <span className="field-label">Имя</span>

                    <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
                </div> */}

                <div className={clsx('field-wrapper phone-field', { 'show-number': selected.length && houses.length })}>
                    <label htmlFor="phone" className="field-label">{DICTIONARY[lang].bookPhone}</label>

                    <input type="tel" pattern="[0-9]*" noValidate id="phone" className="text-field" ref={ref} />
                </div>
            </div>
        </div>
    )
}

export default SingleAdvertisement;