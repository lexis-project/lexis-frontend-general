const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = []

const FIELD_NAMES = {}

const REQ_ForUpload = ["project", "access"]
const FN_ForUpload = { project: "Project", access: "Access" }

export const validateForQuery = values => {
    var errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    try {
        if (notEmptyStringValidator(values["CustomMetadata"]))
            JSON.parse(values["CustomMetadata"])
    } catch (e) {
        errors["CustomMetadata"] = "Custom Metadata is not JSON"
    }
    if (values["CustomMetadataSchema"])
        try {
            if (notEmptyStringValidator(values["CustomMetadata"]))
                JSON.parse(values["CustomMetadataSchema"])
        } catch (e) {
            errors["CustomMetadataSchema"] = "Custom MetadataSchema is not JSON"
        }
    return errors
}

//Upload or Update
export const validateForUpload = values => {
    // check that user belongs to project
    var errors = REQ_ForUpload.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FN_ForUpload[key]} is required`
        }
        return memo
    }, {})
    if (
        values["publicationYear"] !== undefined &&
        values["publicationYear"] !== "" &&
        !/^\+?(0|[1-9]\d*)$/.test(values["publicationYear"])
    )
        errors["publicationYear"] = "Year not valid"
    //json is being transformed into objects randomly at submit.
    try {
        if (
            typeof values["CustomMetadata"] == "string" &&
            notEmptyStringValidator(values["CustomMetadata"])
        )
            JSON.parse(values["CustomMetadata"])
    } catch (e) {
        errors["CustomMetadata"] = "Custom Metadata is not JSON"
    }
    if (values["CustomMetadataSchema"]) {
        errors["CustomMetadataSchema"] = []
        for (var i = 0; i < values["CustomMetadataSchema"].length; i++) {
            try {
                if (
                    values["CustomMetadataSchema"][i] !== undefined &&
                    typeof values["CustomMetadataSchema"][i] == "string"
                )
                    JSON.parse(values["CustomMetadataSchema"][i])
            } catch (e) {
                errors["CustomMetadataSchema"][i] = `Custom MetadataSchema ${
                    i + 1
                } is not JSON`
            }
        }
    }
    return errors
}
