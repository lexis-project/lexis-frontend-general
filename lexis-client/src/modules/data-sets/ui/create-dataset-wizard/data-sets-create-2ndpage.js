import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import apiActions from "../../../api/api-actions"
import {
    getDSCreateWizardFormValues,
    getDSFragmentUploadUploadType,
    getDSToUploadFormValues,
} from "../../data-sets-selectors"
import { uploadTypeToReadable } from "./data-sets-create-1stpage"
import DsMetadata from "./data-sets-metadata-form-wrap"
import { customValidationWrapper } from "./validate"

export const DataSetsCreate2ndPageImpl = ({
    goToWizardPage,
    uploadType,
    formValsUploadFrag,
    formValsCreateWiz,
    warn,
}) => {
    const completeValidity = customValidationWrapper(
        formValsUploadFrag,
        formValsCreateWiz
    )
    const warnContFn = () =>
        warn("Please fill all forms fields properly before continuing")
    return (
        <div className="wizard-container">
            <div
                className="card card-wizard active"
                data-color="primary"
                id="wizardDatasetCreate">
                <div className="card-header text-center">
                    <div className="row">
                        <div className="col">
                            <h1 className="card-title">Upload New Dataset</h1>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col text-left">
                            <h2>Metadata</h2>
                        </div>
                        <div className="col text-right">
                            <h3>
                                Upload type: {uploadTypeToReadable(uploadType)}
                            </h3>
                        </div>
                    </div>
                    <div className="wizard-navigation">
                        <div className="progress progress-with-circle">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="2"
                                aria-valuemin="1"
                                aria-valuemax="3"
                                style={{
                                    width: "50%",
                                }}></div>
                        </div>
                        <ul className="nav nav-pills">
                            <li
                                className="nav-item"
                                style={{ width: "33.3333%" }}>
                                <a
                                    className="nav-link checked"
                                    href="#upload"
                                    onClick={() => goToWizardPage(1)}
                                    data-toggle="tab">
                                    <i className="tim-icons icon-upload"></i>
                                    <p>Upload</p>
                                </a>
                            </li>
                            <li
                                className="nav-item"
                                style={{ width: "33.3333%" }}>
                                <a
                                    className="nav-link checked active"
                                    href="#metadata"
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
                                    onClick={() => completeValidity ? goToWizardPage(3) : warnContFn()}
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
                        <div className="row justify-content-center mt-2">
                            <div className="col-6">
                                <div className="dropdown">
                                    <DsMetadata
                                        nextPage={() => goToWizardPage(3)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    uploadType: getDSFragmentUploadUploadType(state),
    formValsCreateWiz: getDSCreateWizardFormValues(state),
    formValsUploadFrag: getDSToUploadFormValues(state),
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    warn: apiActions.Creators.warningException,
}

export const DataSetsCreate2ndPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsCreate2ndPageImpl)
