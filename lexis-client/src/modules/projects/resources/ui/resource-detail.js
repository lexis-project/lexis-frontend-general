import React, { Fragment } from "react"
import { connect } from "react-redux"
//import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
//import Button from 'react-bootstrap/Button'
//import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

import { getResourceDetail } from "../resources-selectors"

const goBack = () => window.history.back()

export const ResourceDetailImpl = ({ resource }) => (
    <Fragment>
        <h1>Resource detail</h1>
        <div style={{ paddingTop: "1rem" }}>
            <div className="row">
                <div className="col-4">Resource ID:</div>
                <div className="col">{resource.HPCResourceID}</div>
            </div>
            <div className="row">
                <div className="col-4">HPC Center:</div>
                <div className="col">{resource.HPCProvider}</div>
            </div>
            <div className="row">
                <div className="col-4">Associated HPC Project:</div>
                <div className="col">{resource.AssociatedHPCProject}</div>
            </div>
            <div className="row">
                <div className="col-4">Type of the Resource:</div>
                <div className="col">{resource.ResourceType}</div>
            </div>
            <div className="row">
                <div className="col-4">Associated LEXIS Project ID:</div>
                <div className="col">{resource.AssociatedLEXISProject}</div>
            </div>
        </div>

        <div className="row" style={{ paddingTop: "1rem" }}>
            <div className="col">
                <div
                    className="btn-toolbar"
                    role="toolbar"
                    aria-label="Toolbar with button groups">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        variant="outline-primary"
                        onClick={goBack}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    </Fragment>
)

const mapStateToProps = state => ({
    resource: getResourceDetail(state),
})

export const ResourceDetail = connect(mapStateToProps, null)(ResourceDetailImpl)
