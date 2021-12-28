import React from "react"

import { ROUTE_PROJECT_DETAIL } from "../../routing/routes"

export const ProjectButton = ({
    projects,
    short,
    gotoRoute,
    internalID,
    showFullName,
}) => {
    let p = projects.find(e => e.ProjectShortName === short)
    if (p !== undefined) {
        return showFullName ? (
            <button
                className="btn btn-link"
                style={{ padding: 0 }}
                cy={"dataset-project-button-btn-" + internalID}
                onClick={() =>
                    gotoRoute(ROUTE_PROJECT_DETAIL, {
                        id: p.ProjectID,
                    })
                }>
                {p.ProjectName}
            </button>
        ) : (
            <button
                className="btn btn-link"
                style={{ padding: 0 }}
                cy={"dataset-project-button-btn-" + internalID}
                onClick={() =>
                    gotoRoute(ROUTE_PROJECT_DETAIL, {
                        id: p.ProjectID,
                    })
                }>
                {short}
            </button>
        )
    } else {
        return <p>{short}</p>
    }
}
