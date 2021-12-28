import React from "react"
import { Field } from "redux-form"
import cx from "classnames"

const TextAreaField = ({
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
            <textarea
                className="form-control"
                id={input.name}
                type="textarea"
                placeholder={placeholder}
                required={required}
                {...input}
                value={input.value}
                cy={cy}></textarea>
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

export const ReduxFormTextAreaField = props => (
    <Field component={TextAreaField} {...props} />
)
