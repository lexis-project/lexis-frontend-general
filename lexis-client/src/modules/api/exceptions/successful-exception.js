export class SuccessfulException extends Error {
    constructor(message) {
        super(message)
        this.name = "SuccessfulException"
        this.message = message
    }
}
