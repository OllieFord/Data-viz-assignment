
const w = 550;
const h = 550;
const w2 = 230;
const h2 = 470;

var svg = d3.select("#graphic1")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("display", "block")
            .style("margin", "auto")

var svg2 = d3.select("#graphic2")
             .append("svg")
             .attr("width", w2)
             .attr("height", h2)
             .style("display", "block")
             .style("margin", "auto")

//var dataArray = [23, 13, 21, 14, 37, 15, 18, 34, 30];



var xscale = d3.scaleLinear() 
    .range([0, w])
    .domain([-15, 15])

var yscale = d3.scaleLinear() 
    .range([h, 0])
    .domain([-15, 15])

var colourScale = d3.scaleOrdinal(d3.schemeCategory10); 

var topics = [[0, 'Optimization algorithms'],
                [1, 'Neural network application'],
                [2, 'Reinforcement learning'],
                [3, 'Bayesian methods'],
                [4, 'Image recognition'],
                [5, 'Artificial neuron design'],
                [6, 'Graph theory'], 
                [7, 'Kernel methods']]

var legend = d3.select("#legend")
                .selectAll("div")
                .data(topics)
                .enter()
                .append("div")
                .classed("legendel", true)
                .style("display", "inline-block")
                .style("width", "245px")
                .style("padding-left", "10px")
                .style("padding-right", "10px")

legend.append("div")
        .style("width", "35px")
        .style("height", "20px")
        .style("background-color", function(d){
                return colourScale(d[0])
            })
        .style("display", "inline-block")
        .style("vertical-align", "middle")
        .style("border-radius", "3px")

        
legend.append("div").text(function(d){
            return d[1]
        })
        .style("display", "inline-block")
        .style("padding", "10px")


d3.csv("./embedding_data.csv", function(error, data){
    if (error) throw error
    data.forEach(function(d) {
        d.x = +d.x;
        d.y = +d.y;
        d.hue = +d.hue;
        d.year = +d.year;
    });

    for (var y=1987; y<=2016; y++){
        var label =  "year" + y
        svg.append("g").selectAll(label)
        .data(data.filter(function (element){return element.year == y}))
        .enter()
        .append("circle")
        .classed(label,true)
        .classed("hidden", true)
        .attr("cx", function(d) {
                return xscale(d.x);
            })
            .attr("cy", function(d) {
                return yscale(d.y);
            })
            .attr("r", function(d) {
                return 2;
            })
            .style("fill", function(d){
                return colourScale(d.hue)
            })
        
    }

var yCH = data
console.log(yCH[0])


    for (var y=1987; y<=2016; y++){
        var yearsContHue = d3.nest()
            .key(function(d) { return d.year; }).sortKeys(d3.ascending)
            .key(function(d) { return d.hue; })
            .rollup(function(v) { return v.length; })
            .entries(yCH);

        yearsContHue.forEach(function(values, i){
            values.values = values.values.sort(function(x, y){
                return d3.ascending(x.key, y.key);
            }) 
        }) 

          
    }
    console.log(yearsContHue)  


//slider code
    var list = ""
    for (var y=1987; y<=2016; y++){
        list += ".year" + y + ", "
    }

    list = list.slice(0, -2);

     d3.select("#embedSlider").on("input", function(){
        // console.log(this.value);
        var show = list.slice(0, (11*(this.value-1986)-2))
        var hide = list.slice((11*(this.value-1986)), list.length)
        

        //console.log(show.length)
        //console.log(hide.length)
        // console.log(list)
        d3.selectAll(show).classed("hidden", false)
        d3.selectAll(hide).classed("hidden", true)

        updateBarChart(yearsContHue[(this.value-1987)])

    })

   
});


function updateBarChart(data) {
    var barChart = svg2.selectAll("rect")
                        .data(data.values)
    barChart.exit().remove();
    barChart
        .enter()
        .append("rect")
        .merge(barChart)
        .attr("class", "bar")
            .attr("height",function(d){return d.value *2})
            .attr("width","15")
            .attr("x", function(d) {return (d.key * 25) + 2})
            .attr("y", function(d){return 380 - (d.value * 2)})
            .style("fill", function(d){
                    return colourScale(d.key)
                })

    var barChartText = svg2.selectAll("text")
        .data(data.values)

    barChartText.exit().remove();
    barChartText
        .enter()
        .append("text")
        .merge(barChartText)
            .text(function(d){return d.value;})
            .attr("class", "text")
            .attr("x", function(d) {return (d.key * 25) + 4})
            .attr("y", function(d) {return 400});

}

function showValue(val) {
    $("#range").text(val)

}



