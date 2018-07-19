//define(["require", "exports", '../api/oauth', '../api/user'], function (require, exports, oauth_1, user_1) {
$(function(){
    "use strict";
    var User = {};
    User.UserSendSms = function UserSendSms(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/Anonymous/user/sendusersms";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    var Authorize_1 = {};
    (function (Authorize) {
        function AuthorizeCode(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/auth2/authorize";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Authorize.AuthorizeCode = AuthorizeCode;
    })(Authorize_1);

    var Authorize = (function () {
        function Authorize() {
            var conTopDom = this;
            this.isNewUser = false;
            this.client_id = $.getQueryStringByName("client_id");
            this.redirect_uri = decodeURIComponent($.getQueryStringByName("redirect_uri"));
            this.response_type = $.getQueryStringByName("response_type");
            this.display = $.getQueryStringByName("display");
            this.scope = $.getQueryStringByName("scope");
            this.state = $.getQueryStringByName("state");
            this.stoken = $.getQueryStringByName("stoken");
            var telphone = $.getQueryStringByName("mobile");
            var $txtimgYZM = $("#txtimgyzm");
            var $imgYZM = $("#imgYZM");
            var $phnoe = $("#txtmobile");
            var $txtsmsyzm = $("#txtsmsyzm");
            if ($.isMobilePhone(telphone)) {
                $("#txtmobile").val(telphone);
                $("#txtmobile").attr("readonly", "readonly");
            }
            this.InitPage($phnoe, $txtimgYZM, $txtsmsyzm, $imgYZM);
        }
        Authorize.prototype.InitPage = function ($phnoe, $txtimgYZM, $txtsmsyzm, $imgYZM) {
            var conTopDom = this;
            conTopDom.authorizeCheck(conTopDom.client_id, conTopDom.redirect_uri, conTopDom.response_type, conTopDom.display, conTopDom.scope, conTopDom.state, conTopDom.stoken, $phnoe, $imgYZM, $txtimgYZM);
            $("#LoginNext").click(function () {
                conTopDom.Login($phnoe, $txtimgYZM, $txtsmsyzm, $imgYZM);
            });
            $("#btnauthorize_code").click(function () {
                conTopDom.GetauthorizeCode(conTopDom.client_id, conTopDom.redirect_uri, conTopDom.response_type, conTopDom.display, conTopDom.scope, conTopDom.state, $phnoe.val());
            });
            $("#btnauthorize_cacel").click(function () {
                conTopDom.cacelauthorize(conTopDom.state, conTopDom.redirect_uri, "access_denied");
            });
        };
        Authorize.prototype.authorizeCheck = function (client_id, redirect_uri, response_type, display, scope, state, stoken, $phnoe, $imgYZM, $txtimgYZM) {
            var conTopDom = this;
            var data = {
                requesttype: 1,
                client_id: client_id,
                redirect_uri: redirect_uri,
                response_type: response_type,
                display: display,
                scope: scope,
                state: state,
                stoken: stoken
            };
            Authorize_1.AuthorizeCode(data, function (d) {
                if (d.result) {
                    if (!$.isNull(d.redirect_uri)) {
                        window.location.replace(d.redirect_uri);
                    }
                    else if (d.isauthorize) {
                        $("#authorize_login").hide();
                        $("#authorize_code").show();
                    }
                    $(".client_name").text(d.clientname);
                    $.UpdateTitle("唐小僧安全登录-" + d.clientname);
                    conTopDom.imgYZMfun($phnoe, $imgYZM, $txtimgYZM);
                }
                else {
                    $.alertF(d.errormsg);
                }
            }, true);
        };
        Authorize.prototype.Login = function ($phnoe, $txtimgYZM, $txtsmsyzm, $imgYZM) {
            var conTopDom = this;
            if (!$.isMobilePhone($phnoe.val())) {
                $.alertF("请输入正确的手机号码！");
                return;
            }
            if ($.isNull($txtimgYZM.val())) {
                $.alertF("请输入图形验证码");
                return;
            }
            if ($.isNull($txtsmsyzm.val())) {
                $.alertF("短信验证码不能为空！");
                return;
            }
            if (!conTopDom.IsGetYzm) {
                $.alertF("请先获取短信验证码");
                return;
            }
            if (!conTopDom.isNewUser) {
                $.alertF("当前账号不存在，请先注册！");
                return;
            }
            var data = {
                requesttype: 2,
                imgcode: String($txtimgYZM.val()),
                client_id: conTopDom.client_id,
                display: conTopDom.display,
                imgkey: String($imgYZM.attr("alt")),
                mobile: String($phnoe.val()),
                redirect_uri: conTopDom.redirect_uri,
                response_type: conTopDom.response_type,
                scope: conTopDom.scope,
                smscode: String($txtsmsyzm.val()),
                state: conTopDom.state,
                stoken: conTopDom.stoken
            };
            Authorize_1.AuthorizeCode(data, function (d) {
                if (d.result) {
                    if (!$.isNull(d.redirect_uri)) {
                        window.location.replace(d.redirect_uri);
                    }
                    else if (d.isauthorize) {
                        $("#authorize_login").hide();
                        $("#authorize_code").show();
                    }
                }
                else {
                    $.alertF(d.errormsg);
                }
            }, true);
        };
        Authorize.prototype.imgYZMfun = function ($phnoe, $imgYZM, $txtimgYZM) {
            var conTopDom = this;
            $.getImgYZM("imgYZM");
            $("#getYZM").click(function () {
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
                var data = { "mobile": $phnoe.val(), "imgcode": $txtimgYZM.val(), "imgkey": $imgYZM.attr("alt") };
                User.UserSendSms(data, function (d) {
                    if (d.result) {
                        $.GetYzm("getYZM", 60);
                        conTopDom.isNewUser = d.isexists;
                        conTopDom.IsGetYzm = true;
                    }
                    else {
                        $.alertF(d.errormsg, null, function () {
                            if (d.errorcode == "missing_parameter_imagekey") {
                                $("#imgYZM").click();
                            }
                        });
                        return false;
                    }
                }, true);
            });
        };
        Authorize.prototype.GetauthorizeCode = function (client_id, redirect_uri, response_type, display, scope, state, mobile) {
            var data = {
                requesttype: 3,
                mobile: mobile,
                client_id: client_id,
                redirect_uri: redirect_uri,
                response_type: response_type,
                display: display,
                scope: scope,
                state: state
            };
            Authorize_1.AuthorizeCode(data, function (d) {
                if (d.result) {
                    if (!$.isNull(d.redirect_uri)) {
                        window.location.replace(d.redirect_uri);
                    }
                }
                else {
                    if (d.errorcode == "NotLogin") {
                        $("#authorize_login").show();
                        $("#authorize_code").hide();
                    }
                    else {
                        $.alertF(d.errormsg);
                    }
                }
            }, true);
        };
        Authorize.prototype.cacelauthorize = function (state, redirect_uri, errorcode) {
            if (redirect_uri.indexOf("?") > -1) {
                redirect_uri += "&state=" + state + "&errorcode=" + errorcode;
            }
            else {
                redirect_uri += "?state=" + state + "&errorcode=" + errorcode;
            }
            window.location.replace(redirect_uri);
        };
        return Authorize;
    }());
    var authorize = new Authorize();
});
