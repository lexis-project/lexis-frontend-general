export class ForbiddenException extends Error {
    constructor(message) {
        super(message)
        this.name = "Forbidden"
        this.message = message
    }
}
