/// <reference path="/_references.js" />

//摇一摇中奖名单
(function ($) {
    //var longitude = $.getQueryStringByName("longitude") || 0;
    //var latitude = $.getQueryStringByName("latitude") || 0;
    var storeid = $.getQueryStringByName("storeid") || 0;
    var pageindex = 1;
    var pagesize = 15;
    var activitytype = $.getQueryStringByName("activitytype");//活动类型[null:All;1:摇炬惠;2:商户福利;3:幸运西游机;]
    var pagecount = 0;
    var pagenumber = 0;//页数

    var $gamewinlist = $("#gamewinlist");//奖品列表
    var $loadmore = $("#loadmore");//加载更多按钮

    var datalist = [];
    var nomore = false;

    Luckdraw_win(pageindex, pagesize);

    //$loadmore.click(function () {
    //    $loadmore.attr("disabled", true);
    //    pageindex = pageindex + 1;
    //    pageindex = pageindex > pagenumber ? pagenumber : pageindex;
    //    Luckdraw_win(pageindex, pagesize);
    //});

    //中奖名单
    function Luckdraw_win() {
        var data = { "pageindex": pageindex, "pagesize": pagesize, "activitytype": activitytype, "storeid": storeid};
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitywinnerslist", data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                $loadmore.attr("disabled", false);
                pagenumber = Math.ceil(d.pagecount / pagesize);
                if (pagenumber == pageindex) {
                    nomore = true;
                    $loadmore.html("没有更多数据");
                    $loadmore.attr("disabled", true);
                }
                var list = d.activitywinnersinfomodel;
                if (list.length <= 0) {
                    nomore = true;
                    $loadmore.html("暂无数据");
                    $loadmore.attr("disabled", true);
                    return;
                }
               
               
                var couponactivityname = "";
                $.each(list, function (index, element) {
                    if (datalist.indexOf(element.id) < 0) {
                        datalist.push(element.id);
                        couponactivityname = element.couponactivityname.length > 10 ? element.couponactivityname.substring(0, 10) + "..." : element.couponactivityname;
                        var item = '<div class="info az-clearfix bb">';
                        item += '<p class="az-clearfix"><span class="az-left">' + element.username + '</span></p>';
                        item += '<p class="az-clearfix"><span class="az-left">获得<b>' + couponactivityname + '</b></span><span class="az-right">' + $.jsonDateFormat(element.gettime) + '</span></p>';
                        item += '</div>';
                        $gamewinlist.append(item);
                    }
                });
            }
            else {
                $.alertF($.defaultError());
            }

        }, function () { $.preloaderFadeOut(); });
    }



    $(window).scroll(function () {
        if (!nomore) {
            if ($(document).height() - $(window).height() - $(document).scrollTop() < 10) {
                pageindex = pageindex + 1;
                pageindex = pageindex > pagenumber ? pagenumber : pageindex;
                Luckdraw_win();
            }
        }
    });
})(jQuery);