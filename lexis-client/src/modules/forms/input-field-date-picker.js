import React from "react"
import { Field, blur, touch } from "redux-form"
import Moment from "moment"
import "react-widgets/styles.css"
import { connect } from "react-redux"
import cx from "classnames"
import { DatePicker } from "react-widgets/cjs"

Moment.locale("en")

const InputFieldImpl = ({
    label,
    input: { onChange, value, name },
    meta: { error, touched },
    showTime,
    formName,
    blurField,
    touchField,
    cy,
    currentDate,
    minDate
}) => {
    let isInvalid = error
    let format = showTime ? "DD. MMM. YYYY; HH:mm A" : "DD. MMM. YYYY"
    let dateTime = new Date(value)
    if(!showTime)
        dateTime.setUTCHours(0,0,0,0)
    return (
        <div
            className={cx({
                "custom-field-was-validated": touched && !error,
                "custom-field-validation-error": touched && error,
                "has-danger": touched && !!error,
                "has-success": touched && !error,
                "form-group": true,
                "has-label": true,
                "datetime-picker": true,
            })}>
            {label && <label htmlFor={name}>{label}</label>}
            {formName && name && (
                <DatePicker
                    id={name}
                    onChange={onChange}
                    //format={format}
                    valueFormat={format}
                    valueDisplayFormat={{ dateStyle: "medium" }}
                    valueEditFormat={{ dateStyle: "medium" }}
                    // timeFormat={"hh:mm A"}
                    includeTime={showTime}
                    onBlur={() => blurField(formName, name, value)}
                    onFocus={() => touchField(formName, name)}
                    value={!value ? undefined : dateTime}
                    defaultValue={currentDate || undefined}
                    min={minDate || undefined}
                    inputProps={{
                        cy: cy,
                    }}
                />
            )}
            {isInvalid ? (
                <label id={`${name}-error`} className="error" htmlFor={name}>
                    {error}
                </label>
            ) : null}
        </div>
    )
}

const mapDispatchToProps = {
    blurField: blur,
    touchField: touch,
}

const InputField = connect(null, mapDispatchToProps)(InputFieldImpl)

export const ReduxFormInputFieldDatePicker = props => (
    <Field component={InputField} {...props} />
)
