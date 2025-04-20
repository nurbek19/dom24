import { useState, useEffect } from 'react';
import { CITIES, HOUSE_TYPES } from './CreateAdvertisement';
import WebApp from '@twa-dev/sdk';

import { DICTIONARY } from './CreateAdvertisement';
import SearchResultPage from './SearchResultPage';

import { api } from '../api';

import '../App.css';

const UserSearchPage = () => {
    const [city, setCity] = useState('all');
    const [houseType, setHouseType] = useState('all');
    const [lang, setLang] = useState('ru');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isData, setIsData] = useState(false);

    useEffect(() => {
        WebApp.expand();
    }, []);

    useEffect(() => {
        setLoading(true);

        api.get(`/houses?city=${encodeURIComponent(city)}&house_type=${encodeURIComponent(houseType)}`).then((res) => {
            if (res.data) {
                setData(res.data);
                setIsData(false);
            } else {
                setData([]);
                setIsData(true);
                setLoading(false);
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        })
    }, [city, houseType]);


    return (
        <div className='search-page'>
            <div className="field-wrapper select-wrapper">
                <label htmlFor="city" className="field-label">{DICTIONARY[lang].city}</label>

                <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
                    <option value="all">Все города</option>

                    {CITIES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>

            <div className="field-wrapper">
                <span className="field-label">Выберите тип жилья:</span>

                <div className="house-type-buttons">
                    <label className="radio-input-label">
                        <input type="radio" name="houseType" value="all" className="radio-input" checked={houseType === 'all'} onChange={(e) => setHouseType(e.target.value)} />
                        <span className="radio-input-text">Все</span>
                    </label>

                    {HOUSE_TYPES.map((type) => (
                        <label className="radio-input-label" key={type}>
                            <input type="radio" name="houseType" value={type} className="radio-input" checked={houseType === type} onChange={(e) => setHouseType(e.target.value)} />

                            <span className="radio-input-text">
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <SearchResultPage lang={lang} data={data} loading={loading} isData={isData} />
        </div>
    );
}

export default UserSearchPage;