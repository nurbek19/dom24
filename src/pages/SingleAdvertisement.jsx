
import { emojiObj } from './OwnerAdvertisementsList';
import ImageSlider from "../components/ImageSlider";
import '../App.css';

const SingleAdvertisement = ({ item, onBackHandler }) => {
    console.log(item);


    return (
        <div>
            <div className="back-button" onClick={onBackHandler}>« назад</div>

            <div className="">
                <div className="single-card">
                    {item.photo_ids && (
                        <ImageSlider imageIds={item.photo_ids} />
                    )}
                    <div className="card-detail single-card-detail">
                        <p><span>Город:</span> {item.city}</p>
                        <p><span>Адрес:</span> {item.address}</p>
                        <p><span>Количество комнат:</span> {item.room_count}</p>
                        <div className="card-prices single-card-prices">
                            {Object.entries(item.price).map(([key, value]) => (
                                <div key={key}>{emojiObj[key]}: {value}</div>
                            ))}
                        </div>

                        <div className='card-status'>
                            {item.active ? <div className='free'>свободно</div> : <div className='busy'>занято</div>}
                        </div>

                        <div className='call-btn' onClick={(e) => callHandler(e, item._id, item.owner_id, item.phone)}>
                            <a href={`tel:${item.phone}`} className='phone-link'>📞</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleAdvertisement;