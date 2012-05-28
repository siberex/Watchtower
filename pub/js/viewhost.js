$(function() {
    $.getJSON(dataUrl, function(data) {

        // Create the chart
        window.chart = new Highcharts.StockChart({
        //window.chart = new Highcharts.Chart({
            chart : {
                renderTo : 'container'
            },
            xAxis: {
                //minPadding: 0.05,
                //maxPadding: 0.05,
                type: 'datetime',
                //minRange: 1,
                ordinal: false
            },
            /*yAxis: {
                title : 'Response time (ms)',
            },*/
            rangeSelector : {
                selected : 1
            },


            series : [{
                name: "Response time (ms)",
                data : data,
                tooltip: {
                    /*valueDecimals : 2,
                    shared: false,
                    crosshairs: [true, true],
                    snap: 100*/
                    enabled: false
                },
                marker : {
                    enabled : true,
                    radius  : 2
                },
                shadow : true
            }]
        });
    });
});
