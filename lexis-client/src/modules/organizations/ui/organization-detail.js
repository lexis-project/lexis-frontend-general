import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import { ROUTE_ORGANIZATIONS_EDIT, ROUTE_ORGANIZATION_DETAIL } from "../../routing/routes"
import { getOrganizationDetail } from "../organizations-selectors"
import AuthCheckPermission from "../../auth/auth-check-perms"
import { getUserRole } from "../../auth/auth-selectors"
import { CheckOrgWritePerms } from "../../auth/auth-check-fine-perms"
import { getAllowedOrganizations, getOrganizationId } from "../../user/user-selectors"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"

export const OrganizationDetailImpl = ({
    gotoRoute,
    organizationDetail,
    userRole,
    allowedOrganizations,
    userOrganization,
    organizations
}) => {
    const website = /^http(s?):\/\//.test(organizationDetail.Website)
        ? organizationDetail.Website
        : `https://${organizationDetail.Website}`
    const allUserOrgs = allowedOrganizations ? [userOrganization, ...allowedOrganizations] : [userOrganization]
    return (
        <Fragment>
            {organizations && allowedOrganizations && allowedOrganizations.length > 0 && (
                <div className="row mb-3">
                    {allUserOrgs.filter((orgID)=>orgID !== organizationDetail.ID).map((orgID)=> (
                        <div className="ml-2" key={orgID}>
                            <button
                                type="button"
                                className="btn btn-success btn-simple text-nowrap"
                                onClick={() =>
                                    gotoRoute(ROUTE_ORGANIZATION_DETAIL, {
                                        Id: orgID,
                                    })
                                }
                                cy="organization-btn-detail">
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-settings"></i>
                                </span>{" "}
                                {organizations[orgID].FormalName ? organizations[orgID].FormalName : orgID}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="row">
                <div className="col">
                    <h1>Organization</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <p>Name:</p>
                                </div>
                                <div
                                    className="col"
                                    cy="organization-detail-name-submit-result">
                                    <p>{organizationDetail.FormalName}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>ID:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <code>{organizationDetail.ID}</code>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Address:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        {organizationDetail.RegisteredAddress1}
                                    </p>
                                </div>
                            </div>
                            {organizationDetail.RegisteredAddress2 && (
                                <div className="row">
                                    <div className="col-4" />
                                    <div className="col">
                                        <p>
                                            {
                                                organizationDetail.RegisteredAddress2
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                            {organizationDetail.RegisteredAddress3 && (
                                <div className="row">
                                    <div className="col-4" />
                                    <div className="col">
                                        <p>
                                            {
                                                organizationDetail.RegisteredAddress3
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-4">
                                    <p>Country:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        {organizationDetail.RegisteredCountry}
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Website:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <a
                                            href={"" + website}
                                            target="_blank"
                                            rel="noreferrer noopener">
                                            {website}
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Email:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <a
                                            href={
                                                "mailto:" +
                                                organizationDetail.OrganizationEmailAddress
                                            }>
                                            {
                                                organizationDetail.OrganizationEmailAddress
                                            }
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Telephone:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <a
                                            href={
                                                "tel:" +
                                                organizationDetail.PrimaryTelephoneNumber
                                            }>
                                            {
                                                organizationDetail.PrimaryTelephoneNumber
                                            }
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <div className="col-10">
                    <div
                        className="btn-toolbar"
                        role="toolbar"
                        aria-label="Toolbar with button groups">
                        <CheckOrgWritePerms orgID={organizationDetail.ID}>
                            <button
                                type="button"
                                className="btn btn-success btn-simple text-nowrap"
                                onClick={() =>
                                    gotoRoute(ROUTE_ORGANIZATIONS_EDIT, {
                                        Id: organizationDetail.ID,
                                    })
                                }
                                cy="organization-btn-update">
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-settings"></i>
                                </span>{" "}
                                Edit
                            </button>
                        </CheckOrgWritePerms>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

const mapStateToProps = state => ({
    organizationDetail: getOrganizationDetail(state),
    userRole: getUserRole(state),
    allowedOrganizations: getAllowedOrganizations(state),
    userOrganization: getOrganizationId(state),
    organizations: getOrganizations(state),
})

export const OrganizationDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizationDetailImpl)
