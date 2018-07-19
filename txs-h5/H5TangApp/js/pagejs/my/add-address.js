/// <reference path="//_references.js" />


$(function () {
    $.delCookie("type"); //删除cookie中的type
    //返回摇一摇页面
    var rocklink = $.getQueryStringByName("rocklink");

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
    //当收货地址id不为空时在文本框中显示数据
    var addressid = $.getQueryStringByName("addressid");
    if (addressid != null && addressid != "") {
        var consigneename = decodeURI($.getQueryStringByName("consigneename"));
        var phone = $.getQueryStringByName("phone");
        var province = decodeURI($.getQueryStringByName("province"));
        var city = decodeURI($.getQueryStringByName("city"));
        var district = decodeURI($.getQueryStringByName("district"));
        var address = decodeURI($.getQueryStringByName("address"));

        $("#consigneename").val(consigneename);
        $("#phone").val(phone);
        $("#aprov").html(province);
        $("#acity").html(city);
        $("#adist").html(district);
        $("#address").val(address);
    }


    $(".pcqaddress").citySelect({
        nodata: "none",
        required: false,
        prov: province,
        city: city,
        dist: district
    }, function (a) {
        if (a == "") a = "请选择省份";
        $("#aprov").html(a);
        $("#acity").html("请选择城市");
        $("#adist").html("请选择区县");
    }, function (a) {
        if (a == "") a = "请选择城市";
        $("#acity").html(a);
        $("#adist").html("请选择区县");
    }, function (a) {
        if (a == "") a = "请选择区县";
        $("#adist").html(a);
    });


    $("#OKBtn").click(function () {

        var addressid = $.getQueryStringByName("addressid");
        if (addressid == "") {
            //添加收货地址信息
            var consigneename = $("#consigneename").val();
            var phone = $("#phone").val();
            var province = $("#aprov").html();
            var city = $("#acity").html();
            var district = $("#adist").html();
            var address = $("#address").val();
            if ($.isNull(consigneename)) {
                $.alertF("请输入收货人！");
                return;
            }
            if (!$.isMobilePhone(phone)) {
                $.alertF("请输入正确的电话号码！");
                return;
            }

            if ($.isNull(province) || province == "请选择省份" || province == "请选择" || province == "省") {
                $.alertF("请选择收货省份！");
                return;
            }
            if ($.isNull(city) || city == "请选择城市" || city == "请选择" || city == "市") {
                $.alertF("请选择收货城市！");
                return;
            }
            if ($.isNull(district) || district == "请选择区县" || district == "请选择" || district == "区") {
                $.alertF("请选择收货县/区！");
                return;
            }
            if ($.isNull(address)) {
                $.alertF("请输入详细地址！");
                return;
            }
            var data = {
                "consigneename": $.FilterXSS(consigneename),
                "phone": $.FilterXSS(phone),
                "province": $.FilterXSS(province),
                "city": $.FilterXSS(city),
                "district": $.FilterXSS(district),
                "address": $.FilterXSS(address)
            };
            $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/userdeliveryaddressinsert", data).then(function (d) {
                if (d.issuccess) {
                    $.alertF("添加成功", "确定", back);
                } else {
                    $.alertF("添加失败请重试！");
                    return;
                }
            });
        } else {
            //修改收货地址信息
            var consigneename = $("#consigneename").val();
            var phone = $("#phone").val();
            var province = $("#aprov").html();
            var city = $("#acity").html();
            var district = $("#adist").html();
            var address = $("#address").val();

            if (!$.isMobilePhone(phone)) {
                $.alertF("请输入正确的电话号码！");
                return;
            }
            if ($.isNull(consigneename)) {
                $.alertF("请输入收货人！");
                return;
            }
            if ($.isNull(province)) {
                $.alertF("请输入收货省！");
                return;
            }
            if ($.isNull(city)) {
                $.alertF("请输入收货城市！");
                return;
            }
            if ($.isNull(district)) {
                $.alertF("请输入收货县/区！");
                return;
            }
            if ($.isNull(address)) {
                $.alertF("请输入详细地址！");
                return;
            }
            var data = {
                "addressid": addressid,
                "consigneename": consigneename,
                "phone": phone,
                "province": province,
                "city": city,
                "district": district,
                "address": address
            };
            $.AkmiiAjaxPost("/StoreServices.svc/user/delivery/userdeliveryaddressupdate", data).then(function (d) {
                if (d.issuccess) {
                    $.alertF("修改成功", "确定", back);
                } else {
                    $.alertF("修改失败请重试！");
                    return;
                }
            });

        }

    });



    function back() {
        if (qhstatus == 1) {
            window.location.href = 'addresslist.html?qhstatus=' + qhstatus + '&couponactivityid=' + couponactivityid + '&longitude=' + longitude + '&latitude=' + latitude + '&orderid=' + orderid + '&wintime=' + wintime + '&status=' + status + '&couponcode=' + couponcode + '&overduetime=' + overduetime + '&rocklink=' + rocklink;
        } else {
            window.location.href = 'addresslist.html';
        }
        window.location.replace("addresslist.html");
    }
});