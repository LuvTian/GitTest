/// <reference path="/_references.js" />


var pid = $.getQueryStringByName("productid");
var bid = $.getQueryStringByName("bid");
var productinfo = [];
$(function () {
    productitem();
});

var getHistory = function () {
    var url = "/StoreServices.svc/trans/loanbid";
    $.AkmiiAjaxPost(url, { "bidid": bid, "productid": pid }, false).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $.each(tranList, function (index, entry) {
                if (!productinfo.isentrust) {
                    if (entry.loantype == 1) {
                        $("#panel1").append(initBidItem(entry));
                    }
                    else {
                        $("#panel2").append(initBidItem(entry));
                    }
                } else {
                    $("#panel3").show();
                    $("#panel3").append(initBidItem(entry));
                }
            });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var productitem = function () {
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, { "productid": pid}, false).then(function (data) {
        if (data.result) {
            productinfo = data.productinfo;
            if (productinfo.isentrust && productinfo.matchmode == 2) {
                $("#title-tab").hide();
                $.UpdateTitle("交易所挂牌承销类");
            }
            else if (productinfo.isentrust && productinfo.matchmode == 1) {
                $("#title-tab").hide();
                $.UpdateTitle("定向委托类");
            }else{
                $("#title-tab").show();
            }
            getHistory();
        }
    });
}

var initBidItem = function (bidItem) {

    var htmlArray = [];

    htmlArray.push("<a href=\"/html/my/myloan-agreement-issued.html?loantype=" + bidItem.loantype + "&id=" + bidItem.loanid + "&bid=" + bid + "&pid=" + pid +"\" class=\"idlist bg-white bb\">");
    //var param = "?id=" + bidItem.loanid + "&pid=" + productId;
    //htmlArray.push("<a class=\"idlist bg-white bb\" href=\"" + (bidItem.loantype == 1 ? "/html/my/myloan-agreement-financing.html" + param : "/html/my/myloan-agreement-issued.html" + param) + " \">");
    htmlArray.push("<div class=\"small-12\">投资时间：" + bidItem.createdtime + "</div>");
    //htmlArray.push("<div class=\"small-9 fl\">" + (bidItem.loantype == 1 ? "融资" : "发行") + "方：<b>" + bidItem.borrowename + "</b>");
    if (productinfo.isentrust) {
        htmlArray.push("<div class=\"small-9 fl\"> 受托方：<b>" + bidItem.borrowename + "</b>");
    }
    else
    {
        htmlArray.push("<div class=\"small-9 fl\"> 发行方：<b>" + bidItem.borrowename + "</b>");
    }
    htmlArray.push("<span>协议编号：" + bidItem.contractid + "</span></div>");
    htmlArray.push("<div class=\"small-4 tr\"><span class=\"red\">" + $.fmoney(bidItem.amount) + "</span>在投金额<span class=\"wxicon icon-right-arrow\">");
    htmlArray.push("</span></div></a>");
    return htmlArray.join("");
};