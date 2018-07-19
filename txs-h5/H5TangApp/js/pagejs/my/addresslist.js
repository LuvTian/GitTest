/// <reference path="//_references.js" />

//收货地址列表
var addresslist = $("#addresslist");

//判断切换的状态
var qhstatus = $.getQueryStringByName("qhstatus");
var couponactivityid = $.getQueryStringByName("couponactivityid");
var longitude = $.getQueryStringByName("longitude");
var latitude = $.getQueryStringByName("latitude");
//订单编号
var orderid = $.getQueryStringByName("orderid");
//订单时间
var wintime = decodeURIComponent($.getQueryStringByName("wintime"));
//订单状态
var status = $.getQueryStringByName("status");
//消费码
var couponcode = $.getQueryStringByName("couponcode");
//到期时间
var overduetime = decodeURIComponent($.getQueryStringByName("overduetime"));

//返回摇一摇页面
var rocklink = $.getQueryStringByName("rocklink");

var count;

var PH_type = $.getCookie("type"); //积分商城实物兑换跳过来从cookie中获取type标志


if (qhstatus == 1) {
    var xja = $("#xja");
    xja.attr("href", "/html/My/add-address.html?qhstatus=" + qhstatus + "&couponactivityid=" + couponactivityid + "&longitude=" + longitude + "&latitude=" + latitude + "&orderid=" + orderid + "&wintime=" + wintime + "&status=" + status + "&couponcode=" + couponcode + "&overduetime=" + overduetime + "&rocklink=" + rocklink);
}

$(function () {
    var data = {};
    $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/getuserdeliveryaddresslist", data).then(function (d) {
        if (d.userdeliveryaddresslist.length > 0) {
            count = d.userdeliveryaddresslist.length;
            $.each(d.userdeliveryaddresslist, function (i, item) {
                var ha = [];
                //  ha.push('<a href="/Html/My/welfaredetails.html?consigneename=' + item.consigneename + '&phone=' + item.phone + '&province=' + item.province + '&city=' + item.city + '&district=' + item.district + '&address='+item.address+'">');
                ha.push('<div class=\"address mb\" >');
                ha.push("<div class=\"tempspan\"><p class=\"natel\"><span class=\"name\">" + item.consigneename + "&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"tel\">" + item.phone + "</span></p>");
                ha.push("<div class=\"myaddress\">地址：" + item.province + "" + item.city + "" + item.district + "" + item.address + "</div></div>");
                ha.push("<div class=\"row\">");
                ha.push("<div class=\"small-6 columns az-padding0 font-9\"><i class=\"default\"></i>默认地址</div>");
                ha.push("<div class=\"small-6 columns az-padding0\">");
                ha.push("<div class=\"delete az-right font-9\"> <i class=\"wxicon icon-add-delete\" ></i>删除</div>");
                ha.push('<div class="compile az-right font-9"><i class="wxicon icon-add-edit"></i>编辑</div>');
                ha.push("</div></div></div>");
                var result = $(ha.join(''));
                if (count >= 20) {
                    $("#xja").click(function () {
                        $.alertF("最多添加二十个收货地址");
                        return false;
                    });
                }
                result.find(".tempspan").click(function () {
                    if (qhstatus == 1) {
                        window.location.href = '/Html/My/welfaredetails.html?consigneename=' + item.consigneename + '&phone=' + item.phone + '&province=' + item.province + '&city=' + item.city + '&district=' + item.district + '&address=' + item.address + '&qhstatus=' + qhstatus + '&couponactivityid=' + couponactivityid + '&longitude=' + longitude + '&latitude=' + latitude + '&orderid=' + orderid + '&wintime=' + wintime + '&status=' + status + '&couponcode=' + couponcode + '&overduetime=' + overduetime + '&rocklink=' + rocklink;
                    }
                });
                addresslist.append(result); //return;
                //获取收货地址Id
                var data = {
                    "addressid": item.addressid
                };
                //删除收货地址
                result.find(".delete").click(function () {
                    $.confirmF("确定要删除吗？", "取消", "确定", null, function () {
                        $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/userdeliveryaddressdelete", data).then(function (d) {
                            if (d.issuccess) {
                                $.alertF("删除成功", "确定", back);
                            } else {
                                $.alertF("删除失败请重试");
                                return;
                            }
                        });
                    });
                    return false;
                });
                //编辑收货地址
                result.find(".compile").click(function () {
                    //跳转回添加收货地址页面
                    var addressid = item.addressid;
                    var consigneename = item.consigneename;
                    var phone = item.phone;
                    var province = item.province;
                    var city = item.city;
                    var district = item.district;
                    var address = item.address;
                    window.location.href = 'add-address.html?addressid=' + addressid + '&consigneename=' + encodeURI((consigneename)) + '&phone=' + phone + '&province=' + encodeURI((province)) + '&city=' + encodeURI((city)) + '&district=' + encodeURI((district)) + '&address=' + encodeURI((address)) + '&qhstatus=' + qhstatus + '&couponactivityid=' + couponactivityid + '&longitude=' + longitude + '&latitude=' + latitude + '&orderid=' + orderid + '&wintime=' + wintime + '&status=' + status + '&couponcode=' + couponcode + '&overduetime=' + overduetime;

                });
                //设置默认收货地址
                result.find(".default").click(function () {
                    //$(this).toggleClass("wxicon icon-round-check-on").toggleClass("wxicon icon-round-check");
                    $.confirmF("确定要设为默认地址吗？", "取消", "确定", null, function () {
                        $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/userdeliveryaddresssetdefault", data).then(function (d) {
                            if (d.issuccess) {
                                $(".row").find("i").removeClass("wxicon icon-round-check-on icon-round-check").addClass("wxicon icon-round-check-on");
                                result.find(".row").find("i").removeClass("wxicon icon-round-check-on icon-round-check").addClass("wxicon icon-round-check");
                            }
                        })
                    });
                });
                //判断type
                if (item.type == 1) {
                    result.find(".row").find("i").addClass("wxicon icon-round-check");
                } else {
                    result.find(".row").find("i").addClass("wxicon icon-round-check-on");
                }
            });
            if (PH_type == "PHYSICAL") { //积分商城实物兑换跳到收货地址列表页弹窗
                $.alertF("兑换成功，请再次确认您的默认收货地址哦，小僧会按照您的默认收货地址为您安排发货~", "立即确认", function () {

                }, true);
                $(".az-showmasker-Text .text-center").text("兑换提示");
                $(".az-showmasker-Text .text-center").css("font-size", "1.5rem");
                $(".az-showmasker-Text p").css("line-height", "1.5");
            }

        } else {
            if (PH_type == "PHYSICAL") { //积分商城实物兑换跳到收货地址列表页弹窗

                $.alertF("兑换成功，请先填写默认收货地址小僧才能为您安排发货哦~", "填写地址", function () {
                    window.location.href = "/html/my/add-address.html";
                }, true);
                $(".az-showmasker-Text .text-center").text("兑换提示");
                $(".az-showmasker-Text .text-center").css("font-size", "1.5rem");
                $(".az-showmasker-Text p").css("line-height", "1.5");
            }
        }
    });

});

//回调跳转到list页面
function back() {
    window.location.href = 'addresslist.html';
}

//确定删除
function backok(addressid) {
    var data = {
        "addressid": addressid
    };
    $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/userdeliveryaddressdelete", data).then(function (d) {
        if (d.issuccess) {
            $.alertF("删除成功", "确定", back);

        } else {
            $.alertF("删除失败请重试");
            return;
        }
    });
}