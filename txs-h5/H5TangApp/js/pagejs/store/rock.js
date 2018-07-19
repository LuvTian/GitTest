/// <reference path="//_references.js" />


$(document).foundation();

var $WinningImg = $("#WinningImg");//中奖图片
var $WinningName = $("#WinningName");//奖品名称
var $WinningPrice = $("#WinningPrice");//奖品价值

var pageindex = 1;
var pagesize = 10;
var pagecount = 0;
var pagenumber = 0;//页数

var $gamelist = $("#prizelist");//摇一摇奖品列表
var $loadmore = $("#loadmore");//加载更多按钮
var $commercialHref = $("#commercialHref");//商户详情链接
var $commercialName = $("#commercialName");//商户名称
var $rockwinner = $("#rockwinner");//中奖名单链接
var $statusGIF = $("#statusGIF");//活动状态图gif
var $statusJPG = $("#statusJPG");//活动状态图JPG
var $otherwelfare = $("#otherwelfare");//查看其他福利
var surplustime = 0;//抽奖剩余时间
var $surplustime = $("#surplustime");//剩余抽奖次数

var datalist = [];
var distance = 0;

//商户/单品摇一摇
var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var activitytype = $.getQueryStringByName("activitytype");//[1 摇聚惠 ;2 商户福利;3 幸运西游机;]
var storeid = $.getQueryStringByName("storeid");//商户ID
var couponactivityid = $.getQueryStringByName("couponactivityid");//活动ID

var claimmethod = 0;//领取类型（1到店领取/2快递/3网上兑换）
var Luckcouponactivityid = "";//中奖的活动ID
var validatecode = "";//兑换码
var orderid = "";//订单号
var wintimetostring = "";//获奖时间
var overduetimetostring = "";//过期时间

var nomore = false;

var SHAKEing = false;
var SHAKE_THRESHOLD = 2000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;

var shareJson =
    {
        title: "",
        desc: "",
        link: window.location.href,
        imgUrl: ""
    };

//前端动画效果
Animation();

//摇一摇
shakeinit();


//再摇一次
$("#rockagain").click(function () {
    $(".mask").hide();
    $(".capacity2").hide();
});

//低调领取
$("#Receive").click(function () {
    Receivefun();
    if (claimmethod == 2) {
        $.confirmF("请设置福利的收货地址！<br>请进入“我的”-->”福利”中,请在福利订单详情中及时提交收货地址！", "稍后设置", "去设置", Receivefun,
            function () {
                window.location.href = '/Html/My/welfaredetails.html?couponactivityid=' + Luckcouponactivityid + '&orderid=' + orderid + '&wintime=' + ($.jsonDateFormat(wintimetostring)) + '&status=2&couponcode=' + validatecode + '&overduetime=' + ($.jsonDateFormat(overduetimetostring)) + '&longitude=' + longitude + '&latitude=' + latitude + "&rocklink=" + (encodeURIComponent(window.location.href));
            });
    }
    else {
        $.alertF('领取成功！<br>请进入“我的”-->”福利”中查看已领取的福利。', null, Receivefun);
    }
});

//点击炫耀一下出现分享引导页
$("#enjoy").click(function () {
    $(".capacity1").hide();
    $(".mask").show();
    $("#enjoydiv").show();
});
//点击引导页消失
$("#enjoydiv,.mask").click(function () {
    //只有在显示引导页的时候，点击mask，引导页和mask消失。不要影响其他的
    if ($("#enjoydiv").is(':visible')) {
        $(".mask").hide();
        $("#enjoydiv").hide();
    }
});

$("#testclisk").click(function () {
    $.getLocationCity(rockNow, longitude, latitude);
}
);

//摇完之后，低调领取之后执行
function Receivefun() {
    $(".mask").hide();
    $(".capacity1").hide();
    $(".capacity2").hide();
}



function shakeinit() {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        $.alertF('设备不支持摇一摇');
    }
}
function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
            var az_showmasker = $("#az-showmasker").length;
            if (az_showmasker > 0 && $("#az-showmasker").is(':visible')) {
                return;
            }

            var MadisonToken = $.getCookie("MadisonToken");
            if ($.isNull(MadisonToken)) {
                $.confirmF("请先登录", null, null, null, $.Loginlink);
                return;
            }
            if (!SHAKEing && $(".mask").is(':hidden')) {
                SHAKEing = true;
                $.getLocationCity(rockNow, longitude, latitude);//, "region": cityInfo.citycode
            }
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

