import React from "react"
import { connect } from "react-redux"
import { getErrorType, getErrorMessage } from "../error-selectors"

const ErrorPageImpl = ({ eType, eMessage }) =>
    eType && (
        <>
            <div className="row">
                <div className="col">
                    <h1>
                        Error code <em>{eType}</em>
                    </h1>
                </div>
            </div>

            <div className="row">
                <div className="col-9">
                    <div className="card">
                        <div className="card-header">
                            <h4>
                                We are sorry, something went wrong while
                                connecting to API.
                            </h4>
                        </div>
                        <div className="card-body">
                            {eMessage && (
                                <div className="row">
                                    <div className="justify-content-center col">
                                        <p>
                                            <code>{eMessage}</code>
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="justify-content-center col">
                                    <p>
                                        If necessary, contact the app developers
                                        at:
                                        <a href="mailto:support@lexis-project.eu">
                                            {" "}
                                            support@lexis-project.eu
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

const mapStateToProps = state => ({
    eType: getErrorType(state),
    eMessage: getErrorMessage(state),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPageImpl)
