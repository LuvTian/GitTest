var account = [];
var referralcode; //推荐码
var isclick = false; //$.getLS("clickydc") || false;
var isopeneyes = false; //小眼睛隐藏功能默认关闭
var noticecounts = 0;
var MadisonToken = $.getCookie("MadisonToken");
var sumMoney = []; //总资产（昨日收益）
var qjsMoney = 0; //侨金所资产
var gjsMoney = 0; //赣金所资产
var userId = $.getCookie("userid");
var qjsbool = false;
var gjsbool = false;
// var apiUrl_prefix = "http://192.168.3.30:8090";
$(function () {
    //如果是返吧用户，则跳转到返吧的定制“我的”页面
    if (getSession("fanba") == "fanba") {
        location.replace("/html/fanba/my.html");
        return;
    }
    footerBar.highlight(4);
    pageInit();
    timeGetMyMitteilung();
    var Notice1 = new Notice(function (nums) {
        noticecounts = nums;
        getUserInfo();
    });
    xdqgroupstatus();
    initZdq($.getLS("refcode"));
});


function pageInit() {
    financialsumamount();
    levelmembers();
    bindCurrentData();
    getcouponandinterestcount();
    //定期持有记录
    $("#regular_list").click(function () {
        window.location.href = "/Html/my/my-regular-index.html";
    });
    //现金奖励
    $("#myreward-money").click(function () {
        window.location.href = "/Html/My/myreward-money.html";
    });

    //优惠券
    $("#myreward-bonus").click(function () {
        window.location.href = "/html/my/myreward-bonus.html";
    });

    // //平台奖励
    // $("#reward_list").click(function() {
    //     window.location.href = "/html/my/myreward-bonus.html";
    // });
    //理财金
    $("#financial_list").click(function () {
        window.location.href = "/html/product/product-financialbuylist.html";
    });
    // //我的福利
    // $("#mywelfare_list").click(function() {
    //     window.location.href = "/html/my/mywelfare.html";
    // });
    //了解唐小僧
    $("#txsinfo_list").click(function () {
        window.location.href = "/html/anonymous/about-introduction.html";
    });
    //精彩活动
    $("#splendidactive").click(function () {
        window.location.href = "/html/my/splendidactive.html";
    });
    //灵活投
    $("#lht_list").click(function () {
        window.location.href = "/html/my/myflexiblecast.html";
    });
    //充值
    $("#deposit").click(function () {
        event.stopImmediatePropagation();
        if ($.getscbSigned("myindex" + account.referralcode)) {
            window.location.href = "/html/paycenter/user-deposit.html";
        } else {
            $.scgSignAlert("myindex" + account.referralcode, true, function () {
                window.location.href = "/html/paycenter/user-deposit.html";
            }, function () {
                window.location.href = "/html/paycenter/user-deposit.html";
            });
        }
    });
    //提现
    $("#withdraw").click(function () {
        event.stopImmediatePropagation();
        if ($.getscbSigned("myindex" + account.referralcode)) {
            window.location.href = "/html/paycenter/user-withdraw.html";
        } else {
            $.scgSignAlert("myindex" + account.referralcode, true, function () {
                window.location.href = "/html/paycenter/user-withdraw.html";
            }, function () {
                window.location.href = "/html/paycenter/user-withdraw.html";
            });
        }
    });
    //会员等级
    $("#level_list").click(function () {
        $.BaiduStatistics("Member Grade", "Menu_Grade", "我的-会员等级");
        //_hmt.push(['_trackEvent', '会员等级入口', '会员等级入口link', 'click', '会员等级入口']); //百度统计
        window.location.href = "/html/my/member_level/member_center.html";
    });
    //我的糖果
    $("#myCredits_list").click(function () {
        $.BaiduStatistics("Integral Mall", "Menu_TangGuo", "我的-我的唐果"); //百度统计
        window.location.href = "/html/store/myCredits.html";
    });
    //交易记录
    $("#trans-history_list").click(function () {
        window.location.href = "/html/my/trans-history.html";
    });
    //好友邀请
    $("#qujin_list").click(function () {
        window.location.href = "/e/invite_win_cash_h/index.html"; //"/html/my/qujin.html";
    });
    //账户详情
    $("#userinfo_list").click(function () {
        window.location.href = "/html/my/UserInfo.html";
    });

    //至尊宝
    $("#demand_list").click(function () {
        window.location.href = "/html/product/index-demand.html";
    });

    //收益说明
    $("#prfinfo").click(function () {
        window.location.href = "/html/anonymous/description-earnings.html";
    });

    //享多期拼团订单
    $("#group_list").click(function () {
        window.location.href = '/html/anonymous/xdq_trustedLogin.html?pagesource=2&from=txs_h5';
        // window.location.href = "/html/anonymous/description-earnings.html"; 
    });

    $("#melvmask").click(function () {
        $("#melvmask").hide();
        $("#tangmask").show();
    });

    $("#tangmask").click(function () {
        $("#tangmask").hide();
        $(document.body).css('overflow', 'auto');
        $.setLS("clickydc" + account.referralcode, true);
    });

    //隐藏资金功能
    $("#eyes").click(function () {
        event.stopImmediatePropagation();
        eyes();
    });

    //点击消息
    $("#wxmitte").click(function () {
        var url = "/StoreServices.svc/user/notificationchatislook?g=" + (new Date().getTime());
        $.AkmiiAjaxPost(url, {}, true).then(function (data) {
            window.location.href = "/html/my/mymitteilung.html";
        });
    });
    //网贷
    $("#p2p_wd").click(function () {
        $.p2p_url("2");
        // window.location.href = P2P_MSD_URL_prefix + "/zdhtml/p2pnet_loan_record.html?token=" + MadisonToken;
        // window.location.href = P2P_MSD_URL_prefix + "/zdhtml/p2p_transfer_page.html?tourl=" + encodeURIComponent("/zdhtml/p2pnet_loan_record.html") + "&token=" + MadisonToken;
    });


}

