var pageindex = 0;
$(function () {
    financialamount();
    getvalue()
    loaddata(pageindex);
});

//理财金余额
function financialamount() {
    var url = "/StoreServices.svc/trans/financialhistorylist";
    $.AkmiiAjaxPost(url, { "status": 1 }, true).then(function (data) {
        if (data.result) {
            //理财金总金额
            $(".income span").html($.fmoney(data.sumprofit));
        }
    });
}

//理财金余额跳转链接
// click(function () {
//     window.location.href = "/Html/My/financiallist.html";
// });

//理财金记录跳转链接
$(".income").click(function () {
    window.location.href = "/html/my/my-financial-index.html";
});

//理财金购买跳转链接
$(".header").click(function () {
    window.location.href = "/html/product/productfinancialbuy.html";
});
$("a.usage-rules").click(function () {
    window.location.href = "/html/product/productfinancialbuy.html";
});

/// <reference path="//_references.js" />

// $(function () {
//     $('a.usage-rules').click(function () {
//         $('.mask').show();
//         $('.rule-tip').show();
//     })
//     $('i.icon-turnoff2').click(function () {
//         $('.mask').hide();
//         $('.rule-tip').hide();
//     });

//     loaddata(1);
// });
function getvalue() {
    var url = "/StoreServices.svc/user/financiallist";
    $.AkmiiAjaxPost(url, {}, true).then(function (d) {
        if (d.result) {
            $(".balance-frozensumamount").html($.fmoney(d.frozensumamount));
            $(".balance-sumamount").html($.fmoney(d.sumamount));
            $(".balance").html($.fmoney(d.totalamount));
        }
    })
}

