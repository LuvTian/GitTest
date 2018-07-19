

var code = $.getQueryStringByName("c");
var autoMobile = false;
var InvitedBy = "W000271";
$(function () {

    //if ($.isNull(code)) {
    //    $.alertF("非法链接");
    //    return;
    //}
    //responseYiHaoCarInfo(code);

    //暂用解决方案
    autoMobile = true;
    $("#txtmobile").show();
    $("#spmobile").parent().hide();

    GetYzm();

    $(".btn_mod").click(function () {
        $(".tipswrap").hide();
        window.location.replace("/e/followone.html");
    });
    register();
});

var responseYiHaoCarInfo = function (code) {
    var data = {
        "code": code
    };
    var url = "/StoreServices.svc/Anonymous/Activity/getdidilinkinfo";
    $.AkmiiAjaxPost(url, data, true).then(function (d) {
        if (d.result) {
            if (d.isautologin) {
                window.location.replace("/landing.html");
            } else if ($.isNull(d.mobile)) {
                autoMobile = true;
                $("#txtmobile").show();
                $("#spmobile").parent().hide();
            } else {
                $("#txtmobile").hide();
                $("#spmobile").parent().show();
                $("#spmobile").text(d.mobile);
            }
        } else {
            $.alertF(d.errormsg);
        }
    });
};

var register = function () {
    $("#invite-button").click(function () {
        $(".phone_row .error").hide();
        var smscode = $("#txtsmscode").val();
        var mobile = $("#txtmobile").val();
        if (autoMobile && !$.isMobilePhone(mobile)) {
            $.alertF("手机号不正确");
            return;
        }
        if ($.isNull(smscode)) {
            $.alertF("短信验证码不能为空");
            return;
        }
        //获取验证码
        var data = { "encryptstr": code, "mobile": mobile, "invitedby": InvitedBy, "issendsms": false, "smscode": smscode };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/DiDiRegister", data, false).then(function (d) {
            if (d.result) {
                RegisterSuccessTip();
            } else if (d.errorcode == "smscodeerror") {
                $(".phone_row .error").show();
            } else {
                $.alertF(d.errormsg, null, function () {
                    if (d.isexists) {
                        window.location.replace("/e/followone.html");
                    }
                });
            }
        });
    });
}


var GetYzm = function () {
    //获取验证码
    $("#getYZM").click(function () {
        var mobile = $("#txtmobile").val();
        if (autoMobile && !$.isMobilePhone(mobile)) {
            $.alertF("手机号不正确");
            return;
        }
        //获取验证码
        var data = { "encryptstr": code, "mobile": mobile, "invitedby": InvitedBy, "issendsms": true, "smscode": "" };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/DiDiRegister", data, false).then(function (d) {
            if (d.result) {
                $.GetYzm("getYZM", 90);
            } else {
                $.alertF(d.errormsg, null, function () {
                    if (d.isexists) {
                        window.location.replace("/e/followone.html");
                    }
                });
            }
        });
    });
}

var RegisterSuccessTip = function () {
    $(".tipswrap").toggle();
    var left = ($(document).width() - $(".taxi_pop").width()) / 2;
    var top = ($(window).delay(400).height() - $(".taxi_pop").height()) / 2;
    $(".taxi_pop_content").css("left", left);
    $(".taxi_pop_content").css("top", top);
}