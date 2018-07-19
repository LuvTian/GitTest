//授权委托书列表
var bidid;
$(function () {
    bidid = $.getQueryStringByName("bidid");
    getProductInfo(bidid);
})

var getProductInfo = function (productid) {
    var url = "/StoreServices.svc/trans/loanbid";
    var paramter = {
        "productid": productid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            var html = initBidItem(tranList);
            $("#datalist").append(html);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
}

var initBidItem = function (list) {
    var ha = [];
    $.each(list, function (index, entry) {
        ha.push("<a href=\"/Html/Product/contract/regular-entrust.html?bidid=" + bidid + "&loanid" + entry.loanid + "\" class=\"bg-white bb\">");
        ha.push(" <div class=\"small-10 fl\">" + entry.contractid + "</div>");
        ha.push(" <div class=\"small-2 fl tr gray-font\"><span class=\"wxicon icon-right-arrow\"></span></div>");
        ha.push("</a>");
    });
    return ha.join("");
};
