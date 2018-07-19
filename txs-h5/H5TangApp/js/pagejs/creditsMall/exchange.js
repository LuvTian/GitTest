var addressId, itemCount, transportFee, present, pointDiscount;
var userId = $.getCookie("userid"); //用户ID
var promotionType = $.getQueryStringByName("promotionType") || ''; //活动类型
var allPoint = $.getLS("points") ? $.getLS("points") : 0; //当前用户唐果
var flag1 = 1;
var appkey = $.getQueryStringByName("appkey") || '';
var apptype = $.getQueryStringByName("type") || '';
var activityId = $.getQueryStringByName("activityId") || ''; //活动id
var product_id = $.getQueryStringByName("id") || $.getQueryStringByName("pid"); //当前产品的id

isfrmApp(apptype);
// 新增判断是否从app跳转过来的
function isfrmApp(type) {
    // length==1说明直接打开当前页面
    var isapp = history.length == 1 ? 1 : 0;
    // alert(history.length + "::" + getisApp());
    // 只有在app里才能进去
    if (type == "ios" || type == "android") {
        if (isapp) {
            $.setCookie("isapp", isapp);
        }
    }
    // if(isapp){
    //     $.setCookie("isapp",isapp);
    // }else{
    //     $.setCookie("isapp",)
    // }
}

