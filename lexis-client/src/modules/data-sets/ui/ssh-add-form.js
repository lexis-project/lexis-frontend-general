import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateSshAdd } from "../ssh-add-form-validation"
const goBack = () => window.history.back()

const SshAddFormImpl = ({ handleSubmit, onFormSubmit, initialValues }) => (
    <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cx({
            "ssh-add-form": true,
        })}>
        <ReduxFormInputField
            type="text"
            name="host"
            label="Host"
            cy="datasets-ssh-add-form-host"
            placeholder="Please enter hostname or IP"
            initialValue={initialValues !== undefined && initialValues.host}
        />
        <ReduxFormInputField
            type="text"
            name="pubkey"
            label="SSH Public Key"
            cy="datasets-ssh-add-form-pubkey"
            placeholder="Please enter an SSH public key"
            initialValue={initialValues !== undefined && initialValues.pubkey}
        />
        <ReduxFormInputField
            type="text"
            name="path"
            label="Path on cloud staging zone"
            cy="datasets-ssh-add-form-path"
            placeholder="Please enter path"
            initialValue={initialValues !== undefined && initialValues.path}
        />
        <button
            className="btn btn-primary"
            variant="primary"
            type="submit"
            cy="datasets-ssh-add-form-btn-submit">
            Save
        </button>
        <button
            type="button"
            className="btn btn-link"
            variant="link"
            onClick={goBack}>
            Cancel
        </button>
    </form>
)

export const SshAddForm = reduxForm({ validate: validateSshAdd })(
    SshAddFormImpl
)
