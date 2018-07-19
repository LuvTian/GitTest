/// <reference path="/js/vendor/jquery-2.2.0.js" />
/// <reference path="/js/common.js" />

"use strict"
$(function () {
    $("#panel2-2").hide();
    getUserInfo();
    pageInit();
    if (loginCookie) {
        $("#user-account-info").show();
    }
    else { initUnLogin(); }
    var Notice1 = new Notice();
});
var product;
var account;
var accountResult;
var proportion;
var lineChartData;
var labels = [];
var data_pro = [];
var data_millionProceeds = [];
var loginCookie = $.getCookie("MadisonToken");
var maxpronumber;
var minpronumber;
var maxmillionproceeds;
var minmillionproceeds;

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            accountResult = data;
            $("#user-account-info").show();
            $("#status-unlogin-img").hide();
            $("#status-unlogin").hide();
            $("#user-demandbalance").click(function () { window.location.href = "/html/product/demand-bill.html"; });
            $("#user-yesterdayprofit-tag,#user-demandprofitcount-tag").click(function () { window.location.href = "/html/product/demand-bill.html?type=5"; });
            $("#user-freezeamount-tag").click(function () { window.location.href = "/html/product/demand-bill.html?type=6"; });
            $(".link-profit").show().click(function () { window.location.href = "/html/product/demand-bill.html?type=5"; });

            if ((account.demandbalance + account.freezeamount) > 0) {
                $("#zzb-contract").attr("href", "/html/my/contract/zzb-invest-contrat.html").css("display", "block");
            }
            else {
                $("#zzb-contract").attr("href", "/html/product/contract/zzb-legal-document.html").css("display", "block");
            }
            $("#user-demandbalance").text($.fmoney(account.demandbalance + account.freezeamount));
            $("#user-demandyesterdayprofit").text($.fmoney(account.demandyesterdayprofit));
            $("#user-demandprofitcount").text($.fmoney(account.demandprofitcount));
            $("#user-freezeamount").text(account.freezeamount);
            $("#user-autoswitchdemand").removeClass("display-none");
            if (account.autoswitchdemand) {
                $("#autoswitchdemand").html("已开通");
                $("#user-autoswitchdemand").attr("href", "/html/Product/automatic-on.html");
            }
            else {
                $("#user-autoswitchdemand").click(function () {
                    checkiswithholdauthoity("/html/Product/automatic.html", null);
                });
            }
            //冻结金额隐藏
            //if (account.freezeamount > 0) {
            //    $("#user-freezeamount").parents(".text-left").show();
            //    $("#user-demandprofitcount").parents(".text-left").removeClass("text-left").addClass("text-center");
            //    $("#user-yesterdayprofit-tag").removeClass("small-5");
            //    $("#user-demandprofitcount-tag").removeClass("small-5");
            //}
            //赎回链接
            var redeemHref = "/html/paycenter/user-demand-redeem.html";
            if (accountResult && accountResult.ismaintenance) {
                redeemHref = "/html/system/data-processing.html";
            }
            if (accountResult && accountResult.isglobalmaintenance) {
                redeemHref = "/html/system/system-maintenance.html";
            }
            //赎回
            $(".redeem").click(function () {
                window.location.href = redeemHref;
                //checkiswithholdauthoity(redeemHref, function () {
                //    window.location.href = redeemHref;
                //});
            });
            if (account.demandbalance == 0) {
                $(".redeem").css("color", "#979797");
                $(".redeem").unbind("click");
            }
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            initUnLogin();
        }
        getCurrentProduct();
    });
};

var getCurrentProduct = function () {
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, { "withlinechart": true }, true).then(function (data) {
        if (data.result) {
            clearInterval(_interval);
            maxpronumber = data.proportion.maxpronumber;
            minpronumber = data.proportion.minpronumber;
            maxmillionproceeds = data.proportion.maxmillionproceeds;
            minmillionproceeds = data.proportion.minmillionproceeds;
            product = data.productinfo;
            proportion = data.proportion;
            //七日年化
            $("#char-avgpronumber").html($.fmoney(proportion.avgpronumber) + "%");
            $("#char-avgmillionproceeds").html($.fmoney(proportion.lastmillionproceeds, 4));
            if (labels.length <= 0) {
                loadChar("chart1");
            }
            if (accountResult && accountResult.result) {
                if (product.status < 5) {
                    initAppoint(product);
                } else if (product.status < 6) {
                    initSelling(product);
                } else {
                    initSold(product);
                }
                if (data.activity.title != "" && data.activity.link != "") {
                    //TODO:活动暂时不上
                    //$("#product-activity").attr("href", data.activity.link).children().text(data.activity.title).end().parent().show();
                }
            }
        }
    });
    if (accountResult && accountResult.result) {
        setTimeout(getCurrentProduct, 30000);
    }
};
//初始化预约
var initAppoint = function (product) {
    $(".status-nav article").hide();
    $("#status-remind").parent().show();
    if (product.isappointment) {
        $("#status-remind").text("已提醒").unbind("click");
    } else {
        $("#status-remind").text("开售提醒").unbind("click").bind("click", appoint);
    }
};

