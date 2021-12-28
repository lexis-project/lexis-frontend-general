import classNames from "classnames"
import React, { Component } from "react"
import { connect } from "react-redux"

import { ReduxFormInputField } from "./../input-field"
//import {ReduxFormExecutionArrayInputField} from "./array-input-field-workflow-execution";
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

export const GENERIC_TEMP_ID=['org.lexis.common.LEXISTemplate:0.1.0-SNAPSHOT', 'org.lexis.common.HPCComputationTemplate:0.1.0-SNAPSHOT']

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
class ReduxFormHeappeTaskTemplateParamValsInputField extends Component {
    render() {
        return (
            <>
                <div className="row">
                    {this.props.index === 0 && this.props.len === 1 && GENERIC_TEMP_ID.includes(this.props.templateID) && !this.props.loadedParams && (
                        <div className="text-info font-italic ml-3">
                        Please fill the userScriptPath, HPC resource and Command Template Name please, to load other HEAppE parameters
                        </div>
                    )}
                </div>
                <div className={classNames({"row": true})}>
                    <div key={this.props.name} className="row border-left mb-2 border-secondary">

                        <div className="col">
                            <ReduxFormInputField
                                name={`${this.props.name}.CommandParameterIdentifier`}
                                type={this.props.type}
                                placeholder="Please provide command parameter identifier"
                                info="Command parameter identifier"
                                label="CommandParameterIdentifier"
                                //required={true}
                                disabled={true}
                            />
                        </div>
                        <div className="col">
                            <ReduxFormInputField
                                name={`${this.props.name}.ParameterValue`}
                                type={this.props.type}
                                placeholder="Please provide command parameter value"
                                info="Command parameter value"
                                label="ParameterValue"
                                required={true}
                            />
                        </div>
                    </div>
                </div>
            </>
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

export { ReduxFormHeappeTaskTemplateParamValsInputField }
