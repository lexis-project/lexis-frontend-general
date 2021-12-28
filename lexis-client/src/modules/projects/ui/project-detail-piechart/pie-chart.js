import React, { Component } from "react"
import { connect } from "react-redux"

import { getFetchingStateOfResourcesRequests } from "../../resources-requests-dynamic/resources-requests-selectors"
import PieChartWrapper from "./pie-chart-wrapper"

class PieChartImpl extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            listFetchInProgress: true,
        }
    }

    componentDidMount() {
        const data = this.props.data
        const listFetchInProgress = this.props.listFetchInProgress
        this.setState({ data, listFetchInProgress })
    }

    render() {
        const { id, showChart } = this.props
        const listFetchInProgress = this.state.listFetchInProgress
        const dataPassed = !listFetchInProgress && this.state.data

        return (
            <div id={`pie-chart-${id}`} className="pane">
                {showChart ? (
                    <div style={{ overflowX: "hidden", overflowY: "hidden" }}>
                        <PieChartWrapper
                            data={dataPassed}
                            id={id}
                            width={500}
                            height={500}
                        />
                    </div>
                ) : null}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    listFetchInProgress: getFetchingStateOfResourcesRequests(state),
})

export const PieChart = connect(mapStateToProps, null)(PieChartImpl)