function rockNow(cityInfo) {
    //活动类型[1-摇 钜 惠(针对具体活动);2-商户福利(针对某个商户);3-幸运西游机(不针对商户);]
    var playCount = 0;
    var playMusic = function () {
        document.getElementById("musicBox").play();
    };
    playMusic();
    /*等待音频播放完毕*/
    setTimeout(function () {
        playCount++;
    }, 1000);
    var invokeService = function () {
        var data = { "couponactivityid": couponactivityid, "storeid": storeid, "activitytype": activitytype, "region": cityInfo.citycode };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/lotteryactivityservice", data, true).then(function (d) {
            var hdSwitch = setInterval(function () {
                if (playCount >= 1) {
                    clearInterval(hdSwitch);
                    handleDetail();
                }
            }, 200);
            var handleDetail = function () {
                if (d.result) {
                    surplustime = surplustime <= 0 ? 0 : (surplustime - 1);
                    wsurplustimefun(surplustime)
                    $surplustime.html(surplustime);
                    if (!$.isNull(d.validatecode)) {
                        claimmethod = d.claimmethod;
                        Luckcouponactivityid = d.couponactivityid;
                        validatecode = d.validatecode;
                        orderid = d.orderid;
                        wintimetostring = d.wintimetostring;
                        overduetimetostring = d.overduetimetostring;
                        setTimeout(function () {
                            if (d.isusetemplate) {
                                $("#img-templates").html(selectTemplate(d)).show();
                                $WinningImg.hide();
                            }
                            else {
                                $("#img-templates").hide();
                                $WinningImg.attr("src", d.couponimagesmall).show();
                            }
                            $WinningName.html(d.couponactivityname);
                            $WinningPrice.html('价值：<b>' + d.coupondiscountprice + '元</b>');
                            $(".mask").show();
                            $(".capacity1").show();
                            if (surplustime <= 0) {
                                SHAKEing = true;
                            }
                            else {
                                SHAKEing = false;
                            }
                        }, 1000);
                        return;
                    }
                    else {
                        if (surplustime <= 0) {
                            SHAKEing = true;
                        }
                        else {
                            SHAKEing = false;
                        }
                    }
                }
                else {
                    SHAKEing = true;
                    if (d.errorcode == 'missing_parameter_accountid') {
                        $.confirmF("请先登录", null, null, function () { SHAKEing = false; }, $.Loginlink);
                        return;
                    }
                    else if (d.errormsg == '该用户未通过实名认证') {
                        $.confirmF("完善实名信息继续抽奖", null, null, function () { SHAKEing = false; }, $.RegistSteplink);
                    }
                    else if (d.errorcode == '活动已经售罄') {
                        $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over02.png");
                        $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over02-1.png");
                        return;
                    }
                    else if (d.errorcode == '活动即将开始') {
                        $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over03.png");
                        $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over03-1.png");
                        return;
                    }
                    else if (d.errorcode == '活动已经结束') {
                        $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over04.png");
                        $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over04-1.png");
                        return;
                    }
                    else if (d.errorcode == '已超出当日最大限制次数' || surplustime <= 0) {
                        $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over01.png");
                        $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over01-1.png");
                        return;
                    }
                    return;
                }
                $(".mask").show();
                $(".capacity2").show();
            };

        }, function (d) {
            SHAKEing = false;
        });
        getData(cityInfo);
    };

    invokeService();

};


(function ($) {
    getuserluckdrawsurplustime();

    Prizelist();
    if (activitytype == 2) {
        $("#shagnhurule").show();
        $rockwinner.attr("href", "/html/store/rockwinner.html?activitytype=" + activitytype + "&storeid=" + storeid);
        $otherwelfare.attr("href", "/Html/Store/commercial-welfare.html?longitude=" + longitude + "&latitude=" + latitude + "");
    }
    else {
        $("#yaojuhuirule").show();
        $rockwinner.attr("href", "/html/store/yaojuhui-win.html?activitytype=" + activitytype + "&couponactivityid=" + couponactivityid + "&storeid=" + storeid);
        $otherwelfare.attr("href", "/Html/Store/rocklist.html?longitude=" + longitude + "&latitude=" + latitude + "");
        $loadmore.hide();

    }


})(jQuery);


