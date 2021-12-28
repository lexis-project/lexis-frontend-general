import React from "react"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"
import { ROUTE_DATA_SETS_CREATEWIZARD, ROUTE_DATA_SETS_DETAIL, ROUTE_DATA_SETS_LIST } from "../../../routing/routes"
import { displayShortBiSize, displayShortTime } from "../../../utils"
import dataSetsActions from "../../data-sets-actions"
import { getDSCreateWizardFormValues, getDSReqProgStatus, getDSToUploadFormValues } from "../../data-sets-selectors"
import { uploadTypeToReadable } from "./data-sets-create-1stpage"

/**
 * 
 * @param {{title: string, values:{}, prop:[string], valWrap: Function}} param0 prop contains properties, for load the value from object values, which could be undefined
 * valWrap may be used to preprocess value before displaying it
 * @returns 
 */
const RenderOneInfoLine = ({title, values, prop, valWrap}) => {
    let finVal = values
    for (const p of prop){
        if(finVal){
            finVal = finVal[p]
        }else{
            finVal = "-"
            break
        }
    }

    if(valWrap !== undefined){
        finVal = valWrap(finVal)
    }

    if(!finVal){
        finVal = "-"
    } else if (finVal instanceof Array && finVal !== "-"){
        finVal = finVal.join(", ")
    }
    return (
        <div className="row">
            <div className="col-5"><strong>{title}:</strong></div>
            <div className="col">{finVal}</div>
        </div>
    )
}
const DSResultInfoImpl = ({
    uploadFormValues,
    createWizFormValues,
    uploadAction,
    DSReqProgStatus,
    gotoRoute,
    updateReqStatus,
    resetUploadWiz,
    queryMetadata
}) => {
    const uploadProgress = DSReqProgStatus.progress ? DSReqProgStatus.progress : 0
    const uploadSpeed = displayShortBiSize(
        DSReqProgStatus.upDownSpeed ? DSReqProgStatus.upDownSpeed : 0
    )
    const remainingTime = displayShortTime(
        DSReqProgStatus.remainingTime ? DSReqProgStatus.remainingTime : 0
    )

    const isTus = uploadFormValues && uploadFormValues.savedFile && uploadFormValues.savedFile.uploadType === 'tus'

    return (
        <>
            <div className="row justify-content-around"  style={{color: "white"}}>
                <div className="col-5">
                    <div className="row">
                        <div className="col">
                            <h3>Review of dataset basic information:</h3>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">

                            <div className="row">
                                <div className="col-8">
                                    <RenderOneInfoLine title="Title" values={createWizFormValues} prop={['metadata','title']} />
                                    <RenderOneInfoLine title="Type of upload" values={uploadFormValues} prop={['savedFile', 'uploadType']} valWrap={uploadTypeToReadable} />
                                    <RenderOneInfoLine title="Encryption" values={uploadFormValues} prop={['savedFile', 'enc']} valWrap={v => v ? "yes" : "no" } />
                                    <RenderOneInfoLine title="Compression" values={uploadFormValues} prop={['savedFile', 'comp']} valWrap={v => v ? "yes" : "no" } />
                                    <RenderOneInfoLine title="File to upload" values={uploadFormValues} prop={['savedFile', 'file', 0, 'name']} />
                                    <RenderOneInfoLine title="File type" values={uploadFormValues} prop={['savedFile', 'fileType']} valWrap={(v)=>v?v.toUpperCase():undefined} />
                                    <RenderOneInfoLine title="Project" values={createWizFormValues} prop={['project']} />
                                    <RenderOneInfoLine title="Access" values={createWizFormValues} prop={['access']} />
                                    <RenderOneInfoLine title="Zone" values={createWizFormValues} prop={['zone']} />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <div className="row">
                        <div className="col">
                            <h3>Review of dataset metadata:</h3>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-8">
                                    <RenderOneInfoLine title="Resource Type" values={createWizFormValues} prop={['metadata','resourceType']} />
                                    <RenderOneInfoLine title="General Type" values={createWizFormValues} prop={['metadata','resourceTypeGeneral']} />
                                    <RenderOneInfoLine title="Creator" values={createWizFormValues} prop={['metadata','creator']} />
                                    <RenderOneInfoLine title="Contributor" values={createWizFormValues} prop={['metadata','contributor']} />
                                    <RenderOneInfoLine title="Publisher" values={createWizFormValues} prop={['metadata','publisher']} />
                                    <RenderOneInfoLine title="Owner" values={createWizFormValues} prop={['metadata','owner']} />
                                    <RenderOneInfoLine title="Rights" values={createWizFormValues} prop={['metadata','rights']} />
                                    <RenderOneInfoLine title="Rights URI" values={createWizFormValues} prop={['metadata','rightsURI']} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                {(DSReqProgStatus.status === null || DSReqProgStatus.status === "error") && (
                    <div className="col-3 mt-3">
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            onClick={uploadAction}
                            cy="datasets-create-form-confirm-and-upload"
                        >
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-upload"></i>
                            </span>{" "}
                            {DSReqProgStatus.status === "error" ? 'Repeat attempt to upload' : 'Confirm and upload'}
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
                        {DSReqProgStatus.errorString ? 
                            <button
                                className="btn btn-success btn-simple text-nowrap mr-1"
                                cy="go-to-dataset-detail"
                                onClick={()=>{
                                    gotoRoute(ROUTE_DATA_SETS_DETAIL,{
                                        internalID: DSReqProgStatus.errorString
                                    })
                                }}
                            >
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-minimal-left"></i>
                                </span>{" "}
      Go to dataset detail
                            </button>
                            : <button
                                className="btn btn-success btn-simple text-nowrap mr-1"
                                cy="go-to-dataset-list-refresh"
                                onClick={()=>{
                                    gotoRoute(ROUTE_DATA_SETS_LIST, {forceQuery: true})
                                }}
                            >
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-minimal-left"></i>
                                </span>{" "}
        Go to dataset list
                            </button>
                        }
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            onClick={()=>{resetUploadWiz();gotoRoute(ROUTE_DATA_SETS_CREATEWIZARD)}}
                        >
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-refresh-02"></i>
                            </span>{" "}
              Create another dataset
                        </button>
                    </div>
                </div>)}
        </>
    )}
const mapDispatchToProps = {
    uploadAction: dataSetsActions.Creators.submitWizardUpload,
    gotoRoute: routerActions.navigateTo,
    updateReqStatus: dataSetsActions.Creators.reqProgressStatus,
    resetUploadWiz: dataSetsActions.Creators.resetUploadWiz,
    queryMetadata: dataSetsActions.Creators.requestMetadataQuery


}
const mapStateToProps = (state) => ({
    uploadFormValues: getDSToUploadFormValues(state),
    createWizFormValues: getDSCreateWizardFormValues(state),
    DSReqProgStatus: getDSReqProgStatus(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(DSResultInfoImpl)