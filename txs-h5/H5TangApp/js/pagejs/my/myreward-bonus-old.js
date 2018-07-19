/// <reference path="//_references.js" />

$(function () {
    $('a.usage-rules').click(function () {
        $('.mask').show();
        $('.rule-tip').show();
    })
    $('i.icon-turnoff2').click(function () {
        $('.mask').hide();
        $('.rule-tip').hide();
    });

    loaddata(1);
});
function loaddata(pageindex) {
    var url = "/StoreServices.svc/user/couponlist";
    var param = { "pageindex": pageindex, "type": 0, "status": 0 };
    $.AkmiiAjaxPost(url, param, true).then(function (d) {
        if (d.result) {
            $.each(d.usercouponlist, function (index, entry) {
                $("#couponlist").append(initBonus(entry));
            });
            pageindex = parseInt(pageindex) + 1;
            if (d.usercouponlist.length > 0) {
                $.LoanMore($("#couponlist"), null, "loaddata(" + pageindex + ")");
            } else {
                $.LoanMore($("#couponlist"), "没有更多理财代金券了");
            }
            var ondata = $(".ondata").text();
            if (ondata == "") {
                $('.ticket:last').css('margin-bottom', '5.5rem');
            }
            else {
                $('.ondata').css('margin-bottom', '5.5rem');
            }
        }
    });
}
var initBonus = function (couponItem) {
    var html = [];
    switch (couponItem.status) {
        case 1:
            html.push('<div class="ticket status1" >');
            html.push('<div class="percentage col-fe655f">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-fe655f b-col-fe655f" >未使用</span>');
            html.push('<h3 class="col-fe655f">代金券</h3>');
            html.push('<p class="expired-font">' + couponItem.description + '</p>');
            html.push('<p class="expired-font">有效期至：' + couponItem.enddate + '</p>');
            if (!!couponItem.suitableproduct) {
                html.push('<p class="expired-font col-469 suitableproduct"  data-enddate=' + couponItem.enddate + ' data-description=' + couponItem.description + ' data-suitableproduct=' + couponItem.suitableproduct + '>' + couponItem.suitableproduct + '</p>')
            }
            break;
        case 2:
            html.push('<div class="ticket status2">');
            html.push('<div class="percentage col-999">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-999 b-col-97">已使用</span>');
            html.push('<h3 class="col-999">代金券</h3>');
            html.push('<p class="expired-font">' + couponItem.description + '</p>');
            html.push('<p class="expired-font">使用日期：' + couponItem.startdate + '</p>');
            if (couponItem.useproduct != null) {
                html.push('<p class="expired-font ">用于' + couponItem.useproduct + '</p>')
            }
            break;
        case 3:
            html.push('<div class="ticket status3">');
            html.push('<div class="percentage col-cac">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-cac b-col-cac">已过期</span>');
            html.push('<h3 class="col-cac">代金券</h3>');
            html.push('<p class="expired-font col-cac">' + couponItem.description + '</p>');
            html.push('<p class="expired-font col-cac">有效期至：' + couponItem.enddate + '</p>');
            html.push('<p class="expired-font col-cac">' + couponItem.suitableproduct + '</p>');
            break;
        case 999:
            html.push('<div class="ticket status4">');
            html.push('<div class="percentage col-fff t-22">' + couponItem.amount + '<span>元</span></div>');
            html.push('<div class="ticket-content t-5">');
            html.push('<span class="expired-icon col-fff b-col-fff">使用中</span>');
            html.push('<h3 class="col-fff">代金券</h3>');
            html.push('<p class="expired-font col-fff">' + couponItem.description + '</p>');
            html.push('<p class="expired-font col-fff">使用日期：' + couponItem.startdate + '</p>');
            if (couponItem.useproduct != null) {
                html.push('<p class="expired-white-font">用于' + couponItem.useproduct + '</p>')
            }
            break;
    }
    var result = $(html.join(''));

    $(result).filter(".status1").click(function () {
        window.location.href = "/html/product/index.html";
    });

    //未使用跳转到适用详情页面
    $(result).find(".suitableproduct").click(function () {
        if ($(this).data("suitableproduct") != "") {
            var enddate = $(this).data("enddate");
            var description = $(this).data("description");
            var suitableproduct = $(this).data("suitableproduct");
            window.location.href = "/html/product/bonus-use.html?enddate=" + enddate + "&description=" + description + "&suitableproduct=" + suitableproduct + "";
            return false;
        }
    });


    //html.push('</div><p class="gray-font col-cac">最终解释权归唐小僧理财</p></div>');

    return result;
};

