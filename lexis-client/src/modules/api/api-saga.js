import { call, put, takeEvery, all } from "redux-saga/effects"

import { ServerErrorException } from "./exceptions/server-error-exception"
import Actions from "./api-actions"
import { ToastsStore } from "react-toasts"
import { NotFoundException } from "./exceptions/not-found-exception"
import { MalformedRequestException } from "./exceptions/malformed-request-exception"
import { actions as routerActions } from "redux-router5"
import { ROUTE_ERROR } from "../routing/routes"
import { ForbiddenException } from "./exceptions/forbidden-exception"
import { UnauthorizedException } from "./exceptions/unauthorized-exception"
import { TUSErrorException } from "./exceptions/tus-error-exception"
import { TUSRetryDelays } from "./client"
import { logout } from "../auth/auth-saga"
import { TokenExpired } from "./exceptions/token-expired"

export function* createApiSafely(api, ...args) {
    try {
        const { data, status, config } = yield call(api, ...args)

        var dataWhile422
        try {
            dataWhile422 = JSON.parse(config.data)
        } catch(err) { }

        if (status) {
            switch (status) {
            case 422:
                yield put(
                    Actions.Creators.success(
                        `Warning: unable to process request because ${data} - shortname already taken, choose another one.`
                    )
                )
                dataWhile422.INVALID_PROJECT_SHORT_NAME = true
                return dataWhile422
            case 200:
            case 201:
                yield put(
                    Actions.Creators.success("Data successfuly created.")
                )
                return data
            case 202:
                yield put(
                    Actions.Creators.success(
                        "Data accepted and added to queue."
                    )
                )
                return data
            case 401:
                throw new UnauthorizedException("Unauthorized")
            case 403:
                throw new ForbiddenException("Permissions denied")
            default:
                console.error("createApiSafely - status code is not 201")
                yield put(
                    Actions.Creators.internalServerError("Unexpected error")
                )
                throw new Error("createApiSafely - status code is not 201")
            }
        } else {
            yield put(
                Actions.Creators.internalServerError("Server not responding")
            )
            throw new Error("Server not responding")
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                Actions.Creators.internalServerError("Error " + ex.message)
            )
            throw ex
            //break;
        case NotFoundException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
        case ForbiddenException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
        case UnauthorizedException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
            //break;
        case MalformedRequestException:
            yield put(
                Actions.Creators.warningException(
                    "Error, request not Accepted: " + ex.message
                )
            )
            throw ex
        default:
            throw ex
        }
    }
}

export function* createApiSafelyOr40X(api, ...args) {
    try {
        const { data, status } = yield call(api, ...args)
        switch (status) {
        case 201:
            yield put(Actions.Creators.success("Data successfuly created."))
            return ["Data successfuly created.", data, status]
        case 403:
            return ["Forbidden.", data, status]
        case 400:
            var m
            if (data.errorString) m = data.errorString
            if (data.message) m = data.message
            return ["Invalid input:" + m, data, status]
        default:
            console.error("createApiSafely - status code is not 201 or 403")
            yield put(
                Actions.Creators.internalServerError("Unexpected error")
            )
            break
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                Actions.Creators.internalServerError("Error " + ex.message)
            )
            throw ex
            //break;
        case NotFoundException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
            //break;
        case MalformedRequestException:
            yield put(
                Actions.Creators.warningException(
                    "Error, request not Accepted: " + ex.message
                )
            )
            throw ex
        default:
            throw ex
        }
    }
}

export function* updateApiSafely(api, ...args) {
    try {
        const response = yield call(api, ...args)
        if (response && response.status) {
            switch (response.status) {
            case 200:
                yield put(
                    Actions.Creators.success("Data successfuly updated.")
                )
                break
            case 403:
                throw new ForbiddenException("Permissions denied")
            default:
                console.error("updateApiSafely - status code is not 200")
                yield put(
                    Actions.Creators.internalServerError("Unexpected error")
                )
                throw new Error("updateApiSafely - status code is not 200")
            }
        } else {
            yield put(
                Actions.Creators.internalServerError(
                    "Server does not responding"
                )
            )
            throw new Error("Server does not responding")
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                Actions.Creators.internalServerError("Error " + ex.message)
            )
            throw ex
        case NotFoundException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
        case ForbiddenException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
        default:
            throw ex
        }
    }
}

export function* deleteApiSafelyOr40X(api, ...args) {
    try {
        const { status, data } = yield call(api, ...args)
        switch (status) {
        case 204:
            yield put(
                Actions.Creators.success("Data successfully deleted.")
            )
            return ["Data successfully deleted.", data, status]
            //break;
        case 201:
            yield put(
                Actions.Creators.success(
                    "Data deletion successfully queued."
                )
            )
            return ["Data deletion successfully queued.", data, status]
            //break;
        case 403:
            yield put(
                Actions.Creators.warningException(
                    "Permission denied deleting data."
                )
            )
            return ["Permission denied deleting data.", data, status]
            //break;
        case 404:
            yield put(
                Actions.Creators.warningException(
                    "Item not found deleting data."
                )
            )
            return ["Item not found deleting data.", data, status]
            //break;
        default:
            console.error(
                "deleteApiSafelyOr40X - status code is not 201, 202, 204, 403 or 404: " +
                        status
            )
            yield put(
                Actions.Creators.internalServerError("Unexpected error")
            )
            break
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                Actions.Creators.internalServerError("Unexpected error")
            )
            break
        case NotFoundException:
            yield put(Actions.Creators.warningException("Unexpected error"))
            break
        default:
            throw ex
        }
    }
}

