import React from "react"

export const valOrZero = (val)=>val?val:0

/**
 * loads string from object by key or return loading
 * @param {{}} obj
 * @param {String} key
 * @returns {String}
 */
export const loadStringOrLoading = (obj, ...keys) => {
    if (obj === undefined || obj[keys[0]] === undefined) {
        return (
            <span className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
            </span>
        )
    }
    if (keys.length === 1) {
        return obj[keys[0]]
    } else {
        return loadStringOrLoading(obj[keys[0]], ...keys.slice(1, keys.length))
    }
}

/**
 * convert Bytes to "bi" units (kibibyte, mebibyte etc.)
 * @param {Number} size
 */
export const displayShortBiSize = (size) => {
    const defBase = 1024
    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    if(size === 0) return "0 B"
    for (let exp = 0, base = 1; exp < 9; base = defBase**++exp) {
        if ((size / base) < 1){
            base=defBase**--exp
            const compSize = (size / base)
            if(compSize.toFixed(2) - Math.trunc(compSize) === 0.00){
                return `${Math.trunc(compSize)} ${units[exp]}`
            }
            else {
                return `${compSize.toFixed(2)} ${units[exp]}`
            }
        }
    }
}

export const displayShortTime = (seconds) => {
    if(!seconds) return "- s"
    let secs = Math.trunc(seconds)
    let mins = Math.trunc(seconds / 60)
    let hours = Math.trunc(mins / 24)

    if(mins === 0 === hours){
        return `${secs} s`
    } else if(hours === 0){
        secs-=mins*60
        return `${mins} min ${secs} s`
    } else {
        mins-=hours*24
        secs-=mins*60+hours*24*60
        return `${hours} h ${mins} min ${secs} s`
    }
}

/**
 * 
 * @param {string} internalID 
 * @param {string} dsPath 
 * @param {string} fileName 
 * @param {string} project 
 * @param {string} zone 
 * @returns
 */
export function getFileID(internalID, dsPath, fileName, project, zone){
    const supportsCrypto = crypto && crypto.subtle
    if(supportsCrypto){
        const textEncoder = new TextEncoder()
        const idString = textEncoder.encode(`${internalID}---${dsPath}---${fileName}---${project}---${zone}`)
        return crypto.subtle.digest(
            "SHA-256",
            idString
        ).then((id) => {
            const idHex = `dsFileEditor::${Buffer.from(id).toString('hex')}`
            return new Promise((resolve)=> resolve(idHex))
        })
    }else{
        const idBase64 = `dsFileEditor::${encodeURIComponent(`${internalID}---${dsPath}---${fileName}---${project}---${zone}`)}`
        return new Promise((resolve) => resolve(idBase64))
    }
}
/**
 * 
 * @param {number} inputSize 
 * @returns {number} size in Bytes
 */
export function predictSizeOfbase64(inputSize){
    const codeSize    = ((inputSize * 4) / 3)
    const paddingSize = (inputSize % 3) ? (3 - (inputSize % 3)) : 0
    const crlfsSize   = 2 + (2 * (codeSize + paddingSize) / 72)
    const predictedSize   = codeSize + paddingSize + crlfsSize
    return predictedSize
}
/**
 * 
 * @param {string} path 
 * @returns {string}
 */
export function normalizeTargetPath(path){
    return path.startsWith('/') ? path.slice(1) : path
}

export function getInitValue(rootObj, ...keys){
    if (rootObj === null || rootObj === undefined ) return null
    let val = rootObj
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if ( val instanceof Object && Object.keys(val).includes(key) ) {
            val = val[key]
        }else return null
    }
    return val
}