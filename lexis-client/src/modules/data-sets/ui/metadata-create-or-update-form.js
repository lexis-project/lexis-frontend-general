import React from "react"
import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { ReduxFormJSONInputField } from "../../forms/json-input-field"
import { ReduxFormSelectField } from "../../forms/select-field"
import { ReduxFormSelectProjectField } from "../../forms/select-project-field"
import { ReduxFormArrayInputField } from "../../forms/array-input-field"
import { ReduxFormArrayPairInputField } from "../../forms/array-pair-input-field"
import { ReduxFormArrayJSONInputField } from "../../forms/array-json-input-field"

import { validateForUpload } from "../metadata-query-form-validation"

const goBack = () => window.history.back()

//https://stackoverflow.com/questions/36067562/react-input-type-not-editable

const MetadataCreateOrUpdateFormImpl = ({
    initialValues,
    projects,
    handleSubmit,
    onFormSubmit,
    wizardUpload,
}) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "metadata-update-form": true,
                        })}>
                        {initialValues === undefined && (
                            <>
                                <ReduxFormSelectProjectField
                                    type="text"
                                    name="project"
                                    label="Project"
                                    cy="datasets-metadata-form-project"
                                    values={projects}
                                />
                                <ReduxFormSelectField
                                    label="Access"
                                    values={["user", "project", "public"]}
                                    required={false}
                                    cy="datasets-metadata-form-access"
                                    name="access"
                                />
                            </>
                        )}
                        <ReduxFormArrayInputField
                            type="text"
                            name="creator"
                            label="Creator"
                            cy="datasets-metadata-form-creator"
                            placeholder="Please enter Creator"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.creator
                            }
                        />
                        <ReduxFormInputField
                            type="text"
                            name="title"
                            label="Title"
                            cy="datasets-metadata-form-title"
                            placeholder="Please enter Title"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.title
                            }
                        />
                        <ReduxFormArrayInputField
                            type="text"
                            name="publisher"
                            label="Publisher"
                            cy="datasets-metadata-form-publisher"
                            placeholder="Please enter Publisher"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.publisher
                            }
                        />
                        <ReduxFormInputField
                            type="text"
                            name="publicationYear"
                            label="Publication Year"
                            cy="datasets-metadata-form-publicationYear"
                            placeholder="Please enter Publication Year"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.publicationYear
                            }
                        />
                        <ReduxFormSelectField
                            label={
                                <a
                                    href="https://schema.datacite.org/meta/kernel-4.1/include/datacite-resourceType-v4.1.xsd"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Resource Type (General)
                                </a>
                            }
                            values={[
                                "Audiovisual",
                                "Collection",
                                "DataPaper",
                                "Dataset",
                                "Event",
                                "Image",
                                "InteractiveResource",
                                "Model",
                                "PhysicalObject",
                                "Service",
                                "Software",
                                "Sound",
                                "Text",
                                "Workflow",
                                "Other",
                            ]}
                            required={false}
                            name="resourceTypeGeneral"
                            cy="datasets-metadata-form-resourceTypeGeneral"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.resourceTypeGeneral
                            }
                        />
                        <ReduxFormInputField
                            type="text"
                            name="resourceType"
                            label="Resource Type"
                            cy="datasets-metadata-form-resourceType"
                            placeholder="Please enter Resource Type"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.resourceType
                            }
                        />
                        <ReduxFormArrayInputField
                            type="text"
                            name="owner"
                            label="Owner"
                            cy="datasets-metadata-form-owner"
                            placeholder="Please enter Owner (and optionally email)"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.owner
                            }
                        />
                        <ReduxFormArrayInputField
                            type="text"
                            name="contributor"
                            label="Contributor"
                            cy="datasets-metadata-form-contributor"
                            placeholder="Please enter Contributor (and optionally email)"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.contributor
                            }
                        />
                        <ReduxFormArrayInputField
                            type="text"
                            name="rightsURI"
                            label="Rights URI"
                            placeholder="Please enter License URI"
                            initialValue={
                                initialValues === undefined
                                    ? undefined
                                    : initialValues.rightsURI
                            }
                        />
                        {/* hides a few of elements to not the form be too large */}
                        <div className="invisible" style={{ height: "1px" }}>
                            <ReduxFormArrayInputField
                                type="text"
                                name="relatedIdentifier"
                                label="Related Identifier"
                                cy="datasets-metadata-form-relatedIdentifier"
                                placeholder="Please enter Related Identifier"
                                initialValue={
                                    initialValues === undefined
                                        ? undefined
                                        : initialValues.relatedIdentifier
                                }
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="rights"
                                label="Rights"
                                placeholder="Please enter License"
                                initialValue={
                                    initialValues === undefined
                                        ? undefined
                                        : initialValues.rights
                                }
                            />
                            <ReduxFormArrayInputField
                                type="text"
                                name="rightsIdentifier"
                                label="Rights Identifiers"
                                placeholder="Please enter License Identifiers"
                                initialValue={
                                    initialValues === undefined
                                        ? {}
                                        : {
                                            initialValue:
                                                  initialValues.rightsIdentifier,
                                        }
                                }
                            />
                            <ReduxFormArrayPairInputField
                                type="text"
                                name="AlternateIdentifier"
                                label="Alternate Identifier"
                                placeholder={[
                                    "Please enter type",
                                    "Please enter identifier",
                                ]}
                                initialValue={
                                    initialValues === undefined
                                        ? {}
                                        : initialValues.AlternateIdentifier
                                }
                            />
                            <ReduxFormJSONInputField
                                type="textarea"
                                name="CustomMetadata"
                                label="Custom Metadata"
                                cy="datasets-metadata-form-custom-metadata"
                                placeholder="Please enter Custom Metadata (JSON)"
                                initialValue={
                                    initialValues === undefined
                                        ? undefined
                                        : JSON.stringify(
                                            initialValues.CustomMetadata
                                        )
                                }
                            />
                            <ReduxFormArrayJSONInputField
                                type="textarea"
                                name="CustomMetadataSchema"
                                label="Custom Metadata Schema"
                                placeholder="Please enter Custom Metadata Schema (JSON)"
                                initialValue={
                                    initialValues === undefined ||
                                    initialValues.CustomMetadataSchema ===
                                        undefined
                                        ? undefined
                                        : initialValues.CustomMetadataSchema.map(
                                            e => JSON.stringify(e)
                                        )
                                }
                            />
                            {/* hides a few of elements to not the form be too large */}
                        </div>
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit"
                            cy="datasets-metadata-form-btn-submit">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            {initialValues ? "Save" : "Create"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-info btn-simple text-nowrap ml-1"
                            onClick={goBack}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-remove"></i>
                            </span>{" "}
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
)

export const MetadataCreateOrUpdateForm = reduxForm({
    form: "MetadataCreateOrUpdateForm",
    validate: validateForUpload,
})(MetadataCreateOrUpdateFormImpl)

export const MetadataCreateForm = reduxForm({
    form: "MetadataCreateForm",
    validate: validateForUpload,
})(MetadataCreateOrUpdateFormImpl)

export const MetadataUpdateForm = reduxForm({
    form: "MetadataUpdateForm",
    validate: validateForUpload,
})(MetadataCreateOrUpdateFormImpl)