function loaddata(pageindex) {
    var url = "/StoreServices.svc/user/financiallist";
    var param = {};
    pageindex = parseInt(pageindex) + 1;
    param = { "pageindex": pageindex, "pagesize": 15 };
    $.AkmiiAjaxPost(url, param, true).then(function (d) {
        if (d.result) {
            if (pageindex == 1 && d.userfinanciallist.length == 0) {
                $("#couponlist").append("<img class='none-bg' src='/css/img2.0/none-second.png'>");
            }
            $.each(d.userfinanciallist, function (index, entry) {
                $("#couponlist").append(initBonus(entry));
            });
            if (pageindex == 1 && d.userfinanciallist.length >= 0 && d.userfinanciallist.length < 15) {
                $('.ticket:last').css('margin-bottom', '5.5rem');
                return;
            }
            if (pageindex == 1 && d.userfinanciallist.length >= 15) {

                $.LoanMore($("#couponlist"), null, "loaddata(" + pageindex + ")");
                $('.ondata').css('margin-bottom', '5.5rem');
            }
            if (pageindex >= 2 && d.userfinanciallist.length >= 0) {
                if (d.userfinanciallist.length < 15) {
                    $.LoanMore($("#couponlist"), "没有更多理财代金券了");
                    $('.ondata').css('margin-bottom', '5.5rem');
                } else {
                    $.LoanMore($("#couponlist"), null, "loaddata(" + pageindex + ")");
                    $('.ondata').css('margin-bottom', '5.5rem');

                    //pageindex = parseInt(pageindex) + 1;
                }
            }
            //console.log('pageindex-->', pageindex);
            //if (pageindex >= 2 && d.userfinanciallist.length > 0 && d.userfinanciallist.length < 15) {
            //    $.LoanMore($("#couponlist"), "没有更多理财代金券了");
            //    $('.ondata').css('margin-bottom', '5.5rem');
            //}
            //if (pageindex >= 2 && d.userfinanciallist.length > 0 && d.userfinanciallist.length >= 15) {
            //    $('.ondata').css('margin-bottom', '5.5rem');

            //    $.LoanMore($("#couponlist"), null, "loaddata(" + pageindex + ")");
            //    pageindex = parseInt(pageindex) + 1;
            //}

            //var ondata = $(".ondata").text();
            //if (ondata == "") {
            //    $('.ticket:last').css('margin-bottom', '5.5rem');
            //}
            //else {
            //    $('.ondata').css('margin-bottom', '5.5rem');
            //}
        } else {
            $("#couponlist").append("<p class='none-any'>暂无理财金</p>");
        }
    });
}
var initBonus = function (couponItem) {
    var html = [];
    switch (couponItem.status) {
        case 0://立即激活 
            html.push('<div class="ticket status1" >');
            html.push('<div class="percentage col-cac1">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-cac1 b-col-cac1" >立即激活</span>');
            html.push('<h3 class="col-cac1">理财金</h3>');
            html.push('<p class="expired-font col-cac1">' + couponItem.description + '</p>');
            html.push('<p class="expired-font col-cac1">' + couponItem.limitdesc + '</p>');
            html.push('<p class="expired-font col-cac1">有效期至：' + couponItem.endtime + '</p>');
            html.push('<p class="expired-font col-cac1">最终解释权归唐小僧理财</p>')
            break;
        case 1://可使用 
            html.push('<div class="ticket status2">');
            html.push('<div class="percentage col-cac2">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-cac2 b-col-cac2">可使用</span>');
            html.push('<h3 class="col-cac2">理财金</h3>');
            html.push('<p class="expired-font">' + couponItem.description + '</p>');
            html.push('<p class="expired-font">可投资指定理财产品</p>');
            //html.push('<p class="expired-font">' + couponItem.limitdesc + '</p>');
            html.push('<p class="expired-font">有效期至：' + couponItem.endtime + '</p>');
            html.push('<p class="expired-font col-cac22">最终解释权归唐小僧理财</p>')
            break;
        case 2://已使用
            html.push('<div class="ticket status3">');
            html.push('<div class="percentage col-cac3">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-cac33 b-col-cac33">已使用</span>');
            html.push('<h3 class="col-cac33">理财金</h3>');
            html.push('<p class="expired-font col-cac33">' + couponItem.description + '</p>');
            //html.push('<p class="expired-font col-cac33">' + couponItem.limitdesc + '</p>');
            html.push('<p class="expired-font col-cac33">有效期至：' + couponItem.endtime + '</p>');
            html.push('<p class="expired-font col-cac33">最终解释权归唐小僧理财</p>')
            break;
        case 3://已过期
            html.push('<div class="ticket status4">');
            html.push('<div class="percentage col-cac">' + couponItem.amount + '<span>元</span></div>');
            html.push(' <div class="ticket-content">');
            html.push('<span class="expired-icon col-cac b-col-cac">已过期</span>');
            html.push('<h3 class="col-cac">理财金</h3>');
            html.push('<p class="expired-font col-cac">' + couponItem.description + '</p>');
            html.push('<p class="expired-font col-cac">可投资指定理财产品</p>');
            //html.push('<p class="expired-font col-cac">' + couponItem.limitdesc + '</p>');
            html.push('<p class="expired-font col-cac">有效期至：' + couponItem.endtime + '</p>');
            html.push('<p class="expired-font col-cac">最终解释权归唐小僧理财</p>')
            break;
        case 999:
            html.push('<div class="ticket status4">');
            html.push('<div class="percentage col-fff t-22">' + couponItem.amount + '<span>元</span></div>');
            html.push('<div class="ticket-content t-5">');
            html.push('<span class="expired-icon col-fff b-col-fff">使用中</span>');
            html.push('<h3 class="col-fff">理财金</h3>');
            html.push('<p class="expired-font col-fff">' + couponItem.description + '</p>');
            html.push('<p class="expired-font col-fff">使用日期：' + couponItem.startdate + '</p>');
            if (couponItem.useproduct != null) {
                html.push('<p class="expired-white-font">用于' + couponItem.useproduct + '</p>')
            }
            break;
    }
    var result = $(html.join(''));

    //立即激活券
    $(result).filter(".status1").click(function () {
        // var endtime = couponItem.;
        // var description = $(this).data("description");
        // var limitdesc = $(this).data("limitdesc");
        window.location.href = "/html/product/bonus-use-second.html?endtime=" + couponItem.endtime + "&minamount=" + couponItem.minamount + "&limitdesc=" + couponItem.limitdesc + "";
    })
    // $(result).filter(".status1").click(function () {
    //     window.location.href = "/html/product/";
    // });
    $(result).filter(".status2").click(function () {
        window.location.href = "/html/product/productfinancialbuy.html";
    });

    //未使用跳转到适用详情页面
    // $(result).find(".suitableproduct").click(function () {
    //     if ($(this).data("suitableproduct") != "") {
    //         var enddate = $(this).data("enddate");
    //         var description = $(this).data("description");
    //         var suitableproduct = $(this).data("suitableproduct");
    //         window.location.href = "/html/product/bonus-use.html?enddate=" + enddate + "&description=" + description + "&suitableproduct=" + suitableproduct + "";
    //         return false;
    //     }
    // });


    //html.push('</div><p class="gray-font col-cac">最终解释权归唐小僧理财</p></div>');

    return result;
};

