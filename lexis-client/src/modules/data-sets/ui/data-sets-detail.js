import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import Actions from "../data-sets-actions"

import { getDataSetDetail } from "../data-sets-selectors"
import { getUserName } from "../../auth/auth-selectors"
import { getProjects } from "../../projects/projects-selectors"
import styleActions from "../../interactiveStyle/interactive-style-actions"
import { Gridftp } from "../gridftp"
import { DataSetsNav } from "./data-sets-nav"

import {
    ROUTE_DATA_SETS_UPDATE_META,
    ROUTE_DATA_SETS_LIST,
    ROUTE_DATA_SETS_FILELIST,
} from "../../routing/routes"

import { ProjectButton } from "./data-sets-project-button"
import { getFlag } from "./table/data-sets-list-table"
import {
    CheckFineReadPermsComp,
    CheckFineWritePermsComp,
} from "../../auth/auth-check-fine-perms"

const b = (c, field, submitMetadataQuery, gotoRoute) => (
    <button
        type="button"
        className="d-none btn btn-success btn-simple text-nowrap ml-1 p-1"
        onClick={() => {
            let s = {}
            s[field] = c
            submitMetadataQuery(s)
            return gotoRoute(ROUTE_DATA_SETS_LIST)
        }}>
        <span className="white d-inline-flex mx-1">
            <i className="tim-icons icon-zoom-split"></i>
        </span>
        Query
    </button>
)

