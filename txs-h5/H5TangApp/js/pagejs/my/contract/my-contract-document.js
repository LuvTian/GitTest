//合同文件首页

    var bidid = "";
    var productid = "";
    var href = "";
$(function () {
    bidid = $.getQueryStringByName("bidid");
    productid = $.getQueryStringByName("productid");
    $("#contractlist").click(function () {
        if (bidid != "") {
            getHistory(bidid);
        }
    });
    //担保承诺书
    $("#guarantee").click(function () {
        var href = "/Html/Product/contract/regular-guarantee.html?pid=" + productid;
        window.location.href = href;
    });
    //合同文件
    $("#contractList").click(function () {
        href = "/html/my/userloanbid.html?bid=" + bidid + "&productid=" + productid;
        window.location.href = href;
    });
});

var getHistory = function (bid) {
    var url = "/StoreServices.svc/product/spvinfo";
    $.AkmiiAjaxPost(url, { "productbidid": bid }, true).then(function (data) {
        if (data.result) {
            var publisherspv = data.publisherspv;
            if (publisherspv.length > 0) {
                redirect(publisherspv[0]);
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var redirect = function (item) {
    var url = "/html/my/contract/regular-entrust.html";
    window.location.href = url + "?amount=" +
       encodeURIComponent(item.amount) + "&id=" +
        item.id + "&legal=" +
        encodeURIComponent(item.legal) + "&manager=" +
        encodeURIComponent(item.manager) + "&remark=" +
        encodeURIComponent(item.remark) + "&spvno=" +
        encodeURIComponent(item.spvno) + "&spvtitle=" +
        encodeURIComponent(item.spvtitle) + "&tel=" +
        encodeURIComponent(item.tel) + "&spvprotoal=" +
        encodeURIComponent(item.productname) + "&bidid="+
        encodeURIComponent(bidid)
};