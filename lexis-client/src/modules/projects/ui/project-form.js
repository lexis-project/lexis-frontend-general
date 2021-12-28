import React from "react"
import cx from "classnames"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"
import { getFormSyncErrors, getFormValues, reduxForm } from "redux-form"

import { ReduxFormInputField } from "../../forms/input-field"
import { ReduxFormSelectField } from "../../forms/select-field"
import { ReduxFormCheckboxField } from "../../forms/checkbox-field"
import { ReduxFormTextAreaField } from "../../forms/textarea-field"
import { validate } from "../projects-form-validation"
import { ReduxFormInputFieldDatePicker } from "../../forms/input-field-date-picker"
import { ROUTE_USERS_LIST } from "../../routing/routes"
import { getUsersEmails } from "../../users/users-selectors"
import { getAllowedOrganizations, getOrganizationId, getOrganizationName } from "../../user/user-selectors"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"
import { getUserRole } from "../../auth/auth-selectors"


const goBack = () => window.history.back()
const dateNow = new Date()
dateNow.setUTCHours(0,0,0,0)
const startDate = new Date(dateNow)
startDate.setUTCDate(dateNow.getUTCDate()+1)
const termDate = new Date(dateNow)
termDate.setUTCDate(dateNow.getUTCDate()+2)

