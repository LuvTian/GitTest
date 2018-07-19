/// <reference path="//_references.js" />

var Location = {};//经纬度
var $atopbanner = $("#atopbanner");//头部banner超链接
var $imgtopbanner = $("#imgtopbanner");//头部img链接
var $amiddlebanner = $("#amiddlebanner");//头部banner超链接
var $imgmiddlebanner = $("#imgmiddlebanner");//头部img链接
var $agame = $("#agame");//西游机链接
var $rocklist = $("#rocklist");//精品福利链接
var $happy_rock = $("#happy-rock");//开心摇一摇链接
var $commercial_welfare = $("#commercial_welfare");//商户福利链接
var $mylink = $("#my-link");//我的链接
var $boutiquelist = $("#BoutiqueList");
var $searchButton = $(".search-button");
var maxcount = 0;
(function ($) {
    //alert(window.navigator.userAgent);
    $("#all-body-div-status").fadeOut();
    $("#all-body-div-preloader").delay(350).fadeOut("slow");
    setTimeout(function () { $(".mymove2").removeClass("mymove2"); }, 3000);
    $(".icon-turnoff").click(function () {
        $(".fuli-ad").hide();
    });

    setTimeout(function () { $(".mymove2").removeClass("mymove2"); }, 3000);
    $(".icon-turnoff").click(function () {
        $(".fuli-ad").hide();
        return false;
    });

    $._imgLoad($("#agame").find("img"), function (img) {
        $(img).attr("src", $(img).attr("data-src"));
    });

    var LocationCookie = $.getCookie("MadisonStoreBaiduLocation");
    if (!$.isNull(LocationCookie)) {
        Location = (new Function('return' + LocationCookie))();
        Success(Location);
    }
    else {
        if ($.is_weixn() && !$.is_pcwechat()) {
            $.getWechatconfig("getLocation", Success, Failure);
        }
        else {
            $.getLocationFailure(false, Success);
        }
    }
    if (!$.getCookie("MadisonToken")) {
        $(".qujin-nav").attr("href", "/html/anonymous/login.html");
        $mylink.attr("href", "/html/anonymous/login.html");
    }
    else {
        $mylink.attr("href", "/html/my/index.html");
        $.getMitteilung($("#my-link"));
    }
})(jQuery);


function Success(data) {
    Location = data;
    $.getLocationCity(getLocationCityFun);
    $agame.attr("href", "/Html/Store/Luckdraw.html?longitude=" + Location.lng + "&latitude=" + Location.lat);
    $rocklist.attr("href", "/Html/Store/rocklist.html?longitude=" + Location.lng + "&latitude=" + Location.lat + "&maxcount=" + maxcount);
    $commercial_welfare.attr("href", "/Html/Store/search.html?longitude=" + Location.lng + "&latitude=" + Location.lat);
    $searchButton.attr("href", "/Html/Store/search.html?search=true&longitude=" + Location.lng + "&latitude=" + Location.lat);
    //获取当前城市
    //banner图
    GetBanner();
    //获取置顶福利
    getBoutique();
    //获取附近福利
    getNearest();
}

function Failure() {
    $.getLocationFailure(false, Success);
}

function getLocationCityFun(data) {
    if (data != null) {
        $("#city").html(data.city + " " + data.district);
    }
    else {
        $("#city").html("请选择");
    }
}

function getBoutique() {
    $.getLocationCity(getData2, Location.lng, Location.lat);//, "region": cityInfo.citycode
};

