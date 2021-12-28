import React from "react"
import { connect } from "react-redux"

import Actions from "../data-sets-actions"
import { MetadataQueryForm } from "./metadata-query-form"


export const DataSetsSearchImpl = ({ submitMetadataQuery, gotoRoute }) => (
    <>
        <div className="row">
            <div className="col">
                <h1>Metadata Search</h1>
                <h2>Leave empty to see all the datasets you have access to</h2>
            </div>
        </div>
        <MetadataQueryForm
            form="metadata-query"
            onFormSubmit={submitMetadataQuery}
        />
    </>
)

const mapDispatchToProps = {
    submitMetadataQuery: Actions.Creators.queryAndNavigate,
}

export const DataSetsSearch = connect(
    null,
    mapDispatchToProps
)(DataSetsSearchImpl)
