import React from "react"
import cx from "classnames"
import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateWFTUploadFragment } from "./validate"

const FragmentUploadImpl = ({
    handleSubmit,
    onFormSubmit,
    uploadInProgress,
}) => {
    return (
        <form
            onSubmit={handleSubmit(onFormSubmit)}
            className={cx({
                "workflow-template-upload": true,
            })}>
            <div className="card">
                <div className="card-header">
                    Upload a new Workflow Template{" "}
                </div>{" "}
                <div className="card-body">
                    <div className="row justify-content-between">
                        <div className="col">
                            <ReduxFormInputField
                                type="file"
                                label="Browse local files"
                                required={true}
                                name="workflowTemplate.file"
                                cy="workflowtemplates-fragment-upload-file"
                            />
                        </div>{" "}
                        <button
                            style={{ marginRight: "20px" }}
                            type="submit"
                            className="btn btn-simple text-nowrap"
                            disabled={uploadInProgress}>
                            {" "}
                            {uploadInProgress ? "Uploading..." : "Upload"}{" "}
                        </button>{" "}
                    </div>{" "}
                </div>{" "}
            </div>{" "}
        </form>
    )
}

export default reduxForm({
    form: "workflow-template-upload", // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: false, // <------ unregister fields on unmount
    validate: validateWFTUploadFragment,
})(FragmentUploadImpl)
