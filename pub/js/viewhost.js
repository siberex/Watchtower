$(function() {
    $.getJSON(dataUrl, function(data) {

        var flags = [];
        for (var i in data) {
            if (data[i].s != 200) {
                flags.push({
                    x: data[i].x,
                    y: data[i].s,
                    title: data[i].s
                });
            }
        }

        // Create the chart
        window.chart = new Highcharts.StockChart({
            chart : {
                renderTo : 'container'
            },
            xAxis: {
                //ordinal: false,
                type: 'datetime'
            },
            title : {
                text : hostUrl
            },
            yAxis: {
                title : 'Response time (ms)',
            },
            rangeSelector : {
                enabled: false,
                selected : 2
            },

            scrollbar : {
                enabled : false
            },

            tooltip: {
                shared      : false,
                crosshairs  : true,
                formatter   : function() {
                    return Highcharts.dateFormat('%d.%m %H:%M', this.x) +':<br/>' + this.series.name + ': '
                         + '<b>' + parseInt(this.y) + '</b>'
                         + (this.point.s ? '<br />Status: ' + '<b>' + this.point.s + '</b>' : '');
                }
            },

            series : [{
                name    : "Response time (ms)",
                data    : data,
                id: 'dataseries',
                marker  : {
                    enabled : true,
                    radius  : 2
                },
                shadow  : true
            }, {
                type    : 'flags',
                name    : 'Code',
                data    : flags,
                onSeries: 'dataseries',
                shape   : 'squarepin'
            }]
        });
    });
});
