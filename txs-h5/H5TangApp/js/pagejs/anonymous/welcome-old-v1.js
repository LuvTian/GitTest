"use strict";
//var $divbanner = $("#divbanner");//banner图 list
// var orbitbullets = $(".orbit-bullets");
// var $totalregisteredcount = $("#totalregisteredcount");//总注册人数
// var $totalinvestamount = $("#totalinvestamount");//累计投资金额
//var $ProductList = $("#ProductList");//产品列表
var homeDataresult;
var fixedrate;
var demandrate;
var yesterdayrate;
// var increseRateCurrent = 0;
// var increseNumberTimeout = null;
// var increaseProfitCurrent = 0;
// var incresesumamount = 0;
// var ratemax = 0;
// var ratemin = 0;
var fixedprofit;
var account = [];
var isOnline = false;
var islogin = false;
var isopeneyes = false;//小眼睛隐藏功能默认关闭
var storedata = [];
var id;
// -----------------banner---------------
var flipsnap;
var intTimer = null;
var $hdpointer = $(".headbnitem");
var $btmpointer = $(".headspitem");

// // 新增
// var IndexView = {
//     scbSevenRate: function () {

//     }
// }
$(function () {
    footerBar.highlight(1);
    //取经金币
    //setTimeout(function () { $(".mymove2").removeClass("mymove2"); }, 3000);
    // $(".tongji").click(function () {
    //     window.location.href = "/html/anonymous/rank.html";
    // });
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
        $(".headbn").show();
        //banner图片
        LoadBanner();
        //$(".usercenter").attr("href", "/html/anonymous/login.html");
        //$(".qujin-nav").attr("href", "/html/anonymous/login.html");
    }
    else {
        //用户信息
        userinfo();
        dqitemHand();
        message();//公告
        // $(".wel_dq").show();
        // $(".wel_more").hide();
        //$.getMitteilung();
    }
    fixedRate();
    //IsFollowWeChat();
    //用户等级
    //userlevel();
    //邀请码
    RecommendedCode();
    LoadHome();
});

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
                //$('.demand-img_2').show().html($.formatInterest(d.interestrate));
                //$("#demand-img").show();
                //$("#demand-img").attr("src", "/css/img2.0/pre" + d.interestrate * 100 + ".png");
            }
            //$totalinvestamount.html(CalculationMoney(d.cumulativeinvestmentamount));
            //$totalregisteredcount.html(CalculationPeople(d.registeredusernumber));
            homeDataresult = d;
            mapProductlist();
            // 僧财宝七日年化
            //$(".wel_rate_scb").html($.fmoney(d.cqgrate) + "%");
        }
    });
}

var mapProductlist = function () {
    //$ProductList.empty();
    var productlist = homeDataresult.recommandproductlist;
    if (productlist) {
        $.each(productlist, function (index, entry) {
            // 至尊宝利率
            if (entry.type == 1) {
                $(".wel_nzzb_rate").html($.fmoney(entry.rate) + "%");
            }
            if (entry.type == 99) {
                $(".wel_dq").data("href", "/html/product/productfixedlist_new.html?detailtype=99&productdurationmax=0&productdurationmin=0&detailname={0}&ratedesc=期望年化收益率&durationdesc=投资期限".replace("{0}", entry.title));
                $(".wel_ndq_nopay").find(".wel_ititle").html(entry.title);
                $(".wel_ndq_rate").html($.fmoney(entry.rate) + "%");
                $(".wel_duration").html(entry.duration);
            }
        });
    }
};

// 定期显示逻辑处理
var dqitemHand = function () {
    $(".wel_login").show();
    // 定期的dom
    $(".wel_ndq_nopay").hide();
    $(".wel_ndq_rate").hide();
    $(".wel_ndq_tips").hide();
    $(".wel_dq").find(".w_hide").removeClass("w_hide");
    $(".wel_ndq_pay").show();
    $(".wel_ndq_payed").show();

    // 周周僧的dom
    $(".wel_nzzs_rate").hide();
    $(".wel_nzzs_tips").hide();
    $(".wel_dh").addClass("wel_sarrow").data("href", "/html/my/my-incremental-detail.html");
    $(".wel_nzzs_payed").show();
    $(".wel_dh").find(".w_hide").removeClass("w_hide");
};

// //未登录的model（作废）
// var GetAnonymousProductModelHtml = function (obj) {

