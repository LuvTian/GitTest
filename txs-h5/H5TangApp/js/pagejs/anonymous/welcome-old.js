/// <reference path="//_references.js" />

"use strict";
var $divbanner = $("#divbanner");//banner图 list
var orbitbullets = $(".orbit-bullets");
var $totalregisteredcount = $("#totalregisteredcount");//总注册人数
var $totalinvestamount = $("#totalinvestamount");//累计投资金额
var $ProductList = $("#ProductList");//产品列表
var homeDataresult;
var fixedrate;
var demandrate;
var yesterdayrate;
var increseRateCurrent = 0;
var increseNumberTimeout = null;
var increaseProfitCurrent = 0;
var incresesumamount = 0;
var ratemax = 0;
var ratemin = 0;
var fixedprofit;
var account = [];
var isOnline = false;
var islogin = false;
var isopeneyes = false;//小眼睛隐藏功能默认关闭
var storedata = [];
$(function () {
    //取经金币
    setTimeout(function () { $(".mymove2").removeClass("mymove2"); }, 3000);
    fixedRate();
    IsFollowWeChat();
    //用户信息
    userinfo();
    //用户等级
    //userlevel();
    //邀请码
    RecommendedCode();
    LoadHome();
    $(".tongji").click(function () {
        window.location.href = "/html/anonymous/rank.html";
    });
    islogin = !$.isNull($.getCookie("MadisonToken"));
    if (!islogin) {
        // 百度统计
        if (!$.isNull($.getQueryStringByName("c"))) {
            // 二维码扫描
            if ($.getQueryStringByName("sqy") == 1) {
                $.BaiduStatistics('Invite', 'QRcode', '扫描二维码邀请');
            } else {
                $.BaiduStatistics('Invite', 'Landing_refercode', '分享邀请');
            }
        }
        $("#nologin").show();
        //banner图片
        LoadBanner();
        $(".usercenter").attr("href", "/html/anonymous/login.html");
        $(".qujin-nav").attr("href", "/html/anonymous/login.html");
    }
    else {
        message();//公告
        $.getMitteilung($("#myicon"));
    }
});
var id;
function message() {
    var url = "/StoreServices.svc/user/announcementmessage";
    $.AkmiiAjaxPost(url, {}, true).then(function (d) {
        if (d.result) {
            if (d.status == 1) {
                id = d.id;
                $("#messagetitle").html(d.messagetitle);
                $("#MessageContent").html(d.messagecontent);
                $("#created").html(d.created);
                $("#announcementmessage").show();
                $("#mt").show();
            }
            else {
                $.alertF(d.ErrorMsg);
            }
        }
    });
}

$("#readmessage").click(function () {
    var url = "/StoreServices.svc/user/readannouncementmessage";
    var data = { id: id };
    $.AkmiiAjaxPost(url, data, true).then(function (d) {
        if (d.result) {
            $("#announcementmessage").hide();
            $("#mt").hide();
        }
        else {
            $.alertF(d.ErrorMsg);
        }
    });
});

//获取首页信息
var LoadHome = function () {
    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/system/gethomeresponseinfo", {}, true).then(function (d) {
        if (d.result) {
            //至尊宝加息标签
            if (d.interestrate != "" || d.interestrate != 0) {
                $('.demand-img_2').show().html($.formatInterest(d.interestrate));
                //$("#demand-img").show();
                //$("#demand-img").attr("src", "/css/img2.0/pre" + d.interestrate * 100 + ".png");
            }
            $totalinvestamount.html(CalculationMoney(d.cumulativeinvestmentamount));
            $totalregisteredcount.html(CalculationPeople(d.registeredusernumber));
            homeDataresult = d;
            mapProductlist();
        }
    });
}

var mapProductlist = function () {
    $ProductList.empty();
    var productlist = homeDataresult.recommandproductlist;
    if (productlist) {
        $.each(productlist, function (index, entry) {
            if (entry.type == 1) {
                $("#demand-rate-nologin,#demand-rate-noinvert,#demand-rate").html($.fmoney(entry.rate) + "%");
            }
        });
    }
};

