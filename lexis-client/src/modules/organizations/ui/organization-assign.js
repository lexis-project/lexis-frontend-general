import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import { ROUTE_ORGANIZATIONS_CREATE } from "../../routing/routes"

export const OrganizationAssignImpl = ({ gotoRoute }) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Organization</h1>
            </div>
        </div>

        <div className="row">
            <div className="col-9">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body mb-3">
                        <div
                            className="btn-toolbar"
                            role="toolbar"
                            aria-label="Toolbar with button groups">
                            <button
                                type="button"
                                className="btn btn-success btn-simple text-nowrap"
                                onClick={() =>
                                    gotoRoute(ROUTE_ORGANIZATIONS_CREATE)
                                }
                                cy="organization-btn-create">
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-simple-add"></i>
                                </span>{" "}
                                Create organization and assign yourself to it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
)

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

export const OrganizationAssign = connect(
    null,
    mapDispatchToProps
)(OrganizationAssignImpl)
