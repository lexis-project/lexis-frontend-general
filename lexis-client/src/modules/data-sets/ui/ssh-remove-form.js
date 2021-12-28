import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateSshRemove } from "../ssh-remove-form-validation"

const goBack = () => window.history.back()

const SshRemoveFormImpl = ({ handleSubmit, onFormSubmit, initialValues }) => (
    <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cx({
            "ssh-removeform": true,
        })}>
        <ReduxFormInputField
            type="text"
            name="user"
            label="Username"
            cy="datasets-ssh-remove-form-user"
            placeholder="Please enter username"
            initialValue={initialValues !== undefined && initialValues.username}
        />
        <ReduxFormInputField
            type="text"
            name="path"
            label="Path"
            cy="datasets-ssh-remove-form-path"
            placeholder="Please enter path"
            initialValue={initialValues !== undefined && initialValues.path}
        />
        <button
            className="btn btn-primary"
            variant="primary"
            type="submit"
            cy="datasets-ssh-remove-form-btn-submit">
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

export const SshRemoveForm = reduxForm({ validate: validateSshRemove })(
    SshRemoveFormImpl
)