//用户信息
function getUserInfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            jysassetinfo();
            //侨金所跳转(！！！新手导游版本修改为进入侨金所页面登陆，实名判断)
            $("#qjs").click(function () {
                //showQfax方法内会有完善信息提示
                $.showQfax("2");
                // if (account.customstatus < 2) {
                //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                // } else {
                //     $.showQfax("2");
                //     // apiUrl_prefix = 'http://192.168.90.228:8090';
                //     // var url = apiUrl_prefix + "/qjs/member/destination";
                //     // var data = {
                //     //     "txsAccountId": $.getCookie("userid"),
                //     //     "sourcePage": 2
                //     // };
                //     // $.AkmiiAjaxPost(url, data, false).then(function(d) {
                //     //     if (d.code == 200) {
                //     //         window.location.href = d.data.url;
                //     //     } else {
                //     //         $.alertF(d.message);
                //     //     }
                //     // });
                // }
            });
            isclick = $.getLS("clickydc" + account.referralcode) || isclick;
            $.setCookie("refcode", account.referralcode);
            $.setLS("refcode", account.referralcode);
            try {
                _zdc && _zdc();
            } catch (e) {
                ;
            }
            // if (account.laddertitle != "") {
            //     //周周僧产品名称
            //     var _laddertitile = account.laddertitle.length > 6 ? (account.laddertitle.substr(0, 6) + "...") : (account.laddertitle);
            //     $("#laddertitile").text(_laddertitile);
            // }
            if (account.isshowp2pinfo) {
                $("#p2pandqjs").show();
                $("#p2p_wd").show();
                $("#p2pbalance").html($.fmoney(account.p2pbalance) + "元"); //网贷
            }
            $("#my-name").text(account.username); //用户名
            $("#platform").html($.fmoney(account.demandprofit) + "元"); //平台奖励
            if (account.activefixedcount > 0) {
                $("#activefixedcount").html("定期   (" + account.activefixedcount + ")");
            }
            if (account.reservefreezeamount > 0) {
                $(".freelist").show();
                $("#reservefreezeamount").html($.fmoney(account.reservefreezeamount));
            }
            //是否同意协议
            if (account.issignmoneyboxandhtffund) {
                $.setscbSigned("myindex" + account.referralcode, 1);
                $("#deposit").html("转入");
                $("#withdraw").html("转出");
                // $("#deposit").hide();
                // $("#withdraw").hide();
                $("#sengcaibaotitle").html("僧财宝").append('<span>(原账户余额)</span>');
                //僧财宝
                $("#sengcaibao_list").click(function () {
                    window.location.href = "/html/product/account-balance.html";
                });
            }
            // //同意僧财宝并且有公告信息
            // if (account.issignmoneyboxandhtffund && noticecounts > 0) {
            //     $(".mel_bg").removeClass("tp").addClass("scbnoticetp");
            //     $(".tang_bg").addClass("scbnoticetangtp");
            // }
            // //同意僧财宝并且没有公告信息
            // if (account.issignmoneyboxandhtffund && noticecounts == 0) {
            //     $(".mel_bg").removeClass("tp").addClass("scbnonoticetp");
            //     $(".tang_bg").addClass("scbnonoticetangtp");
            // }
            // //没同意僧财宝并且没有公告信息
            // if (!account.issignmoneyboxandhtffund && noticecounts == 0) {
            //     $(".mel_bg").removeClass("tp").addClass("nonoticetp");
            //     $(".tang_bg").addClass("nonoticetangtp");
            // }

            //定期记录(有在投投跳转到记录页面无在投跳转定期列表页)
            // if (account.fixedbalance == 0) {
            //     $("#regular_list").click(function() {
            //         window.location.href = "/Html/Product/";
            //     });
            // } else {
            //     $("#regular_list").click(function() {
            //         window.location.href = "/Html/my/my-regular-index.html";
            //     });
            // }

            // 如果引导蒙版没有点击
            if (isclick == false) {
                // $(document.body).css('overflow', 'hidden');
                $("#melvmask").show();
            }
            //我是商户 按钮
            var href = "";
            switch (account.storetype + "") {
                case "1": //企业管理员
                case "2": //总店管理员
                    href = "/html/store/company4.html";
                    break;
                case "3": //分店管理员
                    href = "/html/store/company1.html";
                    break;
                case "4": //店员
                    href = "/html/store/company2.html";
                    break;
            }
            checkMerchant(href);

        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.delCookie("MadisonToken");
            $.Loginlink();
        }
    });
}

//代金券和加息券一共的数量
function getcouponandinterestcount() {
    var url = "/StoreServices.svc/user/couponandinterestcount";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            $("#couponCount").html(data.count + "张"); //优惠券和加息券数量
        }
    })
}
//侨金所信息
// function qjsuserinfo() {
//     // apiUrl_prefix = 'http://192.168.90.228:8090';
//     var url = apiUrl_prefix + "/user/asset/info";
//     var data = {
//         "userId": $.getCookie("userid")
//     };
//     $.AkmiiAjaxPost(url, data, false).then(function(d) {
//         if (d.code == 200) {
//             if (d.code == 200) {
//                 qjs = d.data;
//                 if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
//                     $("#eyes").attr("src", "" + $.resurl() + "/css/img2.0/sengcaibao/eye-close.png");
//                     updateprofit();
//                 } else {
//                     $("#eyes").attr("src", "" + $.resurl() + "/css/img2.0/sengcaibao/eyes.png");
//                     profitdisplay();
//                 }
//                 if (qjs.shouldDisplayQjsModule) {
//                     $("#qjs").show();
//                     // //侨金所在投金额
//                     // $("#qjsMoney").html($.fmoney(qjs.qjsMoney) + "元");
//                 }
//                 if (account.isshowp2pinfo && qjs.shouldDisplayQjsModule) {
//                     $(".qjsline").show();
//                 } else if (!account.isshowp2pinfo && !qjs.shouldDisplayQjsModule) {
//                     $("#p2pandqjs").hide();
//                 }
//             }
//         }
//     });
// }

