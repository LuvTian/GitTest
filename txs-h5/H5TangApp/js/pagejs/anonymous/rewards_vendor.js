/// <reference path="../_references.js" />


$(function () {

    var $txtInvitedBy = $.getQueryStringByName("c");//推荐码
    var timestamp = $.getQueryStringByName("e");//时间戳
    if (!$.isNull($txtInvitedBy)) {
        $.setCookie("RecommendedCode", $txtInvitedBy);
    } else {
        $txtInvitedBy = $.getCookie("RecommendedCode");
    }
    var returnurl = $.getQueryStringByName("returnurl");//跳转url

    isvalidtimestamp(timestamp, $txtInvitedBy);

    var $txtimgYZM = $("#txtimgyzm");//图形验证码
    var $imgYZM = $("#imgYZM");//图形验证码
    var $phnoe = $("#txtmobile");//手机号
    var $txtsmsyzm = $("#txtsmsyzm");//手机验证码
    var getyzm = false;//获取验证码
    var isexists = false;//用户是否已存在
    $.getImgYZM("imgYZM");//图形验证码

    $("#luckydrawregister").click(function () {
        if ($.isNull($txtInvitedBy)) {
            $.alertF("渠道码不能为空！");
            return false;
        }
        if (!$.isMobilePhone($phnoe.val())) {
            $.alertF("请输入正确的手机号码！");
            return false;
        }
        if ($.isNull($txtimgYZM.val())) {
            $.alertF("请输入图形验证码");
            return false;
        }
        if ($.isNull($txtsmsyzm.val())) {
            $.alertF("短信验证码不能为空！");
            return false;
        }
        if (!getyzm) {
            $.alertF("请先获取验证码！");
            return false;
        }
        var data = {
            "mobile": $phnoe.val(),
            "smscode": $txtsmsyzm.val(),
            "invitedby": $txtInvitedBy,
            "imgkey": $imgYZM.attr("alt"),
            "isexists": isexists,
            "timestamp": timestamp,
            "isvalidtimestamp": false
        };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/rewardsvendor", data, false).then(function (d) {
            if (d.result) {
                window.location.replace("/");
            }
            else {
                $.alertF(d.errormsg, null, function () {
                    if (d.errorcode = "linknotvalid") {
                        window.location.replace("/html/anonymous/404.html");
                    }
                });
            }
        });
    });

    //获取验证码
    $("#getYZM").click(function () {
        if ($.isNull($txtInvitedBy)) {
            $.alertF("渠道码不能为空！");
            return false;
        }
        if (!$.isMobilePhone($phnoe.val())) {
            $.alertF("请输入正确的手机号码！");
            return false;
        }
        if ($.isNull($imgYZM.attr("alt"))) {
            $.alertF("请点击图形验证码刷新！");
            return false;
        }
        if ($.isNull($txtimgYZM.val())) {
            $.alertF("请输入图形验证码");
            return false;
        }
        //获取验证码
        var data = { "mobile": $phnoe.val(), "imgcode": $txtimgYZM.val(), "imgkey": $imgYZM.attr("alt") };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(
            function (d) {
                if (d.result) {
                    getyzm = true;
                    $.GetYzm("getYZM", 60);
                    isexists = d.isexists;
                }
                else {
                    $.alertF(d.errormsg);
                    return false;
                }
            });
    });
});


var isvalidtimestamp = function (timestamp, invitedBy) {
    if ($.isNull(timestamp)) {
        $.alertF("请求链接异常！");
        return false;
    }
    if ($.isNull(invitedBy)) {
        $.alertF("渠道码不能为空！");
        return false;
    }

    var data = {
        "timestamp": timestamp,
        "invitedby": invitedBy,
        "isvalidtimestamp": true
    };
    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/rewardsvendor", data, false).then(function (d) {
        if (d.result) {

        }
        else {
            $.alertF(d.errormsg, null, function () {
                if (d.errorcode = "linknotvalid") {
                    window.location.replace("/html/anonymous/404.html");
                }
            });
        }
    });
}