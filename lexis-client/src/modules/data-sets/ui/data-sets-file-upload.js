import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import {
    getDSReqProgStatus,
    getDSToUploadFormValues,
} from "../data-sets-selectors";
import { ROUTE_DATA_SETS_FILELIST } from "../../routing/routes";
// import { Gridftppath } from "../gridftp";
// import { FragmentUpload } from "./fragment-upload";
import FragmentUpload from "./create-dataset-wizard/fragment-upload";
import { uploadTypeToReadable } from "./create-dataset-wizard/data-sets-create-1stpage";
import { displayShortBiSize, displayShortTime } from "../../utils";
import dataSetsActions from "../data-sets-actions";
import { isInvalid } from "redux-form";
import { getRouteParams } from "../../routing/routing-selectors";

export const DataSetsFileUploadImpl = ({
    formValsUploadFrag,
    gotoRoute,
    DSReqProgStatus,
    uploadAction,
    updateReqStatus,
    isInValid,
    resetUpload,
    routeParams: {internalID, dsPath, zone, access, project}
}) =>{
    const uploadProgress = DSReqProgStatus.progress ? DSReqProgStatus.progress : 0
    const uploadSpeed = displayShortBiSize(
        DSReqProgStatus.upDownSpeed ? DSReqProgStatus.upDownSpeed : 0
    )
    const remainingTime = displayShortTime(
        DSReqProgStatus.remainingTime ? DSReqProgStatus.remainingTime : 0
    )
    const isTus = formValsUploadFrag && formValsUploadFrag.savedFile && formValsUploadFrag.savedFile.uploadType === 'tus'

    return(
        <>
            {/*}
            <Gridftppath
                location={params.location}
                username={username}
                path={params.path}
            /> */}
            <div className="row">
                <div className="col-12">
                    <h1>Dataset upload type: {uploadTypeToReadable(formValsUploadFrag && formValsUploadFrag.savedFile && formValsUploadFrag.savedFile.uploadType)}</h1>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-9">
                    <div className="card">
                        <div className="card-header">
                            <span className="mr-2" style={{float: "left"}}>Path:</span>
                            <pre style={{lineHeight: "1.5rem"}}>{dsPath === "/" ? "<root directory>" : decodeURIComponent(dsPath)}</pre>
                        </div>
                        <div className="card-body">
                            <FragmentUpload />
                            <div className="row justify-content-center">
                                {(DSReqProgStatus.status === null || DSReqProgStatus.status === "error") && (
                                    <div className="col-3 mt-3">
                                        <button
                                            className="btn btn-success btn-simple text-nowrap mr-1"
                                            onClick={()=>uploadAction(
                                                decodeURIComponent(internalID),
                                                decodeURIComponent(dsPath),
                                                decodeURIComponent(project),
                                                decodeURIComponent(access),
                                                decodeURIComponent(zone)
                                            )}
                                            disabled={isInValid}
                                        >
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-upload"></i>
                                            </span>{" "}
                                            {DSReqProgStatus.status === "error" ? 'Repeat attempt to upload' : 'Upload'}
                                        </button>
                                    </div>
                                )}
                                {/* upload status progress */}
                                {DSReqProgStatus.status === 'proccessing' && (
                                    <div className="col-4 mt-3 text-center">
                                        <span className="spinner-border text-light" role="status">
                                        </span>
                                        <h5 className="mt-2">{DSReqProgStatus.errorString ?
                                            DSReqProgStatus.errorString :
                                            "Please wait, proccessing..."}</h5>
                                    </div>  
                                )}
                                {(DSReqProgStatus.status === 'sending' || DSReqProgStatus.status === 'paused') && (
                                    <div className="col-8 mt-3">
                                        <h3 className="text-center">Uploading...</h3>
                                        <div className="progress" style={{height: "2em"}}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${uploadProgress}%`,
                                                }}>{`${uploadProgress}% - ${uploadSpeed}/s - remaining: ${remainingTime}`}</div>
                                        </div>
                                        {isTus && (
                                            <div className="row justify-content-around mt-3 text-center">
                                                {DSReqProgStatus.status === 'paused' ?
                                                    <div className="col">
                                                        <button
                                                            className="btn btn-success btn-simple text-nowrap mr-1"
                                                            onClick={()=>updateReqStatus('continue')}
                                                        >
                                                            <span className="white d-inline-flex mx-1">
                                                                <i className="tim-icons icon-triangle-right-17"></i>
                                                            </span>{" "}
                        Continue
                                                        </button>
                                                    </div>
                                                    : 
                                                    <div className="col">
                                                        <button
                                                            className="btn btn-success btn-simple text-nowrap mr-1"
                                                            onClick={()=>updateReqStatus('pause')}
                                                        >
                                                            <span className="white d-inline-flex mx-1">
                                                                <i className="tim-icons icon-button-pause"></i>
                                                            </span>{" "}
                        Pause
                                                        </button>
                                                    </div>
                                                }
                                                <div className="col">
                                                    <button
                                                        className="btn btn-success btn-simple text-nowrap mr-1"
                                                        onClick={()=>updateReqStatus('cancel')}
                                                    >
                                                        <span className="white d-inline-flex mx-1">
                                                            <i className="tim-icons icon-simple-remove"></i>
                                                        </span>{" "}
                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>  
                                )}
                                {DSReqProgStatus.status === 'done' && (
                                    <div className="col-4 mt-3 text-center" style={{color: "rgb(196, 138, 0)"}}>
                                        <span className="white d-inline-flex mx-4 mb-4" style={{fontSize:"5rem"}}>
                                            <i className="tim-icons icon-trophy"></i>
                                        </span>
                                        <h3>
                Successfully uploaded
                                        </h3>
                                    </div>
                                )}
                            </div>
                            {DSReqProgStatus.status === 'cancelled' && (
                                <div className="row justify-content-center">
                                    <div className="col-8 mt-5 text-center" style={{color: "rgb(196, 138, 0)"}}>
                                        <span className="white d-inline-flex mx-4 mb-4" style={{fontSize:"5rem"}}>
                                            <i className="tim-icons icon-alert-circle-exc"></i>
                                        </span>
                                        <h3>
                Upload successfully cancelled
                                        </h3>
                                    </div>
                                </div>
                            )}
                            {DSReqProgStatus.status === 'error' && (
                                <div className="row justify-content-center">
                                    <div className="col-8 mt-5 text-center" style={{color: "rgb(196, 138, 0)"}}>
                                        <span className="white d-inline-flex mx-4 mb-4" style={{fontSize:"5rem"}}>
                                            <i className="tim-icons icon-alert-circle-exc"></i>
                                        </span>
                                        <h3>
                Something went wrong :-(
                                        </h3>
                                        <pre>{DSReqProgStatus.errorString}</pre>
                                    </div>
                                </div>
                            )}
                            {DSReqProgStatus.status === 'done' && (
                                <div className="row">
                                    <div className="col-4">
                                        <button
                                            className="btn btn-success btn-simple text-nowrap mr-1"
                                            onClick={()=>gotoRoute(ROUTE_DATA_SETS_FILELIST, {
                                                internalID
                                            })}
                                        >
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-minimal-left"></i>
                                            </span>{" "}
                        Go back to dataset file list
                                        </button>
                                    </div>
                                    <div className="col-4"></div>
                                    <div className="col-4">
                                        <button
                                            className="btn btn-success btn-simple text-nowrap mr-1"
                                            onClick={resetUpload}
                                        >
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-refresh-02"></i>
                                            </span>{" "}
                        Upload another file
                                        </button>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )}

const mapStateToProps = state => ({
    formValsUploadFrag: getDSToUploadFormValues(state),
    DSReqProgStatus: getDSReqProgStatus(state),
    isInValid: isInvalid('datasetToUpload')(state),
    routeParams: getRouteParams(state)
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    uploadAction: dataSetsActions.Creators.uploadIntoExisting,
    resetUpload: dataSetsActions.Creators.resetUpload,
    updateReqStatus: dataSetsActions.Creators.reqProgressStatus
}

export const DataSetsFileUpload = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsFileUploadImpl)
