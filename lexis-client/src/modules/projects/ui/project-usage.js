import React, { Fragment } from "react"
import { connect } from "react-redux"

import { getProjectUsage } from "../projects-selectors"
import { secsToDuration } from "../resources/ui/list-hpc-resources"
const goBack = () => window.history.back()

export const ProjectUsageImplementation = ({ projectUsage }) =>
    projectUsage && projectUsage.HPCProjects ? (
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>Project: {projectUsage.ProjectName}</h1>
                    <h5>The usage and cost data is accounted since the beginning of the project until today</h5>
                </div>
            </div>

            {projectUsage.HPCProjects.map(
                ({ HPCProjectID, AccountingData }) => (
                    <div className="row" key={HPCProjectID}>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3>HPC Project: {HPCProjectID}</h3>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Resource Name</th>
                                                    <th>Resource ID</th>
                                                    <th>Description</th>
                                                    <th>Usage</th>
                                                    <th>Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {AccountingData.map(
                                                    ({
                                                        resource_id,
                                                        resource_name,
                                                        description,
                                                        usage,
                                                        cost,
                                                        unit,
                                                    }) => (
                                                        <tr key={resource_id}>
                                                            <td>
                                                                {resource_name}
                                                            </td>
                                                            <td>
                                                                {resource_id}
                                                            </td>
                                                            <td>
                                                                {description}
                                                            </td>
                                                            <td>
                                                                {(() => {
                                                                    if (usage.active) { 
                                                                        // return <p>active: {usage.active} ({unit})</p>
                                                                        return <p>{secsToDuration(usage.active)}</p>
                                                                    }
                                                                    return null;
                                                                })()}
                                                                {(() => {
                                                                    if (usage.inactive) { 
                                                                        // return <p>inactive: {usage.inactive} ({unit})</p>
                                                                        return <p>{secsToDuration(usage.inactive)}</p>
                                                                    }
                                                                    return null;
                                                                })()}
                                                                {(() => {
                                                                    if (usage.used) { 
                                                                        // return <p>used: {usage.used} ({unit})</p>
                                                                        return <p>{secsToDuration(usage.used)}</p>
                                                                    }
                                                                    return null;
                                                                })()}
                                                                {(() => {
                                                                    if (usage.error) { 
                                                                        return <p>error: {usage.error}</p> // FIXME ({unit})
                                                                    }
                                                                    return null;
                                                                })()}
                                                                {(() => {
                                                                    if (usage.terminated) { 
                                                                        // return <p>terminated: {usage.terminated} ({unit})</p>
                                                                        return <p>{secsToDuration(usage.terminated)}</p>
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </td>
                                                            <td>{cost}</td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </Fragment>
    ) : (
        <div className="row">
            <div className="col">
                <h1>There seems to be no resources linked to this project yet.</h1>
            </div>
            <button
                type="button"
                className="btn btn-success btn-link text-nowrap"
                onClick={goBack}>
                Back
            </button>
        </div>
    )

const mapStateToProps = state => ({
    projectUsage: getProjectUsage(state),
})

const mapDispatchToProps = () => ({})

export const ProjectUsage = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectUsageImplementation)
