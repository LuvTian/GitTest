/// <reference path="//_references.js" />

$(document).foundation();

var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var id = $.getQueryStringByName("id");//活动ID

var orderby = 1;//排序[智能排序功能使用1:距离;2:人气;3:开始时间;]
var category = "";//商户分类
var loadmore = true; //是否是加载更多,是：不清空html 否：清空html
var pageindex = 1;
var pagesize = 10;
var pagenumber = 0;//页数

var $AllCategory = $("#AllCategory");//全部分类
var $AutoCategory = $("#AutoCategory");//智能排序
var $AutoCategoryDetail = $("#AutoCategoryDetail");//智能分类详细
var $Category = $("#Category");//分类
var $Childrenlist = $("#Childrenlist");//子菜单
var $welfaredata = $("#welfaredata");//福利列表
//当前的一级菜单id
var curOnelevel = "";
//选中的一级菜单id
var selectOnelevel = "";
//选中的二级菜单id
var curSecondlevel = "";

var datalist = [];
var $loadmore = $("#loadmore");
var nomore = false;

$(function () {

    ChildrenClick("firstPageLoad");
    AllCategoryInfo();

    //智能排序
    $AutoCategory.click(function () {
        $("li[class^='Category_']").css("background-color", "#f7f6f4");
        $(".list2").hide();
        $Category.hide();
        $(".op2,.op1").removeClass('border-col-font');
        $(".op2,.op1").find("i").removeClass("wxicon icon-up-arrow icon-down-arrow");
        $(".op1").find("i").attr("class", "wxicon icon-down-arrow");

        if ($("#AutoCategoryDetail").is(':visible')) {
            $(".op2").find("i").attr("class", "wxicon icon-down-arrow");
            $("#AutoCategoryDetail").hide();
            $(".mask").hide();
        }
        else {
            $(".op2").find("i").attr("class", "wxicon icon-up-arrow");
            $(".op2").addClass('border-col-font');
            $("#AutoCategoryDetail").show();
            $(".mask").show();
            $(".menu").css("position", "relative").css("z-index", "25");
        }

    });

    //全部分类
    $AllCategory.click(function () {
        $AutoCategoryDetail.hide();
        $(".op2,.op1").removeClass('border-col-font');
        $(".op2,.op1").find("i").removeClass("wxicon icon-up-arrow icon-down-arrow");
        $(".op2").find("i").attr("class", "wxicon icon-down-arrow");
        if ($Category.is(':hidden')) {
            $Category.show();
            $(".mask").show();
            $(".menu").css("position", "relative").css("z-index", "25");
            $(".op1").find("i").attr("class", "wxicon icon-up-arrow");
            $(".op1").addClass('border-col-font');

            //一级菜单标红+二级菜单展开
            curSecondlevelFun(curSecondlevel);
            selectOnelevel = selectOnelevel || curOnelevel;//有选中的二级则展开，否则展开上次展开的二级菜单
            curOnelevelFun(selectOnelevel, true);
        }
        else {
            $("li[class^='Category_']").css("background-color", "#f7f6f4");
            $(".list2").hide();
            $Category.hide();
            $(".mask").hide();
            $(".op1").find("i").attr("class", "wxicon icon-down-arrow");
        }
    });

    //子分类
    $Category.find("li").click(function () {
        var classname = $(this).attr("class");
        var categorycode = classname.replace("Category_", "");
    });

    $(".mask").click(function () {
        if ($("#Category").is(':visible') || $("#AutoCategoryDetail").is(':visible')) {
            
            $(".op1,.op2").removeClass('border-col-font');
            $(".op1,.op2").find("i").removeClass("wxicon icon-up-arrow icon-down-arrow");
            $(".op1,.op2").find("i").attr("class", "wxicon icon-down-arrow");
            $("#Category,#AutoCategoryDetail,.list2,.mask").hide();
        }
    });

    //滚动加载更多
    $(window).scroll(function () {
        if (!nomore) {
            if ($(document).height() - $(window).height() - $(document).scrollTop() < 10) {
                pageindex = pageindex + 1;
                pageindex = pageindex > pagenumber ? (pagenumber <= 0 ? 1 : pagenumber) : pageindex;
                loadmore = true;
                getWelfare();
            }
        }
    });

    //加载更多
    $loadmore.click(function () {
        if (!nomore) {
            $loadmore.attr("disabled", true);
            pageindex = pageindex + 1;
            pageindex = pageindex > pagenumber ? (pagenumber <= 0 ? 1 : pagenumber) : pageindex;
            loadmore = true;
            getWelfare();
        }
    });
});

