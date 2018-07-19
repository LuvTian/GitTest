/// <reference path="/_references.js" />
var today = new Date();
var temp = 0;
var monday;
var leaksignday;
//是否可以抽大奖
var isdraw = false;
//当前周周一
var CURRENT_MONDAY = new Date(getMonDate());
var CURRENT_TODAY = new Date(new Date().Format("yyyy/MM/dd 00:00:00"));
var $user_sign = $("#user-sign");
var $sign_div = $("#user-sign").parent();
var $rule_switch = $("#rule-switch");
var $rule_switch_icon = $("#rule-switch").find("i");
var $rule_content = $("#rule-content");
var MOBILE_TRAFFIC = 7; //手机流量
var type = $.getQueryStringByName("type");
var jsondata = {};
var luckday = 0;
$(function() {

    getUserInfo();
});

$('.miss-tip i').bind('click', function() { closeTip(); });

var closeTip = function() {
    $('.miss-tip').hide();
    $('.mask').hide();
}

//获取用户信息
var account = [];
var getUserInfo = function() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            account.cansign = (account.demandbalance + account.fixedbalance) >= 1000
            share();
        }
        initMonth();
    });
}

//获取周日历签到列表
var getSignList = function() {
    if (CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
        $("i.icon-right").css("visibility", "visible");
    } else {
        $("i.icon-right").css("visibility", "hidden");
    }
    var url = "/StoreServices.svc/user/weeksignlist?v=" + (new Date()).getTime();
    var param = {
        "signtime": today.Format("yyyy/MM/dd")
    };
    $.AkmiiAjaxPost(url, param).then(function(data) {
        if (data.result) {
            leaksignday = data.leaksignday;
            if (leaksignday == 0) {
                $("#leaksignhtml").css("visibility", "visible").html("本周已签满，邀请好友可获得更多的福利哦>>");
            }
            var signList = data.usersigninfolist;
            $.each(signList, function(index, entry) {
                entry.signdate = entry.signdate.replace(/-/g, '/');
                //控制按钮对应的显示
                if ((new Date(data.date).getDay()) == 0) {
                    //周日永远显示“签到”按钮
                    $user_sign.text("签到");
                } else {
                    if ((entry.signdate != new Date().Format("yyyy/MM/dd"))) {
                        $user_sign.text("签到");
                    } else if (entry.signdate == new Date().Format("yyyy/MM/dd") && data.leaksignday == 0) {
                        $sign_div.unbind("click");
                        $user_sign.text("已签到");
                        $(".usersigndiv").addClass("bg-eebdbd");
                    } else if (entry.signdate == new Date().Format("yyyy/MM/dd") && data.leaksignday != 0) {
                        $user_sign.text("补签");
                    }
                }
                getDataValue(entry.signdate).removeClass("signa").find(".roll-box").addClass("logen").end().find("i.icon-right").show(); //已签
                if (entry.rewardname != null && entry.rewardname != "") {
                    if (entry.type == 1) {
                        getDataValue(entry.signdate).find(".rewardname").text(entry.rewardname == "" ? "" : ("获得" + entry.rewardname)); //签到奖品名称
                    } else if (entry.type == 2) {
                        if (entry.rewardname != "") {
                            //周日签到需要隐藏抽大奖文字显示奖品名称
                            getDataValue(entry.signdate).find(".rewardname").text("获得" + entry.rewardname); //签到奖品名称
                            $(".weekdrawhtml").show();
                            $("#weekhtml").hide();
                        }
                    }
                } else if (entry.type == 3) {
                    getDataValue(entry.signdate).find(".rewardname").text(""); //签到奖品名称
                    getDataValue(entry.signdate).find(".rewardname").text("已投资补签").end().find("i").css("visibility", "hidden"); //签到奖品名称
                } else if (entry.type == 4) {
                    getDataValue(entry.signdate).find(".rewardname").text(""); //签到奖品名称
                    getDataValue(entry.signdate).find(".rewardname").text("已分享补签").end().find("i").css("visibility", "hidden"); //签到奖品名称
                }
                //当前周的数据才对应奖品的链接跳转
                if ((today.Format("MM/dd") == new Date().Format("MM/dd")) || (getMonDate().Format("MM/dd") == CURRENT_MONDAY.Format("MM/dd"))) {
                    var weekdatetime = $(".signlista"); //查找当前周所有时间
                    $.each(weekdatetime, function(index, item) {
                        //当签到时间和当前周里的时间相等时
                        if ($(item).data("bind") == entry.signdate) {
                            switch (entry.rewardtype) {
                                case 1:
                                    $(item).attr("href", "/Html/My/myreward-bonus.html"); //代金券
                                    break;
                                case 2:
                                    $(item).attr("href", "/Html/My/myreward-ticket.html"); //加息券
                                    break;
                                case 3:
                                    $(item).attr("href", "/Html/My/financiallist.html"); //理财金
                                    break;
                                case 4:
                                    $(item).attr("href", "/Html/My/myreward-money.html"); //现金奖励
                                    break;
                                case 5:
                                    $(item).attr("href", "javascript:void(0);"); //实物奖不需要发货
                                    $(item).find("i").css("visibility", "hidden"); //隐藏箭头图标
                                    break;
                                case 6:
                                    break;
                                case 7:
                                    $(item).attr("href", "javascript:void(0);"); //流量
                                    $(item).find("i").css("visibility", "hidden"); //隐藏箭头图标
                                    break;
                                case 8:
                                    $(item).attr("href", "/html/store/myCredits.html"); // 唐果明细
                                    //$("#lookinfo").attr("href", "/html/store/myCredits.html");//唐果明细
                                    break;
                                case 9:
                                    $(item).attr("href", "/html/my/mymitteilung.html"); // 第三方券码
                                    ($(item).find(".rewardname").html() || "").length > 13 && $(item).find(".rewardnamehtml").css("line-height", "1.8"); // 可能会换行
                                    break;
                            }
                        }
                    });
                }
            });
            setTimeout(function() {
                if (getMonDate().Format("MM/dd") == CURRENT_MONDAY.Format("MM/dd")) {
                    $(".usersigndiv").show(); //签到按钮
                    if (data.leaksignday == 0) {
                        $("#leaksignhtml").css("visibility", "visible").html("本周已签满，邀请好友可获得更多的福利哦>>");
                    } else {
                        $("#leaksignhtml").css("visibility", "visible");
                        $("#leaksignday").html(data.leaksignday); //漏签天数
                    }
                }
            }, 500);


            //没有签到的数据和当前周比较,历史未签显示'漏签'，本周未签显示'补签抽大奖'
            var signa = $(".signa");
            $.each(signa, function(index, item) {
                var _CURRENT_MONDAY = new Date(CURRENT_MONDAY.Format("yyyy/MM/dd 00:00"));
                var lineDate = new Date($(item).data("bind"));
                var $item = $(item);
                if (_CURRENT_MONDAY > lineDate) //小于当前时间的为漏签
                {
                    $item.find(".roll-box").addClass("miss-logen");
                    $item.addClass("miss-logena");
                    $item.find(".rewardname").text("漏签");
                    $("#weekhtml").hide();
                    $(".weekdrawhtml").show();
                } else if (CURRENT_TODAY > lineDate) {
                    $item.find(".roll-box").addClass("miss-logen");
                    $item.addClass("miss-logena");
                    $item.find(".rewardname").text("补签抽大奖");
                } else if (CURRENT_TODAY <= lineDate) {
                    $(item).find("i.icon-right").hide();
                }
            });
            //历史周末显示奖品或漏签
            if (new Date($("#week").data("bind")) < CURRENT_TODAY) {
                $("#weekhtml").hide();
                $(".weekdrawhtml").show();
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

//获取data属性
var getDataValue = function(target) {
    var targetElement = $("");
    $(".signlista").each(function(i, item) {
        if ($(item).data("bind") == target.replace(/-/g, '/')) {
            targetElement = $(item);
            return false;
        }
    });
    return targetElement;
}

//签到
var sign = function() {
    var signtext = $user_sign.html();
    //签到
    if (signtext == "签到") {
        var url = "/StoreServices.svc/user/signdaynew";
        $.AkmiiAjaxPost(url, {}).then(function(data) {
            if (data.result) {
                $(".mask").show(); //遮罩
                $("#signsuccess").show(); //弹框
                if (data.rewardtype == 7) {
                    $("#lookinfo").html("确定");
                    $("#signsuccess").find("p").html("恭喜您 获得了" + data.rewardname + "<br>奖励将在下个月15日之前，直接发放至您的手机账户中" + "<br>" + data.tipdesc);
                }
                if (data.rewardtype == 9) { // 第三方券码
                    $("#signsuccess").find("p").html("恭喜您 获得了" + data.rewardname + "<br>" + data.tipdesc);
                } else {
                    $("#getrewardname").html(data.rewardname);
                    $("#tipdesc").html(data.tipdesc);
                }
                rewardlink(data.rewardtype);
                getSignList();
                share();
            } else if (data.errorcode == 'missing_parameter_accountid') {
                $.Loginlink();
                return;
            } else if (data.errorcode == "99999") {
                $.confirmF("您当天在投金额未满一千元，不能参与签到！", "取消", "去投资", null, function() {
                    window.location.replace("/html/product/index.html");
                });
            } else {
                $.alertF(data.errormsg);
            }
        });
    } else {
        leaksign(); //补签
    }
};

//计算周日历显示日期
var initMonth = function() {
    var _monday_date = getMonDate();
    var _sunday_date = new Date(_monday_date).addDays(6);
    //获取月份
    var month = _monday_date.getMonth() + 1;
    if (CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
        month = today.getMonth() + 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    $(".mounth").text(month + "月");
    for (var start = _monday_date; start.getTime() <= _sunday_date.getTime(); start.addDays(1)) {
        var _day = start.getDay();
        var _date = start.getDate();
        $(".num1").eq(_day == 0 ? 6 : (_day - 1)).text(_date);
        $(".signlista").eq(_day == 0 ? 6 : (_day - 1)).data("bind", start.Format("yyyy/MM/dd"));
    }
    getSignList();
}

//计算出周一的日期
function getMonDate() {
    var _today = new Date(today);
    var _day = _today.getDay();
    var _monday = _today.addDays(_day == 0 ? (-6) : (1 - _day));
    return new Date(_monday);
}

//点击签到
$sign_div.click(function() {
    if ((new Date().getDay()) == 0) {
        window.location.href = "/html/my/user-sunday-sign-rewardlist.html"; //抽大奖页面
        return;
    }
    sign();
});

//点击上一周
$(".last-week").click(function() {
    clearinfo();
    $("#leaksignhtml").css("visibility", "hidden"); //漏签信息隐藏
    $(".usersigndiv").hide(); //签到按钮
    today = new Date(today.addDays(-7));
    if (CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
        $(".next-week").addClass("font-col-b9b9b9");
    } else {
        $(".next-week").removeClass("font-col-b9b9b9");
    }
    //当前时间减7天
    initMonth();
});
//点击下一周
$(".next-week").unbind("click").bind("click", function() {
    if (CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
        return;
    }
    clearinfo();
    //当前时间加7天
    today = new Date(today.addDays(7));
    if (getMonDate().Format("MM/dd") == CURRENT_MONDAY.Format("MM/dd")) {
        $(".next-week").addClass("font-col-b9b9b9");
        $(".weekdrawhtml").hide(); //周日奖品名称模块隐藏
        $("#weekhtml").show(); //周日抽大奖文字显示
    }
    initMonth();
});

//清除
function clearinfo() {
    $(".signlista").removeClass("signa"); //清空signa(用于判断没有签到的数据)
    $(".signlista").attr("href", "javascript:void(0)"); //清空a标签链接
    $(".signlista").removeClass("miss-logena"); //清空漏签变量
    $(".signlista").addClass("signa"); //漏签标志
    $(".signlista").find("i.icon-right").show(); //箭头icon
    $(".signcss").removeClass("logen"); //清空旧样式
    $(".signcss").removeClass("miss-logen"); //清空旧样式
    $(".rewardnamehtml").show(); //奖品模块显示
    $(".rewardname").html(""); //清空旧数据
    $(".leaksignreward").hide(); //清空补签模板
}

//判断奖品链接跳转
function rewardlink(rewardtype) {
    switch (rewardtype) {
        case 1:
            $("#lookinfo").attr("href", "/Html/My/myreward-bonus.html"); //代金券
            break;
        case 2:
            $("#lookinfo").attr("href", "/Html/My/myreward-ticket.html"); //加息券
            break;
        case 3:
            $("#lookinfo").attr("href", "/Html/My/financiallist.html"); //理财金
            break;
        case 4:
            $("#lookinfo").attr("href", "/Html/My/myreward-money.html"); //现金奖励
            break;
        case 5:
            $("#lookinfo").attr("href", "/html/My/add-address.html"); //实物奖
            break;
        case 6:
            //暂时没有以后可扩展
            //福利券
            break;
        case 7:
            $("#lookinfo").attr("href", "javascript:closeTip();"); //流量
            break;
        case 8:
            $("#lookinfo").attr("href", "/html/store/myCredits.html"); //唐果明细
            break;
        case 9:
            $("#lookinfo").attr("href", "/html/my/mymitteilung.html"); // 第三方券码
            break;
    }
}

//补签
$("#gobuyproduct").click(function() {
    var url = "/StoreServices.svc/user/updatesignday";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            window.location.href = "/html/product/index.html"; //定期理财列表
        }
    });
});

//漏签行点击
$(document).on("click", ".miss-logena", function() {
    if (CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
        leaksign();
    }
});

//补签弹窗
function leaksign() {
    if (parseInt(leaksignday) <= 0) {
        return;
    }
    $("#nosign").show();
    $(".mask").show();
    $("#leaksignz").html(leaksignday); //漏签天数
    $("#buymoney").html((leaksignday * 1000)); //定期投资多少钱
}

$rule_switch.click(function() {
    $rule_content.toggle();
    $("#rule-arrow").toggleClass("rotatedeg");
    if ($rule_content.is(":visible")) {
        $("html,body").animate({ scrollTop: $("html").height() }, 1000);
    }
});

$("#close").click(function() {
    $("#weekdiv").hide();
    $(".mask").hide();
}); //关闭

$(".signlista").click(function() {
    if (this.id == "week" && CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
        var _href = $(this).attr("href") || "javascript:void(0)";
        if (_href == "javascript:void(0)") {
            window.location.href = "/html/my/user-sunday-sign-rewardlist.html?luckday=" + luckday; //抽大奖页面
        } else {
            window.location.href = _href;
        }
    } else {
        var _href = $(this).attr("href") || "javascript:void(0)";
        if (_href == "javascript:void(0)") {
            return;
        } else {
            window.location.href = _href;
        }
    }
});

function share() {
    var url = "/StoreServices.svc/user/getsigninsharefriendconfig";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            var model = data.signinsharemodel;
            luckday = model.signinturntabledate;
            jsondata = {
                'link': window.location.origin + '/html/anonymous/sigin-invitation.html?c=' + account.referralcode,
                'title': model.rewardmemo, // 分享标题
                'desc': '' + model.content + '',
                'imgUrl': 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
            };
            $.getWechatconfig("activityshare", Success, sharecallback, jsondata);
        }
    });
}

