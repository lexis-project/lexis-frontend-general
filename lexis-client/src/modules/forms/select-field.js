// eslint-disable jsx-a11y/no-onchange

import React from "react"
import Popup from "reactjs-popup"
import { Field } from "redux-form"
import cx from "classnames"

const SelectField = ({
    input: { onChange, value, onFocus, name },
    label,
    values,
    displayNames,
    info,
    required,
    cy,
    disabled,
    meta: { error, visited, active },
    fixedValue,
    fixedValueName,
    isLoading,
    placeholder
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
            {isLoading ? 
                <div className="row">
                    <div className="col-4 text-left">
                        <span className="spinner-border text-light" role="status" style={{scale: '0.6'}}></span>
                    </div>
                </div>
                : <select
                    className="form-control"
                    id={name}
                    onChange={onChange}
                    onFocus={onFocus}
                    value={value}
                    required={required}
                    disabled={disabled}
                    cy={cy}
                    style={{
                        color: value === "" ? "rgba(255, 255, 255, 0.6)" : "#fff",
                    }}>
                    {fixedValue !== undefined ? (
                        <option key={0} value={fixedValue}>
                            {fixedValueName ? fixedValueName : fixedValue}
                        </option>
                    ) : (
                        <>
                            <option key={0} value="">
                                {placeholder ? placeholder : "Please choose an option..."}
                            </option>
                            {displayNames !== undefined &&
                        displayNames.length === values.length
                                ? values.map((elem, index) => (
                                    <option
                                        key={index + 1}
                                        value={elem}
                                        style={{ color: "#000" }}>
                                        {displayNames !== undefined
                                            ? displayNames[index]
                                            : elem}
                                    </option>
                                ))
                                : values.map((elem, index) => (
                                    <option
                                        key={index + 1}
                                        value={elem}
                                        style={{ color: "#000" }}>
                                        {elem}
                                    </option>
                                ))}
                        </>
                    )}
                </select>}
            {isNotChoosen ? (
                <label id={`${name}-error`} className="error" htmlFor={name}>
                    {error}
                </label>
            ) : null}
        </div>
    )
}

export const ReduxFormSelectField = props => (
    <Field component={SelectField} {...props} />
)
