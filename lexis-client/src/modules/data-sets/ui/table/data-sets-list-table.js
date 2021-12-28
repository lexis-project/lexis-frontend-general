import React from "react"
import DataTable, { createTheme } from "react-data-table-component"
import { connect } from "react-redux"
import { actions as actionsRouter } from "redux-router5"

import { ButtonGoToDetail } from "./button-go-to-detail"
// import { ProjectButton } from "../data-sets-project-button";
import { NoDataComponent } from "./no-data-component"
import { FilterEach } from "./filter-each"

// HOWTO creating own table themes, more info: https://github.com/jbetancur/react-data-table-component#defining-your-own-theme-using-createtheme ; esp. refer to themes.js what can be done (https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/themes.js)
createTheme("blackdashboard", {
    text: {
        primary: "rgba(255, 255, 255, 0.8)",
        secondary: "rgba(255, 255, 255, 1)",
    },
    background: {
        default: "#27293d",
    },
    header: {
        style: {
            minHeight: "56px",
        },
    },
    headRow: {
        style: {
            borderTopStyle: "solid",
            borderTopWidth: "1px",
        },
    },
    headCells: {
        style: {
            "&:not(:last-of-type)": {
                borderRightStyle: "solid",
                borderRightWidth: "1px",
            },
        },
    },
    cells: {
        style: {
            width: "250px",
            paddingLeft: "8px",
        },
    },
})

function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    };
}

export function getFlag(dataset, flagName){
    if(dataset && dataset.flags && dataset.flags[flagName]){
        return dataset.flags[flagName]
    }
    return 'N/A'
}

// HOWTO just an example how can be dispatching actions with Redux etc done
const handleChange = state => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
}

