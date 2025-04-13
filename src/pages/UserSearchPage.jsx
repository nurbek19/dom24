import { useState, useEffect, useCallback } from 'react';
import { CITIES, HOUSE_TYPES } from './CreateAdvertisement';
import WebApp from '@twa-dev/sdk';
import '../App.css';
import { useSearchParams } from 'react-router-dom';

import { DICTIONARY } from './CreateAdvertisement';
import SearchResultPage from './SearchResultPage';

import { api } from '../api';

const UserSearchPage = () => {
    const [city, setCity] = useState(CITIES[0]);
    const [houseType, setHouseType] = useState(HOUSE_TYPES[0]);
    // const [rentType, setRentType] = useState(null);
    // const [room, setRoom] = useState(null);
    const [searchParams] = useSearchParams();
    const [lang, setLang] = useState('ru');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [itemIndex, setIndex] = useState(null);
    const [disabled, setIsDisabled] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        WebApp.expand();
    }, []);

    // useEffect(() => {
    //     const language = searchParams.get('lang');

    //     if (language) {
    //         setLang(language);
    //     }

    // }, []);


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
                // const index = Math.floor(Math.random() * 2);
                // console.log(index);

                // setIndex(index);

                // if (res.data.length >= 2) {
                //     const copyObj = { ...res.data[index] };
                //     copyObj.active = !copyObj.active;

                //     res.data[index] = copyObj;
                // }


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
                // const index = Math.floor(Math.random() * 3);
                // setIndex(index);

                // if (res.data.length > 2) {
                //     const copyObj = { ...res.data[index] };
                //     copyObj.active = !copyObj.active;

                //     res.data[index] = copyObj;
                // }


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
            {/* <div>

                <div>
                    <input type="text" className="text-field" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </div>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg>
                </div>
            </div> */}

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

            {/* <div className="field-wrapper">
                <span className="field-label">{DICTIONARY[lang].rentType}</span>

                <div className="rent-type-buttons">
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="day" className="radio-input" checked={rentType === 'day'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">{DICTIONARY[lang].day}</span>
                    </label>
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="night" className="radio-input" checked={rentType === 'night'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">{DICTIONARY[lang].night}</span>
                    </label>
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="day_night" className="radio-input" checked={rentType === 'day_night'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">{DICTIONARY[lang].day_night}</span>
                    </label>
                </div>
            </div> */}
            {/* 
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
            </div> */}

            <button className='search-button' disabled={disabled}
                onClick={navigateHandler}>{DICTIONARY[lang].find}</button>



            <SearchResultPage lang={lang} data={data} loading={loading} isData={isData} />
        </div>
    );
}

export default UserSearchPage;