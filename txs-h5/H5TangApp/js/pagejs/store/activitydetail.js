/// <reference path="//_references.js" />


(function ($) {
    var longitude = $.getQueryStringByName("longitude") || 0;
    var latitude = $.getQueryStringByName("latitude") || 0;
    var id = $.getQueryStringByName("id");//活动ID

    var $couponprice = $("#couponprice");//价值xx元
    var $validcount = $("#validcount");//已出多少件
    var $residuecount = $("#residuecount");//剩余多少件
    var $storeimg = $("#storeimg");//商家图片
    var $storename = $("#storename");//商家名称
    var $storephone = $("#storephone");//商家电话
    var $distance = $("#distance");//距离
    var $storecouponcount = $("#storecouponcount");//共xx福利
    var $activitydetail = $("#activitydetail");//奖品介绍
    var $storecategory = $("#storecategory");//商家分类
    var $storecategory2 = $("#storecategory2");//商家分类
    var $storedescshort = $("#storedescshort");//商家简述
    var $couponimagelarge = $("#couponimagelarge");//活动大图
    var $commercial = $("#commercial");//商家详情页
    var $couponoverview = $("#couponoverview");//商家详情页
    var $lingquinfo = $("#lingquinfo");//领取说明
    var href = "";//活动跳转地址
    var $name = $("#name");//活动名称
    //商家分类图 商家简介0

    activiDetail();
    function activiDetail() {
        var data = { "id": id, "longitude": longitude, "latitude": latitude };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitydetailedinfobykey", data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                var couponactivity = d.couponactivity;
                $couponprice.html(couponactivity.couponprice);
                $validcount.html(couponactivity.deliverycount);
                $residuecount.html(couponactivity.residuecount);
                $storename.html($.Cutstring(couponactivity.storename, 9, ".."));
                $storephone.html(couponactivity.storephone);
                $distance.html($.Distance(couponactivity.distance));
                $storecouponcount.html(couponactivity.storecouponcount);
                $activitydetail.html(couponactivity.activitydetail.replace(/\n/g, "<br/>"));
                $name.html('<span class="wxicon ' + $.GetIconByCategory(couponactivity.storecategory) + '"></span>' + couponactivity.name);
                //$storedescshort.html($.Cutstring(couponactivity.storeaddress, 15, ".."));
                $storeimg.attr("src", couponactivity.storeimagelogo);
                $storecategory.html('<span class="wxicon ' + $.GetIconByCategory(couponactivity.storecategory) + '"></span>');
                //$storecategory2.attr("src", $.GetImgByCategory(couponactivity.storecategory));
                if (d.couponactivity.isusetemplate && d.couponactivity.coupontemplates) {
                    selectTemplate(d.couponactivity);
                }
                else {
                    $couponimagelarge.attr("src", couponactivity.couponimagelarge);
                }
                $lingquinfo.html(couponactivity.activitysketch.replace(/\n/g, "<br/>"));
                $couponoverview.html(couponactivity.couponoverview);

                $.procitydis(d.couponactivity.storeprovince, d.couponactivity.storecity, d.couponactivity.storedistrict, d.couponactivity.storeaddress, $storedescshort);

                $commercial.click(function () {
                    window.location.href = "/html/store/commercial.html?id=" + couponactivity.storeid + "&longitude=" + longitude + "&latitude=" + latitude;
                });
            }
        }, function () { $.preloaderFadeOut(); });
    }
    //使用模板
    var selectTemplate = function (couponactivity) {
        var coupontemplates = couponactivity.coupontemplates
        var arr = [];
        switch (coupontemplates.TemplateType) {
            case 1://满减券
                arr.push('<div class="ticket1 subtract ">');
                arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.DecreaseAmount + '<span class="mar-t-0">元</span></div>');
                arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
                arr.push('<div class="ticket-content t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">满减券</h3>');
                arr.push('<p class="expired-font fz-16rem">满' + coupontemplates.TotalAmount + '元立减' + coupontemplates.DecreaseAmount + '元</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (couponactivity.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 2://折扣券
                arr.push('<div class="ticket1 discount">');
                arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.Discount + '<span class="mar-t-0">折</span></div>');
                arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
                arr.push('<div class="ticket-content t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">折扣券</h3>');
                arr.push('<p class="expired-font fz-16rem">' + coupontemplates.Discount + '折 最多抵' + coupontemplates.DeductibleAmount + '元</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (couponactivity.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 3://代金券
                arr.push('<div class="ticket1 chit ">');
                arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.CouponAmount + '<span class="mar-t-0">元</span></div>');
                arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
                arr.push('<div class="ticket-content t-51 left_35">');
                arr.push('<h3 class="col-ff645b margin-bottom0">代金券</h3>');
                arr.push('<p class="expired-font fz-16rem">代金券：' + coupontemplates.CouponAmount + '元</p>');
                arr.push('<p class="expired-font fz-16rem">消费满' + coupontemplates.CanUseCouponAmount + '可用</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (couponactivity.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="gray-font2 bottom-4x fz-16rem left_35">最终解释权归唐小僧理财</p>');
                arr.push('</div>');
                break;
            case 4://自定义
                arr.push('<div class="ticket1 tang ">');
                arr.push('<p class="self col-ff645b">优惠券</p>');
                arr.push('<div class="content-box">');
                arr.push('<p class="content-18 col-ff645b fz-16rem">' + $.Cutstring2(coupontemplates.UserDefined, 18) + '</p>');
                arr.push('<p class="expired-font fz-16rem">有效期至：' + (couponactivity.activityvalidend) + '</p>');
                arr.push('</div>');
                arr.push('<p class="fz-16rem col-888"><span class="zj">最终解释权归唐小僧理财</span><span class="tang-name">唐小僧商户</span></p>');
                arr.push('</div>');
                break;
        }
        $(".exhibit").prepend($(arr.join('')));
        $("#couponimagelarge").hide();
    }
})(jQuery);


