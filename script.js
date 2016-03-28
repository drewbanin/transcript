
var years = ['Freshman', 'Sophomore', 'Pre-Junior', 'Junior', 'Senior'];
var yearRecords = _.groupBy(window.transcript, 'Year')

var year = 'Freshman';

//var data = yearRecords[year];
var data = window.transcript;

//var quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
var quarters = _.uniq(_.map(data, 'Quarter'));

var courses = _.uniq(_.map(data, 'Name'));
var subjects = _.uniq(_.map(data, 'Subject'));
var types = _.uniq(_.map(data, 'Type'));

var cols = courses;

var series = _.map(cols, function(col) {
  var records = _.map(quarters, function(quarter) {
      var record = _.find(data, {'Quarter': quarter, 'Name': col});
      if (!record) return {};

      record.y = record['Grade Points'];

      return record;
  });

  return {
    type: 'column',
    name: col,
    data: records,
  }
});

$('#container').highcharts({
    title: {
        text: 'BANIN - UNOFFICIAL TRANSCRIPT'
    },
    xAxis: {
        categories: quarters,
        tickPixelInterval: 1
    },
    tooltip: {
      formatter: function () {
        return 'Type: ' + this.point['Type'] + '<br />Course: ' + this.point['Title'] + '<br />Grade: ' + this.point['Grade'] + '<br />Grade Points: ' + this.point['Grade Points']
      }
    },
    series: series
});
