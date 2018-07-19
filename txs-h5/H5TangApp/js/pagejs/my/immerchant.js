/// <reference path="../../_references.js" />

//Desc：我是商户-福利查询

var storeid = $.getQueryStringByName("storeid");
var $imglarge = $("#imglarge");//商户大图
var $imgsmall = $("#imgsmall");//商户小图
var $Category = $("#Category");//商户分类图
var $name = $("#name");//商户名
var $validatecode = $("#validatecode");//兑换码
var $wxquery = $("#wxquery");//点击微信扫描


//查询福利
var $couponimagesmall = $("#couponimagesmall");//福利图片
var $Category2 = $("#Category2");//分类
var $couponname = $("#couponname");//商户名

var $couponvalidatedid = $("#couponvalidatedid");//订单编号
var $wintime = $("#wintime");//下单时间
var $couponvalidatedstatus = $("#couponvalidatedstatus");//消费状态
var $time_txt = $("#time_txt");//有效期前面的文字
var $overduetime = $("#overduetime");//有效期至
var $couponcode = $("#couponcode");//消费码
var $activitysketch = $("#activitysketch");//兑换说明
var $couponabstract = $("#couponabstract");//概要
var $validcount = $("#validcount");//已出数量


var $query = $("#query");//查询
var $Exchange = $("#Exchange");//兑换

$(function () {

    if ($.isNull(storeid)) {
        window.location.href = "/html/My/";
        return;
    }

    //商户详情
    commercialInfo(storeid);
    function commercialInfo(storeid) {
        var data = { "id": storeid };
        $.AkmiiAjaxPost("/StoreServices.svc/store/getstoreinfobykey", data, true).then(function (d) {
            $.preloaderFadeOut();
            if (d.result) {
                var store = d.store;
                $imglarge.attr({ src: store.storeimglarge, alt: store.storename });
                $imgsmall.attr({ src: store.storeimagelogo, alt: store.storename });

                $Category.html('<span class="wxicon ' + $.GetIconByCategory(store.storecategory) + '"></span>');
                $name.html(store.storename);
            }
            else {
                $.alertF(d.errormsg);
            }
        }, function () { $.preloaderFadeOut(); });
    }

    //微信扫描
    $wxquery.click(function () {
        $.getWechatconfig("scanQRCode", scanQRCodefun);
    });

    //查询
    $query.click(function () {
        searchclick();
    });

    function searchclick() {
        if ($.isNull($validatecode.val())) {
            $.alertF("请输入兑换码");
            return;
        }
        var data = { "storeid": storeid, "validatecode": $validatecode.val() };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getorderinfobycouponcode", data).then(function (d) {

            if (d.result) {
                var now = new Date(d.date);
                var textstatus = "";
                //Status：//或者:0:删除 1:已过期 2/3：未消费 5： 已消费；
                $("#couponvalidatedstatus").attr("class", "");//清空样式
                if (d.couponvalidatedstatus == 0) {
                    textstatus = "删除";
                }
                else if (d.couponvalidatedstatus == 5) {
                    textstatus = "已消费";
                    $("#Exchange").hide();//兑换按钮
                    $("#couponvalidatedstatus").addClass("consume col-f-bord");
                }
                else if (d.couponvalidatedstatus == 7) {
                    textstatus = "待生效";
                    $("#Exchange").hide();//兑换按钮
                    $("#couponvalidatedstatus").addClass("consume col-f-bord");
                }
                else if (d.couponvalidatedstatus == 1 || Date.parse(new Date(d.overduetime.replace(/-/g, "/"))) < Date.parse(now)) {
                    textstatus = "已过期";
                    $("#Exchange").hide();//兑换按钮
                    $("#couponvalidatedstatus").addClass("consume col-f-bord");
                }
                else if (d.couponvalidatedstatus == 2) {
                    textstatus = "未消费";
                    $(".bg-btn").show();
                    $("#Exchange").show();//兑换按钮
                    $("#couponvalidatedstatus").addClass("consume");
                }
                else if (d.couponvalidatedstatus == 3) {
                    textstatus = "未消费";
                    $("#Exchange").hide();//兑换按钮
                    $("#couponvalidatedstatus").addClass("consume");
                }
                else if (d.couponvalidatedstatus == 4) {
                    textstatus = "待收货";
                    $("#couponvalidatedstatus").addClass("consume");
                }

                else if (d.couponvalidatedstatus == 6) {
                    textstatus = "已评价";
                    $("#couponvalidatedstatus").addClass("consume");
                }
                $couponimagesmall.attr("src", d.couponimagesmall);
                $couponname.html(d.couponname);

                $couponvalidatedid.html(d.couponvalidatedid);
                $wintime.html(d.wintime);
                $couponvalidatedstatus.html(textstatus);
                var startTime;
                var endTime = ((d.overduetime).substring(0, 10)).replace(/-/g, ".");
                if (d.starttime != "" && d.starttime != undefined && d.starttime != null) {
                    var startTime = ((d.starttime).substring(0, 10)).replace(/-/g, ".");
                    $time_txt.html("使用期限");
                    $overduetime.html(startTime + "-" + endTime);
                } else {
                    var startTime = d.starttime;
                    $time_txt.html("有效期至");
                    $overduetime.html(d.overduetime);
                }

                $couponcode.html(d.couponcode);

                CreateCode(d.couponcode);
                $("#queryData").show();
                data = { "id": d.couponactivityid, "orderid": d.couponvalidatedid };
                $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitydetailedinfobykey", data).then(function (d) {

                    if (d.result) {
                        var couponabstract = $.Cutstring(d.couponactivity.couponabstract, 14);
                        $activitysketch.html(d.couponactivity.activitysketch);
                        $couponabstract.html(couponabstract);
                        $validcount.html(d.couponactivity.validcount);
                    }
                });
            }
            else {
                $.alertF("兑换码和商户不匹配");
            }
        });
    }

    //兑奖
    $Exchange.click(function () {
        var data = { "validatecode": $validatecode.val() };
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/validated", data).then(function (d) {
            if (d.result) {
                if (d.issuccess) {
                    $.alertF("兑换成功");
                    $(".bg-btn").hide();
                    $couponvalidatedstatus.html("已消费");
                    $couponvalidatedstatus.addClass("col-f-bord");
                    return;
                }
                else {
                    //$.alertF("兑换失败",null,searchclick());
                    $.alertF(d.errormsg);
                    return;
                }
            }
            else {
                $.alertF(d.errormsg);
            }
        });
    });


    $(".icon-qrcode").click(function () {
        $(".mask").show();
        $("#qrcode2").show();
        $("#qrcode2").click(function () {
            $("#qrcode2").hide();
            $(".mask").hide();
        });
    })

});

//生成二维码方法
function CreateCode(couponcode) {
    var qrcode = new QRCode(document.getElementById("qrcode2"), {
    });
    var a = decodeURIComponent(couponcode);
    qrcode.makeCode(a);
}

//微信扫描结果
function scanQRCodefun(result) {
    if (!$.isNumber(result)) {
        $.alertF("兑换码不合法");
        return;
    } else {
        $validatecode.val(result);
        $query.click();
    }
}