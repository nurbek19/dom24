import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CITIES } from './CreateAdvertisement';
import WebApp from '@twa-dev/sdk';
import '../App.css';
import { useSearchParams } from 'react-router-dom';

import { DICTIONARY } from './CreateAdvertisement';
import SearchResultPage from './SearchResultPage';

// import logo from '../images/logo.svg';

const UserSearchPage = () => {
    const [city, setCity] = useState(CITIES[0]);
    const [rentType, setRentType] = useState(null);
    const [room, setRoom] = useState(null);
    const [searchParams] = useSearchParams();
    const [lang, setLang] = useState('ru');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [itemIndex, setIndex] = useState(null);
    const [disabled, setIsDisabled] = useState(false);

    useEffect(() => {
        WebApp.expand();
      }, []);

      useEffect(() => {
        const language = searchParams.get('lang');
    
        if (language) {
          setLang(language);
        }
        
      }, []);


      useEffect(() => {
        if (disabled) {
            setIsDisabled(false);
        }
      }, [city, rentType, room]);

    const navigateHandler = useCallback(() => {
        const id = searchParams.get('user_id');
        
        setLoading(true);
        setIsDisabled(true);

        axios.get(`https://ainur-khakimov.ru/dom24/houses?city=${city}&rent_type=${rentType}&room_count=${room}&chat_id=${id}`).then((res) => {
            if (res.data) {
                console.log(res.data);
                const index = Math.floor(Math.random() * 3);
                setIndex(index);

                if (res.data.length > 2) {
                    const copyObj = { ...res.data[index] };
                    copyObj.active = !copyObj.active;

                    console.log(copyObj);

                    res.data[index] = copyObj;
                }


                setLoading(false);
                setData(res.data);
                setIsData(false);

                console.log(res.data);
            } else {
                setData([]);
                setIsData(true);
                setLoading(false);
            }
        })
    }, [city, rentType, room]);


    return (
        <div>
            {/* <div className="logo-container">
                <img src={logo} alt="logotype" />
            </div> */}

            <div className="field-wrapper select-wrapper">
                <label htmlFor="city" className="field-label">{DICTIONARY[lang].city}</label>

                <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
                    {CITIES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>

            <div className="field-wrapper">
                <span className="field-label">{DICTIONARY[lang].rentType}</span>

                <div className="rent-type-buttons">
                    {/* <label className="radio-input-label">
                        <input type="radio" name="rentType" value="hour" className="radio-input" checked={rentType === 'hour'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">{DICTIONARY[lang].hour}</span>
                    </label> */}
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

            <button className='search-button' disabled={disabled}
                onClick={navigateHandler}>{DICTIONARY[lang].find}</button>



            <SearchResultPage lang={lang} data={data} loading={loading} isData={isData} itemIndex={itemIndex} />
        </div>
    );
}

export default UserSearchPage;