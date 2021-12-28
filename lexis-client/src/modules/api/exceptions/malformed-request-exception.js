export class MalformedRequestException extends Error {
    constructor(message) {
        super(message)
        this.name = "MalformedRequest"
        this.message = message
    }
}
