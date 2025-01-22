import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { emojiObj } from './OwnerAdvertisementsList';
import ImageSlider from "../components/ImageSlider";
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';

const SingleAdvertisement = ({ item, lang, onBackHandler }) => {
    const [show, setShow] = useState(false);
    const [showText, setShowText] = useState(false);
    const { state } = useLocation();

    const callHandler = () => {
        const { chat_id } = state;
        const { _id, owner_id, phone } = item;

        setShow(true);

        axios.post('https://ainur-khakimov.ru/dom24/houses/call', { _id, owner_id, phone, caller_id: parseInt(chat_id) });
    }

    const copyHandler = () => {
        navigator.clipboard.writeText(item.phone);
        setShowText(true);
    }


    return (
        <div className='search-container'>
            <div className="back-button" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>
            <div className='single-result-card'>
                <div className="">
                    <div className="single-card">
                        {item.photo_ids && (
                            <ImageSlider imageIds={item.photo_ids} />
                        )}
                        <div className="card-detail single-card-detail">
                            {item.name && (<p><span>{DICTIONARY[lang].nameLabel}:</span> {item.name}</p>)}
                            <p><span>{DICTIONARY[lang].city}:</span> {item.city}</p>
                            <p><span>{DICTIONARY[lang].address}:</span> <a href={`https://2gis.kg/search/${encodeURIComponent(item.city + ' ' + item.address)}`} target='_blank'>{item.address}</a></p>
                            <p><span>{DICTIONARY[lang].roomCount}:</span> {item.room_count}</p>
                            <div className="card-prices single-card-prices">
                                {Object.entries(item.price).map(([key, value]) => (
                                    <div key={key}>{DICTIONARY[lang][key]} <br /> {value}</div>
                                ))}
                            </div>

                            <div className='card-status'>
                                {item.active ? <div className='free'>{DICTIONARY[lang].free}</div> : <div className='busy'>{DICTIONARY[lang].busy}</div>}
                            </div>

                            {show ? (
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleAdvertisement;