//担保承诺函
var pid = "";
$(function () {
    pid = $.getQueryStringByName("pid");
    if (pid.length>0) {
        getProductInfo();
    }
})

var getProductInfo = function ()
{
    var url = "/StoreServices.svc/product/item";
    var paramter = {
        productid: pid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var info = data.productinfo;
            $("#productName").html("&nbsp;&nbsp;" + info.title + "&nbsp;&nbsp;");
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
}
