/// <reference path="/_references.js" />
//var pwdglobal = "";

$(function () {
    $(document).foundation();
    var phone = $.getQueryStringByName("phone");
    var imgcode = $.getQueryStringByName("imgcode");
    var imgkey = $.getQueryStringByName("imgkey");
    var backurl = $.getQueryStringByName("backurl");//登录后跳转的地址
    if ($.isNull(phone) || $.isNull(imgkey) || $.isNull(imgcode)) {

    }
    var $txtYZM = $("#txtYZM");

    $.GetYzm("getYZM", 10);

    $("#login").bind("click", function () {
        if (!$.isMobilePhone(phone)) {
            $.alertF("请输入正确的手机号码！");
            return;
        }
        if ($.isNull($txtYZM.val())) {
            $.alertF("请输入验证码！");
            return;
        }
        var data = { "LoginName": "" + phone, "Yzm": $txtYZM.val() };
        $.AkmiiAjaxPost("/Service.svc/Anonymous/user/loginverification", data).then(function (d) {
            if (d.result) {
                //登录成功
                $.alertF("登录成功");
                //TODO:+判断没有设置支付密码的。。。。
            }
            else {
                $.alertF(d.errormsg);
            }
        },
        function (d) {
            $.alertF("您的网络不好呦，请稍后再试！");
        });
    });

    //获取验证码
    $("#getYZM").bind("click", function () {
        if (!$.isMobilePhone(phone)) {
            $.alertF("请输入正确的手机号码！");
            return;
        }
        var data = { "LoginName": "" + phone };
        $.AkmiiAjaxPost("/Service.svc/Anonymous/LoginOrRegisterSendMobileYzm", data).then(
            function (d) {
                if (d.result) {
                    $.GetYzm("getYZM", 10);
                }
            });
    });


});


