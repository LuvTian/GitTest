/// <reference path="/_references.js" />


var productId = 0;
$(function () {
    if ($.getQueryStringByName("id")) {
        productId = $.getQueryStringByName("id");
    }
    getHistory();
});

var getHistory = function () {
    var url = "/StoreServices.svc/trans/loanbid";
    $.AkmiiAjaxPost(url, { "productid": productId }, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $.each(tranList, function (index, entry) {
                if (entry.loantype == 1) {
                    initBidItem(entry);
                } else {
                    initBidItem(entry);
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
var initBidItem = function (bidItem) {

    $("#holddate").text(bidItem.holddate);
    $("#contractid").text(bidItem.contractid);
    $("#amount").text("+" + bidItem.amount);
    $("#borrowename").text(bidItem.borrowename);
    $("#borroweidnumber").text(bidItem.borroweidnumber);
    $("#borroweamount").text(bidItem.borroweamount + "元");
    $("#repaycount").text(bidItem.repaycount);
    $("#repaydate").text(bidItem.repaydate);
    $("#linlcontract").attr("href", "/html/my/userloancontract.html?id=" + bidItem.loanid + "&pid=" + productId);
};