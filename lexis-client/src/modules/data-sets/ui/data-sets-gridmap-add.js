import React from "react";
import { connect } from "react-redux";
import { actions } from "redux-router5";
import { ROUTE_DATA_SETS_CREATE_EUDAT } from "../../routing/routes";

import Actions from "../data-sets-actions"
import { GridmapAddForm } from "./gridmap-add-form"

export const DataSetsGridmapAddImpl = ({ submitGridmapAdd, gotoRoute }) => (
    <>
        <div className="row">
            <div className="col-9">
                <h1>
                    Association of distinguished name (DN) to Lexis DDI EUDAT
                    B2STAGE GridFTP
                </h1>

                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <p>
                                    Lexis administrators may modify any
                                    username. Leave empty to use your current
                                    username.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-1"></div>
            <div className="col-2">
                <button
                    className="btn btn-info btn-simple text-nowrap"
                    onClick={() => gotoRoute(ROUTE_DATA_SETS_CREATE_EUDAT)}>
                    <span className="white d-inline-flex mx-1">
                        <i className="tim-icons icon-upload"></i>
                    </span>
                    Dataset Upload via EUDAT
                </button>
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <GridmapAddForm
                    form="gridmap-add"
                    onFormSubmit={submitGridmapAdd}
                />
            </div>
        </div>
    </>
)

const mapDispatchToProps = {
    submitGridmapAdd: Actions.Creators.requestGridmapAdd,
    gotoRoute: actions.navigateTo,
}

export const DataSetsGridmapAdd = connect(
    null,
    mapDispatchToProps
)(DataSetsGridmapAddImpl)
