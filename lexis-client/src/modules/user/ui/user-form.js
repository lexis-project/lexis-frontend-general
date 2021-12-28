import React from "react"
import cx from "classnames"
import { reduxForm } from "redux-form"

import { ReduxFormInputField } from "../../forms/input-field"
import { validate } from "../user-form-validation"

const goBack = () => window.history.back()

const UserPageFormImpl = ({ handleSubmit, onFormSubmit }) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "user-form": true,
                        })}>
                        <ReduxFormInputField
                            type="text"
                            name="FirstName"
                            label="First Name"
                            placeholder="Please enter your first name..."
                        />
                        <ReduxFormInputField
                            type="text"
                            name="LastName"
                            label="Last Name"
                            placeholder="Please enter your last name..."
                        />
                        <ReduxFormInputField
                            type="text"
                            name="EmailAddress"
                            label="Email Address"
                            placeholder="Please enter your email address..."
                        />
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit">
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

export const UserPageForm = reduxForm({ validate: validate })(UserPageFormImpl)
