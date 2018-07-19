/// <reference path="//_references.js" />


//status 4,5,6 :即将 聚会中 已结束 -作废
var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var maxcount = $.getQueryStringByName("maxcount") || 0;

var pagesize;
if (maxcount > 10) {
    pagesize = maxcount;
}
else {
    pagesize = 10;
}
var pageindex = 1;
var activitytype = 1;//[1 摇聚惠 ;2 商户福利;3 幸运西游机;]
var $datalist = $("#datalist");//奖品列表
var $loadmore = $("#loadmore");//加载更多按钮
var $juhuiinglist = $(".juhuiing");//聚会中列表
var $startinglist = $(".starting");//即将开始列表
var $endlist = $(".end");//结束列表
var datalist = [];
var nomore = false;

$(function () {
    getCurrentLocation();
});

var getData = function (lng, lat) {
    $.getLocationCity(function (city) {
        var code = city.citycode;
        //请求状态为摇一摇的数据。
        var data = {
            "longitude": longitude, "latitude": latitude, "pageindex": pageindex, "pagesize": pagesize, "region": code, "status": 1
        };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfoyaojuhuilist?v=" + (new Date()).getTime(), data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                var list = d.couponactivitylist;
                if (list.length <= 0) {
                    $(".shake-fixed").hide();
                }
                $.each(list, function (index, element) {
                    $juhuiinglist.append(getRockModelHtml(element));
                });
            }
        }, function (d) {
            $.preloaderFadeOut();
            $.alertF(d.errormsg);
        });
        //请求状态为即将开始的数据。
        data.status = 2;
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfoyaojuhuilist?v=" + (new Date()).getTime(), data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                var list = d.couponactivitylist;
                if (list.length <= 0) {
                    $(".startinga").hide();
                }
                $.each(list, function (index, element) {
                    $startinglist.append(getRockModelHtml(element));
                });
            }
        }, function (d) {
            $.preloaderFadeOut();
            $.alertF(d.errormsg);
        });
        data.status = 3;
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfoyaojuhuilist?v=" + (new Date()).getTime(), data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                var list = d.couponactivitylist;
                if (list.length <= 0) {
                    $(".enda").hide();
                }
                $.each(list, function (index, element) {
                    $endlist.append(getRockModelHtml(element));
                });
            }
        }, function (d) {
            $.preloaderFadeOut();
            $.alertF(d.errormsg);
        });
    }, location.lng, location.lat);
    pageScroll();
};

var getRockList = function (data) {
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfoyaojuhuilist?v=" + (new Date()).getTime(), data, true)
};

var getCurrentLocation = function () {
    //
    if ($.getCookie("MadisonStoreBaiduLocation")) {
        //经纬度
        var location = eval("(" + $.getCookie("MadisonStoreBaiduLocation") + ")");
        getData(location.lng, location.lat);
    } else {
        if ($.is_weixn2()) {
            //从服务器获取当前地理位置
            $.getWechatconfig("getLocation", function (location) {
                getData(location.lng, location.lat);
            }, function () {
                $.getLocationFailure();
            });
        }
        else {
            //弹出提示框（无法从微信获取地理位置时）
            $.getLocationFailure();
        }
    };
};

var getRockModelHtml = function (element) {
    var item;
    if (datalist.indexOf(element.id) < 0) {
        datalist.push(element.id);
        var now = new Date();

        var start = element.activitystart;
        var end = (element.activityend);
        var status = element.activitystatus;
        var ha = [];
        ha.push('<article class="bg-white margin1">');
        if (element.isusetemplate) {
            ha.push(selectTemplate(element));
        }
        else {
            ha.push('<img src="' + element.couponimagesmall + '" alt=""  class="img-responsive">');
        }
        ha.push('<div class="shake-value text-right">价值：');
        ha.push('<em>' + element.couponprice + '</em>元</div>');
        //标识是否已摇
        if (element.isplayed) {
            ha.push('<div class="seal-img"><img src="'+$.resurl()+'/css/img2.0/seal.png"></div>');
        }
        ha.push('<div class="row"><div class="small-8 left"><span class="wxicon ' + $.GetIconByCategory(element.category) + '"></span>');
        ha.push($.Cutstring(element.name, 10, ".."));
        ha.push('<p class="gray">已出' + element.deliverycount + '件/剩余' + element.residuecount + '件</p>');
        ha.push('</div><div class="small-4 left text-right shake-button"><p class="gray"></p>');

        var yurl = '/html/store/rock.html?activitytype=1&couponactivityid=' + element.id + '&storeid=' + element.storeid + '&longitude=' + longitude + '&latitude=' + latitude;
        var isflag = false;
        if (Date.parse(new Date(start.replace(/-/g, "/"))) <= Date.parse(now) && Date.parse(new Date(end.replace(/-/g, "/"))) >= Date.parse(now)) {
            if (element.residuecount <= 0) {
                ha.push('<a href="javascript:void(0)" class="bg-gray-deep">已抢光</a></div>');
                ha.push('</div></div></article>');
                item = $(ha.join(''));
                item.click(function () {
                    window.location.href = yurl;
                });
                item.find("a").click(function () { return false });
            }
            else {
                ha.push('<a href="' + yurl + '" class="bg-yellow">摇一摇</a></div>');
                ha.push('</div></div></article>');
                item = $(ha.join(''));
                item.click(function () {
                    window.location.href = yurl;
                });
            }

        }
        else if (status == 6 || Date.parse(now) > Date.parse(new Date(end.replace(/-/g, "/")))) {
            ha.push('<a href="javascript:void(0)" class="bg-gray-deep">已结束</a></p></div>');
            ha.push('</div></div></article>');
            item = $(ha.join(''));
            item.click(function () {
                window.location.href = yurl;
            });
            item.find("a").click(function () { return false });
        }
        else if (status == 5 && Date.parse(new Date(start.replace(/-/g, "/"))) > Date.parse(now)) {
            isflag = true;
            ha.push('<a href="' + yurl + '" class="bg-red surtime" >即将开始</a></div>');
            ha.push('</div></div></article>');
            item = $(ha.join(''));
            item.click(function () {
                window.location.href = yurl;
            });
        }

        if (isflag) {
            $.ActivityCountDown(item.find(".surtime"), start);
        }
    }
    return item;
};

