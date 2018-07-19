//合规 安全保障
var productId;
$(function () {
    productId = $.getQueryStringByName("id");
    getSafetyList();
});

var getSafetyList = function () {
    var url = "/StoreServices.svc/product/safetylist";
    var paramter = {
        productid: productId
    }
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var htmlDom = data.assetprofile;
            $("#safetyList").append(analysisStr(htmlDom));//
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var analysisStr = function (str) {
    var ha = [];
    var arry = str.split("\n");
    $.each(arry, function (index, entry) {
        ha.push("<dd><b></b><span>"+entry+"</span></dd>");
    });
    return ha.join("");
}
