import React from "react"
import { Field } from "redux-form"
import cx from "classnames"

const renderField = ({ input, description, label, cy }) => (
    <div
        className={cx({
            "form-group": true,
            "has-label": true,
            "pl-4": true,
        })}>
        <input
            id={input.name}
            {...input}
            type="checkbox"
            className="form-check-input"
            cy={`${cy}`}
        />
        {label && (
            <label htmlFor={input.name} id={`${input.name}-queue`}>
                {label}
            </label>
        )}
        <br />
        {description && (
            <label
                htmlFor={input.name}
                id={`${input.name}-queue-description`}
                className="ml-1">
                {description}
            </label>
        )}
    </div>
)

const RenderDynamicResourceQueue = ({
    queueList,
    performanceCoefficient,
    cy,
}) => (
    <>
        {queueList.map(
            ({ Id, Type, Description, NumberOfNodes, CoresPerNode }) => (
                <Field
                    key={Id}
                    name={`Resources[${Id - 1}]`}
                    type="checkbox"
                    component={renderField}
                    label={`${Type} mode (${CoresPerNode} cores per node)`}
                    normalize={value => (value === true ? "" + Id : null)}
                    description={`${Description}: ${
                        NumberOfNodes * CoresPerNode * performanceCoefficient
                    } norm. core hours`}
                    cy={cy}
                />
            )
        )}
    </>
)

export default RenderDynamicResourceQueue
