import React, { Fragment } from "react"
import { connect } from "react-redux"

export const OrganizationImpl = () => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Organization</h1>
            </div>
        </div>
    </Fragment>
)

export const Organization = connect()(OrganizationImpl)
