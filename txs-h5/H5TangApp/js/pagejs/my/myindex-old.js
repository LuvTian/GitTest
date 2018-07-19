/**
 *desc:我的首页
 *author:ryan
 *date:2016年5月23日10:29:47
 **/

//Desc：我的-首页
//var apiUrl_prefix = "https://uatjavaapi.txslicai.com";
var apiUrl_prefix = "https://javaapitest.txslicai.com";

var $btnStore = $("#btnStore"); //我是商户按钮
var referralcode; //推荐码
$(function() {
    footerBar.highlight(4);
    setTimeout(function() {
        $(".mymove2").removeClass("mymove2");
    }, 3000);
    getUserInfo();
    BindCurrentData();
    financialsumamount(); //理财金可用余额
    pageInit();
    setTimeout(function() {
        $(".mymove2").removeClass("mymove2");
    }, 3000);

});
var $Immerchant = $("#Immerchant"); //我是商户按钮
var referralcode; //推荐码


//页面初始化
var pageInit = function() {
    //跳转到取经页面
    $("#more-profit,#level-my").click(function() {
        window.location.href = "/Html/My/qujin.html";
    });
    $(".bg-white.bb.mb.help-exp .left").click(function() {
        if (account.customstatus < 3) {
            $.confirmF("您的个人安全资料还未完善，现在去完善吧", null, null, null, $.RegistSteplink);
            return false;
        }
        window.location.href = "/Html/my/my-regular-index.html";
    });

    $(".bg-white.bb.mb.help-exp .left.br1").click(function() {
        if (account.customstatus < 3) {
            $.confirmF("您的个人安全资料还未完善，现在去完善吧", null, null, null, $.RegistSteplink);
            return false;
        }
        window.location.href = "/html/my/user-demand.html";
    });
}

