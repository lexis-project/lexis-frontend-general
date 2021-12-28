import { createSelector } from "reselect"
import { getComputerResources as getComputerResourcesState } from "../../root/root-selectors"
import { getComputerResources as getComputerResourcesER } from "../../entity-repository/entity-repository-selectors"

export const getComputerResources = createSelector(
    getComputerResourcesState,
    getComputerResourcesER,
    (state, entityRepo) => state.list.map(id => entityRepo[id])
)