//     $("#nologin").show();

//     //活动显示
//     if (obj.type == 1 && !$.isNull(obj.description)) {
//         //活期活动暂时隐藏*1
//         //$("#description").append(obj.description).css("display", "block");
//     }
//     if (obj.type == 99) {
//         $("#newuserhtml").show();
//     }
//     //获取活期的收益率
//     if (obj.type == 1) {
//         $(".demandrate").html($.fmoney(obj.rate));
//     }

//     //最小最大收益率一样时
//     if (ratemin == ratemax) {
//         $(".maxminhtml").hide();
//         $(".minhtml").show();
//         //定期收益率
//         $(".fixedratemin").html(ratemin);
//     }
//     else {
//         //定期收益率
//         $(".fixedratemin").html(ratemin);
//         $(".fixedratemax").html(ratemax);
//     }
// }

// //已登录的model（作废）
// var GetProductModelHtml = function (obj, index) {
//     //未登录模块隐藏
//     $("#nologin").hide();
//     $("#loginlist").show();

//     //已登录显示
//     //活动显示
//     if (obj.type == 1 && !$.isNull(obj.description)) {
//         //活期活动暂时隐藏*2
//         //$("#actitydescription").html(obj.description).show();
//         //$("#actityicon").show();
//     }
//     if (obj.type == 1) {
//         $(".demandrate").html($.fmoney(obj.rate));
//     }
//     if (obj.type == 99 && obj.newuser) {
//         //新用户专享
//         $("#newuser").css("display", "block");
//     }

//     //活期收益率
//     $(".demandrate").html(demandrate);
//     //最小最大收益率一样时
//     if (ratemin == ratemax) {
//         $(".maxminhtml").hide();
//         $(".minhtml").show();
//         //定期收益率
//         $(".fixedratemin").html(ratemin);
//     }
//     else {
//         //定期收益率
//         $(".fixedratemin").html(ratemin);
//         $(".fixedratemax").html(ratemax);
//     }


// }


//获取定期最小最大收益率以及昨日收益
function fixedRate() {
    var zzsmax = 0, zzsmin = 0;
    //获取定期最小最大收益率以及昨日收益
    var url = "/StoreServices.svc/user/productratemaxmin";
    $.AkmiiAjaxPost(url, {}, true).then(function (d) {
        if (d.result) {
            // ratemin = $.fmoney(d.productratemin);
            // ratemax = $.fmoney(d.productratemax);

            zzsmax = $.fmoney(d.productladderratemax);
            zzsmin = $.fmoney(d.productladderratemin);
            // if (ratemin == ratemax) {
            //     $(".wel_rate_dq").html(ratemin + "%");
            // }
            // else {
            //     $(".wel_rate_dq").html(ratemin + "%~" + ratemax + "%");
            // }
            //  如果没有登录
            if (!islogin) {
                if (zzsmax == zzsmin) {
                    $(".wel_nzzs_rate").html(zzsmin + "%");
                } else {
                    $(".wel_nzzs_rate").html("{0}~{1}%".replace("{0}", zzsmin).replace("{1}", zzsmax));
                }
            }
            // 如果周周僧的title为空
            // 只是一个暂时的解决方案
            // 后面会传一个字段
            if (!d.laddertitle) {
                $(".wel_nli").eq(0).hide();
            } else {
                $(".wel_nzzs").find(".wel_ititle").html(d.laddertitle);
            }
            //  else {
            //     $(".wel_nzzs_payed").html($.fmoney(account.demandfixedtwochangebalance || 0));
            //     $(".wel_tmr_nzzs").html($.fmoney(account.demandfixedtwochangeyesterdayprofit || 0));
            // }
            // // 周周升
            // if (d.investladder) {
            //     // $(".wel_zzs").data("href", "/Html/My/my-jiejieseng-detail.html?detailname=周周僧");
            //     // $(".wel_zzs").find(".wel_login").show();
            //     // $(".wel_zzs").find(".wel_nologin").hide();
            //     // $(".wel_zzs").find(".wel_nomoney").hide();
            //     // $(".wel_tmr_zzs").html($.fmoney(account.demandfixedtwochangebalance));
            //     // $(".wel_tmr_zzsadd").html("+" + $.fmoney(account.demandfixedtwochangeyesterdayprofit));
            // }
        }
    });
}

