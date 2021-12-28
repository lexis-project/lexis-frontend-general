import React from "react"
import cx from "classnames"

export const InputImpl = ({
    type,
    label,
    placeholder,
    required,
    cy,
    text,
    name,
    id,
    onFilter,
    value,
}) => (
    <div
        className={cx({
            "form-group": true,
            "has-label": true,
        })}>
        {label && <label htmlFor={id}>{label}</label>}
        <input
            className="form-control"
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            cy={cy}
            aria-describedby={`${id}-help-block`}
            onChange={onFilter}
            value={value}
        />
        {text ? (
            <small
                id={`${id}-help-block`}
                className="form-text text-muted"
                htmlFor={id}>
                {text}
            </small>
        ) : null}
    </div>
)
