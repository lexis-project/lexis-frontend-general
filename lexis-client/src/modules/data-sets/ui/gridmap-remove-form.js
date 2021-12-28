import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateGridmapRemove } from "../gridmap-remove-form-validation"

const goBack = () => window.history.back()

const GridmapRemoveFormImpl = ({ handleSubmit, onFormSubmit }) => (
    <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cx({
            "gridmap-removeform": true,
        })}>
        <ReduxFormInputField
            type="text"
            name="user"
            label="Username"
            cy="datasets-gridmap-remove-form-user"
            placeholder="Please enter user"
        />
        <button
            className="btn btn-primary"
            variant="primary"
            type="submit"
            cy="datasets-gridmap-remove-form-btn-submit">
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

export const GridmapRemoveForm = reduxForm({ validate: validateGridmapRemove })(
    GridmapRemoveFormImpl
)
