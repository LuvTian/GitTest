$(function () {
    var enddate = $.getQueryStringByName("enddate");
    var remark = decodeURI($.getQueryStringByName("remark"));
    var suitableproduct = decodeURI($.getQueryStringByName("suitableproduct"));
    var startpay = decodeURI($.getQueryStringByName("startpay"));
    var maxprice = decodeURI($.getQueryStringByName("maxprice"));

    $("#enddate").html(enddate);//有效期
    $("#description").html(remark);//描述
    $("#suitableproduct").html(suitableproduct);//适用产品
    if (startpay <= 0) {
        $('.newqit').hide();
        $('.newmax').hide();
    }
    $("#startpay").html(startpay); // 起投门槛
    $("#maxprice").html($.fmoneytextV2(maxprice));  // 最大限额
})

$("#btn-use").click(function () {
    window.location.href = "/html/product/";
});