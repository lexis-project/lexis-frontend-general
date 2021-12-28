import React, { Fragment } from "react"
//import Table from "react-bootstrap/Table";
//import Button from "react-bootstrap/Button";
//import Row from "react-bootstrap/Row";
//import Col from "react-bootstrap/Col";
import { connect } from "react-redux"
import { actions } from "redux-router5"

import {
    ROUTE_ORGANIZATIONS_CREATE,
    ROUTE_ORGANIZATIONS_DETAIL,
} from "../../routing/routes"
import { getOrganizations } from "../organizations-selectors"

export const OrganizationListImpl = ({ gotoRoute, organizations }) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Organizations</h1>
            </div>
            <div className="col-4" style={{ textAlign: "right" }}>
                <button
                    type="button"
                    className="btn btn-primary"
                    variant="primary"
                    onClick={() => gotoRoute(ROUTE_ORGANIZATIONS_CREATE)}>
                    Register new organization
                </button>
            </div>
        </div>
        <div className="row" style={{ marginTop: 50 }}>
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Website</th>
                    </tr>
                </thead>
                <tbody>
                    {organizations.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center" }}>
                                Empty list of organizations
                            </td>
                        </tr>
                    )}
                    {organizations.map(
                        ({ ID, FormalName, RegisteredCountry, Website }) => (
                            <tr key={ID}>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-link"
                                        variant="link"
                                        onClick={() =>
                                            gotoRoute(
                                                ROUTE_ORGANIZATIONS_DETAIL,
                                                { Id: ID }
                                            )
                                        }>
                                        {FormalName}
                                    </button>
                                </td>
                                <td>{RegisteredCountry}</td>
                                <td>{Website}</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    </Fragment>
)

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

const mapStateToProps = state => ({
    organizations: getOrganizations(state),
})

export const OrganizationList = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizationListImpl)
