$(function() {
    //GetBanner();
    var success_returnurl = decodeURIComponent($.getQueryStringByName("returnurl") || "");
    var type = $.getQueryStringByName("type");
    //var iswithholdauthoity = $.getQueryStringByName("iswithholdauthoity") || 0;

    switch (type) {
        case "demand-redeem":
            demandRedeem();
            break;
        case "fixedRedeem":
        case "incrementalRedeem":
            fixedRedeem();
            break;
        case "buy":
        case "fixedbuy":
        case "financialbuy":
        case "incremental":
            incrementalBuy();
            break;
        case "appoint":
            appoint();
            break;
        case "producttransfer":
            producttransfer();
            break;
        case "transferwithdrawok":
            transferwithdrawok();
            break;
    }

    //if (title != null && title != undefined && title.trim() != "") {
    if (!!title) {
        if (type == "producttransfer") {
            $(document).attr("title", "转让提交成功");
        } else {
            $(document).attr("title", title);
        }
    }
    // 周周僧+定期投资+理财金+至尊宝投资
    if (type == "buy" || type == "incremental" || type == "fixedbuy" || type == "financialbuy") {
        $(document).attr("title", "申请完成");
    }
    //投资成功页添加自动转入提示
    if (type == "buy" || type == "appoint" || type == "fixedbuy" || type == "incremental") {
        getUserInfo();
    }

    $("#success-btn").click(function() {
        if (success_returnurl) {
            var fanbafrom = $.getCookie("fanbafrom");
            if (fanbafrom && fanbafrom.toLowerCase() == "ios") {
                //返吧 ios
                window.webkit.messageHandlers.fanbalife.postMessage({ method: "toNative", jsonString: success_returnurl });
                return;
            } else if (fanbafrom && fanbafrom.toLowerCase() == "android") {
                //返吧 android
                window.fanbalife.toNative(success_returnurl);
                return;
            } else {
                //返吧 H5
                window.location.replace(success_returnurl);
                return;
            }
        }
        if (type == "financialbuy") {
            window.location.replace("/html/my/my-financial-index.html");
        } else if (type == "producttransfer") {
            window.location.replace("/html/my/my-regular-index.html");
        } else if (type == "transferwithdrawok") {
            window.location.replace("/html/my/my-regular-index.html");
        } else if (type == "incremental") {
            window.location.replace("/html/my/my-incremental-detail.html");
        } else {
            window.location.replace("/html/my/");
        }
    });
});

var fillsignday = $.getQueryStringByName("fillsignday") || 0;
var account = [];
var getUserInfo = function() {
    url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            if (account.iswithholdauthoity == 1) { //未设置委托代扣
                var ls = localStorage.getItem(account.referralcode + "knowwithholdauthority") || "false";
                if (ls == "false") {
                    var returnurl = window.location.origin + "/html/my/index.html";
                    $.WithholdAuthority(returnurl, null, account.referralcode, true);
                }
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
    });
};
/*
//自动转入提示
var autoBalanceToDemandTip = function() {
    var h = [];
    h.push('<div class="mask" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; opacity: .6; z-index: 10;">');
    h.push('</div>');
    h.push('<div class="mtk" style=" position: absolute; left: 5%; top: 3.75rem; z-index: 11; background-color: #fff; border-radius: 5px; padding: 2.25rem 0.9rem; width: 90%;">');
    h.push('<span id="close" style="position: absolute;top: 3vw;right: -20vw;font-size: 2.5rem;color: #C8C8C8;display: inline-block; width: 33%;">');
    h.push('x');
    h.push('</span>');
    h.push('<h1 style="font-size: 1.739rem; text-align: center; margin: 1rem 0;">');
    h.push('余额自动转入至尊宝');
    h.push('</h1>');
    h.push('<div style="font-size: 1.333rem; color: #979797;">');
    h.push('<p style="display:inline-block;width: 100%;    padding: 0 2rem;">');
    h.push('<span style="color: #C8C8C8; display: inline-block; width: 33%;">');
    h.push('● 快速计息');
    h.push('</span>');
    h.push('<span style="color: #C8C8C8; display: inline-block; width: 33%;">');
    h.push('● 灵活赎回');
    h.push('</span>');
    h.push('<span style="color: #C8C8C8; display: inline-block; width: 33%;">');
    h.push('● 立即到账');
    h.push('</span>');
    h.push('</p>');
    h.push('</div>');
    h.push('<img src="/css/img2.0/P-automatic.png">');
    h.push('<p class="a-deal" style="margin-top: 1.5rem; font-size: 1.04rem;color: #C8C8C8;">');
    h.push('<img style="width: 1.2rem; margin-right: .5rem;" src="/css/img2.0/checkbox2.jpg" alt="" />');
    h.push('<span style="width: 1.2rem;height: 1.2rem;border: 1px solid #ddd;display: none;vertical-align: middle;margin-right: .5rem;">');
    h.push('</span>');
    h.push('同意');
    h.push('<a style="color: #469AF3;" href="/Html/Product/contract/zzb-automatic-transfer.html">');
    h.push('《资金自动转入服务协议》');
    h.push('</a>');
    h.push('</p>');
    h.push('<p id="kaitong">');
    h.push('<button style="font-size: 1.623rem;color: #fff;border-radius: 5px;background-color: #B9B9B9;height: 4rem;width: 100%;margin-top: 2rem ;background-color:#CF3629;">');
    h.push('确认开通');
    h.push('</button>');
    h.push('</p>');
    h.push('<p id="bukaitong" style="font-size: 1.623rem;color: #CF3629;text-align: center;display: none;">');
    h.push('若要开启，请前往至尊宝');
    h.push('</p></div>');

    var html = $(h.join(''));
    html.find('.a-deal img').click(function() {
        html.find('.a-deal img').toggle();
        html.find('.a-deal span').css('display', 'inline-block');
        html.find("#kaitong").hide();
        html.find("#bukaitong").show();
    });
    html.find('.a-deal span').click(function() {
        html.find('.a-deal span').toggle();
        html.find('.a-deal img').css('display', 'inline-block');
        html.find("#kaitong").show();
        html.find("#bukaitong").hide();
    });
    html.find('#close').click(function() {
        html.remove();
    });

    html.find("#kaitong").click(function() {
        checkiswithholdauthoity(html);
    });

    $('body').append(html);
}
*/

