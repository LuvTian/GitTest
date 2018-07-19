/// <reference path="/_references.js" />
var defeatCode = "W000078";
(function (root) {
    var reffercode = $.getQueryStringByName("c").toUpperCase();//推荐码
    if (reffercode == defeatCode) {
        root._tt_config = true;
        var tt_version = '1.2.6';
        var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true;
        ta.src = document.location.protocol + '//' + 's0.pstatp.com/adstatic/resource/landing_log/dist/' + tt_version + '/static/js/toutiao-tetris-analytics.js';
        ta.onerror = function () {
            var request = new XMLHttpRequest();
            var web_url = window.encodeURIComponent(window.location.href);
            var js_url = ta.src;
            var url = 'http://ad.toutiao.com/link_monitor/cdn_failed?web_url=' + web_url + '&js_url=' + js_url;
            request.open('GET', url, true);
            request.send(null);
        }
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ta, s);
    }
})(window);

$(function () {
    $("table").find("tr:even").css("background", "#e0e0e0");
    var $txtInvitedBy = $.getQueryStringByName("c");//推荐码
    /*  
     *  引用自建联盟方法
    */
    $.registerChannel($txtInvitedBy);
    var returnurl = $.getQueryStringByName("returnurl");//跳转url

    var $txtimgYZM = $("#txtimgyzm");//图形验证码
    var $imgYZM = $("#imgYZM");//图形验证码
    var $phnoe = $("#txtmobile");//手机号
    var $txtsmsyzm = $("#txtsmsyzm");//手机验证码


    $.getImgYZM("imgYZM");//图形验证码

    $("#luckydrawregister").click(function () {
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
        if ($.isNull($txtInvitedBy)) {
            $.alertF("推荐码不能为空！");
            return;
        }

        var data = { "mobile": $phnoe.val(), "smscode": $txtsmsyzm.val(), "InvitedBy": $txtInvitedBy };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/luckdrawregister", data, false).then(function (d) {
            if (d.result) {
                $.alertF("恭喜,注册成功!<br/>抽中红包金额：" + d.amount.toFixed(2) + "元!", "确定", setPWD);
                if ($txtInvitedBy.toUpperCase() == defeatCode) {
                    _taq.push({ convert_id: "51972565006", event_type: "form" });
                }
            }
            else {
                $.alertF(d.errormsg);
            }
        });
    });

    //获取验证码
    $("#getYZM").click(function () {
        if (!$.isMobilePhone($phnoe.val())) {
            $.alertF("请输入正确的手机号码！");
            return;
        }
        if ($.isNull($imgYZM.attr("alt"))) {
            $.alertF("请点击图形验证码刷新！");
            return;
        }
        if ($.isNull($txtimgYZM.val())) {
            $.alertF("请输入图形验证码");
            return;
        }
        //获取验证码
        var data = { "mobile": $phnoe.val(), "imgcode": $txtimgYZM.val(), "imgkey": $imgYZM.attr("alt") };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(
            function (d) {
                if (d.result) {
                    $.GetYzm("getYZM", 60);
                    if (d.isexists) {
                        var str = "?phone=" + $phnoe.val() + "&imgcode=" + $txtimgYZM.val() + "&imgkey=" + $imgYZM.attr("alt") + "&returnurl=" + returnurl;
                        //登录
                        window.location.replace("/html/Anonymous/logincheck.html" + str);
                    }
                }
                else {
                    $.alertF(d.errormsg); return;
                }
            });
    });

});
function back() {
    window.location.replace("/html/anonymous/login.html");
}

function setPWD() {
    window.location.replace("/html/my/regist-step1.html");
}