//分享补签一次
function Success() {
    var url = "/StoreServices.svc/user/sharefriendsignup";
    $.AkmiiAjaxPost(url, {}).then(function(data) {
        sharecallback();
        if (data.result) {
            getSignList();
            if (leaksignday == 1) {
                $.alertT("小僧已为您补签1天", "保持每日签到的良好习惯，即有机会在周日抽中大奖哦！", "确定");
            } else if (leaksignday > 1) {
                $.alertT("小僧已为您补签1天,剩余" + parseInt(leaksignday - 1) + "天漏签", "今天单笔投资定期理财产品达" + parseInt(leaksignday - 1) * 1000 + "元 即可补完本周漏签！参加周日赢大奖！", "去投资", linkinvest);
            }
        } else {
            if (leaksignday == 0) {
                $.alertT("您本周已签满", "据说分享次数多的人，能够提升中大奖的机率哦！", "确定");
            } else {
                $.alertT("分享补签机会已用完，剩余" + leaksignday + "天漏签", "今天单笔投资定期理财产品达" + leaksignday * 1000 + "元 即可补完本周漏签！参加周日赢大奖！", "确定");
            }
        }
    });
}

function linkinvest() {
    window.location.href = "/html/product/index.html";
}

$("#lookreward").click(function() {
    window.location.href = "/html/my/user-sign-rewardlist.html";
});

$("#leaksignhtml").click(function() {
    if (type == "ios") {
        jsondata.callback = "Success";
        jsondata.failback = "sharecallback";
        //JS 调用本地分享方法
        PhoneMode.callShare(jsondata);
    } else if (type == "android") {
        jsondata.callback = "Success";
        jsondata.failback = "sharecallback";
        //JS 调用本地分享方法
        window.PhoneMode.callShare(JSON.stringify(jsondata));
    } else {
        $(".sharemask").show();
        setTimeout(function() {
            $(".share_icon").show();
        }, 500);
    }
});

// $(".sharemask").click(function () {
//     $(".sharemask").hide();
// })

function sharecallback() {
    $(".sharemask").hide();
    $(".share_icon").hide();
}