//获取置顶精品福利
function getData2(cityInfo) {
    var data = { "longitude": "" + Location.lng, "latitude": "" + Location.lat, "precision": "", "region": cityInfo.citycode };
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/activitygetboutique", data, true).then(function (d) {
        $.preloaderFadeOut();
        if (d) {
            var list = d.activityboutiqueinfolist;
            maxcount = d.datacount;
            $rocklist.attr("href", "/Html/Store/rocklist.html?longitude=" + Location.lng + "&latitude=" + Location.lat + "&maxcount=" + maxcount);
            $happy_rock.attr("href", "/Html/Store/rocklist.html?longitude=" + Location.lng + "&latitude=" + Location.lat + "&maxcount=" + maxcount);
            $("#WelfareCount").html(d.datacount + "个福利");
            $boutiquelist.html("");
            var classtype = "";
            var name = "";
            $.each(list, function (index, element) {
                $boutiquelist.removeClass("display-none");
                if (index > 2) {
                    return;//目前最多有三条数据
                }
                var txt = $.Cutstring(element.name, 10);
                var lastoneClass = index < 2 ? "br1" : "";
                var hurl = '/html/store/rock.html?couponactivityid=' + element.id + '&activitytype=1&longitude=' + Location.lng + "&latitude=" + Location.lat + "&storeid=" + element.storeid + "&id=" + element.id + '';
                var ha = [];
                ha.push("<a class=\"small-4 left text-center br1" + lastoneClass + "\" href=\"" + hurl + "\">");
                ha.push("<img data-src=\"" + element.couponimagesmall + "\" src=\""+$.resurl()+"/css/img2.0/imgload.gif\">");
                ha.push("<p class=\"text-left\">" + txt + "</p></a>");
                var result = ha.join("");
                $boutiquelist.append(result);
            });
            //延迟加载
            $._imgLoad($("#BoutiqueList").find("img"), function (img) {
                $(img).attr("src", $(img).attr("data-src"));
            });
        } else {
            $boutiquelist.hide();
        }
    }, function () {
        $.preloaderFadeOut();
    });
}

function getNearest() {
    $.getLocationCity(getData, Location.lng, Location.lat);//, "region": cityInfo.citycode
};

//获取附近福利 
function getData(cityInfo) {
    var data = { "longitude": "" + Location.lng, "latitude": "" + Location.lat, "region": cityInfo.citycode };
    $.AkmiiAjaxPost("/StoreServices.svc/store/activitygetnearest", data, true).then(function (d) {
        if (d) {
            var list = d.nearestlist;
            if (list.length <= 0) {
                $commercial_welfare.hide();
            }
            $("#NearestList").html("");
            var ha = [];
            var listResult = [];
            $.each(list, function (index, ele) {
                ha = [];
                ha.push('<a href="javascript:void(0);" class="shop-list bb bg-white">');
                ha.push('<img src="'+$.resurl()+'/css/img2.0/imgload.gif" class="img-shop" data-src="' + ele.couponimagesmall + '">');
                ha.push('<div class="shop-name oh">');
                ha.push('<div class="small-9 left text-overflow">');
                ha.push('<img src="' + $.GetImgByCategory(ele.storecategory) + '" >' + (ele.storename) + '</div>');
                ha.push('<div class="small-3 right text-right gray">' + $.Distance(ele.distance) + 'm</div></div>');
                ha.push('<p class="tips oh">' + $.Cutstring(ele.couponabstract, 14, "...") + '</p>');
                ha.push('<div class="gray oh"><div class="left">已出' + ele.deliverycount + '件</div>');
                ha.push('<div class="right">共' + ele.activitysum + '个福利<i class="wxicon icon-right-arrow"></i></div></div></a>');
                var result = $(ha.join(''));
                result.click(function () {
                    window.location.href = '/html/Store/rock.html?storeid=' + ele.storeid + '&activitytype=2&longitude=' + Location.lng + '&latitude=' + Location.lat;
                });
                listResult.push(result);
            });
            $("#NearestList").append(listResult);
            $._imgLoad($("#NearestList").find("img"), function (img) {
                $(img).attr("src", $(img).attr("data-src"));
            });
        }
    });
}

//获取banner图
function GetBanner() {
    //头部banner图
    var data = { "type": "WelfareTopBanner" };
    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/system/getbannerbytype", data, true).then(function (d) {
        if (d.result && d.appbanners.length > 0) {
            $atopbanner.attr("href", d.appbanners[0].link);
            $imgtopbanner.attr({ "data-src": d.appbanners[0].imageurl, "src": $.resurl()+"/css/img2.0/loadbanner.gif" });
            $("#atopbanner").removeClass("display-none");
            $._imgLoad($("#imgtopbanner"), function (img) {
                $(img).attr("src", $(img).attr("data-src"));
            });

        }
    });
}

//关于百度地图状态码
//BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
//BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
//BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
//BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
//BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
//BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
//BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
//BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
//BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)
