$(function() {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function(data) {

        // Create the chart
        window.chart = new Highcharts.StockChart({
            chart : {
                renderTo : 'container'
            },

            rangeSelector : {
                selected : 1
            },

            //title : {
            //    text : 'Tracking history'
            //},

            series : [{
                name : 'Response time (ms)',
                data : data,
                marker : {
                    enabled : true,
                    radius  : 2
                },
                //shadow : true,
                tooltip : {
                    valueDecimals : 2
                }
            }]
        });
    });
});
