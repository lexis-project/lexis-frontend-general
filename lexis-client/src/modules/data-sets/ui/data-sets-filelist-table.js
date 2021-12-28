import moment from "moment"
import React, { Component, createRef } from "react"
import { ROUTE_DATA_SETS_EDITOR_FILE } from "../../routing/routes"
import { displayShortBiSize, displayShortTime, valOrZero } from "../../utils"
import config from '../../../config'
import { CheckFineWritePermsComp } from "../../auth/auth-check-fine-perms"

import { ComponentModal as DSModal } from "../../interactiveStyle/component-modal"
import { HandleDownload } from "./data-sets-download-info"
/**
 *
 * @param {{name: String, type: String, contents: [{}]}} normalizedFiles object of files stored by filepath for optimalization and simplicity
 * @param {String} parentPath
 * @param {{name: String, type: String, contents: [{}]}} fileToNormalize file to be normalized
 * @returns {{name: String, type: String, contents: [{}]}}
 */
function normalizeFiles(normalizedFiles, parentPath, fileToNormalize) {
    const nParentPath = parentPath === "/" ? "/" : `${parentPath}/`
    normalizedFiles[`${nParentPath}${fileToNormalize.name}`] = fileToNormalize

    if (fileToNormalize.type !== "directory") return normalizedFiles

    const filePath = `${nParentPath}${fileToNormalize.name}`
    const fContents = fileToNormalize.contents ? fileToNormalize.contents : []
    for (const childFile of fContents) {
        normalizedFiles = normalizeFiles(normalizedFiles, filePath, childFile)
    }
    return normalizedFiles
}

class fileListTable extends Component {
    /**
     * 
     * @param {{
     *   fileList: {name:string, contents: [], type: 'directory'},
     *   hasReadPermissions: Boolean,
     *   gotoRoute: Function,
     *   displayImage: Function,
     *   removeAction: Function,
     *   location: {internalID: string, zone: string, access: 'user'|'project'|'public', project: string},
     *   username: string,
     *   loadFile: Function,
     *   DSReqProgStatus: {status: string, progress: Number, upDownSpeed: Number, remainingTime: Number, errorString: string},
     *   isMutable: boolean,
     *   selectMode: boolean,
     *   selectFiles: boolean,
     *   selectFolder: boolean
     *   onSelectAction: Function(path: string, filename: string)
     *   }} props 
     */
    constructor(props) {
        super(props)
        this.modalDelRef = createRef()
        this.modalDwnlRef = createRef()
        this.state = {
            currentPath: "/",
            rootDir: null,
            files: null,
            dirFiles: [],
            delPath: null,
            filelistString: null,
        }
    }

    listDirFiles(files, rootDir) {
        const prepRoot = `/${rootDir}${this.state.currentPath}`

        const pathEscaped = `${prepRoot.split("/").join("/")}`

        const r = new RegExp(`^${pathEscaped}[^/]+$`)

        return Object.keys(files).filter(key => r.test(key))
    }

    initDirFiles(){
        const files = normalizeFiles({}, '/', this.props.fileList)
        const dirFiles = this.listDirFiles(files, this.props.fileList.name)
        this.setState({
            files,
            rootDir: this.props.fileList.name,
            dirFiles,
        })
    }

    componentDidUpdate(prevProps, prevState) {

        if(this.props.fileList !== undefined && this.state.filelistString === null){
            this.setState({filelistString: JSON.stringify(this.props.fileList)})
            this.initDirFiles()
        } else if (this.props.fileList !== undefined && this.state.filelistString !== null && JSON.stringify(this.props.fileList) !== this.state.filelistString){
            this.setState({currentPath: "/", filelistString: JSON.stringify(this.props.fileList)})
            this.initDirFiles()            
        }

        if (
            this.state.files !== null &&
            this.state.currentPath !== prevState.currentPath
        ) {
            const dirFiles = this.listDirFiles(
                this.state.files,
                this.props.fileList.name
            )
            this.setState({ dirFiles })
        }

        // close download modal after download completed
        if(prevProps.DSReqProgStatus && prevProps.DSReqProgStatus.status === 'sending'
        && this.props.DSReqProgStatus && this.props.DSReqProgStatus.status === null) {
            this.modalDwnlRef.current.hideModal()
        }
    }

    getCurrentPath() {
        return `/${this.state.rootDir}${this.state.currentPath}`
    }

    getCurrentFilePath(name) {
        const path = `${this.state.currentPath}${name}`
        return `/${this.state.rootDir}${path}`
    }

    getParentDirPath() {
        if (this.state.currentPath === "/") return "/"
        const splittedPath = this.state.currentPath.split("/")
        return `${splittedPath.slice(0, splittedPath.length - 2).join("/")}/`
    }

    gotoParentDir() {
        if (this.state.currentPath !== "/") {
            this.setState({ currentPath: this.getParentDirPath() })
        }
    }

    gotoChildDir(dirname) {
        const path = `${this.state.currentPath}${dirname}`
        const pathWRoot = `/${this.state.rootDir}${path}`

        if (
            this.state.files[pathWRoot] &&
            this.state.files[pathWRoot].type === "directory"
        ) {
            this.setState({ currentPath: `${path}/` })
        }
    }

    getExt(name) {
        const flNameSplitted = name.split(".")
        return flNameSplitted.length > 1
            ? flNameSplitted[flNameSplitted.length - 1]
            : ""
    }

    isSupportedImage(name) {
        const ext = this.getExt(name)
        return [
            "gif",
            "jpg",
            "jpeg",
            "jfif",
            "pjpeg",
            "pjp",
            "png",
            "svg",
            "webp",
        ].includes(ext)
    }

    getDirLinkOrFileView(file) {
        if (!this.props.selectFolder && file.type === "directory") {
            return (
                <button
                    className="btn btn-link"
                    onClick={() => this.gotoChildDir(file.name)}>
                    <span className="white d-inline-flex mr-1">
                        <i className="tim-icons icon-tag"></i>
                    </span>{" "}
                    {file.name}
                </button>
            )
        } else if (this.props.selectFolder && file.type === "directory") {
            return (
                <>
                    <button
                        className="btn btn-link"
                        onClick={() => this.gotoChildDir(file.name)}>
                        <span className="white d-inline-flex mr-1">
                            <i className="tim-icons icon-tag"></i>
                        </span>{" "}
                        {file.name}
                    </button>
                    <button
                        className="btn btn-success btn-simple"
                        alt="Select"
                        onClick={()=>
                            this.props.onSelectAction(this.state.currentPath, `${file.name}/`)
                        }>Select folder</button>
                </>
            )
        } else if (!this.props.selectMode && this.isSupportedImage(file.name)) {
            return (
                <button
                    type="button"
                    className="btn btn-link imageLink"
                    cy={
                        "dataset-filelist-btn-view-item-" +
                        this.getCurrentPath()
                    }
                    onClick={() =>
                        this.props.displayImage(
                            encodeURIComponent(this.props.location.internalID),
                            this.props.location.access,
                            this.props.location.project,
                            `${this.state.currentPath}${file.name}`,
                            this.props.location.zone,
                            true,
                            9 * 60
                        )
                    }>
                    <span className="white d-inline-flex mr-1">
                        <i className="tim-icons icon-image-02"></i>
                    </span>{" "}
                    {file.name}
                </button>
            )
        } else if (!this.props.selectMode && file.size <= config.maxEditableSize) {
            return (
                <button
                    className="btn btn-link editorLink"
                    onClick={() =>
                        this.props.gotoRoute(ROUTE_DATA_SETS_EDITOR_FILE, {
                            internalID: encodeURIComponent(
                                this.props.location.internalID
                            ),
                            dsPath: encodeURIComponent(this.state.currentPath),
                            fileName: encodeURIComponent(file.name),
                            access: this.props.location.access,
                            project: encodeURIComponent(this.props.location.project),
                            zone: this.props.location.zone,
                        })
                    }>
                    <span className="white d-inline-flex mr-1">
                        <i className="tim-icons icon-caps-small"></i>
                    </span>{" "}
                    {file.name}
                </button>
            )
        } else if( this.props.selectMode && this.props.selectFiles ) {
            return (
                <>
                    <span className="white d-inline-flex mr-1">
                        <i className="tim-icons icon-single-copy-04"></i>
                    </span>{" "}
                    {file.name}
                    <button
                        className="btn btn-success btn-simple ml-1"
                        alt="Select"
                        onClick={()=>
                            this.props.onSelectAction(this.state.currentPath, file.name)
                        }>Select file</button>
                </>
            )
        }
        return (
            <span>
                <span className="white d-inline-flex mr-1">
                    <i className="tim-icons icon-single-copy-04"></i>
                </span>{" "}
                {file.name}
            </span>
        )
    }
    render() {
        return (
            <>
                <div className="table-responsive"></div>
                <table
                    className="datasetFilelist table table-striped table-hover"
                    cy="dataset-filelist-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Creation time</th>
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/**
                     * Handle warning if no read permissions or display loading
                     */}
                        {this.props.hasReadPermissions !== false
                    && (this.props.hasReadPermissions === null || this.props.fileList === undefined) &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div
                                    className="spinner-border text-light ml-2"
                                    role="status"
                                    style={{ margin: "3rem auto" }}></div>
                            </td>
                        </tr>}
                        {this.props.hasReadPermissions === false && 
                        <tr>
                            <td colSpan="4" className="text-center">
                                <h3>Sorry, you don&apos;t have enough permissions to see dataset files :-(</h3>
                            </td>
                        </tr>}
                        {this.props.hasReadPermissions && this.props.fileList && (
                            <>
                                {this.state.currentPath !== '/' && (
                                    <tr>
                                        <td colSpan="6" className="parentDir">
                                            <button
                                                className="btn btn-link px-8 px-1"
                                                type="button"
                                                onClick={() => this.gotoParentDir()}
                                            >
                                        ..
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                {this.state.dirFiles.map((filePath)=> {
                                    const file = this.state.files[filePath]
                                    return (
                                        <tr key={filePath}>
                                            <td className="name">
                                                {this.getDirLinkOrFileView(file)}
                                            </td>
                                            <td>{file.type === 'directory' ? '' : this.getExt(file.name)}</td>
                                            <td>{file.type === 'directory' ? '' : moment(file.create_time).local().format('Do of MMM YYYY HH:mm:ss') }</td>
                                            <td>{file.type === 'directory' ? '' : displayShortBiSize(file.size)}</td>
                                            <td className="action-buttons">
                                                { !this.props.selectMode && this.props.isMutable && <CheckFineWritePermsComp prjID={this.props.location.project} type="dat_short">
                                                    {this.props.isDatasetPublic || this.props.hasDatasetPid
                                                        ? null
                                                        : <button
                                                            type="button"
                                                            className="btn btn-link"
                                                            variant="link"
                                                            cy={
                                                                "dataset-filelist-btn-delete-item-" +
                                                this.getCurrentFilePath(
                                                    file.name
                                                )
                                                            }
                                                            onClick={() => {
                                                                const path = this.getCurrentFilePath(file.name)
                                                                const pathSliced = path.split('/')
                                                                const rightPath = [pathSliced[0],...pathSliced.slice(2,pathSliced.length)].join('/')
                                                                const accFn = () => this.props.removeAction(
                                                                    this.props.location.internalID,
                                                                    this.props.location.access,
                                                                    this.props.location.project,
                                                                    rightPath.slice(1, rightPath.length),
                                                                    this.props.location.zone
                                                                )
                                                                this.modalDelRef.current.showModal(
                                                                    accFn,
                                                                    undefined
                                                                )
                                                                this.setState({
                                                                    delPath: rightPath
                                                                })
                                                            }
                                                            }>
                                            Delete
                                                        </button>}
                                                </CheckFineWritePermsComp>}
                                                {!this.props.selectMode && <button
                                                    type="button"
                                                    className="btn btn-link"
                                                    variant="link"
                                                    cy={
                                                        "dataset-filelist-btn-download-item-" +
                                            this.getCurrentFilePath(
                                                file.name
                                            )
                                                    }
                                                    onClick={() => {
                                                        this.modalDwnlRef.current.showModal()
                                                        this.props.loadFile(
                                                            this.props.location.internalID,
                                                            this.props.location.access,
                                                            this.props.location.project,
                                                            this.state.currentPath,
                                                            this.props.location.zone,
                                                            file.name,
                                                            file.type === "directory",
                                                            file.type === "directory"
                                                        )
                                                    }}>
                                        Download
                                                </button>}                                        
                                            </td>
                                        </tr>
                                    )})}
                            </>)
                        }
                    </tbody>
                </table>
                <DSModal
                    ref={this.modalDelRef}
                    headerTitle="Are you sure?"
                    acceptTitle="Delete"
                    onClose={()=> this.setState({delPath: null})}
                >
                    <h4 className="text-dark">Deletion of:</h4>
                    {this.state.delPath
                    && <pre className="text-warning">{this.state.delPath}</pre>}
                </DSModal>
                <DSModal
                    ref={this.modalDwnlRef}
                    headerTitle="DOWNLOAD"
                    contentClassName="darkModal"
                    titleClassName="titleDSFieldBody"
                    alert
                >
                    <h4>Downloading</h4>
                    {this.props.DSReqProgStatus && <HandleDownload
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
                    />}
                </DSModal>
            </>
        )
    }
}
export default fileListTable
