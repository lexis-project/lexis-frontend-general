import React, { Component } from "react"
import { connect } from "react-redux"
import Editor from "@monaco-editor/react"
import { getRouteParams } from "../../../routing/routing-selectors"
import { getDataSetDetail, getDSReqProgStatus, getEditorSource } from "../../data-sets-selectors"
import dataSetsActions from "../../data-sets-actions"
import DataSetsUploadStatus from "../data-sets-upload-status"
import {
    displayShortBiSize,
    displayShortTime,
    getFileID,
    valOrZero,
} from "../../../utils"
import { actions as routerActions } from "redux-router5"
import { ROUTE_DATA_SETS_FILELIST } from "../../../routing/routes"
import { getUserFinePerms} from "../../../auth/auth-selectors"
import {
    checkFineWritePerms
} from "../../../auth/auth-check-fine-perms"
import { HandleDownload } from "../data-sets-download-info"

const mapExtensionsToLangs = {
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    css: "css",
    json: "json",
    md: "markdown",
    html: "html",
    less: "less",
    xml: "xml",
    php: "php",
    cs: "c#",
    cpp: "c++",
    c: "objective-c",
    class: "java",
    idx: "java",
    jad: "java",
    jar: "java",
    java: "java",
    jsp: "java",
    razor: ".razor",
    diff: "diff",
    coffee: "coffeescript",
    cson: "coffeescript",
    litcoffee: "coffeescript",
    handlebars: "handlebars",
    sh: "shell",
    r: "r",
    py: "python",
    py3: "python",
    pyo: "python",
    pym: "python",
    pyc: "python",
    pyd: "python",
    pyt: "python",
    pyzw: "python",
    pyw: "python",
    pyz: "python",
    rpy: "python",
    oog: "python",
    mdp: "vb",
    pdm: "vb",
    vbscript: "vb",
    vip: "vb",
    wct: "vb",
    psc2: "powershell",
    psd1: "powershell",
    psm1: "powershell",
    rb: "ruby",
    rhtml: "ruby",
    rjs: "ruby",
}


class DataSetsFileEditorImpl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileID: null,
            timeoutID: null,
            firstStorageWrite: true,
            defaultContent: null,
            fileLang: null,
            content: null,
            writeAccess: null,
        }
    }

    revertChanges() {
        this.setState({ content: this.state.defaultContent })
    }

    removeLocalChages() {
        if (this.state.fileID) {
            window.localStorage.removeItem(this.state.fileID)
        }
    }

    setFileType() {
        /**
         * @type {[String]}
         */
        const extSplitted = this.props.routeParams.fileName.split(".")
        const lang = mapExtensionsToLangs[extSplitted[extSplitted.length - 1]]
        this.setState({ fileLang: lang ? lang : null })
    }
    initDefContent() {
        if (
            this.state.firstStorageWrite &&
            !this.state.defaultContent &&
            this.props.sourceContent &&
            this.props.routeParams
        ) {
            this.setState({ firstStorageWrite: false })
            document.title = `LEXIS - edit file - ${this.props.routeParams.fileName}`
            const {
                internalID,
                dsPath,
                fileName,
                project,
                zone,
            } = this.props.routeParams
            getFileID(internalID,
                decodeURIComponent(dsPath),
                decodeURIComponent(fileName),
                decodeURIComponent(project),
                decodeURIComponent(zone)
            ).then(
                id => {
                    this.setState({
                        defaultContent: window.localStorage.getItem(id),
                        fileID: id,
                    })
                }
            )
            this.setFileType()
        }
    }
    componentDidMount() {
        this.initDefContent()
    }
    componentDidUpdate() {
        this.initDefContent()
        if (
            this.props.routeParams &&
            this.props.routeParams.access &&
            this.props.perms &&
            this.state.writeAccess === null
        ) {
            this.hasWritePerms()
        }
    }

    componentWillUnmount() {
        document.title = "LEXIS"
        if (this.state.timeoutID) {
            clearTimeout(this.state.timeoutID)
        }
    }
    hasWritePerms() {
        if (this.state.writeAccess === null) {
            this.setState({
                writeAccess: checkFineWritePerms(
                    this.props.routeParams.project,
                    this.props.routeParams.access === "public"
                        ? "dat_pub_short"
                        : "dat_short",
                    this.props.perms
                ),
            })
            return this.state.writeAccess
        }
        return this.state.writeAccess
    }
    onChange(value) {
        if (this.props.perms && this.hasWritePerms()) {
            this.setState({ content: value })
            if (
                this.props.routeParams &&
                !this.state.firstStorageWrite &&
                this.state.defaultContent
            ) {
                if (this.state.timeoutID) {
                    clearTimeout(this.state.timeoutID)
                }
                const timId = setTimeout(() => {
                    window.localStorage.setItem(this.state.fileID, value)
                }, 2000)
                this.setState({ timeoutID: timId })
            }
        }
    }

    render() {
        const contentIsUnchanged =
            this.state.content === null ||
            this.state.content === this.state.defaultContent
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h2>
                                File editor - {decodeURIComponent(this.props.routeParams.fileName)}
                            </h2>
                            {this.props.routeParams && (
                                <>
                                    <span
                                        className="mr-2"
                                        style={{ float: "left" }}>
                                        InternalID:
                                    </span>
                                    <pre style={{ lineHeight: "1.5rem" }}>
                                        {decodeURIComponent(this.props.routeParams.internalID)}
                                    </pre>
                                    <span
                                        className="mr-2"
                                        style={{ float: "left" }}>
                                        Zone:
                                    </span>
                                    <pre style={{ lineHeight: "1.5rem" }}>
                                        {decodeURIComponent(this.props.routeParams.zone)}
                                    </pre>
                                    <span
                                        className="mr-2"
                                        style={{ float: "left" }}>
                                        Path:
                                    </span>
                                    <pre style={{ lineHeight: "1.5rem" }}>
                                        {this.props.routeParams.dsPath ===
                                        `/${decodeURIComponent(
                                            this.props.routeParams.fileName
                                        )}`
                                            ? "<root directory>"
                                            : `${decodeURIComponent(
                                                this.props.routeParams.dsPath
                                            )}${decodeURIComponent(
                                                this.props.routeParams
                                                    .fileName
                                            )}`}
                                    </pre>
                                </>
                            )}
                        </div>
                        <div className="card-body">
                            {this.state.writeAccess && (
                                <div className="row mb-3 mr-3">
                                    <div className="col-4 mt-3">
                                        <button
                                            className="btn btn-success btn-simple text-nowrap mr-1 ml-3"
                                            onClick={() => this.revertChanges()}
                                            disabled={contentIsUnchanged}>
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-refresh-02"></i>
                                            </span>{" "}
                                            Revert all changes
                                        </button>
                                    </div>
                                    <div className="col-4"></div>
                                    <div className="col-4 text-right">
                                        {this.state.writeAccess && this.props.dataset && !this.props.dataset['__replicas'] && <button
                                            className="btn btn-success btn-simple text-nowrap mr-1 mr-3"
                                            onClick={() =>
                                                this.props.onSave(
                                                    this.props.routeParams
                                                        .internalID,
                                                    this.props.routeParams
                                                        .dsPath,
                                                    this.props.routeParams
                                                        .project,
                                                    this.props.routeParams
                                                        .access,
                                                    this.props.routeParams
                                                        .zone,
                                                    this.props.routeParams
                                                        .fileName
                                                )
                                            }
                                            disabled={
                                                this.state.content === ""
                                            }>
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-upload"></i>
                                            </span>{" "}
                                                Save changes
                                        </button>
                                        }
                                    </div>
                                </div>
                            )}
                            {this.state.defaultContent &&
                                !this.state.firstStorageWrite && (
                                <>
                                    <DataSetsUploadStatus
                                        updateReqStatus={
                                            this.props.updateReqStatus
                                        }
                                        DSReqProgStatus={
                                            this.props.DSReqProgStatus
                                        }
                                        isTus={false}
                                        isInValid={contentIsUnchanged}
                                    />
                                    {this.props.DSReqProgStatus.status ===
                                            "done" && (
                                        <div className="row mb-3 mr-3 mt-3">
                                            <div className="col-4"></div>
                                            <div className="col-4">
                                                <button
                                                    className="btn btn-success btn-simple text-nowrap mr-1 mr-3"
                                                    onClick={() =>
                                                        this.props.navigateTo(
                                                            ROUTE_DATA_SETS_FILELIST,
                                                            {
                                                                internalID: this
                                                                    .props
                                                                    .routeParams
                                                                    .internalID,
                                                            }
                                                        )
                                                    }>
                                                    <span className="white d-inline-flex mx-1">
                                                        <i className="tim-icons icon-minimal-left"></i>
                                                    </span>{" "}
                                                        Go back to file list
                                                </button>
                                            </div>
                                            <div className="col-4"></div>
                                        </div>
                                    )}
                                </>
                            )}
                            {this.state.firstStorageWrite && (
                                <HandleDownload
                                    status={this.props.DSReqProgStatus.status}
                                    errorString={
                                        this.props.DSReqProgStatus.errorString
                                    }
                                    downloadProgress={valOrZero(
                                        this.props.DSReqProgStatus.progress
                                    )}
                                    downloadSpeed={displayShortBiSize(
                                        valOrZero(
                                            this.props.DSReqProgStatus
                                                .upDownSpeed
                                        )
                                    )}
                                    remainingTime={displayShortTime(
                                        valOrZero(
                                            this.props.DSReqProgStatus
                                                .remainingTime
                                        )
                                    )}
                                />
                            )}
                            <div className="row">
                                <div className="col-8"></div>
                                <div className="col text-right mr-5"> {this.state.writeAccess && this.props.dataset && !this.props.dataset['__replicas'] ? <h5><em>save the changes by clicking on the button</em></h5> : <h5><em>Read Only</em></h5>} </div>
                            </div>
                            {this.state.defaultContent && this.state.defaultContent.length > 0 && (
                                <Editor
                                    height="80vh"
                                    defaultValue={this.state.defaultContent}
                                    onChange={val => this.onChange(val)}
                                    defaultLanguage={this.state.fileLang}
                                    theme="vs-dark"
                                    loading="Loading file..."
                                    value={this.state.content}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    routeParams: getRouteParams(state),
    sourceContent: getEditorSource(state),
    DSReqProgStatus: getDSReqProgStatus(state),
    perms: getUserFinePerms(state),
    dataset: getDataSetDetail(state)
})

const mapDispatchToProps = {
    onSave: dataSetsActions.Creators.uploadEditorContent,
    updateReqStatus: dataSetsActions.Creators.reqProgressStatus,
    navigateTo: routerActions.navigateTo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetsFileEditorImpl)
