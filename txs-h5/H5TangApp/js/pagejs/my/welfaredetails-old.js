/// <reference path="//_references.js" />


//页面头部
var list = $("#top");
//页面订单编号部分
var orderlist = $("#orderdiv");
//页面福利兑换信息部分
var welfarelist = $("#welfarediv");
//页面赞助商家部分
var fitipslist = $("#fitipsdiv");

//页面领取说明部分
var activitysketch = $("#activitysketch");

//提交按钮
var $submit = $("#submit");

var $weldiv = $("#weldiv");

//加载省市区的span
var $procitydis = $("#procitydis");



//返回摇一摇页面
var rocklink = $.getQueryStringByName("rocklink");


var couponactivityid = $.getQueryStringByName("couponactivityid");
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

//收货姓名
var consigneename = decodeURI($.getQueryStringByName("consigneename"));
//收货电话
var phone = $.getQueryStringByName("phone");
//收货省
var province = decodeURI($.getQueryStringByName("province"));
//收货市
var city = decodeURI($.getQueryStringByName("city"));
//收货区
var district = decodeURI($.getQueryStringByName("district"));
//收货详细地址
var address = decodeURI($.getQueryStringByName("address"));
var $activitydetail = $("#activitydetail");//奖品介绍


//经纬度
var longitude = $.getQueryStringByName("longitude");
var latitude = $.getQueryStringByName("latitude");

var qhstatus = $.getQueryStringByName("qhstatus");
var change_add = $("#change_add");
change_add.attr("href", "/Html/My/addresslist.html?qhstatus=1&couponactivityid=" + couponactivityid + "&longitude=" + longitude + "&latitude=" + latitude + "&orderid=" + orderid + "&wintime=" + wintime + "&status=" + status + "&couponcode=" + couponcode + "&overduetime=" + overduetime + "&rocklink=" + rocklink);

var deliveryaddress = "";
var deliveryname = "";
var deliveryphone = "";

var citylist_json;
var protext;
var citytext;
var distext;

//收货地址
var deliveryaddress = decodeURI($.getQueryStringByName("deliveryaddress"));
//收货人电话
var deliveryphone = $.getQueryStringByName("deliveryphone");
//收货姓名
var deliveryname = decodeURI($.getQueryStringByName("deliveryname"));

