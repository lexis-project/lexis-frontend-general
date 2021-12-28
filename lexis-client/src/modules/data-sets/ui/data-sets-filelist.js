import React, { useRef } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import Actions from "../data-sets-actions"

import {
    getDataSetLocation,
    getDataSetFilelist,
    getDatasetImageBoxStatus,
    getDatasetImageUrl,
    getDataForImageDownload,
    getDataSetMetadata,
    getDSReqProgStatus,
    getDataSetDetail,
    isDatasetPublic,
    hasDatasetPid,
} from "../data-sets-selectors"
import { getUserFinePerms, getUserName } from "../../auth/auth-selectors"

import { DataSetsNav } from "./data-sets-nav"
import { DataSize } from "./data-sets-datasize"
import {
    ROUTE_DATA_SETS_DETAIL,
    ROUTE_DATA_SETS_FILEUPLOAD,
} from "../../routing/routes"
import { loadStringOrLoading } from "../../utils"
import DataSetsFilelistTable from "./data-sets-filelist-table"
import Lightbox from "react-image-lightbox"
import { checkFineReadPerms, CheckFineReadPermsComp, CheckFineWritePermsComp } from "../../auth/auth-check-fine-perms"

const LightboxDownloadBtn = ({ requestOfCurrentImage, modalRef, loadFile }) => (
    <>
        <button
            type="button"
            className="btn btn-link ril__builtinButton"
            aria-label="Download"
            title="Download"
            onClick={() =>                
                loadFile(
                    requestOfCurrentImage.internalID,
                    requestOfCurrentImage.access,
                    requestOfCurrentImage.project,
                    requestOfCurrentImage.path.replace(/\/[^/]+$/,"") + "/",
                    requestOfCurrentImage.zone,
                    requestOfCurrentImage.path.split('/').pop(),
                    true,
                    false
                )}
        >
            <span className="white d-inline-flex mx-1">
                <i className="tim-icons icon-cloud-download-93"></i>{" "}
            </span>
        </button>
    </>
)

