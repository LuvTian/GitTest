/// <reference path="//Common.js" />

$(document).foundation();

(function ($) {
    var pageindex = 1;
    var pagesize = 10;
    var activitytype = 3;//西游机
    var pagecount = 0;
    var pagenumber = 0;//页数

    var $datalist = $("#datalist");//奖品列表
    var $loadmore = $("#loadmore");//加载更多按钮

    var datalist = [];
    var nomore = false;
    var Location = {};

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

    function Success(data) {
        Location = data;
        Prizelist(pageindex, pagesize);
    }
    function Failure() {
        $.getLocationFailure();
    }


    //奖品列表
    function Prizelist(pageindex, pagesize) {
        var data = { "pageindex": pageindex, "pagesize": pagesize, "longitude": Location.lng, "latitude": Location.lat };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getmywinninginfolist", data, true).then(function (d) {
            if (d) {
                $loadmore.attr("disabled", false);
                pagenumber = Math.ceil(d.pagecount / pagesize);
                if (pagenumber == pageindex) {
                    nomore = true;
                    $loadmore.html("没有更多数据");
                    $loadmore.attr("disabled", true);
                }
                var list = d.mywinninginfos;
                var activitysketch = "";
                if (list.length <= 0) {
                    nomore = true;
                    $loadmore.html("暂无数据");
                    $loadmore.attr("disabled", true);
                }
                $.each(list, function (index, element) {
                    //订单状态 0:删除 1:已过期 2：未处理[未消费]；3：待发货；4：待收货；5： 已收货；6：已评价；\n0:删除 1:已过期 2：未消费 5： 已消费；
                    var now = new Date();
                    var status;
                    if (element.status == 5) {
                        status = "已消费";
                    }
                    else if (element.status == 1 || Date.parse(new Date(element.overduetime.replace(/-/g, "/"))) < Date.parse(now)) {
                        status = "已过期";
                    }
                    else if (element.status == 2 || element.status == 3) {
                        status = "未消费";
                    }
                    if (datalist.indexOf(element.orderid) < 0) {
                        datalist.push(element.orderid);
                        var couponactivityname = $.Cutstring(element.couponactivityname, 10);
                        var couponabstract = $.Cutstring(element.couponabstract, 14);
                        var ha = [];
                        ha.push('<a href="/Html/My/welfaredetails.html?couponactivityid=' + element.couponactivityid + '&orderid=' + element.orderid + '&wintime=' + ($.jsonDateFormat(element.wintime)) + '&status=' + element.status + '&couponcode=' + element.couponcode + '&overduetime=' + ($.jsonDateFormat(element.overduetime)) + '&longitude=' + Location.lng + '&latitude=' + Location.lat + '&deliveryname=' + element.deliveryname + '&deliveryphone=' + element.deliveryphone + '&deliveryaddress=' + element.deliveryaddress + '">');
                        ha.push('<div class="shop-list az-clearfix bb"><div class="row az-paddingBottom">');
                        ha.push(' <div class="small-4 columns az-padding0 az-center"><img src=' + element.couponimagesmall + ' alt=""></div>');
                        ha.push(' <div class="small-8 columns az-padding0"><p class="tit"><span class="wxicon ' + $.GetIconByCategory(element.category) + '"></span>' + couponactivityname + '</p><p class="tip">' + couponabstract + '</p>');
                        if (status == "已过期" || status == "已消费") {
                            ha.push(' <p class="tips2">有效期至' + $.jsonDateFormat(element.overduetime) + '</p><p class="tips3">' + $.Distance(element.distance) + 'm</p><p class="tips4"><span class="border-r col-f-bord">' + status + '</span></p></div>');
                        }
                        else {
                            ha.push(' <p class="tips2">有效期至' + $.jsonDateFormat(element.overduetime) + '</p><p class="tips3">' + $.Distance(element.distance) + 'm</p><p class="tips4"><span class="border-r">' + status + '</span></p></div>');
                        }
                        ha.push('</div></div></a>');
                        var item = $(ha.join(''));
                        $datalist.append(item);
                    }
                });
            }
        }, function () { $.preloaderFadeOut(); });
    }
    $(window).scroll(function () {
        if (!nomore) {
            if ($(document).height() - $(window).height() - $(document).scrollTop() < 10) {
                pageindex = pageindex + 1;
                pageindex = pageindex > pagenumber ? pagenumber : pageindex;
                Prizelist(pageindex, pagesize);
            }
        }
    });
})(jQuery);
