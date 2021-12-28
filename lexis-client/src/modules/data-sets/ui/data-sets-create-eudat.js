import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import {
    getDataSetDetailInternalID,
    getUploadResult,
} from "../data-sets-selectors"
import { getUserName } from "../../auth/auth-selectors"
import { getProjects } from "../../projects/projects-selectors"

import Actions from "../data-sets-actions"
import { MetadataCreateForm } from "./metadata-create-or-update-form"

import { ROUTE_DATA_SETS_LIST } from "../../routing/routes"

import { prevUploadInfo } from "./upload-info"
import { GridMapButtons } from "./data-sets-gridmap-buttons"


export const DataSetsCreateEudatImpl = ({
    prevRes,
    username,
    projects,
    uploadDataset,
    gotoRoute,
}) => (
    <>
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>
                        Upload a Dataset via EUDAT{" "}
                        <a
                            href="https://www.eudat.eu/b2stage"
                            target="_blank"
                            rel="noopener noreferrer">
                            B2STAGE
                        </a>{" "}
                        (GridFTP)
                    </h1>
                </div>

                <GridMapButtons gotoRoute={gotoRoute} />
                <div className="col">
                    <button
                        type="button"
                        className="btn-primary btn-simple"
                        variant="primary"
                        onClick={() => gotoRoute(ROUTE_DATA_SETS_LIST, {})}>
                        Refresh dataset list
                    </button>
                </div>
            </div>
            {prevUploadInfo(prevRes, username, gotoRoute)}
            <h2>Metadata</h2>
            <MetadataCreateForm
                form="metadata-create"
                onFormSubmit={uploadDataset}
                projects={projects}
            />
        </Fragment>
    </>
)

const mapStateToProps = state => ({
    internalID: getDataSetDetailInternalID(state),
    prevRes: getUploadResult(state),
    username: getUserName(state),
    projects: getProjects(state),
})

const mapDispatchToProps = {
    uploadDataset: Actions.Creators.create,
    gotoRoute: actions.navigateTo,
}

export const DataSetsCreateEudat = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsCreateEudatImpl)
