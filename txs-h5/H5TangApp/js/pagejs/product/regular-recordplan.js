
var interestcouponid = $.getQueryStringByName("interestcouponid") || 0;
$(function () {
    $(".hk_tab li:odd").addClass("bg");
    listPlan();
    getPlanItem($.getQueryStringByName("interestcouponid"));
});
var temp = 0;
var getPlanItem = function (interestcouponid, callback) {
    var url = "/StoreServices.svc/activity/interestcoupongetbyid";
    $.AkmiiAjaxPost(url, {
        interestcouponid: interestcouponid || 0
    }, true).then(function (data) {
        if (data.result) {
            callback && callback(data)
        }
    });
};
var bindEvent = function () {
    $(".bb").click(function () {
        var _this = $(this);
        if (_this.hasClass('bluehight')) {
            getPlanItem(_this.data('interid'), function (data) {
                $('.mask').show();
                $('.win').show();
                //$('.quan_mark').text(data.interestcoupon.remark);
                $('.sp1').text(data.interestcoupon.amountmin);
                $('.sp2').text(data.interestcoupon.expireday);
                $('.quan_maxlimit').text('最大加息限额' + $.fmoneytextV2(data.interestcoupon.amountlimit) + '元');
                $('.quan_name').text(data.interestcoupon.name);
                $('.quan_use').text('用于' + data.interestcoupon.interestproduct);
                $('.win_main').find('z').text($.fmoneytextV2(data.interestcoupon.amountlimit));
                $('.z_start').text(data.interestcoupon.startdate);
                $('.z_end').text(data.interestcoupon.enddate);
                $('.interest').text('+' + data.interestcoupon.rate + '%');
            })
        }
    });
    $('.win_close').click(function () {
        $('.mask').hide();
        $('.win').hide();
        $('.quan_maxlimit').text('');
        $('.quan_name').text('');
        $('.quan_use').text('');
        $('.win_main').find('z').text('');
        $('.z_start').text('');
        $('.z_end').text('');
        $('.interest').text('');
        $('.sp1').text('');
        $('.sp2').text('');
    });
    $('.quan_ok').click(function () {
        $('.win_close').trigger('click');
    });
};
var listPlan = function () {
    var url = "/StoreServices.svc/product/repayplan2";
    var paramter = {
        productbidid: $.getQueryStringByName("id")
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var list = data.repayplanlist;
            $("#totalprincipae").html($.fmoney(data.totalprincipae));
            $("#totalinterest").html($.fmoney(data.totalinterest));
            var html = createListDom(data);
            $("#recordPlanList").append(html);
            bindEvent();
            if (data.iscalledaway && data.penalty>0) {
                if (!data.istransferpenalty) {
                $("#totalMsg").html("提前赎回手续费" + $.fmoney(data.penalty) + "元");
                } else {
                    $("#totalMsg").html("转让产品手续费" + $.fmoney(data.penalty) + "元");
                }
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var createListDom = function (data) {
    var ha = [];
    $.each(data.repayplanlist, function (index, entry) {
        var repaytime = entry.repaytime.replace(/\-/gi, '/');
        //使用加息券显示四列（未使用显示三列）
        if (interestcouponid != 0) {
            ha.push("<li class='bb{0}' data-interid='{1}'> <span class='useinterest'>".replace('{0}', (entry.type == 3 ? ' bluehight' : '')).replace('{1}', $.getQueryStringByName("interestcouponid")) + repaytime + "</span> <span class='useinterest'>"
           + $.fmoney(entry.monthlyprincipal) + "</span> <span class='useinterest'>"
           + $.fmoney(entry.monthinterst) + "</span> <span class='useinterest'>"
           + $.fmoney(entry.interstprofit) + "</span> </li>");
        }
        else {
            $(".retext").removeClass("retext4");
            $(".retext").addClass("retext3");

            if (temp == 0) {
                $("ul li span:last-child").remove();
                $("ul li span").removeClass("useinterest");
                $("ul li span").addClass("nouseinterest");
                temp += 1;
            }
            ha.push("<li class='bb'> <span class='nouseinterest'>" + repaytime + "</span> <span class='nouseinterest'>"
               + $.fmoney(entry.monthlyprincipal) + "</span> <span class='nouseinterest'>"
               + $.fmoney(entry.monthinterst) + "</span> </li>");
        }

    });
    return ha.join('');
};