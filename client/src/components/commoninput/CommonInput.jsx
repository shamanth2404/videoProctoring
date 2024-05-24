import React from 'react';
import './commoninput.css';

const CommonInput = React.forwardRef(({ placeholderText, id, name, value, onChange }, ref) => {
    return (
        <input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholderText}
            ref={ref}
        />
    );
});

export default CommonInput;
