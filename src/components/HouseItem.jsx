
import { useState } from 'react';
import '../App.css';
import clsx from 'clsx';

const HouseItem = ({ number, setHouses }) => {
    const [active, setActive] = useState(false);

    const clickHandler = () => {
        setActive(!active);

        setHouses((prev) => {
            if (prev.includes(number)) {
                const copyArr = [...prev];

                const index = copyArr.findIndex((v) => v === number);

                copyArr.splice(index, 1);

                return [...copyArr];
                
            } else {
                return [...prev, number];
            }
        })
    }

    return (
        <div className={clsx('house-item', { 'house-active': active })} onClick={clickHandler}>
            <span className="house-number">{number}</span>

            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house">
                {/* <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /> */}
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
        </div>
    )
}


export default HouseItem;