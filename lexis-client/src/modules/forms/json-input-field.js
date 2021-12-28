import React from "react"
import { Field } from "redux-form"
import cx from "classnames"

function stringifiedInput(input) {
    if (typeof input.value === "string") {
        return input
    }
    var newInput = input
    newInput.value = JSON.stringify(input.value)
    return newInput
}

const JSONInputField = ({
    type,
    label,
    placeholder,
    input,
    required,
    cy,
    meta: { error, touched },
}) => {
    let isInvalid = touched && !!error

    return (
        <div
            className={cx({
                "has-danger": touched && !!error,
                "has-success": touched && !error,
                "form-group": true,
                "has-label": true,
            })}>
            {label && <label htmlFor={input.name}>{label}</label>}
            <input
                className="form-control"
                id={input.name}
                type={type}
                placeholder={placeholder}
                required={required}
                {...stringifiedInput(input)}
                cy={cy}
            />
            {isInvalid ? (
                <label
                    id={`${input.name}-error`}
                    className="error"
                    htmlFor={input.name}>
                    {error}
                </label>
            ) : null}
        </div>
    )
}

export const ReduxFormJSONInputField = props => (
    <Field component={JSONInputField} {...props} />
)
