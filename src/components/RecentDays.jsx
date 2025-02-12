import { format, addDays, isEqual, getDaysInMonth } from "date-fns";
import { ru } from "date-fns/locale";
import '../App.css';
import { useMemo } from "react";


function RecentDays({ books }) {
    const availableDates = useMemo(() => {
        if (!books) {
            return [];
        }

        const freeDays = [];
        const daysInMonth = getDaysInMonth(new Date());

        for (let i = 0; i < daysInMonth; i++) {
            if (freeDays.length == 2) {
                break;
            }

            const bookedDay = books[i];

            if (bookedDay) {
                const day = format(addDays(new Date(), i), 'MM/dd/yyyy');
                const isSame = isEqual(new Date(day), new Date(bookedDay));

                if (!isSame) {
                    freeDays.push(day);
                }
            }
        }

        return freeDays;

    }, [books]);


    if (!books) {
        return (
            <div className="days-container">
                <div className="day-badge">{format(new Date(), 'd-MMM', { locale: ru })}</div>
                <div className="day-badge">{format(addDays(new Date(), 1), 'd-MMM', { locale: ru })}</div>
            </div>
        )
    }

    return (
        <div className="days-container">
            {availableDates.map((date) => (
                <div className="day-badge">{format(new Date(date), 'd MMM', { locale: ru })}</div>
            ))}
        </div>
    )
}

export default RecentDays;