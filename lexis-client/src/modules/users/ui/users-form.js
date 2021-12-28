import React, { useEffect } from "react"
import { connect } from "react-redux"
import cx from "classnames"

import { reduxForm, getFormValues, change } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validate } from "../users-form-validation"
import { ReduxFormSelectField } from "../../forms/select-field"

import {
    getFirstName,
    getLastName,
    getEmail,
    getLoginUsername,
} from "./../users-selectors"

const goBack = () => window.history.back()

export const UsersFormImpl = props => {
    let {
        handleSubmit,
        onFormSubmit,
        formVals,
        // immediateFirstName,
        // immediateLastName,
        // immediateEmailAddress
        allowedOrganizations,
        organizationId,
        organizations,
    } = props

    const allOrgIds = allowedOrganizations
        ? [organizationId, ...allowedOrganizations]
        : organizationId
            ? [organizationId]
            : []
    const organizationsNames = organizations
        ? allOrgIds.map(id => organizations[id].FormalName)
        : []
    let isAnyAllowedOrgs =
        allowedOrganizations &&
        allowedOrganizations &&
        allowedOrganizations.length > 0

    let username = ""
    let lastNameVal = ""
    let firstNameVal = ""
    let emailAddressVal = ""
    formVals = formVals && formVals

    if (formVals && formVals.LastName !== undefined) {
        lastNameVal = formVals && formVals.LastName.substring(0, 2)
        firstNameVal = formVals && formVals.FirstName
        emailAddressVal = formVals && formVals.EmailAddress
    }

    username = firstNameVal + "" + lastNameVal
    username = username === undefined ? null : username.toLocaleLowerCase()

    // TODO FIXME for quickly inputed form fields utilize new React Hooks like this one useEffect
    // TODO FIXME improve A LOT things like: racing, concurrency, spawning, debouncing, parallelization of Saga side effects; 200 % better use all what's redux-saga offers
    // TODO FIXME prevent re-rendering and impossibility of updating of nested componenets are the most exhaustive performance issues in React; HELP can be found here: https://github.com/dai-shi/will-this-react-global-state-work-in-concurrent-rendering

    /*
    useEffect(() => {
            changedFirstnameOnBlur()
            console.log("changedFirstnameOnBlur():::", changedFirstnameOnBlur())
            console.log(`immediate values: ${JSON.stringify(immediateFirstName)} ${immediateLastName}`)
    }, [immediateFirstName, immediateLastName])
    */

    /*
    // eslint-disable-next-line no-console
    console.log("immediateFirstName::::", immediateFirstName)
    const changedFirstnameOnBlur = () => {
        change("user-create", "FirstName", immediateFirstName)
    }
    // eslint-disable-next-line no-console
    console.log("changedFirstnameOnBlur::::", changedFirstnameOnBlur)
    let RETURNS_AC
    RETURNS_AC = {
        "type": "@@redux-form/CHANGE",
        "meta": {
            "form": "user-create",
            "field": "FirstName"
        },
        "payload": "mathematician"
    }
    */

    return (
        <>
            <div className="row">
                <div className="col-9">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <form
                                onSubmit={handleSubmit(onFormSubmit)}
                                className={cx({
                                    "users-form": true,
                                })}>
                                <ReduxFormInputField
                                    type="text"
                                    name="FirstName"
                                    label="First Name"
                                    placeholder="Please enter the first name..."
                                    // TODO FIXME onChange={changedFirstnameOnBlur}
                                />
                                <ReduxFormInputField
                                    type="text"
                                    name="LastName"
                                    label="Last Name"
                                    placeholder="Please enter the last name..."
                                />
                                <ReduxFormInputField
                                    type="email"
                                    name="EmailAddress"
                                    label="Email Address"
                                    placeholder="Please enter an email address..."
                                />
                                {organizationId && organizations && (
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
                                            organizations[organizationId]
                                                .FormalName
                                        }
                                        required={true}
                                        name="OrganizationID"
                                        cy="create-user-organization-selector"
                                        disabled={!isAnyAllowedOrgs}
                                    />
                                )}

                                {/* 
                                // TODO FIXME - probably completely remove
                                <div className="card bg-dark text-white mt-4">
                                    <div className="card-body">
                                        <h4 className="card-title mb-3">
                                            The new user is welcomed to the new
                                            LEXIS Portal, thank you for
                                            registering!
                                        </h4>
                                        <h6 className="card-subtitle mt-4 text-muted">
                                            The user choosed the following login
                                            information. Please, be aware that
                                            the username is determined
                                            automatically and subject to no
                                            changes in a future.
                                            <table className="table mt-4">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>E-mail</th>
                                                        <th className="text-right">
                                                            Username
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-uppercase">
                                                            {firstNameVal}
                                                        </td>
                                                        <td className="text-uppercase">
                                                            {lastNameVal}
                                                        </td>
                                                        <td>
                                                            <a
                                                                href={`mailto:${emailAddressVal}`}
                                                                target="_blank"
                                                                rel="noreferrer">
                                                                {
                                                                    emailAddressVal
                                                                }
                                                            </a>
                                                        </td>
                                                        <td className="text-right text-lowercase">
                                                            {username}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </h6>
                                        <p className="card-text"></p>
                                    </div>
                                </div> */}

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
        </>
    )
}

const mapStateToProps = state => {
    const firstname = getFirstName(state)
    const lastname = getLastName(state)
    const email = getEmail(state)
    const loginUsername = getLoginUsername(state)

    return {
        // TODO FIXME inform user about eerrors during filling-in the form: getFormSyncErrors()(state),
        formVals: getFormValues("user-create")(state),
        // TODO FIXME get
        immediateFirstName: change("user-create", "FirstName", firstname).meta
            .field,
        immediateLasttName: change("user-create", "LasttName", email).meta
            .field,
        immediateEmailAddress: change(
            "user-create",
            "EmailAddress",
            loginUsername
        ).meta.field,
    }
}

// TODO MAYBE all the forms refactor and provide with async changes SERVER validation; viz https://redux-form.com/8.2.2/examples/asyncchangevalidation/ but NOT redux-form
// TODO FIXME add cancel task for "@@redux-form/UPDATE_SYNC_ERRORS"; it's flooded with actions
// TODO FIXME maybe also think of removing redux-form which stopped being developed; huge POTENTIONAL RISK!!!

const UsersReduxFormImpl = reduxForm({
    form: "user-create",
    validate: validate,
    asyncBlurFields: ["FirstName", "LastName", "EmailAddress", "Username"],
})(UsersFormImpl)

export const UsersForm = connect(mapStateToProps, null)(UsersReduxFormImpl)
