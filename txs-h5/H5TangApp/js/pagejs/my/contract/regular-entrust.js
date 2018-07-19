/// <reference path="/_references.js" />


$(function () {
    if (!$.isNull(id)) {
        getUserInfo();
        getBid(bidid);
    }
});

var amount = $.getQueryStringByName("amount") || "";
var id = $.getQueryStringByName("id");
var legal = $.getQueryStringByName("legal") || "";
var manager = $.getQueryStringByName("manager") || "";
var remark = $.getQueryStringByName("remark") || "";
var spvno = $.getQueryStringByName("spvno") || "";
var spvtitle = $.getQueryStringByName("spvtitle") || "";
var tel = $.getQueryStringByName("tel") || "";
var spvprotoal = $.getQueryStringByName("spvprotoal") || "";
var bidid = $.getQueryStringByName("bidid") || "";

amount = decodeURIComponent(amount);
legal = decodeURIComponent(legal);
manager = decodeURIComponent(manager);
remark = decodeURIComponent(remark);
spvno = decodeURIComponent(spvno);
spvtitle = decodeURIComponent(spvtitle);
tel = decodeURIComponent(tel);
spvprotoal = decodeURIComponent(spvprotoal);
bidid = decodeURIComponent(bidid);

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/infouncode";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;
            $("#userName").html(account.username);
            $("#userName3").html(account.username);
            $("#cardId").html(account.idnumber);
            $("#userPhone").html(account.mobile);

            $("#spvtitle").html(spvtitle);
            $("#transferagreement").html(spvprotoal);
            $("#transferid").html(id);
            //$("#investTime").html(created);
            $("#borrowename").html(legal);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var getBid = function (id) {
    var url = "/StoreServices.svc/product/bid";
    var param = {
        productbidid: id
    };
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            product = data.productbid;
            $("#investTime").html(product.realbiddate);
        }
    });
}
