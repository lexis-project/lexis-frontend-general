const notEmptyStringValidator = value =>
    value && JSON.stringify(value).trim() !== ""

const REQUIRED_FIELDS = [
    "PrimaryInvestigator",
    "HPCProvider",
    "CoreHoursExpected",
    "Budget",
    "DateStart",
    "DateEnd",
]

const FIELD_NAMES = {
    PrimaryInvestigator: `Email of Primary Investigator`,
    HPCProvider: `HPC Center`,
    CoreHoursExpected: `Expected norm. core hours`,
    Budget: `Budget`,
    DateStart: `Date from`,
    DateEnd: `Date until`,
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
