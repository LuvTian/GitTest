//催收委托书
$(function () {
    var bidid = $.getQueryStringByName("bidid");
    var loanid = $.getQueryStringByName("loanid");
    if (bidid.length > 0) {
        getUserInfo();
        if (loanid.length < 0) {
            getLoanInfo1(bidid);
        } else {
            getLoanInfo2(bidid, loanid);
        };
    }
});

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/infouncode";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;
            var userName = account.username;
            $("#userName").html(userName);
            $("#userName2").html(userName);
            $("#userName3").html(userName);
            $("#cardId").html(account.idnumber);
            $("#userPhone").html(account.mobile);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var getLoanInfo1 = function (productid) {
    var url = "/StoreServices.svc/trans/loanbid";
    var paramter = {
        "productid": productid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $("#transferagreement").html(tranList[0].loantitle);
            $("#transferid").html(tranList[0].contractid);
            $("#investTime").html(tranList[0].createdtime);
            $("#borrowename").html(tranList[0].createdtime);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
}
var getLoanInfo2 = function (productid, loanid) {
    var url = "/StoreServices.svc/trans/loanbiditem";
    var paramter = {
        "loanid": loanid,
        "productid": productid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var info = data.loanbiditem;
            $("#transferagreement").html(info.loantitle);
            $("#transferid").html(info.contractid);
            $("#investTime").html(info.createdtime);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF("数据加载异常！");
        }
    });
}