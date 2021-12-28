import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import { ROUTE_DATA_SETS_CREATE_EUDAT } from "../../routing/routes"

import Actions from "../data-sets-actions"
import { GridmapRemoveForm } from "./gridmap-remove-form"


export const DataSetsGridmapRemoveImpl = ({
    submitGridmapRemove,
    gotoRoute,
}) => (
    <>
        <button
            className="btn btn-link"
            variant="link"
            onClick={() => gotoRoute(ROUTE_DATA_SETS_CREATE_EUDAT)}>
            Dataset Upload via EUDAT
        </button>
        <Fragment>
            <h1>Remove user access to Lexis EUDAT/GridFTP</h1>
            <p>
                Lexis administrators may modify any username. Leave empty to use
                your current username.
            </p>

            <GridmapRemoveForm
                form="gridmap-remove"
                onFormSubmit={submitGridmapRemove}
            />
        </Fragment>
    </>
)

const mapDispatchToProps = {
    submitGridmapRemove: Actions.Creators.requestGridmapRemove,
    gotoRoute: actions.navigateTo,
}

export const DataSetsGridmapRemove = connect(
    null,
    mapDispatchToProps
)(DataSetsGridmapRemoveImpl)
