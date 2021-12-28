export function validateWFTUploadFragment(values) {
    const errors = { workflowTemplate: {} }
    if (values.workflowTemplate) {
        const wftfile = values.workflowTemplate.file[0]
        if (wftfile && wftfile.type !== "application/zip") {
            errors.workflowTemplate.file = "Must be zip file"
        }
    }
    return errors
}
