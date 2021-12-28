import React, { Component } from "react"

import { ReduxFormInputField } from "./../input-field"
import { ReduxFormExecutionArrayInputField } from "./..//array-input-field-workflow-execution"

class DDIFields extends Component {
    render() {
        return (
            <div className="col">
                <ReduxFormExecutionArrayInputField
                    type="text"
                    key={`${this.props.inputParameter.inputParamName}.creator`}
                    name={`${this.props.name}.creator`}
                    label="Creator"
                    info="Creator"
                    placeholder="Please provide Creator"
                />
                <ReduxFormExecutionArrayInputField
                    type="text"
                    key={`${this.props.inputParameter.inputParamName}.contributor`}
                    name={`${this.props.name}.contributor`}
                    label="Contributor"
                    info="Contributor"
                    placeholder="Please provide Contributor"
                />
                <ReduxFormExecutionArrayInputField
                    type="text"
                    key={`${this.props.inputParameter.inputParamName}.publisher`}
                    name={`${this.props.name}.publisher`}
                    label="Publisher"
                    info="Publisher"
                    placeholder="Please provide Publisher"
                />
                <ReduxFormExecutionArrayInputField
                    type="text"
                    key={`${this.props.inputParameter.inputParamName}.owner`}
                    name={`${this.props.name}.owner`}
                    label="Owner"
                    info="Owner"
                    placeholder="Please Provide Owner"
                />
                <ReduxFormInputField
                    key={`${this.props.inputParameter.inputParamName}.identifier`}
                    name={`${this.props.name}.identifier`}
                    type="text"
                    label="Identifier"
                    info="Dataset identifier"
                    placeholder="Please provide HeAppE identifier"
                />
                <ReduxFormInputField
                    key={`${this.props.inputParameter.inputParamName}.publicationYear`}
                    name={`${this.props.name}.publicationYear`}
                    type="text"
                    label="Publication Year"
                    info="Dataset year of publication"
                    placeholder="Please provide Publication Year"
                    initialValue="0"
                />
                <ReduxFormInputField
                    key={`${this.props.inputParameter.inputParamName}.resourceType`}
                    name={`${this.props.name}.resourceType`}
                    type="text"
                    label="Resource Type"
                    info="Dataset resource type"
                    placeholder="Please provide the resource type"
                />
                <ReduxFormInputField
                    key={`${this.props.inputParameter.inputParamName}.title`}
                    name={`${this.props.name}.title`}
                    type="text"
                    label="Title"
                    info="Dataset title"
                    placeholder="Please provide title"
                />
                <ReduxFormExecutionArrayInputField
                    type="text"
                    key={`${this.props.inputParameter.inputParamName}.relatedIdentifier`}
                    name={`${this.props.name}.relatedIdentifier`}
                    label="Related Identifier"
                    info="Related identifier"
                    placeholder="Please provide Related Identifier"
                />
            </div>
        )
    }
}

export { DDIFields }