function showAltId(a, field, submitMetadataQuery, gotoRoute) {
    if (a === undefined || a.length === 0)
        return (
            <div className="col-8">
                <p>None</p>
            </div>
        )
    return (
        <div className="col-8">
            <ul className="nav flex-column">
                {a.map((c, i) => (
                    <li
                        className="nav-item"
                        key={i}
                        style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        Type: {c[0]}; Identifier: {c[1]}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function showArray(title, a, field, submitMetadataQuery, gotoRoute) {
    if (a === undefined || a.length === 0) return null
    return (
        <div className="row">
            <div className="col-4">
                <p>{title}</p>
            </div>
            <div className="col-8">
                <p>
                    {a
                        .reduce((acc, currentVal) => acc.concat(currentVal), [])
                        .join(", ")}
                </p>
            </div>
        </div>
    )
}

function show(a, field, submitMetadataQuery, gotoRoute, elementType, cy) {
    if (a === undefined) {
        return null
    } else if (a !== undefined) {
        switch (elementType) {
        case "neither":
            return (
                <div className="col-8">
                    <p cy={`${cy}`}>{a}</p>
                </div>
            )
        case "code":
            return (
                <div className="col-8">
                    <p>
                        <code>{a}</code>
                    </p>
                </div>
            )
        case "emialLink":
            return (
                <div className="col-8">
                    <p>
                        <a href={`mailto:${a}`}>{a}</a>
                    </p>
                </div>
            )
        case "urlLink":
            return (
                <div className="col-8">
                    <p>
                        <a href={`${a}`}>{a}</a>
                    </p>
                </div>
            )
        case "empty":
            return (
                <div className="col-8">
                    <p>N/A</p>
                </div>
            )
        default:
            // return (
            //     <div className="col-8">
            //         <p>N/A</p>
            //     </div>
            // );
            break
        }
    }
}

function showProject(
    a,
    field,
    submitMetadataQuery,
    projects,
    gotoRoute,
    internalID
) {
    if (a === undefined) {
        return null
    }
    return (
        <>
            {b(a, field, submitMetadataQuery, gotoRoute)}
            <div className="col-8">
                <ProjectButton
                    projects={projects}
                    short={a}
                    gotoRoute={gotoRoute}
                    internalID={internalID}
                    showFullName={true}
                />
            </div>
        </>
    )
}

const ListReplicas = ({ replicas }) => {
    const keys = Object.keys(replicas)
    return (
        <div className="row">
            {keys.map(k => (
                <div className="col-12" key={k}>
                    <div className="row">
                        <div className="col-4">
                            <p>{`${k}:`}</p>
                        </div>
                        <div className="col-8">
                            <code>{`${replicas[k]}`}</code>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Dataset compression and encryption

const DataSetsDetailImpl = ({
    dataSet,
    projects,
    submitMetadataQuery,
    requestPID,
    gotoRoute,
    username,
    requestDatasetSize,
    updatedMetadata
}) => {
    return (
        <>
            {dataSet === undefined ? (
                <p>Loading Dataset detail</p>
            ) : (
                <>
                    <div className="row">
                        <div className="col">
                            <h1>
                                Data Set Detail:{" "}
                                <em cy="dataset-detail-title">
                                    {dataSet.metadata.title}
                                </em>
                            </h1>
                        </div>
                        <div className="col-4" style={{ textAlign: "right" }}>
                            {!dataSet['__replicas'] && (
                                <CheckFineWritePermsComp
                                    prjID={dataSet.location.project}
                                    type="dat_short">
                                    <button
                                        type="button"
                                        className="btn btn-info btn-simple text-nowrap"
                                        cy="dataset-btn-update-metadata"
                                        onClick={() =>
                                            gotoRoute(
                                                ROUTE_DATA_SETS_UPDATE_META,
                                                {
                                                    internalID: encodeURIComponent(
                                                        dataSet.location
                                                            .internalID
                                                    ),
                                                }
                                            )
                                        }>
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-settings"></i>
                                        </span>{" "}
                                        Update dataset metadata
                                    </button>
                                </CheckFineWritePermsComp>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header"></div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <p title="Official identifiers such as DOI or PID">Published Data Set ID:</p>
                                        </div>
                                        {show(
                                            dataSet.metadata.identifier,
                                            "identifier",
                                            submitMetadataQuery,
                                            gotoRoute,
                                            "code"
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-4">
                                            <p>Data Set Access Mode:</p>
                                        </div>
                                        {show(
                                            dataSet.location.access,
                                            "access",
                                            submitMetadataQuery,
                                            gotoRoute,
                                            "neither",
                                            "dataset-detail-access"
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-4">
                                            <p>Project:</p>
                                        </div>
                                        {showProject(
                                            dataSet.location.project,
                                            "project",
                                            submitMetadataQuery,
                                            projects,
                                            gotoRoute,
                                            dataSet.location.internalID
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-4">
                                            <p>Zone:</p>
                                        </div>
                                        <div className="col-8">
                                            <p>{dataSet.location.zone}</p>
                                        </div>
                                    </div>

                                    {showArray(
                                        "Data Set Owner(s):",
                                        dataSet.metadata.owner,
                                        "owner",
                                        submitMetadataQuery,
                                        gotoRoute
                                    )}

                                    <div className="row">
                                        <div className="col-4">
                                            <p>Data Publication Year:</p>
                                        </div>
                                        {show(
                                            dataSet.metadata.publicationYear,
                                            "publicationYear",
                                            submitMetadataQuery,
                                            gotoRoute,
                                            "neither",
                                            "dataset-detail-publication-year"
                                        )}
                                    </div>

                                    {showArray(
                                        "Data Creator(s):",
                                        dataSet.metadata.creator,
                                        "creator",
                                        submitMetadataQuery,
                                        gotoRoute
                                    )}
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Encryption:</p>
                                        </div>
                                        <div className="col-8">
                                            <p>
                                                {getFlag(dataSet, "encryption")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Compression:</p>
                                        </div>
                                        <div className="col-8">
                                            <p>
                                                {getFlag(
                                                    dataSet,
                                                    "compression"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row my-4">
                        <div className="col-12">
                            <div
                                className="btn-toolbar"
                                role="toolbar"
                                aria-label="Toolbar with button groups">
                                <button
                                    type="button"
                                    className="btn btn-success btn-simple text-nowrap mr-1"
                                    cy="go-to-dataset-list-refresh"
                                    onClick={() => {
                                        gotoRoute(ROUTE_DATA_SETS_LIST, {
                                            forceQuery: true,
                                        })
                                    }}>
                                    <span className="white d-inline-flex mr-1">
                                        <i className="tim-icons icon-refresh-02"></i>
                                    </span>{" "}
                                    Go to dataset list and refresh
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-info btn-simple text-nowrap mx-1"
                                    data-toggle="collapse"
                                    data-target="#datasetsAdvanced"
                                    cy="dataset-detail-advanced-options">
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons icon-spaceship"></i>
                                    </span>{" "}
                                    Advanced
                                </button>
                                <CheckFineReadPermsComp
                                    prjID={dataSet.location.project}
		    		    access={dataSet.location.access}
                                    type="dat_short">
                                    <button
                                        type="button"
                                        className="btn btn-info btn-simple text-nowrap mx-1"
                                        data-toggle="collapse"
                                        cy="dataset-detail-show-filelist"
                                        onClick={() =>
                                            gotoRoute(
                                                ROUTE_DATA_SETS_FILELIST,
                                                {
                                                    internalID: encodeURIComponent(
                                                        dataSet.location
                                                            .internalID
                                                    ),
                                                }
                                            )
                                        }
                                        data-target="#datasetsFilelist">
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-bullet-list-67"></i>
                                        </span>{" "}
                                        List files
                                    </button>
                                </CheckFineReadPermsComp>
                                
                            </div>
                        </div>
                    </div>

                    <div className="collapse" id="datasetsAdvanced">
                        <div className="row mt-4">
                            <div className="col-3">
                                <h3>Other metadata:</h3>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header"></div>
                            <div className="card-body">
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <h4>Identifiers</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <p>Lexis DDI identifier:</p>
                                    </div>
                                    {show(
                                        dataSet.location.internalID,
                                        "internalID",
                                        submitMetadataQuery,
                                        gotoRoute,
                                        "code"
                                    )}
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4">
                                        <p>
                                            DataCite{" "}
                                            <a
                                                href="https://support.datacite.org/docs/schema-optional-properties-v41#11-alternateidentifier"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                Alternate Identifiers
                                            </a>
                                            :
                                        </p>
                                    </div>
                                    {showAltId(
                                        dataSet.metadata.AlternateIdentifier,
                                        "Alternate Identifier",
                                        submitMetadataQuery,
                                        gotoRoute
                                    )}
                                </div>
                                {showArray(
                                    "Identifiers of datasets related to this one:",
                                    dataSet.metadata.relatedIdentifier,
                                    "relatedIdentifier",
                                    submitMetadataQuery,
                                    gotoRoute
                                )}
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <h4>Resource Types and their Origin</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <p>Data Resource Type (General):</p>
                                    </div>
                                    {show(
                                        dataSet.metadata.resourceTypeGeneral,
                                        "resourceTypeGeneral",
                                        submitMetadataQuery,
                                        gotoRoute,
                                        "neither"
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <p>Data Resource Type:</p>
                                    </div>
                                    {show(
                                        dataSet.metadata.resourceType,
                                        "resourceType",
                                        submitMetadataQuery,
                                        gotoRoute,
                                        "neither",
                                        "dataset-detail-resource-type"
                                    )}
                                </div>
                                {showArray(
                                    "Data Publisher(s):",
                                    dataSet.metadata.publisher,
                                    "publisher",
                                    submitMetadataQuery,
                                    gotoRoute
                                )}
                                {showArray(
                                    "Data Contributor(s):",
                                    dataSet.metadata.contributor,
                                    "contributor",
                                    submitMetadataQuery,
                                    gotoRoute
                                )}
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <h4>Rights Management</h4>
                                    </div>
                                </div>
                                {showArray(
                                    "Rights Management Statements:",
                                    dataSet.metadata.rights,
                                    "rights",
                                    submitMetadataQuery,
                                    gotoRoute
                                )}
                                {showArray(
                                    "URIs of the Licences:",
                                    dataSet.metadata.rightsURI,
                                    "rightsURI",
                                    submitMetadataQuery,
                                    gotoRoute
                                )}
                                {showArray(
                                    <>
                                        Licence{" "}
                                        <a
                                            href="https://spdx.org/licenses/"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            Code(s)
                                        </a>
                                        :
                                    </>,
                                    dataSet.metadata.rightsIdentifier,
                                    "rightsIdentifier",
                                    submitMetadataQuery,
                                    gotoRoute
                                )}
                            </div>
                        </div>

                        <div className="container-fluid my-4">
                            <div className="row">
                                <div
                                    className="col-4"
                                    style={{ textAlign: "left" }}>
                                    <DataSetsNav
                                        internalID={dataSet.location.internalID}
                                        username={username}
                                        gotoRoute={gotoRoute}
                                    />
                                </div>
                                <div className="col-8"></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header"></div>
                            <div className="card-body">
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <h4>EUDAT B2STAGE</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <Gridftp
                                            location={dataSet.location}
                                            username={username}
                                        />
                                    </div>
                                </div>
                                {dataSet.eudat.PID && (
                                    <div className="row mt-3 mb-3">
                                        <div className="col-4">
                                            <p>PID: </p>
                                        </div>
                                        <div className="col-8">
                                            <code>{dataSet.eudat.PID}</code>
                                        </div>
                                    </div>
                                )}
                                <CheckFineWritePermsComp
                                    prjID={dataSet.location.project}
                                    type="dat_short">
                                    <button
                                        type="button"
                                        className="btn btn-info btn-simple text-nowrap ml-1 mb-3 mt-3"
                                        data-toggle="collapse"
                                        cy="dataset-detail-request-pid"
                                        onClick={() =>
                                            requestPID(
                                                dataSet.location.internalID,
                                                dataSet.location.project,
                                                dataSet.location.access,
                                                dataSet.location.zone,
                                                dataSet.eudat.PID
                                            )
                                        }
                                        data-target="#datasetsFilelist">
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-spaceship"></i>
                                        </span>
                                        Request new PID
                                    </button>
                                </CheckFineWritePermsComp>
                                {dataSet['__replicas'] && (
                                    <>
                                        <div className="row mt-3">
                                            <div className="col-12">
                                                <h4>Replicas</h4>
                                            </div>
                                        </div>
                                        <ListReplicas
                                            replicas={dataSet['__replicas']}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

const mapStateToProps = state => {
    return {
        dataSet: getDataSetDetail(state),
        username: getUserName(state),
        projects: getProjects(state),
    }
}

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    submitMetadataQuery: Actions.Creators.requestMetadataQuery,
    requestPID: Actions.Creators.requestPID,
    requestDatasetSize: Actions.Creators.requestDatasetSize,
    resetDatasetSize: styleActions.Creators.saveDatasetSize,
}

export const DataSetsDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsDetailImpl)
