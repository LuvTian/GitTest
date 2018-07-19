/// <reference path="/_references.js" />


var pid = $.getQueryStringByName("productid");
var bid = $.getQueryStringByName("bid");
var productinfo = [];
$(function() {
    productitem();
});

var getHistory = function() {
    var url = "/StoreServices.svc/trans/loanbid";
    $.AkmiiAjaxPost(url, { "bidid": bid, "productid": pid }, false).then(function(data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $.each(tranList, function(index, entry) {
                if (!productinfo.isentrust) {
                    if (entry.loantype == 1) {
                        $("#panel1").append(initBidItem(entry));
                    } else {
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

var productitem = function() {
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, { "productid": pid }, false).then(function(data) {
        if (data.result) {
            productinfo = data.productinfo;
            getHistory();
        }
    });
}

var initBidItem = function(bidItem) {

    var htmlArray = [];

    htmlArray.push("<a href=\"/html/my/myloan-agreement-issued-txsp2p.html?loantype=" + bidItem.loantype + "&id=" + bidItem.loanid + "&bid=" + bid + "&pid=" + pid + "\" class=\"idlist bg-white bb\">");
    htmlArray.push("<div class=\"small-12\">投资时间：" + bidItem.createdtime + "</div>");
    htmlArray.push("<span>协议编号：" + bidItem.contractid + "</span></div>");
    htmlArray.push("<div class=\"small-4 tr\"><span class=\"red\">" + $.fmoney(bidItem.amount) + "</span>在投金额<span class=\"wxicon icon-right-arrow\">");
    htmlArray.push("</span></div></a>");
    return htmlArray.join("");
};