// 享多期拼团订单
function xdqgroupstatus() {
    // var apiUrl_prefix = 'http://192.168.3.27:8883';
    var url = apiUrl_prefix + "/xdq/config/getxdqswitchinfo";
    $.AkmiiAjaxPost(url, {}, false, true).then(function (d) {
        if (d.code == 200 && d.data && d.data && d.data.status == 1) {
            $("#group_list").show();
        }
    });
}
//交易所资产信息
function jysassetinfo() {
    var url = apiUrl_prefix + "/jys/user/asset/info";
    var data = {
        "userId": $.getCookie("userid")
    };
    $.AkmiiAjaxPost(url, data, false).then(function (d) {
        if (d.code == 200) {
            sumMoney = d.data;
            var list = d.data.list;
            $.each(list, function (index, item) {
                if (item.platform == "QJSTZ") {
                    qjsbool = true;
                    qjsMoney = item.money;
                    $(".qjsplatformName").html(item.platformName);
                    $("#p2pandqjs").show();
                    $("#qjs").show();
                } else if (item.platform == "GJSTZ") {
                    gjsbool = true;
                    gjsMoney = item.money;
                    $(".gjsplatformName").html(item.platformName);
                    if (account.isshowp2pinfo && qjsbool) {
                        $("#gjs_two").show();
                        $("#gjs").show();
                    } else if (!account.isshowp2pinfo && !qjsbool) {
                        $("#p2pandqjs").show();
                        $("#gjs_one").show();
                        $("#qjsline").hide();
                    } else {
                        $("#p2pandqjs").show();
                        $("#gjs_one").show();
                    }
                }
            });
            if (!account.isshowp2pinfo && d.data.list.length == 0) {
                $("#p2pandqjs").hide();
            }
            if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
                $("#eyes").attr("src", "" + $.resurl() + "/css/img2.0/sengcaibao/eye-close.png");
                updateprofit();
            } else {
                $("#eyes").attr("src", "" + $.resurl() + "/css/img2.0/sengcaibao/eyes.png");
                profitdisplay();
            }
            //赣金所跳转url
            $(".gjsc").click(function () {
                $.jumpGJSFax('GJSTZ', 2);
            });
        }
    });
}

//判断隐藏资金是否开启
function eyes() {
    if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
        profitdisplay();
        $("#eyes").attr("src", "" + $.resurl() + "/css/img2.0/sengcaibao/eyes.png");
        isopeneyes = false; //隐藏功能关闭
        $.setLS('isopeneyes_' + account.referralcode, null); //清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes); //存进cookie
    } else {
        updateprofit();
        $("#eyes").attr("src", "" + $.resurl() + "/css/img2.0/sengcaibao/eye-close.png");
        isopeneyes = true; //隐藏功能开启
        $.setLS('isopeneyes_' + account.referralcode, null); //清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes); //存进cookie
    }
}


//收益变为*
function updateprofit() {
    $("#sengcaibao_money").text("*****"); //僧财宝
    $("#my-sum-balance").text("*****"); //总资产
    // $("#my-demand-balance").text("*****"); //至尊宝
    $("#my-fixed-balance").text("*****"); //定期
    $("#flexibletotalamount").text("*****"); //灵活投
    $("#yesterdaysumprofit").text("*****"); //昨日收益
    $("#qjsMoney").text("*****"); //侨金所
    $(".gjsMoney").text("*****"); //赣金所
    $("#p2pbalance").text("*****"); //网贷
}

//收益变为原本收益
function profitdisplay() {
    $("#sengcaibao_money").text($.fmoney(account.basicbalance) + "元"); //僧财宝
    $("#my-sum-balance").text($.fmoney(sumMoney.sumMoney)); //总资产
    // $("#my-demand-balance").text($.fmoney(account.demandbalance + account.freezeamount));
    $("#my-fixed-balance").text($.fmoney(account.fixedbalance) + "元"); //定期
    $("#flexibletotalamount").text($.fmoney(account.flexibletotalamount) + "元"); //灵活投
    $("#yesterdaysumprofit").text($.fmoney(sumMoney.yesterdaySumProfit)); //昨日收益
    $("#qjsMoney").html($.fmoney(qjsMoney) + "元"); //侨金所金额
    $(".gjsMoney").html($.fmoney(gjsMoney) + "元"); //赣金所金额
    $("#p2pbalance").html($.fmoney(account.p2pbalance) + "元"); //网贷
}

//理财金可用余额
function financialsumamount() {
    var url = "/StoreServices.svc/user/financiallist";
    $.AkmiiAjaxPost(url, {
        "onlysumamount": true
    }, true).then(function (data) {
        if (data.result) {
            $("#totalamount").html($.fmoney(data.totalamount) + "元");
        }
    });
}

