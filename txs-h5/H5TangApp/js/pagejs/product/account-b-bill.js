$(function () {
     var depositbtntext = "";
    $.sengcaibaobtntext(function (d) {
        depositbtntext = d[0];
    });
    var transType = 8;
    if ($.getQueryStringByName("type")) {
        transType = $.getQueryStringByName("type")||transType;
    }
    getHistory(0, transType);
    $(".tab-title").removeClass("active");
    $("#title"+transType).addClass("active");
    //$(".tab-title:eq(" + transType + ")").addClass("active");
    $(".tabs-content .content").removeClass("active");
    $("#panel" + transType).addClass("active");

    $('.content').on('toggled', function (event, tab) {
        if (!tab.children(".translist").html()) {
            getHistory(0, tab.attr("data-transtype"));
        }
    });
});

//存钱罐收益的第一条，需要超链接
var savingpotlink = false;

var getHistory = function (lastId, type) {
    var url = "/StoreServices.svc/trans/historycqg";
    $.AkmiiAjaxPost(url, { "lastid": lastId, "transtype": type }, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $.each(tranList, function (index, entry) {
                //交易记录列表
                $("#panel" + type + " .translist").append(initTranItem(entry, type));
                lastId = entry.id;
            });

            if (tranList.length > 0) {
                $.LoanMore($("#panel" + type + " .translist"), null, "getHistory('" + lastId + "'," + type + ")");
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

var initTranItem = function (tranItem, type) {
    //存钱罐收益超链
    // if (type == 0 && !savingpotlink && tranItem.detailvalue == "1024") {
    //     savingpotlink = true;
    //     return savingpotHtml(tranItem);
    // }
    var html = [];
    html.push('<article class="bg-white bt">');
    var productName = "";
    if (type == 3) {
        productName = "<span class='gray'>&nbsp;-&nbsp;" + tranItem.productname + "</span>";
    }
    if (tranItem.detailtext == "银行卡购买")
    {
        tranItem.detailtext="银行卡购买"+depositbtntext+""
    }
    html.push('<div class="small-7 left"><p class="oh">' + tranItem.detailtext + productName + '</p><span class="gray">' + new Date(tranItem.created).Format("yyyy-MM-dd HH:mm") + '</span></div>');

    html.push("<div class=\"small-5 left text-right\"><p class=\"red " + (tranItem.direction ? "\">+" : "green\">-") + $.fmoney(tranItem.tranamount) + "</p>");

    // if (type == 8) {
    //     html.push("<span class=\"gray\">余额：" + $.fmoney(tranItem.afterbalance) + "</span></div>");
    // } else if (type == 9 || type == 10) {
    //     html.push("<span class=\"gray\">" + tranItem.statustext + "</span></div>");
    // }
    html.push('</article>');
    return html.join("");
};

var savingpotHtml = function (tranItem) {
    var html = [];
    html.push('<article class="bg-white bt">');
    html.push('<div class="small-7 left">');
    html.push('<p class="oh" style="color:#4198F6"><a href="/html/anonymous/savingpot-help.html" style="color:#4198F6">存钱罐收益？</a></p>');
    html.push('<span class="gray" style="font-size:1.2rem;">' + new Date(tranItem.created).Format("yyyy-MM-dd HH:mm") + '</span>');
    html.push('</div>');
    html.push('<div class="small-5 left text-right">');
    html.push('<p class="red">+' + $.fmoney(tranItem.tranamount) + '</p>');
    //html.push('<span class="gray">余额：' + $.fmoney(tranItem.afterbalance) + '</span>');
    html.push('</div>');
    html.push('</article>');
    return html.join("");
}