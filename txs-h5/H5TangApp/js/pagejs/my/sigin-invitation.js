/// <reference path="vendor/jquery-2.2.0.js" />

var $receive_gifts = $(".receive-gifts");
var $turntable_warp = $(".turntable-warp");
var $login_warp = $(".login-warp");
var token = $.getCookie("MadisonToken");
if (token) {
    $login_warp.hide();
    $receive_gifts.removeClass("display-none");
}
$(".receive-gifts,.turntable-warp").click(function () {
    $receive_gifts.unbind("click");
    $turntable_warp.unbind("click");
    PreRegister();
})

function PreRegister() {
    if (token) {
        $.alertF("您已是唐小僧用户<br/>请去唐小僧平台参与其他精彩活动", "去看看", function () { window.location.replace("/html/product/") });
        return;
    }
    $('body').animate({ scrollTop: $(".turntable ").offset().top }, 200, function () {
        $receive_gifts.hide();
        $login_warp.removeClass("display-none");
        $login_warp.find("div")
        .velocity("transition.slideLeftIn", { stagger: 500 })

    });
}
(function ($) {
    var isNewUser = false;
    $.fn.newUserReg = function (opts) {
        var opt = {
            phone: '#txtmobile',     // 手机号编辑框
            txtimgyzm: '#txtimgyzm', // 图形验证码编辑框
            phoneyzm: '#txtsmsyzm',  // 手机验证码编辑框
            getyzm: '#getYZM',       // 获取手机验证码
            imgyzm: '#imgYZM',       // 获取图形验证码
            register: '#luckydrawregister',  // 点击立即注册
            InvitedBy: '',           // 渠道号
            regCallback: function (json) { } // 点击注册之后的callback
        };
        opt = $.extend(opt, opts || {});
        var InvitedBy = opt.InvitedBy || $.getQueryStringByName("c");//推荐码
        var $phone = $(opt.phone),
            $txtimgyzm = $(opt.txtimgyzm),
            $imgyzm = $(opt.imgyzm),
            $phoneyzm = $(opt.phoneyzm),
            $getyzm = $(opt.getyzm),
            $register = $(opt.register);
        //var $txtInvitedBy = $.getQueryStringByName("c");//推荐码
        if (!$.isNull(InvitedBy)) {
            $.setCookie("RecommendedCode", InvitedBy);
        } else {
            InvitedBy = $.getCookie("RecommendedCode");
        }
        var sendSMS = false;
        return this.each(function () {
            $.getImgYZM(opt.imgyzm.replace('#', ''));//图形验证码
            $getyzm.click(function () {
                if (!$.isMobilePhone($phone.val())) {
                    $.alertF("请输入正确的手机号码！");
                    return false;
                }
                if ($.isNull($imgyzm.attr("alt"))) {
                    $.alertF("请点击图形验证码刷新！");
                    return false;
                }
                if ($.isNull($txtimgyzm.val())) {
                    $.alertF("请输入图形验证码");
                    return false;
                }
                //获取验证码
                var data = { "mobile": $phone.val(), "imgcode": $txtimgyzm.val(), "imgkey": $imgyzm.attr("alt") };
                $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(
                    function (json) {
                        if (json.result) {
                            sendSMS = true;
                            $.GetYzm(opt.getyzm.replace(/[#\.]/g, ''), 60);
                            if (json.isexists) {
                                isNewUser = false;
                            }
                            else {
                                isNewUser = true;
                            }
                        }
                        else {
                            $.alertF(json.errormsg); return false;
                        }
                    });
            });
            $register.click(function () {
                if (!sendSMS) {
                    $.alertF("请先获取短信验证码！");
                    return false;
                }
                if (!$.isMobilePhone($phone.val())) {
                    $.alertF("请输入正确的手机号码！");
                    return false;
                }
                if ($.isNull($txtimgyzm.val())) {
                    $.alertF("请输入图形验证码");
                    return false;
                }
                if ($.isNull($phoneyzm.val())) {
                    $.alertF("短信验证码不能为空！");
                    return false;
                }
                if (isNewUser) {
                    var data = { "mobile": $phone.val(), "smscode": $phoneyzm.val(), "InvitedBy": InvitedBy, "channelcode": InvitedBy, "invokeType": "TurntableNew" };
                    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/register", data, false).then(function (d) {
                        if (d.result) {
                            $.delCookie("RecommendedCode");
                            window.location.replace("/Html/Anonymous/criterion-success.html");
                            return;
                        }
                        else {
                            $.alertF(d.errormsg);
                        }
                    });
                }
                else {
                    var data = { "mobile": $phone.val(), "smscode": $phoneyzm.val(), "imgkey": $imgyzm.attr("alt") };
                    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/loginverification", data, false).then(function (data) {
                        if (data.result) {
                            $.alertF("您已是唐小僧用户<br/>请去唐小僧平台参与其他精彩活动", "去看看", function () { window.location.replace("/html/product/") });
                        } else {
                            $.alertF(data.errormsg);
                        }
                    });
                }
            });
        });
    }
})(jQuery);

$("#luckydrawregister").newUserReg();

$(function(){
    $(window).load(function () {
        $(".__preloader").fadeOut();
        $(".__preloader_gif").fadeOut("fast");
    });
});