const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["size", "target_system", "source_path", "target_path"]

const FIELD_NAMES = {
    size: "Size",
}

export const validateMulti = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    if (isNaN(values["size"])) {
        errors["size"] = "Size must be a number"
    }
    return errors
}
