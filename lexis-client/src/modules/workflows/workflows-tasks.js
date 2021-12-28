import React, { Component } from "react"

class WorkflowTaskList extends Component {
    categoryExists(category) {
        for (let v of this.props.templates.values()) {
            for (let c of v.tags.values()) {
                if (c.value === category) {
                    return true
                }
            }
        }
        return false
    }

    listCategory(category) {
        return this.categoryExists(category) ? (
            <div className="row">
                <div className="col-4">
                    <p>{category}:</p>
                </div>
                {this.props.templates.map((item, index) => (
                    <div key={index}>
                        {item.tags != null
                            ? item.tags.map((subitem, i) => (
                                <div key={i}>
                                    {subitem.value === category ? (
                                        <div key={i}>
                                            <div className="col">
                                                <p>{item.nodeName}</p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ))
                            : null}
                    </div>
                ))}
            </div>
        ) : null
    }

    render() {
        return this.props.templates != null ? (
            <>
                {this.listCategory("preprocessing")}
                {this.listCategory("computation")}
                {this.listCategory("postprocessing")}
                {this.listCategory("visualization")}
            </>
        ) : null
    }
}

export { WorkflowTaskList }