//获取用户账户信息
function userinfo() {
    var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
    // $("#all-body-div-status").show();
    // $("#all-body-div-preloader").show();
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            $(".wel_head_login").show();
            // $(".wel_login").show();
            // $("#all-body-div-status").fadeOut();
            // $("#all-body-div-preloader").delay(300).fadeOut("slow");
            account = data.accountinfo;

            // $(".fixedratemin").html(ratemin);
            // $(".fixedratemax").html(ratemax);
            //签到链接
            $(".wel_head_qd").data("href", "/html/my/user-sign.html?referralcode=" + account.referralcode);
            $(".wel_head_yq").data("href", "/html/my/qujin.html");
            // Html/My/qujin.html
            //昨日收益
            var yesterdayprofit = account.yesterdaysumprofit;
            //increaseProfitCurrent = yesterdayprofit * 100 > 150 ? (yesterdayprofit * 100 - 150) : 0;
            //总资产
            var sumamout = account.summoney;
            //incresesumamount = sumamout * 100 > 150 ? (sumamout * 100 - 150) : 0;
            // $("#sumamout").attr("data-to", sumamout);
            //昨日收益率
            account.yesterdaybalance = account.yesterdaybalance == 0 ? 1 : account.yesterdaybalance;
            yesterdayrate = (account.yesterdaysumprofitrate * 10000).toFixed(0);
            //increseRateCurrent = yesterdayrate > 150 ? (yesterdayrate - 150) : 0;

            //在投总金额
            $(".wel_inve_span").html($.fmoney(account.sumbalance));
            $(".wel_ndq_sp").html(account.activefixedcount);
            //活期收益信息
            var demandbalance_freeze = parseFloat(account.demandbalance) + parseFloat(account.freezeamount);
            if (demandbalance_freeze != 0 || account.demandyesterdayprofit != 0) {
                $(".wel_nzzb_rate").hide();
                $(".wel_nzzb_payed").show().html($.fmoney(demandbalance_freeze));
                $(".wel_nzzb_tips").hide();
                $(".wel_hq").find(".w_hide").removeClass("w_hide");
                $(".wel_tmr_nzzb").html($.fmoney(account.demandyesterdayprofit));
                // $(".wel_zzb").find(".wel_login").show();
                // $(".wel_zzb").find(".wel_nologin").hide();
                // $(".wel_zzb").find(".wel_nomoney").hide();
                // $(".wel_tmr_zzb").html($.fmoney(demandbalance_freeze));
                // $(".wel_tmr_zzbadd").html("+" + $.fmoney(account.demandyesterdayprofit));
            }
            else if (account.demandbalance == 0 && account.demandyesterdayprofit == 0) {
                //未投资显示
                //$("#nodemandlist").show();
            }
            // 周周升
            if (!(account.demandfixedtwochangebalance == 0 && account.demandfixedtwochangeyesterdayprofit == 0)) {
                // $(".wel_tmr_zzs").html($.fmoney(account.demandfixedtwochangebalance));
                // $(".wel_tmr_zzsadd").html("+" + $.fmoney(account.demandfixedtwochangeyesterdayprofit));
                $(".wel_nzzs_payed").html($.fmoney(account.demandfixedtwochangebalance || 0));
                $(".wel_tmr_nzzs").html($.fmoney(account.demandfixedtwochangeyesterdayprofit || 0));
            }
            //定期收益信息
            if (account.fixedbalance != 0 || account.fixedyesterdayprofit != 0) {
                // $("#fixedlist").show();
                $(".wel_dq").data("href", "/html/my/my-regular-index.html");
                $(".wel_dq").find(".wel_login").show();
                $(".wel_dq").find(".wel_nologin").hide();
                $(".wel_dq").find(".wel_nomoney").hide();
                $(".wel_ndq_payed").html($.fmoney(account.fixedbalance));
                $(".wel_tmr_ndq").html("+" + $.fmoney(account.fixedyesterdayprofit));
            }
            // 僧财宝处理逻辑
            // 如果已经签订了僧财宝协议
            // if (account.issignmoneyboxandhtffund) {
            //     // 如果账户余额大于0的，算是已经投资了
            //     if (account.basicbalance > 0) {
            //         $(".wel_scb").find(".wel_login").show();
            //         $(".wel_scb").find(".wel_nologin").hide();
            //         $(".wel_scb").find(".wel_nomoney").hide();
            //         $(".wel_tmr_scb").html($.fmoney(account.basicbalance));
            //         $(".wel_tmr_scbadd").html("+" + $.fmoney(account.monkyesterdayprofit));
            //     }
            // } else {
            //     var uuid = account.referralcode + "";
            //     // 如果点击了弹框的x按钮表示不同意
            //     if ($.getscbSigned(uuid) == 0) {
            //         $(".wel_scb_sign").html("未开通");
            //     } else if (!$.getscbSigned(uuid)) { // 还没有弹出协议框
            //         $.scgSignAlert(uuid, true, function () {
            //             window.location.reload();
            //         }, function () {
            //             window.location.reload();
            //         });
            //     }
            // }
            // else if (account.fixedbalance == 0 && account.fixedyesterdayprofit == 0) {
            //     //未投资显示
            //     $("#nofixedlist").show();
            // }
            //系统维护
            if (account.ismaintenance) {
                $(".wel_head_money").text("客官别急");
            }
            else {
                increseNumbers(yesterdayrate, parseInt(Number(yesterdayprofit * 100).toFixed(0)), Number(sumamout) * 100);
                //定期和活期都没有收益
                // if (account.demandyesterdayprofit == 0 && account.platformaward == 0 && account.fixedyesterdayprofit == 0) {
                //     //显示暂无收益
                //     //$("#no-income").removeClass("display-none");
                // }
                // else {
                //     //昨日收益
                //     //$("#no-income").addClass("display-none");
                //     $("#yesterday-income").removeClass("display-none");
                // }
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
                $.showActiveSinaAccount(returnurl, data.date, account.referralcode, account.iscashdesknewuser, true);
            }
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $(".wel_login").hide();
            // $(".usercenter").attr("href", "/html/anonymous/login.html");
            // $(".qujin-nav").attr("href", "/html/anonymous/login.html");
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
                // var ha = [];
                // var hao = [];
                // $.each(d.appbanners, function (i, item) {
                //     var className = i == 0 ? "class=\"active\"" : "";
                //     ha.push("<li " + className + " onclick=\"javascript:window.location.href='" + item.link + "'\">");
                //     ha.push("<img data-src=\"" + item.imageurl + "\" src=\"/css/img2.0/imgload-index.gif\" /></li>");
                //     hao.push("<li " + className + " data-orbit-slide=\"" + i + "\"></li>");
                // });
                // $("#divbanner").empty().html(ha.join(''));
                // $(".orbit-bullets").empty().html(hao.join(''));
                // $._imgLoad($("#divbanner").find("img"), function (img) {
                //     $(img).attr("src", $(img).attr("data-src"));
                // });
                var width = $("body").width();
                var $li = $("#litpl").html();
                var $item = $("#itemtpl").html();
                var listr = [], itemstr = [];
                var setAnimate = function () {
                    // 两张才进行轮播
                    if (d.appbanners.length > 1) {
                        intTimer = setInterval(function () {
                            if (flipsnap.currentPoint == $btmpointer.size() - 1) {
                                flipsnap.moveToPoint(0);
                            } else {
                                flipsnap.toNext();
                            }
                        }, 5000);
                    }
                };
                $.each(d.appbanners, function (i, item) {
                    var href = "window.location.href='{0}'".replace("{0}", item.link) || "";
                    listr.push($li.replace("{0}", href).replace("{1}", item.imageurl));
                    itemstr.push($item.replace("{0}", (i == 0 ? "cur" : "")));
                });

                $(".headbnlist").html(listr.join(""));
                d.appbanners.length > 1 && $(".headsp").show().html(itemstr.join(""));

                $._imgLoad($(".headbnlist").find("img"), function (img) {
                    $(img).attr("src", $(img).data("src"));
                });

                $hdpointer = $(".headbnitem");
                $btmpointer = $(".headspitem");

                $hdpointer.width(width);
                $(".headbnlist").width(width * ($hdpointer.size() || 1));
                flipsnap = Flipsnap(".headbnlist", {
                    distance: width
                });
                flipsnap.element.addEventListener("fspointmove", function () {
                    $btmpointer.filter(".cur").removeClass("cur");
                    $btmpointer.eq(flipsnap.currentPoint).addClass("cur");
                }, false);
                flipsnap.element.addEventListener('fstouchstart', function (ev) {
                    clearInterval(intTimer);
                }, false);
                flipsnap.element.addEventListener('fstouchend', function (ev) {
                    setAnimate();
                }, false);

                setAnimate();
                // $(document).foundation({
                //     orbit: {
                //         animation: 'slide',
                //         pause_on_hover: false,
                //         animation_speed: 5,
                //         navigation_arrows: true,
                //         bullets: false
                //     }
                // });
            }
        }
    }, function () { $.preloaderFadeOut(); });
}


