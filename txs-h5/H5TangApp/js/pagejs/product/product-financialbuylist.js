$(function () {
    financialamount();
});

//理财金余额
function financialamount() {
    var url = "/StoreServices.svc/user/financiallist?v=" + (new Date()).getTime();
    $.AkmiiAjaxPost(url, { "onlysumamount": true }, true).then(function (data) {
        if (data.result) {
            //理财金总金额
            $(".financialamount").html($.fmoney(data.sumamount));
        }
    });
}

//理财金余额跳转链接
$(".financialamountlink").click(function () {
    window.location.href = "/Html/My/financiallist.html";
});

//理财金记录跳转链接
$(".financialbidlistlink").click(function () {
    window.location.href = "/html/my/my-financial-index.html";
});

//理财金购买跳转链接
$(".financialproduct").click(function () {
    window.location.href = "/html/product/productfinancialbuy.html";
});