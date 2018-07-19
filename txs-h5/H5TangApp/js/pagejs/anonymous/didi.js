

var code = $.getQueryStringByName("c");
$(function () {
    if ($.isNull(code)) {
        $.alertF("非法链接");
        return;
    }
    GetYzm();

    $(".btn_mod").click(function () {
        $(".tipswrap").hide();
        window.location.replace("/e/follow.html");
    });
    register();
});

var register = function () {
    $("#invite-button").click(function () {
        $(".phone_row .error").hide();
        var mobile = $("#txtmobile").val();
        var smscode = $("#txtsmscode").val();
        if (!$.isMobilePhone(mobile)) {
            $.alertF("手机号码不正确");
            return;
        }
        if ($.isNull(smscode)) {
            $.alertF("短信验证码不能为空");
            return;
        }
        //获取验证码
        var data = { "encryptstr": "", "mobile": mobile, "invitedby": code, "issendsms": false, "smscode": smscode };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/DiDiRegister", data, false).then(function (d) {
            if (d.result) {
                RegisterSuccessTip();
            } else if (d.errorcode == "smscodeerror") {
                $(".phone_row .error").show();
            }
            else {
                $.alertF(d.errormsg, null, function () {
                    if (d.isexists) {
                        window.location.replace("/landing.html");
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
        if (!$.isMobilePhone(mobile)) {
            $.alertF("手机号码不正确");
            return;
        }
        //获取验证码
        var data = { "encryptstr": "", "mobile": mobile, "invitedby": code, "issendsms": true, "smscode": "" };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/DiDiRegister", data, false).then(function (d) {
            if (d.result) {
                $.GetYzm("getYZM", 90);
            }
            else {
                $.alertF(d.errormsg, null, function () {
                    if (d.isexists) {
                        window.location.replace("/landing.html");
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