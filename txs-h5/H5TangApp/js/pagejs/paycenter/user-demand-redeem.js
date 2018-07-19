$(function () {
    $("#user-demand-amount").val("");
    getUserInfo();
    redeemall();
});
var type = $.getQueryStringByName("type");
var maxlimit = 0;
var dailyamount = 0;
var canredeem = 0;
var initPage = function () {
    if (type == 1) {
        //document.title = "赎回收益";
        $("#panel2").show();
        $("#panel1").hide();
    } else {
        $("#panel1").show();
        $("#panel2").hide();
    }
};

var account = [];
var _interval;
var _intervalTimeout;
var tradeno = "";
var password = "";
var currentDate = "";

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    var param = type == 1 ? {} : { "curdaywithdraw": true }
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            currentDate = data.date;
            if (data.ismaintenance) {
                window.location.replace("/html/system/data-processing.html");
                return;
            }
            if (data.isglobalmaintenance) {
                window.location.replace("/html/system/system-maintenance.html");
                return;
            }
            //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                $(".basic").html("僧财宝");
            }
            dailyamount = account.dailyamount;
            maxlimit = account.dailyamountlimit;
            $("#maxlimit").text(maxlimit / 10000);
            canredeem = maxlimit - account.dailyamount;
            canredeem = canredeem > account.demandbalance ? account.demandbalance : canredeem;
            $("#currentwithdraw").text($.fmoney(dailyamount));
            $("#user-demand-amount").attr("placeholder", "最多可赎回" + $.fmoney(canredeem));
            if (!$.CheckAccountCustomStatusBeforeNext(account)) {
                return;
            }
            // if (account.customstatus < 2) {
            //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            //     return;
            // }
            // if (account.customstatus < 3) {
            //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
            //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
            //     });
            //     return;
            // }
            initPage();
            $("#user-demand-balance").text($.fmoney(account.demandbalance));
            $("#user-demand-profit").text($.fmoney(account.demandprofit));
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

//检查新浪设置。
var checkiswithholdauthoity = function () {
    if (!$.CheckAccountCustomStatusBeforeNext(account)) {
        return;
    }
    // if (account.customstatus < 2) {
    //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
    //     return;
    // }
    // if (account.customstatus < 3) {
    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
    //     });
    //     return;
    // }
    //直连模式
    if (account.iswithholdauthoity == 0)//未设置新浪支付密码
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/my/index.html";
        $.SetSinaPayPassword(returnurl, currentDate, account.referralcode, account.iscashdesknewuser);
    }
    else if (account.iswithholdauthoity == 1)//未设置委托代扣
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/html/paycenter/user-demand-redeem.html";
        $.WithholdAuthority(returnurl, demand_redeem, account.referralcode);
    }
    else {
        //收银台模式
        password = "";
        demand_redeem();
    }
}

var demand_redeem = function () {
    var amount = $("#user-demand-amount").val();
    amount = parseFloat(amount);
    var balance = account.demandbalance;
    if (isNaN(amount) || amount <= 0) {
        $.alertF("金额不正确,请检查输入");
        return;
    }
    if (amount > balance) {
        $.alertNew("超出可转出金额", "", null, "", "limit-icon-bar")
        //$.alertF("超过您可赎回金额");
        return;
    }
    if (amount > canredeem) {
        $.alertNew("超过您的可赎回金额");
        return;
    }

    //直连模式
    if (account.iswithholdauthoity != 0) {
        $.PaymentHtmlNew(amount, "赎回金额", function (password) {
            $.closePWD();
            redeem(password, amount, 2);
        }, null, null);
    }
};
var redeem = function (password, amount, redeemtype) {
    var url = "/StoreServices.svc/product/demandredeem";
    var data = {
        paypassword: password,
        amount: amount,
        redeemtype: redeemtype
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        $(".reset").click();
        if (data.result) {
            tradeno = data.tradeno;
            $.showLoader("<img src='"+$.resurl()+"/css/img2.0/redeem1.gif' /><p class='gray-font'>赎回正在处理中……</p>");
            _interval = setInterval('getRedeemStatus()', 5000);
            _intervalTimeout = setTimeout(function () {
                clearInterval(_interval);
                $.hideLoader();
                $.alertNew("系统繁忙,请稍后再试", null, function () { window.location.reload(); });
            }, 60000);
        } else if (data.errorcode == "20018") {
            $.alertNew(data.errormsg, null, function () {
                $.PaymentHtmlNew(amount, "", function (password) {
                    $.closePWD();
                    redeem(password, amount, redeemtype);
                }, null, null);
            });
        }
        else if (data.errorcode == "20019") {
            $.confirmF(data.errormsg, null, "去重置", function () {
            }, function () {
                window.location.href = "/html/my/resetpassword.html";
            });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else if (data.errorcode == 'missing_parameter_userinfo') {
            $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
        } else {
            $.alertNew(data.errormsg);
        }
    });
};

var getRedeemStatus = function () {
    var url = "/storeservices.svc/trans/item";
    var data = {
        tranid: tradeno + "",
        trantype: 3
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            if (data.transitem.status == 2) { //成功
                $.hideLoader();
                clearInterval(_interval);
                clearTimeout(_intervalTimeout);
                if (type == 1) {
                    $.alertNew("赎回成功", null, function () {
                        window.location.replace("/html/my/");
                    }, null, "icon-my-sigh-ok");
                }
                else {
                    window.location.replace("/html/paycenter/operation-success.html?type=demand-redeem&paymentdate=" + data.date + "&amount=" + $("#user-demand-amount").val() + "&product=" + encodeURIComponent('至尊宝') + "&status=" + encodeURIComponent('已从至尊宝赎回到账户') + "&title=" + encodeURIComponent('赎回成功'));
                }
            } else if (data.transitem.status == 3) { //失败
                clearInterval(_interval);
                clearTimeout(_intervalTimeout);
                $.alertF(data.errormsg);
            }
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
    });
};

var redeemall = function () {
    $(".all").click(function () {
        $("#user-demand-amount").val(canredeem);
    });
}

