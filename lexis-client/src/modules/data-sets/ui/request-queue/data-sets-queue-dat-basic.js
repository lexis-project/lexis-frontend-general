import React from "react"
import { connect } from "react-redux"
import { getRequestIDsByType } from "../../data-sets-selectors"
import cx from 'classnames'
import moment from "moment"
import { listAndFilterReqIDs } from "../../data-sets-utils"
import { actions as routerActions } from "redux-router5"
import { getRouteName, getRouteParams } from "../../../routing/routing-selectors"
import dataSetsActions from "../../data-sets-actions"
import { checkReq } from "./data-sets-queue-check-req"

const DataSetsQueueDatBasicImpl = ({
    reqID,
    reqIDs,
    gotoRoute,
    type,
    checkRequestStatus,
    route,
    routeParams
}) => {
    const {DatReqKeys, SelectedReq} = listAndFilterReqIDs(reqIDs, reqID)
    return(
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-striped table-bordered table-hover"
                                cy="dat-deletion-req-list">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Request creation</th>
                                        <th>Last check</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DatReqKeys && (<>
                                        { SelectedReq && (<tr key={`${SelectedReq.id}-static`}>
                                            <th>
                                                <button
                                                    className="btn btn-link text-warning"
                                                    onClick={()=>
                                                        checkReq(checkRequestStatus, gotoRoute, route, routeParams, type, SelectedReq.id)
                                                    }>
                                                    {SelectedReq.id}
                                                </button>
                                            </th>
                                            <td>{!SelectedReq.creation ? '-' : moment(SelectedReq.creation).format('llll')}</td>
                                            <td>{!SelectedReq.lastCheck ? '-' : moment(SelectedReq.lastCheck).format('llll')}</td>
                                            <th className={
                                                cx({
                                                    'text-success': SelectedReq.status === 'Done'
                                                })
                                            }>{SelectedReq.status}</th>
                                        </tr>)
                                        }
                                        { DatReqKeys
                                            .map((req) => {
                                                return (<tr key={req.id}>
                                                    <td>
                                                        <button
                                                            className="btn btn-link"
                                                            onClick={()=>
                                                                checkReq(checkRequestStatus, gotoRoute, route, routeParams, type, req.id)
                                                            }>
                                                            {req.id}
                                                        </button>
                                                    </td>
                                                    <td>{!req.creation ? '-' : moment(req.creation).format('llll')}</td>
                                                    <td>{!req.lastCheck ? '-' : moment(req.lastCheck).format('llll')}</td>
                                                    <td className={
                                                        cx({
                                                            'text-success': req.status === 'Done'
                                                        })
                                                    }>{req.status}</td>
                                                </tr>)
                                            })
                                        }
                                    </>)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}

const mapStateToProps = (state, ownProps) => ({
    reqIDs: getRequestIDsByType(state, ownProps),
    route: getRouteName(state),
    routeParams: getRouteParams(state)
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
    checkRequestStatus: dataSetsActions.Creators.checkRequestStatus
}

export default connect(mapStateToProps,mapDispatchToProps)(DataSetsQueueDatBasicImpl)
