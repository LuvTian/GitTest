$(function () {
    getUserInfo();
    getDailyProfit();

});
var account = [];

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            if (account.customstatus < 3) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            }
            if (data.ismaintenance) {
                $(".maintenanct").attr("href", "/html/system/data-processing.html")
            }
            if (data.isglobalmaintenance) {
                $(".global-maintenanct").attr("href", "/html/system/system-maintenance.html");
            }

            $("#user-curent-demand").text(account.demandbalance);
            $("#user-curent-profit").text($.fmoney(account.demandprofit));
            $("#user-profit-count").text($.fmoney(account.demandprofitcount));
            $("#user-yesterday-profit").text($.fmoney(account.demandyesterdayprofit));

        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var getDailyProfit = function () {
    var url = "/StoreServices.svc/trans/dailyprofit";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var chartX = [];
            var amount = 0;
            $.each(data.dailyprofitlist, function (index, entry) {
                chartX.push(entry.tranamount);
                amount = entry.tranamount;
            });
            var top = Math.max.apply(null, chartX);
            var tmp = top / 5;
            var step = tmp > 5 ? (top % 5 == 0 ? tmp : parseInt(tmp / 5) * 5 + 5) : Math.ceil(tmp == 0 ? 1 : tmp);

            var topPx = ((top == 0 ? 130 : (130 - (amount / step / 5) * 155)) - 8);

            $(".chart-money").text(amount).attr("style", "top:" + topPx + "px").slideUp(300).delay(1000).fadeIn(400);
            drawGrid(chartX);
            $("#chart-2").click(function () { window.location.href = "/Html/My/demand-profit.html"; });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var stepX = (77 / 10);

var drawGrid = function (chartX) {
    var graph = Snap("#chart-2");
    var g = graph.g();
    g.attr('id', 'grid');
    for (i = 0; i <= stepX + 2; i++) {
        var horizontalLine = graph.path(
            "M" + 8 + "," + (stepX * i) + " " +
            "L" + 100 + "," + stepX * i);
        horizontalLine.attr('class', 'horizontal');
        g.add(horizontalLine);
    };
    //for (i = 0; i <= 12; i++) {
    //    var horizontalLine = graph.path(
    //        "M" + stepX * i + "," + 38 + " " +
    //        "L" + stepX * i + "," + 0);
    //    horizontalLine.attr('class', 'vertical');
    //    g.add(horizontalLine);
    //};
    drawX($("#chart-2"));
    drawY($("#chart-2"), chartX);
    drawLineGraph('#chart-2', chartX, '#graph-2-container', 2);
};

var point = function (x, y) { x: 0; y: 0; }
var drawX = function (dom) {
    var date = new Date();
    var html = [];
    for (var i = 0; i < 7; i++) {
        date = date.addDays(-1);
        html.unshift("<span>" + date.Format("MM-dd") + "</span>");
    }
    dom.after($("<div>").addClass("csday").html(html.join('')));
};
var drawY = function (dom, chartX) {
    var html = [];
    var top = Math.max.apply(null, chartX);
    var tmp = top / 5;
    var step = tmp > 5 ? (top % 5 == 0 ? tmp : parseInt(tmp / 5) * 5 + 5) : Math.ceil(tmp == 0 ? 1 : tmp);
    for (var i = 0; i <= 5; i++) {
        html.unshift("<span>" + (step * i) + "</span>");
    };
    dom.after($("<div>").addClass("csx").html(html.join('')));

};
function drawLineGraph(graph, points, container, id) {
    var graph = Snap(graph);
    var myPoints = [];
    function parseData(points) {
        //var top = Math.max.apply(null, points);
        //console.log(top);
        var top = Math.max.apply(null, points);
        points[points.length - 1] = points[points.length - 1] + 0.001;
        var tmp = top / 5;
        var step = tmp > 5 ? (top % 5 == 0 ? tmp : parseInt(tmp / 5) * 5 + 5) : Math.ceil(tmp == 0 ? 1 : tmp);
        for (i = 0; i < points.length; i++) {
            var p = new point();
            var pv = points[i];
            p.x = i * 10 + 10;
            p.y = 38 - (step == 0 ? 0 : (pv / (step * 5) * 38));
            myPoints.push(p);
        }
    }

    var segments = [];

    function createSegments(p_array) {
        for (i = 0; i < p_array.length; i++) {
            var seg = "L" + p_array[i].x + "," + p_array[i].y;
            if (i === 0) {
                seg = "M" + p_array[i].x + "," + p_array[i].y;
            }
            segments.push(seg);
        }
    }

    function joinLine(segments_array, id) {
        var line = segments_array.join(" ");
        var line = graph.path(line);
        line.attr('id', 'graph-' + id);
        var lineLength = line.getTotalLength();

        line.attr({
            'stroke-dasharray': lineLength,
            'stroke-dashoffset': lineLength
        });
    }
    parseData(points);
    createSegments(myPoints);
    joinLine(segments, id);
}
