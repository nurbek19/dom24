import { useEffect, useState } from 'react'
import '../App.css';


function PriceField({ label, name, value, onChange }) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!checked) {
            onChange(name, '');
        }
    }, [checked])

    return (
        <div className="price-fields">
            <label className="checkbox-label">
                <input type="checkbox" className="" checked={checked} onChange={() => setChecked((prev) => !prev)} />
                <span className="checkmark"></span>
                <span>{label}</span>
            </label>

            <input type="number" pattern="[0-9]*" inputMode="numeric" name={name} value={value} onChange={(e) => onChange(e.target.name, e.target.value)} className="price-input" disabled={!checked} />
        </div>
    )
}

export default PriceField;