//会员等级
var id = $.getCookie("userid");
//会员等级
var vipArry = [{
    vip_icon: 'v1-new.png',
    name: '普通会员'
}, {
    vip_icon: 'v2-new.png',
    name: '青铜会员'
}, {
    vip_icon: 'v3-new.png',
    name: '白银会员'
}, {
    vip_icon: 'v4-new.png',
    name: '黄金会员'
}, {
    vip_icon: 'v5-new.png',
    name: '铂金会员'
}];

function levelmembers() {
    // apiUrl_prefix = 'http://192.168.90.228:8090';
    $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", {
        id: id
    }, true).then(function (data) {
        if (data.code == 200) {
            var j = data.data.level;
            $("#vip_name").text(data.data.levelName); //会员等级名称
            $("#points").text(data.data.points + "个"); //我的糖果
            $("#viplevel-img").attr("src", "" + $.resurl() + "/css/img2.0/" + vipArry[j].vip_icon); //会员等级图片

        } else {
            $.alertF(data.message);
        }
    })
}

//检查商户
function checkMerchant(href) {
    $.AkmiiAjaxPost("/StoreServices.svc/store/getstoreuserverification", {}, true).then(function (d) {
        if (d.result) {
            if (d.isbd) {
                $("#store_list").click(function () {
                    window.location.href = "/html/my/bd-input.html";
                });
                $("#store_text").text("商户入驻");
            } else {
                if ($.isNull(account.storeID)) {
                    $("#store_list").click(function () {
                        window.location.href = "/html/my/merchant-settled.html";
                    });
                    $("#store_text").text("商户入驻");
                } else {
                    $("#store_list").click(function () {
                        storeIsFrozen(href);
                    });
                    $("#store_text").text("我是商户");
                }
            }
        }
    });
};

//我是商户时验证商户是否冻结
function storeIsFrozen(href) {
    var url = "/StoreServices.svc/store/getbusinesscenterinfo";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            if (data.status == "6") {
                $.alertNew("管理员变更中，不可访问");
            } else {
                window.location.href = href;
            }
        } else {
            $.alertNew(data.errormsg);
        }
    });
}

//用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
var levelArry = [{
    level: '0',
    count: 8,
    icon: 'v1-new.png',
    rate: '0.0%',
    v: 'v1',
    name: "白龙马"
}, {
    level: '1',
    count: 20,
    icon: 'v2-new.png',
    rate: '0.2%',
    v: 'v2',
    name: "卷帘大将"
}, {
    level: '2',
    count: 35,
    icon: 'v3-new.png',
    rate: '0.3%',
    v: 'v3',
    name: "天蓬元帅"
}, {
    level: '3',
    count: 0,
    icon: 'v4-new.png',
    rate: '0.5%',
    v: 'v4',
    name: "齐天大圣"
}];

//用户等级显示
function bindCurrentData() {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var i = data.data.currentlevel;
            if (i > levelArry.length - 1) {
                i = levelArry.length - 1;
            }
            var rate = levelArry[i].rate;
            var name = levelArry[i].name;
            if (i == 0) {
                $("#levelname").html(name);
                $("#levelrate").html("");
            } else {
                $("#levelname").html(name);
                $("#levelrate").html("+" + rate);
            }
        }
    });
}

var timeGetMyMitteilung = function () {
    getMyMitteilung();
    setInterval("getMyMitteilung()", 1000 * 30);
}

//获取当前用户消息信息
var getMyMitteilung = function () {
    var url = "/StoreServices.svc/user/getnotificationchat?g=" + (new Date().getTime());
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result && data.accountchatinfo.newmsgcount > 0) {
            $("#xxnum").addClass("mesg_show");
        }
    });
};

//sessionStorage
function support() {
    return !!window.sessionStorage;
}

function getSession(key) {
    if (support()) {
        return sessionStorage.getItem(key);
    } else {
        return $.getCookie(key);
    }
}

function setSession(key, value) {
    if (support()) {
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, value);
    } else {
        $.setCookie(key, value);
    }
}