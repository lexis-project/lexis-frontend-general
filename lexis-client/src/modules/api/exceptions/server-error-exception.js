export class ServerErrorException extends Error {
    constructor(message) {
        super(message)
        this.name = "ServerError"
        this.message = message
    }
}