// 获取是否在直接从app打开
function getisApp(isdel) {
    var isapp = $.getCookie("isapp");
    // 一返回就删除掉
    if (isdel) {
        $.delCookie("isapp");
    }
    return !!isapp;
}
//唐果兑换
function exchange(name, point, itemId, itemPrice, itemType, activityId, virtualAmount, unit) {
    var addressId2 = addressId ? addressId : ''; //地址id
    var itemCount2 = itemCount ? itemCount : 1; //商品数量
    var transportFee2 = transportFee ? transportFee : 0; //运费
    var present2 = present ? present : ""; //赠品
    var pointDiscount2 = pointDiscount ? pointDiscount : "0"; //优惠唐果?
    if (flag1 != 0) {
        if (itemType == "PHYSICAL") {
            type2 = "physical";
            win_content = "<b style='font-size:0.682667rem;color:#333;'>唐果兑换</b><span>兑换" + name + "，花费" + point + "唐果</span>";
        } else {
            type2 = "virtual";
            win_content = "<b style='font-size:0.682667rem;color:#333;'>唐果兑换</b><span>兑换" + name + "，花费" + point + "唐果</span>"
        }
        if (!$.CheckToken() && appkey == "") {
            // if (!!window.PhoneMode) {
            // 	//alert("app"+PhoneMode)
            // 	PhoneMode.callLogin("");
            // } else {
            // 	$.Loginlink(); //未登录状态跳到登录页
            // }
            if (apptype == "ios") {
                PhoneMode && PhoneMode.callLogin("");
            } else if (apptype == "android") {
                window.PhoneMode && window.PhoneMode.callLogin("");
            } else {
                $.Loginlink(); //未登录状态跳到登录页
            }
        } else {
            //获取用户唐果
            //var apiUrl_prefix="http://192.168.90.182:8090";
            // apiUrl_prefix = "http://192.168.107.236:8090";
            var data = {
                "id": userId
            };
            $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", data, false).then(function(d) {
                if (d.code == 200) {
                    allPoint = d.data.points;
                    if (Number(allPoint) < Number(point)) {
                        flag1 = 0;
                        // win("您的唐果不足");
                        // setTimeout("close()", 1000);
                        $.confirmF("施主，唐果不足。提升您的会员等级或去完成签到可获取更多唐果哦~", '看看其他', '提升等级', function() {
                            if (getisApp(true)) {
                                // 杀掉当前的webview
                                if (apptype == "ios") {
                                    PhoneMode && PhoneMode.appGoBackWithStirng("");
                                } else if (apptype == "android") {
                                    window.PhoneMode && window.PhoneMode.callClosePage("");
                                } else {
                                    window.history.go(-1);
                                }
                            } else {
                                window.history.go(-1);
                            }
                        }, function() {
                            if (apptype == "ios") {
                                PhoneMode.jumpAppWithString({ 'controller': 'InvestmentViewController' })
                            } else if (apptype == "android") {
                                window.PhoneMode.callToPage("MainActivity", "licai");
                            } else {
                                window.location.href = "/html/product/index.html";
                            }
                        })
                    } else {
                        $.confirmF(win_content, "取消", "确认兑换", function() {}, function() {
                            flag1 = 0;
                            // var apiUrl_prefix = "http://192.168.107.236:8999";
                            var Data = {
                                "channel": "",
                                "itemCount": itemCount2,
                                "itemId": itemId,
                                "userId": userId,
                                "addressId": addressId2,
                                "transportFee": transportFee2,
                                "present": present2,
                                "subChannel": "",
                                "activityId": activityId,
                                "platform": "H5"
                            }
                            $.AkmiiAjaxPost(apiUrl_prefix + "/boost/trade", Data, true).then(function(d) {
                                if (d.code == 2) {
                                    win(d.message);
                                    setTimeout("close()", 1000);
                                } else if (d.code == 6) {
                                    $.confirmF(d.message, '看看其他', '知道啦', function() {
                                        flag1 = 1;
                                        window.location.href = "/html/store/welfare_center.html?category=" + type2;
                                    }, function() {
                                        flag1 = 1;
                                    })
                                } else if (d.code == 1) {
                                    $.confirmF(d.message, '取消', '去投资', function() {
                                        flag1 = 1;
                                    }, function() {
                                        flag1 = 1;
                                        window.location.href = "/html/product/index.html";
                                    }, function() {})
                                } else if (d.code == 7) {
                                    $.confirmF(d.message, '看看其他', '去投资', function() {
                                        flag1 = 1;
                                        window.location.href = "/html/store/welfare_center.html?category=" + type2;
                                    }, function() {
                                        flag1 = 1;
                                        window.location.href = "/html/product/index.html";
                                    })
                                } else if (d.code == 8) {
                                    $.confirmF(d.message, '看看其他', '提升等级', function() {
                                        if (getisApp(true)) {
                                            // 杀掉当前的webview
                                            if (apptype == "ios") {
                                                PhoneMode && PhoneMode.appGoBackWithStirng("");
                                            } else if (apptype == "android") {
                                                window.PhoneMode && window.PhoneMode.callClosePage("");
                                            } else {
                                                window.history.go(-1);
                                            }
                                        } else {
                                            window.history.go(-1);
                                        }
                                    }, function() {
                                        if (apptype == "ios") {
                                            PhoneMode.jumpAppWithString({ 'controller': 'InvestmentViewController' })
                                        } else if (apptype == "android") {
                                            window.PhoneMode.callToPage("MainActivity", "licai");
                                        } else {
                                            window.location.href = "/html/product/index.html";
                                        }
                                    })
                                } else if (d.code == 200) { //兑换成功
                                    // alert(promotionType+"555555")
                                    if (!!promotionType && promotionType != "null") {
                                        if (itemType == "FINANCIAL") { //理财金
                                            successWin(d.message);
                                            //setTimeout("closeGo()", 1000);
                                        } else if (itemType == "INTEREST") { //加息券
                                            successWin(d.message);
                                            //setTimeout("closeGo()", 1000);
                                        } else if (itemType == "COUPON") { //代金券
                                            successWin(d.message);
                                            //setTimeout("closeGo()", 1000);
                                        } else if (itemType == "PHYSICAL") { //实物兑换
                                            successWin(d.message);
                                            //setTimeout("closeGo()", 1000);
                                            //$.setCookie("type", "PHYSICAL"); //实物类型保存在cookie中
                                            //closeGoPhsy();

                                        } else {
                                            successWin(d.message);
                                            //setTimeout("closeGo()", 1000); //兑换记录
                                        }
                                    } else {
                                        if (itemType == "FINANCIAL") { //理财金
                                            win(d.message);
                                            setTimeout("closeGo()", 1000);
                                        } else if (itemType == "INTEREST") { //加息券
                                            win(d.message);
                                            setTimeout("closeGo()", 1000);
                                        } else if (itemType == "COUPON") { //代金券
                                            win(d.message);
                                            setTimeout("closeGo()", 1000);
                                        } else if (itemType == "PHYSICAL") { //实物兑换
                                            win(d.message);
                                            setTimeout("closeGo()", 1000);
                                            //$.setCookie("type", "PHYSICAL"); //实物类型保存在cookie中
                                            //closeGoPhsy();

                                        } else {
                                            win(d.message);
                                            setTimeout("closeGo()", 1000); //兑换记录
                                        }
                                    }
                                } else {
                                    flag1 = 1;
                                    $.alertF(d.message, "确定", function() {
                                        //window.location.reload();
                                        window.location.href = "/html/store/welfare_center.html?category=physical";
                                    });

                                }

                            })

                        })
                    }
                }

            });
            // _gsq.push(['H','GWD-100354','GWD-002985','trackEvent',window.referralCode,'我要兑换',name])//国双代码
        }
    }




    var e = window.event;
    e.stopPropagation();
    //alert(1);

}
//兑换成功提示弹框
function successWin(content) {
    var winContent = "<div><img src='/css/img2.0/pointImg/success.png' class='success_pic' /><h3 class='successWin_title'>兑换成功</h3><span class='successWin_content'>" + content + "</span></div>"
    $.confirmF(winContent, "取消", "分享", function() {
        window.location.href = "/html/store/activityarea.html"
    }, function() {
        $.AkmiiAjaxPost(apiUrl_prefix + "/members/referralcode", {
            "accountId": userId
        }, true).then(function(data) {
            if (data.code == 200) {
                referralCode = data.data.referralcode; //邀请码
                exchangeAboutShare();
                exchangeShareDate();
                if (apptype == 'ios') {
                    //PhoneMode && PhoneMode.callShare(jsondata);
                    PhoneMode.callShare(jsondata);
                } else if (apptype == 'android') {
                    //window.PhoneMode && window.PhoneMode.callShare(jsondata);
                    window.PhoneMode.callShare(JSON.stringify(jsondata));
                } else {
                    $(".mask").removeClass("no_mask");
                    $(".share_remind").show();
                    exchangeAboutShare();
                }
            }
        })
    });
}
$(".JS_remind_icon").click(function() {
    $(".mask").addClass("no_mask");
    $(".share_remind").hide();
})

