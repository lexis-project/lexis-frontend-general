import React from "react"
import { connect } from "react-redux"

import { getProjectsHPCResourcesRequestDetail } from "../resources-requests-selectors"
import { getProjectShortName } from "../../projects-selectors"

const formatDate = date => new Date(date).toLocaleDateString()
const goBack = () => window.history.back()

export const ResourcesRequestsDetailImpl = ({
    resourceRequest,
    projectShortName,
}) => (
    <>
        <div className="row">
            <div className="col">
                <h1>Resources Request Detail</h1>
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-4">
                                <p>Resources Request ID:</p>
                            </div>
                            <div className="col-8">
                                <p>
                                    <code>
                                        {resourceRequest.HPCResourceRequestID}
                                    </code>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>Approval Status:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-approvalstatus">
                                <p>
                                    <em>{resourceRequest.ApprovalStatus}</em>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>LEXIS Project Name:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-lexisprojectname">
                                <p>{resourceRequest.LEXISProjectName}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>LEXIS Project ID:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-lexisprojectid">
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
                                <p>Primary Investigator email:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-primaryinvestigator">
                                <p>
                                    <a
                                        href={`mailto:${resourceRequest.PrimaryInvestigator}`}>
                                        {resourceRequest.PrimaryInvestigator}
                                    </a>
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
                                <p>Core Hours Expected:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-corehoursexpected">
                                <p>{resourceRequest.CoreHoursExpected}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>Budget:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-budget">
                                <p>{resourceRequest.Budget}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>From:</p>
                            </div>
                            <div className="col-8">
                                <p>{formatDate(resourceRequest.DateStart)}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p>Until:</p>
                            </div>
                            <div className="col-8">
                                <p>{formatDate(resourceRequest.DateEnd)}</p>
                            </div>
                        </div>
                        {resourceRequest.ApprovalObjections && (
                            <div className="row">
                                <div className="col-4">
                                    <p>Objections:</p>
                                </div>
                                <div className="col-8">
                                    <p>{resourceRequest.ApprovalObjections}</p>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <div className="col-4">
                                <p>Terms Consent:</p>
                            </div>
                            <div
                                className="col-8"
                                cy="resourcesrequests-detail-termsconsent">
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
                        <h4>Resources Request:</h4>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-top">
                                            Cluster Name
                                        </th>
                                        <th className="align-top">
                                            Queue Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resourceRequest.Resources.map(
                                        ({ ClusterName, QueueName }, index) => (
                                            <tr key={index}>
                                                <td>{ClusterName}</td>
                                                <td>
                                                    {QueueName === "qexp"
                                                        ? "Express queue"
                                                        : "Production queue"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
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
    resourceRequest: getProjectsHPCResourcesRequestDetail(state),
    projectShortName: getProjectShortName(state),
})

export const ResourcesRequestsDetail = connect(
    mapStateToProps,
    null
)(ResourcesRequestsDetailImpl)