//全部分类[菜单]
function AllCategoryInfo() {
    var data = { "code": "Industry" };
    $.AkmiiAjaxPost("/StoreServices.svc/system/getmadisondictionarylistbypcodeorpid", data, true).then(function (d) {
        if (d.result) {
            var list = d.madisondictionarylist;
            $.each(list, function (index, element) {
                var item = '<li onclick="openChildren(' + element.id + ')" class="Category_' + element.id + '"><span class="wxicon ' + $.GetIconByCategory(element.id) + '"></span>' + element.text + '</li>';
                $Category.append(item);
            });
        }
        else {
            $.alertF($.defaultError());
        }
    });
}

//一级分类[菜单]
function openChildren(code) {
    $("li[class^='Category_']").css("background-color", "#f7f6f4");
    $("li[class^='Category_']").css("color", "gray");
    $(".Category_" + code).css("background-color", "#fff").css("color", "#ec513f");
    //选中的一级菜单id
    curOnelevel = code;
    var ParentID = "Parent_" + code;
    if ($("#" + ParentID).length > 0) {
        $(".list2").hide();
        $("#" + ParentID).show();
        return;
    }
    var data = { "prentid": code };
    $.AkmiiAjaxPost("/StoreServices.svc/system/getmadisondictionarylistbypcodeorpid", data, true).then(function (d) {
        if (d.result) {
            var list = d.madisondictionarylist;
            var item = '<ul class="list2" id="' + ParentID + '" style="display:none">';
            item += '<li onclick="ChildrenClick(' + code + ')" id="Children_' + code + '">全部</li>';
            $.each(list, function (index, element) {
                item += '<li onclick="ChildrenClick(' + element.id + ')" id="Children_' + element.id + '">' + element.text + '</li>';
            });
            $Childrenlist.append(item + '</ul>');
            $(".list2").hide();
            $("#" + ParentID).show();
            //将二级分类设置和一级一样高度
            $("#Childrenlist ul").css({ "overflow-y": "scroll", "height": $(".list").height(), "background": "#fff" });
        }
        else {
            $.alertF($.defaultError());
        }
    });
}


function AutoCategory(_orderby) {
    if (_orderby == 1 && (longitude == 0 || latitude == 0)) {
        $.alertF("没有开通定位服务,不能按距离排序哦");
        return;
    }
    orderby = _orderby;
    //category = "";
    pageindex = 1;
    loadmore = false;
    if (_orderby == 1) {
        var lastName = $("#AutoCategory > li > p:last").text();
        $("#AutoCategory > li").animate({ scrollTop: "0px" }, 0);
        $("#AutoCategory > li > p:last").html('离我最近<i class="wxicon icon-down-arrow"></i>');
        $("#AutoCategory > li > p:first").text(lastName);
        $("#AutoCategory > li").animate({ scrollTop: "43px" }, 500);

        $("#AutoCategoryDetail > li").css({ "background-color": "#f7f6f4", "color": "gray" });
        $("#AutoCategoryDetail > li:first").css("background-color", "#fff").css("color", "#ec513f");
    }
    else {
        var lastName = $("#AutoCategory > li > p:last").text();
        $("#AutoCategory > li").animate({ scrollTop: "0px" }, 0);
        $("#AutoCategory > li > p:last").html('人气最高<i class="wxicon icon-down-arrow"></i>');
        $("#AutoCategory > li > p:first").text(lastName);
        $("#AutoCategory > li").animate({ scrollTop: "43px" }, 500);

        $("#AutoCategoryDetail > li").css({ "background-color": "#f7f6f4", "color": "gray" });
        $("#AutoCategoryDetail > li:last").css("background-color", "#fff").css("color", "#ec513f");
    }

    getWelfare(false);
}

function ChildrenClick(_category) {
    if ((longitude == 0 || latitude == 0) && orderby == 1) {
        orderby = 2;
    }
    //选中的二级菜单id
    curSecondlevel = _category;

    //选中的一级菜单
    selectOnelevel = curOnelevel;
    if (!_category) {
        curSecondlevel = "";
        selectOnelevel = "all";
        curOnelevel = "";
    }
    if (_category == "firstPageLoad") {
        _category = null;
    }
    curSecondlevelFun(curSecondlevel);
    //全部分类替换为当前选中的分类
    var wxicon_icon_arrow = $('<i class="wxicon icon-down-arrow"></i>'); //$("#AllCategory > li").find("i")
    if ($("#Children_" + curSecondlevel).length > 0) {
        var categoreName = $("#Children_" + curSecondlevel).text();
        if (categoreName == "全部") {
            categoreName = $(".Category_" + _category).text();
        }
        var lastName = $("#AllCategory > li > p:last").text();
        $("#AllCategory > li").animate({ scrollTop: "0px" }, 0);
        $("#AllCategory > li > p:last").html(categoreName + '<i class="wxicon icon-down-arrow"></i>');
        $("#AllCategory > li > p:first").text(lastName);
        $("#AllCategory > li").animate({ scrollTop: "43px" }, 500);
    }
    else {
        var lastName = $("#AllCategory > li > p:last").text();
        $("#AllCategory > li").animate({ scrollTop: "0px" }, 0);
        $("#AllCategory > li > p:last").html('全部分类<i class="wxicon icon-down-arrow"></i>');
        $("#AllCategory > li > p:first").text(lastName);
        $("#AllCategory > li").animate({ scrollTop: "43px" }, 500);
    }
    pageindex = 1;
    category = _category;
    loadmore = false;
    getWelfare();
}


