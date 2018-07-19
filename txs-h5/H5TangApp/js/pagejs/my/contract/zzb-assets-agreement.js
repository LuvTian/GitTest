/// <reference path="/_references.js" />


$(function () {
    if (!$.isNull(id)) {
        getUserInfo();
    }
});

var amount = $.getQueryStringByName("amount") || "";
var created = $.getQueryStringByName("created") || "";
var id = $.getQueryStringByName("id");
var legal = $.getQueryStringByName("legal") || "";
var manager = $.getQueryStringByName("manager") || "";
var remark = $.getQueryStringByName("remark") || "";
var spvno = $.getQueryStringByName("spvno") || "";
var spvtitle = $.getQueryStringByName("spvtitle") || "";
var tel = $.getQueryStringByName("tel") || "";
var spvprotoal = $.getQueryStringByName("spvprotoal") || "";

amount = decodeURIComponent(amount);
created = decodeURIComponent(created);
legal = decodeURIComponent(legal);
manager = decodeURIComponent(manager);
remark = decodeURIComponent(remark);
spvno = decodeURIComponent(spvno);
spvtitle = decodeURIComponent(spvtitle);
tel = decodeURIComponent(tel);
spvprotoal = decodeURIComponent(spvprotoal);

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/infouncode";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;

            $("#spvtitle1,#spvtitle2,#spvtitle3").text(spvtitle);
            $("#username").text(account.username);
            $("#usercardid").text(account.idnumber);
            $("#usertel").text(account.mobile);
            $("#id").text(id);
            $("#legal").text(legal);
            $("#manager").text(manager);
            $("#amount").text($.fmoney(amount));
            $("#spvname").text(spvprotoal);
            $("#spvname1").text(spvprotoal);

        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};
