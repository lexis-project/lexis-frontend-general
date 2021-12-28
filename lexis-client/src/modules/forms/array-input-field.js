import React from "react"
import { FieldArray } from "redux-form"

import { ReduxFormInputField } from "./input-field"
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
function renderArray(...args) {
    return (
        <>
            <div className="form-group">
                {" "}
                <div className="row">
                    <div className="col">
                        {args[0].label && (
                            <label htmlFor={args[0].name}>{args[0].label}</label>
                        )}
                    </div>
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-success btn-simple text-nowrap btn-sm"
                            onClick={() => args[0].fields.push()}
                            cy={`${args[0].cy}-addbutton`}
                        >
                            <span className="success d-inline-flex">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>
                        </button>
                    </div>
                </div>
                {args[0].fields.map((name, index) => (
                    <div key={name} className="row">
                        <div className="col input-array">
                            <ReduxFormInputField
                                name={`${name}`}
                                type={args[0].type}
                                placeholder={args[0].placeholder}
                                label=""
                                initialValue={
                                    args[0].initialValue === undefined ||
                                args[0].meta.dirty
                                        ? undefined
                                        : args[0].initialValue[index]
                                }
                                isInvalid={
                                    args[0].meta.touched && args[0].meta.error
                                }
                                {...args[0].meta}
                                cy={`${args[0].cy}`}
                            />
                        </div>
                        <div className="col">
                            <button
                                type="button"
                                className="btn btn-warning btn-simple text-nowrap btn-sm"
                                onClick={() => args[0].fields.remove(index)}>
                                <span className="warning d-inline-flex">
                                    <i className="tim-icons icon-simple-delete"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
                {args[0].meta.touched && !!args[0].meta.error ? (
                    <label
                        id={`${args[0].name}-error`}
                        className="error"
                        htmlFor={args[0].name}
                    >
                        {args[0].meta.error}
                    </label>
                ) : null}
            </div>
        </>
    )
}

/*
 * defaultValue={input.initialValue===undefined || input.length<=index||dirty
 *                               ?undefined
 *                                                             :input.initialValue[index]}
 */

//rgh: I have the problem at https://github.com/redux-form/redux-form/issues/2291
//deletes always the latest field. Using a simple input again here due to this.

export const ReduxFormArrayInputField = props => (
    <FieldArray {...props} name={props.name} component={renderArray} />
)