function exchangeShareDate() { //
    //var href = window.location.href.replace("appkey", "yui");
    var href = window.location.origin + "/html/store/integralmall.html?apptype=" + apptype + "&id=" + product_id + "&category=" + type2;
    //var refcode = referralCode ? (href.indexOf('?') > -1 ? '&' : '?') + 'c=' + referralCode : ''; //如果用户是登录中则带上邀请码否则不带邀请码
    var refcode = (href.indexOf('?') > -1 ? '&' : '?') + 'shareLabel=share' + (referralCode ? '&c=' + referralCode : '');
    var urlLink = href + refcode;
    jsondata = {
        'title': '我在唐小僧发现了一个好东西，赶快来看看吧，唐果更多新玩法！',
        'desc': name,
        'imgUrl': imgUrl,
        'link': urlLink
    };

}

function exchangeAboutShare() {
    exchangeShareDate();
    //分享到朋友圈
    $.getWechatconfig("LuckdrawShare", Success, Fail, jsondata);
}
//分享成功
var Success = function() {
    $.alertF("分享成功");
};
//分享失败
var Fail = function() {
    $.alertF("分享失败，请稍后重试！");
}

//页面浮层
function win(data) {
    var content = [];
    content.push('<div class="float_layer"><span>' + data + '</span></div>');
    var html = $(content.join(""));
    $("body").append(html);

}
//关闭页面浮层
function close() {
    $(".float_layer").remove();
    flag1 = 1;
}

function closeGoPhsy() { //实物兑换跳到收货地址列表页
    flag1 = 1;
    //$(".float_layer").remove();
    window.location.href = "/html/my/addresslist.html";
}

function closeGo() { //跳兑换记录页面
    flag1 = 1;
    $(".float_layer").remove();
    window.location.href = "/html/store/convert_record.html?category=" + type2;
}

function closeGo1() { //跳代金券页面
    $(".float_layer").remove();
    window.location.href = "/html/my/myreward-bonus.html";
}

function closeGo2() { //跳加息券页面
    $(".float_layer").remove();
    window.location.href = "/html/my/myreward-ticket.html";
}

function closeGo3() { //跳理财金页面
    $(".float_layer").remove();
    window.location.href = "/html/product/product-financialbuylist.html";
}