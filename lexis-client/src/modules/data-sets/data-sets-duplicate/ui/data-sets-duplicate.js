import React from "react"
import { connect } from "react-redux"

import Actions from "../../data-sets-actions"
import { StageForm } from "./data-sets-duplicate-stageform"
import { getRouteParams } from "../../../routing/routing-selectors"
import { getDataSetDetail } from "../../data-sets-selectors"

const DatasetsDuplicateImpl = ({
    params,
    requestDatasetDuplicate,
    dataSet,
}) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>Duplicate Dataset</h1>
                </div>
            </div>
            <StageForm
                form="stage"
                initialValues={params}
                onFormSubmit={requestDatasetDuplicate}
                showMeta={false}
                showJobID={false}
                dataSet={dataSet}
            />
        </>
    )
}

const mapStateToProps = state => ({
    params: getRouteParams(state), // internalID, source_system, source_path, target_path, title
    dataSet: getDataSetDetail(state),
})

const mapDispatchToProps = {
    requestDatasetDuplicate: Actions.Creators.requestDuplicate,
}

export const DatasetsDuplicate = connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetsDuplicateImpl)
