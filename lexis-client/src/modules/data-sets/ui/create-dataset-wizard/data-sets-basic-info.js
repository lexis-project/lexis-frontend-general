import React from "react"
import { connect } from "react-redux"

import DsBasicInfoForm from "./data-sets-basic-form";

export const DsBasicInfoImpl = ({ nextPage }) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <h3>Fill-in basic information about the data set:</h3>
                </div>
            </div>
    
            <DsBasicInfoForm form="dsCreateWizard" onSubmit={nextPage} />
        </>
    )}
const mapDispatchToProps = {
}

export default connect(null, mapDispatchToProps)(DsBasicInfoImpl)