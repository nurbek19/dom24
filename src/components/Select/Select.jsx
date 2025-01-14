import { forwardRef } from 'react';
import './Select.css';

const Select = forwardRef(({ label, name, options, onChange }, ref) => {
    return (
        <>
            <label htmlFor={name} className="field-label">{label}</label>

            <select ref={ref} name={name} id={name} className="select-field" onChange={onChange}>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </>
    );
})

export default Select;