import React, { Component } from "react"
import drawPieChart from "./draw-pie-chart"

export default class PieChartWrapper extends Component {
    componentDidMount() {
        drawPieChart(this.props, this.props.id)
    }

    componentDidUpdate(preProps) {
        drawPieChart(this.props, this.props.id)
    }

    render() {
        return <div id={`vis-piechart-${this.props.id}`} />
    }
}
