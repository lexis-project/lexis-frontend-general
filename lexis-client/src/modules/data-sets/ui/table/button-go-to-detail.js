import React from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import { ROUTE_DATA_SETS_DETAIL } from "../../../routing/routes"

export const ButtonGoToDetailImpl = ({ gotoRoute, name, id, className, cy }) => (
    <>
        <button
            className={`btn btn-link ${className}`}
            onClick={() =>
                gotoRoute(ROUTE_DATA_SETS_DETAIL, {
                    internalID: encodeURIComponent(id),
                })
            }
            cy={cy}
        >
            {name ? name : <em>{"<"}missing title{">"}</em> }
        </button>
    </>
)

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

export const ButtonGoToDetail = connect(
    null,
    mapDispatchToProps
)(ButtonGoToDetailImpl)
