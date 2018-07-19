/// <reference path="/_references.js" />

$(function () {
    layzeLoadImg();
    $(".tipswrap").click(function () { $(this).hide(); });
    $(".bill-invite").click(function () { $(".tipswrap").toggle(); });

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
            //新用户
            if (d.isnewuser) {
                window.location.replace("/html/activity/2015bill-no.html");
            }
            var urlparam = "?c=" + d.referralcode + "&amount=" + $.fmoney(d.assetpredictionamount, 0) +
                "&timg=" + encodeURIComponent(d.wechatimg) + "&nickname=" + encodeURIComponent(d.wechatnickname);
            $.getWechatconfig("activityshare", null, null, {
                "link": window.location.origin + "/e/2015bill-entry.html" + urlparam,
                "title": "我赚high啦!你呢?",
                "imgUrl": d.wechatimg,
                "desc": "经预测，十年后我将拥有财富" + $.fmoney(d.assetpredictionamount, 0) + "元，你会拥有多少？快来看看吧！"
            });
            YearMonthConvert("registerslider", d.registrationtime, 336);
        }
    });
};
var YearMonthConvert = function (id, time, num) {
    //.reg-time
    var arr = time.split("-");
    var ha = [];
    for (var i = 0; i < arr.length; i++) {
        var narr = arr[i].split("");
        for (var j = 0; j < narr.length; j++) {
            ha.push("<i>" + narr[j] + "</i>");
        }
        if (i == 0) {
            ha.push("年");
        } else if (i == 1) { ha.push("月"); }
        else { ha.push("日"); }
    }
    $("#" + id + " .reg-time").html(ha.join(''));
    if (num) {
        //.s2-biaoyu span
        $("#" + id + " .s2-biaoyu span").text(num);
    }
}

var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    pagination: '.swiper-pagination', paginationClickable: true, paginationBulletRender: function (index, className) { return '<span class="' + className + ' billpage' + (index + 1) + '"></span>'; }, autoplay: 18000, nextButton: '.swiper-button-next', mousewheelControl: true,
    onInit: function (swiper) {
        swiperAnimateCache(swiper);
        swiperAnimate(swiper);
    },
    onSlideChangeEnd: function (swiper) {
        swiperAnimate(swiper);
    },
    onTransitionEnd: function (swiper) {
        swiperAnimate(swiper);
    },
    watchSlidesProgress: true,
    onProgress: function (swiper) {
        for (var i = 0; i < swiper.slides.length; i++) {
            var slide = swiper.slides[i];
            var progress = slide.progress;
            var translate = progress * swiper.height / 4;
            scale = 1 - Math.min(Math.abs(progress * 0.5), 1);
            var opacity = 1 - Math.min(Math.abs(progress / 2), 0.5);
            slide.style.opacity = opacity;
            es = slide.style;
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + translate + 'px,-' + translate + 'px) scaleY(' + scale + ')';
        }
    },
    onSetTransition: function (swiper, speed) {
        for (var i = 0; i < swiper.slides.length; i++) {
            es = swiper.slides[i].style;
            es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
        }
    },
});
