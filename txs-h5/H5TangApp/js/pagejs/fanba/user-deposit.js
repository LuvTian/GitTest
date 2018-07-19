var _BankMaintain = new BankMaintain();
_BankMaintain.getData();
//充值成功新浪返回
var tid = $.getQueryStringByName("tid") || "";
var success_returnurl = $.getQueryStringByName("returnurl") || "";
var user_deposit_url = window.location.origin + "/html/fanba/user-deposit.html";
var reset_password_url = window.location.origin + "/html/my/resetpassword.html?returnurl=" + encodeURIComponent(success_returnurl);
$(function() {
    $("#user-deposit-amount").val("");
    $("#user-deposit-firstdesc").hide();

    getUserInfo(function() {
        $("#user-deposit-btn,#user-deposit-getcode").click(function() {
            checkiswithholdauthoity();
        });
    });

    /*
     * 跳转新浪的同步回调地址，不能超过200个字符串
     * 所以减少回调地址长度，去掉链接参数
     * 存储在本地
     */
    //不是新浪回调才写本地缓存
    if (!tid) {
        $.setLS("fanba_deposit_r_url", success_returnurl);
    }

    //充值成功后，如果页面参数有returnurl则跳转
    //默认跳转到我的页面
    $("#user-deposit-success").click(function(e) {
        e.preventDefault();
        var fanba_deposit_r_url = $.getLS("fanba_deposit_r_url")
        if (fanba_deposit_r_url) {
            window.location.replace(decodeURIComponent(fanba_deposit_r_url));
        } else {
            history.back();
        }
    });
});
var account = [];
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
            if (account.customstatus < 3) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplinkFanba);
            }
            $("#user-basic-balance").text($.fmoney(account.basicbalance));
            $("#user-card-name").text(account.bankname);
            $("#user-card-code").text(account.cardcode);
            $("#user-card-phone").text(account.bankmobile);
            $("#user-card-phone-text").text(account.bankmobile);

            $("#user-card-code-text").text(account.cardcode);
            $("#user-bank-name-text").text(account.bankname);

            //if (account.depositneedadvance) {
            //    $("#user-deposit-firstdesc").show();
            //    $("#user-deposit-first-amount").show();
            //    $("#user-deposit").hide();
            //    $("#user-deposit-amount").val(5);
            //} else {
            $("#user-deposit-firstdesc").hide();
            $("#user-deposit-first-amount").hide();
            $("#user-deposit").show();
            //}
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
var password = "";
var amount = "";
var currentDate = "";


//检查新浪设置。
var checkiswithholdauthoity = function() {
    if (account.customstatus < 3) {
        $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplinkFanba);
        return;
    }
    switch (account.iswithholdauthoity) {
        //未设置新浪支付密码
        case 0:
            var returnurl = window.location.origin + "/eback.html?r=" + user_deposit_url;
            $.SetSinaPayPassword(returnurl, currentDate, account.referralcode, account.iscashdesknewuser);
            break;
        case 1:
            var returnurl = window.location.origin + "/eback.html?r=" + user_deposit_url;
            $.WithholdAuthority(returnurl, deposit_OnClick, account.referralcode);
            break;
            //按道理来讲这个状态是不会存在的
        case 2:
        case 3:
            deposit_OnClick();
            break;
        default:
            break;
    }
}

var deposit_OnClick = function() {
    amount = $("#user-deposit-amount").val();
    if (amount == "" && isNaN(amount)) {
        $.alertF("请输入正确的金额" + amount);
        return;
    }
    if (amount < 5 || amount > account.depositsinglemax) {
        $.alertF("单笔充值金额需大于5元且小于" + account.depositsinglemax + "元");
        return;
    }
    //银行维护信息
    if (!_BankMaintain.checkMaintain()) {
        return;
    }
    if (account.iswithholdauthoity == 3) {
        $.PaymentHtml(null, function(pwd) {
            password = pwd;
            deposit(null);
        }, function() {});
    } else {
        var returnurl = user_deposit_url;
        //returnurl += (returnurl.indexOf("?") > -1 ? "&" : "?") + "c=" + encodeURIComponent(account.cardcode) + "&b=" + encodeURIComponent(account.bankname) + "&a=" + encodeURIComponent(amount);
        deposit(returnurl);
    }
};

