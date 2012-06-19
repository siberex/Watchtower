var redMarker =  {
    fillColor   : "red",
    lineColor   : "red",
    states      : {
        hover       : {
            fillColor   : 'red',
            lineColor   : 'red'
        }
    }
};

function sortFn(a, b) {
    if (a.x > b.x) return  1;
    if (a.x < b.x) return -1;
    return 0;
}

function dataPreFormat(data) {
    //if (!(data instanceof Array) ) // Object.prototype.toString.call(data) == '[object Array]'
    //    return [];
    if (!data.sort) return [];
    data = data.sort(sortFn);
    for (var i in data) {
        if (data[i].s != "200" || data[i].y > 2000) {
            data[i].color = "red";
            data[i].marker = redMarker;
        }
    }
    return data;
}

$(document).ready(function() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    function loadData(min, max) {
        //chart.showLoading();
        $.get(dataUrl, {
            from : min ? Math.round(min) : null,
            to   : max ? Math.round(max) : null
        }, function(data, status) {
            if (status && status == "success" && data && data.length) {
                var series = chart.get('dataseries'); // chart.series[0]
                series.setData( dataPreFormat(data) );
            } else {
                //chart.hideLoading();
            }
        }, 'json').error(function() {
            //chart.hideLoading();
        });
    }

    // Create the chart
    window.chart = new Highcharts.StockChart({
        chart : {
            renderTo : 'container',
            events: {
                load: function(event) {
                    loadData( (new Date()).getTime() - 7 * 24*60*60*1000, false );

                    // ↓ Bad way, last 3 days will be erased on chart.
                    // loadData( (new Date()).getTime() - 7 * 24*60*60*1000, (new Date()).getTime() - 3 * 24*60*60*1000 );
                },
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
        title : {
            text : hostUrl
        },
        credits: {
            enabled: false
        },

        xAxis: {
            ordinal: false,
            type: 'datetime',
            events: {
                setExtremes: function(e) {
                    var extremes = this.getExtremes(); // this - xAxis
                    //console.log(extremes.dataMin, extremes.dataMax);
                    //console.log( Highcharts.dateFormat('%d %b %H:%M', e.min), Highcharts.dateFormat('%d %b %H:%M', e.max) );
                }
            }
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
            } /*, {
                type: 'week',
                count: 2,
                text: '2w'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }*/],
            selected : 1
        },
        plotOptions: {
            areaspline : {
                gapSize: 4
            }
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
            data    : (typeof initialData !== "undefined" ? dataPreFormat(initialData) : []),
            type    : 'areaspline',
            id      : 'dataseries',
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
    }); // new chart
}); // document.ready
