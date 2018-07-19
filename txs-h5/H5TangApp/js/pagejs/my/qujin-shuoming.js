$(window).load(function () {
    $("#all-body-div-status").fadeOut();
    $("#all-body-div-preloader").delay(350).fadeOut("slow");
});
$(function () {
    $(".invite-title").click(function () {
        $(".rule").toggle();
        $(this).toggleClass('on');
    })
    getCurrentLeaver();
    getUserInfo();
});
$(document).foundation({
    accordion: {
        callback: function (accordion) {
        }
    }
});

var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            $("#qujin-shengji").attr("href", "qujin-invite.html?referralcode=" + account.referralcode + "#list");
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.delCookie("MadisonToken");
            $.Loginlink();
        }
    });
};

var getCurrentLeaver = function ()
{
    var level = $.getQueryStringByName("currentlevel");//0 白龙马 ；1 卷帘大将；2 天蓬元帅；3 齐天大圣
    InitLoadLi(level);
}

var InitLoadLi = function (index) {
    $(".accordion li").eq(index).find("a").attr("aria-expanded", true);
    $(".accordion li").eq(index).addClass("current-level").addClass("active");
    $(".accordion li").eq(index).children('div').addClass("active");
    //$(".accordion li:not(:eq(" + index + "))").removeClass("current-level");
    //$(".accordion li:not(:eq(" + index + "))").children('div').removeClass("active");
}