const ProjectFormImplementation = ({
    handleSubmit,
    onFormSubmit,
    submitting,
    initialValues,
    domainsPossible,
    form,
    error,
    gotoRoute,
    projectShortName,
    usersEmails,
    formVals,
    errors,
    allowedOrganizations, organizationId, organizations, editForm, userRole, currentOrg
}) => {
    let minDate = new Date(dateNow)
    if (formVals && formVals["ProjectStartDate"] !== undefined )
        minDate.setUTCDate(new Date(formVals["ProjectStartDate"]).getUTCDate()+1)
    else
        minDate = new Date(termDate)
    let allOrgIds =  allowedOrganizations ? [organizationId,...allowedOrganizations] : (organizationId ? [organizationId] : [])
    //allOrgIds = allOrgIds.filter(id=>organizations[id])
    let organizationsNames = organizations ? allOrgIds.map((id)=> organizations[id].FormalName) : allOrgIds
    let isAnyAllowedOrgs = allowedOrganizations && (allowedOrganizations && allowedOrganizations.length > 0)

    return (
        <div className="row">
            <div className="col-9">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <form
                            onSubmit={handleSubmit(onFormSubmit)}
                            className={cx({
                                "project-form": true,
                            })}>
                            <ReduxFormInputField
                                name="ProjectName"
                                type="text"
                                label="Name"
                                placeholder="Please enter a name of the project..."
                                cy="project-form-projectname"
                            />
                            {!projectShortName ? (
                                <ReduxFormInputField
                                    name="ProjectShortName"
                                    label="Project Shortname"
                                    placeholder="Please enter a shortname of your project..."
                                    cy="project-form-projectshortname"
                                />
                            ) : null}
                            <ReduxFormTextAreaField
                                name="ProjectDescription"
                                label="Description"
                                placeholder="Please describe your project..."
                                cy="project-form-projectdescription"
                            />
                            {editForm ? null : (
                                <ReduxFormSelectField
                                    name="ProjectContactEmail"
                                    label="Project Contact Email"
                                    displayNames={usersEmails}
                                    values={usersEmails}
                                    cy="project-form-projectcontactemail"
                                    placeholder="Please select user as a main contact person for the project..."
                                />
                            )}
                            {/* <ProjectusersList /> */}
                            <ReduxFormSelectField
                                name="ProjectDomain"
                                label="Domain"
                                placeholder="Please select project domain..."
                                required={false}
                                values={domainsPossible}
                                cy="project-form-projectdomain"
                            />
                            {(userRole === "org_mgr") && organizationId && organizations ? (
                                <ReduxFormSelectField
                                    label="Organization"
                                    displayNames={organizationsNames}
                                    values={allOrgIds}
                                    placeholder="Please select an organization"
                                    fixedValue={
                                        isAnyAllowedOrgs
                                            ? undefined
                                            : organizationId
                                    }
                                    fixedValueName={
                                        organizations[organizationId] &&
                                        organizations[organizationId].FormalName
                                    }
                                    required={true}
                                    name="LinkedOrganization"
                                    cy="create-user-organization-selector"
                                    disabled={!isAnyAllowedOrgs}
                                />
                            ) :
                                (
                                    <ReduxFormSelectField
                                        label="Your Organization"
                                        displayNames={[currentOrg]}
                                        values={[organizationId]}
                                        placeholder="Please select your organization"
                                        // fixedValue={
                                        //     isAnyAllowedOrgs
                                        //         ? undefined
                                        //         : organizationId
                                        // }
                                        // fixedValueName={
                                        //     organizations[organizationId] &&
                                        //     organizations[organizationId].FormalName
                                        // }
                                        required={true}
                                        name="LinkedOrganization"
                                        cy="create-user-organization-selector"
                                        // disabled={!isAnyAllowedOrgs}
                                    />
                                )
                            }

                            <ReduxFormInputFieldDatePicker
                                formName={form}
                                name="ProjectStartDate"
                                showTime={false}
                                cy="project-form-projectstartdate"
                                label="Start"
                                currentDate={startDate}
                                minDate={startDate}
                            />
                            <ReduxFormInputFieldDatePicker
                                formName={form}
                                name="ProjectTerminationDate"
                                showTime={false}
                                cy="project-form-projecttermination"
                                label="Termination"
                                currentDate={termDate}
                                minDate={minDate}
                            />
                            <ReduxFormCheckboxField
                                name="ProjectTermConsent"
                                label="I declare that the information provided by me is correct, that I have read the contents of the Contract on the use of high performance cluster and agree to its terms."
                                required={true}
                                cy="project-form-termsconsent"
                            />
                            {error && (
                                <div className="row">
                                    <div className="col">
                                        <div
                                            className="alert alert-danger"
                                            role="alert">
                                            <h4 className="alert-heading">
                                                {error}
                                            </h4>
                                            <p>
                                                Choose an existing user email
                                                from
                                                <button
                                                    type="button"
                                                    className="btn btn-link text-nowrap"
                                                    variant="link"
                                                    onClick={() =>
                                                        gotoRoute(
                                                            ROUTE_USERS_LIST
                                                        )
                                                    }>
                                                    the list.
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button
                                className="btn btn-success btn-simple text-nowrap mr-1"
                                type="submit"
                                disabled={
                                    submitting || Object.keys(errors).length > 0
                                }
                                cy="project-form-btn-submit">
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-simple-add"></i>
                                </span>{" "}
                                {initialValues
                                    ? "Save and edit users of the project"
                                    : "Create and add users into the project"}
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
                            <div className="row">
                                <div className="col">
                                    <p>
                                        Once you request the creation of a new
                                        project, a waiting time of 10 minutes is
                                        needed to ensure that the information
                                        has propagated to all sites and your
                                        project is setup.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )}

const mapStateToProps = state => {
    const userRole = getUserRole(state)
    const currentOrg = getOrganizationName(state)

    return {
        domainsPossible: [
            "Natural Sciences",
            "Engineering and Technology",
            "Medical and Health Sciences",
            "Agricultural and Veterinary Sciences",
            "Social Sciences",
            "Humanities and the Arts",
            "Others",
        ],
        usersEmails: getUsersEmails(state),
        formVals: getFormValues("project-create")(state),
        errors: getFormSyncErrors("project-create")(state),
        allowedOrganizations: getAllowedOrganizations(state),
        organizationId: getOrganizationId(state),
        organizations: getOrganizations(state),
        userRole: userRole,
        currentOrg: currentOrg
    }
}

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

export const ProjectForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(
    reduxForm({
        validate: validate,
        //enableReinitialize: true,
        initialValues: {"ProjectStartDate":startDate,
            "ProjectTerminationDate":termDate}
    })(ProjectFormImplementation)
)
