import React from "react"
import { FieldArray } from "redux-form"

import { ReduxFormInputField } from "./input-field"
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
function renderArrayPair(...args) {
    return (
        <>
            {" "}
            <div className="row">
                <div className="col">
                    <p>{args[0].label}</p>
                </div>
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-primary"
                        variant="primary"
                        onClick={() => args[0].fields.push()}>
                        Add
                    </button>
                </div>
            </div>
            {args[0].fields.map((name, index) => (
                <div key={name} className="row">
                    <div className="col">
                        <ReduxFormInputField
                            name={`${name}[0]`}
                            type={args[0].type}
                            placeholder={args[0].placeholder[0]}
                            label="Type"
                            initialValue={
                                args[0].initialValue === undefined ||
                                args[0].meta.dirty
                                    ? undefined
                                    : args[0].initialValue[index][0]
                            }
                            isInvalid={
                                args[0].meta.touched && args[0].meta.error
                            }
                            {...args[0].meta}
                        />
                    </div>
                    <div className="col">
                        <ReduxFormInputField
                            name={`${name}[1]`}
                            type={args[0][1]}
                            placeholder={args[0].placeholder[1]}
                            label="Id"
                            initialValue={
                                args[0].initialValue === undefined ||
                                args[0].meta.dirty
                                    ? undefined
                                    : args[0].initialValue[index][1]
                            }
                            isInvalid={
                                args[0].meta.touched && args[0].meta.error
                            }
                            {...args[0].meta}
                        />{" "}
                    </div>

                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-primary"
                            variant="primary"
                            onClick={() => args[0].fields.remove(index)}>
                            Remove
                        </button>
                    </div>
                </div>
            ))}
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

export const ReduxFormArrayPairInputField = props => (
    <FieldArray name={props.fieldname} component={renderArrayPair} {...props} />
)
