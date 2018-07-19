/// <reference path="//_references.js" />


$(document).foundation();

var $WinningImg = $("#WinningImg");//中奖图片
var $WinningName = $("#WinningName");//奖品名称
var $WinningPrice = $("#WinningPrice");//奖品价值
var $surplustime = $("#surplustime");//剩余抽奖次数
var surplustime = 0;
var islogin = false;

var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var pageindex = 1;
var pagesize = 10;
var activitytype = 3;//西游机
var pagecount = 0;
var pagenumber = 0;//页数
var $gamelist = $("#gamelist");//西游机奖品列表
var $loadmore = $("#loadmore");//加载更多按钮
var datalist = [];
var nomore = false;
var nodata = false;//西游机列表没有数据
//---抽奖---
//活动类型[1-摇 钜 惠(针对具体活动);2-商户福利(针对某个商户);3-幸运西游机(不针对商户);]
var Onoff = true;
var flag = false;
var index = 0;
var TextNum1;
var TextNum2;
var TextNum3;

var claimmethod = 0;//领取类型（1到店领取/2快递/3网上兑换）
var Luckcouponactivityid = "";//中奖的活动ID
var validatecode = "";//兑换码
var orderid = "";//订单号
var wintimetostring = "";//获奖时间
var overduetimetostring = "";//过期时间

var picpng = $("#picpng");//抽奖按钮

var Location = {};

var shareJson =
    {
        title: "幸运西游机",
        desc: "幸运西游机",
        link: window.location.href,
        imgUrl: ""
    };
document.getElementById("musicBox").pause();

