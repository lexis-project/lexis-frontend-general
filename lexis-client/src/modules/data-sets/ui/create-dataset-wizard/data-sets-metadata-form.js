import React from "react";
import { connect } from "react-redux";

import { reduxForm } from "redux-form";
import { getUserRole } from "../../../auth/auth-selectors";
import { ReduxFormArrayInputField } from "../../../forms/array-input-field";
import { ReduxFormInputField } from "../../../forms/input-field";
import { ReduxFormSelectField } from "../../../forms/select-field";
import { getDSCreateWizardFormValues, getDSToUploadFormValues } from "../../data-sets-selectors";
import { customValidationWrapper, validateDSCreateForm, validateDSCreateFormRightsURI } from "./validate";


const DSMetadataForm = ({handleSubmit, nextPage, formValsCreateWiz, formValsUploadFrag}) => {
    const completeValidity = customValidationWrapper(formValsUploadFrag, formValsCreateWiz)
    const rightsURIVal = formValsCreateWiz && formValsCreateWiz.metadata && formValsCreateWiz.metadata.rightsURI
    const isInValidRightsURIVal = validateDSCreateFormRightsURI(rightsURIVal, formValsCreateWiz) 

    return (
        <div className="row">
            <div className="col-9">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <ReduxFormInputField
                                type="text"
                                name="metadata.resourceType"
                                label="Resource Type"
                                cy="datasets-metadata-form-resourcetype"
                                placeholder="Please enter the resource type..."
                            />
                            <ReduxFormSelectField
                                label="Resource Type General"
                                values={["Audiovisual", "Collection", "DataPaper", "Dataset", "Event", "Image", "InteractiveResource", "Model", "PhysicalObject", "Service", "Software", "Sound", "Text", "Workflow", "Other"]}
                                cy="datasets-metadata-form-generaltype"
                                name="metadata.resourceTypeGeneral"
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="metadata.creator"
                                label="Creator"
                                cy="datasets-metadata-form-creator"
                                placeholder="Please enter a creator name"
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="metadata.contributor"
                                label="Contributor"
                                cy="datasets-metadata-form-contributor"
                                placeholder="Please enter a contributor"
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="metadata.publisher"
                                label="Publisher"
                                cy="datasets-metadata-form-publisher"
                                placeholder="Please enter a publisher"
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="metadata.owner"
                                label="Owner"
                                cy="datasets-metadata-form-owner"
                                placeholder="Please enter a owner"
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="metadata.rights"
                                label="Rights"
                                cy="datasets-metadata-form-rights"
                                placeholder="Please enter a rights"
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="metadata.rightsURI"
                                label="Rights URI"
                                cy="datasets-metadata-form-rightsuri"
                                placeholder="Please enter a rights URI"
                            />
                            {isInValidRightsURIVal && <label
                                id={`rightsURI+-error`}
                                className="error"
                            >
                                {isInValidRightsURIVal}
                            </label>}
                            <div className="row">
                                <div className="col-8"></div>
                                <div className="col-4 mt-3">
                                    <button
                                        className="btn btn-success btn-simple text-nowrap mr-1"
                                        disabled={!completeValidity}
                                        onClick={nextPage}
                                        cy="datasets-metadata-form-finalize"
                                    >
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-minimal-right"></i>
                                        </span>{" "}
                                        Finalize
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormDec = reduxForm({
    form: "wizardDatasetCreate", // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: false, // <------ unregister fields on unmount
    validate: validateDSCreateForm
})(DSMetadataForm)

const mapStateToProps = (state) => ({
    userRole: getUserRole(state),
    formValsCreateWiz: getDSCreateWizardFormValues(state),
    formValsUploadFrag: getDSToUploadFormValues(state),
})

export default connect(mapStateToProps)(FormDec)