import React from "react"

export const prevUploadInfo = (prevRes, username, gotoRoute, tus) => (
    <>
        {prevRes !== undefined && (
            <>
                {prevRes.internalID === undefined &&
                    prevRes.message !== undefined && (
                    <p>Previous upload: {prevRes.message}</p>
                )}
                {prevRes.internalID === undefined &&
                    prevRes.access !== undefined && (
                    <p>
                            Access: {prevRes.access}, Project: {prevRes.project}
                    </p>
                )}
            </>
        )}
        {tus !== undefined && Object.keys(tus).length !== 0 && (
            <ul>
                {Object.keys(tus).map(e => (
                    <li key={tus[e].id + ".file"}>
                        File: {tus[e]["filename"]}
                        <ul>
                            <li key={tus[e].id + ".message"}>
                                {tus[e]["message"]}
                            </li>
                            <li key={tus[e].id + ".progress"}>
                                Progress: {tus[e]["item"]["completed"]}%
                            </li>
                            <li key={tus[e].id + ".access"}>
                                Access: {tus[e]["access"]}
                            </li>
                            <li key={tus[e].id + ".project"}>
                                Project: {tus[e]["project"]}
                            </li>
                        </ul>
                    </li>
                ))}
            </ul>
        )}
    </>
)
