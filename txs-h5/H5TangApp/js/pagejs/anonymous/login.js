/// <reference path="/_references.js" />

$(document).foundation();
var $PhoneNo = $("#PhoneNo");
var $imgYZM = $("#imgYZM");
var $txtImgYZM = $("#txtImgYZM");
var returnurl = $.getQueryStringByName("returnurl");//跳转url

$(function () {
    if ($.CheckToken()) {
        if (returnurl) {
            window.location.replace(decodeURIComponent(returnurl));
        } else {
            window.location.replace("/html/my/");
        }
    };
    $.getImgYZM("imgYZM");//验证码

    $("#LoginNext").bind("click", function () {
        if (!$.isMobilePhone($PhoneNo.val())) {
            $.alertF("手机号码无效");
            return;
        }
        if ($.isNull($imgYZM.attr("alt"))) {
            $.alertF("请点击图形验证码刷新");
            return;
        }
        if ($.isNull($txtImgYZM.val())) {
            $.alertF("请输入验证码");
            return;
        }
        //获取验证码
        var data = { "mobile": $PhoneNo.val(), "imgcode": $txtImgYZM.val(), "imgkey": $imgYZM.attr("alt"), regnosms: true };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(
            function (d) {
                if (d.result) {
                    var str = "?phone=" + $PhoneNo.val() + "&imgcode=" + $txtImgYZM.val() + "&imgkey=" + $imgYZM.attr("alt") + "&returnurl=" + returnurl;
                    if (d.isexists) {
                        //登录
                        window.location.replace("/html/Anonymous/logincheck.html" + str);
                    }
                    else {
                        //注册
                        $.confirmF("此手机号码未注册<br>继续注册成为唐小僧会员", null, null, null, function () {
                            data.regnosms = false;
                            $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms?t=" + new Date().getTime(), data, false).then(
                                function (d1) {
                                    if (d1.result) {
                                        window.location.replace("/html/Anonymous/register.html" + str);
                                    }
                                    else {
                                        $.alertF(d1.errormsg);
                                    }
                                }
                            );
                        });
                    }
                }
                else {
                    $.alertF(d.errormsg, "确定", function () {
                        $txtImgYZM.val("");
                        $imgYZM.click();
                    });
                }
            });
    });

});
