import React, { Component } from "react"

export class Refresh extends Component {
    constructor(props) {
        super(props)
        this.state = { interval: props.interval, action: props.action }
    }
    componentDidMount() {
        this.interval = setInterval(
            () => this.state.action(),
            this.state.interval * 1000
        )
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    render() {
        return <div> Refreshing every {this.state.interval} seconds </div>
    }
}
