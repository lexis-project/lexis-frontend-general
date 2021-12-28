import { TokenException } from "./exceptions/getting-token-exception"

export function getTokenLC() {
    try {
        const token = localStorage.getItem("lexisToken")
        return JSON.parse(token)
    } catch (ex) {
        ex.message = "getTokenLC() error."
        console.error(ex.message)

        throw new TokenException(ex.message)
    }
}

export function getAuthorization() {
    return `Bearer ` + getTokenLC()
}

export function getUserIdLC() {
    try {
        const userId = localStorage.getItem("UserId")
        return JSON.parse(userId)
    } catch (error) {
        return ""
    }
}

export function eraseLC() {
    try {
        // window.localStorage.clear()
        window.localStorage.removeItem("lexisToken")
        window.localStorage.removeItem("UserId")
    } catch (ex) {
        ex.message = "eraseLC() error."
        console.error(ex.message)

        throw new TokenException(ex.message)
    }
}
