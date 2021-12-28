import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateDelete } from "../delete-form-validation"

const DeleteFormImpl = ({ random, handleSubmit, onFormSubmit }) => (
    <div className="card">
        <div className="card-header"></div>
        <div className="card-body">
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className={cx({
                    "delete-form": true,
                })}>
                <ReduxFormInputField
                    type="text"
                    name="verifier"
                    label={
                        "Enter " + random + " to delete datasets shown below"
                    }
                    placeholder="Please enter value"
                />
                <button
                    className="btn btn-info btn-simple text-nowrap mx-1"
                    type="submit">
                    <span className="white d-inline-flex mx-1">
                        <i className="tim-icons icon-trash-simple"></i>
                    </span>{" "}
                    Delete all datasets shown below (subject to permissions)
                </button>
            </form>
        </div>
    </div>
)

export const DeleteForm = reduxForm({ validate: validateDelete })(
    DeleteFormImpl
)
