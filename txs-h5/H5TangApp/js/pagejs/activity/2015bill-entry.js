/// <reference path="/_references.js" />

var invitedBy = $.getQueryStringByName("c");//邀请码
var amount = $.getQueryStringByName("amount");//预计多少钱
var timg = $.getQueryStringByName("timg");//头像
var nickName = $.getQueryStringByName("nickname");//头像
$(function () {
    layzeLoadImg();
    if (!$.isNull(timg)) {
        $(".entry-photo img").attr("src", decodeURIComponent(timg));
    }

    if (!$.isNull(nickName)) {
        $(".entry-username").html(decodeURIComponent(nickName));
    }

    if (!$.isNull(amount)) {
        $(".s2-biaoyu span").html(decodeURIComponent(amount));
    }
    $(".img-bht").click(function () {
        window.location.replace("https://s.txslicai.com/s.html?c=" + decodeURIComponent(invitedBy));
    });

    $(".bill-music").click(function () {
        var audio = document.getElementById("music");
        if (audio != null) {
            if (audio.paused) {
                audio.play();
                $(".music-play").show();
                $(".music-stop").hide();
            }
            else {
                audio.pause();
                $(".music-stop").show();
                $(".music-play").hide();
            }
        }
    });

    initData();
});
var layzeLoadImg = function () {
    var imgs = $("img");
    var s = 0;
    $._imgLoad(imgs, function () {
        s = s + 1;
        var d = parseInt(s * 100 / imgs.length);
        $("#imgsCount").text(d);
    });
};

var initData = function () {
    var url = "/StoreServices.svc/activity/getaccountyearbyid";
    var param = { "year": 2015 };
    $.AkmiiAjaxPost(url, param, true).then(function (d) {
        if (d.result) {
            $(".img-bht").unbind("click");
            var rurl = "https://s.txslicai.com/s.html?c=" + decodeURIComponent(invitedBy);
            //新用户就没有年度账单
            if (d.isnewuser) {
                rurl = "/html/activity/2015bill-no.html";
            }
                //老用户 没有投资也没有签到
            else if (!d.ishavebill) {
                rurl = "/html/activity/2015bill-newuser.html";
            }
            else {
                rurl = "/html/activity/2015bill.html";
            }
            $(".img-bht").click(function () {
                window.location.replace(rurl);
            });
        }
    });
};
