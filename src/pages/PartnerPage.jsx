import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import ImageSlider from "../components/ImageSlider";
import SingleAdvertisement from './SingleAdvertisement';
// import RecentDays from "../components/RecentDays";

import { api } from "../api";
import { DICTIONARY } from './CreateAdvertisement';


import '../App.css';

const PartnerPage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [lang, setLang] = useState('ru');


    const fetchData = () => {
        const id = searchParams.get('owner_id');

        api.get(`/houses?owner_id=${id}`).then((res) => {
            if (res.data) {
                setData(res.data);

                if (res.data.length === 1) {
                    setActiveDoc(res.data[0])
                }
 
                console.log(res.data);
            }
        })
    };

    useEffect(() => {
        WebApp.expand();
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
                    <SingleAdvertisement item={activeDoc} lang={lang} onBackHandler={() => setActiveDoc(null)} hideButton={data.length === 1} />
                </div>
            ) : (
                <div className='card-list'>
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
                                    {/* <p><span>{DICTIONARY[lang].shortRoomCount}:</span> {item.count}</p> */}
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