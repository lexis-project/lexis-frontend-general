import React from "react"
import { Field, FieldArray } from "redux-form"

const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} type={type} placeholder={label} />
            {touched && error && <span>{error}</span>}
        </div>
    </div>
)

const InputFieldArray = ({ inputParam, fields, meta: { error, touched } }) => (
    <div>
        {fields.push({})}
        {fields.map((inputParameter, index) => (
            <div key={index}>
                <Field
                    name={`${inputParameter}.${inputParam}`}
                    type="text"
                    component={renderField}
                    label={inputParam}
                />
            </div>
        ))}
    </div>
)

export const ReduxFormInputFieldArray = props => (
    <FieldArray component={InputFieldArray} {...props} />
)