var pageScroll = function () {
    var shaketab = $(".stabs");
    $(".viewport").scroll(function () {
        $.each(shaketab, function (i, item) {
            var aheight = $(".shake-list:eq(" + i + ")").height()
            if (i == 0 && $(item).offset().top < 5 && $(item).offset().top) {
                $(".stoptabs").html('<li class="bg-yellow">钜惠中</li>');
            }
            else
                if ($(item).offset().top < 5 && $(item).offset().top) {
                    $(".stoptabs").html($(this).html());
                }
        });
    });
};

//使用模板
var selectTemplate = function (element) {
    coupontemplates = element.coupontemplates;
    var arr = [];
    switch (coupontemplates.TemplateType) {
        case 1://满减券
            arr.push('<div class="ticket1 warp subtract ">');
            arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.DecreaseAmount + '<span class="mar-t-0">元</span></div>');
            arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0">满减券</h3>');
            arr.push('<p class="expired-font fz-16rem">满' + coupontemplates.TotalAmount + '元立减' + coupontemplates.DecreaseAmount + '元</p>');
            arr.push('<p class="expired-font fz-16rem">有效期至：' + (element.activityvalidend) + '</p>');
            arr.push('</div>');
            arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
            arr.push('</div>');
            break;
        case 2://折扣券
            arr.push('<div class="ticket1 warp discount">');
            arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.Discount + '<span class="mar-t-0">折</span></div>');
            arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0">折扣券</h3>');
            arr.push('<p class="expired-font fz-16rem">' + coupontemplates.Discount + '折 最多抵' + coupontemplates.DeductibleAmount + '元</p>');
            arr.push('<p class="expired-font fz-16rem">有效期至：' + (element.activityvalidend) + '</p>');
            arr.push('</div>');
            arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
            arr.push('</div>');
            break;
        case 3://代金券
            arr.push('<div class="ticket1 warp chit ">');
            arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.CouponAmount + '<span class="mar-t-0">元</span></div>');
            arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0">代金券</h3>');
            arr.push('<p class="expired-font fz-16rem">代金券：' + coupontemplates.CouponAmount + '元</p>');
            arr.push('<p class="expired-font fz-16rem">消费满' + coupontemplates.CanUseCouponAmount + '可用</p>');
            arr.push('<p class="expired-font fz-16rem">有效期至：' + (element.activityvalidend) + '</p>');
            arr.push('</div>');
            arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
            arr.push('</div>');
            break;
        case 4://自定义
            arr.push('<div class="ticket1 warp tang ">');
            arr.push('<p class="self col-ff645b">优惠券</p>');
            arr.push('<div class="content-box">');
            arr.push('<p class="content-18 col-ff645b fz-16rem">' + $.Cutstring2(coupontemplates.UserDefined, 18) + '</p>');
            arr.push('<p class="expired-font fz-16rem">有效期至：' + (element.activityvalidend) + '</p>');
            arr.push('</div>');
            arr.push('<p class="fz-16rem col-888"><span class="zj">最终解释权归唐小僧理财</span><span class="tang-name">唐小僧商户</span></p>');
            arr.push('</div>');
            break;
    }
    return (arr.join(''));
}