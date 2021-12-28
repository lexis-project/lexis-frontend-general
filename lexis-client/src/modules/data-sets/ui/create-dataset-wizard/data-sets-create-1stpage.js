import React from "react"
import { connect } from "react-redux"
import {
    getDataSetDetailInternalID,
    getDSCreateWizardFormValues,
    getDSFragmentUploadUploadType,
    getDSToUploadFormValues,
    getUploadResult,
} from "../../data-sets-selectors"

import { getRouteParams } from "../../../routing/routing-selectors"

import FragmentUpload from "./fragment-upload"
import DsBasicInfo from "./data-sets-basic-info"

import { getUserFinePerms, getUserName } from "../../../auth/auth-selectors"

import { isInvalid } from "redux-form"
import { customValidationWrapper, isFirstPageInvalid } from "./validate"
import apiActions from "../../../api/api-actions"

export const uploadTypeToReadable = uploadType => {
    switch (uploadType) {
    case "directupload":
        return "Direct Upload"
    case "tus":
        return "TUS - Chunked Upload"
    default:
        return "Not selected"
    }
}

export const DataSetsCreate1stPageImpl = ({
    goToWizardPage,
    uploadType,
    uplFragFormInvalid,
    createWizFormInvalid,
    formValsCreateWiz,
    formValsUploadFrag,
    warn,
    perms
}) => {
    const ableToContinue = !(isFirstPageInvalid(!uplFragFormInvalid, !createWizFormInvalid, formValsCreateWiz, perms))
    const completeValidity = customValidationWrapper(
        formValsUploadFrag,
        formValsCreateWiz
    )
    const warnContFn = () =>
        warn("Please fill all forms fields properly before continuing")
    return (
        <>
            <div className="wizard-container">
                <div
                    className="card card-wizard active"
                    data-color="primary"
                    id="wizardDatasetCreate">
                    <div className="card-header text-center">
                        <div className="row">
                            <div className="col">
                                <h1 className="card-title">
                                    Upload New Dataset
                                </h1>
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col text-left">
                                <h2>Basic Information</h2>
                            </div>
                            <div className="col text-right">
                                <h3>
                                    Upload type:{" "}
                                    {uploadTypeToReadable(uploadType)}
                                </h3>
                            </div>
                        </div>
                        <div className="wizard-navigation">
                            <div className="progress progress-with-circle">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    aria-valuenow="1"
                                    aria-valuemin="1"
                                    aria-valuemax="3"
                                    style={{
                                        width: "16.6667%",
                                    }}></div>
                            </div>
                            <ul className="nav nav-pills">
                                <li
                                    className="nav-item"
                                    style={{ width: "33.3333%" }}>
                                    <a
                                        className="nav-link checked active"
                                        href="#metadata"
                                        data-toggle="tab">
                                        <i className="tim-icons icon-upload"></i>
                                        <p>Upload</p>
                                    </a>
                                </li>
                                <li
                                    className="nav-item"
                                    style={{ width: "33.3333%" }}>
                                    <a
                                        className="nav-link"
                                        href="#upload"
                                        onClick={() =>
                                            ableToContinue
                                                ? goToWizardPage(2)
                                                : warnContFn()
                                        }
                                        data-toggle="tab">
                                        <i className="tim-icons icon-pencil"></i>
                                        <p>Metadata</p>
                                    </a>
                                </li>
                                <li
                                    className="nav-item"
                                    style={{ width: "33.3333%" }}>
                                    <a
                                        className="nav-link"
                                        href="#result"
                                        onClick={() =>
                                            completeValidity
                                                ? goToWizardPage(3)
                                                : warnContFn()
                                        }
                                        data-toggle="tab">
                                        <i className="tim-icons icon-alert-circle-exc"></i>
                                        <p>Result</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="tab-content">
                            <div className="tab-pane show active" id="upload">
                                <div className="row justify-content-center mt-2"></div>
                            </div>

                            <div className="row justify-content-around mt-2">
                                <div className="col-4">
                                    <FragmentUpload cy="data-sets-file-upload-btn" />
                                </div>
                                <div className="col-5">
                                    <div className="dropdown">
                                        {/* Just to avoid the table not being empty. */}
                                        <DsBasicInfo
                                            nextPage={() => goToWizardPage(2)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/*TODO: reimplement advanced type of for other cases if needed */}
            {/* <div className="row">
                <div className="col-12">
                    <button
                        className="btn btn-info btn-simple text-nowrap"
                        type="button"
                        onClick={() => gotoRoute(ROUTE_DATA_SETS_GRIDMAP_ADD)}>
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-cloud-upload-94"></i>
                        </span>
                        Advanced upload via GridFTP
                    </button>
                </div>
            </div> */}
        </>
    )
}

const mapStateToProps = state => ({
    internalID: getDataSetDetailInternalID(state),
    username: getUserName(state),
    prevRes: getUploadResult(state),
    params: getRouteParams(state),
    uploadType: getDSFragmentUploadUploadType(state),
    uplFragFormInvalid: isInvalid("datasetToUpload")(state),
    createWizFormInvalid: isInvalid("wizardDatasetCreate")(state),
    formValsCreateWiz: getDSCreateWizardFormValues(state),
    formValsUploadFrag: getDSToUploadFormValues(state),
    perms: getUserFinePerms(state)
})

const mapDispatchToProps = {
    warn: apiActions.Creators.warningException,
}

export const DataSetsCreate1stPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsCreate1stPageImpl)
