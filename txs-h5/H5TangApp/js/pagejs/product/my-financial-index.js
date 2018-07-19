
var pageSize = 10;


$(function () {
    getFinancialList();

});


var getFinancialList = function () {
    var url = "/StoreServices.svc/trans/financialhistorylist";
    var paramter = {
        status: 1
    }
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var list = data.financialbidlist;
            $("#currentTotalAmont").html($.fmoney(data.financialbalance));//定期在投金额
            $("#yesterdayInterest").html("+" + $.fmoney(data.yesterdayprofit));//昨日收益
            $("#totalInterest").html("+" + $.fmoney(data.sumprofit));//累计收益
            //定期无在投，显示出历史记录。
            if (data.financialbalance == 0) {
                getHistoryFinancialList();
            }
            $("#user-fix-product").append(financialbid(list));
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
    $("#historyTitle").show();
};
//加载更多
$("#loadmoreProject").click(function () {
    $("#historyTitle").show();
    getHistoryFinancialList(0);
});

//历史投资
var getHistoryFinancialList = function () {
    var url = "/StoreServices.svc/trans/financialhistorylist";
    $.AkmiiAjaxPost(url, { status: 2 }, true).then(function (data) {
        if (data.result) {
            var historylist = data.financialbidlist;
            $("#historyList").append(financialbid(historylist));
            $("#historyList").show();
            $('#loadmoreProject').unbind("click").css({ background: '#F0EFF5', border: '0px' }).html("没有更多投资记录了");
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

//理财金在投记录
var financialbid = function (list) {
    var ha = [];
    var str = "累计收益";
    $.each(list, function (index, entry) {
        //在投中数据显示
        if (entry.status == 1) {
            ha.push("<li>");
            ha.push("    <p><span  class=\"col1\">理财金专享</span><span class=\"tr ts1\">还剩" + entry.duration + "天</span></p>");
            ha.push("    <p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + " </span></p>");
            ha.push("    <p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.expecttotalamount) + "</span></p>");
            ha.push("</li>");
        } else if (entry.status == 2) {
            ha.push("<li>");
            ha.push("    <p><span  class=\"col1\">理财金专享</span><span class=\"tr ts1\">投资时间 " + entry.starttime + "</span></p>");
            ha.push("    <p><span class=\"ts1\">已还款</span><span class=\"tr ts1\">" + str + "  </span></p>");
            ha.push("    <p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.expecttotalamount) + "</span></p>");
            ha.push("</li>");
        }
        else if (entry.status == 3) {
            ha.push("<li>");
            ha.push("    <p><span  class=\"col1\">理财金专享</span><span class=\"tr ts1 ts22\">赎回中</span></p>");
            ha.push("    <p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + " </span></p>");
            ha.push("    <p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.expecttotalamount) + "</span></p>");
            ha.push("</li>");
        }

    });
    return ha.join('');
};

//点击昨日收益累计收益跳到平台奖励
$(".profitclick").click(function () {
    window.location.href = "/html/my/myreward-money.html";
});

