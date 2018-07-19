var matchmode = $.getQueryStringByName("matchmode") || 0;
var id = $.getQueryStringByName("id") || 0;
var assetrecordid = $.getQueryStringByName("assetrecordid") || 0;
var publisher = $.getQueryStringByName("assetrecordid") || 0;
$(function () {
    if (matchmode == 2) {
        $("#yjs").show();
        safedetailinfo();
    }
})

function safedetailinfo() {
    var url = "/StoreServices.svc/product/projectintroduction";
    var paramter = {
        productid: id,
        assetrecordid: assetrecordid,
        publisher: publisher
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var assetrecordmodel = data.assetrecordmodel
            $("#exchangename").html(assetrecordmodel.exchangename);/// 备案交易所
            $("#exchangecomments").html(assetrecordmodel.exchangecomments); /// 交易所简介
            $("#registeredcapital").html(assetrecordmodel.registeredcapital/1000); /// 注册资本
        }
    });
}
