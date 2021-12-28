export class NotFoundException extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFoundError"
        this.message = message
    }
}