const DataSetsFilelistImpl = ({
    location,
    username,
    dataSetFilelist,
    gotoRoute,
    update,
    loadImage,
    imageBoxStatus,
    changeImgBoxStatus,
    imageURL,
    removeFile,
    perms,
    metadata,
    loadFile,
    requestOfCurrentImage,
    DSReqProgStatus,
    dataset,
    isDatasetPublic,
    hasDatasetPid
}) => {
    const fileListTableRef = useRef()
    const hasReadPermissions = location && location.project && 
		(location.access==="public" || (perms? checkFineReadPerms(location.project, 'dat_short', perms) : null))
    const modalRef = useRef()

    return (
        <>
            <div className="row">
                <div className="col">
                    <button
                        title="Go back to dataset detail"
                        className="btn btn-link"
                        onClick={()=>
                            gotoRoute(ROUTE_DATA_SETS_DETAIL, {
                                internalID: encodeURIComponent(
                                    location.internalID
                                )
                            })
                        }
                    >
                        <h1>{ metadata && metadata.title && metadata.title !== "" ? loadStringOrLoading(metadata, "title") : loadStringOrLoading(location, "internalID")}</h1>
                    </button>
                </div>
                <DataSetsNav
                    internalID={location && location.internalID}
                    username={username}
                />
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <button
                                        type="button"
                                        className="btn btn-info btn-simple text-nowrap"
                                        style={{ marginLeft: "0.5em" }}
                                        cy="datasets-filelist-update-btn"
                                        onClick={() =>
                                            update({
                                                internalID: encodeURIComponent(
                                                    location.internalID
                                                ),
                                            })
                                        }>
                                        <span className="white d-inline-flex mr-1">
                                            <i className="tim-icons icon-refresh-02"></i>
                                        </span>
                                        Refresh
                                    </button>
                                    {location && location.project && <CheckFineReadPermsComp prjID={location.project} type="dat_short" access={location.access}>
                                        <DataSize />
                                    </CheckFineReadPermsComp>}
                                </div>
                                <div className="col-5 text-right">
                                    {hasReadPermissions && fileListTableRef.current && dataset && !dataset['__replicas'] &&
                                    <CheckFineWritePermsComp prjID={location.project} type="dat_short">
                                        <button
                                            type="button"
                                            className="btn btn-info btn-simple text-nowrap ml-3 mr-1"
                                            cy="datasets-filelist-upload"
                                            onClick={()=> {
                                                gotoRoute(ROUTE_DATA_SETS_FILEUPLOAD, {
                                                    zone:       encodeURIComponent(location.zone),
                                                    internalID: encodeURIComponent(location.internalID),
                                                    access:     encodeURIComponent(location.access),
                                                    project:    encodeURIComponent(location.project),
                                                    dsPath:     encodeURIComponent(fileListTableRef.current.state.currentPath),
                                                })}}
                                        >
                                            <span className="white d-inline-flex mr-1">
                                                <i className="tim-icons icon-upload"></i>
                                            </span>
                                            Upload file(s) here
                                        </button>
                                    </CheckFineWritePermsComp>
                                    }
                                </div>
                                <div className="col-1 text-right">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        id="dataset-filelist-help"
                                        type="button"
                                        style={{ fontSize: "1.3rem" }}
                                        data-trigger="click hover"
                                        data-placement="top"
                                        data-toggle="popover"
                                        data-container="#root"
                                        title="Dataset file explorer help"
                                        data-content="Folders can be opened by clicking on theirs name. Supported images too(JPEG, PNG...).
                                    Two dots means go to parent folder">
                                        ?
                                    </button>
                                </div>
                            </div>
                            <DataSetsFilelistTable
                                ref={fileListTableRef}
                                fileList={dataSetFilelist}
                                hasReadPermissions={hasReadPermissions}
                                gotoRoute={gotoRoute}
                                displayImage={loadImage}
                                removeAction={removeFile}
                                location={location}
                                username={username}
                                loadFile={loadFile}
                                DSReqProgStatus={DSReqProgStatus}
                                isMutable={dataset && !dataset['__replicas']}
                                isDatasetPublic={isDatasetPublic}
                                hasDatasetPid={hasDatasetPid}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* light box with image */}
            {imageBoxStatus && (
                <Lightbox
                    mainSrc={imageURL ? imageURL : ""}
                    reactModalStyle={{ overlay: { zIndex: "2000" } }}
                    onCloseRequest={() => changeImgBoxStatus(false)}
                    toolbarButtons={[
                        <LightboxDownloadBtn
                            key="lightbox1"
                            requestOfCurrentImage={requestOfCurrentImage}
                            modalRef={modalRef}
                            loadFile={loadFile}
                        />,
                    ]}
                />
            )}
        </>
    )
}

const mapStateToProps = state => ({
    location: getDataSetLocation(state),
    metadata: getDataSetMetadata(state),
    dataset: getDataSetDetail(state),
    username: getUserName(state),
    dataSetFilelist: getDataSetFilelist(state),
    imageBoxStatus: getDatasetImageBoxStatus(state),
    imageURL: getDatasetImageUrl(state),
    perms: getUserFinePerms(state),
    requestOfCurrentImage: getDataForImageDownload(state),
    DSReqProgStatus: getDSReqProgStatus(state),
    isDatasetPublic: isDatasetPublic(state),
    hasDatasetPid: hasDatasetPid(state)
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    update: Actions.Creators.requestFilelistUpdate,
    loadImage: Actions.Creators.loadImageScheduled,
    changeImgBoxStatus: Actions.Creators.changeImageBoxStatus,
    removeFile: Actions.Creators.requestFileRemove,
    loadFile: Actions.Creators.loadFile,
}

export const DataSetsFilelist = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsFilelistImpl)
