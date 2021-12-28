import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import SearchSelectField from '../../forms/search-select-field'
import projectsActions from '../projects-actions'
import { getProjectAssignAvalUsers } from '../projects-selectors'

const formatUsers = (u) => ({
    value: u.ID,
    label:`${u.FirstName} ${u.LastName} (${u.EmailAddress})`
})

const ProjUsrAddImpl = ({avaliableUsers, submitting, invalid,
    pristine, handleSubmit, assignUser}) => {
    return (
        <form onSubmit={handleSubmit(assignUser)}>
            <div className="row">
                <div className="col">
                    <h3>Add user to project:</h3>
                </div>
                <div className="col">
                    <SearchSelectField
                        name="add-user"
                        cy="project-add-user-field"
                        options={avaliableUsers.map(formatUsers)}
                        loading={false}
                        required={true}
                        hideSelectedOptions={true}
                    />
                </div>
                <div className="col">
                    <button
                        type="submit"
                        disabled={submitting || pristine || invalid}
                        className="btn btn-success btn-simple text-nowrap mr-1"
                        cy="assign-user"
                    >
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
            Assign User
                    </button>
                </div>
            </div>
        </form>
    )}

const mapStateToProps = (state) => ({
    avaliableUsers: getProjectAssignAvalUsers(state)
})

const mapDispatchToProps = ({
    assignUser: projectsActions.Creators.assignUser
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(
    reduxForm({
        form: 'proj-user-add',
        validate: (values) =>  (values && values['add-user'] ? null
            : 'selection of user is required'),
        enableReinitialize: true,
    })(ProjUsrAddImpl)
)