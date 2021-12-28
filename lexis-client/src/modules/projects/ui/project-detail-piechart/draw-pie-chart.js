import * as d3 from "d3"

const drawPieChart = (props, id) => {
    d3.select(`#vis-piechart-${id} > *`).remove()
    const margin = 80
    const width = props.width - margin
    const height = props.height - margin
    const radius = Math.min(width, height) / 2 - margin

    let svg = d3
        .select(`#vis-piechart-${id}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    const data = props.data

    // setup color: returns the corresponding color from the “Greens” sequential color scheme
    const colorSeq = d3
        .scaleSequential()
        .domain([0, data.length])
        .interpolator(d3.interpolateGreens)

    // calculate slices using `d3.pie` and `d3.arc()`
    const pie = d3
        .pie()
        .sort(null) // should keep data in the order they're defined
        .value(d => d.value)

    const dataPied = pie(data) // first value goes from 0 deg to x deg and so on...

    const arcGenerator = d3
        .arc() // shape helper to build arcs
        .innerRadius(0)
        .outerRadius(radius)

    // build the pie chart
    svg.selectAll("mySlices")
        .data(dataPied)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => colorSeq(d.index))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.8)

    // labels
    const labelOffset = radius * 1.3

    const arcLabel = d3.arc().innerRadius(labelOffset).outerRadius(labelOffset)

    const labels = svg
        .selectAll("text")
        .data(dataPied)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "1rem")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)

    labels
        .append("tspan")
        .attr("y", 0)
        .attr("x", 0)
        .text(d => `${d.data.name}`)
        .style("fill", "#fff")

    labels
        .append("tspan")
        .attr("y", 18)
        .attr("x", 0)
        .text(d => `${d.data.value.toLocaleString()}`)
        .style("font-size", "0.9rem")
        .style("fill", "#fff")
}

export default drawPieChart
