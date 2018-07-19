/// <reference path="//Common.js" />


//摇一摇中奖名单
(function ($) {
    //var longitude = $.getQueryStringByName("longitude") || 0;
    //var latitude = $.getQueryStringByName("latitude") || 0;
    var storeid = $.getQueryStringByName("storeid") || 0;
    var couponactivityid = $.getQueryStringByName("couponactivityid");
    var pageindex = 1;
    var pagesize = 10;
    var activitytype = $.getQueryStringByName("activitytype");//活动类型[null:All;1:摇炬惠;2:商户福利;3:幸运西游机;]
    var pagecount = 0;
    var pagenumber = 0;//页数

    var list = $(".list");
    var zhongjianglist = $("#zhongjianglist");//奖品列表
    var $loadmore = $("#loadmore");//加载更多按钮

    var datalist = [];
    var nomore = false;

    var temp = false;
    Luckdraw_win(pageindex, pagesize);

    //$loadmore.click(function () {
    //    $loadmore.attr("disabled", true);
    //    pageindex = pageindex + 1;
    //    pageindex = pageindex > pagenumber ? pagenumber : pageindex;
    //    Luckdraw_win(pageindex, pagesize);
    //});

    //中奖名单
    function Luckdraw_win() {
        if (temp == false) {
            var data = { "id": couponactivityid };
            $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitydetailedinfobykey", data, true).then(function (d) {
                $.preloaderFadeOut();
                if (d.result) {
                    temp = true;
                    var ha = [];
                    if (d.couponactivity.isusetemplate && d.couponactivity.coupontemplates) {
                        ha.push(selectTemplate(d.couponactivity));
                    }
                    else {
                        ha.push(' <img src="' + d.couponactivity.couponimagelarge + '" alt="">');
                    }
                    ha.push(' <p class="az-clearfix"><span class="name az-left"><span class="wxicon ' + $.GetIconByCategory(d.couponactivity.storecategory) + '"></span>' + d.couponactivity.name + '</span><span class="az-right distance">价值:<span class="f-wt">' + d.couponactivity.couponprice + '</span>元</span></p>');
                    ha.push('<p class="az-clearfix"><span class="surplus az-left">' + d.couponactivity.couponabstract + '</span><span class="surplus az-right">已出' + d.couponactivity.deliverycount + '件</span></p>');
                    var result = $(ha.join(''));
                    list.append(result);
                }
                else {
                    $.alertF($.defaultError());
                }

            }, function () { $.preloaderFadeOut(); });
        }
        data = { "pageindex": pageindex, "pagesize": pagesize, "activitytype": activitytype, "storeid": storeid, "couponactivityid": couponactivityid };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitywinnerslist", data, true).then(function (d) {
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
                        var couponactivityname = $.Cutstring(element.couponactivityname, 12);
                        var ha = [];
                        ha.push('<div class="info az-clearfix bb">');
                        ha.push('<p class="az-clearfix"><span class="az-left">' + element.username + '</span></p>');
                        ha.push('<p class="az-clearfix"><span class="az-left">' + $.jsonDateFormat(element.gettime) + '</span></p>');
                        ha.push('</div>');
                        var result = $(ha.join(''));
                        zhongjianglist.append(result);
                    }
                });
            }
            else {
                $.alertF($.defaultError());
            }

        });
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


    //使用模板
    var selectTemplate = function (data) {
        coupontemplates = data.coupontemplates;
        var arr = [];
        switch (coupontemplates.TemplateType) {
            case 1://满减券
                arr.push('<div class="ticket1 subtract ">');
                arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.DecreaseAmount + '<span class="mar-t-0 dis-block">元</span></div>');
                arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
                arr.push('<div class="ticket-content t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">满减券</h3>');
                arr.push('<p class="expired-font fz-16rem">满' + coupontemplates.TotalAmount + '元立减' + coupontemplates.DecreaseAmount + '元</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (data.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 2://折扣券
                arr.push('<div class="ticket1 discount">');
                arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.Discount + '<span class="mar-t-0 dis-block">折</span></div>');
                arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
                arr.push('<div class="ticket-content t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">折扣券</h3>');
                arr.push('<p class="expired-font fz-16rem">' + coupontemplates.Discount + '折 最多抵' + coupontemplates.DeductibleAmount + '元</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (data.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 3://代金券
                arr.push('<div class="ticket1 chit ">');
                arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.CouponAmount + '<span class="mar-t-0 dis-block">元</span></div>');
                arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
                arr.push('<div class="ticket-content t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">代金券</h3>');
                arr.push('<p class="expired-font fz-13rem">代金券：' + coupontemplates.CouponAmount + '元</p>');
                arr.push('<p class="expired-font fz-13rem">消费满' + coupontemplates.CanUseCouponAmount + '可用</p>');
                arr.push('<p class="expired-font fz-13rem">有效期至：' + (data.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 4://自定义
                arr.push('<div class="ticket1 tang ">');
                arr.push('<p class="self col-ff645b">优惠券</p>');
                arr.push('<div class="content-box">');
                arr.push('<p class="content-18 col-ff645b fz-16rem">' + $.Cutstring2(coupontemplates.UserDefined, 18) + '</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (data.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="fz-16rem col-888"><span style="color: #888;" class="zj">最终解释权归唐小僧理财</span><span class="tang-name">唐小僧商户</span></p>');
                arr.push('</div>');
                break;
        }
        list.append(arr.join(''));
    }
})(jQuery);