var autoSwitchBalanceToDemand = function(html) {
    var url = "/StoreServices.svc/userservice/agreeautoswitchdemandprotocol";
    var paramter = {
        "autoswitchdemand": 1
    }
    $.AkmiiAjaxPost(url, paramter, false).then(function(data) {
        if (data.result) {
            window.location.replace("/html/my/");
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertNew(data.errormsg);
        }
    });
}


//检查新浪设置。
var checkiswithholdauthoity = function(html) {
    html.remove();
    if (account.customstatus < 3) {
        $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
        return;
    }
    //直连模式
    if (account.iswithholdauthoity == 0) //未设置新浪支付密码
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/html/my/index.html";
        $.SetSinaPayPassword(returnurl, accountResult.date, account.referralcode, account.iscashdesknewuser);
    } else if (account.iswithholdauthoity == 1) //未设置委托代扣
    {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/html/my/index.html";
        $.WithholdAuthority(returnurl, null, account.referralcode, true);
    } else {
        autoSwitchBalanceToDemand(html);
    }
}



var title = $.getQueryStringByName("title");
var amount = $.getQueryStringByName("amount");
var product = $.getQueryStringByName("product");
var status = $.getQueryStringByName("status");
var buybank = $.getQueryStringByName("buybank");
var profittime = $.getQueryStringByName("profittime");
var starttime = $.getQueryStringByName("starttime");
var paytype = $.getQueryStringByName("paytype");
var paymentdate = $.getQueryStringByName("paymentdate"); //到账时间
var today = $.getQueryStringByName("today");

var transferamount = $.getQueryStringByName("transferamount") || 0;

title = decodeURIComponent(title) || "";
product = decodeURIComponent(product) || "";
status = decodeURIComponent(status) || "";
buybank = decodeURIComponent(buybank) || "";
profittime = decodeURIComponent(profittime) || "";
starttime = decodeURIComponent(starttime) || "";
paytype = decodeURIComponent(paytype) || "";
paymentdate = decodeURIComponent(paymentdate) || "";
today = decodeURIComponent(today) || "";

profittime = profittime.replace(/-/g, "/");
starttime = starttime.replace(/-/g, "/");
paymentdate = paymentdate.replace(/-/g, "/");
today = today.replace(/-/g, "/");

