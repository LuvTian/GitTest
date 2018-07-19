/// <reference path="//_references.js" />

$(function () {
    InvitationRegister();
    var referralcode = $.getQueryStringByName("referralcode");
    $.getWechatconfig("InviteFriends", Success, fail, { "link": window.location.origin + "/Landing.html?c=" + referralcode });
    $("#referralcode").html(referralcode);
    CreateCode(window.location.origin + "/Landing.html?c=" + referralcode);
    var share = $("#share");
    share.click(function () {
        $(".mask").show();
        $(".showshare").show();
    });

    $(".showshare,.mask").click(function () {
        $(".mask").hide();
        $(".showshare").hide();
    });

    //生成二维码方法
    function CreateCode(couponcode) {
        var qrcode = new QRCode(document.getElementById("referralcodeimg"), {
            //width: 500,//设置宽高
            //height: 500 
        });
        var a = decodeURIComponent(couponcode);
        qrcode.makeCode(a);
    }
});

var InvitationRegister = function () {
    $.AkmiiAjaxPost("/StoreServices.svc/user/InvitationRegisterNumber", {}, true).then(function (d) {
        if (d.result) {
            $(".InvitationRegister").html(d.number);
        }
    });
}


//周签
function Success() {
    var url = "/StoreServices.svc/user/signweek";
    var param = {};
    $.AkmiiAjaxPost(url, param).then(function (data) {
    });
    $(".mask").hide();
    $(".showshare").hide();
}

function fail() {
    $(".mask").hide();
    $(".showshare").hide();
}