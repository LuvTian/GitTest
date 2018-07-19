/// <reference path="../../_references.js" />
/// <reference path="../../vendor/jquery.js" />
/// <reference path="../../common.js" />
/**
 *desc:新浪个人中心
 *author:terry
 *date:2016年7月13日12:28:28
 **/

$(function() {
    if ($.isNull($.getCookie("MadisonToken"))) {
        $.alertF("登录信息丢失，请重新登录", "", function() {
            $.Loginlink();
        });
        return;
    }

    var t = $.getQueryStringByName("t");
    var r = decodeURIComponent($.getQueryStringByName("r")); //要跳转的地址
    //同步业务逻辑
    if (!$.isNull(t) && parseInt(t) > 0) {
        $.sinarequest(t, true, "", function(data) {
            if (data.result) {
                var href = window.location.href;
                r = href.substring(href.indexOf('r=') + 2, href.length)
                window.location.replace(r);
            } else {
                $.alertF(data.errormsg);
            }
        });
    }

});