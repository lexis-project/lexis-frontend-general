import React from "react";
import { reduxForm } from "redux-form";
import { ReduxFormInputField } from "../../../forms/input-field";
import { ReduxFormSelectField } from "../../../forms/select-field";
import { validateDSUploadFragment } from "./validate";
import { isSupported as TusIsSupported } from 'tus-js-client'
import { ReduxFormCheckboxField } from "../../../forms/checkbox-field"

const getUploadOptions = ()=> {
    let opt = ["directupload"]
    let readable = ["Direct Upload"]
    if (TusIsSupported) {
        opt.push('tus')
        readable.push("Chunked upload (TUS)")
    }
    return {opt, readable}
}

const FragmentUploadImpl = () => {    
    return (
        <form className="uploadFragment">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h3 className="display-4">
                                Dataset to upload
                                </h3>
                            </div>
                        </div>

                        <div className="row fieldsWrap">
                            <div className="col">
                                <ReduxFormInputField
                                    type="file"
                                    label="Browse"
                                    required={true}
                                    name="savedFile.file"
                                    cy="datasets-fragment-upload-file"
                                />
                                <ReduxFormSelectField
                                    label="Upload type"
                                    displayNames={getUploadOptions().readable}
                                    values={getUploadOptions().opt}
                                    name="savedFile.uploadType"
                                    cy="datasets-fragment-uploadtype"
                                />
                                <ReduxFormSelectField
                                    label="File type"
                                    displayNames={["Regular file", "Archive ZIP"]}
                                    values={["file", "zip"]}
                                    info="Archive ZIP: file will be uncompressed on server side. Regular file: file will be kept as it is."
                                    name="savedFile.fileType"
                                    cy="datasets-fragment-filetype"
                                />
                                <ReduxFormCheckboxField
                                    name="savedFile.comp"
                                    label="Compression"
                                    cy="datasets-fragment-comp"
                                />
                                <ReduxFormCheckboxField
                                    name="savedFile.enc"
                                    label="Encryption"
                                    cy="datasets-fragment-enc"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default reduxForm({
    form: "datasetToUpload", // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: false, // <------ unregister fields on unmount
    validate: validateDSUploadFragment
})(FragmentUploadImpl)