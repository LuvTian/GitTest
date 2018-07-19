﻿//充值成功新浪返回
var tid = $.getQueryStringByName("tid");

$(function() {
    $("#user-withdraw-amount").val("");

    getUserInfo(function() {
        $("#user-withdraw").click(function() {
            checkiswithholdauthoity();
        });
    });
    checkTXprice();
});
var account = [];
var currentDate = "";
var withdrawtext = "提现";
// 春节期间提现控制
var checkTXprice = function() {
    var curdate = (new Date()).getTime();
    var dstart = (new Date('2018/02/15 00:00')).getTime();
    var dend = (new Date('2018/02/22 12:00')).getTime();
    if (curdate >= dstart && curdate <= dend) {
        $('.je1').hide();
        $('.je2').show();
    }
};
var getUserInfo = function(callback) {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
        if (data.result) {
            currentDate = data.date;
            account = data.accountinfo;
            if (data.isglobalmaintenance) {
                window.location.replace("/html/system/system-maintenance.html");
                return;
            }
            $.CheckAccountCustomStatusBeforeNext(account);
            // if (account.customstatus < 2) {
            //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            // }
            // if (account.customstatus < 3) {
            //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
            //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
            //     });
            // }
            $("#user-basic-balance").text($.fmoney(account.basicbalance));
            $("#user-card-name").text(account.bankname);
            $("#user-card-code").text(account.cardcode);

            $("#user-card-code-text").text(account.cardcode);
            $("#user-bank-name-text").text(account.bankname);
            if (account.basicbalance <= 5 && account.basicbalance > 0) {
                $("#user-withdraw-amount").val(account.basicbalance);
            }
            //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                $(".withdrawtext").html("转出");
                $("#user-withdraw").html("转出");
                $(".basic").html("僧财宝");
                $(".accounttext").html("僧财宝");
                $.UpdateTitle("转出");
                withdrawtext = "转出";
            }
            if (callback && callback instanceof Function) {
                callback();
            }

            if (!$.isNull(tid)) {
                returnSuccess(tid);
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var _interval;
var _intervalTimeout;
var tradeno = "";

//检查新浪设置。
var checkiswithholdauthoity = function() {
    if (!$.CheckAccountCustomStatusBeforeNext(account)) {
        return;
    }
    // if (account.customstatus < 2) {
    //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
    //     return;
    // }
    // if (account && account.customstatus < 3) {
    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
    //     });
    //     return;
    // }
    switch (account.iswithholdauthoity) {
        //未设置新浪支付密码
        case 0:
            var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/my/index.html";
            $.SetSinaPayPassword(returnurl, currentDate, account.referralcode, account.iscashdesknewuser);
            break;
        case 1:
            //var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/PayCenter/user-withdraw.html";
            //$.WithholdAuthority(returnurl, withdraw_onclick, account.referralcode);
            //break;
            //按道理来讲这个状态是不会存在的
        case 2:
        case 3:
            withdraw_onclick();
            break;
        default:
            break;
    }
}


var withdraw_onclick = function() {

    var amount = $("#user-withdraw-amount").val();
    var userbalance = account.basicbalance;
    if (amount == "" || isNaN(amount) || parseFloat(amount) == 0) {
        $.alertF("请输入正确的金额");
        return;
    }
    if ((userbalance) < parseFloat(amount)) {
        $.alertF("余额不足");
        return;
    }
    if (userbalance >= 5 && Number(amount) < 5) {
        $.alertF("" + withdrawtext + "最低限额5元");
        return;
    }
    if (userbalance < 5 && Number(amount) < userbalance) {
        $.alertF("余额小于5元，必须全部" + withdrawtext + "");
        return;
    }
    // if (Number(amount) > 50000) {
    //     $.alertF("单笔" + withdrawtext + "最高限额5万元");
    //     return;
    // }

    $("#user-withdraw-amount-text").text(amount);
    // $.PaymentHtml(null, function (password) {
    var url = "/StoreServices.svc/trans/withdraw";
    var returnurl = window.location.origin + "/Html/PayCenter/user-withdraw.html";
    //returnurl += (returnurl.indexOf("?") > -1 ? "&" : "?") + "c=" + encodeURIComponent(account.cardcode) + "&b=" + encodeURIComponent(account.bankname) + "&a=" + encodeURIComponent(amount);
    var data = {
        amount: amount,
        paypassword: "",
        returnurl: returnurl
    };
    $.AkmiiAjaxPost(url, data).then(function(data) {
        if (data.result) {
            if (!$.isNull(data.redirecturl)) {
                document.write(data.redirecturl);
                return;
            }
            //$.closeWinDivPWD();
            //tradeno = data.tradeno;
            //$.showLoader("<img src='/css/img2.0/redeem2.gif' /><p class='gray-font'>提现正在处理中……</p>");

            //_interval = setInterval('getDepositStatus()', 5000);
            //_intervalTimeout = setTimeout(function () {
            //    clearInterval(_interval);
            //    gotoSuccess();
            //}, 60000);

        } else if (data.errorcode == "20019") {
            $.confirmF(data.errormsg, null, "去重置", function() {
                $(".reset").click();
            }, function() {
                window.location.href = "/html/my/resetpassword.html";
            });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else if (data.errorcode == 'trans_without_nonsupport') {
            $.alertF(data.errormsg, null, null, true, "温馨提示");
        } else {
            $("#_hiddenPaymentPwd").val("");
            $("#az-showmasker-Textpwd").find(".pasdbox span").text("");
            $.alertF(data.errormsg);
        }
    });
    //}, function () {

    //});
};

var getDepositStatus = function(tranno) {
    var url = "/storeservices.svc/trans/item";
    var data = {
        tranid: tradeno + "",
        trantype: 2
    };
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            $("#user-withdraw-amount-text").text(data.transitem.tranamount);
            if (data.transitem.status == 1 || data.transitem.status == 2) { //成功
                gotoSuccess();
            } else if (data.transitem.status == 3) { //失败
                $.alertF(data.errormsg, null, function() {
                    window.location.href = this.location.href;
                });
            } else if (data.transitem.status == 0) {
                //NOTHING TODO
            } else if (data.errormsg == "提交成功") {
                //NOTHING TODO
            } else {
                clearInterval(_interval);
                clearTimeout(_intervalTimeout);
                $.alertF(data.errormsg);
            }
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
    });
};

var gotoSuccess = function() {
    $.hideLoader();
    clearInterval(_interval);
    clearTimeout(_intervalTimeout);
    _gsq.push(["T", "GWD-002985", "track", "/targetpage/withdraw_success"]);
    $("#div-user-withdraw").hide();
    $("#rechargesuccess").show();
};


var returnSuccess = function(tid) {
    tradeno = tid;
    $.showLoader("<img src='" + $.resurl() + "/css/img2.0/redeem2.gif' /><p class='gray-font'>" + withdrawtext + "正在处理中……</p>");

    _interval = setInterval('getDepositStatus()', 5000);
    _intervalTimeout = setTimeout(function() {
        clearInterval(_interval);
        gotoSuccess();
    }, 60000);
}