//至尊宝赎回
var demandRedeem = function() {
    $("#demand-redeem-success").show();
    $("#demand-redeem-title-text").text(title);
    $("#demand-redeem-product-text").text(product);
    $("#demand-redeem-status-text").text(status);
    $("#demand-redeem-amount-text").text($.fmoney(amount));
    $("#demand-redeem-time-text").text((new Date(paymentdate)).Format("yyyy-MM-dd HH:mm"));
    $("#demand-redeem-product-name").text(title);
};
var fixedRedeem = function() {
    $("#demand-redeem-success").show();
    $("#demand-redeem-title-text").text(title);
    $("#demand-redeem-product-text").text(product);
    $("#demand-redeem-status-text").text(status);
    $("#demand-redeem-amount-text").text($.fmoney(amount));
    $("#demand-redeem-time-text").text((new Date(paymentdate)).Format("yyyy-MM-dd"));
    $("#demand-redeem-product-name").text(title);
};

// //至尊宝投资
// var buy = function () {
//     $("#buy-success").show();
//     $("#buy-title-text").text(product);
//     $("#buy-amount-text").text($.fmoney(amount));
//     $("#buy-bank-text").text(buybank);
//     $("#buy-time").text(new Date(profittime).Format("HH:mm"));
//     $("#buy-profit-time").text(new Date(profittime).Format("yyyy-MM-dd"));
// }

//至尊宝预约定期
var appoint = function() {
    $("#appoint-success").show();
    $("#appoint-product").text(product);
    $("#appoint-amount").text($.fmoney(amount));
    $("#appoint-starttime").text(new Date(starttime).Format("yyyy-MM-dd HH:mm"));
    $("#appoint-time2").text((new Date(today)).Format("HH:mm"));
    $("#appoint-profit-time").text(new Date(profittime).Format("yyyy-MM-dd"));
}

// //定期投资
// var fixedbuy = function () {
//     $("#fixedbuy-success").show();
//     $("#fixedbuy-product").text(product);
//     $("#fixedbuy-amount").text($.fmoney(amount));
//     $("#fixedbuy-paytype").text(buybank);
//     $("#fixedbuy-time").text((new Date(starttime)).Format("HH:mm"));
//     $("#fixedbuy-profit-time").text(new Date(profittime).Format("yyyy-MM-dd"));
// }

// //理财金投资
// var financialbuy = function () {
//     var date = new Date();
//     $("#financialdbuy-success").show();
//     $("#financialdbuy-amount").text($.fmoney(amount));
//     $("#financialdbuy-time").text(date.Format("HH:mm"));
//     $("#financialdbuy-profit-time").text(new Date(profittime).Format("MM-dd"));
// }

//转让成功
var producttransfer = function() {
    var date = new Date();
    $("#producttransfer-success").show();
    $("#producttransfer-title").text(title);
    $("#producttransfer-amount").text($.fmoney(transferamount));
}

// 周周僧+定期投资+理财金+至尊宝投资
var incrementalBuy = function() {
    $("#incremental-success").show();
    $("#incremental-product").text(product);
    $("#incremental-amount").text($.fmoney(amount));
    $("#incremental-paytype").text(buybank);
    // $("#incremental-time").text((new Date(starttime)).Format("HH:mm"));
    // $("#incremental-profit-time").text(new Date(profittime).Format("yyyy-MM-dd"));
}

//获取banner图
function GetBanner() {
    //头部banner图
    var data = {
        "type": "LucioBanner"
    };
    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/system/getbannerbytype", data, true).then(function(d) {
        if (d.result && d.appbanners.length > 0) {
            $("#activity-img").click(function() {
                window.location.href = d.appbanners[0].link;
            });
            $("#activity-img").attr({
                "data-src": d.appbanners[0].imageurl,
                "src": "/css/img2.0/loadbanner.gif"
            });
            $("#activity-img").removeClass("display-none");
            $._imgLoad($("#activity-img"), function(img) {
                $(img).attr("src", $(img).attr("data-src"));
            });

        }
    });
}

if (parseInt(fillsignday) > 0) {
    var _text = "已补签" + fillsignday + "天，1周满签，可抽取现金大奖哦";
    $.confirmF(_text, "取消", "去看看", null, function() {
        window.location.replace("/html/my/user-sign.html");
    });
}

//转让产品撤销成功
var transfertitle = decodeURI($.getQueryStringByName("transfertitle"));
var transferamount = $.getQueryStringByName("transferamount");

function transferwithdrawok() {
    $("#transferwithdrawok-success").show();
    $("#product-title").html(transfertitle);
    $("#transfer-amount").html($.fmoney(transferamount));
}