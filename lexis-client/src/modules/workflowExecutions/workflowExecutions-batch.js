export const SEPARATOR = ","
export const ROW_SEPARATOR = "\n"

function generateCSVTemplate(inputParams) {
    const inputParamsObj = inputParams.reduce(
        (prev, current) => ({ ...prev, [current.inputParamName]: current }),
        {}
    )
    let csvContent = Object.keys(inputParamsObj).reduce(
        (prev, current) => `${prev}${current}${SEPARATOR}`,
        ""
    )
    csvContent = `${csvContent.slice(0, csvContent.length - 1)}${ROW_SEPARATOR}`
    let defInputLine = []
    for (let i = 0; i < Object.keys(inputParamsObj).length; i++) {
        const paramName = Object.keys(inputParamsObj)[i]
        const inputParam = inputParamsObj[paramName]
        if (inputParam.inputParamDefaultValue !== "<nil>") {
            defInputLine.push([inputParam.inputParamDefaultValue])
        }
    }
    defInputLine = defInputLine.join(SEPARATOR)
    csvContent += defInputLine + ROW_SEPARATOR
    const csvFile = new Blob([csvContent], { type: "text/csv" })
    return csvFile
}

export function downloadCSVTemplate(wfName, inputParams) {
    const csvFile = generateCSVTemplate(inputParams)
    let link = document.createElement("a")
    link.download = `${wfName}.csv`
    link.href = URL.createObjectURL(csvFile)
    link.click()

    URL.revokeObjectURL(link.href)
}
