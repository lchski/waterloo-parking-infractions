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

        var parseTime = d3.utcParse("%H:%M"),
            midnight = parseTime("00:00");

        var x = d3.scaleUtc()
            .domain([midnight, d3.utcDay.offset(midnight, 1)])
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var svg = d3.select("#d3Container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        d3.csv("./aggregate_infraction_time.csv", type, function(error, data) {
            if (error) throw error;

            y.domain([0, d3.max(data, function(d) { return d.rate; })]);

            svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x)
                    .tickFormat(d3.utcFormat("%I %p")));

            svg.append("g")
                .attr("class", "dots")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("transform", function(d) { return "translate(" + x(d.time) + "," + y(d.rate) + ")"; })
                .attr("d", d3.symbol()
                    .size(40));

            var tick = svg.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y)
                    .tickSize(-width))
                .select(".tick:last-of-type");

            var title = tick.append("text")
                .attr("dy", ".32em")
                .text("tweets per hour");

            tick.select("line")
                .attr("x1", title.node().getBBox().width + 6);
        });

        function type(d) {
            d.rate = +d.count;
            d.time = parseTime(d.time);
            d.time.setUTCHours((d.time.getUTCHours() + 24 - 7) % 24);
            return d;
        }
    }
}