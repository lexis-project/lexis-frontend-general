import axios from "axios"
import { compose } from "redux"
import config from "../../config"

import { ServerErrorException } from "../api/exceptions/server-error-exception"
import { NotFoundException } from "../api/exceptions/not-found-exception"

const authClient = axios.create({
    baseURL: `${config.url.auth}/auth`,
})

const extractResponse = fn => async (...args) => {
    const result = await fn(...args)
    if (result !== undefined) {
        return result.data
    } else {
        throw new ServerErrorException(
            "AUTH: Unexpected response of the server."
        )
    }
}

const safeResponse = fn => async (...args) => {
    try {
        const response = await fn(...args)
        return response
    } catch (ex) {
        if (ex.response && ex.response.status) {
            switch (ex.response.status) {
            case 500:
                console.warn(ex.response)
                throw new ServerErrorException(
                    "API: Internal server error."
                )
            case 404:
                console.warn(ex.response)
                throw new NotFoundException(
                    "Authclient: API: Requesting not existing data. Error: " +
                            ex +
                            "args: " +
                            args
                )
            default:
                console.warn(ex.response)
                throw new ServerErrorException("API: Unspecified error.")
            }
        }
    }
}

export const getSessionInfo = compose(
    extractResponse,
    safeResponse
)(() => authClient.get(`/session-info`))

export const authLogout = compose(
    extractResponse,
    safeResponse
)(() => authClient.post(`/logout`))
