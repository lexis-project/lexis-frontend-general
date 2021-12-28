import React from "react"
import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormSelectField } from "../../forms/select-field"
// import { validateStage } from "../stage-form-validation"
import config from "../../../config"

const goBack = () => window.history.back()

const StageFormImpl = ({
    stagingZones,
    initialValues,
    handleSubmit,
    onFormSubmit,
    dataSet,
}) => (
    <div className="row">
        <div className="col-12">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <p>Dataset&apos;s title:</p>
                        </div>
                        <div className="col-8">
                            <p>{dataSet.metadata.title}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <p>Dataset&apos;s zone:</p>
                        </div>
                        <div className="col-8">
                            <p>
                                {dataSet.location.zone} (currently only{" "}
                                <em>{config.DSzonesToiRODSzones[initialValues.source_system]}</em> system
                                available)
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <p>Dataset&apos;s project:</p>
                        </div>
                        <div className="col-8">
                            <p>{dataSet.location.project}</p>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "stage-form": true,
                        })}>
                        <div className="row">
                            <div className="col-6">
                                <ReduxFormSelectField
                                    label="Source System"
                                    values={[dataSet.location.zone]}
                                    required={true}
                                    name="source_system"
                                    cy="datasets-stage-form-source-system"
                                />
                                {/* later might be useful
                                    <ReduxFormInputField
                                        type="text"
                                        name="source_path"
                                        label="Source Path"
                                        placeholder="Please enter path"
                                        cy="datasets-stage-form-source-path"
                                        initialValue={initialValues.source_path}
                                        disabled
                                    /> */}
                            </div>
                            <div className="col-6">
                                <ReduxFormSelectField
                                    label="Target System"
                                    values={stagingZones}
                                    required={true}
                                    name="target_system"
                                    cy="datasets-stage-form-target-system"
                                />
                                {/* later might be useful
                                    <ReduxFormInputField
                                        type="text"
                                        name="target_path"
                                        label="Target Path"
                                        placeholder="Please enter path"
                                        cy="datasets-stage-form-target-path"
                                        initialValue={initialValues.target_path}
                                        disabled
                                    /> */}
                            </div>
                        </div>
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit"
                            cy="datasets-stage-form-btn-submit">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            Save
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

export const StageForm = reduxForm({ /* validate: validateStage*/ })(StageFormImpl)
