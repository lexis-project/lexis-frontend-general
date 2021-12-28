import React from "react"
import { connect } from "react-redux"
import { getRequestIDURL, getRequestTypeURL } from "../data-sets-selectors"
import cx from 'classnames'
import { actions as routerActions } from "redux-router5"
import { ROUTE_DATA_SETS_QUEUE } from "../../routing/routes"
import DatBasic from './request-queue/data-sets-queue-dat-basic'
import DataSetsQueueCheckReq from "./request-queue/data-sets-queue-check-req"
import DataSetsQueueDatSize from "./request-queue/data-sets-queue-dat-size"
import DataSetsQueueDatAssignPid from "./request-queue/data-sets-queue-dat-assign-pid"

const switchLists = (type,reqID) => {
    switch (type) {
    // case 'deletion':
    //     return <DatBasic type={type} reqID={reqID}/>
    case 'datDeletion':
        return <DatBasic type={type} reqID={reqID}/>
    case 'duplication':
        return <DatBasic type={type} reqID={reqID}/>
    case 'replication':
        return <DatBasic type={type} reqID={reqID}/>
    case 'staging':
        return <DatBasic type={type} reqID={reqID}/>
    case 'datasize':
        return <DataSetsQueueDatSize type={type} reqID={reqID} />
    case 'newPID':
        return <DataSetsQueueDatAssignPid type={type} reqID={reqID} />
    default:
        return null
    }
}

const DataSetsQueueImpl = ({
    type,
    gotoRoute,
    reqID
}) => (
    <>
        <div className="row">
            <div className="col-12">
                <h2>Request Status</h2>
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={cx({
                                    'nav-link': true,
                                    'active': type === 'datasize'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'datasize'})}
                                >Data size</button>
                            </li>
                            {/* <li className={cx({'nav-item': true})}>
                            <button className={cx({
                                'nav-link': true,
                                'active': type === 'deletion'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'deletion'})}
                                >Deletion</button>
                        </li> */}
                            <li className="nav-item">
                                <button className={cx({
                                    'nav-link': true,
                                    'active': type === 'datDeletion'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'datDeletion'})}
                                >Data Deletion</button>
                            </li>
                            <li className="nav-item">
                                <button className={cx({
                                    'nav-link': true,
                                    'active': type === 'duplication'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'duplication'})}
                                >Duplication</button>
                            </li>
                            <li className="nav-item">
                                <button className={cx({
                                    'nav-link': true,
                                    'active': type === 'replication'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'replication'})}
                                >Replication</button>
                            </li>
                            <li className="nav-item">
                                <button className={cx({
                                    'nav-link': true,
                                    'active': type === 'staging'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'staging'})}
                                >Staging</button>
                            </li>
                            <li className="nav-item">
                                <button className={cx({
                                    'nav-link': true,
                                    'active': type === 'newPID'
                                })}
                                onClick={()=> gotoRoute(ROUTE_DATA_SETS_QUEUE,{type:'newPID'})}
                                >PID assignment</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <DataSetsQueueCheckReq />
        {switchLists(type,reqID)}
    </>
)
const mapStateToProps = (state) => ({
    type: getRequestTypeURL(state),
    reqID: getRequestIDURL(state)
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo
}

export const DataSetsQueue = connect(mapStateToProps,mapDispatchToProps)(DataSetsQueueImpl)
