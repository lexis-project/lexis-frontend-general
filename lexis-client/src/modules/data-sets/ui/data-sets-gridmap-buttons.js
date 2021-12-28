import React from "react"

import {
    ROUTE_DATA_SETS_GRIDMAP_ADD,
    ROUTE_DATA_SETS_GRIDMAP_REMOVE,
} from "../../routing/routes"

export function GridMapButtons({ gotoRoute }) {
    return (
        <>
            {" "}
            <div className="col">
                <button
                    type="button"
                    className="btn btn-success btn-simple text-nowrap mx-1"
                    cy="dataset-btn-gridmap-add"
                    onClick={() => gotoRoute(ROUTE_DATA_SETS_GRIDMAP_ADD, {})}>
                    Update Distinguished Name (DN) at Lexis B2STAGE/GridFTP
                </button>
            </div>{" "}
            <div className="col">
                <button
                    type="button"
                    className="btn btn-success btn-simple text-nowrap mx-1"
                    cy="dataset-btn-gridmap-remove"
                    onClick={() =>
                        gotoRoute(ROUTE_DATA_SETS_GRIDMAP_REMOVE, {})
                    }>
                    Remove access to Lexis B2STAGE/GridFTP
                </button>
            </div>
        </>
    )
}
