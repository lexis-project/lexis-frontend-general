import React from "react"
import { connect } from "react-redux"

import Actions from "../../data-sets-actions"
import { StageForm } from "./data-sets-replica-stageform"
import { getRouteParams } from "../../../routing/routing-selectors"
import { getDataSetDetail } from "../../data-sets-selectors"

const DatasetsReplicaReplicateImpl = ({
    params,
    requestDatasetReplica,
    dataSet,
}) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>Replicate Dataset</h1>
                </div>
            </div>
            <StageForm
                form="stage"
                initialValues={params}
                onFormSubmit={requestDatasetReplica}
                showMeta={false}
                showJobID={false}
                dataSet={dataSet}
            />
            <div className="row">
                <div className="col">
                    <p>
                        Replication uses EUDAT to ensure data traceability and availability, and as such metadata is exposed for citation purposes. Such datasets cannot be deleted, since that would break possible external citations. Use Duplication instead if this is not desired.
                    </p>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    params: getRouteParams(state), // internalID, source_system, source_path, target_path
    dataSet: getDataSetDetail(state),
})

const mapDispatchToProps = {
    requestDatasetReplica: Actions.Creators.requestReplica,
}

export const DatasetsReplicaReplicate = connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetsReplicaReplicateImpl)
