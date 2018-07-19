$(function () {

    var enddate = $.getQueryStringByName("enddate");
    var description = decodeURI($.getQueryStringByName("description"));
    var suitableproduct = decodeURI($.getQueryStringByName("suitableproduct"));

    $("#enddate").html(enddate);//有效期
    $("#description").html(description);//描述
    $("#suitableproduct").html(suitableproduct);//使用产品
})

$("#btn-use").click(function () {
    window.location.href = "/html/product/";
});