// //用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
// var levelArry = [{
//     level: '0',
//     count: 8,
//     icon: 'v1.png',
//     rate: '0%'
// }, {
//     level: '1',
//     count: 20,
//     icon: 'v2.png',
//     rate: '0.2%'
// }, {
//     level: '2',
//     count: 35,
//     icon: 'v3.png',
//     rate: '0.3%'
// }, {
//     level: '3',
//     count: 0,
//     icon: 'v4.png',
//     rate: '0.5%'
// }];

// //用户等级显示
// var userlevel = function () {
//     var url = "/StoreServices.svc/Activity/getaccountlevel";
//     $.AkmiiAjaxPost(url, {}, true).then(function (data) {
//         if (data.result) {
//             var list = data.data;
//             var icon = levelArry[0].icon;
//             $.each(levelArry, function (i, item) {
//                 if (list.currentlevel == item.level) {
//                     icon = item.icon;
//                     return;
//                 }
//             });
//             $(".img-responsive").attr("src", "/css/img2.0/" + icon);
//         }
//     });
// }

// //计算投资金额
// var CalculationMoney = function (number) {
//     if ($.isNumeric(number)) {
//         var str = number.toString();
//         var resultHtml = [];
//         if (number < 10000) {
//             for (var i = 0; i < str.length; i++) {
//                 resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//             }
//         }
//         else if (number < 100000000) {
//             str = str.substr(0, str.length - 4);
//             for (var i = 0; i < str.length; i++) {
//                 resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//             }
//             resultHtml.push("万");
//         }
//         else {
//             str = str.substr(0, str.length - 8);
//             for (var i = 0; i < str.length; i++) {
//                 resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//             }
//             resultHtml.push("亿");
//             str = number.toString();
//             str = str.substring(str.length - 8, str.length - 4);
//             for (var i = 0; i < str.length; i++) {
//                 resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//             }
//             resultHtml.push("万");
//         }
//         return (resultHtml.join(''));
//     }
// };