//获取福利数据
//orderby //排序[智能排序功能使用1:距离;2:人气;3:开始时间;]
//category //商户分类
//默认 有经纬度按距离排序，没有则按人气排序；只能排序，按选的来

//有问题，要改
function getWelfare() {
    $.getLocationCity(getData, longitude, latitude);
};

function getData(cityInfo) {
    $(".mask").hide();
    var data = { "orderby": orderby, "category": category, "longitude": longitude, "latitude": latitude, "pageindex": pageindex, "pagesize": pagesize, "region": cityInfo.citycode };
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfolistbyintelligentsorting", data, true).then(function (d) {
        $.preloaderFadeOut();
        if (d.result) {
            $("li[class^='Category_']").css("background-color", "#f7f6f4");
            $(".list2").hide();
            $Category.hide();
            $AutoCategoryDetail.hide();
            $loadmore.attr("disabled", false);
            if (!loadmore) {
                nomore = false;
                $loadmore.html("");
                datalist = [];
                $welfaredata.html("");
            }
            pagenumber = Math.ceil(d.pagecount / pagesize);
            if (pagenumber == pageindex) {
                nomore = true;
                $loadmore.html("没有更多数据");
                $loadmore.attr("disabled", true);
            }
            var list = d.nearestlist;
            if (list.length <= 0) {
                nomore = true;
                $loadmore.html("暂无数据");
                $loadmore.attr("disabled", true);
            }
            $.each(list, function (index, element) {
                if (datalist.indexOf(element.storeid) < 0) {
                    datalist.push(element.storeid);
                    var ha = [];
                    ha.push('<div class="shop-list az-clearfix bb">');
                    ha.push('<div class="row">');
                    if (element.isplayed) {
                        ha.push('<img src="'+$.resurl()+'/css/img2.0/deal.png" alt="" class="yiyao"/>');
                    }
                    ha.push('<div class="small-4 columns az-padding0 az-center">');
                    ha.push('<img data-src="' + element.couponimagesmall + '" src="'+$.resurl()+'/css/img2.0/imgload.gif">');
                    ha.push('</div>');
                    ha.push('<div class="small-8 columns az-padding0">');
                    ha.push('<p class="tit">');
                    ha.push('<span class="wxicon ' + $.GetIconByCategory(element.storecategory) + '"></span>' + $.Cutstring(element.storename, 9, "..") + '');
                    ha.push('</p>');
                    ha.push('<p class="tip">' + $.Cutstring(element.couponabstract, 14, "..") + '</p>');
                    ha.push('<p class="tips2">已出' + element.deliverycount + '件</p>');
                    ha.push('<p class="tips3">' + $.Distance(element.distance) + 'm</p>');
                    ha.push('<p class="tips4">共' + element.activitysum + '个福利<i class="wxicon icon-right-arrow"></i></p>');
                    ha.push('</div>');
                    ha.push('</div>');
                    ha.push('</div>');
                    var item = $(ha.join(''));
                    item.click(function () {
                        window.location.href = '/html/Store/rock.html?storeid=' + element.storeid + '&activitytype=2&longitude=' + longitude + '&latitude=' + latitude + '';
                    });
                    $welfaredata.append(item);
                }
            });
            $._imgLoad($("#welfaredata").find("img"), function (img) {
                $(img).attr("src", $(img).attr("data-src"));
            });
        }
    }, function () { $.preloaderFadeOut(); });

}


function curOnelevelFun(curOnelevel, open) {
    if (!curOnelevel) {
        return;
    }
    $("li[class^='Category_']").css("background-color", "#f7f6f4");
    $("li[class^='Category_']").css("color", "gray");
    $(".Category_" + curOnelevel).css("background-color", "#fff").css("color", "#ec513f");
    if (open) {
        $("#Parent_" + curOnelevel).show();
    }
}

//当前二级菜单标红
function curSecondlevelFun(curSecondlevel) {
    if (!curSecondlevel) {
        return;
    }
    $("li[id^=Children_]").css({ "background": "fff", "color": "#898989" });
    $("#Children_" + curSecondlevel).css({ "background": "fff", "color": "red" });

}