(function ($) {

    if (longitude != 0 && latitude != 0) {
        //绑定点击抽奖
        bindclick();
        //获取西游机奖品列表
        Prizelist();
    }
    else {
        var LocationCookie = $.getCookie("MadisonStoreBaiduLocation");
        if (!$.isNull(LocationCookie)) {
            Location = (new Function('return' + LocationCookie))();
            Success(Location);
        }
        else {
            if ($.is_weixn2()) {
                $.getWechatconfig("getLocation", Success, Failure);
            }
            else {
                $.getLocationFailure();
            }
        }
    }

    function Success(data) {
        Location = data;
        longitude = Location.lng;
        latitude = Location.lat;
        //绑定点击抽奖
        bindclick();
        //获取西游机奖品列表
        Prizelist();
    }
    function Failure() {
        $.getLocationFailure();
    }

    //获取剩余次数
    getuserluckdrawsurplustime();


    function Prizelist() {
        $.getLocationCity(getData, longitude, latitude);
    };

    //西游机奖品列表
    function getData(cityInfo) {
        var data = { "longitude": longitude, "latitude": latitude, "pageindex": pageindex, "pagesize": pagesize, "activitytype": activitytype, "region": cityInfo.citycode };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfolist", data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                $loadmore.attr("disabled", false);
                pagenumber = Math.ceil(d.pagecount / pagesize);
                var list = d.couponactivitylist;
                if (pagenumber == pageindex) {
                    nomore = true;
                    $loadmore.html("没有更多数据");
                    $loadmore.attr("disabled", true);
                }
                if (d.pagecount == 0) {
                    //没有奖品列表则不可玩游戏，按钮灰色
                    nodata = true;
                    $(".main3-btn").unbind("click");
                    picpng.attr("src", $.resurl()+"/css/img2.0/gray-game-btn.png");
                }
                if (list.length <= 0) {
                    nomore = true;
                    $loadmore.html("暂无数据");
                    $loadmore.attr("disabled", true);
                    return;
                }

                var activitysketch = "";
                $.each(list, function (index, element) {
                    if (index == 0) {
                        shareJson = {
                            title: "唐小僧邀您参与幸运抽奖，千万福利大放送！",
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
                        activitysketch = element.activitysketch.length > 60 ? element.activitysketch.substring(0, 60) + "..." : element.activitysketch;
                        var ha = [];
                        ha.push('<div class="shop-list az-clearfix bb"><div class="row"><div class="small-4 columns az-padding0  az-center">');
                        ha.push('<img src="' + element.couponimagesmall + '" alt=""></div><div class="small-8 columns az-padding0"><p class="tit">');
                        ha.push('<span class="wxicon ' + $.GetIconByCategory(element.category) + '"></span>' + $.Cutstring(element.name, 10, "..") + '</p>');
                        ha.push('<p class="tip">' + $.Cutstring(element.couponabstract, 14, "..") + '</p>');
                        ha.push('<p class="tips2">已出' + element.deliverycount + '件</p>');
                        ha.push('<p class="tips4">价值<span>' + element.couponprice + '</span>元</p></div></div></div>');
                        var item = $(ha.join(''));
                        item.click(function () {
                            window.location.href = "/html/store/activitydetail.html?id=" + element.id + "&longitude=" + longitude + "&latitude=" + latitude;
                        });
                        $gamelist.append(item);
                    }
                });
            }
        }, function () { $.preloaderFadeOut(); });
    }

    function letGo() {

        //TextNum1=parseInt(Math.random()*4)//随机数
        //TextNum2=parseInt(Math.random()*2)
        //TextNum3=parseInt(Math.random()*3)

        var num1 = [-256, -288, -320, -352][TextNum1];//在这里随机
        var num2 = [-256, -288, -320, -352][TextNum2];
        var num3 = [-256, -288, -320, -352][TextNum3];
        $(".num-con1").animate({ "top": "-62" + "vh" }, 1000, "linear", function () {
            $(this).css("top", "0" + "vh").animate({ "top": num1 + "vh" }, 2300, "linear");
        });
        $(".num-con2").animate({ "top": "-62" + "vh" }, 1000, "linear", function () {
            $(this).css("top", "0" + "vh").animate({ "top": num2 + "vh" }, 2900, "linear");
        });
        $(".num-con3").animate({ "top": "-62" + "vh" }, 1000, "linear", function () {
            $(this).css("top", "0" + "vh").animate({ "top": num3 + "vh" }, 3600, "linear");
        });

    }

    function reset() {
        $(".num-con1,.num-con2,.num-con3").css({ "top": "0vh" });
    }

    //抽奖请求
    function rockNow(cityInfo) {
        var data = { "activitytype": activitytype, "region": cityInfo.citycode };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/lotteryactivityservice", data, true).then(function (d) {
            if (d.result) {
                //surplustime = surplustime <= 0 ? 0 : (surplustime - 1);
                //$surplustime.html("今日可免费抽奖 " + surplustime + " 次");
                getuserluckdrawsurplustime();
                if (Onoff) {
                    document.getElementById("musicBox").play();
                }
                if (!$.isNull(d.validatecode)) {
                    claimmethod = d.claimmethod;
                    Luckcouponactivityid = d.couponactivityid;
                    validatecode = d.validatecode;
                    orderid = d.orderid;
                    wintimetostring = d.wintimetostring;
                    overduetimetostring = d.overduetimetostring;

                    TextNum1 = parseInt(Math.random() * 10) % 3;
                    TextNum2 = TextNum1;
                    TextNum3 = TextNum1;

                    setTimeout(function () {
                        reset();
                        letGo();
                    }, 500);
                    setTimeout(function () {
                        flag = false;
                        if (d.isusetemplate) {
                            $WinningImg.hide();
                            $("#img-templates").html(selectTemplate(d)).show();
                        }
                        else {
                            $("#img-templates").hide();
                            $WinningImg.attr("src", d.couponimagesmall).show();
                        }
                        $WinningName.html(d.couponactivityname);
                        $WinningPrice.html('价值：<b>' + d.coupondiscountprice + '元</b>');
                        $(".mask").show();
                        $(".capacity1").show();
                        return;
                    }, 5500);
                }
                else {
                    TextNum1 = parseInt(Math.random() * 10) % 3;
                    TextNum2 = parseInt(Math.random() * 10) % 3;
                    TextNum3 = parseInt(Math.random() * 10) % 3;
                    if (TextNum3 == TextNum2) {
                        TextNum3 = TextNum3 + 1;
                    }

                    setTimeout(function () {
                        reset();
                        letGo();
                    }, 500);
                    setTimeout(function () {
                        flag = false;
                        $(".mask").show();
                        $(".capacity2").show();
                    }, 5500);
                }
            }
            else {
                flag = false;
                if (d.errorcode == 'missing_parameter_accountid') {
                    $.confirmF("请先登录", null, null, null, $.Loginlink);
                    return;
                }
                else if (d.errormsg == '该用户未通过实名认证') {
                    $.confirmF("完善实名信息继续抽奖", null, null, null, $.RegistSteplink);
                    return;
                }
                else if (d.errorcode == '活动已经售罄！') {
                    $.alertF("活动已经售罄");
                    return;
                }
                else if (d.errorcode == '活动即将开始！') {
                    $.alertF("活动即将开始");
                    return;
                }
                else if (d.errorcode == '活动已经结束！') {
                    $.alertF("活动已经结束");
                    return;
                }
                $.alertF(d.errormsg);
                return;
            }
        }, function (d) {
            flag = false;
        });
    }

    //幸运抽奖用户剩余可抽奖次数
    function getuserluckdrawsurplustime() {
        var data = { "activitytype": activitytype };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getuserluckdrawsurplustime", data, true).then(function (d) {
            if (d.result) {
                islogin = true;
                surplustime = d.luckdrawsurplustime;
                if (surplustime == 0) {
                    $(".main3-btn").unbind("click");
                    picpng.attr("src", $.resurl()+"/css/img2.0/gray-game-btn.png");
                }

                $surplustime.html("今日可免费抽奖 " + surplustime + " 次");
            }
        });
    }

    //绑定点击抽奖
    function bindclick() {
        $(".main3-btn").click(function () {
            if (!flag) {
                if (!islogin) {
                    $.confirmF("请先登录", null, null, null, $.Loginlink);
                    return;
                }
                //if (surplustime <= 0) {
                //    $(".main3-btn").unbind("click");
                //    picpng.attr("src", "/css/img2.0/gray-game-btn.png");
                //    return;
                //}
                flag = true;
                $.getLocationCity(rockNow, longitude, latitude);//, "region": cityInfo.citycode
            }
            for (var i = 0; i < 10; i++) {
                $("#img2").fadeToggle(150);
                $("#img4").fadeToggle(150);
            }
        });
    }

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

    //分享给好友
    $("#enjoyfriend").click(function () {
        $(".capacity2").hide();
        $(".mask").show();
        $("#enjoydiv").show();
    });

    $("#voices").click(function () {
        if (Onoff) {
            $("#voices").attr("src", $.resurl()+"/css/img2.0/voiceoff.png");
            Onoff = false;
            document.getElementById("musicBox").pause();
        }
        else {
            $("#voices").attr("src", $.resurl()+"/css/img2.0/voiceon.png");
            Onoff = true;
        };
    });
    $(".rule-tip").find(".icon-turnoff2").click(function () {
        $(".rule-tip").hide();
        $(".mask").hide();
    });
    $(".rule").click(function () {
        $(".rule-tip").show();
        $(".mask").show();
    });
    $(".capacity1").find("i").click(function () {
        $(".mask").css("display", "none");
        $(".capacity1").css("display", "none");
    });
    $(".capacity2").find("i").click(function () {
        $(".mask").css("display", "none");
        $(".capacity2").css("display", "none");
    });

    $("#rockagain").click(function () {
        $(".mask").css("display", "none");
        $(".capacity1").css("display", "none");
        $(".capacity2").css("display", "none");
        //$(".main3-btn").click();
    });

    var $Receive = $("#Receive");
    $Receive.click(function () {

        if (claimmethod == 2) {
            $.confirmF("请设置福利的收货地址！<br>请进入“我的”-->”福利”中,请在福利订单详情中及时提交收货地址！", "稍后设置", "去设置", Receivefun,
           function () {
               window.location.href = '/Html/My/welfaredetails.html?couponactivityid=' + Luckcouponactivityid + '&orderid=' + orderid + '&wintime=' + ($.jsonDateFormat(wintimetostring)) + '&status=2&couponcode=' + validatecode + '&overduetime=' + ($.jsonDateFormat(overduetimetostring)) + '&longitude=' + longitude + '&latitude=' + latitude + "&rocklink=" + (encodeURIComponent(window.location.href));
           });
        }
        else {
            $.alertF('领取成功！<br>请进入“我的”-->”福利”中查看已领取的福利。', null, Receivefun);
        }
        //$.alertF('领取成功！<br>请进入“我的”-->”福利”中查看已领取的福利。', null, Receivefun);
    });
    function Receivefun() {
        $(".mask").hide();
        $(".capacity1").hide();
        $(".capacity2").hide();
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
                arr.push('<div class="ticket1 warp subtract ">');
                arr.push('<div class="percentage vw25 col-ff645b top-10">' + coupontemplates.DecreaseAmount + '<span class="mar-t-0">元</span></div>');
                arr.push('<p class="percentage vw25 font-z-1 col-fe655f top-83">唐小僧商户</p>');
                arr.push('<div class="ticket-content az-text-left t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">满减券</h3>');
                arr.push('<p class="expired-font fz-13rem">满' + coupontemplates.TotalAmount + '元立减' + coupontemplates.DecreaseAmount + '元</p>');
                arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-13rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 2://折扣券
                arr.push('<div class="ticket1 warp discount">');
                arr.push('<div class="percentage vw25 col-ff645b top-10">' + coupontemplates.Discount + '<span class="mar-t-0">折</span></div>');
                arr.push('<p class="percentage vw25 font-z-1 col-fe655f top-83">唐小僧商户</p>');
                arr.push('<div class="ticket-content az-text-left t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">折扣券</h3>');
                arr.push('<p class="expired-font fz-13rem">' + coupontemplates.Discount + '折 最多抵' + coupontemplates.DeductibleAmount + '元</p>');
                arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-13rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 3://代金券
                arr.push('<div class="ticket1 warp chit ">');
                arr.push('<div class="percentage vw25 col-ff645b top-10">' + coupontemplates.CouponAmount + '<span class="mar-t-0">元</span></div>');
                arr.push('<p class="percentage vw25 font-z-1 col-fe655f top-83">唐小僧商户</p>');
                arr.push('<div class="ticket-content az-text-left t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">代金券</h3>');
                arr.push('<p class="expired-font fz-13rem">代金券：' + coupontemplates.CouponAmount + '元</p>');
                arr.push('<p class="expired-font fz-13rem">消费满' + coupontemplates.CanUseCouponAmount + '可用</p>');
                arr.push('<p class="expired-font fz-13rem">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-13rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 4://自定义
                arr.push('<div class="ticket1 warp tang ">');
                arr.push('<p class="self col-ff645b az-text-left" style="font-size: 3rem;">优惠券</p>');
                arr.push('<div class="content-box">');
                arr.push('<p class="content-18 col-ff645b fz-13rem az-text-left">' + $.Cutstring2(coupontemplates.UserDefined, 18) + '</p>');
                arr.push('<p class="expired-font fz-13rem az-text-left">有效期至：' + (new Date(element.overduetimetostring.replace(/-/g, "/")).Format("yyyy-MM-dd")) + '</p>');
                arr.push('</div>');
                arr.push('<p class="fz-13rem col-888"><span class="zj az-text-left">最终解释权归唐小僧理财</span><span class="tang-name">唐小僧商户</span></p>');
                arr.push('</div>');
                break;
        }
        return (arr.join(''));
    }

})(jQuery);
