
//开通/关闭资金自动转入至尊宝
"use strict"
$(function () {
    getUserInfo();
});

var url;
var paramter = {};
var accountResult;
var autoSwitchDemand = function () {
    url = "/StoreServices.svc/userservice/agreeautoswitchdemandprotocol";
    paramter = { "autoswitchdemand": 1 }
    if (!checkiswithholdauthoity()) {
        return;
    }
    $.AkmiiAjaxPost(url, paramter).then(function (data) {
        if (data.result) {
            window.location.replace("/Html/Product/index-demand.html");
            //window.location.href=history.go(-1);
            //$.alertNew("您的投资将在回款当日回款至账户余额，账户余额将在次日凌晨自动转入至尊宝", "", function () {
            //    history.go(-1);
            //}, "提示", "");
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
        else {
            $.alertNew(data.errormsg);
        }
    });
}

var account = [];
var getUserInfo = function () {
    url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            if (account.autoswitchdemand) {
                window.location.replace("/Html/Product/index-demand.html");
            } else {
                $("#switch-open").click(function () { autoSwitchDemand(); });
                $("#switch-unopen").click(function () { history.back(); });
            }
              //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                $("#accountjpg").attr("src", $.resurl()+"/css/img2.0/scbautomatic-product.png");
            } 
            
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
    });
};

//检查新浪设置。
var checkiswithholdauthoity = function () {
    if(!$.CheckAccountCustomStatusBeforeNext(account)){
        return;
    }
    // if (account.customstatus < 2) {
    //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
    //     return false;
    // }
    // if (account.customstatus < 3) {
    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
    //     });
    //     return false;
    // }
    //直连模式
    if (account.iswithholdauthoity == 0)//未设置新浪支付密码
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
        $.SetSinaPayPassword(returnurl, accountResult.date, account.referralcode, account.iscashdesknewuser);
        return false;
    }
    else if (account.iswithholdauthoity == 1)//未设置委托代扣
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
        $.WithholdAuthority(returnurl, null, account.referralcode, true);
        return false;
    } else {
        return true;
    }
}