export function* deleteApiSafely(api, ...args) {
    try {
        const response = yield call(api, ...args)
        if (response && response.status) {
            switch (response.status) {
            case 200:
            case 201:
            case 204:
                yield put(
                    Actions.Creators.success("Data successfully deleted.")
                )
                return response.data
            case 202:
                yield put(
                    Actions.Creators.success(
                        "Data deletion successfully accepted."
                    )
                )
                return response.data
            case 403:
                throw new ForbiddenException("Permissions denied")
            default:
                console.error(
                    "deleteApiSafely - status code is not 200, 202, or 204"
                )
                yield put(
                    Actions.Creators.internalServerError("Unexpected error")
                )
                throw new Error("deleteApiSafely - status code is not 200")
            }
        } else {
            yield put(
                Actions.Creators.internalServerError("Server not responding")
            )
            throw new Error("Server does not responding")
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                Actions.Creators.internalServerError("Error " + ex.message)
            )
            throw ex
        case NotFoundException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
        case ForbiddenException:
            yield put(
                Actions.Creators.warningException("Error " + ex.message)
            )
            throw ex
        default:
            throw ex
        }
    }
}

export function* queueApiSafely(api, ...args) {
    try {
        const response = yield call(api, ...args)
        if (response && response.status) {
            switch (response.status) {
            case 201:
                if (typeof response.data === "object") {
                    return response.data
                } else {
                    console.error("queueApiSafely - data is not valid")
                    yield put(
                        routerActions.navigateTo(ROUTE_ERROR, {
                            eType: "CLIENT ERROR",
                            eMessage: "TypeError: invalid data",
                        })
                    )
                    throw new Error("queueApiSafely - data is not valid")
                }
            case 403:
                throw new ForbiddenException("Permissions denied")
            default:
                console.error("queueApiSafely - status code is not 201")
                //yield put(Actions.Creators.internalServerError("Unexpected error"));
                yield put(
                    routerActions.navigateTo(ROUTE_ERROR, {
                        eType: "CLIENT ERROR",
                        eMessage:
                                "Unexpected Error: invalid status code: " +
                                response.status.toString(),
                    })
                )
                throw new Error("queueApiSafely - status code is not 200")
            }
        } else {
            yield put(
                Actions.Creators.internalServerError("Server is not responding")
            )
            throw new Error("Server is not responding")
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "500",
                    eMessage: ex.message,
                })
            )
            throw ex
        case NotFoundException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "404",
                    eMessage: ex.message,
                })
            )
            throw ex
        case ForbiddenException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "403",
                    eMessage: ex.message,
                })
            )
            throw ex
        default:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "500",
                    eMessage: ex.message,
                })
            )
            throw ex
        }
    }
}

export function* readApiSafely(api, ...args) {
    try {
        let apiFn = api
        let fnArgs = args
        // 'downloadDataSet' this endpoint may returning raw data, object check should be disabled
        if (api === "downloadDataSet") {
            apiFn = args[0]
            fnArgs = args.slice(1, args.length)
        }
        const response = yield call(apiFn, ...fnArgs)

        if (response && response.status) {
            switch (response.status) {
            case 201:
            case 200:
                if (
                    typeof response.data === "object" ||
                        response.data === "" ||
                        api === "downloadDataSet"
                ) {
                    return response.data
                } else {
                    console.error(
                        "readApiSafely - data is not valid",
                        response.data
                    )
                    yield put(
                        routerActions.navigateTo(ROUTE_ERROR, {
                            eType: "CLIENT ERROR",
                            eMessage: "TypeError: invalid data",
                        })
                    )
                    throw new Error("readApiSafely - data is not valid")
                }
            default:
                console.error("readApiSafely - status code is not 200")
                //yield put(Actions.Creators.internalServerError("Unexpected error"));
                yield put(
                    routerActions.navigateTo(ROUTE_ERROR, {
                        eType: "CLIENT ERROR",
                        eMessage:
                                "Unexpected Error: invalid status code: " +
                                response.status.toString(),
                    })
                )
                throw new Error("readApiSafely - status code is not 200")
            }
        } else {
            yield put(
                Actions.Creators.internalServerError("Server is not responding")
            )
            throw new Error("Server is not responding")
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "500",
                    eMessage: ex.message,
                })
            )
            throw ex
        case NotFoundException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "Not Found",
                    eMessage: ex.message,
                })
            )
            throw ex
        case TokenExpired:
            yield put(
                Actions.Creators.tokenExpired("Token no longer valid.")
            )
            break
        default:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "500",
                    eMessage: ex.message,
                })
            )
            throw ex
        }
    }
}

