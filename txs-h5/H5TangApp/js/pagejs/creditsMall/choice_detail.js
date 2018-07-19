var imgUrl;
var type = $.getQueryStringByName("category");
var userId = $.getCookie("userid"); //用户ID
var apptype = $.getQueryStringByName('type');
var appkey = $.getQueryStringByName("appkey");
var shareLabel = $.getQueryStringByName("shareLabel"); //用来判读打开的链接是否是通过分享过来
var category = $.getQueryStringByName("category"); //当前产品的类型
var product_id = $.getQueryStringByName("id"); //当前产品的id
var referralCode; //邀请码
var jsondata;
var H = $(document).height();
var lastPoint = "0";
var originPoint = "0";
var discount = "0";
var promotionType = ""; //判断是折扣商品还是活动商品
var checked_activityId = "";
var type2 = "";
var point = "";
// apiUrl_prefix = "http://192.168.107.236:8999";
$(function() {
    //价格保留两位小数点处理
    template.helper("pricefixed", function(price) {
        var strPrice = price + "";
        if (strPrice.indexOf(".") != -1) {
            var price = price.toFixed(2);
        } else {
            var price = price + ".00";
        }

        return price;
    });
    template.helper("dataSort", function(memberLevel) {
        return memberLevel.sort(function(a, b) {
            return (a.levelId - b.levelId);
        })
    })
    template.helper("vround", function(number) {
        return typeof number === "number" ? Math.round(number) : 0;
    })
    imgsUrl();
    isfrmApp(apptype);
    //点击返回顶部按钮的效果
    $(".to_top").click(function() {
        // $(".to_top").hide();
        $("body,html").animate({
            // scrollTop: -$(".pic_detail").offset().top
            scrollTop: 0
        }, 500)
    })

    function imgsUrl() {
        //不同环境静态图片位置
        window.imgUrl_hostname = "http://txsh5.zbjf.com";
        window.imgUrl_host = window.location.hostname;
        if (imgUrl_host == "tservice.txslicai.com.cn") {
            imgUrl_hostname = "https://tservice.txslicai.com.cn";
        } else if (imgUrl_host == "tservice.txslicai.com") {
            imgUrl_hostname = "https://tservice.txslicai.com";
        } else if (imgUrl_host == "accept.txslicai.com") {
            imgUrl_hostname = "https://accept.txslicai.com";
        } else if (imgUrl_host == "xysaccept.txslicai.com") {
            imgUrl_hostname = "https://xysaccept.txslicai.com";
        } else if (imgUrl_host == "service.txslicai.com" || apiUrl_host == "service.txslicai.com.cn") {
            imgUrl_hostname = "https://txsres.txslicai.com";
        } else {
            imgUrl_hostname = "http://txsh5.zbjf.com";
        }
    }
    //判断当前用户是否有资格享受优惠活动接口
    function activityChecked(discount, product_type) {
        if (product_type == "PHYSICAL") {
            type2 = "physical";
        } else {
            type2 = "virtual";
        }
        var Data = {
            "activityId": activityId,
            "itemId": product_id,
            "userId": userId
        }
        $.AkmiiAjaxPost(apiUrl_prefix + "/boost/canusepromotion", Data, true).then(function(data) {
            if (data.code == 200) {
                var defaultCheck = data.data ? data.data.defaultCheck : "";
                var message = data.data ? data.data.message : "";
                if (defaultCheck) {
                    $(".check_box").addClass("choose_check");
                    $(".input_check").attr("checked", true);
                    $(".JS_discount").html('优惠<b class="price_red">' + discount + '</b> 唐果');
                    lastPoint = originPoint - discount;
                } else {
                    $(".check_box").removeClass("choose_check");
                    $(".input_check").attr("checked", false);
                    $(".JS_discount").html("无任何优惠");
                    lastPoint = originPoint;
                    $(".check_box").click(function() {
                        $(".check_box").removeClass("choose_check");
                        $(".input_check").attr("checked", false);
                        $(".JS_discount").html("无任何优惠");
                        if (data.data.code == 1) {
                            $.confirmF(data.data.message, '取消', '去投资', function() {}, function() {
                                window.location.href = "/html/product/index.html";
                            }, function() {})
                        } else if (data.data.code == 6) {
                            $.confirmF(data.data.message, '看看其他', '知道啦', function() {
                                window.location.href = "/html/store/welfare_center.html?category=" + type2;
                            }, function() {})
                        } else if (data.data.code == 7) {
                            $.confirmF(data.data.message, '看看其他', '去投资', function() {
                                window.location.href = "/html/store/welfare_center.html?category=" + type2;
                            }, function() {
                                window.location.href = "/html/product/index.html";
                            })
                        } else if (data.data.code == 8) {
                            $.confirmF(data.data.message, '看看其他', '提升等级', function() {
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
                        }
                        // $.confirmF(message, "看看其他", "去投资", function() {
                        //     window.location.href = "/html/store/activityarea.html"; //活动列表页
                        // }, function() {
                        //     window.location.href = "/html/product/index.html"; //去投资跳到投资首页
                        // })
                    })
                }
            } else {
                $.alertF(data.message);
            }
        })
    }

    //产品详情接口
    //var data={"code":200,"message":"成功","isinglobalmaintenance":false,"data":{"id":"933527322076712960","itemType":"COUPON","brandId":null,"categoryId1":1,"categoryId2":861411173814267904,"categoryId3":null,"name":"接口-累计-非","code":"virtualGYSXN000024","outerCode":"","homepageImgUrl":null,"mainImgUrl":null,"imgUrl":null,"descImg":null,"merchantId":907155362484936704,"itemCanPointPay":true,"pointPayAmount":99000,"pointDiscount":0,"inventory":95,"marketPrice":999.00,"salesPrice":990.00,"purchasePrice":900.00,"length":null,"width":null,"height":null,"volume":null,"useRule":"","exchangeDesc":"","description":null,"sortValue":0,"itemStatus":"DOWN","virtualConfigId":"5219355440410636873","virtualAmount":"15","unit":"元","virtualDesc1":"起投金额1000","virtualDesc2":"","createTime":"2017-11-23 10:47:12","modifyTime":"2017-11-30 00:33:43","version":6,"token":"TXS1511924696995","exchangeLimitOpen":true,"exchangeLimitAmount":300,"exchangeLimitType":"DAY","exchangeEndtime":null,"merchantName":"GYS虚拟","h5Url":"https://xysaccept.txslicai.com/Html/store/pic_detail.html?itemId=933527322076712960","tags":[{"type":0,"tag":"满减","code":null},{"type":1,"tag":"每日限300份","code":null}],"activityExchangeLimit":-1,"originPoint":"99000","afterPoint":"98850","discount":"150","amountThreshold":100000,"limitNum":null,"discountDesc":"条件：2017-11-24至2017-11-30日期间黄金新增累计满减投资定期60天以上理财产品100,000元，优惠150唐果","activityRule":"条件：{0}日期间{1}新增{2}投资定期{3}理财产品{4}元，优惠{5}唐果","discountsConfig":[{"level":"0","levelName":"普通","threshold":1000,"discountType":"DEDUCTION","discountValue":10,"limitNum":-1},{"level":"1","levelName":"青铜","threshold":900,"discountType":"DEDUCTION","discountValue":50,"limitNum":-1},{"level":"2","levelName":"白银","threshold":800,"discountType":"DEDUCTION","discountValue":100,"limitNum":-1},{"level":"3","levelName":"黄金","threshold":100000,"discountType":"DEDUCTION","discountValue":150,"limitNum":-1},{"level":"4","levelName":"铂金","threshold":600,"discountType":"DEDUCTION","discountValue":200,"limitNum":-1}],"promotionType":"TOTAL_REDUCTION","promotionConfigId":"933528024219979776"},"reason":null}
    $.AkmiiAjaxGet(apiUrl_prefix + "/items/" + product_id, true).then(function(data) {
        if (data.code == 200) {
            activityId = data.data ? data.data.promotionConfigId : ""; //活动id
            //promotionType = data.data.promotionType; //活动类型
            var productDetail = data.data || "";
            promotionType = productDetail.promotionType;
            var pic_list = productDetail.descImg ? JSON.parse(productDetail.descImg) : ""; //图文详情的图片路径
            name = productDetail.name; //商品名称
            var source = $("#productDetail").html();
            var render = template.compile(source);
            var product_type = productDetail.itemType; //产品类型
            var activityRule = productDetail.activityRule; //活动规则
            originPoint = productDetail.originPoint; //商品原始价格
            point = productDetail.originPoint;
            discount = productDetail.discount; //优惠价格
            if (product_type == 'PHYSICAL') {
                imgUrl = productDetail.imgUrl || (imgUrl_hostname + "/css/img2.0/pointImg/share_icon.jpg"); //
            } else {
                imgUrl = imgUrl_hostname + "/css/img2.0/pointImg/share_icon.jpg";
            }

            var html = render({
                productDetail: productDetail,
                list: pic_list || [],
                userid: userId
            });
            $(".productDetail").append(html);
            $(".pull_view").click(function() {
                    $(".pull_view").hide();
                    $(".pic_detail").show();
                    $("body,html").animate({
                        scrollTop: $(".pic_detail").offset().top
                    }, 500)
                    if ($(document).height() > $(window).height()) {
                        $(".to_top").show();
                        //监听图文详情出现后的滚动
                        $(document).on("scroll", function() {
                            if ($(".pic_detail").css("display") == "block") {
                                // 如果置顶了
                                if ($(window).scrollTop() <= 0) {
                                    $(".to_top").hide();
                                } else if (H + $(window).scrollTop() > $(window).height()) {
                                    $(".to_top").show();
                                }
                                // if ((H > $(window).height() && H > $(document).height()) || ((H + $(window).scrollTop()) > $(window).height())) {
                                //     $(".to_top").show();alert(1)
                                // } else {
                                //     $(".to_top").hide();alert(2)
                                // }
                            }
                        })
                    }
                })
                // if (promotionType == "TOTAL_REDUCTION" || promotionType == "SINGLE_REDUCTION") {
                // $(".JS_discount").html("无任何优惠");
                // lastPoint = originPoint;
                // }else  if (promotionType == "DISCOUNT" || promotionType=="EXCLUSIVE"){
                // 	lastPoint=originPoint-discount;
                // }
                ////优惠唐果的选择
            $(".check_box").click(function() {
                    checkCandy(productDetail.discount);
                })
                //优惠活动问号点击弹出规则框
            $(".JS_question").click(function() {
                    $(".mask").removeClass("no_mask");
                    $(".activity_rule").addClass("activity_sacle");
                    $("body").addClass("no_scroll");
                })
                //弹窗关闭按钮
            $(".JS_close").click(function() {
                $(".mask").addClass("no_mask");
                $(".activity_rule").removeClass("activity_sacle");
                $("body").removeClass("no_scroll");
            })
            if (!$.CheckToken() && appkey == "") {
                AboutShare();
                shareDate();
                // setTimeout(function () {
                share_btn();
                // }, 1000);

                //点击分享按钮调用分享
                $(".J_share").click(function() {
                    if (apptype == 'ios') {
                        //PhoneMode && PhoneMode.callShare(jsondata);
                        PhoneMode.callShare(jsondata);
                    } else if (apptype == 'android') {
                        //window.PhoneMode && window.PhoneMode.callShare(jsondata);
                        window.PhoneMode.callShare(JSON.stringify(jsondata));
                    }
                })

            } else {
                //获取邀请码
                //var apiUrl_prefix = "http://192.168.90.182:8090";
                $.AkmiiAjaxPost(apiUrl_prefix + "/members/referralcode", {
                    "accountId": userId
                }, true).then(function(data) {
                    if (data.code == 200) {
                        referralCode = data.data.referralcode; //邀请码
                        AboutShare();
                        shareDate();
                        // setTimeout(function () {
                        share_btn();
                        // }, 1000);
                        //点击分享按钮调用分享
                        $(".J_share").click(function() {
                            if (apptype == 'ios') {
                                //PhoneMode && PhoneMode.callShare(jsondata);
                                PhoneMode.callShare(jsondata);
                            } else if (apptype == 'android') {
                                //window.PhoneMode && window.PhoneMode.callShare(jsondata);
                                window.PhoneMode.callShare(JSON.stringify(jsondata));
                            }
                        })
                    }
                })
            }
            //用户登录还是没有登录优惠唐果显示
            if (promotionType == "TOTAL_REDUCTION" || promotionType == "SINGLE_REDUCTION") {
                $(".JS_discount").html("无任何优惠");
                if (!$.CheckToken() && appkey == "") {
                    $(".check_box").removeClass("choose_check"); //没登录时默认优惠选框不勾选
                    $(".input_check").attr("checked", false);
                    $(".JS_discount").html("无任何优惠");
                    lastPoint = originPoint;
                    $(".check_box").click(function() {
                        if (apptype == "ios") {
                            PhoneMode && PhoneMode.callLogin("");
                        } else if (apptype == "android") {
                            window.PhoneMode && window.PhoneMode.callLogin("");
                        } else {
                            $.Loginlink(); //未登录状态跳到登录页
                        }
                    });
                } else {
                    activityChecked(productDetail.discount, product_type);
                }
            } else if (promotionType == "DISCOUNT" || promotionType == "EXCLUSIVE") {
                lastPoint = originPoint - discount;
            } else {
                lastPoint = productDetail.pointPayAmount;
            }
            actRule(activityRule);

            $(".JS_exchange_virtualbtn").click(function() {
                if (promotionType == "TOTAL_REDUCTION" || promotionType == "SINGLE_REDUCTION") {
                    if ($(".input_check").attr("checked") == "checked") {
                        checked_activityId = activityId;
                    } else {
                        checked_activityId = "";
                    }
                } else if (promotionType == "DISCOUNT" || promotionType == "EXCLUSIVE") {
                    checked_activityId = activityId;
                }
                if (!$.CheckToken() && appkey == "") {
                    if (apptype == "ios") {
                        PhoneMode && PhoneMode.callLogin("");
                    } else if (apptype == "android") {
                        window.PhoneMode && window.PhoneMode.callLogin("");
                    } else {
                        $.Loginlink(); //未登录状态跳到登录页
                    }
                } else {
                    // var apiUrl_prefix = "http://192.168.107.236:8090";
                    var data = {
                            // "activityId": activityId,
                            "activityId": checked_activityId,
                            "itemId": product_id,
                            "userId": userId
                        }
                        //确认兑换接口
                    $.AkmiiAjaxPost(apiUrl_prefix + "/boost/validate", data, false).then(function(data) {
                        if (data.code == 200) {
                            exchange(productDetail.name, lastPoint, productDetail.id, productDetail.originPoint, productDetail.itemType, checked_activityId, productDetail.virtualAmount, productDetail.unit);
                            _hmt.push(['_trackEvent', 'Integral Mall', 'Btn_Details_Exchange', '详情-我要兑换', '详情-我要兑换']);
                            // } else {
                            // 	$.confirmF(data.message, '取消', '去投资', function () {}, function () {
                            // 		window.location.href = "/html/product/index.html";
                            // 	})
                            // }
                        } else if (data.code == 2) {
                            win(data.message);
                            setTimeout("close()", 1000);
                        } else if (data.code == 6) {
                            $.confirmF(data.message, '看看其他', '知道啦', function() {
                                window.location.href = "/html/store/welfare_center.html?category=" + type2;
                            }, function() {})
                        } else if (data.code == 1) {
                            $.confirmF(data.message, '取消', '去投资', function() {}, function() {
                                window.location.href = "/html/product/index.html";
                            }, function() {})
                        } else if (data.code == 7) {
                            $.confirmF(data.message, '看看其他', '去投资', function() {
                                window.location.href = "/html/store/welfare_center.html?category=" + type2;
                            }, function() {
                                window.location.href = "/html/product/index.html";
                            })
                        } else if (data.code == 8) {
                            $.confirmF(data.message, '看看其他', '提升等级', function() {
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
                                // if(apptype == "ios"){
                                //     PhoneMode && PhoneMode.h5GoBack();
                                // }else{
                                //     window.history.go(-1);
                                // }
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
                            $.alertF(data.message, "确定", function() {
                                //window.location.reload();
                                window.location.href = "/html/store/welfare_center.html?category=physical";
                            });

                        }
                    })






                    // var data = {
                    //     "id": userId
                    // };
                    // $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", data, false).then(function(d) {
                    //     if (d.code == 200) {
                    //         allPoint = d.data.points;
                    //         if (Number(allPoint) < Number(point)) {
                    //             $.confirmF("施主，唐果不足。提升您的会员等级或去完成签到可获取更多唐果哦~", '看看其他', '提升等级', function() {
                    //                 if (getisApp(true)) {
                    //                     // 杀掉当前的webview
                    //                     if (apptype == "ios") {
                    //                         PhoneMode && PhoneMode.appGoBackWithStirng("");
                    //                     } else if (apptype == "android") {
                    //                         window.PhoneMode && window.PhoneMode.callClosePage("");
                    //                     } else {
                    //                         window.history.go(-1);
                    //                     }
                    //                 } else {
                    //                     window.history.go(-1);
                    //                 }
                    //                 // if(apptype == "ios"){
                    //                 //     PhoneMode && PhoneMode.h5GoBack();
                    //                 // }else{
                    //                 //     window.history.go(-1);
                    //                 // }
                    //             }, function() {
                    //                 if (apptype == "ios") {
                    //                     PhoneMode.jumpAppWithString({ 'controller': 'InvestmentViewController' })
                    //                 } else if (apptype == "android") {
                    //                     window.PhoneMode.callToPage("MainActivity", "licai");
                    //                 } else {
                    //                     window.location.href = "/html/product/index.html";
                    //                 }
                    //             })
                    //         } else {
                    //             // var apiUrl_prefix = "http://192.168.107.236:8999";
                    //             var data = {
                    //                     // "activityId": activityId,
                    //                     "activityId": checked_activityId,
                    //                     "itemId": product_id,
                    //                     "userId": userId
                    //                 }
                    //                 //确认兑换接口
                    //             $.AkmiiAjaxPost(apiUrl_prefix + "/boost/validate", data, false).then(function(data) {
                    //                 if (data.code == 200) {
                    //                     exchange(productDetail.name, lastPoint, productDetail.id, productDetail.originPoint, productDetail.itemType, checked_activityId, productDetail.virtualAmount, productDetail.unit);
                    //                     _hmt.push(['_trackEvent', 'Integral Mall', 'Btn_Details_Exchange', '详情-我要兑换', '详情-我要兑换']);
                    //                     // } else {
                    //                     // 	$.confirmF(data.message, '取消', '去投资', function () {}, function () {
                    //                     // 		window.location.href = "/html/product/index.html";
                    //                     // 	})
                    //                     // }
                    //                 } else if (data.code == 2) {
                    //                     win(data.message);
                    //                     setTimeout("close()", 1000);
                    //                 } else if (data.code == 6) {
                    //                     $.confirmF(data.message, '看看其他', '知道啦', function() {
                    //                         window.location.href = "/html/store/welfare_center.html?category=" + type2;
                    //                     }, function() {})
                    //                 } else if (data.code == 1) {
                    //                     $.confirmF(data.message, '取消', '去投资', function() {}, function() {
                    //                         window.location.href = "/html/product/index.html";
                    //                     }, function() {})
                    //                 } else if (data.code == 7) {
                    //                     $.confirmF(data.message, '看看其他', '去投资', function() {
                    //                         window.location.href = "/html/store/welfare_center.html?category=" + type2;
                    //                     }, function() {
                    //                         window.location.href = "/html/product/index.html";
                    //                     })
                    //                 } else {
                    //                     $.alertF(data.message, "确定", function() {
                    //                         //window.location.reload();
                    //                         window.location.href = "/html/store/welfare_center.html?category=physical";
                    //                     });

                    //                 }
                    //             })
                    //         }
                    //     }
                    // })
                }
            })
        } else {
            $.alertF(data.message)
        }
    })


})

//活动规则
function actRule(activityRule) {
    var ruleList = activityRule ? activityRule.split("\n") : [""];
    var ruleArr = [];
    for (var i = 0; i < ruleList.length; i++) {
        ruleArr.push('<li>' + ruleList[i] + '</li>')
    }
    ruleHtml = ruleArr.join('');
    $(".rule_list").html(ruleHtml);
}
//var allPoint = 5000; //当前用户唐果
//var point = 0;//当前兑换商
//判断是否显示分享按钮
function share_btn() {
    if ((apptype == "ios" || apptype == "android") && !shareLabel) {
        //if (!!PhoneMode && !shareLabel) {
        $(".J_share").show(); //分享按钮显示
        $("header .prize-desc p.title,header .prize-desc .desc-list").css("border-right", "1px solid #e5e5e5");
        $("header .prize-desc p.title").css({
            "width": "13rem",
            "padding-right": ".5rem"
        });
    } else {
        $(".J_share").hide();
        $("header .prize-desc p.title,header .prize-desc .desc-list").css("border-right", "0px solid #e5e5e5");
        $("header .prize-desc p.title").css({
            "width": "100%",
            "padding-right": "0"
        });

    }
}

function shareDate() { //
    //var href = window.location.href.replace("appkey", "yui");
    var href = window.location.origin + "/html/store/integralmall.html?apptype=" + apptype + "&id=" + product_id + "&category=" + category;
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

function AboutShare() {
    shareDate();
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

function returnDetail2(pid, point) {
    point = point;
    if (promotionType == "TOTAL_REDUCTION" || promotionType == "SINGLE_REDUCTION") {
        if ($(".input_check").attr("checked") == "checked") {
            checked_activityId = activityId;
        } else {
            checked_activityId = "";
        }
    } else if (promotionType == "DISCOUNT" || promotionType == "EXCLUSIVE") {
        checked_activityId = activityId;
    }
    if (!$.CheckToken() && appkey == "") {
        // if (!!PhoneMode) {
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
        // var apiUrl_prefix = "http://192.168.107.236:8090";
        var data = {
                // "activityId": activityId,
                "activityId": checked_activityId,
                "itemId": product_id,
                "userId": userId
            }
            //确认兑换接口
        $.AkmiiAjaxPost(apiUrl_prefix + "/boost/validate", data, false).then(function(data) {
            if (data.code == 200) {
                window.location.href = '/html/store/conform_exchange.html?pid=' + pid + '&point=' + point + '&activityId=' + checked_activityId + '&promotionType=' + promotionType;
                // } else {
                // 	$.confirmF(data.message, '取消', '去投资', function () {}, function () {
                // 		window.location.href = "/html/product/index.html";
                // 	}) 

            } else if (data.code == 2) {
                win(data.message);
                setTimeout("close()", 1000);
            } else if (data.code == 6) {
                $.confirmF(data.message, '看看其他', '知道啦', function() {
                    window.location.href = "/html/store/welfare_center.html?category=" + type2;
                }, function() {})
            } else if (data.code == 1) {
                $.confirmF(data.message, '取消', '去投资', function() {}, function() {
                    window.location.href = "/html/product/index.html";
                }, function() {})
            } else if (data.code == 7) {
                $.confirmF(data.message, '看看其他', '去投资', function() {
                    window.location.href = "/html/store/welfare_center.html?category=" + type2;
                }, function() {
                    window.location.href = "/html/product/index.html";
                })
            } else if (data.code == 8) {
                $.confirmF(data.message, '看看其他', '提升等级', function() {
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
                $.alertF(data.message, "确定", function() {
                    //window.location.reload();
                    window.location.href = "/html/store/welfare_center.html?category=physical";
                });

            }
        })


        // var data = {
        //     "id": userId
        // };
        // $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", data, false).then(function(d) {
        //     if (d.code == 200) {
        //         allPoint = d.data.points;
        //         if (Number(allPoint) < Number(point)) {
        //             $.confirmF("施主，唐果不足。提升您的会员等级或去完成签到可获取更多唐果哦~", '看看其他', '提升等级', function() {
        //                 if (getisApp(true)) {
        //                     // alert(document.referrer + "123")

        //                     // 杀掉当前的webview
        //                     if (apptype == "ios") {
        //                         PhoneMode && PhoneMode.appGoBackWithStirng("");
        //                     } else if (apptype == "android") {
        //                         window.PhoneMode && window.PhoneMode.callClosePage("");
        //                     } else {
        //                         window.history.go(-1);
        //                     }
        //                 } else {
        //                     // alert(document.referrer + "000")
        //                     window.history.go(-1);
        //                 }
        //                 // if(apptype == "ios"){
        //                 //     PhoneMode && PhoneMode.h5GoBack();
        //                 // }else{
        //                 //     window.history.go(-1);
        //                 // }

        //             }, function() {
        //                 if (apptype == "ios") {
        //                     PhoneMode.jumpAppWithString({ 'controller': 'InvestmentViewController' })
        //                 } else if (apptype == "android") {
        //                     window.PhoneMode.callToPage("MainActivity", "licai");
        //                 } else {
        //                     window.location.href = "/html/product/index.html";
        //                 }
        //             })
        //         } else {
        //             // var apiUrl_prefix = "http://192.168.107.236:8999";
        //             var data = {
        //                     // "activityId": activityId,
        //                     "activityId": checked_activityId,
        //                     "itemId": product_id,
        //                     "userId": userId
        //                 }
        //                 //确认兑换接口
        //             $.AkmiiAjaxPost(apiUrl_prefix + "/boost/validate", data, false).then(function(data) {
        //                 if (data.code == 200) {
        //                     window.location.href = '/html/store/conform_exchange.html?pid=' + pid + '&point=' + point + '&activityId=' + checked_activityId + '&promotionType=' + promotionType;
        //                     // } else {
        //                     // 	$.confirmF(data.message, '取消', '去投资', function () {}, function () {
        //                     // 		window.location.href = "/html/product/index.html";
        //                     // 	}) 

        //                 } else if (data.code == 2) {
        //                     win(data.message);
        //                     setTimeout("close()", 1000);
        //                 } else if (data.code == 6) {
        //                     $.confirmF(data.message, '看看其他', '知道啦', function() {
        //                         window.location.href = "/html/store/welfare_center.html?category=" + type2;
        //                     }, function() {})
        //                 } else if (data.code == 1) {
        //                     $.confirmF(data.message, '取消', '去投资', function() {}, function() {
        //                         window.location.href = "/html/product/index.html";
        //                     }, function() {})
        //                 } else if (data.code == 7) {
        //                     $.confirmF(data.message, '看看其他', '去投资', function() {
        //                         window.location.href = "/html/store/welfare_center.html?category=" + type2;
        //                     }, function() {
        //                         window.location.href = "/html/product/index.html";
        //                     })
        //                 } else {
        //                     $.alertF(data.message, "确定", function() {
        //                         //window.location.reload();
        //                         window.location.href = "/html/store/welfare_center.html?category=physical";
        //                     });

        //                 }
        //             })
        //         }
        //     }
        // })


    }

}
//单选框是否选择状态
function checkCandy(discount) {
    if ($(".check_box").hasClass("choose_check")) {
        $(".check_box").removeClass("choose_check");
    } else {
        $(".check_box").addClass("choose_check");
    }
    if ($(".input_check").attr("checked") == "checked") {
        $(".input_check").attr("checked", false);
        $(".JS_discount").html("无任何优惠");
        lastPoint = originPoint;

    } else {
        $(".input_check").attr("checked", "checked");
        $(".JS_discount").html('优惠<b class="price_red">' + discount + '</b> 唐果');
        lastPoint = originPoint - discount;
    }
}