//幸运抽奖用户剩余可抽奖次数
function getuserluckdrawsurplustime() {
    var data = { "activitytype": activitytype };
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getuserluckdrawsurplustime", data, true).then(function (d) {

        if (d.result) {
            $("#choujiangcount").css("visibility", "visible");
            surplustime = d.luckdrawsurplustime;
            surplustime = surplustime <= 0 ? 0 : (surplustime);
            wsurplustimefun(surplustime);
            $surplustime.html(surplustime);
        }
    });
}
function wsurplustimefun(surplustime) {
    if (surplustime <= 0) {
        SHAKEing = true;
        $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over01.png");
        $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over01-1.png");
    }
}

function Prizelist() {
    $.getLocationCity(getData, longitude, latitude);//, "region": cityInfo.citycode
};


//奖品列表
function getData(cityInfo) {
    if (activitytype == 1 && !$.isNull(couponactivityid)) {
        //单品福利
        var data = { "longitude": longitude, "latitude": latitude, "pageindex": pageindex, "pagesize": pagesize, "activitytype": activitytype, "couponactivityid": couponactivityid, "storeid": storeid, "region": cityInfo.citycode };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfolist", data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d) {
                var list = d.couponactivitylist;
                pagenumber = Math.ceil(d.pagecount / pagesize);
                if (pagenumber == pageindex) {
                    nomore = true;
                    $loadmore.html("没有更多数据");
                }
                if (list.length <= 0) {
                    nomore = true;
                    $loadmore.html("暂无数据");
                    return;
                }
                var now = new Date();
                if (list[0].activitystatus == 6 && Date.parse(d.date) < Date.parse(new Date(list[0].activityend.replace(/-/g, "/")))) {
                    SHAKEing = true;
                    $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over02.png");
                    $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over02-1.png");
                }
                else if ((list[0].activitystatus == 6 || list[0].activitystatus == 5) && Date.parse(d.date) > Date.parse(new Date(list[0].activityend.replace(/-/g, "/")))) {
                    SHAKEing = true;
                    $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over04.png");
                    $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over04-1.png");
                }
                else if (list[0].activitystatus == 5 && Date.parse(new Date(list[0].activitystart.replace(/-/g, "/"))) > Date.parse(d.date)) {
                    SHAKEing = true;
                    $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock-over03.png");
                    $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-over03-1.png");
                }
                else if (Date.parse(new Date(list[0].activitystart.replace(/-/g, "/"))) <= Date.parse(d.date) && Date.parse(new Date(list[0].activityend.replace(/-/g, "/"))) >= Date.parse(d.date) && surplustime > 0) {

                    $statusGIF.attr("src", $.resurl()+"/css/img2.0/rock03.gif");
                    $statusJPG.attr("src", $.resurl()+"/css/img2.0/rock-flage.jpg");
                }
                $commercialHref.attr("href", "/html/store/commercial.html?id=" + list[0].storeid + "&longitude=" + longitude + "&latitude=" + latitude);
                $commercialName.html(list[0].storename);
                var activitysketch = "";
                $.each(list, function (index, element) {
                    if (index == 0) {
                        shareJson = {
                            title: "唐小僧邀您参与摇钜惠，精品福利免费抢！",
                            desc: $.Cutstring(element.couponabstract, 14, ".."),
                            link: window.location.origin + "/html/anonymous/wap.html",
                            imgUrl: element.couponimagesmall
                        };
                        //分享朋友圈
                        $.getWechatconfig("LuckdrawShare", function () {
                            $("#enjoydiv").click();
                        }, function () {
                            $("#enjoydiv").click();
                        }, shareJson);
                    }
                    if (element.pagecount <= 2) {
                        $loadmore.hide();
                    }
                    if (datalist.indexOf(element.id) < 0) {
                        datalist.push(element.id);
                        var item = '<a href="/html/store/activitydetail.html?id=' + element.id + "&longitude=" + longitude + "&latitude=" + latitude + '"><div class="row bb"><div class="small-4 columns az-padding0 az-center">';
                        item += '<img src="' + element.couponimagesmall + '" alt="' + element.name + '">';
                        item += '</div>';
                        item += '<div class="small-8 columns">';
                        item += '<p class="tit">';
                        item += '<span class="wxicon ' + $.GetIconByCategory(element.category) + '"></span>' + $.Cutstring(element.name, 9, "..") + '';
                        item += '</p>';
                        item += '<p class="tip">' + $.Cutstring(element.couponabstract, 14, "..") + '</p>';
                        item += '<p class="tips2">已出' + element.deliverycount + '件</p>';
                        item += '<p class="tips3"></p>';
                        item += '<p class="tips4">价值 <span>' + element.couponprice + '</span>元</p>';
                        item += '</div></div></a>';
                        $gamelist.append(item);
                    }
                });
            }
        }, function () { $.preloaderFadeOut(); });
    } else if (activitytype == 2 && !$.isNull(storeid)) {
        //商户福利
        var data = { "longitude": longitude, "latitude": latitude, "pageindex": pageindex, "pagesize": pagesize, "activitytype": activitytype, "storeid": storeid, "region": cityInfo.citycode };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfolist", data, true).then(function (d) {
            if (d) {
                var list = d.couponactivitylist;
                pagenumber = Math.ceil(d.pagecount / pagesize);
                if (pagenumber == pageindex) {
                    nomore = true;
                    $loadmore.html("没有更多数据");
                }
                if (list.length <= 0) {
                    nomore = true;
                    $loadmore.html("暂无数据");
                    return;
                }
                if (d.pagecount <= 3) {
                    $loadmore.hide();
                }

                $commercialHref.attr("href", "/html/store/commercial.html?id=" + list[0].storeid + "&longitude=" + longitude + "&latitude=" + latitude);
                $commercialName.html(list[0].storename);

                var activitysketch = "";
                if (list.length <= 0) {
                    $loadmore.hide();
                }
                $.each(list, function (index, element) {
                    if (index == 0) {
                        shareJson = {
                            title: "唐小僧邀您参与商户福利，见着有份快来领！！",
                            desc: $.Cutstring(element.couponabstract, 14, ".."),
                            link: window.location.origin + "/html/anonymous/wap.html",
                            imgUrl: element.couponimagesmall
                        };
                        //分享朋友圈
                        $.getWechatconfig("LuckdrawShare", function () {
                            $("#enjoydiv").click();
                        }, function () {
                            $("#enjoydiv").click();
                        }, shareJson);
                    }
                    if (datalist.indexOf(element.id) < 0) {
                        datalist.push(element.id);
                        var item = '<a href="/html/store/activitydetail.html?id=' + element.id + "&longitude=" + longitude + "&latitude=" + latitude + '"><div class="row bb"><div class="small-4 columns az-padding0 az-center">';
                        item += '<img src="' + element.couponimagesmall + '" alt="' + $.Cutstring(element.storename, 9, "..") + '">';
                        item += '</div>';
                        item += '<div class="small-8 columns">';
                        item += '<p class="tit">';
                        item += '<span class="wxicon iconcss ' + $.GetIconByCategory(element.category) + '"></span>' + $.Cutstring(element.name, 9, "..") + '';
                        item += '</p>';
                        item += '<p class="tip">' + $.Cutstring(element.couponabstract, 14, "..") + '</p>';
                        item += '<p class="tips2">已出' + element.deliverycount + '件</p>';
                        item += '<p class="tips3"></p>';
                        item += '<p class="tips4">价值 <span>' + element.couponprice + '</span>元</p>';
                        item += '</div></div></a>';
                        $gamelist.append(item);
                    }
                });
            }
        }, function () { $.preloaderFadeOut(); });
    }

}

