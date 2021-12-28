import React from "react";
import { connect } from "react-redux";
import { actions as routerActions } from "redux-router5";
import { ROUTE_DATA_SETS_CREATEWIZARD } from "../../../routing/routes";
import { getWizardActivePage } from "../../data-sets-selectors";
//import PropTypes from "prop-types";

import { DataSetsCreate1stPage } from "./data-sets-create-1stpage";
import { DataSetsCreate2ndPage } from "./data-sets-create-2ndpage";
import { DataSetsCreate3rdPage } from "./data-sets-create-3rdpage";

const DatasetsCreateWizardContainerImpl = ({
    activePage,
    gotoRoute
}) => {
    const goToWizardPage = (page) => gotoRoute(ROUTE_DATA_SETS_CREATEWIZARD,{activePage: page})
    return (
        <>
            <div className="col-12 mr-auto">
                {activePage === 1 && (
                    <DataSetsCreate1stPage goToWizardPage={goToWizardPage} />
                )}
                {activePage === 2 && (
                    <DataSetsCreate2ndPage
                        goToWizardPage={goToWizardPage}
                    />
                )}
                {activePage === 3 && (
                    <DataSetsCreate3rdPage
                        goToWizardPage={goToWizardPage}
                    />
                )}
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    activePage: getWizardActivePage(state)
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsCreateWizardContainerImpl);
