/// <reference path="//_references.js" />

$(function () {
    getUserInfo();
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
    $(".buying").on("click", ".icn", function (e) {
        window.location.href = $(this).data("href");
        return false;
    });

    $("#product-ready").click(function () {
        appoint();
    });
    var productid = $.getQueryStringByName("id");
});

var accountBalance = 0;
var product;
var activity;
var _interval;
var accountResult;
var account;

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            accountResult = data;
            account = data.accountinfo;
            accountBalance = account.basicbalance;
        }
        getCurrentProduct();
    });
};

var getCurrentProduct = function () {
    var data = {
        productid: $.getQueryStringByName("id")
    };
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            product = data.productinfo;
            activity = data.activity;
            $.UpdateTitle(product.title);
            $("#typetext").html(product.typetext);
            $("#product-title").text(product.title).append(transform(product.riskleveltext));
            $('#product-rate').text($.fmoney(product.rate, 2));

            if (product.rateactivite > 0) {
                $("#product-rate-rateactivite").text(formatActityRate(product.rateactivite)).show();
            }
            $("#product-profitstartday").text(product.profitstartday + " 起息");
            $("#product-amount").text(product.totalamount / 10000);
            $("#product-detail").attr("href", "/html/product/regular-product-detail.html?id=" + product.productid);
            $("#product-safaty").attr("href", "/html/product/compliancesafety.html?id=" + product.productid);
            $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-introduce.html?id=" + product.productid);
            $("#product-millionproceeds").text(product.millionproceeds);
            //金额保留两位小数
            //$(".product-remainingamount").text($.fmoney(product.remainingamount));
            $(".calculator").click(function () {
                window.location.href = "/html/product/calculator.html?id=" + product.productid;
                return false;
            });
            $(".product-min-amount").text(product.amountmin);
            $("#product-bidrule").text(product.amountmin + "起投，限额" + product.amountmax + "，" + product.step + "的整数倍");
            $("#product-fixed-redeemdec").text(product.type == 99 ? "不" : "");
            $("#product-guaranteetype").text(product.guaranteetypetext);
            $(".product-step").text(product.step);
            if (product.isoldproduct) {
                $("#product-profitstartday").text("次日起息");
                $("#product-xiangmuinfo").parent().hide();
            }
            $("#product-duration").text(product.duration);
            var typeText = product.typetext == "先息后本" ? "按月付息，到期还本" : product.typetext;
            $("#product-typetext").text(typeText);

            $(".icon-calculator").attr("href", "/html/product/calculator.html?id=" + product.productid);
            $("#arepayplan").attr("href", "/Html/Product/regular-pay-plan.html?productid=" + product.productid + "&bidamount=10000&productname=" + encodeURIComponent(product.title));

            if (product.status < 5 && product.paytype != 2) {
                initAppoint(product);
            } else if (product.paytype == 2 && product.zzbisready && !product.zzbreadyon) {
                initZZBReadyProduct(product);
            }
            else if (product.status < 6 && !product.zzbreadyon) {
                initSelling();
            }
            else if (product.status == 6 || product.zzbreadyon) {
                initSold(product);
            }
            //活动
            if (product.status != 6 && data.activity && data.activity.title) {
                $("#product-activity").show().click(function () {
                    window.location.href = activity.link;
                }).find("#product-activity-title").text(activity.description);
            }
        } else {
            $.alertF(data.errormsg, null, history.back());
        }
    });
    setTimeout(getCurrentProduct, 30000);
};

var initAppoint = function (product) {
    $("#product-status-count").text(product.appointment);
    $("#product-status-text").text("提醒记录");
    $(".product-status-text-parent").click(function () {
        window.location.href = "/html/product/productappointlist.html?id=" + product.productid;
    });
    if (product.isappointment) {
        $("#product-ready").css("background", "gray").unbind("click");
        $("#product-ready").find("#product-appoint").text("已提醒");
    }
    $("#product-publish").hide();
    $(".buying").hide();
    $("#product-ready").show();
};

