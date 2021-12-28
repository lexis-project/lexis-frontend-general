import { createActions } from "reduxsauce"

// keys of object passed in will become keys/values of the Types
// after being converted to SCREAMING_SNAKE_CASE
export default createActions(
    {
        sidebarToggle: ["sidebarState"], // { type: 'INTERACTIVE_STYLE_SIDEBAR_TOGGLE', sidebarState: "fixed" | "mini" }
        sidebarMiniExpand: ["sidebarMiniState"], // { type: 'INTERACTIVE_STYLE_SIDEBAR_MINI_EXPAND', sidebarMiniState: "expanded" | "shortened" }
        sidebarShow: null, // { type: 'INTERACTIVE_STYLE_SIDEBAR_SHOW' }
        saveDatasetSize: ["dsSize"], // { type: 'INTERACTIVE_STYLE_SAVE_DATASET_SIZE' , dsSize: "XYZ" }
    },
    {
        prefix: "INTERACTIVE_STYLE_", // prepend the `INTERACTIVE_STYLE_` string to all created types
    }
)
