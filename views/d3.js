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

        var parseTime = d3.timeParse("%d-%b-%y");

        var x = d3.scaleTime()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        var svg = d3.select("#d3Container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.tsv("https://gist.githubusercontent.com/mbostock/02d893e3486c70c4475f/raw/26cf20290389430baed71bf36be44faf7dda6d8d/data.tsv", type, function(error, data) {
            if (error) throw error;

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain(d3.extent(data, function(d) { return d.close; }));

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

        function type(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            return d;
        }
    }
}