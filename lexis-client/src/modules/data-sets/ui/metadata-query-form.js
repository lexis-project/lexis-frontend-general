import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { ReduxFormSelectField } from "../../forms/select-field"
import { validateForQuery } from "../metadata-query-form-validation"

const goBack = () => window.history.back()

const MetadataQueryFormImpl = ({ handleSubmit, onFormSubmit }) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "metadata-form": true,
                        })}>
                        <ReduxFormSelectField
                            label="Access"
                            values={["user", "project", "public"]}
                            required={false}
                            name="access"
                            cy="datasets-metadata-query-form-access"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="project"
                            label="Project"
                            cy="datasets-metadata-query-form-project"
                            placeholder="Please enter project"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="internalID"
                            label="Lexis DDI Identifier"
                            cy="datasets-metadata-query-form-internalID"
                            placeholder="Please enter identifier"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="AlternateIdentifier"
                            cy="datasets-metadata-query-form-alternate-identifier"
                            label="Alternate Identifier"
                            placeholder="Please enter identifier"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="AlternateIdentifierType"
                            cy="datasets-metadata-query-form-alternate-identifier-type"
                            label="Alternate Identifier Type"
                            placeholder="Please enter identifier type"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Creator"
                            label="Creator"
                            cy="datasets-metadata-query-form-creator"
                            placeholder="Please enter Creator"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Title"
                            label="Title"
                            cy="datasets-metadata-query-form-title"
                            placeholder="Please enter Title"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Publisher"
                            label="Publisher"
                            cy="datasets-metadata-query-form-publisher"
                            placeholder="Please enter Publisher"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="PublicationYear"
                            label="Publication Year"
                            cy="datasets-metadata-query-form-publication-year"
                            placeholder="Please enter Publication Year"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="ResourceTypeGeneral"
                            label="Resource Type (General)"
                            cy="datasets-metadata-query-form-resource-type-general"
                            placeholder="Please enter Resource Type (General)"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="ResourceType"
                            label="Resource Type"
                            cy="datasets-metadata-query-form-resource-type"
                            placeholder="Please enter Resource Type"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Description"
                            label="Description"
                            cy="datasets-metadata-query-form-description"
                            placeholder="Please enter Description"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Owner"
                            label="Owner"
                            cy="datasets-metadata-query-form-owner"
                            placeholder="Please enter Owner"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Contributor"
                            label="Contributor"
                            cy="datasets-metadata-query-form-contributor"
                            placeholder="Please enter Contributor"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="RelatedIdentifier"
                            label="RelatedIdentifier"
                            cy="datasets-metadata-query-form-related-identifier"
                            placeholder="Please enter Related Identifier"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="Rights"
                            label="Rights"
                            cy="datasets-metadata-query-form-rights"
                            placeholder="Please enter License"
                        />

                        <ReduxFormInputField
                            type="text"
                            name="CustomMetadata"
                            label="Custom Metadata"
                            cy="datasets-metadata-query-form-custom-metadata"
                            placeholder="Please enter Custom Metadata Query (JSON)"
                        />

                        <ReduxFormInputField
                            type="text"
                            name="PID"
                            label="EUDAT PID"
                            cy="datasets-metadata-query-form-pid"
                            placeholder="Please enter EUDAT PID"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="EUDAT/FIO"
                            label="EUDAT FIO"
                            cy="datasets-metadata-query-form-eudat-fio"
                            placeholder="Please enter EUDAT FIO"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="EUDAT/PARENT"
                            label="EUDAT PARENT"
                            cy="datasets-metadata-query-form-eudat-parent"
                            placeholder="Please enter EUDAT Parent"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="EUDAT/ROR"
                            label="EUDAT ROR"
                            cy="datasets-metadata-query-form-eudat-ror"
                            placeholder="Please enter EUDAT ROR"
                        />
                        <ReduxFormInputField
                            type="text"
                            name="EUDAT/REPLICA"
                            label="EUDAT REPLICA"
                            cy="datasets-metadata-query-form-eudat-replica"
                            placeholder="Please enter EUDAT REPLICA"
                        />
                        <ReduxFormSelectField
                            type="text"
                            values={["True", "False"]}
                            required={false}
                            name="EUDAT/FIXED_CONTENT"
                            label="EUDAT FIXED CONTENT"
                            cy="datasets-metadata-query-form-eudat-fixed-content"
                            placeholder="Please enter EUDAT Fixed Content"
                        />
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit"
                            cy="datasets-metadata-query-form-btn-submit">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            Search
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

export const MetadataQueryForm = reduxForm({ validate: validateForQuery })(
    MetadataQueryFormImpl
)
