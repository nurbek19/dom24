
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useLocation } from 'react-router-dom';

import { emojiObj } from './OwnerAdvertisementsList';
import ImageSlider from "../components/ImageSlider";
import SingleAdvertisement from './SingleAdvertisement';


const SearchResultPage = () => {
    const [data, setData] = useState([]);
    const { state } = useLocation();
    const [activeDoc, setActiveDoc] = useState(null);

    useEffect(() => {
        const { city, rent_type, room_count, chat_id } = state;

        axios.get(`https://ainur-khakimov.ru/dom24/houses?city=${city}&rent_type=${rent_type}&room_count=${room_count}&chat_id=${chat_id}`).then((res) => {
            if (res.data) {
                setData(res.data);

                console.log(res.data);
            }
        })
    }, [])

    const callHandler = (e, _id, owner_id, phone) => {
        e.stopPropagation();

        const { chat_id } = state;

        axios.put('https://ainur-khakimov.ru/dom24/houses/call', { _id, owner_id, phone, caller_id: chat_id })
    }

    return (
        <div>
            {activeDoc ? (
                <div className="edit-modal">
                    <SingleAdvertisement item={activeDoc} onBackHandler={() => setActiveDoc(null)} />
                </div>
            ) : (
                <div>
                {data.map((item) => (
                    <div key={item._id} className="card-container" onClick={() => setActiveDoc(item)}>
                        <div className="card">
                            {item.photo_ids && (
                                <ImageSlider imageIds={item.photo_ids} />
                            )}
                            <div className="card-detail">
                                <p><span>📍</span> {item.city}, {item.address}</p>
                                <div className="card-actions-wrapper">
                                    <div className="card-actions">
                                        <div onClick={(e) => callHandler(e, item._id, item.owner_id, item.phone)}>
                                        <a href={`tel:${item.phone}`} className='phone-link'>📞</a>
                                        </div>
                                    </div>

                                    <p><span>Кол-во комнат:</span> {item.room_count}</p>
                                    {/* <p><span>📞</span> {item.phone}</p> */}

                                    <div className="card-prices">
                                        {Object.entries(item.price).map(([key, value]) => (
                                            <div key={key}>{emojiObj[key]}: {value}</div>
                                        ))}
                                    </div>

                                    <div className='card-status'>
                                        {item.active ? <div className='free'>свободно</div> : <div className='busy'>занято</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default SearchResultPage;