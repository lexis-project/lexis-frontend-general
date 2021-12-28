import React from "react"

import cx from "classnames"

import { reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../forms/input-field"
import { validateGridmapAdd } from "../gridmap-add-form-validation"
const goBack = () => window.history.back()

const GridmapAddFormImpl = ({ handleSubmit, onFormSubmit }) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <h2>Add DN</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <form
                                onSubmit={handleSubmit(onFormSubmit)}
                                className={cx({
                                    "gridmap-add-form": true,
                                })}>
                                <ReduxFormInputField
                                    type="text"
                                    name="dn"
                                    label="DN"
                                    cy="datasets-gridmap-add-form-dn"
                                    placeholder="Please enter DN"
                                />
                                <ReduxFormInputField
                                    type="text"
                                    name="user"
                                    label="User"
                                    cy="datasets-gridmap-add-form-user"
                                    placeholder="Please enter user"
                                />
                                <button
                                    className="btn btn-success btn-simple text-nowrap mr-1"
                                    type="submit"
                                    cy="datasets-gridmap-add-form-btn-submit">
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons icon-simple-add"></i>
                                    </span>{" "}
                                    Save
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
        </div>
    </div>
);

export const GridmapAddForm = reduxForm({ validate: validateGridmapAdd })(
    GridmapAddFormImpl
)
