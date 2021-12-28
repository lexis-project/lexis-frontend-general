import React, { Component } from "react"
import Popup from "reactjs-popup"

import { FieldArray } from "redux-form"
import { ReduxFormInputField } from "./input-field"
import { ReduxFormHeappeTaskInputField } from "./heappe/heappe-task-input-field"
import { ReduxFormHeappeTaskTemplateParamValsInputField } from "./heappe/heappe-task-templateParamVals-input-field"
import { ReduxFormHeappeTaskParalizationParametersInputField } from "./heappe/heappe-task-taskParalizationParameters-input-field"
import { ReduxFormHeappeTaskEnvironmentVariablesInputField } from "./heappe/heappe-task-environmentVariables-input-field"
import classNames from "classnames"
import { connect } from "react-redux"
import { getWorkflowsDetail } from "../workflows/workflows-selectors"
import { getAdditionalHeappeFields } from "../workflowExecutions/workflowExecutions-selectors"

//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

class Fields extends Component {
    handleInputType(name, index) {
        switch (this.props.item.type) {
        case "text":
            return (
                <ReduxFormInputField
                    name={`${name}`}
                    type={this.props.item.type}
                    placeholder={this.props.item.placeholder}
                    label=""
                    required={true}
                    initialValue={
                        this.props.item.initialValue === undefined ||
                            this.props.item.meta.dirty
                            ? undefined
                            : this.props.item.initialValue[index]
                    }
                    isInvalid={
                        this.props.item.meta.touched &&
                            this.props.item.meta.error
                    }
                    {...this.props.item.meta}
                />
            )
        case "HEAppETask":
            return (
                <ReduxFormHeappeTaskInputField
                    name={name}
                    type={this.props.item.type}
                />
            )
        case "HEAppETaskTemplateParamVals":
            return (
                <>
                    <ReduxFormHeappeTaskTemplateParamValsInputField
                        name={name}
                        type={this.props.item.type}
                        index={index}
                        len={this.props.item.fields.length}
                        templateID={this.props.workflow.workflowTemplateID}
                        loadedParams={this.props.additionalHeappeFields !== null}
                    />
                </>
            )
        case "HEAppETaskParalizationParameters":
            return (
                <ReduxFormHeappeTaskParalizationParametersInputField
                    name={name}
                    type={this.props.item.type}
                />
            )
        case "HEAppETaskEnvironmentVariables":
            return (
                <ReduxFormHeappeTaskEnvironmentVariablesInputField
                    name={name}
                    type={this.props.item.type}
                />
            )
        default:
            return <div />
        }
    }

    renderSimpleItem(name, index) {
        return this.handleInputType(name, index)
    }

    renderComplexItem(name, index) {
        return (
            // <Popup
            //     trigger={
            //         <button
            //             type="button"
            //             className="btn btn-simple text-nowrap mr-1"
            //             variant="primary">
            //             <span className="white d-inline-flex mx-1">
            //                 <i className="tim-icons icon-pencil" />
            //             </span>{" "}
            //             {index + 1}
            //         </button>
            //     }
            //    contentStyle={{ width: "50%" }}
            //    position="right top"
            //    nested>
            //<div className="card" style={{ border: "2px solid white" }}>
            //    <div className="card-header">{this.props.item.label}</div>
            //    <div className="card-body">
            <>
                <div className="ml-2">
                    {this.handleInputType(name, index)}
                </div>
            </>
            //   </div>
            //</div>
            //</Popup>
        )
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-8">
                        {this.props.item.label && (
                            <label htmlFor={this.props.item.label} className={classNames({
                                'font-weight-bold': this.props.item.type !== 'text'
                            })}>
                                {this.props.item.label}(s)
                            </label>
                        )}
                        {this.props.item.info && (
                            <Popup
                                trigger={
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons tim-icons-sm tim-icons icon-bulb-63" />
                                    </span>
                                }
                                position="right"
                                on={["hover", "focus"]}
                                arrow={false}>
                                <div className="card card-title card-white">
                                    {this.props.item.info}
                                </div>
                            </Popup>
                        )}
                    </div>
                    <div className="col-4">
                        <button
                            type="button"
                            className={
                                classNames({"btn btn-success btn-simple text-nowrap mr-1" : true,
                                    "d-none": this.props.item.type === "HEAppETaskTemplateParamVals"
                                })}
                            variant="primary"
                            onClick={() => this.props.item.fields.push()}

                        >
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add" />
                            </span>{" "}
                        </button>
                    </div>
                </div>
                {this.props.item.fields.map((name, index) => (
                    <div key={name} className="row">
                        <div className="col-9">
                            {this.props.item.type === "text"
                                ? this.renderSimpleItem(name, index)
                                : this.renderComplexItem(name, index)}
                        </div>
                        <div className="col-3">
                            <button
                                type="button"
                                className={classNames({"btn btn-info btn-simple text-nowrap ml-1": true,
                                    "d-none": this.props.item.type === "HEAppETaskTemplateParamVals" })} // do not display remove button for HEAppE parameters
                                variant="primary"
                                onClick={() =>
                                    this.props.item.fields.remove(index)
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-simple-remove"></i>
                                </span>{" "}
                            </button>
                        </div>
                    </div>
                ))}
            </>
        )
    }
}

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
const mapStateToProps = (state) => ({
    workflow: getWorkflowsDetail(state),
    additionalHeappeFields: getAdditionalHeappeFields(state)
})
const FieldsImpl = connect(mapStateToProps)(Fields)

function renderArray(...args){
    return <FieldsImpl item={args[0]} />
}

/*
 * defaultValue={input.initialValue===undefined || input.length<=index||dirty
 *                               ?undefined
 *                                                             :input.initialValue[index]}
 */

//rgh: I have the problem at https://github.com/redux-form/redux-form/issues/2291
//deletes always the latest field. Using a simple input again here due to this.

export const ReduxFormExecutionArrayInputField = props => {
    return(
        <FieldArray name={props.fieldname} component={renderArray} {...props}/>
    )}
