/// <reference path="/_references.js" />


$(function () {

    var phone = $.getQueryStringByName("phone");
    var imgcode = $.getQueryStringByName("imgcode");
    var imgkey = $.getQueryStringByName("imgkey");

    var $txtInvitedBy = $("#txtInvitedBy"); //推荐码

    var $imgYZM = $("#imgYZM");
    var $phnoe = $("#phnoe");
    var $txtYZM = $("#txtYZM"); //手机验证码

    var RecommendedCode = $.getCookie("RecommendedCode");
    if (!$.isNull(RecommendedCode)) {
        //如果页面一加载时有推荐码隐藏整栏。
        $txtInvitedBy.val(RecommendedCode);
        $txtInvitedBy.hide();
    }



    $phnoe.html($.HideMobile(phone));
    var _firstPWD = "";
    var _secondPWD = "";

    $.GetYzm("getYZM", 60);

    $("#registerSubmit").click(function () {
        //注册
        if (!$.isMobilePhone(phone)) {
            $.confirmF("手机号码异常,是否重新注册", "取消", "确定", null, back);
            return;
        }
        if ($.isNull($txtYZM.val()) || $txtYZM.val().length < 6) {
            $.alertF("请输入正确的验证码！");
            return;
        }
        if (!$.isNull($txtInvitedBy.val()) && !$txtInvitedBy.val().length > 20) {
            $.alertF("推荐码格式不正确！");
            return;
        }

        var data = {
            "mobile": "" + phone,
            "smscode": $txtYZM.val(),
            "InvitedBy": $txtInvitedBy.val(),
            "issignmoneyboxandhtffund": true
        };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/register", data).then(function (d) {
            if (d.result) {
                //百度统计
                baiduStatistics();
                //两个注册转化的统计
                _dspRegistered(d.referralcode);
                _gsq.push(["T", "GWD-002985", "track", "/targetpage/regok_success"]);
                // _zdq.push(['_setAccount', d.referralcode]);
                initZdq(d.referralcode);
                if ($txtInvitedBy.val()) {
                    _gsq.push(["T", "GWD-002985", "setCustomProperty", "3", $txtInvitedBy.val() + ""]);
                    _gsq.push(["T", "GWD-002985", "track", "/targetpage/ivitation"]);
                }
                $.delCookie("RecommendedCode");
                //var msg = "恭喜,注册成功!<br/>" + (d.isnewuser ? "新手特权35天年化13.8%产品等您来投。投资成功还送5元现金哟~" : "首次投资100元,即送" + d.rewardsamount + "元!");
                if (d.isnewuser) {
                    $.alertF(msg, "立即投资", function () {
                        window.location.replace("/Html/Product/productfixedlist.html");
                    });
                } else {
                    //$.alertF("注册成功！欢迎您成为唐小僧大家庭的一员", "确定", function () {
                    var returnurl = $.getQueryStringByName("returnurl");
                    $.CheckAccountCustomStatusRedirect(returnurl, null, true);
                    //});
                    //window.location.replace("/Html/Anonymous/criterion-success.html");
                    //$.alertF(msg, "确定", $.RegistSteplink);
                }
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
        //获取验证码
        var data = {
            "mobile": phone,
            "imgcode": imgcode,
            "imgkey": imgkey
        };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, true).then(
            function (d) {
                if (d.result) {
                    $.GetYzm("getYZM", 120);
                } else {
                    $.alertF(d.errormsg);
                }
            });
    });



});

function back() {
    window.location.replace("/html/anonymous/login.html");
}

function baiduStatistics() {
    try {
        if ($.getCookie("RecommendedCode")) {
            $.BaiduStatistics("Invite", "register_have_referralcode", "注册-链接带邀请码");
        } else if (!$.isNull($("#txtInvitedBy").val())) {
            $.BaiduStatistics("Invite", "register_handle_input", "注册-手动输入邀请码");
            // _gsq.push(["T", "GWD-002985", "track", "/targetpage/accept_success"]);
        } else {
            $.BaiduStatistics("Invite", "register_no_referralcode", "注册-无邀请码");
        }
    } catch (e) {

    }
}