var deposit = function(returnurl) {
    var url = "/StoreServices.svc/trans/deposit";
    var data = {
        amount: amount,
        paypassword: password,
        returnurl: decodeURIComponent(returnurl)
    };
    $("#user-deposit-amount-text").text(amount);
    $.AkmiiAjaxPost(url, data, false).then(function(data) {
        if (data.result) {
            if (!$.isNull(data.redirecturl)) {
                document.write(data.redirecturl);
                return;
            }
            $.closeWinDivPWD();
            tradeno = data.tradeno;
            $.showLoader("<img src='/css/img2.0/redeem1.gif' /><p class='gray-font'>充值正在处理中……</p>");

            _interval = setInterval('getDepositStatus()', 5000);
            _intervalTimeout = setTimeout(function() {
                clearInterval(_interval);
                gotoSuccess();
            }, 60000);

        } else if (data.errorcode == "20019") {
            $.confirmF(data.errormsg, null, "去重置", function() {
                $(".reset").click();
            }, function() {
                window.location.href = reset_password_url;
            });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $("#_hiddenPaymentPwd").val("");
            $("#az-showmasker-Textpwd").find(".pasdbox span").text("");
            $.alertF(data.errormsg);
        }
    });
};

var deposit_advance = function() {
    var data = {
        tradeno: tradeno,
        securitycode: $("#user-deposit-code").val()
    }
    var url = "/storeservices.svc/trans/depositadvance";
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            $.showLoader("<img src='/css/img2.0/redeem1.gif' /><p class='gray-font'>充值正在处理中……</p>");

            _interval = setInterval('getDepositStatus()', 5000);
            _intervalTimeout = setTimeout(function() {
                clearInterval(_interval);
                gotoSuccess();
            }, 60000);
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var getDepositStatus = function() {
    var url = "/storeservices.svc/trans/item";
    var data = {
        tranid: tradeno + "",
        trantype: 1
    };
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            $("#user-deposit-amount-text").text(data.transitem.tranamount);
            if (data.transitem.status == 2) { //成功
                gotoSuccess();
            } else if (data.transitem.status == 3) { //失败
                $.alertF(data.errormsg, null, function() {
                    window.location.href = this.location.href;
                });
            } else if (data.transitem.status == 10) {
                showAdvance();
            } else if (data.transitem.status == 0) {
                //NOTHING TODO
            } else if (data.errormsg == "提交成功") {
                //NOTHING TODO
            } else {
                clearInterval(_interval);
                clearTimeout(_intervalTimeout);
                $.alertF(data.errormsg);
                nextButtonStyle(0);
                $.GetYzm("user-deposit-getcode", 1);
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

    $("#rechargepage").hide();
    $("#user-deposit-advance").hide();
    $("#rechargesuccess").show();
};

var showAdvance = function() {
    $.hideLoader();

    $("#user-deposit-advance").show();
    $("#rechargepage").hide();
    $("#rechargesuccess").hide();

    clearInterval(_interval);
    clearTimeout(_intervalTimeout);

    $.GetYzm("user-deposit-getcode", 120);

    nextButtonStyle(1);
};

//控制下一步颜色显示  0:置灰
var nextButtonStyle = function(i) {
    if (i == 0) {
        $("#user-deposit-advance-next").css("background-color", "gray");
        $("#user-deposit-advance-next").attr("href", "javascript:;");
    } else {
        $("#user-deposit-advance-next").css("background-color", "#eb4936");
        $("#user-deposit-advance-next").attr("href", "javascript:deposit_advance()");
    }
};


var returnSuccess = function(tid) {
    tradeno = tid;
    $.showLoader("<img src='/css/img2.0/redeem1.gif' /><p class='gray-font'>充值正在处理中……</p>");

    _interval = setInterval('getDepositStatus()', 5000);
    _intervalTimeout = setTimeout(function() {
        clearInterval(_interval);
        gotoSuccess();
    }, 60000);
}