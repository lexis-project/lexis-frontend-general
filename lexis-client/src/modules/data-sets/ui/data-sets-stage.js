import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import Actions from "../data-sets-actions"
import { StageForm } from "./stage-form"

import {
    getStagingSource,
    getStagingTarget,
} from "../data-sets-selectors"

import { getRouteParams } from "../../routing/routing-selectors"
// import {
//     ROUTE_DATA_SETS_STAGE_DELETE,
//     ROUTE_DATA_SETS_SSHFS_ADD,
//     ROUTE_DATA_SETS_SSHFS_REMOVE,
// } from "../../routing/routes";


/**
 * Return true if the system requires job_id
 *
 * @param {string} s - system
 * @returns {boolean} true if the system requires job_id
 */

function hasJobID(s) {
    return (
        s === "salomon_lustre" ||
        s === "barbora_lustre" ||
        s === "salomon_home" ||
        s === "barbora_home"
    )
}

const DataSetsStageImpl = ({
    params,
    // stagingZones,
    submitStage,
    // submitMeta,
    source,
    target,
    gotoRoute,
}) => {
    return (
        <>
            <div className="row">
                <div className="col-3">
                    <h1>Stage Dataset</h1>
                </div>
            </div>

            {/* <div className="row">
            <div className="col">
                <button
                    type="button"
                    className="btn btn-success btn-simple text-nowrap mx-1"
                    cy="dataset-btn-stage-delete"
                    onClick={() => gotoRoute(ROUTE_DATA_SETS_STAGE_DELETE)}>
                    Delete datasets
                </button>
            </div>
            <div className="col-2">
                <button
                    type="button"
                    className="btn btn-success btn-simple text-nowrap mx-1"
                    cy="dataset-btn-sshfs-add"
                    onClick={() => gotoRoute(ROUTE_DATA_SETS_SSHFS_ADD, {})}>
                    Export datasets
                </button>
            </div>
            <div className="col-2">
                <button
                    type="button"
                    className="btn btn-success btn-simple text-nowrap mx-1"
                    cy="dataset-btn-sshfs-remove"
                    onClick={() => gotoRoute(ROUTE_DATA_SETS_SSHFS_REMOVE, {})}>
                    Remove access to datasets
                </button>
            </div>
        </div> */}

            {/* submitMeta <-> DS_REQUEST_METADATA_SAVE <-> ie. save "meta metadata" */}
            <div className="row">
                <div className="col-9">
                    <StageForm
                        form="stage"
                        initialValues={params}
                        // stagingZones={stagingZones}
                        onFormSubmit={submitStage}
                        // onFormSubmitMeta={submitMeta}
                        // showMeta={hasmeta(target)}
                        showJobID={hasJobID(target) || hasJobID(source)}
                    />
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    params: getRouteParams(state),
    source: getStagingSource(state),
    target: getStagingTarget(state),
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    submitStage: Actions.Creators.requestStage,
    submitMeta: Actions.Creators.requestMetadataSave,
}

export const DataSetsStage = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsStageImpl)
