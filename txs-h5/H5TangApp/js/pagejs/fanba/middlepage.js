$(function() {
    if ($.getCookie("MadisonToken")) { $.delCookie("MadisonToken") }
    //清除相关cookie
    $.delCookie("fanbaModel");
    var $txtImgYZM = $("#txtImgYZM");
    var $PhoneNo = $("#PhoneNo");
    var $imgYZM = $("#imgYZM");
    //--------------返吧传来的信息
    var thirdencryptdata = $.getQueryStringByName("token") || ""; //加密的用户信息
    var invitedby = $.getQueryStringByName("c") || "W000670"; //活动渠道码
    var activityseries = "201703231457"; //活动期数
    var activekey = "Fanba"; //活动标识
    var smscode = "";
    var redirectUrl = decodeURIComponent($.getQueryStringByName("redirectUrl") || ""); //去哪里
    var buyamount = $.getQueryStringByName("buyamount") || ""; //购买金额
    var id = $.getQueryStringByName("id") || ""; //产品id
    var orderid = $.getQueryStringByName("orderid") || ""; //订单号
    var returnUrl = $.getQueryStringByName("returnUrl") || ""; //回哪里
    var from = $.getQueryStringByName("from") || ""; //区分是h5还是app客户端
    var sign = $.getQueryStringByName("sign") || ""; //加密字符
    var requesttime = $.getQueryStringByName("requesttime") || ""; //时间戳
    $.setCookie("activekey", "Fanba"); //重要，标志返吧用户
    $.setCookie("fanbafrom", from); //返吧平台区分
    setSession("fanba", "fanba"); //用sessionStorage存储返吧信息，退出浏览器时自动失效
    if (redirectUrl && returnUrl) {
        //------------联合登录中动画
        var donghua = function() {
            $(".pro b").animate({ "width": "100%" }, 2000);
            $(".progress-icon").animate({ "left": "17%" }, 2000);

            function toPercent(point) {
                var str = Number(point * 100).toFixed(0);
                str += "%";
                return str;
            }
            var percentId = setInterval(function() {
                var width = $(".pro b").width();
                var widthtotal = $(".pro").width();
                // var bodywidth = document.body.clientWidth;
                var percent = width / widthtotal;
                var percentValue = toPercent(percent);
                $(".progress-icon span").html(percentValue);
                if (percent.toFixed(2) >= 1) {
                    clearInterval(percentId);
                    // if($.getCookie("MadisonToken")){//有登录状态的跳转
                    // 	window.location.replace(redirectUrl+"?returnurl="+returnUrl+"&buyamount="+buyamount+"&id="+id+"&orderid="+orderid);
                    // }else{
                    fanbamiddle();
                    // }	
                }
            }, 20);
        }
        donghua();
    } else {
        $.alertF("信息错误", '', function() {
            var _returnUrl = decodeURIComponent(returnUrl);
            if (from && from.toLowerCase() == "ios") {
                //返吧 ios
                window.webkit.messageHandlers.fanbalife.postMessage({ method: "toNative", jsonString: _returnUrl });
                return;
            } else if (from && from.toLowerCase() == "android") {
                //返吧 android
                window.fanbalife.toNative(_returnUrl);
                return;
            } else {
                //返吧 H5
                if (returnUrl) {
                    window.location.replace(_returnUrl);
                    return;
                }
            }
            // if(returnUrl){window.location.href=returnUrl;}
            // else{
            // 	window.location.href="https://fanbadev.txslicai.com/";
            // }
        })
    }
    //获取手机验证码
    $("#getYZM").click(function() {
        var dataimg = {
            "mobile": $PhoneNo.val(),
            "imgcode": $txtImgYZM.val(),
            "imgkey": $imgYZM.attr("alt"),
        };
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", dataimg, true).then(function(d) {
            if (d.result) {
                $.GetYzm("getYZM", 60);
            } else {
                $.alertF(d.errormsg, "确定", function() {
                    $txtImgYZM.val("");
                    $imgYZM.click();
                })
            }
        });
    });
    //------------------返吧中间登录接口
    function fanbamiddle() {
        var url = "/StoreServices.svc/activity/commonactivitylogin/thirdlogin";
        var data = {
            invitedby: invitedby,
            thirdencryptdata: thirdencryptdata,
            activityseries: activityseries,
            activekey: activekey,
            smscode: smscode
        };
        $.AkmiiAjaxPost(url, data).then(function(d) {
            if (d.result) {
                // $.setCookie("returnurl",returnUrl);
                if (d.isearlyuser) { //true为老用户，未关联，需要验证
                    $.getImgYZM("imgYZM"); //获取验证码
                    var donghuafade = function() {
                        $(".progress").fadeOut(200, function() {
                            $("#register-warp").animate({ "top": "37%" }, 300, function() {
                                $(".form_input").fadeIn(1000); //显示输入框
                            })
                        });
                    };
                    donghuafade();
                    //隐藏动画
                    $PhoneNo.val(d.phone); //输入默认手机号
                } else {
                    //新用户或已关联,跳转到要去的页面
                    window.location.replace(redirectUrl + "?returnurl=" + returnUrl + "&buyamount=" + buyamount + "&id=" + id + "&orderid=" + orderid+"&requesttime="+requesttime+"&sign="+sign);
                }
            } else {
                $.alertF("登录唐小僧失败", '', function() {
                    var _returnUrl = decodeURIComponent(returnUrl);
                    if (from && from.toLowerCase() == "ios") {
                        //返吧 ios
                        window.webkit.messageHandlers.fanbalife.postMessage({ method: "toNative", jsonString: _returnUrl });
                        return;
                    } else if (from && from.toLowerCase() == "android") {
                        //返吧 android
                        window.fanbalife.toNative(_returnUrl);
                        return;
                    } else {
                        //返吧 H5
                        if (returnUrl) {
                            window.location.replace(_returnUrl);
                            return;
                        }
                    }
                    // if(returnUrl){
                    // 	window.location.href=returnUrl;
                    // }else{
                    // 	window.location.href="https://fanbadev.txslicai.com/";
                    // }
                })
            }
        })
    }
    //点击联合登录
    $("#register_btn").bind("click", function() {
        if (!$.isMobilePhone($PhoneNo.val())) {
            $.alertF("手机号码无效");
            return;
        }
        if ($.isNull($imgYZM.attr("alt"))) {
            $.alertF("请点击图形验证码刷新");
            return;
        }
        if ($.isNull($txtImgYZM.val())) {
            $.alertF("请输入图形验证码");
            return;
        }
        if ($.isNull($("#code").val())) {
            $.alertF("请输入手机验证码");
            return;
        }
        smscode = $("#code").val();
        var url = "/StoreServices.svc/activity/commonactivitylogin/thirdlogin";
        var data = {
            invitedby: invitedby,
            thirdencryptdata: thirdencryptdata,
            activityseries: activityseries,
            activekey: activekey,
            smscode: smscode
        };
        $.AkmiiAjaxPost(url, data).then(function(d) {
            if (d.result) {
                if (d.isearlyuser) { //true为老用户，未关联，需要验证
                    $.getImgYZM("imgYZM"); //获取验证码
                    $PhoneNo.val(d.phone); //输入默认手机号
                } else {
                    //老用户，未关联，关联好之后跳转
                    window.location.replace(redirectUrl + "?returnurl=" + returnUrl + "&buyamount=" + buyamount + "&id=" + id + "&orderid=" + orderid+"&requesttime="+requesttime+"&sign="+sign);
                }
            } else {
                $.alertF(d.errormsg, "确定", function() {
                    $txtImgYZM.val("");
                    $imgYZM.click();
                    $("#code").val("");
                })
            }
        })
    })

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
})