export function* readApiSafelyOr40X(api, ...args) {
    try {
        const response = yield call(api, ...args)
        if (response && response.status) {
            switch (response.status) {
            case 200:
                if (typeof response.data === "object") {
                    return [
                        "Data read correctly",
                        response.data,
                        response.status,
                    ]
                } else {
                    console.error("readApiSafelyOr40X - data is not valid")
                    yield put(
                        routerActions.navigateTo(ROUTE_ERROR, {
                            eType: "CLIENT ERROR",
                            eMessage: "TypeError: invalid data",
                        })
                    )
                    throw new Error(
                        "readApiSafelyOr40X - data is not valid"
                    )
                }
            case 403:
                yield put(
                    Actions.Creators.warningException(
                        "Permission denied reading data."
                    )
                )
                return [
                    "Permission denied reading data.",
                    response.data,
                    response.status,
                ]
            default:
                console.error("readApiSafely - status code is not 200")
                //yield put(Actions.Creators.internalServerError("Unexpected error"));
                yield put(
                    routerActions.navigateTo(ROUTE_ERROR, {
                        eType: "CLIENT ERROR",
                        eMessage:
                                "Unexpected Error: invalid status code: " +
                                response.status.toString(),
                    })
                )
                throw new Error("readApiSafely - status code is not 200")
            }
        } else {
            yield put(
                Actions.Creators.internalServerError("Server is not responding")
            )
            throw new Error("Server is not responding")
        }
    } catch (ex) {
        console.error(ex)
        switch (ex.constructor) {
        case ServerErrorException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "500",
                    eMessage: ex.message,
                })
            )
            throw ex
        case NotFoundException:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "404",
                    eMessage: ex.message,
                })
            )
            throw ex
        default:
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "500",
                    eMessage: ex.message,
                })
            )
            throw ex
        }
    }
}

// handlers for tus adapter
export function onTermTUSHandler(err) {
    throw new TUSErrorException("Termination Error", err.message, "hard")
}

export function tusErrorHandler(errorChannel) {
    return err => {
        console.error("TUS error:", err)
        errorChannel.put({
            name: "General Error",
            message: err.message,
            status:
                err.originalResponse &&
                err.originalResponse._xhr &&
                err.originalResponse._xhr.status
                    ? err.originalResponse._xhr.status
                    : 503,
            type: "hard",
        })
    }
}

export function tusShouldRetryErrorHandler(errorChannel) {
    return (err, retryAttempt) => {
        if (retryAttempt < TUSRetryDelays.length - 1) {
            console.warn("TUS error:", retryAttempt, err)
            errorChannel.put({
                name: "Upload error",
                message:
                    err.originalResponse &&
                    err.originalResponse._xhr &&
                    err.originalResponse._xhr.message
                        ? err.originalResponse._xhr.message
                        : "",
                status:
                    err.originalResponse &&
                    err.originalResponse._xhr &&
                    err.originalResponse._xhr.status
                        ? err.originalResponse._xhr.status
                        : 503,
                retryIn: TUSRetryDelays[retryAttempt + 1],
                type: "soft",
            })
            return true
        }
        return false
    }
}
// END handlers for tus adapter

// eslint-disable-next-line require-yield
function* onServerError({ message, timeout }) {
    ToastsStore.error(message, timeout ? timeout : 6000)
}
// eslint-disable-next-line require-yield
function* onWarningException({ message, timeout }) {
    ToastsStore.warning(message, timeout ? timeout : 6000)
}
// eslint-disable-next-line require-yield
function* onSuccess({ message, timeout }) {
    ToastsStore.success(message, timeout ? timeout : 6000)
}

function* onForbidden({ message, timeout }) {
    yield ToastsStore.warning("Forbidden: " + message, timeout ? timeout : 6000)
}

function* onUnauthorized({ message, timeout }) {
    yield ToastsStore.warning(
        "Unauthorized: " + message,
        timeout ? timeout : 6000
    )
}

function* onTokenExpired({ message, timeout }) {
    yield ToastsStore.warning(
        `Token no longer valid: ${message}\nRedirecting back to the login screen.`,
        timeout ? timeout : 10000
    )
    yield call(logout)
}

export function* apiSaga() {
    yield all([
        takeEvery(Actions.Types.INTERNAL_SERVER_ERROR, onServerError),
        takeEvery(Actions.Types.WARNING_EXCEPTION, onWarningException),
        takeEvery(Actions.Types.SUCCESS, onSuccess),
        takeEvery(Actions.Types.FORBIDDEN, onForbidden),
        takeEvery(Actions.Types.UNAUTHORIZED, onUnauthorized),
        takeEvery(Actions.Types.TOKEN_EXPIRED, onTokenExpired),
    ])
}
