import React, {useRef} from "react"
import cx from "classnames"

import {actions as routerActions} from 'redux-router5'
import { change, getFormValues, reduxForm } from "redux-form"
import { ReduxFormSelectField } from "../../../forms/select-field"
import { validateStage } from "../stage-form-validation"
import config from "../../../../config"
import { connect } from "react-redux"
import { ComponentModal } from "../../../interactiveStyle/component-modal"
import DataSetsFilelistTable from '../../ui/data-sets-filelist-table'
import dataSetsActions from "../../data-sets-actions"
import { getDataSetsFilelist } from "../../../entity-repository/entity-repository-selectors"
const goBack = () => window.history.back()

const StageFormImpl = ({
    handleSubmit,
    onFormSubmit,
    formValues,
    dataSet,
    form,
    perms,
    requestDatasetContent,
    changeVal,
    filelistER,
    gotoRoute
}) => {
    const location = dataSet && dataSet.location
    const modalRef = useRef()

    const filelist = location && location.internalID && filelistER[location.internalID]
    const datPath = formValues && formValues.datPath
    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        {dataSet ? <>
                            <div className="row">
                                <div className="col-4">
                                    <p>Dataset&apos;s title:</p>
                                </div>
                                <div className="col-8">
                                    <p>{dataSet.metadata.title}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Dataset&apos;s zone:</p>
                                </div>
                                <div className="col-8">
                                    <p>{location.zone}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Dataset&apos;s project:</p>
                                </div>
                                <div className="col-8">
                                    <p>{location.project}</p>
                                </div>
                            </div>
                            <form
                                onSubmit={handleSubmit(({internalID, source_system, target_system, datPath}) => onFormSubmit(internalID, source_system, target_system, datPath))}
                                className={cx({
                                    "stage-form": true,
                                })}>
                                <div className="row">
                                    <div className="col-12">
                                        {datPath && (
                                            <div className='row'>
                                                <div className='col-3 text-white'>
                                        Choosen file:{" "}
                                                </div>
                                                <div className='col-9'>
                                                    <pre className="text-warning">{datPath}</pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        {location && location.internalID
                            && <button
                                className="btn btn-primary btn-simple text-nowrap"
                                type="button"
                                onClick={()=> {
                                    modalRef.current.showModal()
                                    requestDatasetContent(location.internalID)
                                }}
                            >
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-single-copy-04"></i>
                                </span>
                                {datPath? "Change choosen path" : "Choose path"}
                            </button>}
                                        <ComponentModal
                                            ref={modalRef}
                                            headerTitle="Choose file from data set"
                                            dialogClassName="selectDSFieldDialog"
                                            contentClassName="selectDSFieldContent"
                                            titleClassName="titleDSFieldBody"
                                            className="selectDSFieldBody"
                                            alert
                                        >
                                            <DataSetsFilelistTable
                                                fileList={filelist}
                                                hasReadPermissions={true}
                                                gotoRoute={gotoRoute}
                                                onSelectAction={(path, filename)=>{
                                                    changeVal(form,`datPath`,`${path}${filename}`)
                                                    modalRef.current.hideModal()
                                                }}
                                                selectMode
                                                selectFolder
                                                selectFiles
                                            />
                                        </ComponentModal>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <ReduxFormSelectField
                                            label="Source System"
                                            displayNames={[dataSet.location.zone]}
                                            values={[
                                                config.DSzonesToiRODSzones[
                                                    dataSet.location.zone
                                                ],
                                            ]}
                                            required={true}
                                            name="source_system"
                                            cy="datasets-stage-form-source-system"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <ReduxFormSelectField
                                            label="Target System"
                                            displayNames={config.avaliableDSZones}
                                            values={config.avaliableDSZones.map((zone) => config.DSzonesToiRODSzones[zone])}
                                            required={true}
                                            name="target_system"
                                            cy="datasets-stage-form-target-system"
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-success btn-simple text-nowrap mr-1"
                                    type="submit"
                                    cy="datasets-stage-form-btn-submit">
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons icon-simple-add"></i>
                                    </span>{" "}
                            Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-info btn-simple text-nowrap ml-1"
                                    onClick={goBack}>
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons icon-simple-remove"></i>
                                    </span>{" "}
                            Cancel
                                </button>
                            </form>
                        </> : (
                            <div className="row">
                                <div className="col-12 text-center">
                                    <div
                                        className="spinner-border text-light ml-2"
                                        role="status"
                                        style={{ marginTop: "20vh" }}>
                                    </div>
                                    <h5 className="mt-3">
                                Loading...
                                    </h5>
                                </div>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    )}

const mapDispatchToProps = ({
    gotoRoute: routerActions.navigateTo,
    changeVal: change,
    requestDatasetContent: dataSetsActions.Creators.requestDatasetContent
})

const mapStateToProps = (state, ownProps) => ({
    formValues: getFormValues(ownProps.form)(state),
    filelistER: getDataSetsFilelist(state),
})

const StageConnectStore = connect(mapStateToProps,mapDispatchToProps)(StageFormImpl)

export const StageForm = reduxForm({ validate: validateStage })(StageConnectStore)
