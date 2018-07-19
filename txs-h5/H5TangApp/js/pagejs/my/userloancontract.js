/// <reference path="/_references.js" />


$(function () {
    var loanId = $.getQueryStringByName("id");
    var productId = $.getQueryStringByName("bid");
    getContract(loanId, productId);
});

var getContract = function (loanId, productId) {
    var url = "/StoreServices.svc/trans/loancontract";
    $.AkmiiAjaxPost(url, { "loanid": loanId, "productid": productId }, true).then(function (data) {
        if (data.result) {
            $(".contract-wrap").html(data.contractcontent.replace(/\s+/g, " "));
        }
    });
};