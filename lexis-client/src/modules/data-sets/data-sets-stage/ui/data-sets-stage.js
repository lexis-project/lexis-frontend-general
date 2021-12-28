import React from "react"
import { connect } from "react-redux"

import Actions from "../../data-sets-actions"
import { StageForm } from "./data-sets-stage-stageform"
import { getRouteParams } from "../../../routing/routing-selectors"
import { getDataSetDetail } from "../../data-sets-selectors"
import config from "../../../../config"

const DatasetsStageImpl = ({
    params,
    requestStage,
    dataSet,
}) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>Stage Dataset</h1>
                </div>
            </div>
            <StageForm
                form="stage"
                initialValues={{...params, source_system: decodeURIComponent(params.source_system)}}
                stagingZones={Object.values(config.DSzonesToiRODSzones)}
                onFormSubmit={requestStage}
                showMeta={false}
                showJobID={false}
                dataSet={dataSet}
            />
        </>
    )
}

const mapStateToProps = state => ({
    params: getRouteParams(state), // internalID, source_system, source_path
    dataSet: getDataSetDetail(state),
})

const mapDispatchToProps = {
    requestStage: Actions.Creators.requestStage,
}

export const DatasetsStage = connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetsStageImpl)
