import React from "react"
import cx from "classnames"
import { reduxForm } from "redux-form"
import { connect } from "react-redux"

import { ReduxFormCheckboxField } from "../../../forms/checkbox-field"
import { ReduxFormSelectField } from "../../../forms/select-field"
import { ReduxFormInputField } from "../../../forms/input-field"
import { validate } from "../resources-form-approved-validation"
import { getProjectDetail } from "../../projects-selectors"
import config from "../../../../config"

const goBack = () => window.history.back()

let ApprovedResourceRequestFormImpl = ({
    handleSubmit,
    onFormSubmit,
    usersEmails
}) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "resource-approved-form": true,
                        })}>
                        <ReduxFormInputField
                            name="PrimaryInvestigator"
                            type="email"
                            label="Primary Investigator Email"
                            cy="resource-approved-form-pi"
                            placeholder="Please enter an email of primary investigator..."
                        />
                        <ReduxFormSelectField
                            name="ProjectContactEmail"
                            label="Project Contact Person (her/his email)"
                            displayNames={usersEmails}
                            values={usersEmails}
                            cy="resource-approved-form-contact"
                            placeholder="Please select user as a main contact person for this resource request..."
                        />
                        <ReduxFormSelectField
                            name="HPCProvider"
                            label="HPC Center"
                            displayNames={config.hpcProviders}
                            values={config.hpcProviders}
                            cy="resource-approved-form-hpcprovider"
                            placeholder="Please select a HPC providing center..."
                        />
                        <ReduxFormInputField
                            name="AssociatedHPCProject"
                            type="text"
                            label="Existing HPC Project"
                            cy="resource-approved-form-hpcproject"
                            placeholder="Please enter an ID of existing HPC project which the request will be associated with..."
                        />
                        <ReduxFormCheckboxField
                            name="TermsConsent"
                            label="I declare that the information provided by me is correct, that I have read the contents of the Contract on the use of high performance cluster and agree to its terms."
                            required={true}
                            cy="resource-approved-form-termsconsent"
                        />
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit"
                            cy="resource-approved-form-btn-submit">
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
    project: getProjectDetail(state),
})

ApprovedResourceRequestFormImpl = connect(
    mapStateToProps,
    null
)(ApprovedResourceRequestFormImpl)

export const ApprovedResourceRequestForm = reduxForm({ validate: validate })(
    ApprovedResourceRequestFormImpl
)
