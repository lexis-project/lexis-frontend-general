import React from "react"
import cx from "classnames"
import { reduxForm } from "redux-form"

import { ReduxFormSelectField } from "../../../forms/select-field"
import { ReduxFormInputField } from "../../../forms/input-field"
import { validateStage } from "../stage-form-validation"
import config from "../../../../config"

const goBack = () => window.history.back()

const StageFormImpl = ({
    handleSubmit,
    onFormSubmit,
    dataSet,
}) => (
    <div className="row">
        <div className="col-12">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    {dataSet ? (
                        <>
                            <div className="row">
                                <div className="col-4">
                                    <p>Dataset&apos;s original title:</p>
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
                                    <p>{dataSet.location.zone}</p>
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
                                    <div className="col-12">
                                        <ReduxFormInputField
                                            type="text"
                                            name="title"
                                            label="Title of duplicated dataset"
                                            placeholder="Please enter title"
                                            cy="datasets-stage-form-title"
                                            initialValue={
                                                dataSet.metadata.title
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <ReduxFormSelectField
                                            label="Source System"
                                            displayNames={[dataSet.location.zone]}
                                            values={[
                                                config.DSzonesToiRODSzones[
                                                    dataSet.location.zone
                                                ],
                                            ]}
                                            required={true}
                                            name="source_system"
                                            cy="datasets-stage-form-source-system"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <ReduxFormSelectField
                                            label="Target System"
                                            displayNames={config.avaliableDSZones}
                                            values={config.avaliableDSZones.map((zone) => config.DSzonesToiRODSzones[zone])}
                                            required={true}
                                            name="target_system"
                                            cy="datasets-stage-form-target-system"
                                        />
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
                        </>
                    ) : (
                        <div className="row">
                            <div className="col-12 text-center">
                                <div
                                    className="spinner-border text-light ml-2"
                                    role="status"
                                    style={{ marginTop: "20vh" }}></div>
                                <h5 className="mt-3">Loading...</h5>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
)

export const StageForm = reduxForm({ validate: validateStage })(StageFormImpl)
