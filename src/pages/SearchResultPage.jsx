
import { useState } from 'react';
import '../App.css';

import SingleAdvertisement from './SingleAdvertisement';

import notFoundImage from '../images/image.png';

import { DICTIONARY } from './CreateAdvertisement';
import checkIcon from '../images/check-icon.png';

const SearchResultPage = ({ lang, data = [], loading, isData, itemIndex }) => {
    const [activeDoc, setActiveDoc] = useState(null);
    // const [objIndex, setIndex] = useState(null);

    // useEffect(() => {
    //     let timeoutId;

    //     if (itemIndex !== null) {
    //         timeoutId = setTimeout(() => {
    //             setIndex(itemIndex);
    //         }, 2500);
    //     } else {
    //         clearTimeout(timeoutId);
    //         setIndex(null);
    //     }

    //     return () => clearTimeout(timeoutId);
    // }, [itemIndex]);

    if (loading) {
        return (
            <div className='loading-container'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="40" cy="65">
                        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                    </circle>
                    <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle>
                    <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle>
                </svg>
            </div>
        )
    }

    if (isData) {
        return (
            <div className='not-found-container'>
                <div className="not-found-info">
                    <img src={notFoundImage} alt="not found" />
                    <p className='info-text'>{DICTIONARY[lang].notFound}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='search-result'>
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
                                    <div className='card-single-image-container'>
                                        {/* <ImageSlider imageIds={item.photo_ids} /> */}

                                        <img key={item.photo_ids[0]} src={`https://booklink.pro/bl/houses/photo?id=${item.photo_ids[0]}`} alt="house image" />
                                    </div>
                                )}
                                <div className="card-detail">
                                    {item.house_type && (
                                        <div className='house-type'>
                                            {/* <img src={HOUSE_ICONS[item.house_type]} alt="house type icon" /> */}
                                            {item.house_type}
                                        </div>
                                    )}

                                    <div className='house-detail'>
                                        <p className='house-name'>
                                            <span>{item.name}</span>
                                            {(item.mbank_link || item.finik_account_id) && (
                                                <img src={checkIcon} alt="check icon" />
                                            )}
                                        </p>
                                        <div>{item.city}</div>
                                    </div>

                                    <button className='search-button'>Забронировать</button>

                                    {/* <p>
                                        <a href={`https://2gis.kg/search/${encodeURIComponent(item.city + ' ' + item.address)}`} target='_blank'><span>📍</span> {item.city}, {item.address}</a>
                                    </p> */}
                                    {/* <p><span>{DICTIONARY[lang].shortRoomCount}:</span> {item.count}</p> */}
                                    {/* <p><span>📞</span> {item.phone}</p> */}

                                    {/* <div className="card-prices">
                                        {Object.entries(item.price).map(([key, value]) => {
                                            if (!value) {
                                                return null;
                                            }

                                            return (
                                                <div key={key}>{DICTIONARY[lang][key]} {value}</div>
                                            );
                                        })}
                                    </div> */}
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