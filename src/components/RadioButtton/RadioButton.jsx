import './RadioButton.css';

const RadioButton = ({ name, value, register, required }) => {
    return (
        <label className="radio-input-label">
            <input type="radio" value={value} className="radio-input" {...register(name, { required })} />
            <span className="radio-input-text">{value}</span>
        </label>
    );
}

export default RadioButton;