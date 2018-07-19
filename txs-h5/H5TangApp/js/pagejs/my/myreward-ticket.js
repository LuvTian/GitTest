/// <reference path="//_references.js" />

$(function () {


    //规则弹出
    $('a.usage-rules').click(function () {
        $('.mask').show();
        $('.rule-tip').show();
    });
    //规则关闭
    $('i.icon-turnoff2').click(function () {
        $('.mask').hide();
        $('.rule-tip').hide();
    });

    //投资提示关闭
    $('.pic2').click(function () {
        $('.ticket-used').hide();
        $('.mask').hide();
    });

    $(".ticket-used .row").find("div:last").click(function () {
        $('.ticket-used').hide();
        $('.mask').hide();
    });

    $("#interestcouponlist").html("");
    getUserInfo();
});

// ---从html页面拷贝js代码到js文件--
// 韦双
$(function () {
    var flag = true;
    //代金券和加息券下拉选择
    $(".JS_choose").on('click', function () {
        if (flag) {
            $('.choose_favourable').show();
            $('.JS_mask').show();
            $('.triangle').removeClass("triangle_up").addClass("triangle_down");
            flag = false;
            $('body').addClass("noscroll");
        } else {
            $('.choose_favourable').hide();
            $('.JS_mask').hide();
            $('.triangle').removeClass("triangle_down").addClass("triangle_up");
            flag = true;
            $('body').removeClass("noscroll");
        }
    });
    $('.choose_favourable li').click(function () {
        flag = true;
        $('.triangle').removeClass("triangle_down").addClass("triangle_up");
        $(this).addClass("choosed_favourable")
            .siblings().removeClass("choosed_favourable");
        $('.choose_favourable').hide();
        $('.JS_mask').hide();
        $('.title_name').text($(this).text());
        $('body').removeClass("noscroll");
        if ($(this).index() == 0) {
            window.location.href = "/html/my/myreward-bonus.html";
        }
    });
    $('.JS_mask').click(function () {
        flag = true;
        $('.triangle').removeClass("triangle_down").addClass("triangle_up");
        $(this).addClass("choosed_favourable")
            .siblings().removeClass("choosed_favourable");
        $('.choose_favourable').hide();
        $('.JS_mask').hide();
        $('body').removeClass("noscroll");
    });
});

