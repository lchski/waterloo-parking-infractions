const html = require('choo/html')
const d3 = require('d3')

module.exports = (state, prev, send) => {
    return html`
<div onload=${runD3} id="d3Container">
    
</div>
    `

    function runD3() {
        var stylesLink = document.createElement("link")

        stylesLink.type = "text/css"
        stylesLink.rel = "stylesheet"
        stylesLink.href = "./style.css"

        document.head.appendChild(stylesLink)

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%Y");

        var x = d3.scaleTime()
            .domain([new Date(2005, 0, 1), new Date(2016, 8, 1)])
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var bar = d3.line()
            .x(function(d) { return x(d3.isoParse(d.ISSUEDATE)); })
            .y(function(d) { return y(d.VIOFINE); });

        var svg = d3.select("#d3Container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        console.log('heyy');

        d3.json("./acadia_crt.json", function(error, data) {
            if (error) throw error;

            let coercedData = d3.nest()
                .key((d) => { return d.ISSUEDATE.substring(0, 4) })
                .rollup((d) => { return d.length })
                .entries(data);

            console.log(coercedData);

            x.domain(d3.extent(data, function(d) { return d3.isoParse(d.ISSUEDATE); }));
            y.domain(d3.extent(data, function(d) { return d.VIOFINE; }));

            svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        });
    }
}