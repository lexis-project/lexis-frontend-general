const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = ["FirstName", "LastName", "EmailAddress", "Username"]

const FIELD_NAMES = {
    FirstName: "First Name",
    LastName: "Last Name",
    EmailAddress: "E-mail",
    Username: "Username",
}

export const validate = values => {
    const errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})
    if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.EmailAddress)
    ) {
        errors.EmailAddress = "Invalid email address"
    }

    if (
        !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$$/i.test(values.EmailAddress)
    ) {
        errors.EmailAddress = 'We strongly do not recommend using any special characters (like "?", "_", etc). Even a numbers in domain name (after @) are discouraged.'
    }

    return errors
}
