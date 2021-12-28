import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import { getRouteParams } from "../../routing/routing-selectors"
import { getSsh } from "../data-sets-selectors"

import Actions from "../data-sets-actions"
import { SshAddForm } from "./ssh-add-form"


export const DataSetsSshAddImpl = ({
    submitAdd,
    submitRemove,
    gotoRoute,
    params,
    exports,
}) => (
    <>
        <Fragment>
            <h1>SSHFS export of datasets staged to the LRZ cloud</h1>
            <h2>Add export</h2>
            <p>Generate a keypair with ssh-keygen if needed</p>
            <SshAddForm
                key={params.add}
                form="ssh-add"
                onFormSubmit={submitAdd}
                initialValues={params.add}
            />
            {exports !== undefined && (
                <>
                    <p>
                        Latest export: {exports.sshfs}, path: {exports.path}
                    </p>
                    <button
                        type="button"
                        className="btn btn-link"
                        variant="link"
                        cy="datasets-ssh-latext-export-remove"
                        onClick={() =>
                            submitRemove({
                                user: exports.user,
                                path: exports.path,
                            })
                        }>
                        Click to remove export
                    </button>
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
    submitAdd: Actions.Creators.requestSshAdd,
    submitRemove: Actions.Creators.requestSshRemove,
    gotoRoute: actions.navigateTo,
}

export const DataSetsSshAdd = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsSshAddImpl)
