export class TokenException extends Error {
    constructor(message) {
        super(message)
        this.name = "TokenException"
        this.message = message
    }
}
