const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["source_system", "source_path", "title"]

const FIELD_NAMES = {
    source_system: "Source system",
    target_system: "Target system",
    source_path: "Source path",
    target_path: "Target path",
    title: "Title"
}

const DREQUIRED_FIELDS = ["target_system", "target_path"]

export const validateStage = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }
        return memo
    }, {})
    
    return errors
}

export const validateStageDelete = values => {
    var errors = DREQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})

    if (values["target_path"] && values["target_path"][0] === "/")
        errors["target_path"] = "Use relative paths to base directory"

    return errors
}
