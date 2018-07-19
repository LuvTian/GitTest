//企业收益赎回
$(function () {
    $("#transferout").css("background-color", "lightgray").unbind("click");
    getUserInfo();
});

var account = [];

//用户信息
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;
            if (account.customstatus < 3) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            } else if (account.customstatus == 3) {
                getBaseInfo();
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var getBaseInfo = function () {
    var qrContent = window.location.origin + "/landing.html?c=";
    var url = "/StoreServices.svc/store/getbusinesscenterindex";
    var param = {
        qrcontent: qrContent
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            account = data.businesscenter;
            var userType = "1,2";
            if (userType.indexOf(account.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            var availablebalance = account.availablebalance;
            $("#totalprofit").text($.fmoney(availablebalance) + "元");
            if (availablebalance == "0") {
                $("#transferout").css("background-color", "lightgray").unbind("click");
            }

        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    });
};

var _interval;
var _intervalTimeout;
var tradeno = "";

//判断输入金额
$("#amount").keyup(function () {
    var amount = $("#amount").val();
    if (amount <= 0 || $("#amount").val() == "") {
        $("#transferout").css("background-color", "lightgray").unbind("click");
    } else {
        $("#transferout").css("background-color", "#cd3830").unbind("click").bind("click", function () {
            transferout();
        });
    }
});

var transferout = function () {
    var amount = $("#amount").val();
    var userbalance = account.availablebalance;// $("#user-basic-balance").text();
    //userbalance = userbalance.replace(/,/g, '');
    if (amount == "" || isNaN(amount) || !/^(\d+(\.\d{1,2})?)$/g.test(amount)) {
        $.alertS("请输入正确的金额");
        return false;
    }
    if (parseFloat(amount) <= 0 || (userbalance) < parseFloat(amount)) {
        $.alertS("余额不足");
        return false;
    }
    else {
        $.PaymentHtmlNew(amount, "转出金额", function (password) {
            var url = "/StoreServices.svc/store/companyprofittransferout";
            var data = {
                amount: amount,
                paypassword: password
            };
            $.AkmiiAjaxPost(url, data).then(function (data) {
                $.closePWD();
                if (data.result) {
                    $.closeWinDivPWD();
                    tradeno = data.tradeno;
                    $.alertS("转出成功！", function () {
                        window.location.replace("/html/my/index.html");
                    });
                } else if (data.errorcode == "20018") {
                    $.alertNew(data.errormsg, null, function () {
                        transferout();
                    });
                }
                else if (data.errorcode == "20019") {
                    $.confirmF(data.errormsg, null, "去重置", function () {
                        $(".reset").click();
                    }, function () {
                        window.location.href = "/html/my/resetpassword.html";
                    });
                } else if (data.errorcode == "missAccountid") {
                    $.alertS(data.errormsg, function () {
                        $.Loginlink();
                    });
                } else {
                    $("#_hiddenPaymentPwd").val("");
                    $("#az-showmasker-Textpwd").find(".pasdbox span").text("");
                    $.alertS(data.errormsg);
                    return false;
                }
            });
        }, function () {
        });
    }
}