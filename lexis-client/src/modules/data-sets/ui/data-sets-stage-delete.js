import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import Actions from "../data-sets-actions"
import { StageDeleteForm } from "./stage-delete-form"

import { getStagingTarget } from "../data-sets-selectors"


import { getRouteParams } from "../../routing/routing-selectors"
import {
    ROUTE_DATA_SETS_STAGE,
} from "../../routing/routes"


const DataSetsStageDeleteImpl = ({
    params,
    submitStageDelete,
    requestMetadataQuery,
    target,
    gotoRoute,
}) => (
    <>
        <button
            className="btn btn-link d-none"
            variant="link"
            onClick={() =>
                gotoRoute(ROUTE_DATA_SETS_STAGE, {
                    source_system: params.target_system,
                    source_path: params.target_path,
                })
            }>
            Stage dataset
        </button>
        <a
            className="d-none"
            target="_blank"
            rel="noopener noreferrer"
            href="https://openproject.it4i.cz/projects/lexis-data-system/wiki/lexis-data-staging-api">
            Documentation
        </a>

        <div className="row">
            <div className="col-12">
                <h1>Delete Staged Dataset</h1>
            </div>
        </div>

        <div className="row">
            <div className="col-9">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <StageDeleteForm
                            form="stage-delete"
                            initialValues={params}
                            onFormSubmit={submitStageDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
)

const mapStateToProps = state => ({
    params: getRouteParams(state),
    target: getStagingTarget(state),
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    submitStageDelete: Actions.Creators.requestStageDelete,
    requestMetadataQuery: Actions.Creators.requestMetadataQuery,
}

export const DataSetsStageDelete = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsStageDeleteImpl)
