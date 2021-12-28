import React from "react"
import { connect } from "react-redux"
import Actions from "../data-sets-actions"

import { getDataSetLocation } from "../data-sets-selectors"
import { getUserName } from "../../auth/auth-selectors"
import config from "../../../config"

import { stagePath } from "../data-sets-utils"

const DataSizeImpl = ({
    location,
    username,
    requestDSSize,
}) => {
    return (
        <>
            <button
                type="button"
                className="btn btn-info btn-simple mr-2 ml-2"
                cy="datasets-filelist-datasize-update-btn"
                disabled={!location || !username}
                onClick={() =>
                    requestDSSize(
                        config.DSzonesToiRODSzones[location.zone],
                        stagePath(location, username)
                    )
                }>
            Check size of dataset
            </button>
        </>
    )}

const mapStateToProps = state => ({
    location: getDataSetLocation(state),
    username: getUserName(state),
})

const mapDispatchToProps = {
    requestDSSize: Actions.Creators.requestDataSize,
}

export const DataSize = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSizeImpl)
