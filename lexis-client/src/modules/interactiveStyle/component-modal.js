import React, { Component } from "react"
import cx from "classnames"

export class ComponentModal extends Component {
    /**
     * 
     * @param {{
     * onClose: Function|undefined,
     * onAccept: Function|undefined,
     * headerTitle: string|undefined,
     * closeTitle: string|undefined,
     * acceptTitle: string|undefined
     * alert: Boolean|undefined,
     * customInfo: {},
     * children: React|undefined
     * className: string,
     * dialogClassName: string
     * contentClassName: string
     * titleClassName: string
     * acceptButtonClass: string
     * }} props
     */
    constructor(props) {
        super(props)
        this.state = {
            isClosed: true,
            onClose: null,
            onAccept: null
        }
    }

    hideModal() {
        this.setState({ isClosed: true, onClose: null, onAccept: null })
    }

    showModal(onAccept, onClose) {
        this.setState({ isClosed: false })
        if(onAccept) {this.setState({onAccept})}
        else {this.setState({onAccept: null})}
        
        if(onClose) this.setState({onClose})
        else {this.setState({onClose: null})}
    }

    setAcceptFn(onAccept) {
        this.setState({onAccept})
    }

    closeAction() {
        if (this.state.onClose !== null) {
            this.hideModal()
            this.state.onClose()
        } else {
            this.hideModal()
        }
    }
    acceptAction() {
        if (this.state.onAccept !== null) {
            this.hideModal()
            this.state.onAccept()
        } else {
            this.hideModal()
        }
    }
    componentDidUpdate() {
        if(this.props.onAccept && this.state.onAccept === null) {
            this.setState({onAccept: this.props.onAccept})
        }
        if(this.props.onClose && this.state.onClose === null) {
            this.setState({onClose: this.props.onClose})
        }
    }

    render() {
        return (
            <>
                <div
                    className={cx({
                        modal: true,
                        "d-none": this.state.isClosed,
                        "d-block": !this.state.isClosed,
                    })}>
                    <div className={`modal-dialog${this.props.dialogClassName?" " +this.props.dialogClassName: ""}`}>
                        <div className={`modal-content${this.props.contentClassName?" " +this.props.contentClassName: ""}`}>
                            <div className="modal-header">
                                <h5 className={`modal-title${this.props.titleClassName?" " +this.props.titleClassName: ""}`}>
                                    {this.props.headerTitle ? this.props.headerTitle : 'Confirmation'}
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-hidden="true"
                                    onClick={() => this.closeAction()}>
                                    <i className="tim-icons icon-simple-remove"></i>
                                </button>
                            </div>
                            <div
                                className={`modal-body${this.props.className?" " +this.props.className : ""}`}
                            >
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                {!this.props.alert 
                            && ( <>
                                <button
                                    type="button"
                                    className="btn btn-info btn-simple text-nowrap"
                                    onClick={() => this.closeAction()}
                                >
                                    <span className="d-inline-flex mr-2">
                                        <i className="tim-icons icon-simple-remove"></i>
                                    </span>
                                    {this.props.closeTitle
                                        ? this.props.closeTitle
                                        : "Close"}
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${this.props.acceptButtonClass ? this.props.acceptButtonClass : 'btn-success'} btn-simple text-nowrap`}
                                    onClick={() => this.acceptAction()}>
                                    <span className="d-inline-flex mr-2">
                                        <i className="tim-icons icon-simple-add"></i>
                                    </span>
                                    {this.props.acceptTitle
                                        ? this.props.acceptTitle
                                        : "OK"}
                                </button>
                            </>)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
