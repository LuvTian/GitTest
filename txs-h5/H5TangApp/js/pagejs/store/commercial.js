/// <reference path="//_references.js" />
$(document).foundation();


var tel = "";//商户电话
var id = $.getQueryStringByName("id");//商户ID
var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var $imglarge = $("#imglarge");//商户大图
var $imgsmall = $("#imgsmall");//商户小图
var $Category = $("#Category");//商户分类图
var $name = $("#name");//商户名
var $distance = $("#distance");//距离
var $address = $("#address");//地址
var $descLong = $("#descLong")//介绍
var $addressMap = $("#addressMap");//地址地图链接
var $WelfareList = $("#WelfareList");//商户内福利列表
var $loadmore = $("#loadmore");//商户暂未提供福利
var datalist = [];//去重容器
var isOpen = true;
var storeid = "";



var pageindex = 1;
var pagesize = 100;
var pagecount = 0;//数据条数
var pagenumber = 0;//页数

//商户详情
(function ($) {

    commercialInfo(id);
    //商户详情
    function commercialInfo(id) {
        var data = { "id": id, "longitude": longitude, "latitude": latitude };
        $.AkmiiAjaxPost("/StoreServices.svc/store/getstoreinfobykey", data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                var store = d.store;
                $imglarge.attr({ src: store.storeimglarge, alt: store.storename });
                $imgsmall.attr({ src: store.storeimagelogo, alt: store.storename });
                $Category.html('<span class="wxicon ' + $.GetIconByCategory(store.storecategory) + '"></span>');
                $name.html($.Cutstring(store.storename, 8, ".."));
                $.procitydis(d.store.storeprovince, d.store.storecity, d.store.storedistrict, d.store.storeaddress, $address);
                $descLong.html(store.storedesclong);
                tel = store.phone;
                storeid = store.storeid;
                $addressMap.click(function () {
                    window.location = "/html/store/commercialMapAddress.html?longitude=" + store.longitude + "&latitude=" + store.latitude + "&storename=" + encodeURI(store.storename);
                });
                commercialWelfare();
            }
            else {
                $.alertF($.defaultError());
            }
        }, function () { $.preloaderFadeOut(); });
    }
    //展开收缩奖品
    $(".on-click").click(function () {
        $(".shop-list:gt(2)").slideToggle();
        $(".shop-list:eq(2)").slideToggle();

        $(this).find("i").toggleClass("icon-up");

        if (isOpen) {
            $(this).find("span").html("点击收起更多福利");
        }
        else {
            $(this).find("span").html("点击展开更多福利");
        }
        isOpen = !isOpen;
    })


    function commercialWelfare() {
        $.getLocationCity(getData, longitude, latitude);
    };

    //商户提供的福利
    function getData(cityInfo) {
        var data = { "storeid": storeid, "pageindex": pageindex, "pagesize": pagesize, "longitude": longitude, "latitude": latitude, "region": cityInfo.citycode, "status":5};
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfolist", data, true).then(function (d) {

            if (d.result) {
                //$loadmore.attr("disabled", false);
                if (d.pagecount <= 2) {
                    $(".on-click").hide();
                }
                if (d.pagecount == 0) {
                    $loadmore.show();
                    $(".on-click").hide();
                }
                else {
                    pagenumber = Math.ceil(d.pagecount / pagesize);
                    var list = d.couponactivitylist;
                    //if (pagenumber == pageindex) {
                    //    $loadmore.html("没有更多数据");
                    //    $loadmore.attr("disabled", true);
                    //}
                    var display = "";
                    var activitysketch = "";
                    var activitytypeHref = "";
                    $.each(list, function (index, element) {
                        if (index == 0) {
                            $distance.html($.Distance($.Getdistance(longitude, latitude, element.storelongitude, element.storeatitude)));
                            $distance.parent().show()
                        }
                        if (datalist.indexOf(element.id) < 0) {
                            datalist.push(element.id);
                            //if (!isClick) {//手动点击加载跟多数据，默认是显示
                            if (index == 2) {
                                display = 'style="display:none;"';
                            }
                            //}
                            //[1 摇聚惠 ;2 商户福利;3 幸运西游机;]
                            switch (element.activitytype) {
                                case 1:
                                    href = "/html/store/rock.html?storeid=" + storeid + "&activitytype=1&couponactivityid=" + element.id + "&longitude=" + longitude + "&latitude=" + latitude;
                                    break;
                                case 2:
                                    href = '/html/Store/rock.html?activitytype=2&storeid=' + element.storeid + '&activitytype=2&longitude=' + longitude + '&latitude=' + latitude;
                                    break;
                                case 3:
                                    href = '/html/Store/Luckdraw.html?longitude=' + longitude + '&latitude=' + latitude;
                                    break;
                                default:
                                    href = "#";
                                    break;
                            }
                            var ha = [];
                            ha.push('<a href="' + href + '" title="">');
                            ha.push('<div class="shop-list az-clearfix bb"  ' + display + '>');
                            ha.push('<div class="row">');
                            ha.push('<div class="small-4 columns az-padding0 az-center">');
                            ha.push('<img src="' + element.couponimagesmall + '" alt="' + element.name + '">');
                            ha.push('</div>');
                            ha.push('<div class="small-8 columns az-padding0">');
                            ha.push('<p class="tit">');
                            ha.push('' + $.Cutstring(element.name, 13, "..") + '');
                            ha.push('</p>');
                            ha.push('<p class="tip">' + $.Cutstring(element.couponabstract, 14, "..") + '</p>');
                            ha.push('<p class="tips2">已出' + element.deliverycount + '件</p>');
                            ha.push('<i class="wxicon icon-right-arrow"></i>');
                            ha.push('<p class="tips4">价值 <b class="red2">' + element.couponprice + '</b><b class="red1">元</b></p>');
                            ha.push('</div>');
                            ha.push('</div>');
                            ha.push('</div>');
                            ha.push('</a>');
                            var item = $(ha.join(''));
                            $WelfareList.append(item);
                        }
                    });

                }
            }
            else { $.alertF($.defaultError()); }

        });

    }

})(jQuery);

function phone() {
    window.location.href = 'tel://' + tel.split(/[，\,\;；\|\/、。\.\\]/)[0];
}