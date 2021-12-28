import React from "react"
import { connect } from "react-redux"

import DSMetadataForm from "./data-sets-metadata-form";

const DsMetadataImpl = ({ nextPage }) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <h3>Fill-in data set metadata:</h3>
                </div>
            </div>
    
            <DSMetadataForm form="dsCreateWizard" nextPage={nextPage} />
        </>
    )}

export default connect(null, null)(DsMetadataImpl)