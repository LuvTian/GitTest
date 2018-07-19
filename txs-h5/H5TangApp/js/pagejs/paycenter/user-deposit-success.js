$(function () {
    getUserInfo();
    getDepositStatus();
});
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;
            $("#user-card-code").text(account.cardcode);
            $("#user-bank-name").text(account.bankname);
            //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                $(".depositbtntext").html("转入");
                $.UpdateTitle("转入");
            } 
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.alertF("请先登录", null, $.Loginlink);
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var getDepositStatus = function () {
    var url = "/storeservices.svc/trans/deposititem";
    var data = {
        tranid: $.getQueryStringByName("id")
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.errorcode == "missing_parameter_accountid") {
            $.alertF("请先登录", null, $.Loginlink);
            return;
        } else {
            $("#user-deposit-status-text").text("完成，预计10分钟内到账");
            $("#user-deposit-amount").text(data.transitem.tranamount);
        }
    });
};

var gotoRegistStep = function () {
    window.location.href = "/html/my/regist-step.html";
};