var tempstatus = 0;//初始值0
$(function () {
    Success();
    addresshtml();
    $submit.click(function () {
        if ($.isNull(orderid)) {
            $.alertF("订单号不能为空");
            return;
        }
        if ($.isNull(couponcode)) {
            $.alertF("消费码不能为空");
            return;
        }
        deliveryaddress = $.FilterXSS(deliveryaddress);
        if ($.isNull(deliveryaddress)) {
            $.alertF("请选择收货地址");
            return;
        }
        deliveryname = $.FilterXSS(deliveryname);
        if ($.isNull(deliveryname)) {
            $.alertF("收货人不能为空");
            return;
        }
        if (!$.isMobilePhone(deliveryphone)) {
            $.alertF("收货联系号码不正确");
            return;
        }
        var data = { "orderid": orderid, "couponcode": couponcode, "deliveryaddress": deliveryaddress, "deliveryname": deliveryname, "deliveryphone": deliveryphone };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/winninguserbuildorder", data, true).then(function (d) {

            if (d.result) {
                if (d.issuccess) {
                    $(".change").hide();
                    $("#submitDiv").hide();
                    $.alertF("提交成功", null, function () {
                        if (!$.isNull(rocklink)) {
                            window.location.href = decodeURIComponent(rocklink);
                        }
                    });
                    return;
                } else {
                    $.alertF("提交失败了");
                    return;
                }
            }
            else {
                $.alertF("网络异常请重试");
                return;
            }

        });
    });


    //生成二维码方法
    function CreateCode(couponcode) {
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            //width: 15,//设置宽高
            //height: 15
        });
        var a = decodeURIComponent(couponcode); //GetQueryString("url")
        qrcode.makeCode(a);
    }

    function Success() {
        var data = { "id": couponactivityid, "orderid": orderid, "longitude": longitude, "latitude": latitude, };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitydetailedinfobykey", data, true).then(function (d) {
            if (d.result) {
                if (d.couponactivity != null) {
                    var now = new Date();
                    var textstatus;
                    if (status == 5) {
                        textstatus = "已消费";
                    }
                    else if (status == 1 || Date.parse(new Date(overduetime.replace(/-/g, "/"))) < Date.parse(now)) {
                        textstatus = "已过期";
                    }
                    else if (status == 2) {
                        textstatus = "未消费";
                    }
                    else if (status == 3) {
                        textstatus = "未消费";

                    }
                    if (d.couponactivity.isusetemplate && d.couponactivity.coupontemplates) {
                        selectTemplate(d.couponactivity);
                        var item = '<div></div><p class="userinfo az-clearfix pm0 mt"><span class="line-l az-left font-s-l"><span class="wxicon ' + $.GetIconByCategory(d.couponactivity.storecategory) + '"></span>' + d.couponactivity.name + '</span>';
                        item += '<span class="line-r az-right">价值<span class="font-c-r"><span class="font-s-l">' + d.couponactivity.couponprice + '</span>元</span></span></p>';
                        item += '<p class="userinfo az-clearfix bb pt0 "><span class="line-l az-left gray-font">' + d.couponactivity.couponabstract + '</span>';
                        item += '<span class="line-r az-right"><span class="gray-font">已出' + d.couponactivity.deliverycount + '件</span></span></p>';
                        list.append(item);
                    }
                    else {
                        var item = '<div><img src=' + d.couponactivity.couponimagelarge + ' class="topimg"></div><p class="userinfo az-clearfix pm0"><span class="line-l az-left font-s-l"><span class="wxicon ' + $.GetIconByCategory(d.couponactivity.storecategory) + '"></span>' + d.couponactivity.name + '</span>';
                        item += '<span class="line-r az-right">价值<span class="font-c-r"><span class="font-s-l">' + d.couponactivity.couponprice + '</span>元</span></span></p>';
                        item += '<p class="userinfo az-clearfix bb pt0"><span class="line-l az-left gray-font">' + d.couponactivity.couponabstract + '</span>';
                        item += '<span class="line-r az-right"><span class="gray-font">已出' + d.couponactivity.deliverycount + '件</span></span></p>';
                        list.append(item);
                    }

                    var item2 = '<div class="wel-inquire bb bt mt"><div class="inquirebox"><div class="row"><div class="small-8 columns az-padding0">';
                    if (textstatus == "已消费" || textstatus == "已过期") {
                        item2 += '<p class="indent">订单编号：' + orderid + '</p><p class="indent-time">获奖时间：' + wintime + '</p></div><div class="small-4 columns az-padding0 az-text-right p-right-7"><span class="consume col-f-bord">' + textstatus + '</span></div>';
                    }
                    else {
                        item2 += '<p class="indent">订单编号：' + orderid + '</p><p class="indent-time">获奖时间：' + wintime + '</p></div><div class="small-4 columns az-padding0 az-text-right p-right-7"><span class="consume">' + textstatus + '</span></div>';
                    }
                    item2 += '</div></div></div>';
                    orderlist.append(item2);
                    var item3 = '<p class="ban-fitips bb bt mt">福利兑换信息</p>';
                    item3 += '<div class="row userinfo pm0"><div class="small-6 fl">福利二维码：</div><div class="small-6 fl tr" id="qrcode-box"><i class="wxicon icon-qrcode"></i></div><i id="qrcode" style="display:none" ></i></div>';
                    item3 += '<div class="row userinfo pm0 pt0"><div class="small-6 fl">福利消费码：</div><div class="small-6 fl tr">' + couponcode + '</div></div>';
                    item3 += '<div class="row userinfo pt0"><div class="small-6 fl">有效期至：</div><div class="small-6 fl tr">' + overduetime + '</div></div>';
                    welfarelist.append(item3);
                    //生成二维码
                    CreateCode(couponcode);
                    //点击小二维码出现大二维码
                    $("#qrcode-box").click(function () {
                        $(".mask").show();
                        $("#qrcode").show();
                        $("#qrcode").click(function () {
                            $("#qrcode").hide();
                            $(".mask").hide();
                        });
                    })
                    //procitydis(d.couponactivity.storeprovince, d.couponactivity.storecity, d.couponactivity.storedistrict);
                    var ha = [];
                    ha.push('<div id="commercial"><p class="ban-fitips mt bb bt">赞助商家</p>');
                    ha.push(' <div class="wel-inquire"><div class="inquirebox"><div class="shop-list az-clearfix"><div class="row"><p class="tips3">' + $.Distance(d.couponactivity.distance) + 'm</p><p class="tips4">共' + d.couponactivity.storecouponcount + '个福利<i class="wxicon icon-right-arrow"></i></p><div class="small-4 columns az-padding0 az-center">');
                    ha.push(' <img src=' + d.couponactivity.storeimagelogo + ' alt=""></div><div class="small-8 columns az-padding0"><p class="tit"><span class="wxicon ' + $.GetIconByCategory(d.couponactivity.storecategory) + '"></span><span>' + d.couponactivity.storename + '</span></p>');
                    ha.push('<div class="small-8 columns az-padding0"><p class="tit" id="addressp"></p>');
                    ha.push('<p class="tip">' + d.couponactivity.storephone + '</p></div>');

                    //TODO:距离未完成

                    //item4 += '<p class="tips3">' + d.couponactivity.distance + 'm</p>';
                    ha.push('</div></div></div></div></div>');
                    $activitydetail.html(d.couponactivity.activitydetail.replace(/\n/g, "<br/>"));
                    activitysketch.html(d.couponactivity.activitysketch.replace(/\n/g, "<br/>"));
                    var item4 = $(ha.join(''));
                    fitipslist.append(item4);

                    var addressp = item4.find("#addressp");
                    $.procitydis(d.couponactivity.storeprovince, d.couponactivity.storecity, d.couponactivity.storedistrict, d.couponactivity.storeaddress, addressp);

                    var commercial = $("#commercial");
                    commercial.click(function () {
                        window.location.href = "/html/store/commercial.html?id=" + d.couponactivity.storeid + "&longitude=" + longitude + "&latitude=" + latitude;
                    });
                    if (d.couponactivity.claimmethod == 2) {

                        if (status == 2 && Date.parse(new Date(overduetime.replace(/-/g, "/"))) > Date.parse(now)) {
                            $("#addressDiv").show();
                            $("#submitDiv").show();
                            $("#heidiv").show();
                        }
                        else {
                            $("#heidiv").hide();
                        }
                        if (qhstatus == 1) {
                            deliveryaddress = province + "," + city + "," + district + "," + address;
                            deliveryname = consigneename;
                            deliveryphone = phone;
                            $("#userInfo").html(consigneename + "&nbsp;&nbsp;&nbsp;&nbsp;" + phone);
                            $("#useraddress").html(province + city + district + address);
                        }
                        else {
                            //没有提交收货地址是获取出来默认地址
                            if (tempstatus == 0) {
                                $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/getuserdeliveryaddressbydefault", {}, true).then(function (d) {

                                    if (d.result) {
                                        if ($.isNull(d.userdeliveryaddressmodel)) {
                                            $("#change_add").html("新建");
                                            return;
                                        }
                                        deliveryaddress = d.userdeliveryaddressmodel.province + "," + d.userdeliveryaddressmodel.city + "," + d.userdeliveryaddressmodel.district + "," + d.userdeliveryaddressmodel.address;
                                        deliveryname = d.userdeliveryaddressmodel.consigneename;
                                        deliveryphone = d.userdeliveryaddressmodel.phone;
                                        $("#userInfo").html(d.userdeliveryaddressmodel.consigneename + "&nbsp;&nbsp;&nbsp;&nbsp;" + d.userdeliveryaddressmodel.phone);
                                        $("#useraddress").html(d.userdeliveryaddressmodel.province + d.userdeliveryaddressmodel.city + d.userdeliveryaddressmodel.district + d.userdeliveryaddressmodel.address);
                                    }
                                    else {
                                        $.alertF("没有获取到默认地址");
                                        return;
                                    }
                                });
                            }
                        }
                    }
                }
            }
            else {
                $.alertF($.defaultError());
            }
        });
    }

    //判断有没有提交收货地址
    function addresshtml() {
        //如果填写了收货地址切换和提交不显示 （没填提交和切换显示）
        if (deliveryaddress != null && deliveryaddress != "" && deliveryaddress != undefined && deliveryaddress != "null") {
            $("#addressDiv").show();
            $(".change").hide();
            $("#submitDiv").hide();
            $("#userInfo").html(deliveryname + "&nbsp;&nbsp;&nbsp;&nbsp;" + deliveryphone);
            $("#useraddress").html(deliveryaddress.replace(/,/g, ""));
            tempstatus = 1;
        }
        else {
            $(".change").show();
        }
        if (status == 3) {
            $("#addressDiv").show();
            $(".change").hide();
            $("#submitDiv").hide();
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
            arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.DecreaseAmount + '<span class="mar-t-0">元</span></div>');
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
            arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.Discount + '<span class="mar-t-0">折</span></div>');
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
            arr.push('<div class="percentage col-ff645b top-10">' + coupontemplates.CouponAmount + '<span class="mar-t-0">元</span></div>');
            arr.push('<p class="percentage font-z-1 col-fe655f top-80">唐小僧商户</p>');
            arr.push('<div class="ticket-content t-51 left_35">');
            arr.push('<h3 class="col-ff645b margin-bottom0">代金券</h3>');
            arr.push('<p class="expired-font fz-16rem">代金券：' + coupontemplates.CouponAmount + '元</p>');
            arr.push('<p class="expired-font fz-16rem">消费满' + coupontemplates.CanUseCouponAmount + '可用</p>');
            arr.push('<p class="expired-font fz-16rem">有效期至：' + (data.activityvalidend) + '</p>');
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
            arr.push('<p class="fz-16rem col-888"><span class="zj">最终解释权归唐小僧理财</span><span class="tang-name">唐小僧商户</span></p>');
            arr.push('</div>');
            break;
    }
    list.append(arr.join(''));
}