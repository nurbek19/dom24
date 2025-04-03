import { useEffect, useState, useCallback, useMemo } from "react";
import WebApp from '@twa-dev/sdk';
import { useSearchParams, useParams } from "react-router-dom";

import ImageSlider from "../components/ImageSlider";
import { api } from "../api";

import '../App.css';
import EditAdvertisement from "./EditAdvertisement";

import { DICTIONARY } from "./CreateAdvertisement";

export const emojiObj = {
    hour: 'Час',
    day: 'День',
    night: 'Ночь',
    day_night: 'Сутки'
};


function OwnerAdvertisementsList() {

    const [data, setData] = useState([]);
    const [docStatuses, setDocStatus] = useState({});
    const [editDoc, setEditDoc] = useState(null);

    const [payload, setPayload] = useState(null);
    const [lang, setLang] = useState('ru');

    const [searchParams] = useSearchParams();

    const fetchData = () => {
        const id = searchParams.get('owner_id');

        api.get(`/houses?owner_id=${id}`).then((res) => {
            if (res.data) {
                setData(res.data);

                const statuses = res.data.reduce((acc, item) => {
                    acc[item._id] = item.active;

                    return acc;
                }, {});

                setDocStatus(statuses);

                console.log(res.data);
            }
        })
    }


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
        fetchData();
    }, []);


    const statusChangeHandler = (e, docId) => {
        const copy = { ...docStatuses };
        copy[docId] = e.target.checked;

        setDocStatus(copy);
    }

    // const onSendData = () => {
    //     const changedDocs = [];

    //     data.forEach((item) => {
    //         if ((item.active !== docStatuses[item._id])) {
    //             changedDocs.push({ _id: item._id, active: docStatuses[item._id] })
    //         }
    //     });

    //     console.log(...changedDocs);

    //     WebApp.sendData(JSON.stringify(changedDocs));
    // }

    // const hasChanged = useMemo(() => {
    //     const valid = data.some((item) => item.active !== docStatuses[item._id]);

    //     return valid;

    // }, [docStatuses, data])

    // useEffect(() => {
    //     const valid = data.some((item) => item.active !== docStatuses[item._id]);

    //     if (valid) {
    //         const changedDocs = [];

    //         data.forEach((item) => {
    //             if ((item.active !== docStatuses[item._id])) {
    //                 changedDocs.push({ _id: item._id, active: docStatuses[item._id] })
    //             }
    //         });

    //         setPayload(changedDocs);
    //         WebApp.onEvent('mainButtonClicked', onSendData);
    //     } else {
    //         setPayload(null);
    //     }

    //     return () => {
    //         WebApp.offEvent('mainButtonClicked', onSendData);
    //     };
    // }, [docStatuses, data])

    // useEffect(() => {
    //     WebApp.MainButton.text = 'Обновить статусы';
    //     // WebApp.onEvent('mainButtonClicked', onSendData);

    //     if (hasChanged) {
    //         WebApp.MainButton.show();

    //     } else {
    //         WebApp.MainButton.hide();
    //     }

    //     return () => {
    //         WebApp.MainButton.hide();
    //         // WebApp.offEvent('mainButtonClicked', onSendData);
    //     };
    // }, [hasChanged]);

    return (
        <div>
            {editDoc ? (
                // <div className="edit-modal">
                    <EditAdvertisement doc={editDoc} lang={lang} onBackHandler={() => setEditDoc(null)} />
                // </div>
            ) : (
                <div>
                    {data.map((item) => (
                        <div key={item._id} className="card-container" onClick={() => setEditDoc(item)}>
                            <div className="card">
                                {item.photo_ids && (
                                    <ImageSlider imageIds={item.photo_ids} />
                                )}
                                <div className="card-detail">
                                    {item.name && (<p><span>{item.name}</span></p>)}
                                    <p><span>📍</span> {item.city}, {item.address}</p>
                                    <div className="card-actions-wrapper">
                                        <div className="card-actions">
                                            {/* <label className="switch">
                                                <input type="checkbox" checked={docStatuses[item._id]} onChange={(e) => statusChangeHandler(e, item._id)} />
                                                <span className="slider round"></span>
                                            </label> */}

                                            {/* <div className="edit-button" onClick={() => setEditDoc(item)}>
                                                <svg className="feather feather-edit"
                                                    fill="none"
                                                    height="24"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    width="24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </div> */}
                                        </div>

                                        {/* <p><span>{DICTIONARY[lang].shortRoomCount}:</span> {item.room_count}</p> */}
                                        <p><span>📞</span> {item.phone}</p>

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
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OwnerAdvertisementsList;