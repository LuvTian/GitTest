$(function () {

    var endtime = $.getQueryStringByName("endtime");
    var minamount = decodeURI($.getQueryStringByName("minamount"));
    var limitdesc = decodeURI($.getQueryStringByName("limitdesc"));

    $("#endtime").html($.getQueryStringByName("endtime"));//有效期
    $("#description").html("定期理财"+minamount+"元起");//描述
    $("#limitdesc").html(limitdesc);//使用产品
})

$("#btn-use").click(function () {
    window.location.href = "/html/product/";
});

