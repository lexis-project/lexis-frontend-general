/**
 * Code to safe a blob to disk
 *
 * @param {Blob} blob - The blob to be saved to disk
 * @param {string} path - The path of the blob (in DDI).
 * @returns {string} Message indicating the file is being saved to disk
 */

export function performFileDownload(blob, path) {
    const a = document.createElement("a")
    document.body.appendChild(a)
    const url = window.URL.createObjectURL(blob)
    a.href = url
    const name = path.substr(path.lastIndexOf("/") + 1)

    a.download = name
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    return "Saving to disk: " + name
}

/**
 * Code to safe a blob to disk (the blob is a zip file)
 *
 * @param {Blob} blob - The blob to be saved to disk
 * @param {string} internalID - The internalID of a dataset
 * @param {string} path - The path of the blob (in DDI); optional.
 * @returns {string} Message indicating the zip is being saved to disk
 */

export function performDownload(blob, internalID, path) {
    const a = document.createElement("a")
    document.body.appendChild(a)
    const url = window.URL.createObjectURL(blob)
    a.href = url
    let name
    if (path === undefined) name = internalID
    else name = path.substr(path.lastIndexOf("/") + 1)

    a.download = name + ".zip"
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    return "Saving to disk: " + name + ".zip"
}
