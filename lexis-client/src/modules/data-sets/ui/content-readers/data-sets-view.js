import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import Actions from "../../data-sets-actions"

import {
    getDataSetZip,
    getDownloadProgress,
    getDataSetLocation,
    getDatasetImageUrl,
} from "../../data-sets-selectors"
import { getUserName } from "../../../auth/auth-selectors"

import { Refresh } from "../refresh"

import { getRouteParams } from "../../../routing/routing-selectors"

import { performDownload } from "../perform-download"

const DataSetsViewImpl = ({
    username,
    location,
    dataSet,
    progress,
    gotoRoute,
    params,
    update,
    imageURL
}) => (
    <>
        <h1>View file from dataset</h1>
        <div className="row">
            <div className="col">
                <h1>
                    {location && location.internalID}
                    {params.path !== undefined && <div>/{params.path}</div>}
                </h1>
            </div>
        </div>
        <div className="row">
            <div className="col">
                {dataSet === undefined && (
                    <p>
                        Download request started. Fetching of data in progress
                        (this may take some time). Download in progress.
                    </p>
                )}
                {progress !== undefined && (
                    <p> Downloaded: {progress.loaded} bytes.</p>
                )}
                {dataSet !== undefined && dataSet.blob === undefined && (
                    <p>Download Failed (dataset too large)</p>
                )}
                {dataSet !== undefined && dataSet.blob !== undefined && (
                    <p>
                        Size: {dataSet.blob.size} bytes, type:{" "}
                        {dataSet.blob.type}. Download is now complete in RAM.{" "}
                        <button
                            type="button"
                            className="btn btn-link"
                            variant="link"
                            onClick={() =>
                                performDownload(
                                    dataSet.blob,
                                    location.internalID,
                                    params.path
                                )
                            }>
                            Click here to save to disk
                        </button>{" "}
                        <Refresh action={update} interval={params.refresh} />
                        {imageURL && (
                            <img
                                alt="From dataset path"
                                src={imageURL}
                            />
                        )}
                    </p>
                )}
            </div>
        </div>
    </>
)

const mapStateToProps = state => ({
    username: getUserName(state),
    location: getDataSetLocation(state),
    dataSet: getDataSetZip(state),
    params: getRouteParams(state),
    progress: getDownloadProgress(state),
    imageURL: getDatasetImageUrl(state)
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    update: Actions.Creators.requestViewUpdate,
}

export const DataSetsView = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsViewImpl)
