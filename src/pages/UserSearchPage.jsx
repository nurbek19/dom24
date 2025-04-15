import { useState, useEffect, useCallback } from 'react';
import { CITIES, HOUSE_TYPES } from './CreateAdvertisement';
import WebApp from '@twa-dev/sdk';
import '../App.css';
import { useSearchParams } from 'react-router-dom';

import { DICTIONARY } from './CreateAdvertisement';
import SearchResultPage from './SearchResultPage';

import { api } from '../api';

import icon1 from '../images/1.svg';
import icon2 from '../images/2.svg';
import icon3 from '../images/3.svg';
import icon4 from '../images/4.svg';

export const HOUSE_ICONS = {
    'А - фрейм': icon1,
    'Глемпинг': icon2,
    'Коттедж': icon3,
    'Гостевой дом': icon4,
    'Юрта': icon4,
};

const UserSearchPage = () => {
    const [city, setCity] = useState(CITIES[0]);
    const [houseType, setHouseType] = useState('');
    const [searchParams] = useSearchParams();
    const [lang, setLang] = useState('ru');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [disabled, setIsDisabled] = useState(false);

    useEffect(() => {
        WebApp.expand();
    }, []);


    useEffect(() => {
        if (disabled) {
            setIsDisabled(false);
        }
    }, [city, houseType]);


    useEffect(() => {
        console.log('i fire once');
        const id = searchParams.get('user_id');
        // setLoading(true);

        api.get(`/houses?city=${city}&chat_id=${id}`).then((res) => {
            if (res.data) {
                setData(res.data);
            } else {
                setData([]);
            }
        }).catch((err) => {
        })
    }, []);

    const navigateHandler = useCallback(() => {
        const id = searchParams.get('user_id');

        setLoading(true);
        setIsDisabled(true);
        // setIndex(null);

        api.get(`/houses?city=${city}&house_type${houseType}&chat_id=${id}`).then((res) => {
            if (res.data) {
                setLoading(false);
                setData(res.data);
                setIsData(false);
            } else {
                setData([]);
                setIsData(true);
                setLoading(false);
            }
        }).catch((err) => {
            console.log(err);
        }).finally((err) => {
            setLoading(false);
        })
    }, [city, houseType]);


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
                <span className="field-label">Выберите тип жилья:</span>

                <div className="house-type-buttons">
                    <label className="radio-input-label">
                        <input type="radio" name="houseType" value="" className="radio-input" checked={houseType === ''} onChange={(e) => setHouseType(e.target.value)} />
                        <span className="radio-input-text">Все</span>
                    </label>

                    {HOUSE_TYPES.map((type) => (
                        <label className="radio-input-label" key={type}>
                            <input type="radio" name="houseType" value={type} className="radio-input" checked={houseType === type} onChange={(e) => setHouseType(e.target.value)} />
                            
                            <span className="radio-input-text">
                            <img src={HOUSE_ICONS[type]} alt="type icon" />
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <button className='search-button' disabled={disabled}
                onClick={navigateHandler}>{DICTIONARY[lang].find}</button>



            <SearchResultPage lang={lang} data={data} loading={loading} isData={isData} />
        </div>
    );
}

export default UserSearchPage;