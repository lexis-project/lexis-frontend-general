import { createActions } from "reduxsauce"

export default createActions(
    {
        internalServerError: ["message", "timeout"],
        warningException: ["message", "timeout"],
        success: ["message", "timeout"],
        forbidden: ["message", "timeout"],
        unauthorized: ["message", "timeout"],
        tokenExpired: ["message", "timeout"],
    },
    {
        prefix: "API_",
    }
)