//未登录的model（作废）
var GetAnonymousProductModelHtml = function (obj) {

    $("#nologin").show();

    //活动显示
    if (obj.type == 1 && !$.isNull(obj.description)) {
        //活期活动暂时隐藏*1
        //$("#description").append(obj.description).css("display", "block");
    }
    if (obj.type == 99) {
        $("#newuserhtml").show();
    }
    //获取活期的收益率
    if (obj.type == 1) {
        $(".demandrate").html($.fmoney(obj.rate));
    }

    //最小最大收益率一样时
    if (ratemin == ratemax) {
        $(".maxminhtml").hide();
        $(".minhtml").show();
        //定期收益率
        $(".fixedratemin").html(ratemin);
    }
    else {
        //定期收益率
        $(".fixedratemin").html(ratemin);
        $(".fixedratemax").html(ratemax);
    }
}

//已登录的model（作废）
var GetProductModelHtml = function (obj, index) {
    //未登录模块隐藏
    $("#nologin").hide();
    $("#loginlist").show();

    //已登录显示
    //活动显示
    if (obj.type == 1 && !$.isNull(obj.description)) {
        //活期活动暂时隐藏*2
        //$("#actitydescription").html(obj.description).show();
        //$("#actityicon").show();
    }
    if (obj.type == 1) {
        $(".demandrate").html($.fmoney(obj.rate));
    }
    if (obj.type == 99 && obj.newuser) {
        //新用户专享
        $("#newuser").css("display", "block");
    }

    //活期收益率
    $(".demandrate").html(demandrate);
    //最小最大收益率一样时
    if (ratemin == ratemax) {
        $(".maxminhtml").hide();
        $(".minhtml").show();
        //定期收益率
        $(".fixedratemin").html(ratemin);
    }
    else {
        //定期收益率
        $(".fixedratemin").html(ratemin);
        $(".fixedratemax").html(ratemax);
    }


}


//获取定期最小最大收益率以及昨日收益
function fixedRate() {
    //获取定期最小最大收益率以及昨日收益
    var url = "/StoreServices.svc/user/productratemaxmin";
    $.AkmiiAjaxPost(url, {}, true).then(function (d) {
        if (d.result) {
            ratemin = $.fmoney(d.productratemin);
            ratemax = $.fmoney(d.productratemax);
            if (ratemin == ratemax) {
                $("#fixed-rate-nologin,#fixed-rate,#fixed-rate-noinvert").html(ratemin + "%");
            }
            else {
                $("#fixed-rate-nologin,#fixed-rate,#fixed-rate-noinvert").html(ratemin + "%~" + ratemax + "%");
            }
        }
    });
}

//获取用户账户信息
function userinfo() {
    var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            $("#is-login").show();
            account = data.accountinfo;

            $(".fixedratemin").html(ratemin);
            $(".fixedratemax").html(ratemax);
            //签到链接
            $(".qian").attr("href", "/Html/My/user-sign.html?referralcode=" + account.referralcode);
            //昨日收益
            var yesterdayprofit = account.yesterdaysumprofit;
            increaseProfitCurrent = yesterdayprofit * 100 > 150 ? (yesterdayprofit * 100 - 150) : 0;
            //总资产
            var sumamout = account.summoney;
            incresesumamount = sumamout * 100 > 150 ? (sumamout * 100 - 150) : 0;
            // $("#sumamout").attr("data-to", sumamout);
            //昨日收益率
            account.yesterdaybalance = account.yesterdaybalance == 0 ? 1 : account.yesterdaybalance;
            yesterdayrate = (account.yesterdaysumprofitrate * 10000).toFixed(0);
            increseRateCurrent = yesterdayrate > 150 ? (yesterdayrate - 150) : 0;

            //在投总金额
            $("#sumbalance").html($.fmoney(account.sumbalance));

            //活期收益信息
            var demandbalance_freeze = parseFloat(account.demandbalance) + parseFloat(account.freezeamount);
            if (demandbalance_freeze != 0 || account.demandyesterdayprofit != 0) {
                $("#demandlist").show();
                $("#demand-balance").html($.fmoney(demandbalance_freeze));
                $("#demand-profit").html("+" + $.fmoney(account.demandyesterdayprofit));
            }
            else if (account.demandbalance == 0 && account.demandyesterdayprofit == 0) {
                //未投资显示
                $("#nodemandlist").show();
            }
            //定期收益信息
            if (account.fixedbalance != 0 || account.fixedyesterdayprofit != 0) {
                $("#fixedlist").show();
                $("#fixed-balance").html($.fmoney(account.fixedbalance));
                $("#fixed-yesterday-profit").html("+" + $.fmoney(account.fixedyesterdayprofit));
            }
            else if (account.fixedbalance == 0 && account.fixedyesterdayprofit == 0) {
                //未投资显示
                $("#nofixedlist").show();
            }
            //系统维护
            if (account.ismaintenance) {
                $("#no-income").removeClass("display-none").find("span").text("客官别急");
            }
            else {
                increseNumbers((yesterdayrate), parseInt(Number(yesterdayprofit * 100).toFixed(0)), Number(sumamout) * 100);
                //定期和活期都没有收益
                if (account.demandyesterdayprofit == 0 && account.platformaward == 0 && account.fixedyesterdayprofit == 0) {
                    //显示暂无收益
                    $("#no-income").removeClass("display-none");
                }
                else {
                    //昨日收益
                    $("#no-income").addClass("display-none");
                    $("#yesterday-income").removeClass("display-none");
                }
            }
            var storeType = "1,2";
            if (storeType.indexOf(account.storetype) >= 0) {
                loadCompanyMsg();
            }
            if ($.getLS('isopeneyes_' + account.referralcode)) {
                loadeyes();
            }
            //判断用户是否有升级过
            if (account.customstatus == 3 && account.iswithholdauthoity == 0) {
                //showASinaUpgrade(data.date, account.referralcode);
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin;
                $.showActiveSinaAccount(returnurl, data.date, account.referralcode, account.iscashdesknewuser);
            }
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $(".usercenter").attr("href", "/html/anonymous/login.html");
            $(".qujin-nav").attr("href", "/html/anonymous/login.html");
        }
    });
}

