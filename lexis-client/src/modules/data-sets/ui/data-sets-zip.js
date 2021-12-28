import React from "react"
import config from "../../../config"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import {
    getDataSetZip,
    getDownloadProgress,
    getDataSetLocation,
} from "../data-sets-selectors"
import { getUserName } from "../../auth/auth-selectors"

import { DataSetsNav } from "./data-sets-nav"
import { irodsPath } from "../data-sets-utils"
import { GridMapButtons } from "./data-sets-gridmap-buttons"

import { getRouteParams } from "../../routing/routing-selectors"

// import { ROUTE_DATA_SETS_ZIP } from "../../routing/routes";

import { performDownload } from "./perform-download"

const DataSetsZipImpl = ({
    username,
    location,
    dataSet,
    progress,
    gotoRoute,
    params,
}) => (
    <>
        <div className="row">
            <div className="col">
                {params.path === undefined ? (
                    <h1>Download Dataset</h1>
                ) : (
                    <h1>Download content within a Dataset</h1>
                )}
            </div>
            <DataSetsNav
                location={location}
                username={username}
                gotoRoute={gotoRoute}
                // ROUTE_DATA_SETS_ZIP
            />
        </div>
        <h2>
            If the dataset is large, please consider downloading using GridFTP
        </h2>
        <p>
            Use
            <br />
            globus-url-copy {config.url.gridftp}
            {irodsPath(location, username)}
            {params.path !== undefined && <div>/{params.path}</div>} DESTINATION
        </p>
        <p>
            Your DN should be registered with Lexis, either by using the Gridmap
            API at{" "}
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://lexis-lb-1.srv.lrz.de/gridftp/gridmap">
                lexis-lb-1
            </a>
            , or by emailing hayek at lrz dot de, or within this portal
        </p>
        <div className="row">
            <GridMapButtons gotoRoute={gotoRoute} />
        </div>

        <h2>
            The download will start automatically once the data is retrieved
        </h2>
        <h3>
            You may get a pop-up from your browser asking you to allow the
            download
        </h3>
        <div className="row">
            <div className="col">
                <h1>
                    {location.internalID}
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
                            className="btn btn-success btn-simple text-nowrap mx-1"
                            cy="dataset-zip-btn-save"
                            onClick={() =>
                                performDownload(
                                    dataSet.blob,
                                    location.internalID,
                                    params.path
                                )
                            }>
                            Click here to save to disk
                        </button>
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
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

export const DataSetsZip = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsZipImpl)
