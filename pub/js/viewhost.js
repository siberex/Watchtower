$(function() {
    $.getJSON(dataUrl, function(data) {

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
                title : 'Response time (ms)'
                //,max: 5000
            },
            rangeSelector : {
                enabled: true,
                inputEnabled: false,
                buttons: [{   //  'millisecond', 'second', 'minute', 'day', 'week', 'month', 'ytd' (year to date), 'year' and 'all'.
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1w'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }],
                selected : 1
            },

            scrollbar : {
                enabled : false
            },

            tooltip: {
                shared      : false,
                crosshairs  : true,
                formatter   : function() {
                    return Highcharts.dateFormat('%d.%m %H:%M', this.x) +':<br/>' + this.series.name + ': '
                         + '<span style="font-weight:bold;color:' + (this.y<='2000'?'black':'red') + '">' + parseInt(this.y) + '</span> ms'
                         + (this.point.s ? '<br />Status: ' + '<span style="font-weight:bold;color:' + (this.point.s=='200'?'black':'red') + '">' + this.point.s + '</span>' : '');
                }
            },

            series : [{
                name    : "Response time",
                data    : data,
                type: 'areaspline',
                id: 'dataseries',
                fillColor : {
                    linearGradient : {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
                },
                lineWidth : 0, // 1
                marker  : {
                    enabled : true,
                    radius  : 2
                }
            }]
        });
    });
});
