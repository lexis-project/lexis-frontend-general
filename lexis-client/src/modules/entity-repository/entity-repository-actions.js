import { createActions } from "reduxsauce"

export default createActions(
    {
        repositoryHasChanged: ["repository"],
    },
    { prefix: "ENTITY_REPOSITORY/" }
)
