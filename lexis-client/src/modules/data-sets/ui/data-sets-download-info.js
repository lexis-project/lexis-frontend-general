import React from 'react'

export const HandleDownload = ({
    status,
    downloadProgress,
    downloadSpeed,
    remainingTime,
    errorString,
}) => {
    switch (status) {
    case "error":
        return (
            <div className="row justify-content-center">
                <div
                    className="col-8 mt-5 text-center"
                    style={{ color: "rgb(196, 138, 0)" }}>
                    <span
                        className="white d-inline-flex mx-4 mb-4"
                        style={{ fontSize: "5rem" }}>
                        <i className="tim-icons icon-alert-circle-exc"></i>
                    </span>
                    <h3>Something went wrong :-(</h3>
                    <pre>{errorString}</pre>
                </div>
            </div>
        )
    case "proccessing":
        return (
            <div
                className="row justify-content-center"
                style={{ minHeight: "50vh" }}>
                <div className="col-2">
                    <div
                        className="spinner-border text-light ml-2"
                        role="status"
                        style={{ marginTop: "20vh" }}></div>
                </div>
            </div>
        )
    case "sending":
        return (
            <div className="row justify-content-center">
                <div className="col-8">
                    <h3 className="text-center">Downloading file...</h3>
                    <div className="progress" style={{ height: "2em" }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                                width: `${downloadProgress}%`,
                            }}>{`${downloadProgress}% - ${downloadSpeed}/s - remaining: ${remainingTime}`}</div>
                    </div>
                </div>
            </div>
        )
    default:
        return null
    }
}