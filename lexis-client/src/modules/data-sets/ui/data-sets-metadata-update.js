import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    getDataSetMetadata,
    getDataSetsProject,
    getDataSetDetail,
} from "../data-sets-selectors"
import { getUserName } from "../../auth/auth-selectors"

import Actions from "../data-sets-actions"
import { MetadataUpdateForm } from "./metadata-create-or-update-form"

import { DataSetsNav } from "./data-sets-nav"

export const DataSetsMetadataUpdateImpl = ({
    dataSet,
    project,
    username,
    metadata,
    submitMetadataUpdate,
}) => (
    <>
        <Fragment>
            <div className="row">
                <div className="col-4">
                    <h1>Metadata Update</h1>
                </div>
                <div className="col-2"></div>
                <div className="col-4 pl-5 ml-3" style={{ textAlign: "left" }}>
                    {dataSet && dataSet.location && <DataSetsNav
                        internalID={dataSet.location.internalID}
                        username={username}
                        dataSet={dataSet}
                        project={project}
                    />}
                </div>
                <div className="col-2"></div>
            </div>
            {metadata ? (dataSet && !dataSet['__replicas'] ?
                <MetadataUpdateForm
                    form="metadata-update"
                    initialValues={metadata}
                    onFormSubmit={submitMetadataUpdate}
                />
                : <h2>Replicated dataset could not be mutable!</h2>
            ) : (
                <div className="row">
                    <div className="col-12 text-center">
                        <div
                            className="spinner-border text-light ml-2"
                            role="status"
                            style={{ marginTop: "20vh" }}>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    </>
)

const mapStateToProps = state => ({
    metadata: getDataSetMetadata(state),
    username: getUserName(state),
    project: getDataSetsProject(state),
    dataSet: getDataSetDetail(state),
})

const mapDispatchToProps = {
    submitMetadataUpdate: Actions.Creators.requestMetadataUpdate,
}

export const DataSetsMetadataUpdate = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsMetadataUpdateImpl)