// //计算注册人数
// var CalculationPeople = function (number) {
//     if ($.isNumeric(number)) {
//         var str = number.toString();
//         var resultHtml = [];
//         if (str.length > 8) {
//             str = str.substr(0, str.length - 8);
//             for (var i = 0; i < str.length; i++) {
//                 resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//             }
//             resultHtml.push("亿");
//         }
//         if (number.toString().length > 4) {
//             str = number.toString();
//             str = str.substring(str.length - 8, str.length - 4);
//             for (var i = 0; i < str.length; i++) {
//                 resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//             }
//             resultHtml.push("万");
//         }
//         str = number.toString();
//         str = str.substring(str.length - 4, str.length);
//         for (var i = 0; i < str.length; i++) {
//             resultHtml.push("<span>" + str.charAt(i) + "</span> ");
//         }
//         resultHtml.push("人");
//         return (resultHtml.join(''));
//     }
// };

//邀请码
var RecommendedCode = function () {
    var RecommendedCode = $.getQueryStringByName("c");
    if (!$.isNull(RecommendedCode)) {
        $.setCookie("RecommendedCode", RecommendedCode);
    }
};

// var IsFollowWeChat = function () {
//     //var followstr = $.getCookie("isFollowWeChat");
//     ////$.setCookie("RecommendedCode", RecommendedCode);
//     //if ($.getCookie("MadisonToken") != "" && (followstr == "" || followstr == "0" || followstr == "-1")) {
//     //    //if ($.is_weixn()) { }
//     //    $.alertF("<img src='/css/img2.0/txsfollow.jpg' />识别或保存二维码关注唐小僧", null, function () {
//     //        $.setCookie("isFollowWeChat", "2", (1 * 24 * 60));
//     //        $(".az-showmasker-Text").css("top", "30%");
//     //    });
//     //    $(".az-showmasker-Text").css("top", "10%");
//     //}
// };

