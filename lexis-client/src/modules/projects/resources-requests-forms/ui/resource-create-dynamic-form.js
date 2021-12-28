import React from "react"
import cx from "classnames"
import { reduxForm, FieldArray } from "redux-form"
import { connect } from "react-redux"

import { getComputerResources } from "../../computer-resources/computer-resources-selectors"
import { ReduxFormCheckboxField } from "../../../forms/checkbox-field"
import { ReduxFormSelectField } from "../../../forms/select-field"
import { ReduxFormInputField } from "../../../forms/input-field"
import { ReduxFormInputFieldDatePicker } from "../../../forms/input-field-date-picker"
import RenderDynamicResourceQueue from "../../computer-resources/ui/render-dynamic-resource-queue"
import { validate } from "../resources-form-dynamic-validation"
import { getProjectDetail } from "../../projects-selectors"

const goBack = () => window.history.back()

let ResourceDynamicFormImpl = ({
    handleSubmit,
    onFormSubmit,
    hpcProviders,
    dynamicResources,
    form,
    project,
}) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <p>ID of the Project:</p>
                        </div>
                        <div className="col">
                            <p>
                                <code>{project.ProjectID}</code>
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <p>LEXIS project manager (email):</p>
                        </div>
                        <div className="col">
                            <p>
                                <a
                                    href={
                                        "mailto:" + project.ProjectContactEmail
                                    }>
                                    {project.ProjectContactEmail}
                                </a>
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "resource-dynamic-form": true,
                        })}>
                        <ReduxFormInputField
                            type="email"
                            name="PrimaryInvestigator"
                            label="Primary Investigator email"
                            cy="resource-dynamic-form-primaryinvestigator"
                            placeholder="Please enter an e-mail of primary investigator..."
                        />
                        <ReduxFormSelectField
                            name="HPCProvider"
                            label="HPC Center"
                            values={hpcProviders}
                            cy="resource-dynamic-form-hpcprovider"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="CoreHoursExpected"
                            label="Expected norm. core hours"
                            cy="resource-dynamic-form-corehoursexpected"
                            placeholder="Please enter an expected normalized core hours..."
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Budget"
                            label="Budget (euro)"
                            cy="resource-dynamic-form-budget"
                            placeholder="Please enter an expected budget..."
                        />
                        <ReduxFormInputFieldDatePicker
                            formName={form}
                            name="DateStart"
                            showTime={false}
                            placeholder={new Date().toISOString()}
                            cy="resource-dynamic-form-resourcestartdate"
                            label="Time period from"
                        />
                        <ReduxFormInputFieldDatePicker
                            formName={form}
                            name="DateEnd"
                            showTime={false}
                            placeholder={new Date().toISOString()}
                            cy="resource-dynamic-form-resourcetermination"
                            label="Time period until"
                        />

                        <div className="row mt-4">
                            <div className="col">
                                <h4>Resources:</h4>
                            </div>
                        </div>
                        {dynamicResources.map(
                            ({
                                Id,
                                Name,
                                HostName,
                                PerformanceCoefficient,
                                QueueList,
                            }) => (
                                <div
                                    key={Id}
                                    id={`dynamic-resource-item-${Id}`}
                                    className="row">
                                    <div className="col">
                                        <div
                                            className="form-group has-label"
                                            cy="resource-dynamic-form-containerselection">
                                            <label
                                                htmlFor={
                                                    Id
                                                }>{`${Name} (${HostName})`}</label>
                                            <FieldArray
                                                name="Resources"
                                                component={
                                                    RenderDynamicResourceQueue
                                                }
                                                queueList={QueueList}
                                                performanceCoefficient={
                                                    PerformanceCoefficient
                                                }
                                                cy="resource-dynamic-form-selection"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                        <ReduxFormCheckboxField
                            name="TermsConsent"
                            label="I declare that the information provided by me is correct, that I have read the contents of the Contract on the use of high performance cluster and agree to its terms."
                            required={true}
                            cy="resource-dynamic-form-termsconsent"
                        />
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit"
                            cy="resource-dynamic-form-btn-submit">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            Request
                        </button>
                        <button
                            type="button"
                            className="btn btn-info btn-simple text-nowrap ml-1"
                            onClick={goBack}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-remove"></i>
                            </span>{" "}
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
)

const mapStateToProps = state => ({
    dynamicResources: getComputerResources(state),
    hpcProviders: ["IT4I", "LRZ"],
    project: getProjectDetail(state),
})

ResourceDynamicFormImpl = connect(
    mapStateToProps,
    null
)(ResourceDynamicFormImpl)

export const ResourceDynamicForm = reduxForm({
    validate: validate,
})(ResourceDynamicFormImpl)
