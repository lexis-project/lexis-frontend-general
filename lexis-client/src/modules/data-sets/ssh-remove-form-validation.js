const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["user", "path"]

const FIELD_NAMES = {
    user: "Username",
    path: "Path",
}

export const validateSshRemove = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    return errors
}
