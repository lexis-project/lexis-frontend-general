import React from "react"
import { FieldArray } from "redux-form"

import { ReduxFormInputField } from "./input-field"
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
function renderMap(...args) {
    const item = args[0]
    return (
        <>
            <div className="row">
                <div className="col">
                    {item.label && (
                        <label htmlFor={item.label} className="font-weight-bold">{item.label}</label>
                    )}
                    <div className="row">
                        <div className="col">
                            <label htmlFor={item.label}>* Please provide Key:Value pairs</label>
                        </div>
                    </div>
                </div>
                <div className="col-15">
                    <button
                        type="button"
                        className="btn btn-success btn-simple text-nowrap mr-1"
                        variant="primary"
                        onClick={() => item.fields.push([null,null])}>
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
                    </button>
                </div>
            </div>
            {item.fields.map((name, index) => {
                return(
                    <div key={name} className="row">
                        <div className="col-4 ml-2">
                            <ReduxFormInputField
                                name={`${name}[0]`}
                                type={item.type}
                                placeholder={item.placeholder[0]}
                                required={item.required}
                                initialValue={
                                    item.initialValue === undefined ||
                                    item.meta.dirty
                                        ? undefined
                                        : item.initialValue[index][0]
                                }
                                isInvalid={item.meta.touched && item.meta.error}
                                {...item.meta}
                            />
                        </div>
                        <div className="col-4">
                            <ReduxFormInputField
                                name={`${name}[1]`}
                                type={item[1]}
                                placeholder={item.placeholder[1]}
                                required={item.required}
                                initialValue={
                                    item.initialValue === undefined ||
                                    item.meta.dirty
                                        ? undefined
                                        : item.initialValue[index][1]
                                }
                                isInvalid={item.meta.touched && item.meta.error}
                                {...item.meta}
                            />
                        </div>
                        <div className="col-3">
                            <button
                                type="button"
                                className="btn btn-info btn-simple text-nowrap ml-1"
                                variant="primary"
                                onClick={() => item.fields.remove(index)}>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-simple-remove"></i>
                                </span>{" "}
                            </button>
                        </div>
                    </div>
                )})}
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

export const ReduxFormMapInputField = props => (
    <FieldArray name={props.fieldname} component={renderMap} {...props} />
)
