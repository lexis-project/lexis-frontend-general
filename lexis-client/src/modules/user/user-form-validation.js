const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["FirstName", "LastName", "EmailAddress"]

const FIELD_NAMES = {
    FirstName: "First Name",
    LastName: "Last Name",
    EmailAddress: "Email Address",
}

export const validate = values => {
    const errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})

    return errors
}