function increseNumbers(rate, profit, amount) {
    if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
        $(".wel_head_money").text("*****");//昨日收益
        $(".wel_zc").text("*****");//总资产
        $(".wel_syl").text("*****");//昨日收益率
    }
    else {
        $(".wel_syl").text($.fmoney(rate / 100) + "%");
        $(".wel_head_money").text($.fmoney(profit / 100, 2));
        $(".wel_zc").text($.fmoney(amount / 100, 2));
        // var require = false;
        // if (increseNumberTimeout)
        //     clearTimeout(increseNumberTimeout);

        // if (increseRateCurrent < rate) {
        //     require = true;
        //     increseRateCurrent = increseRateCurrent + 1;
        //     $(".wel_syl").text($.fmoney(increseRateCurrent / 100) + "%");
        // }
        // else {
        //     $(".wel_syl").text($.fmoney(increseRateCurrent / 100) + "%");
        // }
        // if (increaseProfitCurrent < profit) {
        //     require = true;
        //     increaseProfitCurrent = increaseProfitCurrent + 1;
        //     $(".wel_head_money").text($.fmoney(increaseProfitCurrent / 100, 2));
        // }
        // if (incresesumamount < amount) {
        //     require = true;
        //     incresesumamount = incresesumamount + 1;
        //     $(".wel_zc").text($.fmoney(incresesumamount / 100, 2));
        // }

        // if (require) {
        //     increseNumberTimeout = setTimeout(function () { increseNumbers(rate, profit, amount); }, 10);
        // }
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
    // var url = "/StoreServices.svc/store/getbusinesscenterinfo";
    // $.AkmiiAjaxPost(url, {}, true).then(function (data) {
    //     if (data.result) {
    //         storedata = data;
    //         if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
    //             $("#stroeTotoalProfit").text("*****");//商户账户
    //             $("#storeYesterdayProfit").text("*****");//商户昨日收益
    //         }
    //         else {
    //             $("#stroeTotoalProfit").text($.fmoney(data.totalprofit));
    //             $("#storeYesterdayProfit").text($.fmoney(data.yesterdayprofit));
    //         }

    //         $("#storeInfo").show().click(function () {
    //             if (data.status == "6") {
    //                 $.alertF("管理员变更中，不可访问");
    //             } else {
    //                 window.location.href = "/html/store/company4.html";
    //             }
    //         });
    //     }
    // });
}
/**
 * 事件处理
 */
$(".wel_head_qd,.wel_head_yq").click(function () {
    window.location.href = $(this).data("href");
});
//隐藏资金功能
$("#eyes").click(function (event) {
    event.stopImmediatePropagation();
    eyes();
});
$(".wel_dq").click(function () {
    window.location.href = $(this).data("href");
});
// $(".wel_more").click(function () {
//     window.location.href = "/html/product/";
// });

// 周周升点击
$(".wel_dh").click(function () {
    window.location.href = $(this).data("href");
});

// 僧财宝点击
$(".wel_scb").click(function () {
    if (!$.CheckToken()) {
        $.Loginlink();
    } else {
        if (account.issignmoneyboxandhtffund) {
            window.location.href = "/html/product/account-balance.html";
        } else {
            // 未开通
            if ($.getscbSigned(account.referralcode + "") == 0) {
                $.scgSignAlert(account.referralcode + "", false, function () {
                    window.location.reload();
                }, function () {

                });
            }
        }
    }
});

//判断隐藏资金是否开启
function eyes() {
    var eyessrc = $("#eyes").hasClass("welpsw");
    if (!eyessrc) {
        updateprofit();
        $("#eyes").addClass("welpsw");
        isopeneyes = true;//隐藏功能开启
        $.setLS('isopeneyes_' + account.referralcode, null);//清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes);//存进cookie
    }
    else {
        profitdisplay();
        $("#eyes").removeClass("welpsw");
        isopeneyes = false;//隐藏功能关闭
        $.setLS('isopeneyes_' + account.referralcode, null);//清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes);//存进cookie

    }
}


//判断隐藏资金是否开启
function loadeyes() {
    if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
        //$("#eyes").attr("src", "/css/img2.0/iscloseeye.png");
        $("#eyes").addClass("welpsw");
        updateprofit();
    }
    else {
        // $("#eyes").attr("src", "/css/img2.0/isopeneye.png");
        $("#eyes").removeClass("welpsw");
        profitdisplay();
    }
}

