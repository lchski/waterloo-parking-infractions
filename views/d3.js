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

        var x = d3.scaleTime()
            .domain([new Date(2005, 0, 1), new Date(2016, 8, 1)])
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var histogram = d3.histogram()
            .value(function(d) { return d3.isoParse(d.ISSUEDATE); })
            .domain(x.domain())
            .thresholds(x.ticks(d3.timeYear));

        var svg = d3.select("#d3Container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        d3.json("./acadia_crt.json", function(error, data) {
            if (error) throw error;

            let bins = histogram(data);

            y.domain([0, d3.max(bins, function(d) { return d.length; })]);

            var bar = svg.selectAll(".bar")
                .data(bins)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

            // svg.append("g")
            //     .attr("class", "axis axis--x")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(d3.axisBottom(x));
            //
            // svg.append("g")
            //     .attr("class", "axis axis--y")
            //     .call(d3.axisLeft(y))
            //     .append("text")
            //     .attr("class", "axis-title")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", 6)
            //     .attr("dy", ".71em")
            //     .style("text-anchor", "end")
            //     .text("Price ($)");
            //
            // svg.append("path")
            //     .datum(data)
            //     .attr("class", "line")
            //     .attr("d", line);

            bar.append("rect")
                .attr("x", 1)
                .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
                .attr("height", function(d) { return height - y(d.length); });

            bar.append("text")
                .attr("dy", ".75em")
                .attr("y", 6)
                .attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
                .attr("text-anchor", "middle")
                .text(function(d) { return d.length; });
        });
    }
}