var initSelling = function () {
    clearInterval(_interval);
    if (product.countdownsecond > 0) {
        coundDownTimer();
        _interval = setInterval("coundDownTimer()", 1000);
    } else {
        $("#product-countdown-timer-amount").text("剩余金额 " + $.fmoney(product.remainingamount) + "元");
        if (product.type == 99 && !product.newuser) {
            $(".buying").css("background-color", "gray");
            $("#product-buy").attr("href", "javascript:void(0);");
        } else {
            if (product.paytype == 2) {
                $("#product-buy").attr("href", "/html/product/thanksgivingbuy.html?id=" + product.productid + "&paytype=" + 2).find("#product-buy-link").text("立即抢购(仅支持至尊宝购买)");
            }
            else {
                $("#product-buy").attr("href", "/html/product/thanksgivingbuy.html?id=" + product.productid).find("#product-buy-link").text("立即抢购");
            }
            //特殊渠道必须先买新手标
            if (product.type != 99 && accountResult && !accountResult.ismaintenance && !accountResult.isglobalmaintenance && account && account.isnewuser) {
                $("#product-buy").attr("href", "javascript:void(0);");
                $("#product-buy").click(function () {
                    $.alertF(account.isnewusermsg, "立即投资", function () {
                        window.location.href = "/Html/Product/productfixedlist.html";
                    });
                });
            }
            if (accountResult && accountResult.ismaintenance) {
                $("#product-buy").attr("href", "/html/system/data-processing.html")
            }
            if (accountResult && accountResult.isglobalmaintenance) {
                $("#product-buy").attr("href", "/html/system/system-maintenance.html");
            }
        }
        $("#product-status-count").text(product.bidcount);
        $("#product-status-text").text("投资记录");
        $(".product-status-text-parent").click(function () {
            window.location.href = "/html/product/productbidlist.html?id=" + product.productid;
        });
    }

    $("#product-purchaseprogress").text(product.purchaseprogress + "%");
    $("#product-process").width(product.purchaseprogress + "%");

    $("#product-publish").show();
    $("#product-publish-date").text(product.publishjsondate);
    $(".buying").hide();
    $("#product-buy").show();
};

var initSold = function (product) {
    if (product.zzbreadyon) {
        $("#product-soldout").html("预约满");
        $("#product-status-text").text("预约记录");
        $("#product-status-text").parent().click(function () {
            window.location.href = "/html/product/productReadylist.html?id=" + product.productid;
        });
    }
    else {
        $("#product-status-text").text("投资记录");
        $("#product-status-text").parent().click(function () {
            window.location.href = "/html/product/productbidlist.html?id=" + product.productid;
        });
    }
    $("#product-purchaseprogress").text("100%");

    $("#product-process").width("100%");
    $("#product-status-count").text(product.bidcount);
    //$("#product-status-text").parent().attr("href", "/html/product/productbidlist.html?id=" + product.productid);

    $("#product-publish").show();
    $("#product-publish-date").text(product.publishjsondate);
    $(".buying").hide();
    $("#product-soldout").show();
};

//至尊宝预约
var initZZBReadyProduct = function (product) {
    $("#product-status-count").text(product.bidcount);
    $("#product-countdown-timer-amount").text("剩余金额 " + $.fmoney(product.remainingamount) + "元");
    $("#product-buy").attr("href", "/html/product/product-ready-zzb.html?id=" + product.productid).find("#product-buy-link").text("至尊宝预约");
    $("#product-status-text").text("预约记录");
    $(".product-status-text-parent").click(function () {
        window.location.href = "/html/product/productReadylist.html?id=" + product.productid;
    });
    $("#product-soldout").hide();
    $("#product-ready").hide();
    $("#product-buy").show();

};

var appoint = function () {
    var data = {
        productid: $.getQueryStringByName("id")
    };
    var url = "/StoreServices.svc/product/appoint";
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            $.alertF("提醒成功，我们将会在产品开售前通过短信通知您，敬请留意！");
            $("#product-ready").css("background", "gray").unbind("click");
            $("#product-appoint").text("已提醒");
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
        else {
            $.alertF(data.errormsg, null, getCurrentProduct);
        }
    });
};
var checkTime = function (i) { //格式化数字为双数
    i = parseInt(i);
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};

var coundDownTimer = function () {
    product.countdownsecond = product.countdownsecond - 1;
    var second = product.countdownsecond % 60;
    var minutes = parseInt(product.countdownsecond / 60);

    if (minutes <= 0 && second <= 0) {
        clearInterval(_interval);
        initSelling(product);
        return;
    }
    $("#product-countdown-timer-amount").text(checkTime(minutes) + ":" + checkTime(second) + " 后开售");
    $("#product-status-count").text(product.appointment);
    $("#product-status-text").text("提醒记录");
    $(".product-status-text-parent").click(function () {
        window.location.href = "/html/product/productappointlist.html?id=" + product.productid;
    });
    $("#product-buy-link").text("即将开售");
};

var transform = function (risktext) {
    if (risktext) {
        return '<a class="zm info" href="/Html/Product/productfixedinfo.html">' + risktext + '</a>';
    }
    return "";

}




//格式化活动标利率
var formatActityRate = function (actityrate) {
    if (actityrate > 0) {
        return "+" + $.fmoney(actityrate) + "%";
    }
    else {
        return "";
    }
}