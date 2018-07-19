//企业用户推荐码
/*前端生成带Logo的二维码*/
var reffercode = "";//推荐码
var storelog = "";//商户logo
$(function () {
    reffercode = decodeURIComponent($.getQueryStringByName("code"));
    storelog = $.getQueryStringByName("log");
    $('.small-4').each(function () {
        $('.small-8').height($('.small-4').outerHeight(true) + "px");
    });
    var shareUrl = window.location.origin + "/landing.html?c=" + reffercode;
    $("#investPeople").attr("href", "/html/store/img-qrcode.html?code=" + reffercode + "&log=" + storelog)//点我推塔

    if ($.isNull(window.localStorage.getItem("storecodeimg"))) {
        CreateCodeImg(shareUrl, decodeURIComponent(storelog));
    } else {
        $("#invitedBy").html('<img src="' + window.localStorage.getItem("storecodeimg") + '">');
    }
})



var CreateCodeImg = function (content, logoUrl) {
    var url = "/StoreServices.svc/anonymous/generateqrcode/qrcodewithlogo";
    var param = {
        text: content,
        logo: logoUrl
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            $("#invitedBy").html('<img src="' + data.imgcode + '">');
            window.localStorage.setItem("storecodeimg", data.imgcode);
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    });
}