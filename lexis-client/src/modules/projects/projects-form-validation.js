const notEmptyStringValidator = value =>
    value && JSON.stringify(value).trim() !== ""

const REQUIRED_FIELDS = [
    "ProjectName",
    "ProjectShortName",
    "ProjectDescription",
    "ProjectStartDate",
    "ProjectTerminationDate",
    "ProjectDomain",
]

const FIELD_NAMES = {
    ProjectName: `Project's name`,
    ProjectShortName: `Project's shortname`,
    ProjectDescription: `Project's description`,
    ProjectStartDate: `Project's start date`,
    ProjectTerminationDate: `Project's end date`,
    ProjectDomain: `Project's domain`,
}

export const validate = values => {
    const errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})

    if (!/^[a-z_-][A-Z][a-z0-9_-]*$/i.test(values["ProjectShortName"])) {
        errors["ProjectShortName"] =
            "Invalid project short name (use only [a-z_-][A-Z][a-z0-9_-]*)"
    }

    if (values && values["ProjectTerminationDate"] === undefined && values["ProjectStartDate"] !== undefined)
        errors["ProjectTerminationDate"] = "Please also select project termination date!"
    else if (values && values["ProjectTerminationDate"] !== undefined 
        && values["ProjectStartDate"] !== undefined 
        && new Date(values["ProjectTerminationDate"]).valueOf() < new Date(values["ProjectStartDate"]).valueOf())
        errors["ProjectTerminationDate"] = "Termination date is before the start date!"
    return errors
}
