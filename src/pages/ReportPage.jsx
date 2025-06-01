import { useState, useEffect } from "react";
import WebApp from '@twa-dev/sdk';
import { format } from "date-fns";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import '../App.css';

const ReportPage = () => {
    const [selected, setSelected] = useState();

    console.log(selected);

    const onSendData = () => {


        console.log({
            command: "report",
            from: format(selected.from, 'dd/MM/yyyy'),
            to: format(selected.to, 'dd/MM/yyyy')
        });

        WebApp.sendData(JSON.stringify({
            command: "report",
            from: format(selected.from, 'dd/MM/yyyy'),
            to: format(selected.to, 'dd/MM/yyyy')
        }));
    };

    useEffect(() => {
        WebApp.expand();
    }, []);

    useEffect(() => {
        WebApp.onEvent('mainButtonClicked', onSendData);

        return () => {
            WebApp.offEvent('mainButtonClicked', onSendData);
        };
    }, [selected]);


    useEffect(() => {
        WebApp.MainButton.text = 'Получит отчет';

        if (selected) {
            WebApp.MainButton.show();
        } else {
            WebApp.MainButton.hide();
        }


        return () => {
            WebApp.MainButton.hide();
        };

    }, [selected])

    return (
        <div className="report-page">
            <DayPicker
                animate
                mode="range"
                selected={selected}
                onSelect={setSelected}
            />
        </div>
    )
}

export default ReportPage;