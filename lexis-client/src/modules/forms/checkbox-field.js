import React from "react"
import Popup from "reactjs-popup"
import { Field } from "redux-form"
import cx from "classnames"

const CheckboxField = ({
    input: { onChange, value, name },
    required,
    label,
    info,
    cy,
}) => {
    return (
        <div
            className={cx({
                "form-group": true,
                "has-label": true,
                "pl-4": true,
                "mt-3": true,
            })}>
            <input
                className="form-check-input"
                id={name}
                onChange={onChange}
                type="checkbox"
                component="input"
                label={label}
                checked={value}
                value={value}
                required={required}
                cy={cy}
            />
            {label && <label htmlFor={name}>{label}</label>}
            {info && (
                <Popup
                    trigger={
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons tim-icons-sm tim-icons icon-bulb-63" />
                        </span>
                    }
                    position="right"
                    on={["hover", "focus"]}
                    arrow={false}>
                    <div className="card card-title card-white">{info}</div>
                </Popup>
            )}
        </div>
    )
}

export const ReduxFormCheckboxField = props => (
    <Field component={CheckboxField} {...props} />
)
