import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import { getUserName } from "../../auth/auth-selectors"
import {
    getDatasetMulti,
    getStageDownload,
} from "../../entity-repository/entity-repository-selectors"

import { MultipartForm } from "./multipart-form"
import Actions from "../data-sets-actions"

import { getRouteParams } from "../../routing/routing-selectors"

import { performFileDownload } from "./perform-download"

/**
 * Obtain the directory in the WP3 staging area from the list of targets after a multi-volume zip is created by DDI
 *
 * @params {array of strings} targets - The target_paths for the multivolume zip.
 * @returns {string} directory in the WP3 staging area
 */
function getdir(targets) {
    const i = targets[0].lastIndexOf("/")
    return targets[0].substring(0, i)
}

function formatBytes(bytes, decimals = 2, wSizeString) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return wSizeString
        ? parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        : parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
}

const ProcessFiles = (
    {
        username,
        params,
        multi,
        source_path,
        target_paths,
        message,
        stagedown,
        requestDownload,
        submitStageDelete,
    },
    i
) => (
    <>
        <div className="row mt-5">
            <div className="col-4">
                <p className="my-2">
                    Multi-part Zip for <code>{source_path}</code>:
                </p>
            </div>
            <div className="col-5">
                <p key={i} className="my-2">
                    {message}
                </p>
            </div>
            <div className="col-3">
                {target_paths !== undefined && (
                    <button
                        type="button"
                        className="btn btn-warning btn-sm btn-simple mb-2 p-1"
                        onClick={() =>
                            submitStageDelete({
                                target_system: "lrz_staging_area",
                                target_path: getdir(target_paths),
                            })
                        }>
                        Remove from server
                    </button>
                )}
            </div>
        </div>

        {target_paths !== undefined &&
            target_paths.map((e, i) => (
                <div className="row mt-1" key={e}>
                    <div className="col-9">
                        <p className="my-2">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-check-2"></i>
                            </span>{" "}
                            <b>{i}:</b> <code>{e}</code>
                        </p>
                    </div>

                    {stagedown[e] !== undefined ? (
                        <>
                            <div className="col-1">
                                {stagedown[e].blob !== undefined &&
                                    (stagedown[e].blob === null ? (
                                        <p className="my-2">File N/A</p>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-link text-nowrap mb-2 p-1"
                                            disabled={
                                                !(
                                                    stagedown[e].loaded ===
                                                    stagedown[e].total
                                                )
                                            }
                                            onClick={() =>
                                                performFileDownload(
                                                    stagedown[e].blob,
                                                    e
                                                )
                                            }>
                                            Save
                                        </button>
                                    ))}
                            </div>
                            <div className="col-2">
                                <p className="my-2">
                                    {formatBytes(stagedown[e].loaded, 1, false)}
                                    /{formatBytes(stagedown[e].total, 1, true)}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="col-1">
                            <button
                                type="button"
                                className="btn btn-info btn-link text-nowrap mb-2 p-1"
                                onClick={() =>
                                    requestDownload({
                                        target_system: "lrz_staging_area",
                                        target_path: e,
                                    })
                                }>
                                Download
                            </button>
                        </div>
                    )}

                    {/* {stagedown[e] !== undefined &&
                        stagedown[e].blob !== undefined &&
                        stagedown[e].blob !== null && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    submitStageDelete({
                                        target_system: "lrz_staging_area",
                                        target_path: e,
                                    })
                                }
                            >
                                Remove file from server
                            </button>
                        )} */}
                </div>
            ))}

    </>
)

const DataSetsMultiImpl = ({
    username,
    params,
    submitMulti,
    multi,
    stagedown,
    requestDownload,
    submitStageDelete,
    target_paths,
    source_path,
    message,
}) => (
    <>
        <div className="row">
            <div className="col">
                {params.path === undefined ? (
                    <h1>Download Dataset via Multi-part ZIP</h1>
                ) : (
                    <h1>
                        Download Content within a Dataset via Multi-part ZIP
                    </h1>
                )}
            </div>
        </div>

        <div className="row">
            <div className="col-8">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Source System:</p>
                                        </div>
                                        <div className="col-8">
                                            <p>
                                                <code>
                                                    {params.source_system}
                                                </code>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Source path:</p>
                                        </div>
                                        <div className="col-8">
                                            <p>
                                                <code>
                                                    {params.source_path}
                                                </code>
                                            </p>
                                        </div>
                                    </div>

                                    <MultipartForm
                                        form="multipart"
                                        initialValues={params.size}
                                        onFormSubmit={submitMulti}
                                    />

                                    {multi !== undefined &&
                                        multi[params.source_path] !==
                                            undefined && (
                                        <ProcessFiles
                                            username={username}
                                            params={params}
                                            multi={multi}
                                            source_path={source_path}
                                            target_paths={target_paths}
                                            message={message}
                                            stagedown={stagedown}
                                            requestDownload={
                                                requestDownload
                                            }
                                            submitStageDelete={
                                                submitStageDelete
                                            }
                                        />
                                    )}

                                    {/* {multi !== undefined && (
                                                <>
                                                    <p>Other downloads:</p>
                                                    <ul>
                                                        {Object.keys(multi).map(
                                                            e =>
                                                                e !==
                                                                    params.source_path && (
                                                                    <li key={e}>
                                                                        {processFiles(
                                                                            e,
                                                                            multi[
                                                                                e
                                                                            ]
                                                                                .target_paths,
                                                                            multi[
                                                                                e
                                                                            ]
                                                                                .message,
                                                                            stagedown,
                                                                            requestDownload
                                                                        )}
                                                                    </li>
                                                                )
                                                        )}
                                                    </ul>
                                                </>
                                            )} */}

                                    <div className="row mt-5">
                                        <div className="col">
                                            <blockquote className="blockquote mr-5">
                                                <h3>Caution:</h3>
                                                <h4 className="mb-1">
                                                    The downloads will start
                                                    automatically once the data
                                                    is retrieved.
                                                </h4>
                                                <h4 className="mb-1">
                                                    You may get a pop-up from
                                                    your browser asking you to
                                                    allow the download.
                                                </h4>
                                                <h4 className="mb-1">
                                                    The preparation of the
                                                    multi-part download may take
                                                    a long time, please wait.
                                                </h4>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
)

const mapStateToProps = state => {
    let multiCheck = getDatasetMulti(state)
    let params = getRouteParams(state)
    let multi =
        multiCheck !== undefined &&
        multiCheck[params.source_path] !== undefined &&
        multiCheck
    let source_path = params && params.source_path
    let target_paths = multi && multi[params.source_path].target_paths
    let message = multi && multi[params.source_path].message

    return {
        username: getUserName(state),
        params: params,
        multi: multi,
        stagedown: getStageDownload(state),
        target_paths: target_paths,
        source_path: source_path,
        message: message,
    }
}

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    submitMulti: Actions.Creators.requestMulti,
    requestDownload: Actions.Creators.requestStageDownload,
    submitStageDelete: Actions.Creators.requestStageDelete,
}

export const DataSetsMulti = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsMultiImpl)
