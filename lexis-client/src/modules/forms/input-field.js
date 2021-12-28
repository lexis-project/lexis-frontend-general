import React from "react"
import Popup from "reactjs-popup"
import { Field } from "redux-form"
import cx from "classnames"

/**
 * @param {FileList} files
 * @returns {[String]}
 */
function getFilesName(fileList){
    const files = Array.from(fileList)
    if(files && fileList instanceof FileList && files.length > 0){
        return files.map((v) => v.name).join(', ')
    }
    return null
}

const InputField = ({
    type,
    label,
    placeholder,
    info,
    input: { onChange, onBlur, value, onFocus, name },
    initialValue,
    required,
    cy,
    meta: { error, touched },
    text,
    disabled,
    hidden
}) => {
    if(!error && required && type==='file' && !(value && value.length > 0)){
        error = 'Required, please select the file'
    }
    let isInvalid = touched && !!error
    return (
        <div
            className={cx({
                "has-danger": touched && !!error,
                "has-success": touched && !error,
                "file-type": type === 'file',
                "form-group": true,
                "has-label": true,
                "d-none": hidden
            })}>
            <div className="label-wrap" >
                {(label || type === 'file') && <label
                    htmlFor={name}
                    className={cx({
                        "btn btn-success btn-simple": type === 'file',
                    })}
                >
                    {type === 'file' && !label ? "Select files..." : label}
                </label>}{" "}
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
                {type === 'file' 
            && <div className="file-type-selected-text">
                {value && value.length > 0 ? getFilesName(value) : "No files selected..."}
            </div>
                }
            </div>
            <input
                className="form-control"
                id={name}
                type={type}
                placeholder={required ? "* " + placeholder : placeholder}
                required={required}
                value={type === 'file' ? undefined : value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                cy={cy}
                aria-describedby={`${name}-help-block`}
                disabled={disabled}
            />
            {text ? (
                <small
                    id={`${name}-help-block`}
                    className="form-text text-muted"
                    htmlFor={name}>
                    {text}
                </small>
            ) : null}
            {isInvalid ? (
                <label
                    id={`${name}-error`}
                    className={cx({
                        "file-error": type === 'file',
                        "error": true
                    })}
                    htmlFor={name}>
                    {error}
                </label>
            ) : null}
        </div>
    )
}

export const ReduxFormInputField = props => (
    <Field component={InputField} {...props} />
)
