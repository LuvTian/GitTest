$(function () {
    getProductAppointList();
    getCurrentProduct();
});
var lastId = "0";
var getProductAppointList = function () {

    var url = "/StoreServices.svc/product/appointlist";
    var data = {
        productid: $.getQueryStringByName("id"),
        lastid: lastId,
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            var list = data.productappointlist;
            $.each(list, function (index, entry) {
                lastId = entry.id;
                $(".wrap").append(initAppointItem(entry));
            });
            if (list.length > 0) {
                $.LoanMore($(".wrap"), null, "getProductAppointList('" + lastId + "')");
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
            $("#product-appoint-count").text(product.appointment);
        }
    });
};

var initAppointItem = function (appointItem) {
    var html = [];
    html.push("<div class=\"record-list bt\">");
    html.push("<div class=\"small-6 columns\">" + appointItem.name + "</div>");
    html.push("<div class=\"small-6 columns tr\">" + appointItem.appointdate + "</div>");
    html.push("</div>");
    return html.join('');
};
var back = function () {
    history.back();
};
var gotoSuccess = function () {
    window.location.href = "/html/product/productlist.html";
}