var depositbtntext = "";
var withdrawbtntext = "";
var accountbalance = "";
var lastid = "0";
var p2plastid = "0";
var qjslastid = "0";
$(function () {
    $.sengcaibaobtntext(function (d) {
        depositbtntext = d[0];
        withdrawbtntext = d[1];
        accountbalance = d[3]
        $(".accountbalance").html(accountbalance);
        $("#deposit").html(depositbtntext);
        $("#withdraw").html(withdrawbtntext);
    });
    var transType = 0;
    if ($.getQueryStringByName("type")) {
        transType = $.getQueryStringByName("type");
    }
    getHistory(transType, '0', '0', '0');
    $(".tab-title").removeClass("active");
    $(".tab-title:eq(" + transType + ")").addClass("active");
    $(".tabs-content .content").removeClass("active");
    $(".tabs-content .content:eq(" + transType + ")").addClass("active");

    $('.content').on('toggled', function (event, tab) {
        if (!tab.children(".translist").html()) {
            getHistory(tab.attr("data-transtype"), '0', '0', '0');
        }
    });
});

//僧财宝收益的第一条，需要超链接
var savingpotlink = false;

var getHistory = function (type, lastid, p2plastid, qjslastid) {
    var url = "/StoreServices.svc/trans/historycqg";
    var data = {
        "lastid": lastid,
        "transtype": type,
        "p2plastid": p2plastid,
        "qjslastid": qjslastid
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            // pageindex = parseInt(pageindex) + 1;
            var tranList = data.transhistorys;
            $.each(tranList, function (index, entry) {
                //交易记录列表
                $("#panel" + type + " .translist").append(initTranItem(entry, type, entry.datasource));
                if (entry.datasource == 0) {
                    lastid = entry.id;
                } else if (entry.datasource == 10) {
                    p2plastid = entry.id;
                } else if (entry.datasource == 20) {
                    qjslastid = entry.id;
                }
            });
            if (tranList.length > 0) {
                $.LoanMore($("#panel" + type + " .translist"), null, "getHistory(" + type + "," + "'" + lastid + "'" + "," + "'" + p2plastid + "'" + "," + "'" + qjslastid + "'"+ ")");
            } else {
                $.LoanMore($("#panel" + type + " .translist"), "没有更多交易记录了");
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var initTranItem = function (tranItem, type, datasource) {
    //僧财宝收益超链
    if (type == 0 && !savingpotlink && tranItem.detailvalue == "1024") {
        savingpotlink = true;
        return savingpotHtml(tranItem);
    }
    var html = [];
    html.push('<article class="bg-white borb">');
    var productName = "";
    if (type == 3) {
        productName = "<span>&nbsp;-&nbsp;" + tranItem.productname + "</span>";
    }
    if (tranItem.detailtext == "银行卡购买") {
        tranItem.detailtext = "银行卡购买" + depositbtntext + ""
    }
    html.push('<div class="small-7 left"><p class="oh">' + tranItem.detailtext + productName + '</p><span class="gray">' + tranItem.created + '</span></div>');

    html.push("<div class=\"small-5 left text-right\"><p class=\"red" + (tranItem.direction ? "\">+" : " green\">-") + $.fmoney(tranItem.tranamount) + "</p>");
    if (datasource == 0) {
        if (type == 0) {
            html.push("<span class=\"gray fz\">余额：" + $.fmoney(tranItem.afterbalance) + "</span></div>");
        } else if (type == 1 || type == 2) {
            html.push("<span class=\"gray fz\">" + tranItem.statustext + "</span></div>");
        }
    } else if (datasource == 10 || datasource == 20) {
        if (type == 1 || type == 2) {
            html.push("<span class=\"gray fz\">" + tranItem.statustext + "</span></div>");
        }
    }
    html.push('</article>');
    return html.join("");
};

var savingpotHtml = function (tranItem) {
    var html = [];
    html.push('<article class="bg-white borb">');
    html.push('<div class="small-7 left">');
    html.push('<p class="oh" style="color:#4198F6"><a href="/html/anonymous/savingpot-help.html" style="color:#4198F6"><z class="accountbalance">' + accountbalance + '</z>收益？</a></p>');
    html.push('<span class="gray" style="font-size:1.2rem;">' + tranItem.created + '</span>');
    html.push('</div>');
    html.push('<div class="small-5 left text-right">');
    html.push('<p class="red line-h ">+' + $.fmoney(tranItem.tranamount) + '</p>');
    // html.push('<span class="gray">余额：' + $.fmoney(tranItem.afterbalance) + '</span>');
    html.push('</div>');
    html.push('</article>');
    return html.join("");
}