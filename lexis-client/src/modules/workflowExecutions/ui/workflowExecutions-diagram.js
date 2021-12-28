import React, { Component } from "react"
import ReactDOM from "react-dom"
import cloneDeep from "lodash/cloneDeep"
import { Flowpoint, Flowspace } from "flowpoints"
import memoize from "memoize-one"

const hoverStyle = {
    backgroundColor: "#525f7f",
    margin: "10px",
    display: "none",
    position: "absolute",
    top: "-75px",
    fontSize: "12px",
    zIndex: "9",
}

const tableStyle = {
    border: "1px solid grey",
}

const tableStyleTop = {
    borderTopWidth: 0,
}

const tableStyleBottom = {
    borderBottomWidth: 0,
}

const tableStyleLeft = {
    borderLeftWidth: 0,
    color: "orange",
}

const tableStyleRight = {
    borderRightWidth: 0,
}

function combineStyles(...args) {
    return Object.assign({}, ...args)
}

class HoverBox extends Component {
    renderHoverboxRow(key, value, style = tableStyle) {
        if (key === "Status") {
            if (value === null || value === "" || value === undefined) {
                value = "NO_STATUS"
            }
        }
        if (value !== null && value !== "" && value !== undefined) {
            return (
                <tr>
                    <th style={combineStyles(style, tableStyleLeft)}>{key}</th>
                    <td style={combineStyles(style, tableStyleRight)}>
                        {value}
                    </td>
                </tr>
            )
        } else {
            return null
        }
    }
    render() {
        return (
            <div position="absolute">
                <table style={{ tableLayout: "fixed" }}>
                    <tbody>
                        {this.renderHoverboxRow(
                            "Step",
                            this.props.step,
                            combineStyles(tableStyle, tableStyleTop)
                        )}
                        {this.renderHoverboxRow("Task", this.props.task)}
                        {this.renderHoverboxRow(
                            "Node name",
                            this.props.nodeName
                        )}
                        {this.renderHoverboxRow(
                            "Activity type",
                            this.props.activityType
                        )}
                        {this.renderHoverboxRow(
                            "Location",
                            this.props.location
                        )}
                        {this.renderHoverboxRow(
                            "Status",
                            this.props.status,
                            combineStyles(tableStyleBottom)
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

const FlowspaceStyle = {
    backgroundColor: "rgba(52, 52, 52, 0)",
}

/* TODO support multiple ActivityTypes */
function parseActivity(str) {
    if (typeof str === "string") {
        return str
    }
    if (str !== null) {
        let subsection = str[0].slice(
            1 + str[0].lastIndexOf("."),
            str[0].length
        )
        let index = subsection.search("WorkflowActivity")
        return subsection.slice(0, index)
    } else {
        return null
    }
}

function collapseNode(activityType) {
    if (activityType !== null && activityType.includes("SetState")) {
        return true
    }
    return false
}

function getTextWidth(str, font) {
    let cutoff = str.length / 2 - 1
    let index = str.slice(cutoff, str.length).search(/[A-Z_]/)
    while (cutoff < str.length) {
        if (
            str
                .slice(index + cutoff - 1, index + cutoff + 2)
                .search(/[a-z]/) !== -1
        ) {
            break
        }
        cutoff++
        index = str.slice(cutoff, str.length).search(/[A-Z_]/)
    }

    if (index > -1) {
        index += cutoff
    } else {
        index = str.length
    }

    let firstLine = str.slice(0, index)
    let secondLine = str.slice(index, str.length)

    var canvas =
        getTextWidth.canvas ||
        (getTextWidth.canvas = document.createElement("canvas"))
    var context = canvas.getContext("2d")
    context.font = font || "16px arial"
    var metric = context.measureText(firstLine)
    var metric2 = context.measureText(secondLine)

    if (metric2.width > metric.width) {
        return metric2.width
    }

    return metric.width
}

function formatStepString(str, activityType) {
    if (collapseNode(activityType)) {
        return ""
    }
    let cutoff = str.length / 2 - 1

    let index = str.slice(cutoff, str.length).search(/[A-Z_]/)
    while (cutoff < str.length) {
        if (
            str
                .slice(index + cutoff - 1, index + cutoff + 2)
                .search(/[a-z]/) !== -1
        ) {
            break
        }
        cutoff++
        index = str.slice(cutoff, str.length).search(/[A-Z_]/)
    }

    if (index > -1) {
        index += cutoff
    } else {
        index = str.length
    }

    let firstLine = str.slice(0, index)
    let secondLine = str.slice(index, str.length)

    return firstLine + "\n" + secondLine
}

function getBoxWidth(step, activityType) {
    if (collapseNode(activityType)) {
        return 10
    }
    return 16 + getTextWidth(step)
}

function getBoxHeight(activityType) {
    if (collapseNode(activityType)) {
        return 10
    }
    return 50
}

class WorkflowExecutionDiagram extends Component {
    constructor(props) {
        super(props)
        this.state = {
            update_index: 0,
            selected_point: null,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.wfesteps !== this.props.wfesteps) {
            this.setState({ update_index: prevState.update_index + 1 })
        }
    }

    _evaluateDiagram(wfesteps) {
        const wfediagram = cloneDeep(wfesteps)

        /* recurse from last step */
        this.setXPosition(wfediagram, "Finish")
        /* recurse from first step */
        let peak = this.setYPosition(wfediagram, "Start", 0)
        /* move diagram down to keep in frame */
        wfediagram.forEach(function (wfestep) {
            wfestep.y_pos += 100 - peak
        })

        return wfediagram
    }

    stepFromName(wfediagram, step) {
        let stepIndex = 0
        for (stepIndex = 0; stepIndex < wfediagram.length; stepIndex++) {
            if (wfediagram[stepIndex].step === step) {
                break
            }
        }
        return wfediagram[stepIndex]
    }

    setXPosition(wfediagram, step) {
        let wfestep = this.stepFromName(wfediagram, step)
        /* avoid recomputation */
        if (wfestep.visited === 1) {
            return wfestep
        }
        wfestep.visited = 1

        if (wfestep.activityType !== null) {
            wfestep.activityType = parseActivity(wfestep.activityType)
        }

        wfestep.topologicalSuccessors = []
        wfestep.width = getBoxWidth(step, wfestep.activityType)
        wfestep.height = getBoxHeight(wfestep.activityType)

        wfestep.x_pos = 0
        if (step !== "Start") {
            let clearPredecessor = 0
            /* extend from the preceding step with the largest x */
            wfestep.precedingSteps.forEach(stepName => {
                let prestep = this.setXPosition(wfediagram, stepName)
                if (prestep.x_pos >= wfestep.x_pos) {
                    wfestep.x_pos = prestep.x_pos
                    prestep.topologicalSuccessors.push(step)
                    clearPredecessor = prestep.width
                }
            })
            wfestep.x_pos += clearPredecessor
        }
        wfestep.x_pos += 50

        return wfestep
    }

    isPositionFree(wfediagram, step, y) {
        let isfree = true
        let wfestep = this.stepFromName(wfediagram, step)
        wfediagram.every(function (testStep) {
            if (step !== testStep.step && testStep.visited === 2) {
                let x_range = [wfestep.x_pos, wfestep.x_pos + wfestep.width]
                let y_range = [y, y + wfestep.height]
                let test_x_range = [
                    testStep.x_pos,
                    testStep.x_pos + testStep.width,
                ]
                let test_y_range = [
                    testStep.y_pos,
                    testStep.y_pos + testStep.height,
                ]

                /* check if any corners of candidate position fall within testStep's boundaries */
                for (var i = 0; i < x_range.length; i++) {
                    for (var j = 0; j < y_range.length; j++) {
                        if (
                            x_range[i] >= test_x_range[0] &&
                            x_range[i] <= test_x_range[1] &&
                            y_range[j] >= test_y_range[0] &&
                            y_range[j] <= test_y_range[1]
                        ) {
                            isfree = false
                            return false
                        }
                    }
                }
            }
            return true
        })
        return isfree
    }

    /* adjust positions of successive steps relative to one another */
    setYPosition(wfediagram, step, y, peak) {
        let wfestep = this.stepFromName(wfediagram, step)
        /* avoid recomputation */
        if (wfestep.visited === 2) {
            return peak < wfestep.y_pos ? peak : wfestep.y_pos
        }
        wfestep.visited = 2
        wfestep.y_pos = y

        if (wfestep.topologicalSuccessors.length > 0) {
            let norm = wfestep.topologicalSuccessors.length / 2 - 0.5
            /* iterate from middle indices out for better graph balance */
            let i = Math.ceil(norm)
            let pos = i
            let index_increment_direction = -1
            let index_increment_distance = 1
            let pos_increment_direction = -1
            let pos_increment_distance = 1
            while (i > -1 && i < wfestep.topologicalSuccessors.length) {
                do {
                    y = wfestep.y_pos + 100 * (pos - norm)
                    pos += pos_increment_direction * pos_increment_distance
                    pos_increment_direction *= -1
                    pos_increment_distance += 1
                } while (
                    !this.isPositionFree(
                        wfediagram,
                        wfestep.topologicalSuccessors[i],
                        y
                    )
                )

                peak = this.setYPosition(
                    wfediagram,
                    wfestep.topologicalSuccessors[i],
                    y,
                    peak
                )
                i += index_increment_direction * index_increment_distance
                index_increment_direction *= -1
                index_increment_distance += 1
            }
        }

        return peak < wfestep.y_pos ? peak : wfestep.y_pos
    }

    chooseStepColour(status) {
        switch (status) {
        case "STARTED":
            return "#00B3CA"
        case "COMPLETED_SUCCESSFULL":
            return "#5CB85C"
        case "COMPLETED_WITH_ERROR":
            return "#C9302C"
        default:
            return "rgba(52, 52, 52, 0)"
        }
    }

    render() {
        const evaluateDiagram = memoize(wfesteps =>
            this._evaluateDiagram(wfesteps)
        )
        const wfediagram = evaluateDiagram(this.props.wfesteps)
        return wfediagram !== undefined ? (
            <Flowspace
                key={this.props.wfeid + this.state.update_index.toString()}
                theme="yellow"
                background="rgba(52, 52, 52, 0)"
                style={FlowspaceStyle}>
                {wfediagram.map(
                    ({
                        step,
                        succeedingSteps,
                        status,
                        activityType,
                        task,
                        nodeName,
                        location,
                        x_pos,
                        y_pos,
                        width,
                        height,
                    }) => (
                        <Flowpoint
                            className="nodrag"
                            key={step}
                            outputs={succeedingSteps}
                            startPosition={{
                                x: x_pos,
                                y:
                                    y_pos +
                                    (collapseNode(activityType) ? 20 : 0),
                            }}
                            style={{
                                backgroundColor: this.chooseStepColour(status),
                                textAlign: "center",
                                fontFamily: "arial",
                                fontSize: "16px",
                                position: "absolute",
                            }}
                            width={width}
                            height={height}
                            variant="outlined"
                            padding="4px"
                            onClick={() => {
                                var selected_point = this.state.selected_point
                                if (selected_point === step) {
                                    selected_point = null
                                } else {
                                    selected_point = step
                                }
                                this.setState({ selected_point })
                            }}
                            onHover={isHovering => {
                                let hoverbox = document.getElementById(step)
                                if (isHovering) {
                                    hoverbox.style.display = "block"
                                    ReactDOM.render(
                                        <HoverBox
                                            step={step}
                                            status={status}
                                            activityType={activityType}
                                            location={location}
                                            task={task}
                                            nodeName={nodeName}
                                        />,
                                        hoverbox
                                    )
                                } else {
                                    hoverbox.style.display = "none"
                                }
                            }}>
                            {formatStepString(step, activityType)}
                            <div
                                className="box"
                                id={step}
                                key={step}
                                style={hoverStyle}
                            />
                        </Flowpoint>
                    )
                )}
            </Flowspace>
        ) : null
    }
}

export { WorkflowExecutionDiagram }
