export class TokenExpired extends Error {
    constructor() {
        const erName = "TokenExpired"
        super(erName)
        this.name = erName
    }
}
