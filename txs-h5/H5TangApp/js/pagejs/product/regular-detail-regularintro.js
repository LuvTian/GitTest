$(function () {
    getCurrentProduct();
});
var getCurrentProduct = function () {
    var data = {
        productid: $.getQueryStringByName("id")
    };
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            product = data.productinfo;
            $("#product-title").text(product.title);
            $("#product-desc").text(product.description);
            $("#bidcount").text(product.bidcount);

            $("#product-rate").text(product.rate);
            $("#product-amount").text(product.totalamount / 10000);
            $("#product-duration").text(product.duration);
            $("#product-lockduration").text(product.lockduration);
            $(".product-min-amoount").text(product.amountmin);
$("#product-bidrule").text(product.amountmin + "起投，限额" + product.amountmax + "，" + product.step + "的整数倍");
            $("#product-guaranteetype").text(product.guaranteetypetext);
            $("#product-step").text(product.step);
            $("#product-typetext").text(product.typetext);
            if (product.status < 5) {
                $("#product-bidcount-text").text(product.appointment + "人已预约");
            } else {
                $("#product-bidcount-text").text(product.bidcount + "人已投资");
            }
        } else {
            $.alertF(data.errormsg, null, history.back());
        }
    });
    setTimeout(getCurrentProduct, 30000);
};