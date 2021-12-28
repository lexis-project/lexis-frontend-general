import React from "react";
import { connect } from "react-redux";

import { isInvalid, reduxForm } from "redux-form";
import config from "../../../../config"
import { getProjects } from "../../../projects/projects-selectors";
import { ReduxFormInputField } from "../../../forms/input-field";
import { ReduxFormSelectField } from "../../../forms/select-field";
import { ReduxFormSelectProjectField } from "../../../forms/select-project-field";
import { getUserFinePerms } from "../../../auth/auth-selectors";
import { isFirstPageInvalid, validateDSCreateForm } from "./validate";
import { checkFineWritePerms } from "../../../auth/auth-check-fine-perms";
import { getDSCreateWizardFormValues } from "../../data-sets-selectors";

// import validate from "./validate";

const DsBasicInfoForm = ({
    handleSubmit,
    projects,
    isDsToUploadFormInvalid,
    invalid,
    perms,
    formDsBasicInfo
}) => {
    const permitedProjects = projects.filter((proj) => checkFineWritePerms(proj.ProjectID,'dat', perms))
    const invalidValues = isFirstPageInvalid(!isDsToUploadFormInvalid, !invalid, formDsBasicInfo, perms)
    return (
        <div className="row">
            <div className="col-9">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <ReduxFormInputField
                                type="text"
                                name="metadata.title"
                                label="Title"
                                placeholder="Please enter the title..."
                                cy="datasets-basic-form-title"
                            />
                            <ReduxFormSelectProjectField
                                label="Project"
                                name="project"
                                values={permitedProjects}
                                info="Dataset will be linked to selected project"
                                cy="datasets-basic-form-project"
                            />
                            <ReduxFormSelectField
                                disabled={!(formDsBasicInfo && formDsBasicInfo.project)}
                                label="Access"
                                displayNames={(formDsBasicInfo && formDsBasicInfo.project)
                                    && checkFineWritePerms(formDsBasicInfo.project, 'dat_pub_short', perms) ?
                                    ["User limited access", "Project limited access", "Public access"]
                                    : ["User limited access", "Project limited access"]}
                                values={(formDsBasicInfo && formDsBasicInfo.project)
                                    && checkFineWritePerms(formDsBasicInfo.project, 'dat_pub_short', perms) ?
                                    ["user", "project", "public"]
                                    : ["user", "project"]}
                                name="access"
                                info="User limited access: Dataset will be avaliable only for you. Project limited access:
                                Access will be limited to users of project.
                                Public access: Access will not be limited, everyone could view the dataset. In this case rights URI is required."
                                cy="datasets-basic-form-access"
                            />
                            <ReduxFormSelectField
                                label="Zone"
                                values={config.avaliableDSZones ? config.avaliableDSZones : []}
                                name="zone"
                                info="The data center zone, where the dataset will be uploaded."
                                cy="datasets-basic-form-zone"
                            />
                            <div className="row">
                                <div className="col-8"></div>
                                <div className="col-4 mt-3">
                                    <button
                                        className="btn btn-success btn-simple text-nowrap mr-1"
                                        disabled={invalidValues}
                                        cy="datasets-basic-form-nextwizard"
                                    >
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-minimal-right"></i>
                                        </span>{" "}
                                        Next
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

const mapStateToProps = (state) => ({
    projects: getProjects(state),
    isDsToUploadFormInvalid: isInvalid('datasetToUpload')(state),
    perms: getUserFinePerms(state),
    formDsBasicInfo: getDSCreateWizardFormValues(state)
})

export default connect(mapStateToProps)(reduxForm({
    form: "wizardDatasetCreate", // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: false, // <------ unregister fields on unmount
    updateUnregisteredFields: true,
    validate: validateDSCreateForm
})(DsBasicInfoForm))