var account = null;
var resultdata = null;
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            resultdata = data;
            loaddata(1);
        }
    });
};
var loaddata = function (pageindex) {
    var url = "/StoreServices.svc/activity/interestcouponlist";
    var param = { "pageindex": pageindex };
    $.AkmiiAjaxPost(url, param, true).then(function (d) {
        if (d.result) {
            $.each(d.interestcouponlist, function (i, item) {
                $("#interestcouponlist").append(getInterestHtml(item));
            });

            pageindex = parseInt(pageindex) + 1;
            if (d.interestcouponlist.length > 14) {
                $.LoanMore($("#interestcouponlist"), null, "loaddata(" + pageindex + ")");
            } else if (pageindex > 1 || d.interestcouponlist.length == 0) {
                $.LoanMore($("#interestcouponlist"), "没有更多加息券了");
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
};

var InterestCouponUsing = null;

var getInterestHtml = function (item) {
    var ha = [];
    switch (item.status) {
        case 0:
            ha.push('<div class="ticket status5">');
            ha.push('<div class="percentage col-fe655f t-22">+' + item.rate + '%</div>');
            ha.push('<div class="ticket-content t-5">');
            ha.push('<span class="expired-icon col-fe655f b-col-fe655f">未使用</span>');
            ha.push('<h3 class="col-fe655f margin-bottom0">' + item.name + '</h3>');
            if (item.type == 2 && item.suitableproduct != "" && item.amountmin > 0) {
                ha.push('<p class="expired-font t-line-fix">定期理财{0}元起，加息{1}天</p>'.replace('{0}', item.amountmin).replace('{1}', item.expireday));
            } else {
                ha.push('<p class="expired-font t-line-fix">' + item.remark + '</p>');
            }
            if (item.type == 1) {
                if (item.amountlimit > 0) {
                    ha.push('<p class="expired-font">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            } else {
                if (item.amountmin > 0 && item.amountlimit > 0) {
                    ha.push('<p class="expired-font">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            }
            ha.push('<p class="expired-font t-line-fix">有效期至：' + item.expiredate + '</p>');
            //定期适用产品
            if (item.type == 2 && item.suitableproduct != "") {
                ha.push('<p class="expired-font col-469 suitableproduct" data-startpay="' + item.amountmin + '"  data-maxprice="' + item.amountlimit + '" data-enddate="' + item.expiredate + '"  data-remark="' + item.remark + '" data-suitableproduct="' + item.suitableproduct + '" data-type="' + item.type + '">' + item.suitableproduct + '</p>')
            }
            break;
        case 1:
            ha.push('<div class="ticket status4">');
            ha.push('<div class="percentage col-fff t-22">+' + item.rate + '%</div>');
            ha.push('<div class="ticket-content t-5">');
            ha.push('<span class="expired-icon col-fff b-col-fff">使用中</span>');
            ha.push('<h3 class="col-fff margin-bottom0">' + item.name + '</h3>');
            if (item.type == 2 && item.interestproduct != "" && item.amountmin > 0) {
                ha.push('<p class="expired-font col-fff t-line-fix">定期理财{0}元起，加息{1}天</p>'.replace('{0}', item.amountmin).replace('{1}', item.expireday));
            } else {
                ha.push('<p class="expired-font col-fff t-line-fix">' + item.remark + '</p>');
            }
            if (item.type == 1) {
                if (item.amountlimit > 0) {
                    ha.push('<p class="expired-font col-fff">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            } else {
                if (item.amountmin > 0 && item.amountlimit > 0) {
                    ha.push('<p class="expired-font col-fff">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            }
            ha.push('<p class="expired-font col-fff t-line-fix">生效期至：' + item.startdate + '</p><p class="expired-font col-fff">结束期至：' + item.enddate + '</p>');
            //定期加息产品
            if (item.type == 2 && item.interestproduct != "") {
                ha.push('<p class="expired-white-font">用于' + item.interestproduct + '</p>')
            }
            InterestCouponUsing = item;
            break;
        case 2:
            ha.push('<div class="ticket status2">');
            ha.push('<div class="percentage col-979 t-22">+' + item.rate + '%</div>');
            ha.push('<div class="ticket-content t-5">');
            ha.push('<span class="expired-icon col-979 b-col-979">已使用</span>');
            ha.push('<h3 class="col-979 margin-bottom0">' + item.name + '</h3>');
            if (item.type == 2 && item.interestproduct != "" && item.amountmin > 0) {
                ha.push('<p class="expired-font col-979 t-line-fix">定期理财{0}元起，加息{1}天</p>'.replace('{0}', item.amountmin).replace('{1}', item.expireday));
            } else {
                ha.push('<p class="expired-font col-979 t-line-fix">' + item.remark + '</p>');
            }
            if (item.type == 1) {
                if (item.amountlimit > 0) {
                    ha.push('<p class="expired-font col-979">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            } else {
                if (item.amountmin > 0 && item.amountlimit > 0) {
                    ha.push('<p class="expired-font col-979">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            }
            ha.push('<p class="expired-font col-979 t-line-fix">生效日期：' + item.startdate + '</p><p class="expired-font col-979 col-end">结束日期：' + item.enddate + '</p>');
            //定期加息产品
            if (item.type == 2 && item.interestproduct != "") {
                ha.push('<p class="expired-font ">' + item.interestproduct + '加息' + item.expireday + '天</p>')
            }
            break;
        case 3:
            ha.push('<div class="ticket status3">');
            ha.push('<div class="percentage col-cac t-22">+' + item.rate + '%</div>');
            ha.push('<div class="ticket-content t-5">');
            ha.push('<span class="expired-icon col-cac b-col-cac">已过期</span>');
            ha.push('<h3 class="col-cac margin-bottom0">' + item.name + '</h3>');
            if (item.type == 2 && item.suitableproduct != "" && item.amountmin > 0) {
                ha.push('<p class="expired-font col-cac t-line-fix">定期理财{0}元起，加息{1}天</p>'.replace('{0}', item.amountmin).replace('{1}', item.expireday));
            } else {
                ha.push('<p class="expired-font col-cac t-line-fix">' + item.remark + '</p>');
            }
            if (item.type == 1) {
                if (item.amountlimit > 0) {
                    ha.push('<p class="expired-font col-cac">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            } else {
                if (item.amountmin > 0 && item.amountlimit > 0) {
                    ha.push('<p class="expired-font col-cac">最大加息限额' + $.fmoneytextV2(item.amountlimit) + '元</p>');
                }
            }
            ha.push('<p class="expired-font col-cac t-line-fix">有效期至：' + item.expiredate + '</p>');
            //定期适用产品
            if (item.type == 2 && item.suitableproduct != "") {
                ha.push('<p class="expired-font col-cac suitableproduct">' + item.suitableproduct + '</p>')
            }
            break;
    }

    var result = $(ha.join(''));
    if (item.status == 0) {
        if (item.type == 1) {
            //至尊宝
            result.click(function () {
                InterestCouponUse(item);
            });
        }
        else {
            //定期产品
            $(result).filter(".status5").click(function () {
                window.location.href = "/html/product/index.html";
            });
            //定期产品跳转到适用详情页面
            $(result).find(".suitableproduct").click(function () {
                if ($(this).data("suitableproduct") != "") {
                    var enddate = $(this).data("enddate");
                    var remark = $(this).data("remark");
                    var suitableproduct = $(this).data("suitableproduct");
                    var startpay = $(this).data("startpay");
                    var maxprice = $(this).data("maxprice");
                    window.location.href = "/html/product/tickets-use.html?enddate={0}&remark={1}&suitableproduct={2}&startpay={3}&maxprice={4}"
                        .replace('{0}', enddate)
                        .replace('{1}', remark)
                        .replace('{2}', suitableproduct)
                        .replace('{3}', startpay)
                        .replace('{4}', maxprice);// + enddate + "&remark=" + remark + "&suitableproduct=" + suitableproduct + "";
                    return false;
                }
            });
        }
    }
    return result;
};

var InterestCouponUse = function (item) {
    if (resultdata.ismaintenance) {
        window.location.href = "/html/system/data-processing.html";
        return;
    }
    if (resultdata.isglobalmaintenance) {
        window.location.href = "/html/system/system-maintenance.html";
        return;
    }
    //1.使用加息券之前，先判断投资是否满足条件(只要有钱就可以使用)
    if (account.demandbalance + account.freezeamount == 0) {
        InterestSuccess(0, item);
        return;
    }
    if (InterestCouponUsing != null) {
        InterestSuccess(1, item);
        return;
    }
    if (account.demandbalance + account.freezeamount > item.amountlimit && item.amountlimit > 0) {
        InterestSuccess(3, item);
        return;
    }
    InterestSuccess(2, item);
};
var activeInterestCoupon = function (id) {
    var url = "/StoreServices.svc/activity/interestcouponuse";
    var param = { "id": id };
    $.AkmiiAjaxPost(url, param, false).then(function (d) {
        if (d.result) {
            $('.ticket-used').hide();
            $('.win').hide();
            $('.mask').hide();
            $("#interestcouponlist").html("");
            loaddata(1);
        } else {
            $.alertF(d.errormsg);
        }
    });
}

var InterestSuccess = function (value, item) {
    var ticketitem;
    if (value == 3) {
        ticketitem = $('.win');
    } else {
        ticketitem = $(".ticket-used:eq(" + value + ")");
    }
    switch (value) {
        case 0:
            $(ticketitem).find(".row div").unbind("click").click(function () {
                window.location.href = "/html/product/index-demand.html";
            });
            break;
        case 1:
            ticketitem.find('z').text(InterestCouponUsing.rate);
            if (item.amountmin > 0 && account.demandbalance + account.freezeamount > item.amountlimit) {
                $('.newspan').show().find('k').text($.fmoneytextV2(item.amountlimit));
            }
            $(ticketitem).find(".row div:eq(0)").unbind("click").click(function () {
                activeInterestCoupon(item.id);
            });
            break;
        case 2:
            ticketitem.find('z').text(item.expireday);
            ticketitem.find('.size-220').text(item.rate);
            $(ticketitem).find(".row div:eq(0)").unbind("click").click(function () {
                activeInterestCoupon(item.id);
            });
            break;
        case 3:
            $('.margin_b').find('z').text($.fmoneytextV2(item.amountlimit));
            $('.win_ok').unbind("click").click(function () {
                activeInterestCoupon(item.id);
            });
            $('.win_close').unbind("click").click(function () {
                ticketitem.hide();
                $('.mask').hide();
                $('.margin_b').find('z').text(0);
            });
            break;
    }

    ticketitem.show();
    $('.mask').show();
};

