const notEmptyStringValidator = value =>
    value && JSON.stringify(value).trim() !== ""

const REQUIRED_FIELDS = ["PrimaryInvestigator", "HPCProvider", "AssociatedHPCProject"]

const FIELD_NAMES = {
    PrimaryInvestigator: `Email of Primary Investigator`,
    HPCProvider: `HPC Center`,
    AssociatedHPCProject: `Associated HPC Project`,
}

export const validate = values => {
    const errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})

    if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
            values["PrimaryInvestigator"]
        )
    ) {
        errors["PrimaryInvestigator"] = "Invalid email address"
    }

    return errors
}
