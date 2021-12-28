import { actionTypes as routerActions } from "redux-router5"
import { take, fork } from "redux-saga/effects"

export function* onRouteEnter(routeToEnter, saga, ...params) {
    while (true) {
        const {
            payload: { route },
        } = yield take(routerActions.TRANSITION_SUCCESS)

        if (route && route.name === routeToEnter) {
            yield fork(saga, ...params)
        }
    }
}

export function* onRouteLeave(routeToListen, saga, ...params) {
    let isInsideRoute = false
    while (true) {
        const {
            payload: { route },
        } = yield take(routerActions.TRANSITION_SUCCESS)
        if(route) {
            if(!isInsideRoute && route.name === routeToListen){
                isInsideRoute = true
            }else if(isInsideRoute && route.name !== routeToListen){
                isInsideRoute = false
                yield fork(saga, ...params)
            }
        }
    }
}

export function* onRouteLeaveOnce(routeToListen, saga, ...params) {
    while (true) {
        const {
            payload: { route },
        } = yield take(routerActions.TRANSITION_SUCCESS)
        if(route) {
            if(route.name !== routeToListen){
                yield fork(saga, ...params)
                return
            }
        }
    }
}
