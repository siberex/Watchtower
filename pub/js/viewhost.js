$(function() {
    $.getJSON(dataUrl, function(data) {

        for (var i in data) {
            if (data[i].s != "200" || data[i].y > 2000) {
                data[i].color = "red";
                data[i].marker = {
                    fillColor   : "red",
                    lineColor   : "red",
                    states      : {
                        hover       : {
                            fillColor   : 'red',
                            lineColor   : 'red'
                        }
                    }
                };
            }
        }


        // Create the chart
        window.chart = new Highcharts.StockChart({
            chart : {
                renderTo : 'container',
                events: {
                    redraw: function(event) {
                        if (chart.xAxis) {
                            var extremes = chart.xAxis[0].getExtremes();
                            if (extremes && extremes.min == extremes.dataMin) {
                                //console.log("time to load more data!");
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },

            xAxis: {
                ordinal: false,
                type: 'datetime',
                events: {
                    setExtremes: function(e) {
                        // this - axis
                        console.log(e.min, e.max);
                    }
                }
            },
            title : {
                text : hostUrl
            },
            yAxis: {
                title : 'Response time (ms)',
                plotBands: [{
                    from: 0,
                    to: 500,
                    color: '#EEFFEE'
                }, {
                    from: 501,
                    to: 2000,
                    color: '#FFFFEE'
                }, {
                    from: 2001,
                    to: 5000,
                    color: '#FFEEEE'
                }]
                //,max: 5000
            },
            rangeSelector : {
                enabled: true,
                inputEnabled: false,
                buttons: [{
                    type: 'minute',
                    count: 360,
                    text: '6h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'day',
                    count: 3,
                    text: '3d'
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
                    return Highcharts.dateFormat('%d %b %H:%M', this.x) +':<br/>' + this.series.name + ': '
                         + '<span style="font-weight:bold;color:' + (this.y<=2000?'black':'red') + '">' + parseInt(this.y) + '</span> ms'
                         + (this.point.s ? '<br />Status: ' + '<span style="font-weight:bold;color:' + (this.point.s=='200'?'black':'red') + '">' + this.point.s + '</span>' : '');
                }
            },

            series : [{
                name    : "Response time",
                data    : data,
                type: 'areaspline',
                id: 'dataseries',
                //pointInterval: 15 * 60 * 1000,
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
