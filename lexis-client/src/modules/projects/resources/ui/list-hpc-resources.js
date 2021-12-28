import React from "react"
import { actions as routerActions } from "redux-router5"
import { connect } from "react-redux"
import moment from "moment"

import { getProjectId } from "../../projects-selectors"

export const secsToDuration = (secs) => {
    let d = secs / 8.64e4 | 0;
    let H = (secs % 8.64e4) / 3.6e3 | 0;
    let m = (secs % 3.6e3)  / 60 | 0;
    let s = secs % 60;
    let z = n=> (n < 10? '0' : '') + n;
    if (d === 0) {
        return `${z(H)}:${z(m)}:${z(s)}`
    } else {
        return `${d} days ${z(H)}:${z(m)}:${z(s)}`
    }
}

const ResourcesListImpl = ({
    projectId,
    gotoRoute,
    resourcesDataHPCList,
    usageAccountInfoHpcPrjs
}) => {
    
    const headingInsteadId = (dataHpcList, usageHPCProjectID) => {
        const res = dataHpcList.find((item) => {
            return item.HPCResourceID === usageHPCProjectID
        })

        return res && res.AssociatedHPCProject
    }

    const showProvider = (dataHpcList, usageHPCProjectID) => {
        const res = dataHpcList.find((item) => {
            return item.HPCResourceID === usageHPCProjectID
        })

        return res && res.HPCProvider
    }

    const showResourceType = (dataHpcList, usageHPCProjectID) => {
        const res = dataHpcList.find((item) => {
            return item.HPCResourceID === usageHPCProjectID
        })

        return res && res.ResourceType
    }

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="table-responsive">
                                {resourcesDataHPCList && usageAccountInfoHpcPrjs && usageAccountInfoHpcPrjs
                                    .map(({ HPCProjectID, AccountingData }, indx) =>
                                        <>
                                            <h4><strong>
                                            HPC Resource:{" "}{headingInsteadId(resourcesDataHPCList, HPCProjectID)}
                                            </strong>{" "}
                                            (HPC Provider:{" "}
                                            {showProvider(resourcesDataHPCList, HPCProjectID)}, 
                                            Resource Type:{" "}
                                            {showResourceType(resourcesDataHPCList, HPCProjectID)})
                                            </h4>
                                            <table
                                                className="table table-striped table-bordered table-hover"
                                                cy="resourcesrequests-list-table"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Flavor</th>
                                                        <th>Amount</th>
                                                        <th>Cost</th>
                                                        <th>Size</th>
                                                        <th>Active usage</th>
                                                        <th>Inactive usage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AccountingData && AccountingData.length === 0
                                                    && 
                                                    (<tr>
                                                        <td
                                                            colSpan={7}
                                                            style={{
                                                                textAlign: "center",
                                                            }}>
                                                                Empty list of accounting usage of resources
                                                        </td>
                                                    </tr>
                                                    )}
                                                    {AccountingData && AccountingData
                                                        .map(({ 
                                                            resource_type,
                                                            flavor,
                                                            resources_amount,
                                                            cost,
                                                            size,
                                                            usage }, index) => 
                                                            (<tr 
                                                                key={`${HPCProjectID}-${index}`}
                                                                id={`resource-row-${HPCProjectID}-${index}`}
                                                            >
                                                                <td>{resource_type}</td>
                                                                <td>{flavor !== undefined ? flavor : "-"}</td>
                                                                <td className="text-right">
                                                                    {resources_amount !== undefined ? resources_amount : "-"}
                                                                </td>
                                                                <td className="text-right">
                                                                    {cost}
                                                                </td>
                                                                <td className="text-right">
                                                                    {size !== undefined ? size : "-"}
                                                                </td>
                                                                <td className="text-right">
                                                                    {secsToDuration(usage.active)}
                                                                </td>
                                                                <td className="text-right">
                                                                    {usage.inactive !== undefined ? secsToDuration(usage.inactive) : "-"}
                                                                </td>
                                                            </tr>)
                                                        )}
                                                </tbody>
                                            </table>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        projectId: getProjectId(state),
    }
}

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

export const HPCResourcesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourcesListImpl)
