const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = []

const FIELD_NAMES = {}

export const validateGridmapRemove = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    return errors
}