//收益变为*
function updateprofit() {
    var demandbalance_freeze = parseFloat(account.demandbalance) + parseFloat(account.freezeamount);//至尊宝投资金额
    $(".wel_head_money").text("*****");//昨日收益
    $(".wel_zc").text("*****");//总资产
    $(".wel_syl").text("*****");//昨日收益率
    $(".wel_inve_span").text("*****");//投资金额

    $(".wel_nzzb_payed").addClass("wel_pwd_color").text("*****");//至尊宝收益
    $(".wel_tmr_nzzb").addClass("wel_pwd_color").text("*****");//至尊宝收益
    $(".wel_nzzs_payed").addClass("wel_pwd_color").text("*****");//周周升收益
    $(".wel_tmr_nzzs").addClass("wel_pwd_color").text("*****");//周周升收益
    $(".wel_ndq_payed").addClass("wel_pwd_color").text("*****");//定期收益
    $(".wel_tmr_ndq").addClass("wel_pwd_color").text("*****");//定期收益

    // $(".wel_tmr_scb").html("*****");
    // $(".wel_tmr_scbadd").html("*****");
    $("#stroeTotoalProfit").text("*****");//商户账户
    $("#storeYesterdayProfit").text("*****");//商户昨日收益
    // if (demandbalance_freeze != 0) {
    //     $(".wel_tmr_zzb").text("*****");//至尊宝投资金额
    // }
    // if (account.fixedbalance != 0) {
    //     $(".wel_tmr_dq").text("*****");//定期投资金额
    // }
    // if (account.demandfixedtwochangebalance != 0) {
    //     $(".wel_tmr_zzs").text("*****");//周周升投资金额
    // }
}

//收益变为原本收益
function profitdisplay() {
    var demandbalance_freeze = parseFloat(account.demandbalance) + parseFloat(account.freezeamount);//至尊宝投资金额
    $(".wel_head_money").text($.fmoney(account.yesterdaysumprofit));//昨日收益
    $(".wel_zc").text($.fmoney(account.summoney));//总资产
    $(".wel_syl").text($.fmoney(yesterdayrate / 100) + "%");//昨日收益率
    $(".wel_inve_span").text($.fmoney(account.sumbalance));//投资金额

    $(".wel_nzzb_payed").removeClass("wel_pwd_color").text($.fmoney(demandbalance_freeze || 0));//至尊宝收益
    $(".wel_tmr_nzzb").removeClass("wel_pwd_color").text($.fmoney(account.demandyesterdayprofit || 0));//至尊宝收益
    $(".wel_nzzs_payed").removeClass("wel_pwd_color").text($.fmoney(account.demandfixedtwochangebalance || 0));//周周升收益
    $(".wel_tmr_nzzs").removeClass("wel_pwd_color").text($.fmoney(account.demandfixedtwochangeyesterdayprofit || 0));//周周升收益
    $(".wel_ndq_payed").removeClass("wel_pwd_color").text($.fmoney(account.fixedbalance || 0));//定期收益
    $(".wel_tmr_ndq").removeClass("wel_pwd_color").text($.fmoney(account.fixedyesterdayprofit || 0));//定期收益

    // $(".wel_tmr_zzbadd").text("+" + $.fmoney(account.demandyesterdayprofit));//至尊宝收益
    // $(".wel_tmr_zzsadd").text("+" + $.fmoney(account.demandfixedtwochangeyesterdayprofit));//周周升收益
    // $(".wel_tmr_dqadd").text("+" + $.fmoney(account.fixedyesterdayprofit));//定期收益
    // $(".wel_tmr_scb").html($.fmoney(account.basicbalance));
    // $(".wel_tmr_scbadd").html("+" + $.fmoney(account.monkyesterdayprofit));

    $("#stroeTotoalProfit").text($.fmoney(storedata.totalprofit));//商户账户
    $("#storeYesterdayProfit").text($.fmoney(storedata.yesterdayprofit));//商户昨日收益
    // if (demandbalance_freeze != 0) {
    //     $(".wel_tmr_zzb").text($.fmoney(demandbalance_freeze));//至尊宝投资金额
    // }
    // if (account.fixedbalance != 0) {
    //     $(".wel_tmr_dq").text($.fmoney(account.fixedbalance));//定期投资金额
    // }
    // if (account.demandfixedtwochangebalance != 0) {
    //     $(".wel_tmr_zzs").text($.fmoney(account.demandfixedtwochangebalance));//周周升投资金额
    // }
}