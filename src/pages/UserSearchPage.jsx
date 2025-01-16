import { useState, useEffect } from 'react';
import { CITIES } from './CreateAdvertisement';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import '../App.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UserSearchPage = () => {
    const [city, setCity] = useState(CITIES[0]);
    const [rentType, setRentType] = useState(null);
    const [room, setRoom] = useState(null);
    const [info, setInfo] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        WebApp.expand();
      }, []);

    const navigateHandler = () => {
        const id = searchParams.get('user_id');    

        axios.get(`https://ainur-khakimov.ru/dom24/houses?city=${city}&rent_type=${rentType}&room_count=${room}&chat_id=${id}`).then((res) => {
            if (res.data) {
                navigate('/dom24/search/result', { state: { city, rent_type: rentType, room_count: room, chat_id: id } });
            } else {
                setInfo(true)
            }
        })
    }

    useEffect(() => {
        setInfo(false);
    }, [city, room, rentType])

    return (
        <div>
            <div className="field-wrapper select-wrapper">
                <label htmlFor="city" className="field-label">Город</label>

                <select name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
                    {CITIES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>

            <div className="field-wrapper">
                <span className="field-label">Тип аренды</span>

                <div className="rent-type-buttons">
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="hour" className="radio-input" checked={rentType === 'hour'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">Час</span>
                    </label>
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="day" className="radio-input" checked={rentType === 'day'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">День</span>
                    </label>
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="night" className="radio-input" checked={rentType === 'night'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">Ночь</span>
                    </label>
                    <label className="radio-input-label">
                        <input type="radio" name="rentType" value="day_night" className="radio-input" checked={rentType === 'day_night'} onChange={(e) => setRentType(e.target.value)} />
                        <span className="radio-input-text">Сутки</span>
                    </label>
                </div>
            </div>

            <div className="field-wrapper">
                <span className="field-label">Количество комнат</span>

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

            {city && rentType && room && <button className='search-button'
                onClick={navigateHandler}>Найти</button>}

                {info && <p className='info-text'>Нету подходящих квартир с текущими параметрами. Попробуйте другие параметры.</p>}
        </div>
    );
}

export default UserSearchPage;