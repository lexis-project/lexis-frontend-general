import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { ReduxFormSelectField } from "../../forms/select-field"
//import { validateStageDelete } from "../stage-form-validation"

const goBack = () => window.history.back()

const StageDeleteFormImpl = ({
    stagingZones,
    initialValues,
    handleSubmit,
    onFormSubmit,
    onFormSubmitMeta,
}) =>
    stagingZones === undefined ? (
        <p>Waiting for retrieval of Staging Zones</p>
    ) : (
        <div className="card">
            <div className="card-header"></div>
            <div className="card-body">
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className={cx({
                        "stage-delete-form": true,
                    })}>
                    <ReduxFormSelectField
                        label="Target System"
                        values={stagingZones}
                        required={true}
                        name="target_system"
                        cy="datasets-stage-delete-form-target-system"
                        initialValue={
                            initialValues === undefined
                                ? undefined
                                : initialValues.target_system
                        }
                    />
                    <ReduxFormInputField
                        type="text"
                        name="target_path"
                        label="Target Path"
                        cy="datasets-stage-delete-form-target-path"
                        placeholder="Please enter path"
                        initialValue={
                            initialValues === undefined
                                ? undefined
                                : initialValues.target_path
                        }
                    />
                    <button
                        className="btn btn-success btn-simple text-nowrap mr-1"
                        type="submit"
                        cy="datasets-stage-delete-form-btn-submit">
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
    )

export const StageDeleteForm = reduxForm({ /*validate: validateStageDelete */ })(
    StageDeleteFormImpl
)
