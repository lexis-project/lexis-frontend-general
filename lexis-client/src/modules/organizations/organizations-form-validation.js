import { parseIncompletePhoneNumber } from "libphonenumber-js"

const notEmptyStringValidator = value => value && value.trim() !== ""

const REQUIRED_FIELDS = [
    "FormalName",
    "RegisteredAddress1",
    "RegisteredCountry",
    "Website",
    "OrganizationEmailAddress",
    "PrimaryTelephoneNumber",
]

const FIELD_NAMES = {
    FormalName: "Organization Name",
    RegisteredAddress1: "Address",
    RegisteredCountry: "Country",
    Website: "Website",
    OrganizationEmailAddress: "Organization's e-mail address",
    PrimaryTelephoneNumber: "Telephone number",
}

export const validate = values => {
    const errors = REQUIRED_FIELDS.reduce((memo, key) => {
        if (!notEmptyStringValidator(values[key])) {
            memo[key] = `${FIELD_NAMES[key]} is required`
        }

        return memo
    }, {})

    let phoneNr = parseIncompletePhoneNumber(
        "" + values["PrimaryTelephoneNumber"]
    )

    if (!/^(\+?)[0-9]{8,15}$/.test(phoneNr)) {
        errors["PrimaryTelephoneNumber"] = "Invalid telephone number"
    }

    return errors
}
