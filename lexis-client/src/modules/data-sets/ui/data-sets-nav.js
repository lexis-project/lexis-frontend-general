import React, { Component, createRef } from "react"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"

import config from "../../../config"

import { getDataSetDetail, getDataSetLocation, getDSReqProgStatus } from "../data-sets-selectors"
import {
    ROUTE_DATA_SETS_DUPLICATE,
    ROUTE_DATA_SETS_REPLICATE,
    ROUTE_DATA_SETS_STAGE,
} from "../../routing/routes"

import { stagePath } from "../data-sets-utils"

import { displayShortBiSize, displayShortTime, valOrZero } from "../../utils"

import { ComponentModal as DSModal } from "../../interactiveStyle/component-modal"
import { HandleDownload } from "./data-sets-download-info"
import dataSetsActions from "../data-sets-actions"
import { CheckFineReadPermsComp, CheckFineWritePermsComp } from "../../auth/auth-check-fine-perms"

class DataSetsNavImpl extends Component {
    constructor(props) {
        super(props)
        this.modalDwnlRef = createRef()
    }    

    componentDidUpdate(prevProps) {
        if(prevProps.DSReqProgStatus && prevProps.DSReqProgStatus.status === 'sending'
    && this.props.DSReqProgStatus && this.props.DSReqProgStatus.status === null) {
            this.modalDwnlRef.current.hideModal()
        }
    }

    render() {
        const {
            internalID,
            dataSet,
            username,
            gotoRoute,
            DSReqProgStatus,
            loadFile,
            location,
            deleteDataset
        } = this.props
        return (
            <>
                <div className="dropdown mr-5">
                    <button
                        className="btn btn-info btn-simple text-nowrap dropdown-toggle mr-5"
                        type="button"
                        id="dropdownAdvanced Datasets"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-puzzle-10"></i>
                        </span>
                        {"  "}Advanced handling{" "}
                        {/* <em>{loadStringOrLoading(dataSet, "metadata", "title")}</em> */}
                    </button>
                    <div className="dropdown-menu dropdown-black drpdwn-btns">
                        {location && <CheckFineWritePermsComp
                            prjID={location.project}
                            type="dat_short">
                            <button
                                title="Replication uses EUDAT to ensure data traceability and availability, and as such metadata is exposed for citation purposes. Such datasets cannot be deleted, since that would break possible external citations. Use Duplication instead if this is not desired."
                                type="button"
                                className="btn btn-info btn-simple text-nowrap"
                                cy="dataset-detail-request-replicate"
                                onClick={() =>
                                    gotoRoute(
                                        ROUTE_DATA_SETS_REPLICATE,
                                        {
                                            internalID:
                                                location
                                                    .internalID,
                                            source_system:
                                                encodeURIComponent(config
                                                    .DSzonesToiRODSzones[
                                                        location
                                                            .zone
                                                    ]),
                                        }
                                    )
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-single-copy-04"></i>
                                </span>{" "}
                                Request dataset replica
                            </button>
                        </CheckFineWritePermsComp>}
                        {location && <CheckFineWritePermsComp
                            prjID={location.project}
                            type="dat_short">
                            <button
                                type="button"
                                className="btn btn-info btn-simple text-nowrap"
                                cy="dataset-detail-request-duplicate"
                                onClick={() =>
                                    gotoRoute(
                                        ROUTE_DATA_SETS_DUPLICATE,
                                        {
                                            internalID:
                                                location
                                                    .internalID,
                                            source_system:
                                                config
                                                    .DSzonesToiRODSzones[
                                                        location
                                                            .zone
                                                    ],
                                            source_path: stagePath(
                                                location,
                                                username
                                            ),
                                            target_path: stagePath(
						 {access:location.access, project: location.project, internalID: ''},
                                                username
                                            ),
                                        }
                                    )
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-single-copy-04"></i>
                                </span>{" "}
                                Request dataset duplicate
                            </button>
                        </CheckFineWritePermsComp>}
                        {location && <CheckFineWritePermsComp
                            prjID={location.project}
                            type="dat_short">
                            <button
                                type="button"
                                className="btn btn-success btn-simple text-nowrap"
                                cy="dataset-detail-request-duplicate"
                                onClick={() =>
                                    gotoRoute(
                                        ROUTE_DATA_SETS_STAGE,
                                        {
                                            internalID:
                                                location
                                                    .internalID,
                                            source_system:
                                                config
                                                    .DSzonesToiRODSzones[
                                                        location
                                                            .zone
                                                    ],
                                        }
                                    )
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-send"></i>
                                </span>{" "}
                                Request dataset stage
                            </button>
                        </CheckFineWritePermsComp>}
                        {location && dataSet && <CheckFineReadPermsComp type='dat_short' prjID={location.project} access={location.access}>
                            <button
                                className="btn btn-success btn-simple text-nowrap"
                                cy="dataset-btn-download"
                                onClick={() =>{
                                    this.modalDwnlRef.current.showModal()
                                    let zones = [location.zone]
                                    if(dataSet['__replicas'] !== undefined)
                                    {
                                        zones.push(...Object.keys(dataSet['__replicas']))
                                    }
                                    loadFile(
                                        location.internalID,
                                        location.access,
                                        location.project,
                                        '/',
                                        zones,
                                        '',
                                        true, // directory
                                    )}
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-cloud-download-93"></i>
                                </span>
                            Download the Dataset (zip)
                            </button>
                        </CheckFineReadPermsComp>}
                        {/* <button
                        className="btn btn-success btn-simple text-nowrap"
                        cy="dataset-btn-stage-multi"
                        onClick={() =>
                            gotoRoute(ROUTE_DATA_SETS_MULTI, {
                                source_system: "lrz_iRODS",
                                source_path: stagePath(
                                    { internalID, project, access },
                                    username
                                ),
                                size: undefined,
                            })
                        }>
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-puzzle-10"></i>
                        </span>
                        Stage multi-part download
                    </button> */}
                        {location && <CheckFineWritePermsComp type='dat_short' prjID={location.project}>
                            <button
                                type="button"
                                className="btn btn-success btn-simple"
                                cy="dataset-btn-stage-deletion"
                                disabled={dataSet['__replicas'] || location.access === 'public' || dataSet.eudat.PID}
                                onClick={() =>
                                    deleteDataset(internalID)
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-trash-simple"></i>
                                </span>
                            Stage deletion of the Dataset
                            </button>
                        </CheckFineWritePermsComp>}
                    </div>
                </div>
                <DSModal
                    ref={this.modalDwnlRef}
                    headerTitle="DOWNLOAD"
                    alert
                >
                    <h4>Downloading</h4>
                    {DSReqProgStatus && <HandleDownload
                        status={DSReqProgStatus.status}
                        errorString={
                            DSReqProgStatus.errorString
                        }
                        downloadProgress={valOrZero(
                            DSReqProgStatus.progress
                        )}
                        downloadSpeed={displayShortBiSize(
                            valOrZero(
                                DSReqProgStatus
                                    .upDownSpeed
                            )
                        )}
                        remainingTime={displayShortTime(
                            valOrZero(
                                DSReqProgStatus
                                    .remainingTime
                            )
                        )}
                    />}
                </DSModal>
            </>
        )}
}

const mapStateToProps = state => ({
    dataSet: getDataSetDetail(state),
    DSReqProgStatus: getDSReqProgStatus(state),
    location: getDataSetLocation(state),

})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
    loadFile: dataSetsActions.Creators.loadFile,
    deleteDataset: dataSetsActions.Creators.delete
}

export const DataSetsNav = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsNavImpl)
