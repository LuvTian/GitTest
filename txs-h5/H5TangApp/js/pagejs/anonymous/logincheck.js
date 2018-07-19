/// <reference path="/_references.js" />


$(function () {
    var phone = $.getQueryStringByName("phone");
    var imgcode = $.getQueryStringByName("imgcode");
    var imgkey = $.getQueryStringByName("imgkey");
    var returnurl = $.getQueryStringByName("returnurl"); //登录后跳转的地址

    var $txtInvitedBy = $("#txtInvitedBy"); //推荐码

    var $phnoe = $("#phnoe");
    var $txtYZM = $("#txtYZM"); //手机验证码

    $phnoe.html($.HideMobile(phone));

    $.GetYzm("getYZM", 60);

    $("#loginSubmit").click(function () {
        //登录
        if (!$.isMobilePhone(phone)) {
            $.alertF("手机号码非法", "确定");
            return;
        }
        if ($.isNull($txtYZM.val()) || $txtYZM.val().length != 6) {
            $.alertF("请输入6位数字的短信验证码！");
            return;
        }

        var data = {
            "mobile": phone,
            "smscode": $txtYZM.val(),
            "imgkey": imgkey
        };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/loginverification", data, false).then(function (d) {
            if (d.result) {
                //判断已注册用户是否进行过升级
                $.AkmiiAjaxPost("/StoreServices.svc/userservice/getcompliancebyaccountid", {}, false).then(function (result) {
                    var complianceInfo = result.complianceinfo;
                    //已升级
                    if (complianceInfo.registerupgrade) {
                        _gsq.push(["T", "GWD-002985", "track", "/targetpage/login_success"]);
                        //$.weuiLoading();
                        $.CheckAccountCustomStatusRedirect(returnurl, null, true);
                    } else {
                        window.location.replace("/html/Anonymous/criterion-login.html?returnurl=" + returnurl);
                    }
                });
                return;
            } else {
                $.alertF(d.errormsg);
            }
        });
    });

    //获取验证码
    $("#getYZM").click(function () {
        if (!$.isMobilePhone(phone)) {
            $.alertF("请输入正确的手机号码！");
            return;
        }
        if ($.isNull(imgkey) || $.isNull(imgcode)) {
            $.alertF("参数非法");
            return;
        }
        //获取验证码
        var data = {
            "mobile": phone,
            "imgcode": imgcode,
            "imgkey": imgkey
        };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(function (d) {
            if (d.result) {
                $.GetYzm("getYZM", 60);
            } else {
                $.alertF(d.errormsg);
            }
        });
    });

});