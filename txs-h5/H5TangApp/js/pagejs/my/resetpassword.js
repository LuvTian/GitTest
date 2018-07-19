/// <reference path="//_references.js" />

var $updatepwd = $("#updatepwd"); //修改交易密码按钮
var $getYZM = $("#getYZM"); //获取验证码
var $sms = $("#sms"); //验证码
var $cardid = $("#cardid"); //身份证号码
var $next = $("#next"); //下一步
var success_returnurl = decodeURIComponent($.getQueryStringByName("returnurl") || "");


$(function() {
    $getYZM.click(function() {
        if ($.isNull($cardid.val()) || !$.isIdCardNo($cardid.val())) {
            $.alertF("身份证格式不正确");
            return;
        }

        url = "/StoreServices.svc/user/checkidnumbersendsmsresetpwd";
        param = {
            "idnumber": $cardid.val()
        };
        $.AkmiiAjaxPost(url, param).then(function(data) {
            if (data.result) {
                $.GetYzm("getYZM", 60);
                $("#next").removeClass("button buttongray2");
                $("#next").addClass("button expand");
                $("#next").attr("disabled", false);
            } else {
                $.alertF(data.errormsg);
            }
        });
    });
    $next.click(function() {
        if ($.isNull($cardid.val()) || !$.isIdCardNo($cardid.val())) {
            $.alertF("身份证格式不正确");
            return;
        }
        if ($.isNull($sms.val())) {
            $.alertF("请填写短信验证码");
            return;
        }
        if ($.isNull($sms.val()) || !$.isNumeric($sms.val())) {
            $.alertF("验证码格式不正确");
            return;
        }
        if ($sms.val().length != 6) {
            $.alertF("验证码只有6位数");
            return;
        }
        url = "/StoreServices.svc/user/checksmscodebytype";
        param = {
            "smstype": "resetpassword",
            "smscode": $sms.val()
        };
        $.AkmiiAjaxPost(url, param).then(function(data) {
            if (data.result) {
                showPayPwd();
            } else {
                $.alertF(data.errormsg);
            }
        });
    });

    var showPayPwd = function() {
        $.PaymentHtml("请输入新密码", firstCallBack, function() {});
        return;
    };

    var firstCallBack = function(data) {
        passWord = data;
        $.PaymentHtml("请再次输入新密码", retryCallBack, function() {})
    };
    var retryCallBack = function(data) {
        if (passWord != data) {
            $.alertF("密码不一致，请重新输入", null, showPayPwd);
            return;
        }
        setPayPwd();
    };

    var passWord = "";

    var setPayPwd = function() {
        var url = "/StoreServices.svc/user/resetpaymentpwd";
        var param = {
            "paymentpwd": passWord,
            "smscode": $sms.val()
        };
        $.AkmiiAjaxPost(url, param).then(function(data) {
            if (data.result) {
                $.alertF("重置密码成功", null, function() {
                    if (success_returnurl) {
                        window.location.href = success_returnurl;
                    } else {
                        history.back();
                        //window.location.href = "/html/my/index.html";
                    }
                });
            } else {
                $.alertF(data.errormsg, null, showPayPwd);
            }
        });
    };
});