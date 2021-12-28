import React from "react";
import { connect } from "react-redux";
import { actions } from "redux-router5";

import {
    getDataSets,
    getFetchingStateOfDatasets,
} from "../data-sets-selectors";
import { getProjects } from "../../projects/projects-selectors";
import { getRouteName } from "../../routing/routing-selectors";
import {
    ROUTE_DATA_SETS_CREATEWIZARD, ROUTE_DATA_SETS_QUEUE, ROUTE_DATA_SETS_LIST,
} from "../../routing/routes"

import { DataSetListTable } from "./table/data-sets-list-table"
import { CheckAnyWriteDatPerms } from "../../auth/auth-check-fine-perms";

export const DataSetsListImpl = ({
    datasets,
    gotoRoute,
    projects,
    listFetchInProgress,
}) => (
    <>
        <div className="row">
            <div className="col">
                <h1>Data Sets</h1>
            </div>
            <div className="col-6 text-right" >
                <button
                    type="button"
                    className="btn btn-info btn-simple text-nowrap mr-2"
                    cy="dataset-btn-req-status"
                    onClick={() => gotoRoute(ROUTE_DATA_SETS_QUEUE, {type: 'deletion'})}>
                    <span className="white d-inline-flex mx-1">
                        <i className="tim-icons icon-refresh-02"></i>
                    </span>{" "}
                        Check requests status
                </button>
                <button
                    type="button"
                    className="btn btn-info btn-simple text-nowrap mr-2"
                    cy="dataset-btn-req-status"
                    onClick={() => {
                        gotoRoute(ROUTE_DATA_SETS_LIST, {
                            forceQuery: true,
                        })
                    }}>
                    <span className="white d-inline-flex mx-1">
                        <i className="tim-icons icon-refresh-02"></i>
                    </span>{" "}
                        Refresh list of datasets
                </button>
                <CheckAnyWriteDatPerms>
                    <button
                        type="button"
                        className="btn btn-info btn-simple text-nowrap"
                        cy="dataset-btn-create"
                        onClick={() => gotoRoute(ROUTE_DATA_SETS_CREATEWIZARD)}>
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-upload"></i>
                        </span>{" "}
                        Create new dataset
                    </button>
                </CheckAnyWriteDatPerms>
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div
                            className="datasetsTable"
                        >
                            {listFetchInProgress ? (
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="spinner-border text-light m-5"
                                        role="status"
                                        style={{
                                            width: "3rem",
                                            height: "3rem",
                                        }}>
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <DataSetListTable
                                    datasets={datasets}
                                    projects={projects}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
)

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

const mapStateToProps = state => ({
    datasets: getDataSets(state),
    route: getRouteName(state),
    //https://gist.github.com/6174/6062387
    projects: getProjects(state),
    listFetchInProgress: getFetchingStateOfDatasets(state),
})

export const DataSetsList = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsListImpl)
