import React from "react"
import { connect } from "react-redux"
import { ComponentModal } from "../../../interactiveStyle/component-modal"
import DataSetsFilelistTable from "../../../data-sets/ui/data-sets-filelist-table"
import { useRef } from "react"
import { change, getFormValues } from "redux-form"
import { getUserFinePerms } from "../../../auth/auth-selectors"
import { checkFineReadPerms } from "../../../auth/auth-check-fine-perms"
import { getDataSetsFilelist } from "../../../entity-repository/entity-repository-selectors"
import { actions as routerActions } from "redux-router5"
import { getFetchingStateOfDatasets } from "../../../data-sets/data-sets-selectors"
import SearchSelectField from "../../../forms/search-select-field"
import dataSetsActions from "../../../data-sets/data-sets-actions"

function DataSetFieldImpl({
    formName,
    inputParameter,
    datasets,
    projectShortName,
    formValues,
    perms,
    filelistER,
    gotoRoute,
    changeVal,
    fetchinProg,
    fullPathRequired,
    requestDatasetContent,
}) {
    let filteredDatasets = checkFineReadPerms(
        projectShortName,
        "dat_short",
        perms
    )
        ? datasets
            .filter(dataset => dataset.location.project === projectShortName)
            .sort((a, b) => a.metadata.title > b.metadata.title)
        : [
            {
                location: { internalID: "" },
                metadata: {
                    title: "Not enough permissions to access project datasets",
                },
            },
        ]

    const displayNames = filteredDatasets.map(dataset =>
        dataset.metadata.title ? dataset.metadata.title : "<missing title>"
    )
    const values = filteredDatasets.map(dataset => ({
        value: dataset.location.internalID,
        label:
            dataset.metadata.title || dataset.metadata.title === ""
                ? dataset.metadata.title
                : "<missing title>",
    }))

    const datasetIDFieldName = `${inputParameter.inputParamName}_==datasetID`
    const datasetFilePathFieldName = `${inputParameter.inputParamName}_==datasetFilePath`
    const modalRef = useRef()

    const datasetID =
        formValues &&
        formValues.inputParameters &&
        formValues.inputParameters[datasetIDFieldName]

    const datasetFilePath =
        formValues &&
        formValues.inputParameters &&
        formValues.inputParameters[datasetFilePathFieldName]
    const filelist = datasetID && filelistER[datasetID.value]

    return (
        <>
            <SearchSelectField
                key={inputParameter.inputParamName}
                name={`inputParameters.${datasetIDFieldName}`}
                label={inputParameter.displayName}
                info={inputParameter.description}
                displayNames={displayNames}
                options={values}
                required={inputParameter.inputParamRequired}
                isLoading={fetchinProg}
            />
            {fullPathRequired && datasetFilePath && (
                <div className="row">
                    <div className="col-3 text-white">Choosen file: </div>
                    <div className="col-9">
                        <pre className="text-warning">{datasetFilePath}</pre>
                    </div>
                </div>
            )}
            {fullPathRequired && datasetID && (
                <button
                    className="btn btn-primary btn-simple text-nowrap"
                    type="button"
                    onClick={() => {
                        modalRef.current.showModal()
                        requestDatasetContent(datasetID.value)
                    }}>
                    <span className="white d-inline-flex mx-1">
                        <i className="tim-icons icon-single-copy-04"></i>
                    </span>
                    {datasetFilePath ? "Change choosen file" : "Choose file"}
                </button>
            )}
            <ComponentModal
                ref={modalRef}
                headerTitle="Choose file from data set"
                dialogClassName="selectDSFieldDialog"
                contentClassName="selectDSFieldContent"
                titleClassName="titleDSFieldBody"
                className="selectDSFieldBody"
                alert>
                <DataSetsFilelistTable
                    fileList={filelist}
                    hasReadPermissions={true}
                    gotoRoute={gotoRoute}
                    onSelectAction={(path, filename) => {
                        changeVal(
                            formName,
                            `inputParameters.${datasetFilePathFieldName}`,
                            `${path}${filename}`
                        )
                        modalRef.current.hideModal()
                    }}
                    selectMode
                    selectFiles
                />
            </ComponentModal>
        </>
    )
}
const mapStateToProps = (state, ownProps) => ({
    formValues: getFormValues(ownProps.formName)(state),
    perms: getUserFinePerms(state),
    filelistER: getDataSetsFilelist(state),
    fetchinProg: getFetchingStateOfDatasets(state),
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
    changeVal: change,
    requestDatasetContent: dataSetsActions.Creators.requestDatasetContent,
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSetFieldImpl)
