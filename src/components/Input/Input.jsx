import './Input.css';

const Input = ({ label, name, type, register, required }) => {

    return (
        <>
            <label htmlFor={name} className="field-label">{label}</label>

            <input type={type} id={name} className="text-field" {...register(name, { required })} />
        </>
    );
}

export default Input;

