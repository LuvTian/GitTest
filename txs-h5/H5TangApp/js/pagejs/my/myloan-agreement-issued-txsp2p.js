/// <reference path="/_references.js" />

var pid = $.getQueryStringByName("pid");
var productinfo = [];
var loanId = $.getQueryStringByName("id");
var productBid = $.getQueryStringByName("bid");
var loantype = $.getQueryStringByName("loantype");
$(function() {
    getLoanBidItem(loanId, productBid);
});

var getLoanBidItem = function(loanid, productbid) {
    var url = "/StoreServices.svc/trans/loanbiditem";
    $.AkmiiAjaxPost(url, { "loanid": loanid, "productid": productbid }, true).then(function(data) {
        if (data.result) {
            productitem(data.loanbiditem);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var productitem = function(bidItem) {
    var data = { "productid": pid };
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, data, true).then(function(d) {
        if (d.result) {
            productinfo = d.productinfo;
            initBidItem(bidItem)
        }
    });
}

var initBidItem = function(bidItem) {
    $("#linlcontract").attr("href", "/html/product/contract/txsp2pcontractslease.html?id=" + bidItem.loanid + "&bid=" + $.getQueryStringByName("bid"));
    $("#holddate").text(bidItem.holddate);
    $("#borroweidnumber").text(bidItem.borroweidnumber);
    $("#repaydate").text(bidItem.repaydate);
};