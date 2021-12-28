const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["dn"]

const FIELD_NAMES = {
    dn: "Distinguished Name",
}

export const validateGridmapAdd = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    return errors
}