/*活动banner*/
var LoadBanner = function () {
    var data = { "type": "LoginBanner" };
    $.AkmiiAjaxPost("/StoreServices.svc/anonymous/system/getbannerbytype", data, true).then(function (d) {
        $.preloaderFadeOut();
        if (d.result) {
            if (d.appbanners.length > 0) {
                var ha = [];
                var hao = [];
                $.each(d.appbanners, function (i, item) {
                    var className = i == 0 ? "class=\"active\"" : "";
                    ha.push("<li " + className + " onclick=\"javascript:window.location.href='" + item.link + "'\">");
                    ha.push("<img data-src=\"" + item.imageurl + "\" src=\"/css/img2.0/imgload-index.gif\" /></li>");
                    hao.push("<li " + className + " data-orbit-slide=\"" + i + "\"></li>");
                });
                $("#divbanner").empty().html(ha.join(''));
                $(".orbit-bullets").empty().html(hao.join(''));
                $._imgLoad($("#divbanner").find("img"), function (img) {
                    $(img).attr("src", $(img).attr("data-src"));
                });
                $(document).foundation({
                    orbit: {
                        animation: 'slide',
                        pause_on_hover: false,
                        animation_speed: 5,
                        navigation_arrows: true,
                        bullets: false
                    }
                });
            }
        }
    }, function () { $.preloaderFadeOut(); });
}


//用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
var levelArry = [{
    level: '0',
    count: 8,
    icon: 'v1.png',
    rate: '0%'
}, {
    level: '1',
    count: 20,
    icon: 'v2.png',
    rate: '0.2%'
}, {
    level: '2',
    count: 35,
    icon: 'v3.png',
    rate: '0.3%'
}, {
    level: '3',
    count: 0,
    icon: 'v4.png',
    rate: '0.5%'
}];

//用户等级显示
var userlevel = function () {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var list = data.data;
            var icon = levelArry[0].icon;
            $.each(levelArry, function (i, item) {
                if (list.currentlevel == item.level) {
                    icon = item.icon;
                    return;
                }
            });
            $(".img-responsive").attr("src", "/css/img2.0/" + icon);
        }
    });
}

//计算投资金额
var CalculationMoney = function (number) {
    if ($.isNumeric(number)) {
        var str = number.toString();
        var resultHtml = [];
        if (number < 10000) {
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
        }
        else if (number < 100000000) {
            str = str.substr(0, str.length - 4);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("万");
        }
        else {
            str = str.substr(0, str.length - 8);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("亿");
            str = number.toString();
            str = str.substring(str.length - 8, str.length - 4);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("万");
        }
        return (resultHtml.join(''));
    }
};

