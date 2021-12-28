import React from "react"
import { Field } from "redux-form"
import cx from "classnames"
import Popup from "reactjs-popup"

const SelectProjectField = ({
    input: { onChange, value, onFocus, name },
    label,
    values,
    required,
    cy,
    info,
    meta: { error, visited, active },
}) => {
    let isNotChoosen = visited && !!error && !active
    return (
        <div
            className={cx({
                "has-danger": visited && !!error && !active,
                "has-success": !error,
                "form-group": true,
                "has-label": true,
            })}>
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
            <select
                className="form-control"
                id={name}
                onChange={onChange}
                onFocus={onFocus}
                value={value}
                required={required}
                cy={cy}
                style={{ color: value === "" ? "#6c757d" : "#fff" }}>
                <option key={0} value="">
                    Please choose an option...
                </option>
                {values.map((elem, index) => (
                    <option
                        key={index + 1}
                        value={elem.ProjectShortName}
                        style={{ color: "#000" }}>
                        {elem.ProjectName}
                    </option>
                ))}
            </select>
            {isNotChoosen ? (
                <label id={`${name}-error`} className="error" htmlFor={name}>
                    {error}
                </label>
            ) : null}
        </div>
    )
}

export const ReduxFormSelectProjectField = props => (
    <Field component={SelectProjectField} {...props} />
)