var _interval;
//初始化在售
var initSelling = function (product) {
    $(".status-nav article").hide();
    clearInterval(_interval);
    if (product.countdownsecond > 0) {
        coundDownTimer();
        _interval = setInterval("coundDownTimer()", 1000);
    } else {
        $("#status-invest").data("href", "/html/product/productbuy.html").text("投资").parent().show();

        if (accountResult && accountResult.ismaintenance) {
            $("#status-invest").data("href", "/html/system/data-processing.html").text("投资").parent().show();
        }
        if (accountResult && accountResult.isglobalmaintenance) {
            $("#status-invest").data("href", "/html/system/system-maintenance.html").text("投资").parent().show();
        }
        /*暂时不要*/
        //$("#status-invest").data("href", "javascript:void(0);").text("投资").parent().show();
        //$("#status-invest").click(function () {
        //    var url = "/html/product/productbuy.html";
        //    if (accountResult && accountResult.ismaintenance) {
        //        url = "/html/system/data-processing.html";
        //    }
        //    if (accountResult && accountResult.isglobalmaintenance) {
        //        url = "/html/system/system-maintenance.html";
        //    }
        //    checkiswithholdauthoity(url, function () {
        //        window.location.href = url;
        //    });
        //});
        /*暂时不要*/
    }
};
//初始化售罄
var initSold = function (product) {
    $(".status-nav article").hide();
    $("#status-sold").parent().show();
};

//初始化未登录页面
var initUnLogin = function () {
    $("#user-account-info").hide();
    $("#status-unlogin-img").show().empty().append($('<a href="/html/product/contract/zzb-instructions.html"><img src="/css/img2.0/current-banner.jpg" class="img-responsive"></a>'));
    $("#status-unlogin").show().on("click", $(this).children(), function () {
        window.location.href = "/html/anonymous/login.html";
    });
}

var pageInit = function () {
    $("#char-pronumber,#char-millionproceeds").click(function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
        }
        if ($(this).prop("id") == "char-pronumber") {
            $("#panel2-1").show();
            $("#panel2-2").hide();
            loadChar("chart1");
        }
        else {
            $("#panel2-2").show();
            $("#panel2-1").hide();
            loadChar("chart2");
        }
    });
    //初始化投资跳转链接
    $("#status-invest").click(function () {
        if ($(this).data("href") != "") {
            window.location.href = $(this).data("href");
        }
    });


}

//加载直线图
var loadChar = function (chart) {
    if (!(labels & data_pro & data_millionProceeds & labels.length > 0 & data_pro.length > 0 & data_millionProceeds.length > 0)) {
        labels = [];
        data_pro = [];
        data_millionProceeds = [];
        $.each(proportion.proportionlist, function (index, item) {
            labels.push(item.ProTime);
            data_pro.push(item.ProNumber);
            data_millionProceeds.push(item.MillionProceeds);
        });
    }
    lineChartData = {
        labels: labels,
        datasets: [
        {
            fillColor: "rgba(255,223,209,.5)",
            strokeColor: "rgba(255,152,106,1)",
            pointColor: "rgba(255,152,106,1)",
            data: chart == "chart1" ? data_pro : data_millionProceeds
        }]
    };

    var ctx = document.getElementById(chart).getContext("2d");
    if (chart == "chart1") {
        new Chart(ctx).Line(lineChartData, {
            responsive: true,
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            scaleOverride: true,
            scaleSteps: 5,
            scaleStepWidth: ((maxpronumber - minpronumber) / 5).toFixed(2),
            scaleStartValue: minpronumber
            //scaleBeginAtZero:true
        });
    }
    else {
        new Chart(ctx).Line(lineChartData, {
            responsive: true,
            scaleLabel: "<%=value%>",
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            scaleOverride: true,
            scaleSteps: 5,
            scaleStepWidth: ((maxmillionproceeds - minmillionproceeds) / 5).toFixed(4),
            scaleStartValue: minmillionproceeds
            //scaleBeginAtZero: true
        });
    }

}

var appoint = function () {
    var data = {
        productid: product.productid
    };
    var url = "/StoreServices.svc/product/appoint";
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            $.alertNew("开售提醒成功，我们将会在产品开售前通过短信通知您，敬请留意！");
            product.isappointment = true;
            $("#status-remind").text("已提醒").unbind("click");
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg, null, getCurrentProduct);
        }
    });
};

var checkTime = function (i) {
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
    $("#status-invest").data("href", "").text("即将开售").parent().show();
};

var IncreasingMumber = function (basenumber, bindID) {
    var _setInterval;
    var step;
    var range;
    var number;
    step = 80;
    number = 0;
    range = basenumber / step;
    if (basenumber > 100) {
        var strnum = (basenumber + "").split('.')[0];
        var smallchange = Number(strnum.substr(strnum.length - 2, 2));
        if (Number(smallchange) == 0) {
            range = basenumber / step;
            number = 0;
        }
        else {
            range = smallchange / step;
            number = basenumber - smallchange;
        }
    }

    if (basenumber <= 0) {
        bindID.html($.fmoney(basenumber));
        return;
    }
    var timerId;
    _setInterval = setInterval(function () {
        if (step > 0) {
            step = step - 1;
            number = number + range
            bindID.html($.fmoney(number));
        }
        else if (step == 0) {
            clearInterval(_setInterval);
            bindID.html($.fmoney(basenumber));
        }
    }, 10);

}


//检查新浪设置。
var checkiswithholdauthoity = function (url, withcallback) {
    if (account.customstatus < 3) {
        $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
        return;
    }
    //直连模式
    if (account.iswithholdauthoity == 0)//未设置新浪支付密码
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
        $.SetSinaPayPassword(returnurl, accountResult.date, account.referralcode, account.iscashdesknewuser);
    }
    else if (account.iswithholdauthoity == 1)//未设置委托代扣
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
        $.WithholdAuthority(returnurl, withcallback, account.referralcode, true);
    } else {
        window.location.href = url;// "/html/Product/automatic.html";
    }
}