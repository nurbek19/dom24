import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import ImageSlider from "../components/ImageSlider";
import SingleAdvertisement from './SingleAdvertisement';
import RecentDays from "../components/RecentDays";
import { DICTIONARY } from './CreateAdvertisement';

import '../App.css';

const PartnerPage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [lang, setLang] = useState('ru');


    const fetchData = () => {
        const id = searchParams.get('owner_id');

        axios.get(`https://ainur-khakimov.ru/dom24/houses?owner_id=${id}`).then((res) => {
            if (res.data) {
                setData(res.data);

                console.log(res.data);
            }
        })
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const language = searchParams.get('lang');
    
        if (language) {
          setLang(language);
        }
        
      }, []);

    return (
        <div>
            {activeDoc ? (
                <div className="edit-modal">
                    <SingleAdvertisement item={activeDoc} lang={lang} onBackHandler={() => setActiveDoc(null)} />
                </div>
            ) : (
                <div className='card-list'>
                    {data.map((item, index) => (
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
                                        <p><span>Ближайшие свободные даты:</span></p>
                                        <RecentDays books={item.books} />
                                        {/* {(objIndex !== null && index === objIndex) ? (
                                            <div className={clsx(!item.active ? 'free' : 'busy', { 'animation': index === objIndex })}>
                                                {!item.active ? DICTIONARY[lang].free : DICTIONARY[lang].busy}
                                            </div>
                                        ) : (
                                            item.active ?
                                                <div className={clsx('free')}>{DICTIONARY[lang].free}</div>
                                                : <div className={clsx('busy')}>{DICTIONARY[lang].busy}</div>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};

export default PartnerPage;