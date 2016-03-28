var HEIGHT = 500;
var WIDTH = window.innerWidth;

var margin = {top: 40, right: 40, bottom: 100, left: 40},
    width = WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x2 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x3 = d3.scale.linear()
    .range([0, width]);

var x4 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var quarterLookup = function(quarter) {
  return quarter.replace(" Quarter", "");
}

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .tickFormat(quarterLookup)
    .tickSize(5, 5)
    .ticks(10, "s")
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var line = d3.svg.line()
    .x(function (d) {
        return x3(d.NO);
    })
    .y(function (d) {
        return y(d.GPA);
    });

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("transcript.json", function(error, data) {
  if (error) throw error;
  window.data = data;

  x.domain(_.map(data, 'Name'));
  x2.domain(_.map(data, 'Quarter'));
  x3.domain(d3.extent(data, function(d) { return d.NO; }));
  x4.domain(_.map(data, 'Nice Type'));
  y.domain([0, 4.0]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)" );

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height+75) + ")")
      .call(xAxis2);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Grade Points");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return 'bar bar-' + d['Type']})
      .attr("x", function(d) { return x(d['Name']); })
      .attr("width", function(d) {
          return x.rangeBand();
      })
      .attr("y", function(d) { return y(d['Grade Points']); })
      .attr("height", function(d) {
        return height - y(d['Grade Points'])
      })
      .on('mouseover', function(d) {
        vm.registerClass(d);
      });


  svg.append("path")
      .datum(data)
      .attr("class", "linePlot")
      .attr("d", line);

  vm.registerClass(data[0]);
});

var TranscriptViewModel = function() {
    this.currentClass = ko.observable(null);

    this.get = function(attr, disp) {
      return (this.currentClass() || {})[attr] || "";
    };

    this.registerClass = function(record) {
        this.currentClass(record);
    };
};

var vm = new TranscriptViewModel()
ko.applyBindings(vm);
