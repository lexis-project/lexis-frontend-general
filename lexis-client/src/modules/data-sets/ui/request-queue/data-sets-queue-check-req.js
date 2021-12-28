import React from "react"
import { connect } from "react-redux"
import { getRequestIDURL, getRequestTypeURL } from "../../data-sets-selectors"
import { actions as routerActions } from "redux-router5"
import { getFormValues, reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../../forms/input-field"
import dataSetsActions from "../../data-sets-actions"
import { ROUTE_DATA_SETS_QUEUE_REQ_ID } from "../../../routing/routes"
import { getRouteName, getRouteParams } from "../../../routing/routing-selectors"

export const checkReq = (checkReq, navigateTo, routeName, {reqRouteType, reqID: reqRouteID}, reqType, reqID) => {
    if ( routeName === ROUTE_DATA_SETS_QUEUE_REQ_ID && reqRouteType === reqType && reqRouteID === reqID ) {
        return checkReq(reqID, reqType)
    }
    return navigateTo(ROUTE_DATA_SETS_QUEUE_REQ_ID, {type: reqType, reqID})
}

const DataSetsQueueCheckReqImpl = ({
    type,
    gotoRoute,
    initialValues,
    reqID,
    formValues,
    handleSubmit,
    checkPendingReqStatuses,
    route,
    routeParams,
    checkRequestStatus
}) => {
    const checkReqFn = () => checkReq(checkRequestStatus, gotoRoute, route, routeParams, type, reqID)
    return(
        <form onSubmit={handleSubmit(()=>gotoRoute(ROUTE_DATA_SETS_QUEUE_REQ_ID,{reqID:formValues[type], type}))}>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-simple text-nowrap mt-3"
                                        cy="dataset-query-check-req"
                                        onClick={()=>checkPendingReqStatuses(type)}
                                    >
                                        <span className="white d-inline-flex mr-2">
                                            <i className="tim-icons icon-refresh-02"></i>
                                        </span>
                                    Check pending requests
                                    </button>
                                </div>
                                <div className="col-6">
                                    <ReduxFormInputField
                                        name={type}
                                        label="Request ID"
                                        placeholder="Provide the request ID please"
                                        initialValue={
                                            reqID ? reqID : (initialValues === undefined ? undefined : initialValues[type])
                                        }
                                    />
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-simple text-nowrap mt-3"
                                        cy="dataset-query-check-req"
                                        onClick={checkReqFn}
                                        disabled={!(formValues && formValues[type] && formValues[type].length > 0)}
                                    >
                                        <span className="white d-inline-flex mr-2">
                                            <i className="tim-icons icon-refresh-02"></i>
                                        </span>
                                    Check request status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )}
const mapStateToProps = (state, ownProps) => ({
    type: getRequestTypeURL(state),
    reqID: getRequestIDURL(state),
    formValues: getFormValues(ownProps.form)(state),
    route: getRouteName(state),
    routeParams: getRouteParams(state)
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
    checkPendingReqStatuses: dataSetsActions.Creators.checkPendingReqStatuses,
    checkRequestStatus: dataSetsActions.Creators.checkRequestStatus
}

export default reduxForm({form: 'requestQueueCheckStatus', destroyOnUnmount: false})(connect(mapStateToProps,mapDispatchToProps)(DataSetsQueueCheckReqImpl))
