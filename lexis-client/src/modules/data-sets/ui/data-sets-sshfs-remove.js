import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import { getRouteParams } from "../../routing/routing-selectors"
import { getSsh } from "../data-sets-selectors"

import Actions from "../data-sets-actions"
import { SshRemoveForm } from "./ssh-remove-form"


export const DataSetsSshRemoveImpl = ({
    submitRemove,
    gotoRoute,
    params,
    exports,
}) => (
    <>
        <Fragment>
            <h1>SSHFS export of datasets staged to the LRZ cloud</h1>
            <h2>Remove export</h2>
            <SshRemoveForm
                key={params.remove}
                form="ssh-remove"
                onFormSubmit={submitRemove}
                initialValues={params.remove}
            />
            {exports !== undefined && (
                <>
                    {" "}
                    <p>
                        Latest export: {exports.sshfs}, path: {exports.path}
                    </p>{" "}
                    <button
                        type="button"
                        className="btn btn-link"
                        variant="link"
                        onClick={() =>
                            submitRemove({
                                user: exports.user,
                                path: exports.path,
                            })
                        }>
                        {" "}
                        Click to remove export
                    </button>{" "}
                </>
            )}
        </Fragment>
    </>
)

const mapStateToProps = state => ({
    params: getRouteParams(state),
    exports: getSsh(state),
})

const mapDispatchToProps = {
    submitRemove: Actions.Creators.requestSshRemove,
    gotoRoute: actions.navigateTo,
}

export const DataSetsSshRemove = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsSshRemoveImpl)
