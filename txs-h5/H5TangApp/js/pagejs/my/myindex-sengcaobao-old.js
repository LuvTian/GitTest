/**
 *desc:我的首页
 *author:ryan
 *date:2016年5月23日10:29:47
 **/

//Desc：我的-首页
//var $btnStore = $("#btnStore"); //我是商户按钮
var referralcode; //推荐码
var isclick = false; //$.getLS("clickydc") || false;
var isopeneyes = false; //小眼睛隐藏功能默认关闭
var noticecounts = 0;
$(function() {
    footerBar.highlight(4);
    pageInit();
    timeGetMyMitteilung();
    var Notice1 = new Notice(function(nums) {
        noticecounts = nums;
        getUserInfo();
    });
});


function pageInit() {
    financialsumamount();
    levelmembers();
    bindCurrentData();
    //平台奖励
    $("#reward_list").click(function() {
        window.location.href = "/Html/My/myreward-money.html";
    });
    //理财金
    $("#financial_list").click(function() {
        window.location.href = "/Html/product/product-financialbuylist.html";
    });
    //我的福利
    $("#mywelfare_list").click(function() {
        window.location.href = "/Html/My/mywelfare.html";
    });
    //了解唐小僧
    $("#txsinfo_list").click(function() {
        window.location.href = "/html/anonymous/about-introduction.html";
    });
    //精彩活动
    $("#splendidactive").click(function() {
        window.location.href = "/Html/My/splendidactive.html";
    });
    //周周僧
    $("#zzs_list").click(function() {
        window.location.href = "/Html/my/my-incremental-detail.html";
    });
    //充值
    $("#deposit").click(function() {
        if ($.getscbSigned("myindex" + account.referralcode)) {
            window.location.href = "/Html/PayCenter/user-deposit.html";
        } else {
            $.scgSignAlert("myindex" + account.referralcode, true, function() {
                window.location.href = "/Html/PayCenter/user-deposit.html";
            }, function() {
                window.location.href = "/Html/PayCenter/user-deposit.html";
            });
        }
    });
    //提现
    $("#withdraw").click(function() {
        if ($.getscbSigned("myindex" + account.referralcode)) {
            window.location.href = "/Html/PayCenter/user-withdraw.html";
        } else {
            $.scgSignAlert("myindex" + account.referralcode, true, function() {
                window.location.href = "/Html/PayCenter/user-withdraw.html";
            }, function() {
                window.location.href = "/Html/PayCenter/user-withdraw.html";
            });
        }
    });
    //会员等级
    $("#level_list").click(function() {
        $.BaiduStatistics("Member Grade", "Menu_Grade", "我的-会员等级");
        //_hmt.push(['_trackEvent', '会员等级入口', '会员等级入口link', 'click', '会员等级入口']); //百度统计
        window.location.href = "/Html/My/member_level/member_center.html";
    });
    //我的糖果
    $("#myCredits_list").click(function() {
        $.BaiduStatistics("Integral Mall", "Menu_TangGuo", "我的-我的唐果"); //百度统计
        window.location.href = "/Html/store/myCredits.html";
    });
    //交易记录
    $("#trans-history_list").click(function() {
        window.location.href = "/Html/My/trans-history.html";
    });
    //好友邀请
    $("#qujin_list").click(function() {
        window.location.href = "/Html/My/qujin.html";
    });
    //账户详情
    $("#userinfo_list").click(function() {
        window.location.href = "/Html/My/UserInfo.html";
    });

    //僧财宝
    $("#sengcaibao_list").click(function() {
        window.location.href = "/Html/Product/account-balance.html";
    });

    //至尊宝
    $("#demand_list").click(function() {
        window.location.href = "/Html/Product/index-demand.html";
    });

    $("#melvmask").click(function() {
        $("#melvmask").hide();
        $("#tangmask").show();
    });

    $("#tangmask").click(function() {
        $("#tangmask").hide();
        $(document.body).css('overflow', 'auto');
        $.setLS("clickydc" + account.referralcode, true);
    });
}

var account = [];

function getUserInfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            isclick = $.getLS("clickydc" + account.referralcode) || isclick;
            if (account.laddertitle != "") {
                //周周僧产品名称
                var _laddertitile=account.laddertitle.length>6?(account.laddertitle.substr(0,6)+"..."):(account.laddertitle);
                $("#laddertitile").text(_laddertitile);
            }
            $("#my-mobile").text(account.mobile);
            $("#my-name").text(account.username);
            $("#platform").html($.fmoney(account.demandprofit));
            //是否同意协议
            if (account.issignmoneyboxandhtffund) {
                $("#sengcaibao_list").show();
                $("#account_list").hide();
                $("#deposit").html("转入");
                $("#withdraw").html("转出");
            }
            //同意僧财宝并且有公告信息
            if (account.issignmoneyboxandhtffund && noticecounts > 0) {
                $(".mel_bg").removeClass("tp").addClass("scbnoticetp");
                $(".tang_bg").addClass("scbnoticetangtp");
            }
            //同意僧财宝并且没有公告信息
            if (account.issignmoneyboxandhtffund && noticecounts == 0) {
                $(".mel_bg").removeClass("tp").addClass("scbnonoticetp");
                $(".tang_bg").addClass("scbnonoticetangtp");
            }
            //没同意僧财宝并且没有公告信息
            if (!account.issignmoneyboxandhtffund && noticecounts == 0) {
                $(".mel_bg").removeClass("tp").addClass("nonoticetp");
                $(".tang_bg").addClass("nonoticetangtp");
            }


            //定期记录(有在投投跳转到记录页面无在投跳转定期列表页)
            if (account.fixedbalance == 0) {
                $("#regular_list").click(function() {
                    window.location.href = "/Html/Product/";
                });
            } else {
                $("#regular_list").click(function() {
                    window.location.href = "/Html/my/my-regular-index.html";
                });
            }
            if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
                $("#eyes").removeClass("eye").addClass("closeeye");
                updateprofit();
            } else {
                $("#eyes").removeClass("closeeye").addClass("eye");
                profitdisplay();
            }
            // 如果引导蒙版没有点击
            if (isclick == false) {
                $(document.body).css('overflow', 'hidden');
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

//隐藏资金功能
$("#eyes").click(function() {
    eyes();
});


//判断隐藏资金是否开启
function eyes() {
    var eyessrc = $("#eyes").attr("class");
    if (eyessrc == "eye") {
        updateprofit();
        $("#eyes").removeClass("eye").addClass("closeeye");
        isopeneyes = true; //隐藏功能开启
        $.setLS('isopeneyes_' + account.referralcode, null); //清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes); //存进cookie
    } else {
        profitdisplay();
        $("#eyes").removeClass("closeeye").addClass("eye");
        isopeneyes = false; //隐藏功能关闭
        $.setLS('isopeneyes_' + account.referralcode, null); //清空cookie
        $.setLS('isopeneyes_' + account.referralcode, isopeneyes); //存进cookie
    }
}


//收益变为*
function updateprofit() {
    $("#sengcaibao_money").text("*****"); //僧财宝
    $("#my-sum-balance").text("*****"); //总资产
    $("#my-basic-balance").text("*****"); //账户余额
    $("#my-demand-balance").text("*****"); //至尊宝
    $("#my-fixed-balance").text("*****"); //定期
    $("#demandfixedtwochangebalance").text("*****"); //周周僧
}

//收益变为原本收益
function profitdisplay() {
    $("#sengcaibao_money").text($.fmoney(account.basicbalance)); //僧财宝
    $("#my-sum-balance").text($.fmoney(account.summoney)); //总资产
    $("#my-basic-balance").text($.fmoney(account.basicbalance));
    $("#my-demand-balance").text($.fmoney(account.demandbalance + account.freezeamount));
    $("#my-fixed-balance").text($.fmoney(account.fixedbalance));
    $("#demandfixedtwochangebalance").text($.fmoney(account.demandfixedtwochangebalance)); //周周僧
}

//理财金可用余额
function financialsumamount() {
    var url = "/StoreServices.svc/user/financiallist";
    $.AkmiiAjaxPost(url, {
        "onlysumamount": true
    }, true).then(function(data) {
        if (data.result) {
            $("#totalamount").html($.fmoney(data.totalamount));
        }
    });
}

//会员等级
var id = $.getCookie("userid");

function levelmembers() {
    $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", {
        id: id
    }, true).then(function(data) {
        if (data.code == 200) {
            $("#vip_name").text(data.data.levelName); //会员等级名称
            $("#points").text(data.data.points + "个"); //我的糖果
        } else {
            $.alertF(data.message);
        }
    })
}

