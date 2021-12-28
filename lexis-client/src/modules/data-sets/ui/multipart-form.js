import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateMulti } from "../multipart-form-validation"

const goBack = () => window.history.back()

const MultipartFormImpl = ({ initialValues, handleSubmit, onFormSubmit }) => (
    <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cx({
            "multipart-form": true,
        })}>
        <ReduxFormInputField
            type="text"
            name="size"
            label="Maximum size of each part in megabytes"
            cy="dataset-multipart-size"
            placeholder="Please enter size"
            initialValue={
                initialValues === undefined ? undefined : initialValues.size
            }
        />
        <button
            className="btn btn-success btn-simple text-nowrap mr-1"
            type="submit"
            cy="dataset-multipart-btn-save">
            <span className="white d-inline-flex mx-1">
                <i className="tim-icons icon-cloud-download-93"></i>
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
)

export const MultipartForm = reduxForm({ validate: validateMulti })(
    MultipartFormImpl
)
