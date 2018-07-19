

//开通/关闭资金自动转入至尊宝
"use strict"
$(function () {
    getUserInfo();
    $("#auto-switch").click(function () {
        tishi(autoSwitchDemand, function () {

        });
    });
});

var url;
var paramter = {};
var accountResult;
var account = [];
var getUserInfo = function () {
    url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            accountResult = data;
            account = accountResult.accountinfo;
            if (accountResult.accountinfo.autoswitchdemand) {
                $("#exampleCheckboxSwitch4").prop("checked", true);
            }
            else {
                $("#exampleCheckboxSwitch4").prop("checked", false);
            }
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
    });
};

var autoSwitchDemand = function () {
    accountResult.accountinfo.autoswitchdemand = !accountResult.accountinfo.autoswitchdemand;
    url = "/StoreServices.svc/userservice/agreeautoswitchdemandprotocol";
    paramter = { "autoswitchdemand": (accountResult.accountinfo.autoswitchdemand == true ? 1 : 0) }

    if (paramter.autoswitchdemand == 1 && !checkiswithholdauthoity()) {
        return;
    }

    $.AkmiiAjaxPost(url, paramter).then(function (data) {
        if (data.result) {
            $("#exampleCheckboxSwitch4").prop("checked", accountResult.accountinfo.autoswitchdemand);
            //$.alertNew("自动转入已" + (accountResult.accountinfo.autoswitchdemand == true ? "开通" : "关闭"), "", function () {
            //    history.go(-1);
            //}, "提示", "");
            history.go(-1);
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
        else {
            $.alertNew(data.errormsg);
        }
    });
}

var tishi = function (lcallback, rcallback) {
    var ha = [];
    ha.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');

    ha.push('<div style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;">');
    ha.push('<h1 style="font-size: 1.8rem;padding:2rem;">');
    ha.push('提示');
    ha.push('</h1>');
    ha.push('<p style="color:#979797;  text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0');
    ha.push('1rem 2rem 1rem;border-bottom: 1px solid #ccc;">');
    ha.push('若关闭余额自动转入至尊宝功能，您的账户资金无法实现收益最大化，确认要关闭吗？');
    ha.push('</p>');
    ha.push('<div class="row">');
    ha.push('<a id="aOK" href="javascript:void(0)" class="small-6 columns" style="color:#bcbcbc;font-size: 1.6rem;line-height:3;display:block;border-right:1px solid #ccc">');
    ha.push('确认');
    ha.push('</a>');
    ha.push('<a id="aCacel" href="javascript:void(0)" class="small-6 columns" style="color:#C54846;font-size: 1.6rem;line-height:3;display:block">');
    ha.push('取消');
    ha.push('</a>');
    ha.push('</div></div>');
    var html = $(ha.join(''));

    html.find('#aOK').click(function () {
        html.remove();
        if (lcallback && lcallback instanceof Function) {
            lcallback();
        }
    });
    html.find('#aCacel').click(function () {
        html.remove();
        if (rcallback && rcallback instanceof Function) {
            rcallback();
        }
    });
    $("body").append(html);
}


//检查新浪设置。
var checkiswithholdauthoity = function () {
    if (!$.CheckAccountCustomStatusBeforeNext(account)) {
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