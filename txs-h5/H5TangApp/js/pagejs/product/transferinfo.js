var type = $.getQueryStringByName("type");
//var transferlockday = $.getQueryStringByName("transferlockday") || 2;
var transferlockday = $.getQueryStringByName("transferlockday");
var remainingnottransferdays = $.getQueryStringByName("remainingnottransferdays");
var ruletype = $.getQueryStringByName("ruletype");
$(function() {
    if (transferlockday != '0') {
        transferlockday = $.getQueryStringByName("transferlockday") || 2;
    }
    if (remainingnottransferdays != '0') {
        remainingnottransferdays = $.getQueryStringByName("remainingnottransferdays") || 3;
    }
    if (ruletype != '0') {
        ruletype = $.getQueryStringByName("ruletype") || 1;
    }
    $(".transferlockday").html(transferlockday);
    if (remainingnottransferdays == "" && ruletype == "") {
        $(".remainingnottransferdays").html("（转让锁定期+1）");
    }
    if (ruletype == 1) {
        $(".remainingnottransferdays").html("（转让锁定期+1）");
    } else if (ruletype == 2) {
        $(".remainingnottransferdays").html(remainingnottransferdays);
    } else {
        $(".remainingnottransferdays").html("（转让锁定期+1）");
    }

    $("#btn-ok").click(function() {
        if (type == "ios") {
            //JS 调用本地分享方法
            PhoneMode.appGoBackWithStirng({ 'controller': 'InvestmentViewController' });
        } else if (type == "android") {
            //JS 调用本地分享方法
            window.PhoneMode.callClosePage(null);
        } else {
            window.history.go(-1);
        }
    });
});