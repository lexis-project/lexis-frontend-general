import React from "react"
import { connect } from "react-redux"

import { getProjectsHPCApprovedResourcesRequestDetail } from "../resources-requests-selectors"
import { getProjectShortName } from "../../projects-selectors"

const goBack = () => window.history.back()

export const ApprovedResourcesRequestsDetailImpl = ({
    resourceRequest,
    projectShortName,
}) => (
    <>
        <div className="row">
            <div className="col">
                <h1>Approved Resources Request Detail</h1>
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-4">
                                <p>Approved Resources Request ID:</p>
                            </div>
                            <div className="col-8">
                                <p>
                                    <code>{resourceRequest.HPCResourceID}</code>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>Approval Status:</p>
                            </div>
                            <div className="col-8">
                                <p>
                                    <em>{resourceRequest.ApprovalStatus}</em>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>LEXIS Project Name:</p>
                            </div>
                            <div className="col-8">
                                <p>{resourceRequest.LEXISProjectName}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>LEXIS Project ID:</p>
                            </div>
                            <div className="col-8">
                                <p>
                                    <code>
                                        {resourceRequest.LEXISProjectID}
                                    </code>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>Project Shortname:</p>
                            </div>
                            <div className="col">
                                <p>
                                    <code>{projectShortName}</code>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>LEXIS Project Manager:</p>
                            </div>
                            <div className="col-8">
                                <p>
                                    <a
                                        href={`mailto:${resourceRequest.ProjectContactEmail}`}>
                                        {resourceRequest.ProjectContactEmail}
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>Terms Consent:</p>
                            </div>
                            <div className="col-8">
                                <p>{"" + resourceRequest.TermsConsent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h4>HPC Project ID:</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div
                                className="col"
                                cy="approved-resourcesrequests-detail-hpcproject">
                                <p>
                                    <code>{resourceRequest.HPCProjectID}</code>
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
                    <button
                        type="button"
                        className="btn btn-success btn-link text-nowrap"
                        onClick={goBack}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    </>
)

const mapStateToProps = state => ({
    resourceRequest: getProjectsHPCApprovedResourcesRequestDetail(state),
    projectShortName: getProjectShortName(state),
})

export const ApprovedResourcesRequestsDetail = connect(
    mapStateToProps,
    null
)(ApprovedResourcesRequestsDetailImpl)
