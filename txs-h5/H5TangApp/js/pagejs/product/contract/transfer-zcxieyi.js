$(function() {
    productinfo();
});

function productinfo() {
    var url = "/StoreServices.svc/product/productdetail";
    var data = { "productid": $.getQueryStringByName("productid") };
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            var product = data.regularproductdetail;
            $("#penaltyrate").html(rateformat(product.penaltyrate));
        }
    })
}

//罚金兼容千分和百分
function rateformat(rate) {
    var a = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    if (!!rate) {
        if (rate.length > 1 && rate.length != 0) {
            var b = rate.substr((rate.length - 1), rate.length);
            var num = a[b - 1];
            return "千分之" + num + "";
        } else if (rate.length == 1) {
            var num = a[rate - 1];
            return "百分之" + num + "";
        }
    } else {
        return "千分之二";
    }
}