//前端动画效果
function Animation() {
    //前端动画效果-begin
    if ($(".mask").is(":visible")) {
        $(document).scrollTop(0, 500);
    }
    $(".capacity1").find("i").click(function () {
        $(".mask").css("display", "none");
        $(".capacity1").css("display", "none");
    })
    $(".capacity2").find("i").click(function () {
        $(".mask").css("display", "none");
        $(".capacity2").css("display", "none");
    })
    $(".capacity3").find(".icon-turnoff2").click(function () {
        $(".mask").css("display", "none");
        $(".capacity3").css("display", "none");
    })
    $(".capacity4").find("p").click(function () {
        $(".mask").css("display", "none");
        $(".capacity4").css("display", "none");
    })
    $(".capacity5").find(".icon-turnoff2").click(function () {
        $(".mask").css("display", "none");
        $(".capacity5").hide();
    })
    $(".rule").click(function () {
        $(".capacity5,.mask").show();
    })
    //前端动画效果-end
}



$(window).scroll(function () {
    if (!nomore) {
        if ($(document).height() - $(window).height() - $(document).scrollTop() < 10) {
            pageindex = pageindex + 1;
            pageindex = pageindex > pagenumber ? pagenumber : pageindex;
            Prizelist();
        }
    }
});


//使用模板
var selectTemplate = function (element) {
    coupontemplates = element.coupontemplates;
    var arr = [];
    switch (coupontemplates.TemplateType) {
        case 1://满减券
            arr.push('<div class="ticket1 warp subtract az-text-left">');
            arr.push('<div class="percentage vw25 col-ff645b top-10">' + coupontemplates.DecreaseAmount + '<span class="mar-t-0">元</span></div>');
            arr.push('<p class="percentage vw25 font-z-1 col-fe655f top-83">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0">满减券</h3>');
            arr.push('<p class="expired-font fz-13rem">满' + coupontemplates.TotalAmount + '元立减' + coupontemplates.DecreaseAmount + '元</p>');
            arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
            arr.push('</div>');
            arr.push('<p class="gray-font2 bottom-4x fz-13rem left_35">最终解释权归唐小僧理财</p>');
            arr.push('</div>');
            break;
        case 2://折扣券
            arr.push('<div class="ticket1 warp discount az-text-left">');
            arr.push('<div class="percentage vw25 col-ff645b top-10">' + coupontemplates.Discount + '<span class="mar-t-0">折</span></div>');
            arr.push('<p class="percentage vw25 font-z-1 col-fe655f top-83">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0">折扣券</h3>');
            arr.push('<p class="expired-font fz-13rem">' + coupontemplates.Discount + '折 最多抵' + coupontemplates.DeductibleAmount + '元</p>');
            arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
            arr.push('</div>');
            arr.push('<p class="gray-font2 bottom-4x fz-13rem left_35">最终解释权归唐小僧理财</p>');
            arr.push('</div>');
            break;
        case 3://代金券
            arr.push('<div class="ticket1 warp chit az-text-left">');
            arr.push('<div class="percentage vw25 col-ff645b top-10">' + coupontemplates.CouponAmount + '<span class="mar-t-0">元</span></div>');
            arr.push('<p class="percentage vw25 font-z-1 col-fe655f top-83">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0" style="line-height: inherit;">代金券</h3>');
            arr.push('<p class="expired-font fz-13rem">代金券：' + coupontemplates.CouponAmount + '元</p>');
            arr.push('<p class="expired-font fz-13rem">消费满' + coupontemplates.CanUseCouponAmount + '可用</p>');
            arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
            arr.push('</div>');
            arr.push('<p class="gray-font2 bottom-4x fz-13rem left_35">最终解释权归唐小僧理财</p>');
            arr.push('</div>');
            break;
        case 4://自定义
            arr.push('<div class="ticket1 warp tang az-text-left ">');
            arr.push('<p class="self col-ff645b">优惠券</p>');
            arr.push('<div class="content-box">');
            arr.push('<p class="content-18 col-ff645b fz-13rem">' + $.Cutstring2(coupontemplates.UserDefined, 18) + '</p>');
            arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
            arr.push('</div>');
            arr.push('<p class="fz-13rem col-888"><span class="zj">最终解释权归唐小僧理财</span><span class="tang-name">唐小僧商户</span></p>');
            arr.push('</div>');
            break;
    }
    return (arr.join(''));
}