//计算注册人数
var CalculationPeople = function (number) {
    if ($.isNumeric(number)) {
        var str = number.toString();
        var resultHtml = [];
        if (str.length > 8) {
            str = str.substr(0, str.length - 8);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("亿");
        }
        if (number.toString().length > 4) {
            str = number.toString();
            str = str.substring(str.length - 8, str.length - 4);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("万");
        }
        str = number.toString();
        str = str.substring(str.length - 4, str.length);
        for (var i = 0; i < str.length ; i++) {
            resultHtml.push("<span>" + str.charAt(i) + "</span> ");
        }
        resultHtml.push("人");
        return (resultHtml.join(''));
    }
};

//邀请码
var RecommendedCode = function () {
    var RecommendedCode = $.getQueryStringByName("c");
    if (!$.isNull(RecommendedCode)) {
        $.setCookie("RecommendedCode", RecommendedCode);
    }
};

var IsFollowWeChat = function () {
    //var followstr = $.getCookie("isFollowWeChat");
    ////$.setCookie("RecommendedCode", RecommendedCode);
    //if ($.getCookie("MadisonToken") != "" && (followstr == "" || followstr == "0" || followstr == "-1")) {
    //    //if ($.is_weixn()) { }
    //    $.alertF("<img src='/css/img2.0/txsfollow.jpg' />识别或保存二维码关注唐小僧", null, function () {
    //        $.setCookie("isFollowWeChat", "2", (1 * 24 * 60));
    //        $(".az-showmasker-Text").css("top", "30%");
    //    });
    //    $(".az-showmasker-Text").css("top", "10%");
    //}
};

function increseNumbers(rate, profit, amount) {
    if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
        $("#count-number").text("*****");//昨日收益
        $("#sumamout").text("*****");//总资产
        $("#yesterdayrate").text("*****");//昨日收益率
    }
    else {
        var require = false;
        if (increseNumberTimeout)
            clearTimeout(increseNumberTimeout);

        if (increseRateCurrent < rate) {
            require = true;
            increseRateCurrent = increseRateCurrent + 1;
            $("#yesterdayrate").text($.fmoney(increseRateCurrent / 100) + "%");
        }
        else {
            $("#yesterdayrate").text($.fmoney(increseRateCurrent / 100) + "%");
        }
        if (increaseProfitCurrent < profit) {
            require = true;
            increaseProfitCurrent = increaseProfitCurrent + 1;
            $("#count-number").text("+" + $.fmoney(increaseProfitCurrent / 100, 2));
        }
        if (incresesumamount < amount) {
            require = true;
            incresesumamount = incresesumamount + 1;
            $("#sumamout").text($.fmoney(incresesumamount / 100, 2));
        }

        if (require) {
            increseNumberTimeout = setTimeout(function () { increseNumbers(rate, profit, amount); }, 10);
        }
    }

}

function formatRate(s) {
    if (s == 0)
        return 0;
    if ((s + "").length < 3) {
        s = "0" + s;
    }
    var str = s + '';
    var l = str.length;
    return str.substr(0, l - 2) + '.' + str.substr(l - 2);
}

//当是商户时显示此信息
var loadCompanyMsg = function () {
    var url = "/StoreServices.svc/store/getbusinesscenterinfo";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            storedata = data;
            if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
                $("#stroeTotoalProfit").text("*****");//商户账户
                $("#storeYesterdayProfit").text("*****");//商户昨日收益
            }
            else {
                $("#stroeTotoalProfit").text($.fmoney(data.totalprofit));
                $("#storeYesterdayProfit").text($.fmoney(data.yesterdayprofit));
            }

            $("#storeInfo").show().click(function () {
                if (data.status == "6") {
                    $.alertF("管理员变更中，不可访问");
                } else {
                    window.location.href = "/html/store/company4.html";
                }
            });
        }
    });
}

//隐藏资金功能
$("#eyes").click(function () {
    eyes();
});


//判断隐藏资金是否开启
function eyes() {
    var eyessrc = $("#eyes").attr("src");
    if (eyessrc == "/css/img2.0/isopeneye.png") {
        updateprofit();
        $("#eyes").attr("src", "/css/img2.0/iscloseeye.png");
        isopeneyes = true;//隐藏功能开启
        $.setLS('isopeneyes_' + account.referralcode, null);//清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes);//存进cookie
    }
    else {
        profitdisplay();
        $("#eyes").attr("src", "/css/img2.0/isopeneye.png");
        isopeneyes = false;//隐藏功能关闭
        $.setLS('isopeneyes_' + account.referralcode, null);//清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes);//存进cookie

    }
}


