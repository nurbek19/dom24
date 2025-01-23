
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useLocation, useNavigate } from 'react-router-dom';

import ImageSlider from "../components/ImageSlider";
import SingleAdvertisement from './SingleAdvertisement';

import notFoundImage from '../images/image.png';

import { DICTIONARY } from './CreateAdvertisement';


const SearchResultPage = () => {
    const [data, setData] = useState([]);
    const { state } = useLocation();
    const [activeDoc, setActiveDoc] = useState(null);
    const [info, setInfo] = useState(false);
    const [lang, setLang] = useState('ru');

    const navigate = useNavigate();


    useEffect(() => {
        const { lang } = state;
    
        if (lang) {
          setLang(lang);
        }
        
      }, []);

    useEffect(() => {
        const { city, rent_type, room_count, chat_id } = state;

        axios.get(`https://ainur-khakimov.ru/dom24/houses?city=${city}&rent_type=${rent_type}&room_count=${room_count}&chat_id=${chat_id}`).then((res) => {
            if (res.data) {
                setData(res.data);
                setInfo(false);

                console.log(res.data);
            } else {
                setInfo(true);
            }
        })
    }, [])

    if (info) {
        return (
            <div className='not-found-container'>
                <div className="back-button" onClick={() => navigate(-1)}>« {DICTIONARY[lang].back}</div>


                <div className="not-found-info">
                    <img src={notFoundImage} alt="not found" />
                <p className='info-text'>{DICTIONARY[lang].notFound}</p>
                </div>
            </div>
        )
    }

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         const index = Math.floor(Math.random() * 3);
            
    //         const dataCopy = [...data];
    //         console.log(dataCopy[index], index);

    //         if (dataCopy[index]) {
    //             const copyObj = { ...dataCopy[index] }
    //             copyObj.active = !copyObj.active;

    //             dataCopy[index] = copyObj;

    //             console.log(copyObj, index);
                
    //             setData(dataCopy);
    //         }


    //       }, 5000);
      
    //       return () => clearTimeout(timeoutId);
    // }, []);

    return (
        <div>
            <div className="back-button" onClick={() => navigate(-1)}>« {DICTIONARY[lang].back}</div>

            {activeDoc ? (
                <div className="edit-modal">
                    <SingleAdvertisement item={activeDoc} lang={lang} onBackHandler={() => setActiveDoc(null)} />
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
                                {item.name && (<p><span>{item.name}</span></p>)}
                                <p>
                                    <a href={`https://2gis.kg/search/${encodeURIComponent(item.city + ' ' + item.address)}`} target='_blank'><span>📍</span> {item.city}, {item.address}</a>
                                </p>
                                <p><span>{DICTIONARY[lang].shortRoomCount}:</span> {item.room_count}</p>
                                    {/* <p><span>📞</span> {item.phone}</p> */}

                                    <div className="card-prices">
                                        {Object.entries(item.price).map(([key, value]) => {
                                            if (!value) {
                                                return null;
                                            }

                                            return (
                                                <div key={key}>{DICTIONARY[lang][key]} {value}</div>
                                            );
                                        })}
                                    </div>

                                    <div className='card-status'>
                                        {item.active ? <div className='free'>{DICTIONARY[lang].free}</div> : <div className='busy'>{DICTIONARY[lang].busy}</div>}
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