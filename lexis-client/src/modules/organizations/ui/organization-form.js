import React from "react"
import cx from "classnames"
import { reduxForm } from "redux-form"

import { ReduxFormInputField } from "../../forms/input-field"
import { validate } from "../organizations-form-validation"

const goBack = () => window.history.back()

const OrganizationFormImpl = ({ handleSubmit, onFormSubmit }) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "organization-form": true,
                        })}
                        cy="organization-form">
                        <ReduxFormInputField
                            type="text"
                            name="FormalName"
                            label="Name"
                            placeholder="Please enter an organization name..."
                            cy="organization-form-name"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="RegisteredAddress1"
                            label="Address"
                            placeholder="Please enter an address of your organization..."
                            cy="organization-form-address1"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="RegisteredAddress2"
                            label=" "
                            cy="organization-form-address2"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="RegisteredAddress3"
                            label=" "
                            cy="organization-form-address3"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="RegisteredCountry"
                            label="Country"
                            placeholder="Please enter an organization's country..."
                            cy="organization-form-country"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Website"
                            label="Website"
                            placeholder="Please enter a website of your organization..."
                            cy="organization-form-website"
                        />
                        <ReduxFormInputField
                            type="email"
                            name="OrganizationEmailAddress"
                            label="E-mail"
                            placeholder="Please enter an e-mail address of your organization..."
                            cy="organization-form-emailaddress"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="PrimaryTelephoneNumber"
                            label="Telephone"
                            placeholder="Please enter an organization's phone number..."
                            cy="organization-form-telephonenumber"
                        />
                        <button
                            type="submit"
                            cy="organization-form-btn-submit"
                            className="btn btn-success btn-simple text-nowrap mr-1">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={goBack}
                            className="btn btn-info btn-simple text-nowrap ml-1">
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

export const OrganizationForm = reduxForm({ validate: validate })(
    OrganizationFormImpl
)
