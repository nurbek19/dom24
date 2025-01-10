import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import WebApp from '@twa-dev/sdk';
import { useSearchParams, useParams } from "react-router-dom";

import ImageSlider from "../components/ImageSlider";

import '../App.css';

const emojiObj = {
    hour: '🕘',
    day: '🌞',
    night: '🌙',
    day_night: '🌞🌙'
};


function OwnerAdvertisementsList() {

    const [data, setData] = useState([]);
    const [docStatuses, setDocStatus] = useState({});
    const [payload, setPayload] = useState(null);

    const [searchParams] = useSearchParams();
    // const { owner_id } = useParams();


    useEffect(() => {
        WebApp.expand();
      }, []);

    useEffect(() => {
        const id = searchParams.get('owner_id');
        axios.get(`https://ainur-khakimov.ru/dom24/houses?owner_id=${id}`).then((res) => {
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
    }, []);


    const statusChangeHandler = (e, docId) => {
        const copy = { ...docStatuses };
        copy[docId] = e.target.checked;

        setDocStatus(copy);
    }

    const onSendData = useCallback(() => {
        if (payload) {
          WebApp.sendData(JSON.stringify());
        }
      }, [payload]);

    useEffect(() => {
        const hasChanged = data.some((item) => item.active !== docStatuses[item._id]);

        if (hasChanged) {
            const changedDocs = [];

            data.forEach((item) => {
                if ((item.active !== docStatuses[item._id])) {
                    changedDocs.push({ _id: item._id, active: docStatuses[item._id] })
                }
            });

            console.log(changedDocs, 'Docs changed');

            setPayload(changedDocs);

            WebApp.MainButton.show();
            WebApp.MainButton.text = 'Обновить статусы';
              WebApp.onEvent('mainButtonClicked', onSendData);
        } else {
            setPayload(null);
            WebApp.MainButton.hide();
        }

        return () => {
              WebApp.MainButton.hide();
              WebApp.offEvent('mainButtonClicked', onSendData);
            };
    }, [docStatuses, data]);

    return (
        <div>
            {data.map((item) => (
                <div key={item._id} className="card-container">
                    <div className="card-actions">
                        <label className="switch">
                            <input type="checkbox" checked={docStatuses[item._id]} onChange={(e) => statusChangeHandler(e, item._id)} />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="card">
                        {item.photo_ids && (
                            <ImageSlider imageIds={item.photo_ids} />
                        )}
                        <div className="card-detail">
                            <p>🏙️ {item.city}</p>
                            <p>📍 {item.address}</p>
                            <p>🏠 {item.room_count}</p>
                            <p>📱 {item.phone}</p>
                        </div>
                    </div>

                    <div className="card-prices">
                        {Object.entries(item.price).map(([key, value]) => (
                            <p key={key}>{emojiObj[key]} {value}</p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OwnerAdvertisementsList;