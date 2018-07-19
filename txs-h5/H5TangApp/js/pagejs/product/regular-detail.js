$(function () {

    //出现投资小贴士
    $(".icon-help").click(function () {
        $(".mask").show();
        $(".capacity1").show();
        return false;
    });
    //关闭投资小贴士
    $(".icon-turnoff2").click(function () {
        $(".mask").hide();
        $(".capacity1").hide();
        return false;

    });
     $.sengcaibaobtntext(function (d) {
        $(".depositbtntext").html(d[0]);
    });
});