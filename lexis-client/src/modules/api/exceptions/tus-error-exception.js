export class TUSErrorException extends Error {
    constructor(errorName, message, status) {
        super(message)
        this.name = errorName
        this.message = message
        this.status = status
    }
}