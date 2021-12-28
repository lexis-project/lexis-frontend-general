import React, { Component } from "react"

import { ReduxFormInputField } from "./../input-field"
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
class ReduxFormHeappeTaskEnvironmentVariablesInputField extends Component {
    render() {
        return (
            <div key={this.props.name} className="row mb-3 border-left border-secondary">
                <div className="col">
                    <ReduxFormInputField
                        name={`${this.props.name}.Name`}
                        type={this.props.type}
                        placeholder="Please provide environment variable name"
                        info="Environment variable name"
                        label="Name"
                        required={true}
                    />
                    <ReduxFormInputField
                        name={`${this.props.name}.Value`}
                        type={this.props.type}
                        placeholder="Please provide environment variable value"
                        info="Environment variable value"
                        label="Value"
                    />
                </div>
            </div>
        )
    }
}

/*
 * defaultValue={input.initialValue===undefined || input.length<=index||dirty
 *                               ?undefined
 *                                                             :input.initialValue[index]}
 */

//rgh: I have the problem at https://github.com/redux-form/redux-form/issues/2291
//deletes always the latest field. Using a simple input again here due to this.

export { ReduxFormHeappeTaskEnvironmentVariablesInputField }