//检查商户
function checkMerchant(href) {
    $.AkmiiAjaxPost("/StoreServices.svc/store/getstoreuserverification", {}, true).then(function(d) {
        if (d.result) {
            if (d.isbd) {
                $("#store_list").click(function() {
                    window.location.href = "/Html/My/bd-input.html";
                });
                $("#store_text").text("商户入驻");
            } else {
                if ($.isNull(account.storeID)) {
                    $("#store_list").click(function() {
                        window.location.href = "/Html/My/merchant-settled.html";
                    });
                    $("#store_text").text("商户入驻");
                } else {
                    $("#store_list").click(function() {
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
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
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
    icon: 'v1.png',
    rate: '0.0%',
    v: 'v1',
    name: "白龙马"
}, {
    level: '1',
    count: 20,
    icon: 'v2.png',
    rate: '0.2%',
    v: 'v2',
    name: "卷帘大将"
}, {
    level: '2',
    count: 35,
    icon: 'v3.png',
    rate: '0.3%',
    v: 'v3',
    name: "天蓬元帅"
}, {
    level: '3',
    count: 0,
    icon: 'v4.png',
    rate: '0.5%',
    v: 'v4',
    name: "齐天大圣"
}];

//用户等级显示
function bindCurrentData() {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
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


//会员等级
var vipArry = [{
    vip_icon: 'normal_icon.png',
    name: '普通会员'
}, {
    vip_icon: 'bronze_icon.png',
    name: '青铜会员'
}, {
    vip_icon: 'silver_icon.png',
    name: '白银会员'
}, {
    vip_icon: 'gold_icon.png',
    name: '黄金会员'
}, {
    vip_icon: 'platinum_icon.png',
    name: '铂金会员'
}];
var id = $.getCookie("userid");
//$.AkmiiAjaxGet(apiUrl_prefix + "/members/{0}".replace('{0}', encodeURIComponent(encodeURIComponent(id))), true)
$.AkmiiAjaxPost(apiUrl_prefix + "/members/info", {
        id: id
    }, true).then(function(data) {
        if (data.code == 200) {
            //会员等级
            var j = data.data.level;
            var vip_icon = vipArry[j].vip_icon;
            var vip_name = data.data.levelName;
            var vip_contributions = data.data.contributions ? data.data.contributions : "";
            $(".icon-my-vip img").attr("src", "/css/img2.0/img/" + vip_icon); //会员等级图标
            $("#vip_name").text(vip_name); //会员等级名称
            $("#vip_money").text(vip_contributions); //会员贡献值
        } else {
            //会员等级
            var j = 1;
            var vip_icon = vipArry[j].vip_icon;
            var vip_name = vipArry[j].name;
            $(".icon-my-vip img").attr("src", "/css/img2.0/img/" + vip_icon); //会员等级图标
            $("#vip_name").text(vip_name); //会员等级名称
            $("#vip_money").text(""); //会员贡献值
            $.alertF(data.message);
        }
    })
    //点击消息
$("#wxmitte").click(function() {
    var url = "/StoreServices.svc/user/notificationchatislook?g=" + (new Date().getTime());
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        window.location.href = "/Html/My/mymitteilung.html";
    });
});

var timeGetMyMitteilung = function() {
    getMyMitteilung();
    setInterval("getMyMitteilung()", 1000 * 30);
}

//获取当前用户消息信息
var getMyMitteilung = function() {
    var url = "/StoreServices.svc/user/getnotificationchat?g=" + (new Date().getTime());
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result && data.accountchatinfo.newmsgcount > 0) {
            $("#wxmitte").attr("src", "/css/img2.0/sengcaibao/message.png");
        } else {
            $("#wxmitte").attr("src", "/css/img2.0/sengcaibao/message_null.png");
        }
    });
};