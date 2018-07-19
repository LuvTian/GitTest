/**
*desc:新浪个人中心
*author:terry
*date:2016年7月13日12:28:28
**/

$(function () {


    if ($.isNull($.getCookie("MadisonToken"))) {
        $.alertF("登录信息丢失，请重新登录", "", function () {
            $.Loginlink();
        });
        return;
    }

    var t = $.getQueryStringByName("t");
   
    if (!$.isNull(t) && parseInt(t) > 0) {
        sinarequest(t, true);
    }

    $("#sinacenterpage a").click(function () {
        var issync = Boolean(parseInt($(this).attr("sync")));
        var type = $(this).attr("typevalue");
        sinarequest(type, issync);
    });
});

/// sinacenter/settings

var sinarequest = function (type, issync) {
    var url = "/StoreServices.svc/sinacenter/settings";
    var returnurl = window.location.href.split("?")[0] + "?t=" + type;
    var param = {
        requesttype: type,
        returnurl: returnurl,
        issync: issync
    };
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            if (!param.issync) {
                window.location.href = data.redirecturl;
            } else {
                $.alertF(data.errormsg);
            }
        } else {
            $.alertF(data.errormsg);
        }
    });
};