//判断隐藏资金是否开启
function loadeyes() {
    if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
        $("#eyes").attr("src", "/css/img2.0/iscloseeye.png");
        updateprofit();
    }
    else {
        $("#eyes").attr("src", "/css/img2.0/isopeneye.png");
        profitdisplay();
    }
}

//收益变为*
function updateprofit() {
    var demandbalance_freeze = parseFloat(account.demandbalance) + parseFloat(account.freezeamount);//至尊宝投资金额
    $("#count-number").text("*****");//昨日收益
    $("#sumamout").text("*****");//总资产
    $("#yesterdayrate").text("*****");//昨日收益率
    $("#sumbalance").text("*****");//投资金额
    $("#demand-profit").text("*****");//至尊宝收益
    $("#fixed-yesterday-profit").text("*****");//定期收益
    $("#stroeTotoalProfit").text("*****");//商户账户
    $("#storeYesterdayProfit").text("*****");//商户昨日收益
    if (demandbalance_freeze != 0) {
        $("#demand-balance").text("*****");//至尊宝投资金额
    }
    if (account.fixedbalance != 0) {
        $("#fixed-balance").text("*****");//定期投资金额
    }
}

//收益变为原本收益
function profitdisplay() {
    var demandbalance_freeze = parseFloat(account.demandbalance) + parseFloat(account.freezeamount);//至尊宝投资金额
    $("#count-number").text("+" + $.fmoney(account.yesterdaysumprofit));//昨日收益
    $("#sumamout").text($.fmoney(account.summoney));//总资产
    $("#yesterdayrate").text($.fmoney(yesterdayrate / 100) + "%");//昨日收益率
    $("#sumbalance").text($.fmoney(account.sumbalance));//投资金额
    $("#demand-profit").text("+" + $.fmoney(account.demandyesterdayprofit));//至尊宝收益
    $("#fixed-yesterday-profit").text("+" + $.fmoney(account.fixedyesterdayprofit));//定期收益
    $("#stroeTotoalProfit").text($.fmoney(storedata.totalprofit));//商户账户
    $("#storeYesterdayProfit").text($.fmoney(storedata.yesterdayprofit));//商户昨日收益
    if (demandbalance_freeze != 0) {
        $("#demand-balance").text($.fmoney(demandbalance_freeze));//至尊宝投资金额
    }
    if (account.fixedbalance != 0) {
        $("#fixed-balance").text($.fmoney(account.fixedbalance));//定期投资金额
    }
}

////存钱罐账户升级提示
//var showASinaUpgrade = function (date, key) {
//    key = key + "showasinaupgradedate";
//    date = date.substring(0, 10);
//    var showasinaupgradedate = localStorage.getItem(key);
//    if (showasinaupgradedate == date) {
//        return;
//    }
//    var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin;
//    $.GetsinaAlertMessagesByType(4, function (item) {
//        var h = [];
//        h.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');

//        h.push('<div style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;">');
//        h.push('<h1 style="font-size: 1.8rem;padding:1rem;">' + item.title + '</h1>');
//        h.push('<h3 style="font-size:1.4rem;text-align:left;padding:.5rem 1rem;">' + item.contents[0].title + '</h3>');
//        h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0rem 1rem;color:#979797;">' + item.contents[0].contents[0] + '</p>');
//        h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0rem 1rem;color:#979797;">' + item.contents[0].contents[1] + '</p>');
//        h.push('<h3 style="font-size:1.4rem;text-align:left;padding:.5rem 1rem;">' + item.contents[1].title + '</h3>');
//        h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;">' + item.contents[1].contents[0] + '</p>');
//        h.push('<p style="text-align: left;font-size: 1rem;padding:.5rem 1rem;color:#979797;">' + item.contents[2].contents[0].replace(item.contents[2].linktitle[0], "") + '<a href="' + item.contents[2].linkurl[0] + '" style="color:#65A8F3;">' + item.contents[2].linktitle[0] + '</a></p>');
//        h.push('<div style="width:100%;height:1px;background:#ccc;margin-top:1rem"></div>');
//        h.push('<a id="gotosetting" href="javascript:void(0);" style="color:#c54846;font-size: 1.6rem;line-height:3;">' + item.btn1 + '</a>');
//        h.push('</div>');

//        var html = $(h.join(''));
//        html.find("#gotosetting").click(function () {
//            localStorage.setItem(key, date);
//            html.remove();
//            $.sinarequest(20, false, returnurl);
//        });
//        $("body").append(html);
//    });
//}