import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import Popup from 'reactjs-popup'
import { Field, getFormInitialValues } from 'redux-form'
import { getInitValue } from '../utils'

const customOnChange = (onChange, value) => (changedVal, { action, removedValue }) => {
    if (action === 'select-option') {
        if (value === undefined) {
            return onChange(changedVal)
        }
        return onChange(changedVal)
    }
    if (action === 'remove-value' || action === 'deselect-option') {
        if (value === undefined) {
            return onChange([])
        }
        return onChange(value.filter((i) => removedValue.value !== i.value))
    }
    if (action === 'clear') {
        return onChange([])
    }
    return undefined
}

const AdvancedSelectField = ({
    placeholder,
    input: { onChange, value, onFocus, onBlur, name },
    meta: { active, error, touched },
    options, loading, isMulti, hideSelectedOptions,
    isClearable, cy, initialValues, label, info }) => {
    let initValue = getInitValue(initialValues, ...name.split('.'))
    initValue = initValue && initValue.value ? initValue
        : options && options.find(item=>item.value === initValue)
    return (
        <div className="form-group" cy={cy}>
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
            <Select
                name={name}
                options={options}
                isMulti={isMulti}
                onFocus={onFocus}
                onBlur={() => onBlur(value)}
                isLoading={loading}
                placeholder={placeholder}
                //menuIsOpen={true}
                defaultValue={initValue}
                onChange={customOnChange(onChange, value)}
                value={value}
                hideSelectedOptions={hideSelectedOptions}
                isClearable={isClearable}
            />
            {touched && !!error ? (
                <label
                    id={`${name}-error`}
                    className="error"
                    htmlFor={name}
                >
                    {error}
                </label>
            ) : null}
        </div>
    )}

const mapStateToProps = (state, ownProps) => ({
    initialValues: getFormInitialValues(ownProps.meta.form)(state)
})

const SelectFieldImpl = connect(mapStateToProps)(AdvancedSelectField)

export default ({ placeholder, name, form,
    isMulti, options, loading, required, hideSelectedOptions,
    isClearable, cy, info, label
}) => (
    <Field
        component={SelectFieldImpl}
        placeholder={placeholder}
        name={name}
        form={form}
        required={required}
        isMulti={isMulti}
        loading={loading}
        options={options}
        hideSelectedOptions={hideSelectedOptions}
        isClearable={isClearable}
        cy={cy}
        info={info}
        label={label}
    />
)
