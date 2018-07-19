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
            //最后一条数据去掉边框
            $(".record-list:last").removeClass("bb");
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
    var bidtime;
    if (product.paytype == 2) {
        if (bidItem.biddate < product.saletime) {
            bidtime = product.saletime;
        }
        else {
            bidtime = bidItem.biddate;
        }
    }
    else {
        bidtime = bidItem.biddate;
    }
    var html = [];
    html.push("<div class=\"record-list\">"); 
    html.push("<div ><b class=\"invote_people\">" + bidItem.name);
    if(bidItem.reservationbidstatus=="1"){
        html.push("<i class=\"appoint_icon\">预约</i>");
    }
    html.push("</b><span class=\"invote_time\">" + bidtime + "</span></div>");
    html.push("<div>" + $.fmoney(bidItem.bidamount) + "元</div>");
    html.push("</div>");
    return html.join('');
};

var back = function () {
    history.back();
};
var gotoSuccess = function () {
    window.location.href = "/html/product/productlist.html";
}