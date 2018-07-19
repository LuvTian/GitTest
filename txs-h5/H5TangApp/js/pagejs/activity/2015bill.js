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
            //新用户就没有年度账单
            if (d.isnewuser) {
                window.location.replace("/html/activity/2015bill-no.html");
            }
                //老用户 没有投资也没有签到
            else if (!d.ishavebill) {
                window.location.replace("/html/activity/2015bill-newuser.html");
            }

            var urlparam = "?c=" + d.referralcode + "&amount=" + $.fmoney(d.assetpredictionamount, 0) +
                "&timg=" + encodeURIComponent(d.wechatimg) + "&nickname=" + encodeURIComponent(d.wechatnickname);
            $.getWechatconfig("activityshare", null, null, {
                "link": window.location.origin + "/e/2015bill-entry.html" + urlparam,
                "title": "我赚high啦!你呢?",
                "imgUrl": d.wechatimg,
                "desc": "经预测，十年后我将拥有财富" + $.fmoney(d.assetpredictionamount, 0) + "元，你会拥有多少？快来看看吧！"
            });

            //1.首次注册模块registerslider
            YearMonthConvert("registerslider", d.registrationtime, 336);
            //2.首次投资模块investslider
            YearMonthConvert("investslider", d.firstinvestdatetime, d.currentfirstinvestcount);
            //3.首次签到人数
            if (d.ishavesign) {
                YearMonthConvert("havesignslider", d.firstsigndatetime, d.currentfirstsigncount);
                $("#havesignslider").show();
                $("#nosignslider").hide();
            }
            //4.累计投资占比 investtotalslider
            $("#investtotalslider .s9-aggregate span").text($.fmoney(d.totalinvest)); //累计投资
            $("#investtotalslider .s9-current span i").text($.fmoney(d.demandtotalinvest)); //活期投资
            $("#investtotalslider .s9-regular span i").text($.fmoney(d.fixedtotalinvest)); //定期投资

            if (d.fixedtotalinvest > 0) {
                drawCircle('#chart-4', 2, (d.demandtotalinvest * 100 / d.totalinvest) - 4, '#circle-2');
            } else {
                drawCircle('#chart-4', 2, (d.demandtotalinvest * 100 / d.totalinvest), '#circle-2');
            }


            //5.每月详细占比detailtotalslider
            $("#detailtotalslider .sm01 span").text($.fmoney(d.demandtotalprofit, 2));//活期累计收益
            $("#detailtotalslider .sm02 span").text($.fmoney(d.fixedtotalprofit, 2));//定期投资收益
            $("#detailtotalslider .sm03 span").text($.fmoney(d.totalreward, 2));//累计奖励
            $("#detailtotalslider .s10-remind span:first").text($.fmoney(d.totalprofit, 2));//累计收益
            $("#detailtotalslider .s10-remind span:last").text(d.profitrank / 100 + "%");//击败人数

            //每月累计收益 s10-list
            var montharr = $("#detailtotalslider .s10-list li");
            var monthprofitarr = [d.mayprofit, d.junprofit, d.julprofit, d.augprofit, d.sepprofit, d.octprofit, d.novprofit, d.decprofit];
            var maxprofit = monthprofitarr[0];
            for (var i = 1; i < monthprofitarr.length; i++) {
                if (maxprofit < monthprofitarr[i]) maxprofit = monthprofitarr[i];
            }

            $.each(montharr, function (i, item) {
                $(montharr[i]).find(".tn").text($.fmoney(monthprofitarr[i], 2));
                $(montharr[i]).find("span").attr("class", "").addClass("sl-" + (monthprofitarr[i] / maxprofit).toFixed(1) * 100);
                if (maxprofit == monthprofitarr[i]) {
                    $(montharr[i]).addClass("tj-active");
                }
                $(montharr[i]).click(function () {
                    $(montharr).removeClass("tj-active");
                    $(this).addClass("tj-active");
                });
            });

            //6.预计收益
            $("#assertprofitslider .s8-money span").text($.fmoney(d.assetpredictionamount));//预计收益
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

//drawCircle('#chart-4', 2, 50, '#circle-2');