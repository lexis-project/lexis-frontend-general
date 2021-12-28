const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["host", "pubkey", "path"]

const FIELD_NAMES = {
    host: "Host",
    pubkey: "SSH public key",
    path: "Path",
}

export const validateSshAdd = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    return errors
}
