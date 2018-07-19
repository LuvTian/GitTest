//每日收益 首页
$(function () {
    $('.row:last', 'article:last').removeClass('bb');
    initCalendar();
    bindData();
});

//初始化日历控件
var initCalendar = function () {
    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.date = { preset: 'date' };
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        lang: 'zh',
        dateFormat: 'yy-mm-dd', // 日期格式  
        setText: '确定', //确认按钮名称  
        cancelText: '取消',//取消按钮名籍我  
        dateOrder: 'yymmdd', //面板中日期排列格式  
        dayText: '日', monthText: '月', yearText: '年',
        rows: '5',
        width: 85,
        height: 40,
        startYear: currYear - 10, //开始年份
        endYear: currYear + 10//结束年份
    };
    var eventone = function () {
        $("#check1").mobiscroll("show");
    };

    var btn = document.getElementById('check1-icon');
    btn.addEventListener("click", eventone);

    var eventone2 = function () {
        $("#check2").mobiscroll("show");
    };
    var btn = document.getElementById('check2-icon');
    btn.addEventListener("click", eventone2);

    $("#check1").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    $("#check2").scroller('destroy').scroller($.extend(opt['date'], opt['default']));

    // $(".dwwl2").find(".dw-i").append("日");
    // $(".dwwl1").find(".dw-i").append("月");
    // $(".dwwl0").find(".dw-i").append("年");
}
//初始化数据
var bindData = function () {
    var url = "/StoreServices.svc/store/dailyincomeindex";
    var param = {};
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            $("#count").html(data.investcount);
            $("#rate").html("0.5");
            $("#totalprofit").html($.fmoney(data.totalprofit));
            $("#yesterdayprofit").html($.fmoney(data.yesterdayprofit));
            var list = data.recentgainslist;
            if (list.length > 0)
            {
                var html = formatHtml(list);
                $("#listdata").append(html);
            }
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    });
}

var formatHtml = function (list) {
    var ha = [];
    $.each(list, function (index, entry) {
        ha.push(" <div class=\"row bb padd-tb1\" onclick=searchDetail('" + entry.time + "')> ");
        ha.push("      <div class=\"small-3 columns az-padding0 az-text-left col-6 fz-15 time\">");
        ha.push("          "+entry.time+"");
        ha.push("      </div>");
        ha.push("      <div class=\"small-3 columns az-padding0 az-text-center col-6 fz-15\">");
        ha.push("          " + entry.FirstInvestmentCount + "");
        ha.push("      </div>");
        ha.push("      <div class=\"small-3 columns az-padding0 az-text-center col-6 fz-15\">");
        ha.push("         "+entry.investcount+"");
        ha.push("      </div>");
        ha.push("      <div class=\"small-3 columns az-padding0 az-text-right col-e60012 fz-15\">");
        ha.push("        " + $.fmoney(entry.profit) + "");
        ha.push("      </div>");
        ha.push(" </div>");
    });
    return ha.join("");
}
//查询
$("#btnsearch").click(function () {
    var bt = $("#check1").val();
    var et = $("#check2").val();
    if (bt == "" || et == "") {
        $.alertS("请选择时间范围");
        return;
    } else if (et < bt) {
        $.alertS("请选择正确的日期");
        return;
    } else {
        var str = "bt=" + encodeURIComponent(bt) + "&et=" + encodeURIComponent(et);
        window.location.href = "dailyincomesearch.html?" + str;
    }
});
//查看详细
var searchDetail = function (time) {
    window.location.href = "dailydatadetaile.html?time=" + time;
}
//当结束日期小于开始日期时
$("#check2").change(function () {
    var bt = $("#check1").val();
    var et = $("#check2").val();
    if (et < bt)
    {
        $.alertS("请选择正确的日期");
        return;
    }
});