var checkMerchant = function(href) { //检查商户
    $.AkmiiAjaxPost("/StoreServices.svc/store/getstoreuserverification", {}, true).then(function(d) {
        if (d.result) {
            if (d.isbd) {
                $btnStore.click(function() {
                    window.location.href = "/Html/My/bd-input.html";
                });
                $("#my-store-text").text("商户入驻");
            } else {
                if ($.isNull(account.storeID)) {
                    $btnStore.click(function() {
                        window.location.href = "/Html/My/merchant-settled.html";
                    });
                    $("#my-store-text").text("商户入驻");
                } else {
                    $btnStore.click(function() {
                        StoreIsFrozen(href);
                    });
                    $("#my-store-text").text("我是商户");
                }
            }
        }
    });
};
var account = [];
var getUserInfo = function() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            referralcode = account.referralcode;
            $("#platform").html($.fmoney(account.demandprofit) + "元");
            //风险提示书或合格投资人声明未做	(未完成合格投资人认证)
            if (account.riskwarning && account.passinvestor) {
                if (account.questionnaire != 0) {
                    //显示认证提示一栏
                    $("#accreditation").show();
                    $("#accreditation").prepend("您的投资风格为");
                    $("#accreditationhtml").html(account.riskleveldesc);
                } else {
                    //显示认证提示一栏
                    $("#accreditation").show();
                    $("#accreditationhtml").html("未进行风险评估");
                }
            } else {
                //显示认证提示一栏
                $("#accreditation").show();
                $("#accreditationhtml").html("未完成合格投资人认证");
            }
            //if (data.ismaintenance) {
            //    $(".maintenanct").attr("href", "/html/system/data-processing.html")
            //}
            if (data.isglobalmaintenance) {
                $("#deposit,#withdraw").click(function() {
                    window.location.href = "/html/system/system-maintenance.html";
                });
            } else {
                $("#deposit").click(function() {
                    window.location.href = "/Html/PayCenter/user-deposit.html";
                    /*暂时去掉*/
                    //if (account.customstatus < 3) {
                    //    $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                    //    return;
                    //}
                    //else if (account.iswithholdauthoity == 0) {
                    //    var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/my/index.html";
                    //    $.SetSinaPayPassword(returnurl, data.date, account.referralcode, account.iscashdesknewuser);
                    //} else if (account.iswithholdauthoity == 1)//未设置委托代扣
                    //{
                    //    var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
                    //    $.WithholdAuthority(returnurl, function () {
                    //        window.location.href = "/Html/PayCenter/user-deposit.html";
                    //    }, account.referralcode, true);
                    //} else {
                    //    window.location.href = "/Html/PayCenter/user-deposit.html";
                    //}
                });
                $("#withdraw").click(function() {
                    window.location.href = "/Html/PayCenter/user-withdraw.html";
                    //if (account.customstatus < 3) {
                    //    $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                    //    return;
                    //}
                    //else if (account.iswithholdauthoity == 0) {
                    //    var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/my/index.html";
                    //    $.SetSinaPayPassword(returnurl, data.date, account.referralcode, account.iscashdesknewuser);
                    //} else {
                    //    window.location.href = "/Html/PayCenter/user-withdraw.html";
                    //}
                });
            }

            if (account.customstatus < 3) {
                $(".needValidate").attr("href", "javascript:void(0)");
                $(".needValidate").click(function() {
                    $.confirmF("您的个人安全资料还未完善，现在去完善吧", null, null, null, $.RegistSteplink);
                });
            }

            $("#my-referralcode").click(function() {
                    window.location.href = "/Html/My/qujin-invite.html?referralcode=" + account.referralcode;
                }) //邀请码
            $("#myusersignIn").attr("href", "/Html/My/user-sign.html?referralcode=" + account.referralcode);


            $("#my-mobile").append(account.mobile);
            if (account.issignin) {
                $(".my-remind-round").hide();
            }
            if ($.getLS('isopeneyes_' + account.referralcode) == "true") {
                $("#my-basic-balance").text("*****");
                $("#my-demand-balance").text("*****");
                $("#my-fixed-balance").text("*****");
            } else {
                $("#my-basic-balance").text($.fmoney(account.basicbalance));
                $("#my-demand-balance").text($.fmoney(account.demandbalance + account.freezeamount));
                $("#my-fixed-balance").text($.fmoney(account.fixedbalance));

            }

            $("#my-demand-profit-count").text($.fmoney(account.demandprofitcount));
            if (account.demandprofit > 0) {
                $("#my-demand-profit").text($.fmoney(account.demandprofit));
            }



            $("#my-fixed-profit-count").text($.fmoney(account.fixedprofitcount));
            //用户手机号
            $("#userphone").html(account.mobile);

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
};
//我是商户时验证商户是否冻结
var StoreIsFrozen = function(href) {
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


//理财金可用余额
var financialsumamount = function() {
    var url = "/StoreServices.svc/user/financiallist";
    $.AkmiiAjaxPost(url, {
        "onlysumamount": true
    }, true).then(function(data) {
        if (data.result) {
            $("#sumamount").html($.fmoney(data.totalamount) + "元");
        }
    });
}

//用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
var levelArry = [{
    level: '0',
    count: 8,
    icon: 'v1.png',
    rate: '0%',
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
var BindCurrentData = function() {
        var url = "/StoreServices.svc/Activity/getaccountlevel";
        $.AkmiiAjaxPost(url, {}, true).then(function(data) {
            if (data.result) {

                var i = data.data.currentlevel;
                if (i > levelArry.length - 1) {
                    i = levelArry.length - 1;
                }
                var icon = levelArry[i].icon;
                var v = levelArry[i].v;
                var rate = levelArry[i].rate;
                var level = levelArry[i].level;
                var name = levelArry[i].name;
                //头像按等级显示
                $("#level-logo").attr("src", "/css/img2.0/" + icon);
                //V按等级显示
                $("#v").html(v);
                if (level == 0) {
                    //等级为白龙马是显示（点击赚更多收益）
                    $("#level-0").removeClass("display-none");
                } else {
                    //加成按等级显示
                    $("#level-big").removeClass("display-none");
                    $("#level-name").text(name);
                    $("#level-rate").text(rate);
                }
            } else {
                $("#level-logo").attr("src", "/css/img2.0/" + levelArry[0].icon);
            }
        });
    }
    //会员等级
var vipArry = [{
    vip_icon: 'normal.png',
    name: '普通会员'
}, {
    vip_icon: 'bronze.png',
    name: '青铜会员'
}, {
    vip_icon: 'silver.png',
    name: '白银会员'
}, {
    vip_icon: 'gold.png',
    name: '黄金会员'
}, {
    vip_icon: 'platinum.png',
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
            var vip_icon = vipArry[j - 1].vip_icon;
            var vip_name = vipArry[j - 1].name;
            var vip_contributions = data.data.contributions ? data.data.contributions : "";
            $(".icon-my-vip img").attr("src", "/css/img2.0/" + vip_icon); //会员等级图标
            $("#vip_name").text(vip_name); //会员等级名称
            $("#vip_money").text(vip_contributions); //会员贡献值
        } else {
            //会员等级
            var j = 1;
            var vip_icon = vipArry[j - 1].vip_icon;
            var vip_name = vipArry[j - 1].name;
            $(".icon-my-vip img").attr("src", "/css/img2.0/" + vip_icon); //会员等级图标
            $("#vip_name").text(vip_name); //会员等级名称
            $("#vip_money").text(""); //会员贡献值
            $.alertF(data.message);
        }
    })
    //$.showLoader();
    //$.ajax({
    //    url: "http://corp.txslicai.com/members/{0}".replace('{0}', id) + '&' + (new Date()).getTime(),
    //    dataType: "json",
    //    beforeSend: function (request) {
    //        var _userid = $.getCookie("userid") || "";
    //        request.setRequestHeader("userid", _userid);
    //    }
    //}).then(function (d) {
    //    $.hideLoader();
    //    //成功回调
    //    //会员等级
    //   var j = d.data.level;
    //   var vip_icon = vipArry[j].vip_icon;
    //   var vip_name = vipArry[j].name;
    //   $(".icon-my-vip img").attr("src", "/css/img2.0/" + vip_icon);//会员等级图标
    //   $("#vip_name").text(vip_name);//会员等级名称
    //   $("#vip_money").text(d.data.contributions);//会员贡献值

//}, function (d) {
//    console.log('error-->', d);
//});

//签到、充值、提现给链接
$("#qian").click(function() {
    window.location.href = "/Html/My/user-sign.html?referralcode=" + referralcode;
});

$("#fixed").click(function() {
    window.location.href = "/Html/Product/";
});


//点击基金
$(".myfund").click(function() {
    $(".bg-black").css({
        display: "block",
        height: $(document).height()
    });
    var $box = $('.fund-poplayer');
    $box.css({
        left: ($("body").width() - $box.width()) / 2 + "px",
        top: ($(window).height() - $box.height()) / 2 + $(window).scrollTop() + "px",
        display: "block"
    });
});
$(".bg-black,.fpbutton").click(function() {
    $(".bg-black,.poplayer").css("display", "none");
});