const TableImpl = ({ datasets, projects, gotoRoute }) => {
    let data = datasets.map(dataset => {
        return {
            id: dataset.location.internalID,
            title: dataset.metadata.title,
            access: dataset.location.access,
            project: dataset.location.project,
            owner: dataset.metadata.owner
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            doi: dataset.metadata.identifier,
            publicationYear: dataset.metadata.publicationYear,
            creator: dataset.metadata.creator
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            alternateIdentifier: dataset.metadata.AlternateIdentifier.reduce(
                (acc, currentVal) => acc.concat(currentVal),
                []
            ).join(", "),
            contributor: dataset.metadata.contributor
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            publisher: dataset.metadata.publisher
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            relatedIdentifier: dataset.metadata.relatedIdentifier
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            resourceType: dataset.metadata.resourceType,
            rights: dataset.metadata.rights
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            rightsIdentifier: dataset.metadata.rightsIdentifier
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            rightsURI: dataset.metadata.rightsURI
                .reduce((acc, currentVal) => acc.concat(currentVal), [])
                .join(", "),
            eudatFixedContent: dataset.eudat["EUDAT/FIXED_CONTENT"],
            pid: dataset.eudat.PID,
            encryption: getFlag(dataset, 'encryption'),
            compression: getFlag(dataset, 'compression'),
            replicated: dataset['__replicas'] ? 'yes' : 'no'
        }
    })

    const [x, setWidth] = React.useState({ 
        x: window.innerWidth
    })

    React.useEffect(() => {
        const debouncHandleResize = debounce(function handleResize() {
            setWidth({
                width: window.innerWidth
            })
        }, 400)

        window.addEventListener("resize", debouncHandleResize)
        
        return _ => {
            window.removeEventListener('resize', debouncHandleResize)  
        }
    })
    
    let tableWidth = x.width - 340
    const columnSizes = [500, 200, 125, 175, 200, 150, 175]
    const columnSizesSum = columnSizes.reduce((acc, currentVal) => acc + currentVal, 0)
    const columnRatios = columnSizes.map((item) => item / columnSizesSum)

    const columns = React.useMemo(
        () => [
            {
                name: "Title",
                selector: "title",
                sortable: true,
                cell: row => (
                    <ButtonGoToDetail
                        name={row.title}
                        id={row.id}
                        className="text-left" 
                        cy="dataset-table-titles"
                    />
                ),
                width: `${columnRatios[0] * tableWidth}px` // "500px",
            },
            {
                name: "Project",
                selector: "project",
                sortable: true,
                cell: row => <span title={row.project}>{row.project}</span>,
                width: `${columnRatios[1] * tableWidth}px`,
            },
            {
                name: "Access",
                selector: "access",
                sortable: true,
                cell: row => <span title={row.access}>{row.access}</span>,
                width: `${columnRatios[2] * tableWidth}px` // "125px",
            },
            {
                name: "Publication Year",
                selector: "publicationYear",
                sortable: true,
                cell: row => (
                    <span title={row.publicationYear}>
                        {row.publicationYear}
                    </span>
                ),
                width: `${columnRatios[3] * tableWidth}px` // "175px",
            },
            {
                name: "Creator",
                selector: "creator",
                sortable: true,
                cell: row => <span title={row.creator}>{row.creator}</span>,
                width: `${columnRatios[4] * tableWidth}px` // "200px",
            },
            {
                name: "Encryption",
                selector: "encryption",
                sortable: false,
                cell: row => <span title={row.encryption}>{row.encryption}</span>,
                width: `${columnRatios[5] * tableWidth}px` // "150px"
            },
            {
                name: "Compression",
                selector: "compression",
                sortable: false,
                cell: row => <span title={row.compression}>{row.compression}</span>,
                width: `${columnRatios[6] * tableWidth}px` // "177px"
            },
            {
                name: "Replicated",
                selector: "replicated",
                sortable: false,
                cell: row => <span title={row.title}>{row.replicated}</span>,
                width: `${columnRatios[7] * tableWidth}px`
            },
            // {
            //     name: "Id",
            //     selector: "id",
            //     sortable: true,
            //     cell: row => <span title={row.id}>{row.id}</span>,
            //     hide: 2600
            // },
        ],
        [columnRatios, tableWidth]
    );

    const [filterTitles, setfilterTitles] = React.useState("")
    const filteredTitles = data.filter(
        item =>
            item.title &&
            item.title.toLowerCase().includes(filterTitles.toLowerCase())
    )

    const labelTitles = "Title"
    const FilterTitles = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterTitles(e.target.value)}
                filterText={filterTitles}
                columns={columns}
                label={labelTitles}
                key={labelTitles.toLowerCase().replace(" ", "_")}
                id={labelTitles.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[0] * tableWidth}
            />
        )
    }, [filterTitles, columnRatios, tableWidth, columns, labelTitles])

    const [filterProject, setfilterProject] = React.useState("")
    const filteredProject = data.filter(
        item =>
            item.project &&
            item.project.toLowerCase().includes(filterProject.toLowerCase())
    )

    const labelProject = "Project"
    const FilterProject = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterProject(e.target.value)}
                filterText={filterProject}
                columns={columns}
                label={labelProject}
                key={labelProject.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[1] * tableWidth}
            />
        )
    }, [filterProject, columnRatios, tableWidth, columns, labelProject])

    const [filterAccess, setfilterAccess] = React.useState("")
    const filteredAccess = data.filter(
        item =>
            item.access &&
            item.access.toLowerCase().includes(filterAccess.toLowerCase())
    )

    const labelAccess = "Access"
    const FilterAccess = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterAccess(e.target.value)}
                filterText={filterAccess}
                columns={columns}
                label={labelAccess}
                key={labelAccess.toLowerCase().replace(" ", "_")}
                id={labelAccess.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[2] * tableWidth}
            />
        )
    }, [filterAccess, columnRatios, tableWidth, columns, labelAccess])

    const [filterPublicationYear, setfilterPublicationYear] = React.useState("")
    const filteredPublicationYear = data.filter(
        item =>
            item.publicationYear &&
            item.publicationYear
                .toLowerCase()
                .includes(filterPublicationYear.toLowerCase())
    )

    const labelPublicationYear = "Publication Year"
    const FilterPublicationYear = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterPublicationYear(e.target.value)}
                filterText={filterPublicationYear}
                columns={columns}
                label={labelPublicationYear}
                key={labelPublicationYear.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[3] * tableWidth}
            />
        )
    }, [
        filterPublicationYear,
        columnRatios, tableWidth, columns,
        labelPublicationYear,
    ])

    const [filterCreator, setfilterCreator] = React.useState("")
    const filteredCreator = data.filter(
        item =>
            item.creator &&
            item.creator.toLowerCase().includes(filterCreator.toLowerCase())
    )

    const labelCreator = "Creator"
    const FilterCreator = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterCreator(e.target.value)}
                filterText={filterCreator}
                columns={columns}
                label={labelCreator}
                key={labelCreator.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[4] * tableWidth}
            />
        )
    }, [filterCreator, columnRatios, tableWidth, columns, labelCreator])

    const [filterFlagEncrytion, setfilterFlagEncrytion] = React.useState("")
    const filteredFlagEncrytion = data.filter(
        item =>
            item.encryption &&
            item.encryption.toLowerCase().includes(filterFlagEncrytion.toLowerCase())
    )

    const labelFlagEncryption = "Encryption"
    const FilterFlagEncryption = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterFlagEncrytion(e.target.value)}
                filterText={filterFlagEncrytion}
                columns={columns}
                label={labelFlagEncryption}
                key={labelFlagEncryption.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[5] * tableWidth}
            />
        )
    }, [filterFlagEncrytion, columnRatios, tableWidth, columns, labelFlagEncryption])

    const [filterFlagCompression, setfilterFlagCompression] = React.useState("")
    const filteredFlagCompression = data.filter(
        item =>
            item.compression &&
            item.compression.toLowerCase().includes(filterFlagCompression.toLowerCase())
    )

    const labelFlagCompression = "Compression"
    const FilterFlagCompression = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterFlagCompression(e.target.value)}
                filterText={filterFlagCompression}
                columns={columns}
                label={labelFlagCompression}
                key={labelFlagCompression.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[6] * tableWidth}
            />
        )
    }, [filterFlagCompression, columnRatios, tableWidth, columns, labelFlagCompression])

    const [filterReplicated, setfilterReplicated] = React.useState("")
    const filteredReplicated = data.filter(
        item =>
            item.replicated.toLowerCase().includes(filterReplicated.toLowerCase())
    )
    const labelReplicated = "Replicated"
    const FilterReplicated = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterReplicated(e.target.value)}
                filterText={filterReplicated}
                columns={columns}
                label={labelReplicated}
                key={labelReplicated.toLowerCase().replace(" ", "_")}
                colWidth={columnRatios[7] * tableWidth}
            />
        )
    }, [filterReplicated, columnRatios, tableWidth, columns, labelReplicated])

    const [filterId, setfilterId] = React.useState("");
    const filteredId = data.filter(
        item =>
            item.id && item.id.toLowerCase().includes(filterId.toLowerCase())
    )

    const labelId = "Id"
    const FilterId = React.useMemo(() => {
        return (
            <FilterEach
                onFilter={e => setfilterId(e.target.value)}
                filterText={filterId}
                columns={columns}
                label={labelId}
                key={labelId.toLowerCase().replace(" ", "_")}
                id={labelId.toLowerCase().replace(" ", "_")}
            />
        )
    }, [filterId, columns, labelId])

    let filteredItems = filteredId
    if (filterId.length > 0) {
        filteredItems = FilterId
    }
    if (filterTitles.length > 0) {
        filteredItems = filteredTitles
    }
    if (filterAccess.length > 0) {
        filteredItems = filteredAccess
    }
    if (filterProject.length > 0) {
        filteredItems = filteredProject
    }
    if (filterPublicationYear.length > 0) {
        filteredItems = filteredPublicationYear
    }
    if (filterCreator.length > 0) {
        filteredItems = filteredCreator
    }

    if (filterFlagEncrytion.length > 0) {
        filteredItems = filteredFlagEncrytion
    }
    if (filterFlagCompression.length > 0) {
        filteredItems = filteredFlagCompression
    }
    if (filterReplicated.length > 0) {
        filteredItems = filteredReplicated
    }

    return (
        <div>
            <DataTable
                className="rdt_Fix"
                columns={columns}
                data={filteredItems}
                onSelectedRowsChange={handleChange}
                theme="blackdashboard"
                pagination={true}
                fixedHeader={false}
                actions={[
                    FilterTitles,
                    FilterProject,
                    FilterAccess,
                    FilterPublicationYear,
                    FilterCreator,
                    FilterFlagEncryption,
                    FilterFlagCompression,
                    FilterReplicated
                ]}
                noTableHead={true}
                persistTableHead={true}
                noDataComponent={
                    <NoDataComponent data={data} columns={columns} />
                }
                allowOverflow={true}
            />
        </div>
    )
}

const mapDispatchToProps = {
    gotoRoute: actionsRouter.navigateTo,
}

export const DataSetListTable = connect(null, mapDispatchToProps)(TableImpl)
