$(function () {

    getCurrentProduct();
});
var lastId = "0";
var product = [];
var getProductBidList = function () {

    var url = "/StoreServices.svc/product/bidlist";
    var data = {
        productid: $.getQueryStringByName("id"),
        lastid: lastId,
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            var list = data.productbidlist;
            $.each(list, function (index, entry) {
                lastId = entry.id;
                $(".wrap").append(initBidItem(entry));
            });
            if (list.length > 0) {
                $.LoanMore($(".wrap"), null, "getProductBidList('" + lastId + "')");
            } else {
                $.LoanMore($(".wrap"), "没有更多记录了");
            }
        }
    });
};
var getCurrentProduct = function () {
    var data = {
        productid: $.getQueryStringByName("id")
    };
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            product = data.productinfo;
            $("#product-bid-count").text(product.bidcount);
            getProductBidList();
        }
    });
};

var initBidItem = function (bidItem) {
    var html = [];
    html.push("<div class=\"record-list bt\">");
    html.push("<div class=\"small-6 columns\">" + bidItem.name + "<span class=\"gray-font\">" + bidItem.biddate + "</span></div>");
    html.push("<div class=\"small-6 columns tr\">" + $.fmoney(bidItem.bidamount) + "元</div>");
    html.push("</div>");
    return html.join('');
};

var back = function () {
    history.back();
};
var gotoSuccess = function () {
    window.location.href = "/html/product/productlist.html";
}