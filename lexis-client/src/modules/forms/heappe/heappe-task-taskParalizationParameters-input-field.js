import React, { Component } from "react"

import { ReduxFormInputField } from "./../input-field"
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
class ReduxFormHeappeTaskParalizationParametersInputField extends Component {
    render() {
        return (
            <div key={this.propsname} className="row mb-3 border-left border-secondary">
                <div className="col">
                    <ReduxFormInputField
                        name={`${this.props.name}.MPIProcesses`}
                        type={this.props.type}
                        placeholder="Please provide number of MPI processes"
                        info="Number of MPI processes"
                        label="MPIProcesses"
                    />
                    <ReduxFormInputField
                        name={`${this.props.name}.OpenMPThreads`}
                        type={this.props.type}
                        placeholder="Please provide number of OpenMP threads"
                        info="Number of OpenMP threads"
                        label="OpenMPThreads"
                    />
                    <ReduxFormInputField
                        name={`${this.props.name}.MaxCores`}
                        type={this.props.type}
                        placeholder="Please provide maximum number of cores"
                        info="Maximum number of cores"
                        label="MaxCores"
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

export { ReduxFormHeappeTaskParalizationParametersInputField }
