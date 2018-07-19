//查询结果
var time = "";
var pageSize = 20;
var index = 1;

$(function () {
    time = $.getQueryStringByName("time");
    time = time.replace(".", '-').replace(".", '-');
    initCalender();
    $("#check").val(time);
    bindData();
})

var initCalender = function () {
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
        $('#check').mobiscroll("show");
    };

    var btn = document.getElementById('check1-icon');
    btn.addEventListener("click", eventone);

    $("#check").scroller('destroy').scroller($.extend(opt['date'], opt['default']));

    // $(".dwwl2").find(".dw-i").append("日");
    // $(".dwwl1").find(".dw-i").append("月");
    // $(".dwwl0").find(".dw-i").append("年");
};

//初始化数据
var bindData = function (noclear) {
    time = $("#check").val();
    if (time.lenght == 0) {
        $.alertS("时间不能为空");
        return;
    }

    var url = "/StoreServices.svc/store/dailyincomedetail";
    var param = {
        time: time,
        pageindex: index
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            var list = data.dailyincomedetaillist;
            var html = formatHtml(list);
            if (!noclear) {
                $("#listdata").empty();
            }
            $("#listdata").append(html);
            if (list.length < pageSize) {
                $.LoanMore($("#listdata"), "没有更多数据了");
            } else {
                index++;
                $.LoanMore($("#listdata"), null, "bindData(true)");
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
        ha.push(" <div class=\"row bb padd-tb1\">");
        ha.push("    <div class=\"small-4 columns az-padding0 az-text-left col-6 fz-15\">");
        ha.push("       " + (entry.name || "销券返现") + "");
        ha.push("    </div>");
        ha.push("    <div class=\"small-4 columns az-padding0 az-text-center col-6 fz-15\">");
        ha.push("       " + entry.createtime + "");
        ha.push("    </div>");
        ha.push("    <div class=\"small-4 columns az-padding0 az-text-right col-e60012 fz-15\">");
        ha.push("        " + $.fmoney(entry.profit) + "");
        ha.push("    </div>");
        ha.push(" </div>");
    });
    return ha.join("");
}
//查询
$("#btnsearch").click(function () {
    index = 1;
    bindData();
});
