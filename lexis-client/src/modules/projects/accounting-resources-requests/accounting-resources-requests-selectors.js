import { createSelector } from "reselect"

import { getUsageAccountInfo as getUsageAccountInfoState } from "../../root/root-selectors"
import { getUsage as getUsageAccountInfoER } from "../../entity-repository/entity-repository-selectors"

export const getUsageAccountInfo = createSelector(
    getUsageAccountInfoState,
    getUsageAccountInfoER,
    (state, entityRepo) => entityRepo[state.ProjectID]
)

export const getUsageAccountHPCprojects = createSelector(
    getUsageAccountInfo,
    accountInfo => {
        let hpcProjects = accountInfo && accountInfo.HPCProjects
        return hpcProjects}
)

export const checkEmptyHPCProjects = createSelector(
    getUsageAccountHPCprojects,
    accountsHPCProjects =>
        accountsHPCProjects &&
        Array.isArray(accountsHPCProjects) &&
        accountsHPCProjects.length > 0
)

export const checkEmptyUsages = createSelector(
    getUsageAccountHPCprojects,
    accountsHPCProjects =>
        checkEmptyHPCProjects &&
        accountsHPCProjects &&
        accountsHPCProjects
            .map(el => Object.keys(el))
            .flat()
            .includes("AccountingData")
)

export const getUsageAccountsSum = createSelector(
    getUsageAccountHPCprojects,
    accountsHPCProjects => {
        // helper function safely checking for nullables
        const check = (path, o) =>
            path.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o)
        // iterate through account_info > HPCProjects > AccountingData and get usages
        const sumUsages =
            accountsHPCProjects &&
            accountsHPCProjects.map((hpcProjItem, hpcProjItemIdx) => {
                return hpcProjItem.AccountingData.map(
                    (accDataItem, accDataItemIdx) => {
                        if (
                            check(
                                [
                                    hpcProjItemIdx,
                                    "AccountingData",
                                    accDataItemIdx,
                                    "usage",
                                ],
                                accountsHPCProjects
                            )
                        ) {
                            return 0 + accDataItem.usage.inactive
                        } else {
                            return 0
                        }
                    }
                )
            })

        return (
            sumUsages &&
            sumUsages.flat().reduce((acc, currentVal) => acc + currentVal, 0)
        )
    }
)

export const getUsageAccountResourcesData = createSelector(
    getUsageAccountHPCprojects,
    hpcProjects => {        
        let result = hpcProjects && hpcProjects.map(hpcProject => {
            return hpcProject.AccountingData
        });
        result = result && result.flat()
        return result;
    }
)
