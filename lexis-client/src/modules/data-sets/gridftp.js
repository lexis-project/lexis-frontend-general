import React from "react"
import config from "../../config"
import { irodsPath } from "./data-sets-utils"


export const Gridftp = ({ location, username }) => (
    <>
        <p>GridFTP (via EUDAT B2STAGE) command to add files to this dataset:</p>
        <p>
            <code>
                globus-url-copy {"<source> "}
                {config.url.gridftp}
                {irodsPath(location, username)}
            </code>
        </p>
    </>
)

/**
 * Constructs a GridFTP path to a dataset
 * @param {object} location - Dataset location (access, project, internalID)
 * @param {string} username - the iRODS username
 * @param {string} path - Path within a dataset
 * @returns {string} the GridFTP path
 */

export const Gridftppath = ({ location, username, path }) => (
    <>
        <p>
            GridFTP (via EUDAT B2STAGE) command to add files to this dataset at
            this path:
        </p>
        <p>
            <code>
                globus-url-copy {"<source> "}
                {config.url.gridftp}
                {irodsPath(location, username) + "/" + path}
            </code>
        </p>
    </>
)
