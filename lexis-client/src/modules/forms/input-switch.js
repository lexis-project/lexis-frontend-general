import React from 'react'
import cx from 'classnames'
import { Field } from "redux-form"
import Switch from 'react-input-switch'
const InputSwitchImpl = ({
    label,
    required,
    cy,
    text,
    id,
    input: { onChange, value, name },
}) => (
    <div
        className={cx({
            "form-group": true,
            "has-label": true,
        })}
    >
        <Switch
            name={name}
            required={required}
            onChange={onChange}
            on="true"
            off="false"
            value={value}
            id={id}
            cy={cy}
            style={{ transform: 'scale(1.5)'}}
        />
        {label && <label htmlFor={id} style={{ marginLeft: '1rem' }}>{label}</label>}

        {text ? (
            <small
                id={`${id}-help-block`}
                className="form-text text-muted"
                htmlFor={id}
            >
                {text}
            </small>
        ) : null}
    </div>
)

export default (props) => (
    <Field component={InputSwitchImpl} {...props} />
)
