import React from 'react'

import { displayShortBiSize, displayShortTime, valOrZero } from "../../utils"


export default ({DSReqProgStatus, uploadAction, isInValid, isTus, 
    uploadText, updateReqStatus}) => {
    const uploadProgress = valOrZero(DSReqProgStatus.progress)
    const uploadSpeed = displayShortBiSize(valOrZero(DSReqProgStatus.upDownSpeed))
    const remainingTime = displayShortTime(valOrZero(DSReqProgStatus.remainingTime))
    return (
        <>
            <div className="row justify-content-center">
                {(DSReqProgStatus.status === null || DSReqProgStatus.status === "error") && uploadAction && (
                    <div className="col-3 mt-3">
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            onClick={uploadAction}
                            disabled={isInValid}
                        >
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-upload"></i>
                            </span>{" "}
                            {DSReqProgStatus.status === "error" ? `Repeat attempt to ${uploadText ? uploadText : 'upload'}`
                                : uploadText ? uploadText : 'Upload'}
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
        </>
    )
}