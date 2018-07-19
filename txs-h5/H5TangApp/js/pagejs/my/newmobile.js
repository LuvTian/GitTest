/// <reference path="//_references.js" />

var url = "";
var param = {};

var $oldmonileDiv = $(".oldmonile");//原div
var $newmonileDiv = $(".newmonile");//新div
var $idcard = $("#idcard");//身份证号码
var $oldyzm = $("#oldyzm");//原验证码
var $oldgetyzm = $("#oldgetyzm");//获取原验证码
var $newmobile = $("#newmobileinput");//新手机号码
var $newyzm = $("#newyzm");//新验证码
var $newgetyzm = $("#newgetyzm");//获取新验证码
var $next = $("#next");//下一步
var $sumbit = $("#sumbit");//提交


//1.需要身份证号码 发送原手机号码
//2.验证原手机号码短信 给新手机发送验证码
//3.身份证 新短信 新手机

$(function () {

    PreGetCode();
    Next();
    PreGetNewCode();
    SubmitUp();

    //绑定获取原验证码方法
    function PreGetCode() {
        $oldgetyzm.click(function () {
            if ($.isNull($idcard.val()) || !$.isIdCardNo($idcard.val())) {
                $.alertF("身份证格式不正确");
                return;
            }
            url = "/StoreServices.svc/user/checkidnumbersendsms";
            param = { "idnumber": $idcard.val() };
            $.AkmiiAjaxPost(url, param).then(function (data) {
                if (data.result) {
                    $.GetYzm("oldgetyzm", 60);
                    //$.alertF("请查收短信验证码");
                } else {
                    $.alertF(data.errormsg);
                }
            });
        });
    }

    //下一步
    function Next() {
        $next.click(function () {
            if ($.isNull($idcard.val()) || !$.isIdCardNo($idcard.val())) {
                $.alertF("身份证格式不正确");
                return;
            }
            if ($.isNull($oldyzm.val()) || !$.isNumeric($oldyzm.val())) {
                $.alertF("验证码格式不正确");
                return;
            }
            url = "/StoreServices.svc/user/checksmscode";
            param = { "smscode": $oldyzm.val() };
            $.AkmiiAjaxPost(url, param).then(function (data) {
                if (data.result) {
                    $oldmonileDiv.hide();
                    $newmonileDiv.show();
                } else {
                    $.alertF($.isNull(data.errormsg) == false ? data.errormsg : $.defaultError());
                }
            });


        });
    }

    //绑定获取新验证码方法
    function PreGetNewCode() {
        $newgetyzm.click(function () {
            if ($.isNull($newmobile.val()) || !$.isMobilePhone($newmobile.val())) {
                $.alertF("新手机号码格式不正确");
                return;
            }
            url = "/StoreServices.svc/user/editmobilesendsms";
            param = { "smscode": $oldyzm.val(), "mobile": $newmobile.val() };
            $.AkmiiAjaxPost(url, param).then(function (data) {
                if (data.result) {
                    $.GetYzm("newgetyzm", 60);
                    $.alertF("短信已发送至" + $newmobile.val() + "请查收");
                } else {
                    $.alertF($.isNull(data.errormsg) == false ? data.errormsg : $.defaultError());
                }
            });
        });
    }

    //提交
    function SubmitUp() {
        $sumbit.click(function () {
            if ($.isNull($idcard.val()) || !$.isIdCardNo($idcard.val())) {
                $.alertF("身份证格式不正确");
                return;
            }
            if ($.isNull($newyzm.val()) || !$.isNumeric($newyzm.val())) {
                $.alertF("验证码格式不正确");
                return;
            }
            if ($.isNull($newmobile.val()) || !$.isMobilePhone($newmobile.val())) {
                $.alertF("新手机号码格式不正确");
                return;
            }


            url = "/StoreServices.svc/user/editmobile";
            param = { "idnumber": $idcard.val(), "smscode": $newyzm.val(), "mobile": $newmobile.val() };
            $.AkmiiAjaxPost(url, param).then(function (data) {
                if (data.result) {
                    $.alertF("修改成功,请重新登录", null, function () {
                        $.delCookie("MadisonToken");
                        window.location.replace("/html/Anonymous/login.html");
                    });
                } else {
                    $.alertF(data.errormsg);
                }
            });
        });
    }

});
