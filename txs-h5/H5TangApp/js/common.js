/// <reference path="jweixin-1.0.0.js" />



var USERINFOLSKEY = "USERINFOLSKEY";
/***********资邦统计 begin***************/
var _zdq = _zdq || [];
var _gsq = _gsq || [];
// _zdq.push(['_setAccount', 'page1']);
// var baseUrl = "https://zbdc.txslicai.com/zbdata.js?v=" + (new Date()).getTime();

(function ($) {
    if ($(document).foundation) {
        $(document).foundation();
    }
    $(window).load(function () {
        $("#all-body-div-status").fadeOut();
        $("#all-body-div-preloader").delay(300).fadeOut("slow");
        /*********************国双统计 begin****************************/
        (function () {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = (location.protocol == 'https:' ? 'https://ssl.' : 'http://static.') + 'gridsumdissector.com/js/Clients/GWD-002985-93DA74/gs.js';
            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(s, firstScript);
        })();

        /**********************国双统计 end*****************************/
        /***********资邦统计 begin***************/
        var _zddomain = (function () {
            var dm = window.location.origin;
            if (/\/\/service./.test(dm)) {
                return "https://zbdc.txslicai.com";
            }
            return "https://uatzc.txslicai.com/js";
        })();
        var baseUrl = _zddomain + "/zbdata.js?v=" + (new Date()).getTime();
        (function () {
            var ma = document.createElement('script');
            ma.type = 'text/javascript';
            ma.async = true;
            ma.src = baseUrl; //('https:' == document.location.protocol ? 'https://analytics' : 'http://analytics') + '.codinglabs.org/ma.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ma, s);
        })();
        /***********资邦统计 end***************/
    });
    var defaultError = "您的网络不好呦，请稍后再试！";
    var intervalHandlerYZM = null;

    function processError(msg) {
        msg = msg || defaultError;
        $.alertF("系统错误", msg);
    }

    function _showMainDiv() {
        if ($(".az-showmasker").length == 0) {
            var html = $("<div class=\"az-showmasker\"></div><div class=\"az-showmasker-Text\"></div>");
            $("body").prepend(html);
        } else {
            _closeWinDiv();
            $('.az-showmasker-Text,.az-showmasker').show();
        }
    }

    /*关闭所有的*/
    function _closeWinDiv() {

        $('.az-showmasker-Text,.az-showmasker').each(function (index, item) {
            $(item).empty().hide();
        });
    }

    function _showMainDivPWD() {
        if ($("#az-showmaskerpwd").length == 0) {
            var html = $("<div id=\"az-showmaskerpwd\"></div><div id=\"az-showmasker-Textpwd\"></div>");
            $("body").prepend(html);
        } else {
            _closeWinDivPWD();
            $('#az-showmasker-Textpwd,#az-showmaskerpwd').show();
        }
    }

    /**
     * 唐小僧和马上贷对应域名关系
     * 
     */
    function p2p_msd_url() {
        window.P2P_MSD_URL_prefix = "https://www.msd.com"; //马上贷连接前缀
        window.P2P_TXS_URL_prefix = "https://service.txslicai.com"; //唐小僧连接前缀
        var p2p_hostname = window.location.hostname;
        switch (p2p_hostname) {
            //正式环境
            case "service.txslicai.com":
            case "service.txslicai.com.cn":
            case "txs06service.txslicai.com":
                window.P2P_MSD_URL_prefix = "//txsh5.17msd.com";
                break;
            //内测环境
            // case "preprod.txslicai.com":
            //     window.P2P_MSD_URL_prefix = "//txspreprod.17msd.com";
            //     break;
            // case "txs06service.txslicai.com":
            //     window.P2P_MSD_URL_prefix = "//txs06p2ph5.17msd.com";
            //     break;
            //测试环境
            case "tservice.txslicai.com.cn":
            case "tservice.txslicai.com":
                window.P2P_MSD_URL_prefix = "//txsh5test.17msd.com";
                break;
            //验收环境
            case "accept.txslicai.com":
                window.P2P_MSD_URL_prefix = "//txsh5stage.17msd.com";
                break;
            case "xysaccept.txslicai.com":
                window.P2P_MSD_URL_prefix = "//txsh5stage.17msd.com";
                break;
            //开发环境
            case "devp2pwx.txslicai.com":
                window.P2P_MSD_URL_prefix = "//devp2pwx.txslicai.com";
                break;
            default:
                if (p2p_hostname.indexOf("192.168.") >= 0) {
                    window.P2P_MSD_URL_prefix = window.location.origin;
                } else {
                    window.P2P_MSD_URL_prefix = "//txsh5.17msd.com";
                }
                break;
        }
        switch (p2p_hostname) {
            //内测环境
            // case "txspreprod.17msd.com":
            //     window.P2P_TXS_URL_prefix = "//preprod.txslicai.com";
            //     break;
            case "txs06p2ph5.17msd.com":
                window.P2P_TXS_URL_prefix = "//txs06service.txslicai.com";
                break;
            //正式环境
            case "txsh5.17msd.com":
                window.P2P_TXS_URL_prefix = "//service.txslicai.com";
                break;
            case "120.26.216.16":
            case "txsh5test.fanbalife.com":
            case "txsh5test.17msd.com":
                window.P2P_TXS_URL_prefix = "//tservice.txslicai.com";
                break;
            case "txsh5stage.17msd.com":
                window.P2P_TXS_URL_prefix = "//accept.txslicai.com";
                break;
            case "xysaccept.msd.com":
                window.P2P_TXS_URL_prefix = "//xysaccept.txslicai.com";
                break;
            case "devp2pwx.txslicai.com":
                window.P2P_TXS_URL_prefix = "//devp2pwx.txslicai.com";
                break;
            default:
                if (p2p_hostname.indexOf("192.168.") >= 0) {
                    window.P2P_TXS_URL_prefix = window.location.origin;
                } else if (p2p_hostname == "txsh5.zbjf.com") {
                    window.P2P_TXS_URL_prefix = window.location.origin;
                } else if (p2p_hostname == "devp2pwx.txslicai.com") {
                    window.P2P_TXS_URL_prefix = window.location.origin;
                } else {
                    window.P2P_TXS_URL_prefix = "//service.txslicai.com";
                }
                break;
        }
    }
    p2p_msd_url();
    /**
     * 马上贷和唐小僧域名对应 p2p接口地址
     * 
     */
    function javaUri_p2p() {
        //马上贷和唐小僧域名对应 p2p接口地址
        window.apiUrl_prefix_p2p = "//txsapi.17msd.com";
        window.apiUrl_host = window.location.hostname;
        switch (apiUrl_host) {
            //开发环境
            case "devp2pwx.txslicai.com":
                // apiUrl_prefix_p2p = "//javamock.txslicai.com";
                // apiUrl_prefix_p2p = "//106.15.131.131";
                apiUrl_prefix_p2p = "http://javamock.txslicai.com";
                // apiUrl_prefix_p2p = "//139.196.10.149:9002";
                break;
            //测试环境
            case "txsh5test.17msd.com":
            case "tservice.txslicai.com.cn":
            case "tservice.txslicai.com":
                apiUrl_prefix_p2p = "//txsapitest.17msd.com";
                break;
            //验收环境
            case "txsh5stage.17msd.com":
            case "accept.txslicai.com":
                apiUrl_prefix_p2p = "//txsapistage.17msd.com";
                break;
            //正式环境/内测环境
            // case "service.txslicai.com":
            // case "service.txslicai.com.cn":
            // case "preprod.txslicai.com":
            // case "txsh5.17msd.com":
            // case "txspreprod.17msd.com":
            //     apiUrl_prefix_p2p = "//txsapi.17msd.com";
            //     break;
            case "service.txslicai.com":
            case "service.txslicai.com.cn":
            case "txsh5.17msd.com":
                apiUrl_prefix_p2p = "//txsapi.17msd.com";
                break;
            case "txs06service.txslicai.com":
            case "txs06p2ph5.17msd.com":
                apiUrl_prefix_p2p = "//txs06zdapi.17msd.com";
                break;
            //本地测试
            default:
                apiUrl_prefix_p2p = "//192.168.3.30:8090"; // "//139.196.10.149:9001"; //李国良本地
        }
        // if (apiUrl_host == "txsh5test.17msd.com") {
        //     apiUrl_prefix_p2p = "//txsapitest.17msd.com";
        // }else if(apiUrl_host == "txsh5stage.17msd.com"){
        //     apiUrl_prefix_p2p = "//txsapistage.17msd.com";
        // }else if(apiUrl_host=="txsh5.17msd.com"){
        //     apiUrl_prefix_p2p = "//txsapi.17msd.com";
        // }else if (apiUrl_host == "accept.txslicai.com") {
        //     apiUrl_prefix_p2p = "//txsapistage.17msd.com";
        // } else if (apiUrl_host == "xysaccept.txslicai.com") {
        //     apiUrl_prefix_p2p = "//newuatjavaapi.txslicai.com";
        // } else if (apiUrl_host == "service.txslicai.com" || apiUrl_host == "service.txslicai.com.cn" || apiUrl_host == "preprod.txslicai.com") {
        //     apiUrl_prefix_p2p = "//javaapi.txslicai.com";
        // } else if(apiUrl_host == "tservice.txslicai.com.cn" || apiUrl_host == "tservice.txslicai.com"){
        //     apiUrl_prefix_p2p = "//txsapitest.17msd.com";
        // }else if(apiUrl_host=="devp2pwx.txslicai.com"){
        //     apiUrl_prefix_p2p = "//139.196.10.149:9002";
        // }else{
        //     apiUrl_prefix_p2p = "//txsapi.zbjf.com";
        // }
    }
    javaUri_p2p();

    $(".p2plink").on("click", function () {
        var link = $(this).attr("link");
        var type = $(this).attr("p2p");
        if (link) {
            var p2p_host = window.location.hostname;
            if (type == "txs") {
                window.location.href = window.P2P_TXS_URL_prefix + link;
            } else {
                window.location.href = window.P2P_MSD_URL_prefix + link;
            }
        }
        return false;
    })

    // java接口不同环境的调用不同域名的方法
    function javaUri() {
        //Java接口不同环境调用不同域名
        window.apiUrl_prefix = "//txsapi.zbjf.com";
        window.apiUrl_host = window.location.hostname;
        if (apiUrl_host == "tservice.txslicai.com.cn" || apiUrl_host == "tservice.txslicai.com") {
            apiUrl_prefix = "//javaapitest.txslicai.com";
        } else if (apiUrl_host == "accept.txslicai.com" || apiUrl_host == "accept01.txslicai.com") {
            apiUrl_prefix = "//uatjavaapi.txslicai.com";
        } else if (apiUrl_host == "xysaccept.txslicai.com" || apiUrl_host == "xysaccept01.txslicai.com") {
            apiUrl_prefix = "//newuatjavaapi.txslicai.com";
        } else if (apiUrl_host == "service.txslicai.com" || apiUrl_host == "service.txslicai.com.cn") {
            apiUrl_prefix = "//javaapi.txslicai.com";
        } else if (apiUrl_host == "txs06service.txslicai.com") { //apiUrl_host == "preprod.txslicai.com"
            apiUrl_prefix = "//txs06javaapi.txslicai.com";
        } else if (apiUrl_host == "devp2pwx.txslicai.com") {
            apiUrl_prefix = "http://139.196.10.149:9000";
            //apiUrl_prefix = "https://javamock.txslicai.com";
        } else if (apiUrl_host == "idcservice.txslicai.com") {
            apiUrl_prefix = "https://idcjavatestapi.txslicai.com";
        } else if (/192.168/.test(apiUrl_host) || apiUrl_host == "txsh5.zbjf.com") {
            apiUrl_prefix = "http://192.168.3.30:9000";
        } else if (/120.26/.test(apiUrl_host)) {
            apiUrl_prefix = "https://javaapitest.txslicai.com";
        } else if (/121.40/.test(apiUrl_host)) {
            apiUrl_prefix = "https://uatjavaapi.txslicai.com";
        } else if (/139.196/.test(apiUrl_host)) {
            apiUrl_prefix = "https://newuatjavaapi.txslicai.com";
        } else {
            apiUrl_prefix = "//txsapi.zbjf.com";
        }
    }
    javaUri();
    /*关闭所有的*/
    function _closeWinDivPWD() {
        $('#az-showmasker-Textpwd,#az-showmaskerpwd').each(function (index, item) {
            $(item).empty().hide();
        });
    }
    //定位弹框
    function _showMainDivLocation() {
        if ($("#az-showmaskerLocation").length == 0) {
            var html = $("<div id=\"az-showmaskerLocation\"></div><div id=\"az-showmasker-TextLocation\"></div>");
            $("body").prepend(html);
        } else {
            _closeWinDivLocation();
            $('#az-showmasker-TextLocation,#az-showmaskerLocation').show();
        }
    }
    //关闭定位弹框
    function _closeWinDivLocation() {
        $('#az-showmasker-TextLocation,#az-showmaskerLocation').each(function (index, item) {
            $(item).empty().hide();
        });
    }
    /*  alert defaults config
     text       提示内容
     ltext      确定按钮
     rcallback  回调方法
     title      提示标头
     iconicon   字体
    */
    var _alert_defaults = {
        text: "",
        ltext: "确定",
        rcallback: "",
        title: "",
        icon: "icon-my-sigh"
    };
    /*  confirm defaults config
     title 标头
     icon  icon字体
     text  内容
     ltext 取消按钮
     rtext 确定按钮
     lcallback 取消事件
     rcallback 确定事件
     */
    var _confirm_defaults = {
        text: "",
        title: "提示",
        icon: "icon-my-sigh",
        ltext: "取消",
        rtext: "确定",
        lcallback: "",
        rcallback: ""
    }

    $.extend({
        //进入侨金所页面登陆，实名，邦卡判断(！！！新手导游版本修改为进入侨金所页面登陆，实名判断)
        /*
         * sourcePage:来源页面
         * sourceParamValue：json格式的参数
         */
        showQfax: function (sourcePage, sourceParamValue, confirm) { //userId用户id，customstatus当前用户是否实名，邦卡状态
            // if (!$.CheckToken()) {
            //     $.Loginlink();
            // } else {
            //     var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
            //     $.AkmiiAjaxPost(url, {}, false).then(function (data) {
            //         var app_type = $.getQueryStringByName("type");
            //         if (data.result) {
            //             var customstatus = data.accountinfo.customstatus; //customstatus当前用户是否实名，邦卡状态
            //             var userId = data.accountinfo.userid; //userId用户id
            //             switch (customstatus) {
            //                 case 0:
            //                     $.confirmF("您的资料尚未完善，请补充完整后进行投资。", "", "", null, function () {
            //                         window.location.href = "/html/my/regist-step1.html?returnurl=" + encodeURIComponent(window.location.href);
            //                     });
            //                     break;
            //                 case 1: //未实名
            //                     $.confirmF("您的资料尚未完善，请补充完整后进行投资。", "", "", null, function () {
            //                         window.location.href = "/html/my/regist-step2.html?returnurl=" + encodeURIComponent(window.location.href);
            //                     });
            //                     break;
            //                 default:
            //                     var url = apiUrl_prefix + "/qjs/member/destination";
            //                     var D = { "txsAccountId": userId, "sourcePage": (sourcePage ? sourcePage : "1"), "sourceParam": sourceParamValue };
            //                     $.AkmiiAjaxPost(url, D, false).then(function (data) {
            //                         if (data.code == 200) {
            //                             var url = data.data.url;
            //                             if (app_type == "android") {
            //                                 PhoneMode.callToPage("/main/qjsweb", "{\"url\":\"" + url + "\"}");
            //                             } else {
            //                                 window.location.href = url;
            //                             }
            //                         }
            //                     });
            //                     break;
            //             }
            //         }
            //     });
            //  }
            $.jumpFinancialExchange('QJSTZ', sourcePage, sourceParamValue, confirm);

        },
        /**
         * 跳转赣金所
         * @platForm : 平台ID
         * @sourcePage ： 唐小僧来源页编号[1-理财首页 2-我的页面 3-我的银行卡]
         * @sourceParamValue : json类型字符串；可空；eg:'{"productCode":"0218010154"}'
         * @confirm ： 首次进入赣金所的提示弹框
         */
        jumpGJSFax: function (platForm, sourcePage, sourceParamValue, confirm) {
            //TODO：这是赣金所，本地联调时，改为侨金所标志，注意修正！
            $.jumpFinancialExchange('GJSTZ', sourcePage, sourceParamValue, confirm);
        },
        /**
         * 跳转到金融交易所
         * @platForm : 平台ID eg:GJSTZ=赣金所,QJSTZ=侨金所
         * @sourcePage ： 唐小僧来源页编号[1-理财首页 2-我的页面 3-我的银行卡]
         * @sourceParamValue : json类型字符串；可空；eg:'{"productCode":"0218010154"}'
         * @confirm ： 首次进入金交所的提示弹框
         */
        jumpFinancialExchange: function (platForm, sourcePage, sourceParamValue, confirm) {
            if (!platForm) {
                console.log("Lack of parameter 'platForm'");
                return;
            }
            var first_jump_key = "first_jump_" + encodeURI(platForm);
            if (!$.getLS(first_jump_key) && confirm) {
                confirm instanceof Function && confirm();
                $.setLS(first_jump_key, 'true');
                return;
            }
            if (!$.CheckToken()) {
                $.Loginlink();
            } else {
                $.getUserInfo(function (accountInfo) {
                    var url = apiUrl_prefix + "/jys/member/destination";
                    var D = {
                        //"txsAccountId": accountInfo.userid,
                        "platForm": platForm,
                        "sourcePage": (sourcePage ? sourcePage : "1"),
                        "sourceParam": sourceParamValue ? sourceParamValue : ''
                    };
                    $.AkmiiAjaxPost(url, D, false).then(function (data) {
                        if (data.code == 200) {
                            var url = data.data.url;
                            var app_type = $.getQueryStringByName("type");
                            if (app_type == "android") {
                                PhoneMode.callToPage("/main/qjsweb", "{\"url\":\"" + url + "\"}");
                            } else {
                                window.location.href = url;
                            }
                        } else {
                            $.alertF(data.message);
                        }
                    });
                })
            }
        },
        //跳网贷对应的页面
        /*
         * sourcePage:来源页面
         * sourceParamValue：json格式的参数
         */
        p2p_url: function (sourcePage, sourceParamValue) { //destinationPage入口页面，productid产品id
            var MadisonToken = $.getCookie("MadisonToken");
            if (!$.CheckToken()) {
                $.Loginlink();
            } else {
                var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
                $.AkmiiAjaxPost(url, {}, false).then(function (data) {
                    var app_type = $.getQueryStringByName("type");
                    if (data.result) {
                        var customstatus = data.accountinfo.customstatus; //customstatus当前用户是否实名，邦卡状态
                        //var userId = data.accountinfo.userid; //userId用户id
                        if (customstatus == 0) {
                            $.confirmF("您的资料尚未完善，请补充完整后再进行投资", '取消', '确定', function () { }, function () {
                                window.location.href = "/html/my/regist-step1.html";
                            })
                        } else if (customstatus == 1) { //未实名
                            $.confirmF("您的资料尚未完善，请补充完整后再进行投资", '取消', '确定', function () { }, function () {
                                window.location.href = "/html/my/regist-step2.html";
                            })
                        } else if (customstatus >= 2) {
                            // var apiUrl_prefix_p2p="http://192.168.9.63:8090";
                            var data = {
                                "sourcePage": sourcePage,
                                "sourceParam": sourceParamValue
                            };
                            $.AkmiiAjaxPost(apiUrl_prefix + "/members/account/txs/redirect", data, false).then(function (d) {
                                if (d.code == 200) {
                                    var url = d.data.url;
                                    if (url) {
                                        // if (productid) {
                                        //     var tourl = encodeURIComponent(url + '?id=' + productid); //网贷详情页
                                        // } else {
                                        //     var tourl = encodeURIComponent(url); //
                                        // }
                                        // var p2p_url = P2P_MSD_URL_prefix + "/zdhtml/p2p_loading.html?tourl=" + tourl + "&token=" + MadisonToken;
                                        if (app_type == "android") {
                                            PhoneMode.callToPage("/main/netloanweb", "{\"url\":\"" + url + "\"}"); //?問問安卓的路徑
                                        } else {
                                            window.location.href = url;
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            }
        },
        getUserInfo: function (callback) {
            var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
            $.AkmiiAjaxPost(url, {}, false).then(function (data) {
                if (data.result) {
                    var customstatus = data.accountinfo.customstatus; //customstatus当前用户是否实名，邦卡状态
                    var userId = data.accountinfo.userid; //userId用户id
                    switch (customstatus) {
                        case 0:
                            $.confirmF("您的资料尚未完善，请补充完整后进行投资。", "", "", null, function () {
                                window.location.href = "/html/my/regist-step1.html?returnurl=" + encodeURIComponent(window.location.href);
                            });
                            return;
                        case 1: //未实名
                            $.confirmF("您的资料尚未完善，请补充完整后进行投资。", "", "", null, function () {
                                window.location.href = "/html/my/regist-step2.html?returnurl=" + encodeURIComponent(window.location.href);
                            });
                            return;
                        default:
                            callback && callback(data.accountinfo);
                            return;
                    }
                }
            });
        },
        //点击收益率弹框
        profit_win: function (classname, parentclassname) { //classname当前需要弹出收益框事件的dom元素的class类名,parentclassname当前dom元素的父及（事件委托）
            var _setInterval = 0,
                desc = "",
                count = 0;
            $("." + parentclassname).on("contextmenu", function (e) {
                e.preventDefault();
            })
            $("." + parentclassname).on('touchstart', "." + classname, function (e) {
                desc = $(this).attr("data-desc");
                if (desc) {
                    _setInterval = setInterval(time, 1000)
                }
            })
            $("." + parentclassname).on('touchend', "." + classname, function (e) {
                clearInterval(_setInterval);
            })

            function time() { //计算时间函数
                count++;
                if (count >= 3) {
                    sign = false;
                    count = 0;
                    clearInterval(_setInterval);
                    //$("body,html").addClass("no_scroll");
                    profit_win_html(desc);
                    $(".profit_mask").show();
                    $(".profit_win_content").text(desc);
                    $(".profit_win").addClass("profit_win_scale");
                }
            }

            function profit_win_html(desc) { //页面加入弹框内容
                var htmlstr = '<div class="profit_mask" style="z-index:999999;display:none;"></div>\
                            <div class="profit_win">\
                                <div class="profit_img"><img src="' + $.resurl() + '/css/img2.0/profit_win_icon.png" /></div>\
                                <div class="profit_win_content">{0}</div>\
                                <div class="profit_btn JS_profit_btn">确定</div>\
                            </div>'.replace('{0}', desc);
                var html = $(htmlstr);
                $("." + parentclassname).append(html);
            }
            $("." + parentclassname).on('click', ".JS_profit_btn", function () {
                $(".profit_mask").remove();
                $(".profit_win").remove();
                //$("body,html").removeClass("no_scroll");
            });

        },
        force_open: function (openPage) { //openPage为1时表示是从首页，2表示强屏页调用该方法的
            var force_key = $.getCookie('userid');
            var forceOpen = $.getLS(force_key);
            if (!forceOpen) {
                if ($.CheckToken()) {
                    var urlinfo = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
                    $.AkmiiAjaxPost(urlinfo, {}, false).then(function (data) {
                        if (data.result) {
                            var customstatus = data.accountinfo.customstatus; //customstatus当前用户是否实名，邦卡状态
                            var userId = data.accountinfo.userid; //userId用户id
                            if (customstatus >= 2) { //如果注册实名了
                                // var apiUrl_prefix = "http://192.168.3.30:8090";
                                var url = apiUrl_prefix + "/jys/member/upgrade-jys-pop-up-and-url";
                                $.AkmiiAjaxGet(url, true, true).then(function (d) {
                                    if (d.code == 200) {
                                        if (d.data.hasActivatedAll) {
                                            $.setLS(force_key, 'forceOpen' + userId);
                                        } else {
                                            if (d.data.status == 1) {
                                                var toUrl = d.data.destination.url;
                                                if (openPage == 2) {
                                                    history.replaceState(null, null, "/html/my/unionopening/force_change.html?toUrl=" + toUrl)
                                                } else {
                                                    window.location.href = "/html/my/unionopening/force_change.html?toUrl=" + toUrl; //去强屏页
                                                }
                                            } else {
                                                if (openPage == 2) {
                                                    window.location.href = "/html/anonymous/welcome.html"; //不需要进行强屏就去唐小僧首页
                                                }
                                            }
                                        }

                                        // } else {

                                        //     if (openPage != 1) {
                                        //         window.location.href = "/html/anonymous/welcome.html"; //不需要进行强屏就去唐小僧首页
                                        //     }
                                        // }
                                    }
                                    // } else {
                                    //     // $.alertF(d.message);
                                    // }
                                })
                            }
                        }
                    })
                }
            }
        },
        // 通过域名判断环境，如果是生产环境，则js中动态加载的静态资源走cdn。
        // desturl: 不需要判断环境，则传入固定的域名，可为空。
        resurl: function (desturl) {
            var loc = window.location.origin;
            var dsturl = desturl || "";
            if (loc == "https://service.txslicai.com" || loc == "https://service.txslicai.com.cn") {
                return "https://txsres.txslicai.com";
            } else if (loc == "https://txs06p2ph5.17msd.com") { //txspreprod.17msd.com
                return "https://txs06service.txslicai.com";
            } else if (loc == "https://txs06service.txslicai.com") { //preprod.txslicai.com////txs06service.txslicai.com
                return "https://txs06-oss-h501.oss-cn-hangzhou.aliyuncs.com";
            }
            return dsturl;
        },
        //注册自建联盟活动码
        registerChannel: function () {
            var arr = [].slice.call(arguments);
            var channelcode = arr[0] || $.getQueryStringByName("c");
            $.AkmiiAjaxPost("/StoreServices.svc/activity/selfallianceactiviidget/index", {
                "generalizeurl": (window.location.href.split("?")[0])
            }, false).then(function (d) {
                if (d && d.result && d.activityid && d.activityid != "0") {
                    $.setCookie("Madison_ActiveID", d.activityid);
                    $.setCookie("Madison_ActiveChannelCode", channelcode);
                }
            })
        },
        //链接回跳，因为登录流程有可能涉及的页面较多，来回跳转很麻烦
        //所以在本地记录一个状态，当登录成功后再读取状态回跳到某个页面
        //这个方法只针对登录成功后跳转到首页、我的、理财列表,然后再回跳
        set_link_rebound: function () {
            var link_rebound = $.getQueryStringByName("link_rebound");
            if (link_rebound) {
                $.setCookie("link_rebound", link_rebound, 20);
            }
        },
        get_link_rebound: function () {
            var link_rebound = $.getCookie("link_rebound");
            $.delCookie("link_rebound");
            window.location.href = decodeURIComponent(link_rebound);
        },
        LoanMore: function (listContainer, text, callBackMethod) {
            if (listContainer.find(".ondata").length <= 0) {
                listContainer.append($("<div class='ondata text-center'>").text(text ? text : "点击加载更多"));
            }
            if (callBackMethod) {
                listContainer.find(".ondata").click(function () {
                    $(this).remove();
                    eval(callBackMethod);
                });
            }
        },
        LoadMore: function (listContainer, text, callBackMethod) {
            if (listContainer.find(".ondata").length <= 0) {
                listContainer.append($("<div class='ondata text-center'>").text(text ? text : "点击加载更多"));
            }
            if (callBackMethod) {
                listContainer.find(".ondata").unbind("click");
                listContainer.find(".ondata").click(function () {
                    $(this).remove();
                    if (typeof (callBackMethod) == 'function') {
                        callBackMethod();
                    } else {
                        eval(callBackMethod);
                    }
                });
            }
        },
        //轮询判断图片是否加载完成(当然也可以判断其它资源)
        _imgLoad: function (img, callback) {
            $.each(img, function (index, entry) {
                var timer = setInterval(function () {
                    if (entry.complete) {
                        callback(entry);
                        clearInterval(timer)
                    }
                }, 100);
            });
        },
        preloaderFadeOut: function (time) {
            time = time || 300;
            $("#all-body-div-status").fadeOut();
            $("#all-body-div-preloader").delay(time).fadeOut("slow");
        },
        CheckAccountCustomStatusRedirect: function (returnurl, accountinfo, isreplace) {
            //检查用户注册状态
            function _checkCustomStatus(accountinfo) {
                $.setLS("refcode", accountinfo.referralcode);
                try {
                    window._zdc && _zdc();
                } catch (e) {
                    ;
                }
                $.setCookie("refcode", accountinfo.referralcode);
                initZdq(accountinfo.referralcode);
                switch (accountinfo.customstatus) {
                    case 0:
                        if (window.location.pathname.toLowerCase() != "/html/my/regist-step1.html") {
                            if (isreplace) {
                                window.location.replace("/html/my/regist-step1.html?returnurl=" + returnurl);
                            } else {
                                window.location.href = "/html/my/regist-step1.html?returnurl=" + returnurl;
                            }
                        }
                        break;
                    case 1:
                        if (window.location.pathname.toLowerCase() != "/html/my/regist-step2.html") {
                            if (isreplace) {
                                window.location.replace("/html/my/regist-step2.html?returnurl=" + returnurl);
                            } else {
                                window.location.href = "/html/my/regist-step2.html?returnurl=" + returnurl;
                            }
                        }
                        break;
                    default:
                        if (returnurl) {
                            window.location.replace(decodeURIComponent(returnurl));
                        } else {
                            window.location.replace("/");
                        }
                        break;
                }
            }
            if (accountinfo) {
                _checkCustomStatus(accountinfo);
            } else {
                var url = "/StoreServices.svc/user/info";
                $.AkmiiAjaxPost(url, {}, false).then(function (data) {
                    if (data.result) {
                        _checkCustomStatus(data.accountinfo);
                    } else if (data.errorcode == "missing_parameter_accountid") {
                        $.Loginlink();
                    }
                });
            }
        },
        /**
         * 检查用户注册信息，区别购买操作
         */
        CheckAccountCustomStatusBeforeNext: function (accountinfo, returnurl, status2Text, status3Text) {
            if (accountinfo && accountinfo.customstatus < 2) {
                $.confirmF(status2Text ? status2Text : "您的资料尚未完善，现在去完善吧", "", "", null, function () {
                    $.CheckAccountCustomStatusRedirect(encodeURIComponent(window.location.href), accountinfo);
                });
                return false;
            }
            if (accountinfo && accountinfo.customstatus < 3) {
                $.confirmF(status2Text ? status2Text : "您尚未绑卡，请绑定银行卡", "", "", null, function () {
                    window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                });
                return false;
            }
            return true;
        },
        //在购买等操作前，检查用户绑卡、设置新浪密码
        CheckAccountBeforeBuy: function (accountinfo) {
            if (accountinfo && accountinfo.customstatus < 2) {
                $.confirmF("您的资料尚未完善，请补充完整后进行投资。", "", "", null, function () {
                    $.CheckAccountCustomStatusRedirect(encodeURIComponent(window.location.href), accountinfo);
                });
                return false;
            }
            if (accountinfo && accountinfo.customstatus < 3) {
                $.confirmF("您尚未绑卡，请绑定银行卡后进行投资。", "", "", null, function () {
                    window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                });
                return false;
            }
            //跟测试提供的case有冲突，省略判断新浪密码的判断
            // if (accountinfo && accountinfo.iswithholdauthoity == 0) {
            //     $.confirmF("投资理财产品需要先设置新浪支付密码，激活存钱罐账户，快前往设置吧！", "取消", "去设置", null, function () {
            //         $.sinarequest(20, false, encodeURIComponent(window.location.href));
            //     });
            //     return false;
            // }
            return true;
        },
        //新浪请求 type
        //10:修改认证手机
        //11:修改认证手机
        //20:设置支付密码
        //21:修改支付密码
        //22:找回支付密码
        //30:签订代扣协议
        //31:修改代扣协议
        //32:取消代扣协议
        sinarequest: function (type, issync, returnurl, fback) {
            var url = "/StoreServices.svc/sinacenter/settings";
            returnurl = decodeURIComponent(returnurl);
            if (!returnurl) {
                returnurl = window.location.href;
            }
            if (returnurl.indexOf("eback.html?r=") > -1) {
                var urls = returnurl.split("eback.html?r=");
                returnurl = urls[0] + "eback.html?t=" + type + "&r=" + urls[1];
            } else if (returnurl.indexOf("t=") == -1) {
                if (returnurl.indexOf("?") > -1) {
                    returnurl = returnurl + "&t=" + type;
                } else {
                    returnurl = returnurl + "?t=" + type;
                }
            }
            var param = {
                requesttype: type,
                returnurl: returnurl,
                issync: issync
            };
            $.AkmiiAjaxPost(url, param, false).then(function (data) {
                if (fback && fback instanceof Function) {
                    fback(data);
                } else {
                    if (data.result) {
                        if (!param.issync) {
                            window.location.href = data.redirecturl;
                        } else {
                            $.alertF(data.errormsg, null, function () {
                                if (data.errorcode == "40089") { //针对已设置过支付密码的用户做特殊处理
                                    window.location.reload();
                                }
                            });
                        }
                    } else {
                        $.alertF(data.errormsg, null, function () {
                            if (data.errorcode == "40089") { //针对已设置过支付密码的用户做特殊处理
                                window.location.reload();
                            }
                        });
                    }
                }
            });
        },
        //新用户的提示
        showActiveSinaAccount: function (returnurl, date, key, iscashdesknewuser /*新浪用户*/, isnew) {
            key = key + "showasinaupgradedate";
            date = date.substring(0, 10);
            var showasinaupgradedate = $.getLS(key);
            if (!$.isNull(showasinaupgradedate)) {
                return false;
            }
            //var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin;
            var type = iscashdesknewuser ? 1 : 4; //新用户1，老用户4
            $.GetsinaAlertMessagesByType(type, function (item) {
                var h = [];
                var htmlstr = "";
                if (isnew) {
                    var htmlstr = '<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>\
        <div style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;top:50%;  -webkit-transform: translate(-50%,-50%);  transform: translate(-50%,-50%);">\
            <h1 style="font-size: 0.68rem;padding:.4rem;">{0}</h1>\
            <h3 style="font-size:.6rem;text-align:left;padding:.15rem .6rem;">{1}</h3>\
            <p style="text-indent: 1rem;text-align: left;font-size: .5rem;padding:0rem .6rem;color:#979797;">{2}</p>\
            <p style="text-indent: 1rem;text-align: left;font-size: .5rem;padding:0rem .6rem;color:#979797;">{3}</p>\
            <div style="width:100%;height:1px;background:#ccc;margin-top:.1rem"></div>\
            <a id="gotosetting" href="javascript:void(0);" style="color:#c54846;font-size: .6rem;line-height:3;">{9}</a>\
        </div>'.replace("{0}", item.title)
                        .replace("{1}", item.contents[0].title)
                        .replace("{2}", item.contents[0].contents[0])
                        .replace("{3}", item.contents[0].contents[1])
                        // .replace("{4}", item.contents[1].title)
                        // .replace("{5}", item.contents[1].contents[0])
                        // .replace("{6}", item.contents[2].contents[0].replace(item.contents[2].linktitle[0], ""))
                        // .replace("{7}", item.contents[2].linkurl[0])
                        // .replace("{8}", item.contents[2].linktitle[0])
                        .replace("{9}", item.btn1);
                } else {
                    h.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');
                    h.push('<div class="sina-msg-newuser" style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;">');
                    h.push('<h1 style="font-size: 1.8rem;padding:1rem;">' + item.title + '</h1>');
                    h.push('<h3 style="font-size:1.4rem;text-align:left;padding:.5rem 1rem;">' + item.contents[0].title + '</h3>');
                    h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0rem 1rem;color:#979797;">' + item.contents[0].contents[0] + '</p>');
                    h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0rem 1rem;color:#979797;">' + item.contents[0].contents[1] + '</p>');
                    //h.push('<h3 style="font-size:1.4rem;text-align:left;padding:.5rem 1rem;">' + item.contents[1].title + '</h3>');
                    //h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;">' + item.contents[1].contents[0] + '</p>');
                    //h.push('<p class="xieyi" style="text-align: left;font-size: 1rem;padding:.5rem 1rem;color:#979797;">' + item.contents[2].contents[0].replace(item.contents[2].linktitle[0], "") + '<a href="' + item.contents[2].linkurl[0] + '" style="color:#65A8F3;">' + item.contents[2].linktitle[0] + '</a></p>');
                    h.push('<div style="width:100%;height:1px;background:#ccc;margin-top:1rem"></div>');
                    h.push('<a class="sina-msg-btn" id="gotosetting" href="javascript:void(0);" style="color:#c54846;font-size: 1.6rem;line-height:3;">' + item.btn1 + '</a>');
                    h.push('</div>');
                }
                // <h3 style="font-size:.6rem;text-align:left;padding:.25rem .6rem;">{4}</h3>\
                //     <p style="text-indent: 1rem;text-align: left;font-size: .5rem;padding:.15rem .6rem;color:#979797;">{5}</p>\
                //     <p style="text-align: left;font-size: .5rem;padding:.3rem .6rem;color:#979797;">{6}<a href="{7}" style="color:#65A8F3;">{8}</a></p>\
                var html = isnew ? $(htmlstr) : $(h.join(''));
                html.find("#gotosetting").click(function () {
                    $.setLS(key, date);
                    html.remove();
                    $.sinarequest(20, false, returnurl);
                });
                $("body").append(html);
            });
            return true;
        },
        //未设置新浪支付密码的弹窗
        SetSinaPayPassword: function (returnurl, date, key, iscashdesknewuser /*新浪用户*/) {
            var isdown = $.showActiveSinaAccount(returnurl, date, key, iscashdesknewuser /*新浪用户*/);
            if (isdown) {
                return;
            }
            $.GetsinaAlertMessagesByType(2, function (item) {
                var h = [];
                h.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');

                h.push('<div style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;" class="sina-msg setsinapaypassword">');
                h.push('<h1 style="font-size: 1.8rem;padding:1rem;font-weight:600;">');
                h.push(item.title);
                h.push('</h1>');
                h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;border-bottom: 1px solid #ccc;">');
                h.push(item.contents[0]);
                h.push('</p>');
                //h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;border-bottom: 1px solid #ccc;">');
                //h.push(item.contents[1]);
                //h.push('</p>');
                h.push('<div>');
                h.push('<a id="gotosetting" href="javascript:void(0)" style="color:#C54846;font-size: 1.6rem;line-height:3;display:block;font-weight:600;">');
                h.push(item.btn1);
                h.push('</a>');
                h.push('</div></div>');

                var html = $(h.join(''));
                html.find("#gotosetting").click(function () {
                    html.remove();
                    $.sinarequest(20, false, returnurl);
                });
                $("body").append(html);
            });
        },
        //委托代扣提示
        WithholdAuthority: function (returnurl, lcallback, key /*用户唯一标识*/, isaways) {
            key = key + "knowwithholdauthority";
            //1.判断是否知晓协议了
            var KnowWithholdAuthority = $.getLS(key);
            if (KnowWithholdAuthority == "true") {
                $.setLS(key + "isaway", true);
            }
            $.GetsinaAlertMessagesByType(3, function (item) {
                var ha = [];
                ha.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');

                ha.push('<div style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;" class="sina-msg-entrust withholdauthority">');
                ha.push('<h1 style="font-size: 1.8rem;padding:1rem;">');
                ha.push(item.title);
                ha.push('</h1><p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;">');
                ha.push(item.contents[0]);
                ha.push('</p><p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;">');
                ha.push(item.contents[1]);
                ha.push('</p>');
                if (KnowWithholdAuthority == "true") {
                    ha.push('<label style="padding:0 .6rem;text-align:left;color:#bcbcbc"><input type="checkbox" style="vertical-align: text-bottom;margin:0" checked="true" />');
                } else {
                    ha.push('<label style="padding:0 .6rem;text-align:left;color:#bcbcbc"><input type="checkbox" style="vertical-align: text-bottom;margin:0" />');
                }
                ha.push(item.checktxt);
                ha.push('</label>');
                ha.push('<div style="width:100%;height:1px;background:#ccc;margin-top:1rem"></div>');
                ha.push('<div class="row">');
                ha.push('<a href="javascript:void(0)" class="small-6 columns gopay" style="color:#bcbcbc;font-size: 1.6rem;line-height:3;display:block;border-right:1px solid #ccc">');
                ha.push(item.btn1);
                ha.push('</a>');
                ha.push('<a href="javascript:void(0)" class="small-6 columns goauthorizes" style="color:#ff6600;font-size: 1.6rem;line-height:3;display:block;">');
                ha.push(item.btn2);
                ha.push('</a></div>');
                ha.push('</div>');

                var html = $(ha.join(''));

                //暂不授权，这里需要对暂不授权做处理
                html.find(".gopay").click(function () {
                    html.remove();
                    //代扣协议是否还显示
                    $.setLS(key, html.find("input[type='checkbox']").is(':checked'));
                    if (lcallback && lcallback instanceof Function) {
                        lcallback();
                    }
                });
                //去授权
                html.find(".goauthorizes").click(function () {
                    //代扣协议是否还显示
                    $.setLS(key, html.find("input[type='checkbox']").is(':checked'));
                    $.sinarequest(30, false, returnurl);
                });
                $("body").append(html);
            });
        },
        //未委托代扣提示（仅支持至尊宝）
        ZzbWithholdAuthority: function (returnurl, lcallback, key /*用户唯一标识*/, isaways) {
            key = key + "knowwithholdauthority";
            //1.判断是否知晓协议了
            var KnowWithholdAuthority = $.getLS(key);
            if (!isaways && KnowWithholdAuthority == "true") {
                if (lcallback && lcallback instanceof Function) {
                    lcallback();
                }
                return;
            }
            $.GetsinaAlertMessagesByType(3, function (item) {
                var ha = [];
                ha.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');
                ha.push('<div class="sina-msg-entrustzzb" style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;">');
                ha.push('<span style="position: absolute;right: 0;top: -1rem;font-size: 3rem;color: #C8C8C8;" class="no">×</span>');
                ha.push('<h1 style="font-size: 1.8rem;padding:1rem;padding-top: 2rem;">');
                ha.push(item.title);
                ha.push(' </h1><p style="color:#979797;  text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;">');
                ha.push(item.contents[0]);
                ha.push('</p><p style="color:#979797; text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem 1rem;border-bottom: 1px solid #ccc;">');
                ha.push(item.contents[1]);
                ha.push('</p><div class="row" >');
                ha.push('<a href="javascript:void(0)" style="color:#ff6600;font-size: 1.6rem;line-height:3;display:block" class="goauthorizes">');
                ha.push(item.btn2);
                ha.push('</div></div>');

                var html = $(ha.join(''));

                //点击叉叉
                html.find(".no").click(function () {
                    html.remove();
                });
                //去授权
                html.find(".goauthorizes").click(function () {
                    //代扣协议是否还显示
                    $.setLS(key, html.find("input[type='checkbox']").is(':checked'));
                    $.sinarequest(30, false, returnurl);
                });
                $("body").append(html);
            });
        },
        GetsinaAlertMessagesByType: function (type, fback) {
            var domn = "";
            if (window.location.origin == "https://service.txslicai.com" ||
                window.location.origin == "https://service.txslicai.com.cn") {
                domn = "https://txsres.txslicai.com";
            } else if (window.location.origin == "https://txs06service.txslicai.com") { //preprod.txslicai.com
                domn = "https://txs06-oss-h501.oss-cn-hangzhou.aliyuncs.com";
            }
            $.getJSON(domn + "/js/source/message.js", function (data) {
                if (data.sinaAlertMessages) {
                    var entry = {};
                    $.each(data.sinaAlertMessages, function (i, item) {
                        if (item.type == type || item.code == type) {
                            entry = item;
                            return false;
                        }
                    });
                    if (fback && fback instanceof Function) {
                        fback(entry);
                    }
                }
            });
        },
        //跳转登录链接
        Loginlink: function () {
            window.location.href = "/html/Anonymous/login.html?returnurl=" + (encodeURIComponent(window.location.href));
        },
        //跳转认证链接
        RegistSteplink: function () {
            window.location.href = "/html/my/regist-step.html?returnurl=" + (encodeURIComponent(window.location.href));
        },
        //跳转认证链接返吧定制
        RegistSteplinkFanba: function () {
            window.location.replace("/html/fanba/regist-step.html?returnurl=" + (encodeURIComponent(window.location.href)));
        },
        CheckToken: function () {
            if ($.getCookie("MadisonToken")) {
                return true;
            }
            return false;
        },
        /**
         * 检查是否登录
         * 参数f可以是未登录的callback也可以是一个returnUrl
         * 可以传入更多参数作为callback的入参
         */
        checkLogin: function (f) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (!$.CheckToken()) {
                if (f) {
                    if (f.constructor === Function) {
                        f.apply(null, args);
                    }
                    if (f.constructor === String) {
                        //以后再做正则判断url
                        window.location.replace("/html/Anonymous/login.html?returnurl=" + (encodeURIComponent(f)));
                    }
                } else {
                    $.Loginlink();
                }
                return false;
            } else {
                if (f && f.constructor === String) {
                    window.location.href = f;
                }
                return true;
            }
        },
        ///跳转到系统维护链接
        MaintenanceLink: function () {
            window.location.replace("/html/system/system-maintenance.html");
        },
        browserVersions: function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器 
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
                iPad: u.indexOf('iPad') > -1, //是否iPad 
            };
        },
        //清除非法字符
        FilterXSS: function (html) {
            html = html.replace(/(?:<[\s\S]*?>[\s\S]*?[</[\s\S]*?>]*?)|(?:<[\s\S]*?\/>)|(?:[<>])|(?:javascript|jscript|vbscript|&|onerror|\t)/g, "");
            return html;
        },
        //json日期格式转换为正常格式
        jsonDateFormat: function (jsonDate, formater) {
            if (jsonDate != undefined) {
                jsonDate = jsonDate.replace('0001-01-01 00:00:00', '');
            }
            if (jsonDate == '' || (jsonDate && jsonDate.indexOf("/Date") == -1)) {
                return jsonDate;
            }
            try {
                var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
                return date.Format(formater || "yyyy-MM-dd HH:mm:ss");
                // var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                // var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                // var hours = date.getHours();
                // var minutes = date.getMinutes();
                // var seconds = date.getSeconds();
                // var milliseconds = date.getMilliseconds();
                // return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds; // + "." + milliseconds;
            } catch (ex) {
                return jsonDate;
            }
        },
        defaultError: function () {
            return defaultError;
        },
        formatDate: function (d, mask, utc) {
            return dateFormat(d, mask, utc);
        },
        /**
         * isshow:确定是否显示网络不给力的蒙版
         */
        AkmiiAjaxPost: function (url, data, notneedloader, isshow) {
            var dtd = $.Deferred();
            if (!notneedloader) {
                //$.showLoader();
                $.txsAjaxLoading();
            };

            $.ajax(url, {
                type: "POST",
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (request) {
                    var _userid = $.getCookie("userid") || "";
                    var _stalkerid = $.getCookie('stalkerid') || "";
                    var _deviceid = $.getLS('fingerprint') || ""; //设备id
                    request.setRequestHeader("userid", _userid);
                    request.setRequestHeader("stalkerid", _stalkerid);
                    request.setRequestHeader("deviceid", _deviceid);
                    request.setRequestHeader("Platform", "H5");
                    request.setRequestHeader("Access-Token", $.getCookie('MadisonToken'));
                    request.setRequestHeader("unionKey", $.getSession('APP_unionKey') || "");
                },
            }).then(function (d) {
                if (d.isinglobalmaintenance) {
                    window.location.replace("/html/system/system-maintenance.html");
                    return;
                }
                if (!notneedloader) {
                    //$.hideLoader();
                    $.txsHideAjaxLoading();
                }
                dtd.resolve(d);
            }, function (d) {
                if (d.isinglobalmaintenance) {
                    window.location.replace("/html/system/system-maintenance.html");
                    return;
                }
                if (!notneedloader) {
                    //$.hideLoader();
                    $.txsHideAjaxLoading();
                }
                //$.alertF(defaultError);
                if (!isshow) {
                    $.errorNetWork();
                }
                dtd.reject(defaultError);
            });
            return dtd.promise();
        },
        /**
         * isshow:确定是否显示网络不给力的蒙版
         */
        AkmiiAjaxGet: function (url, noerror, needloader, isshow) {
            if (needloader) {
                //$.showLoader();
                $.txsAjaxLoading();
            }
            var dtd = $.Deferred();
            var thisurl = url;

            if (url.indexOf('?') < 0) {
                thisurl += '?_timestamp=' + (new Date()).getTime();
            } else {
                thisurl += '&_timestamp=' + (new Date()).getTime();
            }
            $.ajax({
                url: thisurl,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (request) {
                    var _userid = $.getCookie("userid") || "";
                    var _stalkerid = $.getCookie('stalkerid') || "";
                    var _deviceid = $.getLS('fingerprint') || ""; //设备id
                    request.setRequestHeader("userid", _userid);
                    request.setRequestHeader("stalkerid", _stalkerid);
                    request.setRequestHeader("deviceid", _deviceid);
                    request.setRequestHeader("Platform", "H5");
                    request.setRequestHeader("Access-Token", $.getCookie('MadisonToken'));
                    request.setRequestHeader("unionKey", $.getSession('APP_unionKey') || "");
                }
            }).then(function (d) {
                if (d.isinglobalmaintenance) {
                    window.location.replace("/html/system/system-maintenance.html");
                    return;
                }
                //$.hideLoader();
                $.txsHideAjaxLoading();
                dtd.resolve(d);
            }, function (d) {
                if (d.isinglobalmaintenance) {
                    window.location.replace("/html/system/system-maintenance.html");
                    return;
                }
                //$.hideLoader();
                $.txsHideAjaxLoading();
                // if (!noerror) {
                //     $.alertF(defaultError);
                // }
                if (!isshow) {
                    $.errorNetWork();
                }
                dtd.reject(defaultError);
            });
            return dtd.promise();
        },
        //根据商户类型获取类型图标icon
        GetIconByCategory: function (Category) {
            switch (Category) {
                case "10001001":
                    return "icon-food";
                case "10001002":
                    return "icon-entertain";
                case "10001003":
                    return "icon-shopping";
                case "10001004":
                    return "icon-life";
                case "10001005":
                    return "icon-outsports";
                case "10001006":
                    return "icon-beautify";
                case "10001007":
                    return "icon-education";
                case "10001008":
                    return "icon-tree";
                default:
                    break;
            }
        },
        //根据商户类型获取类型img
        GetImgByCategory: function (Category) {
            switch (Category) {
                case "10001001":
                    return $.resurl() + "/css/img2.0/10001001.png";
                case "10001002":
                    return $.resurl() + "/css/img2.0/10001002.png";
                case "10001003":
                    return $.resurl() + "/css/img2.0/10001003.png";
                case "10001004":
                    return $.resurl() + "/css/img2.0/10001004.png";
                case "10001005":
                    return $.resurl() + "/css/img2.0/10001005.png";
                case "10001006":
                    return $.resurl() + "/css/img2.0/10001006.png";
                case "10001007":
                    return $.resurl() + "/css/img2.0/10001007.png";
                case "10001008":
                    return $.resurl() + "/css/img2.0/10001008.png";
                default:
                    break;
            }
        },
        dateFromService: function (d) {
            return new Date(d.replace('T', ' '));
            //return new Date(parseInt(d.substr(6)));
        },
        /*
        s: value, n:digit nuber, t: type (0-round 1-floor 2-ceiling)
        */
        fmoney: function (s, n, t) {
            //格式化金额
            if (!s)
                return '0.00';
            n = n >= 0 && n <= 20 ? n : 2;
            s = parseFloat(s + "");
            if (t) {
                var pow = Math.pow(10, n);
                if (t == 1) {
                    s = Math.floor(s * pow) / pow;
                } else if (t == 2) {
                    s = Math.ceil(s * pow) / pow;
                }
            }
            s = s.toFixed(n) + "";
            var arr = s.split(".");
            var l = arr[0].split("").reverse(),
                r = arr[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += "" + l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + ((n == 0) ? "" : "." + r);
        },
        //格式化零元金额
        formatMoney: function (varlue) {
            varlue += "";
            if (varlue == "0") {
                return "0.00";
            } else {
                return $.fmoney(varlue);
            }
        },
        fmoneytext: function (value) {
            value += "";
            if (value.length == 5) {
                return (value / 10000) + "万";
            } else if (value.length == 4) {
                return (value / 1000) + "千";
            }
        },
        // 对金额进行处理
        fmoneytextV2: function (value) {
            value += '';
            if (value.length >= 5) {
                return (value / 10000) + "万";
            } else {
                return value;
            }
        },
        /* 小数转换成百分比
           如：formatInterest(0.01)=+1.00%
        */
        formatInterest: function (val) {
            var _val = val * 100;
            return '+{0}%'.replace('{0}', _val.toFixed(2));
        },
        //百度
        baiduMapAPI: function (Success, Failure) {
            var Location = {};
            var LocationCookie = $.getCookie("MadisonStoreLocation");
            if (!$.isNull(LocationCookie)) {
                Location = (new Function('return' + LocationCookie))();
                Success(Location);
            } else {
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {

                    //$.alertF("百度定位状态：" + this.getStatus());
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        //定位成功
                        //$.alertF("百度定位状态：" + this.getStatus() + " " + r.address.city + " " + r.address.district + "经纬度：" + r.point.lng + " " + r.point.lat);
                        Location = {
                            lng: r.point.lng,
                            lat: r.point.lat,
                            city: r.address.city,
                            district: r.address.district
                        };
                        $.setCookie("MadisonStoreLocation", JSON.stringify(Location), 30);

                        Success(Location);
                    } else {
                        //定位失败
                        Failure();
                    }
                }, {
                        enableHighAccuracy: true
                    });
            }
        },
        ShopDistance: function (distance) {
            if ($.isNumeric(distance)) {
                if (distance > 50000) {
                    return "50+km";
                }
                if (distance >= 1000) {
                    return (distance / 1000).toFixed(1) + "km";
                }
            }
            return distance + "m";
        },
        //计算距离
        Distance: function (distance) {
            if ($.isNumeric(distance)) {
                if (distance > 50000) {
                    return "50+k";
                }
                if (distance >= 1000) {
                    return (distance / 1000).toFixed(1) + "k";
                }
            }
            return distance;
        },
        //计算距离
        Getdistance: function (longitude, latitude, slongitude, slatitude) {
            var radLat1 = latitude * Math.PI / 180.0;
            var radLat2 = slatitude * Math.PI / 180.0;
            var radLng1 = longitude * Math.PI / 180.0;
            var radLng2 = slongitude * Math.PI / 180.0;
            var d = Math.acos(Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radLng2 - radLng1)) * 6370996.81;

            var s = d.toFixed(0);
            return s;
        },
        closeWinDivPWD: function () {
            $('#az-showmasker-Textpwd,#az-showmaskerpwd').each(function (index, item) {
                $(item).empty().hide();
            });
        },
        PaymentHtml: function (Title, Callback, CancelCallback, keyDownCB /*按键回调*/) {
            Title = Title || "请输入支付密码";
            var oldpwd = "";
            //ParentID:密码框需要的父级HTML标签
            //Title：标题
            //Callback:回调函数
            _showMainDivPWD();
            var pha = [];
            pha.push("<input type=\"hidden\" value=\"\" id=\"_hiddenPaymentPwd\">");
            pha.push("<p class=\"az-text-center\">" + Title + "</p>");
            pha.push("<center><div class=\"pasdbox az-center az-clearfix\"><span></span><span></span><span></span><span></span><span></span><span></span></div></center>");
            pha.push("<p class=\"forget az-text-right\"><a href=\"javascript:void(0)\"></a></p>");
            if (CancelCallback) {
                pha.push("<a class=\"cancelbtn btn2 az-center\">取消</a>");
            }
            // pha.push(" <a class=\"safety az-center\" href=\"/Html/picc.html\" ><span class=\"wxicon icon-safety\"></span> 账户资金防盗安全由新浪支付和太平财险共同保障</a>");
            pha.push("<div class=\"keybord\"><div class=\"row az-center az-clearfix collapse\">");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-r\">1</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-r\">2</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t\">3</div>");
            pha.push("</div><div class=\"row az-center az-clearfix collapse\">");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-r\">4</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-r\">5</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t\">6</div>");
            pha.push("</div><div class=\"row az-center az-clearfix collapse\">");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-r\">7</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-r\">8</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t\">9</div>");
            pha.push("</div><div class=\"row az-center az-clearfix collapse\">");
            pha.push("<div class=\"small-4 reset fl az-padding0 border-t border-b border-r\">&nbsp;</div>");
            pha.push("<div class=\"small-4 num fl az-padding0 border-t border-b border-r\">0</div>");
            pha.push("<div class=\"small-4 del fl az-padding0 border-t border-b\"><img src=\"" + $.resurl() + "/css/img2.0/sengcaibao/del.png\" width=\"20%\"></div></div></div>");
            var result = $(pha.join(''));
            var $keybord = result.find(".num");
            $keybord.click(function () {
                var inputedPaymentPWD = $("#_hiddenPaymentPwd").val();
                var len = inputedPaymentPWD.length;
                if (keyDownCB && keyDownCB instanceof Function) {
                    keyDownCB.call(null, inputedPaymentPWD);
                }
                if (len < 6) {
                    inputedPaymentPWD += $(this).text();
                    $($("#az-showmasker-Textpwd").find(".pasdbox span")[len]).text("●");
                    $("#_hiddenPaymentPwd").val(inputedPaymentPWD);
                    if (inputedPaymentPWD.length == 6 && Callback && Callback instanceof Function) {
                        Callback(inputedPaymentPWD);
                    }
                }
            });
            result.find(".del").click(function () {
                var inputedPaymentPWD = $("#_hiddenPaymentPwd").val();
                var len = inputedPaymentPWD.length;
                if (len > 0) {
                    inputedPaymentPWD = inputedPaymentPWD.substring(0, len - 1);
                    $($("#az-showmasker-Textpwd").find(".pasdbox span")[len - 1]).text("");
                    $("#_hiddenPaymentPwd").val(inputedPaymentPWD);
                }
            });
            result.siblings(".cancelbtn").click(function () {
                if (CancelCallback && CancelCallback instanceof Function) {
                    _closeWinDivPWD();
                    CancelCallback();
                }
            });
            result.find(".reset").click(function () {
                $("#_hiddenPaymentPwd").val("");
                $("#az-showmasker-Textpwd").find(".pasdbox span").text("");
            });
            $("#az-showmasker-Textpwd").addClass("az-password");
            $("#az-showmasker-Textpwd").append(result);
            FastClick.attach(document.body);
        },

        PaymentHtmlNew: function (amount /*涉及金额*/, title /*操作类型*/, sback /*成功回调*/, cback /*取消回调*/, accounttype /*账户类型*/, balance /*账户余额*/, pback /*支付方式回调*/, isbank /*是true不是false*/, appiontmoney /*预约金额*/) {
            title = title || "支付金额";
            balance = balance || 0;
            isbank = isbank || false;
            appiontmoney = appiontmoney || 0;
            var h = [];
            h.push('<div class="password-pop " id="_password_">');
            h.push('<div class="fund-poplayer">');
            h.push('<div class="tit">请输入交易密码</div>');
            h.push('<ul class="paslist" style="padding:0 1rem;">');
            if (Number(amount) && ("" + amount).length > 0) {
                h.push('<li><div class="l">' + title + '(元)</div><div class="r ">' + $.fmoney(amount) + '</div></li>');
            }
            if (accounttype != null) {
                accounttype = accounttype || "账户余额";
                if (!isbank) {
                    if (appiontmoney > 0) {
                        h.push('<li style="position:relative;" class="paymethod"><div class="l"><p class="col1">' + (accounttype) + '</p><p>可用余额' + $.fmoney(balance) + '(冻结' + $.fmoney(appiontmoney) + '元)</p><span class="wxicon icon-right-arrow "style="position: absolute;right: 0.2rem;top:1.1rem;"></span></div></li>');
                    } else {
                        h.push('<li style="position:relative;" class="paymethod"><div class="l"><p class="col1">' + (accounttype) + '</p><p>可用余额' + $.fmoney(balance) + '</p><span class="wxicon icon-right-arrow "style="position: absolute;right: 0.2rem;top:1.1rem;"></span></div></li>');
                    }
                } else {
                    var _quota = balance;
                    if (Number(_quota) >= 10000) {
                        _quota = $.fmoneytext(_quota);
                    } else {
                        _quota = $.fmoney(_quota);
                    }
                    h.push('<li style="position:relative;" class="paymethod"><div class="l"><p class="col1">' + (accounttype) + '</p><p>单笔限额' + _quota + '</p><span class="wxicon icon-right-arrow "style="position: absolute;right: 0.2rem;top:1.1rem;"></span></div></li>');
                }
            }
            h.push('</ul><div class="password-value  text-center">');
            h.push('<span><em></em></span><span><em></em></span><span><em></em></span><span><em></em></span><span><em></em></span><span><em></em></span></div>');
            h.push('<article class="okbtn row">');
            h.push('<div class="cancel left small-12 text-center"><span class="fpbutton">取消</span></div>');
            h.push('</article></div><article class="keyboard" style="z-index:989;">');
            h.push('<a href="javascript:;" class="n bt br">1</a>');
            h.push('<a href="javascript:;" class="n bt br">2</a>');
            h.push('<a href="javascript:;" class="n bt">3</a>');
            h.push('<a href="javascript:;" class="n bt br">4</a>');
            h.push('<a href="javascript:;" class="n bt br">5</a>');
            h.push('<a href="javascript:;" class="n bt">6</a>');
            h.push('<a href="javascript:;" class="n bt br">7</a>');
            h.push('<a href="javascript:;" class="n bt br">8</a>');
            h.push('<a href="javascript:;" class="n bt">9</a>');
            h.push('<a href="javascript:;" class="bt br wxbg reset"><span class="wxicon icon-refresh"></span></a>');
            h.push('<a href="javascript:;" class="n bt br">0</a>');
            h.push('<a href="javascript:;" class="del bt wxbg"><span class="wxicon icon-revocat"></span></a>');
            h.push('</article></div><article class="_pop bg-black" style="z-index:980" id="_password_pop_"></article>');
            var html = $(h.join(''));
            var pwd = "";
            var pvalue = html.find(".password-value em");
            var key = html.find(".keyboard a.n");
            key.click(function () {
                if (pwd.length < 6) {
                    pwd += $(this).text();
                    pvalue.text("");
                    html.find(".password-value em:lt(" + pwd.length + ")").text("*");
                    if (pwd.length == 6) {
                        key.css("color", "#e8e8e8");
                        key.unbind("click");
                        html.find(".keyboard a.del").unbind("click");
                        html.find(".reset").unbind("click");
                        if (sback && sback instanceof Function) {
                            sback(pwd);
                        }
                    }
                }
            });
            html.find(".keyboard a.del").click(function () {
                if (pwd.length > 0) {
                    pwd = pwd.substr(0, pwd.length - 1);
                    pvalue.text("");
                    html.find(".password-value em:lt(" + pwd.length + ")").text("*");
                    key.css("color", "#444");
                }
            });
            html.find(".cancel").click(function () {
                pwd = "";
                html.remove();
                if (cback && cback instanceof Function) {
                    cback();
                }
            });
            html.find(".reset").click(function () {
                pwd = "";
                pvalue.text("");
            });
            html.find(".passok").click(function () {
                if (pwd.length == 6 && sback && sback instanceof Function) {
                    sback(pwd); //html.remove(); 
                }
            });
            html.find(".paymethod").click(function () {
                if (pback && pback instanceof Function) {
                    pback();
                }
            });
            $("body").append(html);
            //临时解决方法，请不要删除两个fastclick
            FastClick.attach(document.body);
            FastClick.attach(document.body);
        },
        /**
         * 僧财宝协议弹框
         * key：不同页面弹出这个框时，赋予不同的key值
         * isfirst：是否只显示一次
         */
        scgSignAlert: function (key, isfirst, okcallback, cancelcallback) {
            var htmlstr = '<div class="mask"></div>\
            <div class="agreement">\
                <div class="colse_icon">\
                    <img src="' + $.resurl() + '/css/img2.0/close.png" alt="" width="6%">\
                </div>\
                <h2>账户余额升级为僧财宝</h2>\
                <p class="tit1">亲爱的施主们：</p>\
                <p class="tit1">即日起，唐小僧账户余额正式升级为“僧财宝”。“僧财宝”对接汇添富货币基金，让您的账户余额不再睡大觉, 本服务由存钱罐提供 。</p>\
                <p class="p_show tit1">在您继续使用唐小僧前，请知悉并同意以下协议：</p>\
                <div class="dis_flex">\
                    <div class="protocol">\
                    <a href="/Html/Anonymous/moneybox-xy.html">《<span class="blue_text">存钱罐服务协议</span>》</a>、<a href="/Html/Product/contract/htffund.html">《<span class="blue_text">汇添富基金管理股份有限公司电子交易直销前置式自助前台服务协议</span>》</a>\
                    </div>\
                </div>\
                <p class="risk-tips">网贷有风险，出借需谨慎</p>\
                <div class="agreeused">\
                <div class="to_agree">我已充分理解以上协议</div>\
                <div class="protocol_agree">同意</div>\
                </div>\
            </div>';
            var html = $(htmlstr);
            html.find(".colse_icon img").click(function () {
                $.setscbSigned(key, 0); // 0表示不同意
                $(".mask").remove();
                $(".agreement").remove();
                //window.location.reload();
                cancelcallback && cancelcallback();
            });
            html.find(".protocol_agree").click(function () {
                $.signSCBAgreement(function () {
                    $.setscbSigned(key, 1); // 1表示同意
                    $(".mask").remove();
                    $(".agreement").remove();
                    //window.location.reload();
                    okcallback && okcallback();
                });
            });
            if (isfirst) {
                !$.getscbSigned(key) && $("body").append(html);
            } else {
                $("body").append(html);
            }
        },
        // 获取僧财宝同意协议的cookie值
        getscbSigned: function (key) {
            return $.getLS("signmoney_" + key);
        },
        // 设置僧财宝的cookie值
        // value：是否同意协议的bool值
        setscbSigned: function (key, value) {
            $.setLS("signmoney_" + key, value);
        },
        //PayMethodHtml: function (account, product) {
        //    var ha = [];
        //    ha.push('<section class="content" id="choicepay">');
        //    ha.push('<articel class="viewport" id="articel-pay" style="background-color: #F0EFF4;position:fixed;z-index:999999">');
        //    ha.push(' <div class="box-content" id="basicdiv">');
        //    ha.push('<span class="first-span" id="basic">账户余额</span><span class="second-span">可用余额<z id="basicbalance"></z>元</span><img class="active basicimg" src="/css/img2.0/checkbox.png"  style="display:none">  </div>');
        //    ha.push(' <div class="box-content" id="zzbdiv">');
        //    ha.push('  <span class="first-span" id="demand">至尊宝</span><span class="second-span">可用余额<z id="demandbalance"></z>元</span><img class="active demandimg" src="/css/img2.0/checkbox.png" style="display:none"> </div>');
        //    ha.push(' <div class="box-content" id="bankdiv">');
        //    ha.push('<z id="bankname"></z><span class="second-span">（<z id="cardcode"></z>）单笔额度<z id="depositsinglemax"></z></span><img class="active bankimg" src="/css/img2.0/checkbox.png" style="display:none"> </div>');
        //    ha.push('</articel></section>');
        //    var result = $(ha.join(''));
        //    $("body").append(result);

        //},
        closePWD: function () {
            $("#_password_pop_").remove();
            $("#_password_").remove();
        },

        getImgYZM: function (id) {
            var $id = $("#" + id);
            $.getimgCode(id);
            $id.click(function () {
                $.getimgCode(id);
            });
        },
        getimgCode: function (id) {
            var $id = $("#" + id);
            var imgkey = $id.attr("alt");
            $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/getimgcode", {
                imgkey: imgkey
            }, true).then(
                function (d) {
                    $id.attr("src", d.imgcode);
                    $id.attr("alt", d.imgkey);
                });
        },
        UpdateTitle: function (newtitle) {
            var $body = $('body');
            document.title = newtitle;
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="/favicon.ico" style="visibility: hidden;"></iframe>').on('load', function () {
                setTimeout(function () {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body);
        },
        //僧财宝改版（充值提现改为转入转出）
        sengcaibaobtntext: function (callback) {
            var url = "/StoreServices.svc/user/info";
            $.AkmiiAjaxPost(url, {}, false).then(function (data) {
                if (data.result) {
                    //是否同意协议
                    if (data.accountinfo.issignmoneyboxandhtffund) {
                        callback(["转入", "转出", "僧财宝", "僧财宝"], data.accountinfo);
                    } else {
                        callback(["充值", "提现", "账户余额", "存钱罐"], data.accountinfo);
                    }
                }
            });
        },
        //获取验证码倒计数
        GetYzm: function (id, timecount) {
            if (intervalHandlerYZM)
                clearInterval(intervalHandlerYZM);

            var time = timecount || 120;
            $("#" + id).attr("disabled", true);
            $("#" + id).html(time + "秒");
            intervalHandlerYZM = setInterval(function () {
                time--;
                $("#" + id).html(time + "秒");
                if (time <= 0) {
                    clearInterval(intervalHandlerYZM);
                    $("#" + id).attr("disabled", false);
                    $("#" + id).html('重新获取');
                }
            }, 1000);
        },
        //获取验证码倒计数
        GetYzm_React: function (id, timecount) {
            if (intervalHandlerYZM)
                clearInterval(intervalHandlerYZM);

            var time = timecount || 120;
            //let txtmobile = ReactDOM.findDOMNode < HTMLInputElement > (this.refs["txtmobile"]);

            $(id).attr("disabled", true);
            $(id).html(time + "秒");
            intervalHandlerYZM = setInterval(function () {
                time--;
                $(id).html(time + "秒");
                if (time <= 0) {
                    clearInterval(intervalHandlerYZM);
                    $(id).attr("disabled", false);
                    $(id).html('重新获取');
                }
            }, 1000);
        },
        //调用安卓ios方法[待优化]
        PhoneMode: function (method, phoneType) {
            switch (method) {
                case "callLogin":
                    if (phoneType == "ios") {
                        PhoneMode.callLogin(""); //JS 调用本地登录方法
                    } else if (phoneType == "android") {
                        window.PhoneMode.callLogin(""); //JS 调用本地登录方法
                    }
            }
        },
        //百度统计
        BaiduStatistics: function (category, action, opt_label, opt_value) {
            _hmt.push(['_trackEvent', category, action, opt_label || "", opt_value || 0]);
        },
        //倒计时 参数：$("#obj")
        CountDown: function (obj, timecount, title) {
            obj.addClass('ui-disabled');
            obj.html(timecount + "秒");
            var int = obj.attr('AzCountDownInt');
            if (int) {
                clearInterval(int);
            }

            int = setInterval(function () {
                timecount--;
                obj.html(timecount + "秒");
                if (timecount <= 0) {
                    clearInterval(int);
                    obj.removeClass('ui-disabled');
                    obj.html(title);
                }
            }, 1000);
            obj.attr('AzCountDownInt', int);
        },
        //摇聚会活动倒计时 参数：$("#obj")
        ActivityCountDown: function (id, start) {
            var int = setInterval(function () {
                var text = "即将开始";
                var now = new Date();
                var timecount = (Date.parse(new Date(start.replace(/-/g, "/"))) / 1000) - (Date.parse(now) / 1000);
                var day = 0; //timecount/60/60/24=86400
                var hour = 0; //=timecount/60/60=3600
                var minute = 0; //=timecount/60=60
                var seconds = 0; //=timecount
                if (timecount > 86400) {
                    day = parseInt(timecount / 86400); //n天
                    hour = parseInt((timecount - (86400 * day)) / 3600); //n小时，不满一个小时为0小时
                    minute = parseInt((timecount - (86400 * day) - (3600 * hour)) / 60); //n分钟，不满一分钟为0分钟
                    seconds = parseInt((timecount - (86400 * day) - (3600 * hour) - (60 * minute))); //n秒
                } else if (timecount > 3600) {
                    hour = parseInt(timecount / 3600); //n小时
                    minute = parseInt((timecount - (3600 * hour)) / 60); //n分钟，不满一分钟为0分钟
                    seconds = parseInt((timecount - (3600 * hour) - (60 * minute))); //n秒
                } else if (timecount > 60) {
                    minute = parseInt(timecount / 60); //n分钟
                    seconds = parseInt((timecount - (60 * minute))); //n秒
                } else {
                    seconds = parseInt(timecount); //n秒
                }
                text = (day == 0 ? "" : day + "天") + (hour == 0 ? "" : hour + "时") + (minute == 0 ? "" : minute + "分") + seconds + "秒";

                if (timecount <= 0) {
                    clearInterval(int);
                    $(id).html("钜惠中");
                } else {
                    $(id).html(text);
                }

            }, 1000);
        },
        //提示框开始
        hideLoader: function () {
            $.hideWeuiLoading();
            //return;
            _closeWinDiv();
        },
        showLoader: function (text) {
            if (text) {
                _showMainDiv();
                /*<p>这是内容</p>*/
                $('.az-showmasker-Text').append($('<p>' + (text ? text : '唐小僧正在努力加载中.....') + '</p>'));
            } else {
                $.weuiLoading();
                return;
            }
        },
        hideWeuiLoading: function () {
            $(".common-weui-loadingtoast").remove();
        },
        weuiLoading: function (text) {
            $.hideWeuiLoading();
            var text = text || "加载中";
            var a = [];
            a.push('<div class="weui_loading_toast common-weui-loadingtoast">');
            a.push('<div class="weui_mask_transparent"></div>');
            a.push('<div class="weui_toast">');
            a.push('<div class="weui_loading">');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_0"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_1"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_2"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_3"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_4"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_5"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_6"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_7"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_8"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_9"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_10"></div>');
            a.push('<div class="weui_loading_leaf weui_loading_leaf_11"></div>');
            a.push('</div>');
            a.push('<p class="weui_toast_content">' + (text) + '</p>');
            a.push('</div>');
            a.push('</div>');
            $("body").append(a.join(''));
        },
        txsHideAjaxLoading: function () {
            $(".txs-ajax-loading-container,.txs-ajax-loading-mask").remove();
        },
        txsAjaxLoading: function () {
            //因为新老页面的公共样式不通，避免loading失效
            //所以将样式改为内联用法
            //新老页面的rem单位不一致
            //所以将rem单位改为px(影响不大)
            var _innerhtml = '\
                <div class="txs-ajax-loading-container" style = "position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 999999;" > \
                    <div style = "height: 100%;background: url(' + $.resurl() + '/css/img2.0/loding.gif) center no-repeat;background-size: 65px 65px;"></div>\
                </div>\
                <div class="txs-ajax-loading-mask" style="width: 100%;height: 100%;background: transparent;position: fixed;top: 0;left: 0;z-index: 999998;"></div>\
            '
            $("body").append($(_innerhtml));
        },
        /**三秒toast */
        txsToast: function (msg) {
            msg && msg.trim() && $("body").append('<div id="_com_txstoast"><div class="txs_toast middle "><span class= "txs_toast_text">' + msg + '</span></div><div class="mask mask_bg_transparent"></div></div>');
            setTimeout(function () {
                $("#_com_txstoast").hide(200, function () {
                    $(this).remove();
                })
            }, 1800);
        },
        alertF: function (text, ltext, rcallback, needtitle, title) {
            if ($.isNull(text)) return;
            if ($.isNull(needtitle)) {
                needtitle = false;
            }
            _showMainDiv();
            var ha = [];
            if (needtitle) {
                ha.push('<h3 class="text-center" style="padding-top:2.5rem">');
                ha.push(title ? title :'提示');
                ha.push('</h3>');
            }
            ha.push('<p>');
            ha.push(text);
            ha.push('</p><div class="row"><div class="small-12 columns az-padding0 az-text-center bord-t col-g">');
            ha.push(ltext ? ltext : '确定');
            ha.push('</div></div>');
            var html = $(ha.join(''));
            html.find('.col-g').click(function () {
                _closeWinDiv();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });
            $('.az-showmasker-Text').append(html);
        },
        alertS: function (text, rcallback) { //商户改版弹出确定提示框
            if ($.isNull(text)) return;
            var ha = [];
            ha.push("<div class=\"mask\"></div>");
            ha.push("  <div class=\"popup az-center bb\" style=\"z-index:99999\" >");
            ha.push("    <icon class=\"wechat icon-atte\"></icon>");
            ha.push("    <h2>提示</h2>");
            ha.push("    <p class=\"bb az-text-center\">" + text + "</p>");
            ha.push("    <a href=\"#\">确定</a>");
            ha.push("  </div>");
            var html = $(ha.join(''));
            html.find('a').click(function () {
                html.remove();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });
            $('body').append(html);
        },
        alertT: function (titletext, text, btext, rcallback) {
            if ($.isNull(text)) return;
            var ha = [];
            ha.push("<div class=\"mask\"></div>");
            ha.push('<div class="miss-tip">');
            ha.push('<h3 class="az-text-center">' + titletext + '</h3>');
            ha.push('  <p class="az-text-center bb">' + text + '</p>');
            ha.push('<a href="javascript:void(0)" class="az-text-center">' + btext + '</a>');
            ha.push(' </div>');
            var html = $(ha.join(''));
            html.find('a').click(function () {
                html.remove();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });
            $('body').append(html);
        },
        //alert use defaults config
        alert: function (options) {
            var _opt = $.extend({}, _alert_defaults, options);
            $.alertNew(_opt.text, _opt.ltext, _opt.rcallback, _opt.title, _opt.icon);
        },
        // 添加了isleft，表示详细提示信息是否居左
        alertNew: function (text, ltext, rcallback, title, icon, isleft) {
            if ($.isNull(text)) {
                return;
            }
            //title = title || "提示";
            icon = icon || "icon-my-sigh";
            ltext = ltext || "确定";
            var ha = [];
            ha.push('<article class="_pop poplayer fund-poplayer text-center" style="top:30%;left:0;right:0;position:fixed;z-index:99999;font-size:1.2rem;margin:0 auto;">');
            ha.push('<article class="poplayer-content text-center">');
            ha.push('<span class="wxicon ' + icon + ' padding0"></span>');
            if (title) {
                ha.push('<p class="phead"><b>' + title + '</b></p>');
            }
            if (isleft) {
                ha.push('<p class="ptext">' + text + '</p>');
            } else {
                ha.push('<p>' + text + '</p>');
            }
            ha.push('</article>');
            ha.push('<article class="okbtn row">');
            ha.push('<div class="left small-12"><span class="fpbutton">' + ltext + '</span></div>');
            ha.push('</article>');
            ha.push('</article>');
            ha.push('<article class="_alert_pop bg-black" style="z-index:9999"></article>');
            var html = $(ha.join(''));
            html.find(".okbtn").unbind("click").click(function () {
                html.remove();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });
            $("._alert_pop").remove();
            $("body").append(html);
        },
        //confirm use defaults config
        confirm: function (options) {
            var _opt = $.extend({}, _confirm_defaults, options);
            $.confirmNew(_opt.title, _opt.icon, _opt.text, _opt.ltext, _opt.rtext, _opt.lcallback, _opt.rcallback);
        },
        confirmNew: function (title, icon, text, ltext, rtext, lcallback, rcallback) {
            title = title || "提示";
            icon = icon || "icon-my-sigh";
            ltext = ltext || "取消";
            rtext = rtext || "确定";
            var ha = [];
            ha.push('<article class="_pop poplayer fund-poplayer text-center" style="top:30%;left:0;right:0;position:fixed;font-size:1.2rem;margin:0 auto;">');
            ha.push('<article class="poplayer-content text-center">');
            ha.push('<span class="wxicon ' + icon + ' padding0"></span>');
            ha.push('<p><b>' + title + '</b></p>');
            ha.push('<span class="gray">' + text + '</span>');
            ha.push('</article>');
            ha.push('<article class="row">');
            ha.push('<div class="cancelbtn left small-6 "><span class="fpbutton">' + ltext + '</span></div>');
            ha.push('<div class="okbtn left small-6 bl"><span class="fpbutton">' + rtext + '</span></div>');
            ha.push('</article>');
            ha.push('</article>');
            ha.push('<article class="_pop bg-black"></article>');
            var html = $(ha.join(''));
            html.find(".okbtn").unbind("click").click(function () {
                html.remove();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });
            html.find(".cancelbtn").unbind("click").click(function () {
                html.remove();
                if (lcallback && lcallback instanceof Function) {
                    lcallback();
                }
            });
            $("._pop").remove();
            $("body").append(html);
        },
        confirmF: function (text, ltext, rtext, lcallback, rcallback) {
            _showMainDiv();
            var ha = [];
            ha.push('<p>');
            ha.push(text);
            ha.push('</p><div class="row"><div class="small-6 columns az-padding0 az-text-center col-r _left-btn">');
            ha.push(ltext ? ltext : '取消');
            ha.push('</div><div style="border-right:0;" class="small-6 columns az-padding0 az-text-center col-r _right-btn">')
            ha.push(rtext ? rtext : '确定');
            ha.push('</div></div>');
            var html = $(ha.join(''));

            html.find('._left-btn').click(function () {
                _closeWinDiv();
                if (lcallback && lcallback instanceof Function) {
                    lcallback();
                }
            });
            html.find('._right-btn').click(function () {
                _closeWinDiv();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });

            $('.az-showmasker-Text').append(html);
        },
        confirmF2: function (text, ltext, rtext, lcallback, rcallback) {
            _showMainDiv();
            var ha = [];
            ha.push(text);
            ha.push('<div class="row"><div class="small-6 columns az-padding0 az-text-center col-r _left-btn">');
            ha.push(ltext ? ltext : '取消');
            ha.push('</div><div style="border-right:0;" class="small-6 columns az-padding0 az-text-center col-r _right-btn">')
            ha.push(rtext ? rtext : '确定');
            ha.push('</div></div>');
            var html = $(ha.join(''));

            html.find('._left-btn').click(function () {
                _closeWinDiv();
                _closeWinDivPWD();
                if (lcallback && lcallback instanceof Function) {
                    lcallback();
                }
            });
            html.find('._right-btn').click(function () {
                _closeWinDiv();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });

            $('.az-showmasker-Text').append(html);
        },
        //弹框
        confirmF3: function (text, ltext, rtext, lcallback, rcallback) {
            _showMainDiv();
            var ha = [];
            ha.push('<p>');
            ha.push(text);
            ha.push('</p><div class="row"><div class="small-6 columns az-padding0 az-text-center col-r _left-btn left">');
            ha.push(ltext ? ltext : '取消');
            ha.push('</div><div style="border-right:0;" class="small-6 columns az-padding0 az-text-center col-r _right-btn right">')
            ha.push(rtext ? rtext : '确定');
            ha.push('</div></div>');
            var html = $(ha.join(''));

            html.find('._left-btn').click(function () {
                _closeWinDiv();
                if (lcallback && lcallback instanceof Function) {
                    lcallback();
                }
            });
            html.find('._right-btn').click(function () {
                _closeWinDiv();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });

            $('.az-showmasker-Text').append(html);
        },
        confirmLocation: function (text, ltext, rtext, lcallback, rcallback) {
            _showMainDivLocation();
            var ha = [];
            ha.push('<p>');
            ha.push(text);
            ha.push('</p><div class="row"><div class="small-6 columns az-padding0 az-text-center col-r _left-btn">');
            ha.push(ltext ? ltext : '取消');
            ha.push('</div><div style="border-right:0;" class="small-6 columns az-padding0 az-text-center col-r _right-btn">')
            ha.push(rtext ? rtext : '确定');
            ha.push('</div></div>');
            var html = $(ha.join(''));

            html.find('._left-btn').click(function () {
                _closeWinDivLocation();
                if (lcallback && lcallback instanceof Function) {
                    lcallback();
                }
            });
            html.find('._right-btn').click(function () {
                _closeWinDivLocation();
                if (rcallback && rcallback instanceof Function) {
                    rcallback();
                }
            });

            $('#az-showmasker-TextLocation').append(html);
        },
        //进度条
        showLoaderProcess: function (text, imgName) {
            $('<div class="jquery_addmask"></div>').appendTo(document.body).css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                'z-index': 10000,
                width: $(document).width(),
                height: $(document).height(),
                'background-color': '#000',
                opacity: 0
            }).fadeIn('slow', function () {
                // 淡入淡出效果
                $(this).fadeTo('slow', 0.6);
            });
            var ha = [];
            ha.push('<img src="' + $.resurl() + '/css/img/' + (imgName ? imgName : "ProcessRedeem.gif") + '" width="100%" /><h1>' + (text ? text : "") + '</h1><button class="ui-btn ui-shadow">返回</button>');
            //ha.push('<div class="ui-grid-a">');
            //ha.push('<div class="ui-block-a az-text-center"><button class="ui-btn ui-shadow az-go ui-disabled">继续等待</button></div>');
            //ha.push('<div class="ui-block-b az-text-center"><button class="ui-btn ui-shadow az-back">返回</button></div></div>');

            $.mobile.loading('show', {
                textVisible: true,
                textonly: true,
                html: ha.join('')
            });
        },
        //获取url参数
        getQueryStringByName: function (name) {
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },
        getPageParams: function () {
            var i, ilen, strs, keyName, keyValue,
                params = {},
                path = window.location.pathname,
                url = window.location.href;
            if (url.indexOf("?") > -1) {
                var index = url.indexOf("?");
                strs = url.substring(index + 1);
                strs = strs.split("&");
                ilen = strs.length;
                for (i = 0; i < ilen; i++) {
                    var indexEqual = strs[i].indexOf('=');
                    keyName = strs[i].substring(0, indexEqual);
                    keyValue = strs[i].substring(indexEqual + 1);
                    if (keyName == "callback" || keyName == "rturl") keyValue = decodeURIComponent(keyValue);
                    params[keyName] = keyValue;
                }
            }
            return params;
        },
        HideMobile: function (mobile) {
            if (!$.isMobilePhone(mobile)) {
                return mobile;
            } else {
                return mobile = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
            }
        },
        CheckInputAmount: function (id) {
            $("#" + id).keyup(function () {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            }).bind("paste", function () { //CTR+V事件处理
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            }).css("ime-mode", "disabled"); //CSS设置输入法不可用

            $("#" + id).bind("click", function () {
                if (typeof id == 'string') obj = document.getElementById(id);
                obj.focus();
                if (obj.createTextRange) {
                    var rtextRange = obj.createTextRange();
                    rtextRange.moveStart('character', obj.value.length);
                    rtextRange.collapse(true);
                    rtextRange.select();
                } else if (obj.selectionStart) obj.selectionStart = obj.value.length;
            });
        },
        //身份证号码的验证规则
        isIdCardNo: function (num) {
            //if (isNaN(num)) {$.alertF("输入的不是数字！"); return false;} 
            var len = num.length,
                re;
            if (len == 15)
                re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
            else if (len == 18)
                re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
            else {
                //$.alertF("输入的数字位数不对。");
                return false;
            }
            var a = num.match(re);
            if (a != null) {
                if (len == 15) {
                    var D = new Date("19" + a[3] + "-" + a[4] + "-" + a[5]);
                    var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
                } else {
                    var D = new Date(a[3] + "-" + a[4] + "-" + a[5]);
                    var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
                }
                if (!B) {
                    //$.alertF("输入的身份证号 "+ a[0] +" 里出生日期不对。");
                    return false;
                }
            }
            if (!re.test(num)) {
                //$.alertF("身份证最后一位只能是数字和字母。");
                return false;
            }
            return true;
        },
        //验证手机号码
        isMobilePhone: function (value) {
            //return (value.length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
            //return (value.length == 11 && /^((1[3-9][0-9]{1})+\d{8})$/.test(value));
            return (value.length == 11 && /^1[3|4|5|6|7|8|9]\d{9}$/.test(value)); //验证手机号最新

        },
        //验证是否为数字
        isNumber: function (value) {
            return /^\d+$/.test(value);
        },
        //保留两位小数
        isMoneyTwoPlace: function (value) {
            return /^\d+(\.\d{0,2})?$/.test(value);
        },
        //非空验证
        isNull: function (value) {
            return (value && $.trim(value + "").length > 0 && value != "null") ? false : true;
        },
        //系统是否处于维护中
        GetSystemMaintenanceSwitch: function () {
            $.AkmiiAjaxGet("/Service.svc/GetSystemMaintenanceSwitch").done(function (d) {
                if (d) {
                    window.location.href = "/SystemMaintenance.html";
                }
            });
        },
        //判断是否为微信端登录--暂用解决方案
        is_weixn: function () {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.match(/MicroMessenger/i) == "micromessenger");
        },
        is_pcwechat: function () {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.match(/MicroMessenger/i) == "micromessenger") && ((ua.match(/windowswechat/i) == "windowswechat"));
        },
        ismobile: function () {
            var a = navigator.userAgent || navigator.vendor || window.opera;
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                return true;
            } else {
                return false;
            }
        },
        //读取cookies
        getCookie: function (name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(name + "=")
                if (c_start != -1) {
                    c_start = c_start + name.length + 1
                    c_end = document.cookie.indexOf(";", c_start)
                    if (c_end == -1) c_end = document.cookie.length
                    return unescape(document.cookie.substring(c_start, c_end))
                }
            }
            return "";
        },
        setCookie: function (name, value, minute) {
            var Minute = minute || 43200; //相当于30天
            var exp = new Date();
            exp.setTime(exp.getTime() + Minute * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
        },
        //删除cookies
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = $.getCookie(name);
            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;";
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;domain=." + window.location.host + ";";
            }

        },
        supportLS: function () {
            if (window.localStorage) {
                return true;
            } else {
                return false;
            }
        },
        setLS: function (key, value) {
            if ($.supportLS()) {
                $.removeLS(key);
                localStorage.setItem(key, value);
            } else {
                $.setCookie(key, value);
            }
        },
        setObjectLS: function (key, object) {
            var json = JSON.stringify(object);
            $.removeLS(key);
            var encode = encodeURIComponent(json);
            localStorage.setItem(key, encode);
        },
        getLS: function (key) {
            if ($.supportLS()) {
                return localStorage.getItem(key);
            } else {
                return $.getCookie(key);
            }
        },
        getObjectLS: function (key) {
            var value = localStorage.getItem(key);
            if (value) {
                var decode = decodeURIComponent(value);
                return JSON.parse(decode);
            }
            return "";
        },
        removeLS: function (key) {
            localStorage.removeItem(key);
        },
        clearLS: function () {
            localStorage.clear();
        },
        getSession: function (key) {
            if (!!window.sessionStorage) {
                return sessionStorage.getItem(key);
            } else {
                return $.getCookie(key);
            }
        },
        setSession: function (key, value) {
            if (!!window.sessionStorage) {
                sessionStorage.removeItem(key);
                sessionStorage.setItem(key, value);
            } else {
                $.setCookie(key, value, 60 * 12);
            }
        },
        delSession: function (key) {
            if (!!window.sessionStorage) {
                sessionStorage.removeItem(key);
            } else {
                $.delCookie(key);
            }
        },
        //获取用户信息如果存在本地缓存
        getUserInfoIfHasLS: function (scallback, fcallback) {
            var userinfo = $.getObjectLS(USERINFOLSKEY);
            var MadisonToken = $.getCookie("MadisonToken");
            if (MadisonToken) {
                if ($.supportLS() && userinfo) {
                    var create = userinfo.clientdate;
                    var now = new Date();
                    create = new Date(create);
                    var differ = (now - create) / 1000;
                    if (differ > 300) {
                        var url = "/StoreServices.svc/user/info";
                        $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                            if (data.result) {
                                data.clientdate = new Date();
                                $.setObjectLS(USERINFOLSKEY, data);
                            }
                            if (scallback && scallback instanceof Function) {
                                scallback(data);
                                return;
                            }
                        }, function () {
                            if (fcallback && fcallback instanceof Function) {
                                fcallback();
                                return;
                            }
                        });
                    } else {
                        if (scallback && scallback instanceof Function) {
                            scallback(userinfo);
                            return;
                        }
                    }
                } else {
                    var url = "/StoreServices.svc/user/info";
                    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                        if (data.result) {
                            data.clientdate = new Date();
                            $.setObjectLS(USERINFOLSKEY, data);
                        }
                        if (scallback && scallback instanceof Function) {
                            scallback(data);
                            return;
                        }
                    }, function () {
                        if (fcallback && fcallback instanceof Function) {
                            fcallback();
                            return;
                        }
                    });
                }
            } else {
                if (scallback && scallback instanceof Function) {
                    var data = {};
                    data.errorcode = "missing_parameter_accountid";
                    data.errormsg = "缺少参数:accountid";
                    scallback(data);
                    return;
                }
            }
        },
        //清空用户信息本地缓存
        clearUserInfoLS: function () {
            $.removeLS(USERINFOLSKEY);
        },
        //设置用户信息本地缓存
        setUserInfoLS: function (data) {
            data.clientdate = new Date();
            $.setObjectLS(USERINFOLSKEY, data);
        },
        //截取字符串
        Cutstring: function (text, lens, str) {
            lens = lens ? lens : 40;
            str = str ? str : "...";
            if (!$.isNull(text)) {
                text = text.length > lens ? (text.substring(0, lens) + str) : text;
            } else {
                return "";
            }
            return text;
        },
        //截取字符串
        Cutstring2: function (text, lens) {
            lens = lens ? lens : 40;
            if (!$.isNull(text)) {
                text = text.length > lens ? (text.substring(0, lens)) : text;
            } else {
                return "";
            }
            return text;
        },
        null2str: function (str) {
            if (str == null || str == undefined) {
                return "";
            }
            return str;
        },
        //判断微信
        is_weixn2: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },

        // 获取当前页面运行的系统
        getPlatform: function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                //移动终端浏览器版本信息                 
                trident: u.indexOf('Trident') > -1, //IE内核                 
                presto: u.indexOf('Presto') > -1, //opera内核                 
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核                 
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核                 
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端                 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端                 
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器                 
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器                 
                iPad: u.indexOf('iPad') > -1, //是否iPad                 
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部    
            };
        },
        //根据省市区编码补全地址
        procitydis: function (storeprovince, storecity, storedistrict, storeaddress, container, Wordlimit) {
            $.getJSON("/js/cn_citytree.js", function (json) {
                citylist_json = json.citylist;
                $.each(citylist_json, function (i, element) {
                    if (element.I == storeprovince) {
                        protext = element.N;
                        var item = protext;
                        $.each(element.C, function (i, cityelement) {
                            if (cityelement.I == storecity) {
                                citytext = cityelement.N;
                                item += citytext;
                                $.each(cityelement.C, function (i, dislement) {
                                    if (dislement.I == storedistrict) {
                                        distext = dislement.N;
                                        item += distext;
                                        item += storeaddress;
                                        if (Wordlimit) {
                                            item = $.Cutstring(item, Wordlimit, "..")
                                        }
                                        container.html(item);
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });
            });
        },
        getLocationFailure: function (notOpen, callback) {
            if (notOpen) {
                $.alertF("暂未开通您所在的城市！<br/>请选择其他城市", null, function () {
                    window.location.href = "/html/store/choosecity.html";
                });
            } else {
                //2017.07.28产品要求不弹窗直接定位到上海
                // $.confirmLocation("获取定位信息失败<br/>已定位到热门城市'上海'", "取消", "切换城市", function () {

                // }, function () {
                //     window.location.href = "/html/store/choosecity.html";
                // });



                var Location = {
                    lng: 121.48789900000,
                    lat: 31.24916200000
                };
                $.setCookie("MadisonStoreBaiduLocation", JSON.stringify(Location), 30);
                var addComp = {
                    province: "",
                    city: "上海市",
                    citycode: "310000",
                    district: "",
                    street: "",
                    streetNumber: ""
                };
                $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 30);
                //福利首页,定位失败后台,默认到上海,reload页面无效。使用回调函数解决。
                if (callback && callback instanceof Function) {
                    callback((Location));
                } else {
                    window.location.reload();
                }
            }
        },
        //获取城市缓存
        getCityCookie: function () {

        },
        //获取当前城市   参数：回调函数，精度，维度
        getLocationCity: function (scallback, J, W) {
            var addComp;
            var LocationCityCookie = $.getCookie("MadisonStoreBaiduLocationCity");
            if (!$.isNull(LocationCityCookie)) {
                addComp = (new Function('return' + LocationCityCookie))();
                if (scallback && scallback instanceof Function) {
                    scallback((addComp));
                }
            } else {
                var Location = {};
                var LocationCookie = $.getCookie("MadisonStoreBaiduLocation");
                if (!$.isNull(LocationCookie)) {
                    Location = (new Function('return' + LocationCookie))();
                    //百度逆地址解析 获取城市名称
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(new BMap.Point(Location.lng, Location.lat), function (rs) {
                        addComp = rs.addressComponents;
                        if ($.isNull(addComp.citycode)) {
                            $.getJSON('/js/baidumap_citycenterlistpro.js', function (json) {
                                $.each(json, function (index, element) {
                                    if (element.N == addComp.city) {
                                        addComp.citycode = element.I;
                                        $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 35);
                                        if (scallback && scallback instanceof Function) {
                                            scallback((addComp));
                                        }
                                        return;
                                    }
                                });
                                if ($.isNull(addComp.citycode)) {
                                    $.getLocationFailure(true);
                                    //window.location.href = "/html/Store/choosecity.html";
                                }
                            });
                        } else {
                            $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 35);
                            if (scallback && scallback instanceof Function) {
                                scallback((addComp));
                            }
                        }
                    });
                } else if (!$.isNull(J) && !$.isNull(W)) {
                    Location = {
                        lng: J,
                        lat: W
                    };
                    //百度逆地址解析 获取城市名称
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(new BMap.Point(Location.lng, Location.lat), function (rs) {
                        addComp = rs.addressComponents;
                        if ($.isNull(addComp.citycode)) {
                            $.getJSON('/js/baidumap_citycenterlistpro.js', function (json) {
                                $.each(json, function (index, element) {
                                    if (element.N == addComp.city) {
                                        addComp.citycode = element.I;
                                        $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 35);
                                        if (scallback && scallback instanceof Function) {
                                            scallback((addComp));
                                        }
                                        return;
                                    }
                                });
                                if ($.isNull(addComp.citycode)) {
                                    $.getLocationFailure(true);
                                    //window.location.href = "/html/Store/choosecity.html";
                                }
                            });
                        } else {
                            $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 35);
                            if (scallback && scallback instanceof Function) {
                                scallback((addComp));
                            }
                        }
                        //document.write(JSON.stringify(addComp));
                        //$.alertF(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    });
                }
            }
        },
        //消息中心（查询消息数据）
        getMitteilung: function (element) {
            var url = "/StoreServices.svc/user/getnotificationchat?g=" + (new Date().getTime());
            $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                if (data.result && data.accountchatinfo.islook) {
                    //element.find('.wxicon').append('<i></i>');
                    element && element.addClass("hasinfo");
                }
            });
        },
        //获取当前城市   参数：回调函数，精度，维度(不取缓存)
        getrepositionLocationCity: function (scallback, J, W) {
            var addComp;
            var Location = {};
            if (!$.isNull(J) && !$.isNull(W)) {
                Location = {
                    lng: J,
                    lat: W
                };
                //百度逆地址解析 获取城市名称
                var geoc = new BMap.Geocoder();
                geoc.getLocation(new BMap.Point(Location.lng, Location.lat), function (rs) {
                    addComp = rs.addressComponents;
                    if ($.isNull(addComp.citycode)) {
                        $.getJSON('/js/baidumap_citycenterlistpro.js', function (json) {
                            $.each(json, function (index, element) {
                                if (element.N == addComp.city) {
                                    addComp.citycode = element.I;
                                    $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 35);
                                    if (scallback && scallback instanceof Function) {
                                        scallback((addComp));
                                    }
                                    return;
                                }
                            });
                            if ($.isNull(addComp.citycode)) {
                                $.getLocationFailure(true);
                                //window.location.href = "/html/Store/choosecity.html";
                            }
                        });
                    } else {
                        $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 35);
                        if (scallback && scallback instanceof Function) {
                            scallback((addComp));
                        }
                    }

                });
            }
        },
        // 僧财宝协议签订
        // callback: 成功了之后调用这个callback
        signSCBAgreement: function (callback) {
            var posturl = "/StoreServices.svc/user/updateissignmoneyboxandhtffundrequest";
            $.AkmiiAjaxPost(posturl, {
                "issignmoneyboxandhtffund": true
            }, true).then(function (d) {
                if (d.result) {
                    callback && callback();
                }
            });
        },
        // 统一网络连接超时接口
        errorNetWork: function () {
            var cont = ' <div class="connectiontimeout">\
                <div class="timeout">\
                    <div class="timeoutheader">\
                        <img src="{0}/css/img2.0/timeoutheader.png" alt="">\
                    </div>\
                    <div class="timeoutbody">\
                        <p>网络连接超时</p>\
                        <p class="lianwang">请检查您的手机是否联网</p>\
                    </div>\
                    <div class="timeoutfooter" id="reload">\
                        点击屏幕重新加载\
                    </div>\
                </div>\
            </div>'.replace("{0}", $.resurl());
            $("body").prepend(cont);
            $(".connectiontimeout").click(function () {
                window.location.reload();
            });
        },
        /**
         * 通过接口获取用户邀请码
         * @param {String} 用户id
         * @param {function} 获取邀请码成功之后回调
         */
        getrefcodeByInter: function (userId, callback) {
            $.AkmiiAjaxPost(window.apiUrl_prefix + "/members/referralcode", {
                "accountId": userId
            }, true).then(function (data) {
                if (data.code == 200) {
                    callback && callback(data.data.referralcode);
                    //referralCode = data.data.referralcode; //邀请码
                }
            });
        },
        // 修改分享链接以及参数
        // 由于微信对分享朋友和朋友圈做了现在，link只能取当前绑定微信公众账号的域名
        // 所以得做一个重定向链接
        // 大坑啊！！！！
        shareRedirectFun: function (appid, reduri) {
            return window.location.origin + "/html/Anonymous/shareredirect.html?appid={0}&reduri={1}".replace("{0}", appid || "").replace("{1}", reduri || "");
        },
        /**
         * 唐小僧官方电话
         * 4006078587
         */
        txsOfficialTel: function () {
            return 'tel:4006078587';
        },
        //调用微信接口 调用发放/成功回调/失败回调函数
        getWechatconfig: function (method, scallback, fcallback, jsonData) {
            $.AkmiiAjaxPost("/StoreServices.svc/user/wechatjsconfig", {
                "url": (window.location.href)
            }, true).then(function (d) {
                if (d) {
                    //document.write(JSON.stringify(d));
                    if (d.result) {

                        var shareUrl = $.shareRedirectFun(d.jsconfig.appId, encodeURIComponent(window.location.href)); //'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + d.jsconfig.appId + '&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';

                        //$.alertF(d.jsconfig.signature + "==" + d.jsconfig.appId + "==" + d.jsconfig.timestamp + "==" + d.jsconfig.nonceStr);
                        //console.log(d.jsconfig.signature + "==" + d.jsconfig.appId + "==" + d.jsconfig.timestamp + "==" + d.jsconfig.nonceStr);
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: d.jsconfig.appId, // 必填，公众号的唯一标识
                            timestamp: d.jsconfig.timestamp, // 必填，生成签名的时间戳
                            nonceStr: d.jsconfig.nonceStr, // 必填，生成签名的随机串
                            signature: d.jsconfig.signature, // 必填，签名，见附录1   // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 onMenuShareAppMessage
                            jsApiList: [
                                'showOptionMenu',
                                'hideMenuItems',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'openLocation',
                                'getLocation',
                                'scanQRCode'
                            ]
                        });
                        wx.ready(function () {
                            wx.showOptionMenu();
                            $.setCookie("IsHiddenWechatMenu", "1");
                            switch (method) {
                                case "getLocation":
                                    //获取地理位置
                                    $.weuiLoading("定位中");
                                    var Location = {};
                                    wx.getLocation({
                                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                        success: function (res) {
                                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                            var speed = res.speed; // 速度，以米/每秒计
                                            var accuracy = res.accuracy; // 位置精度
                                            //document.write(JSON.stringify(res));
                                            var ggPoint = new BMap.Point(longitude, latitude);

                                            //坐标转换完之后的回调函数
                                            translateCallback = function (data) {
                                                if (data.status === 0) {
                                                    Location = {
                                                        lng: data.points[0].lng,
                                                        lat: data.points[0].lat
                                                    };
                                                    $.setCookie("MadisonStoreBaiduLocation", JSON.stringify(Location), 30);
                                                    if (scallback && scallback instanceof Function) {
                                                        scallback(Location);
                                                    }
                                                }
                                            }
                                            setTimeout(function () {
                                                var convertor = new BMap.Convertor();
                                                var pointArr = [];
                                                pointArr.push(ggPoint);
                                                convertor.translate(pointArr, 1, 5, translateCallback)
                                            }, 100);
                                        },
                                        cancel: function (res) {
                                            if (fcallback && fcallback instanceof Function) {
                                                fcallback();
                                            }
                                        },
                                        complete: function (res) {
                                            $.hideWeuiLoading();
                                            $.hideLoader();
                                        },
                                        fail: function (res) {
                                            if (fcallback && fcallback instanceof Function) {
                                                fcallback();
                                            }
                                        }
                                    });
                                    break;
                                case "scanQRCode":
                                    wx.scanQRCode({
                                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                                        success: function (res) {
                                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                            if (scallback && scallback instanceof Function) {
                                                scallback(result);
                                            }
                                        }
                                    });
                                    break;
                                case "onMenuShareTimeline":
                                    wx.onMenuShareTimeline({
                                        title: '唐小僧',
                                        link: shareUrl,
                                        imgUrl: 'http://testmadisonzillion.oss-cn-hangzhou.aliyuncs.com/AppBanner/646296744247214080.jpg',
                                        trigger: function (res) {
                                            //$.alertF('用户点击分享到朋友圈');
                                        },
                                        success: function (res) {
                                            //$.alertF('已分享');
                                        },
                                        cancel: function (res) {
                                            //$.alertF('已取消');
                                        },
                                        fail: function (res) {
                                            //$.alertF(JSON.stringify(res));
                                        }
                                    });
                                    wx.onMenuShareAppMessage({
                                        title: '唐小僧', // 分享标题
                                        desc: '唐小僧理财', // 分享描述
                                        link: shareUrl, // 分享链接
                                        imgUrl: 'http://testmadisonzillion.oss-cn-hangzhou.aliyuncs.com/AppBanner/646296744247214080.jpg', // 分享图标
                                        type: '', // 分享类型,music、video或link，不填默认为link
                                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                        success: function () {
                                            // 用户确认分享后执行的回调函数
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                        }
                                    });
                                    break;
                                case "LuckdrawShare":
                                    shareUrl = $.shareRedirectFun(d.jsconfig.appId, encodeURIComponent(jsonData.link)); //'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + d.jsconfig.appId + '&redirect_uri=' + encodeURIComponent(jsonData.link) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
                                    wx.onMenuShareTimeline({
                                        title: jsonData.title,
                                        link: shareUrl,
                                        imgUrl: jsonData.imgUrl,
                                        success: function (res) {
                                            if (scallback && scallback instanceof Function) {
                                                scallback();
                                            }
                                        },
                                        cancel: function (res) {
                                            if (fcallback && fcallback instanceof Function) {
                                                fcallback();
                                            }
                                        }
                                    });
                                    wx.onMenuShareAppMessage({
                                        title: jsonData.title,
                                        desc: jsonData.desc,
                                        link: shareUrl,
                                        imgUrl: jsonData.imgUrl,
                                        type: '', // 分享类型,music、video或link，不填默认为link
                                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback();
                                            }
                                        },
                                        cancel: function () {
                                            if (fcallback && fcallback instanceof Function) {
                                                fcallback();
                                            }
                                        }
                                    });
                                    wx.onMenuShareQQ({
                                        title: jsonData.title,
                                        desc: jsonData.desc,
                                        link: shareUrl,
                                        imgUrl: jsonData.imgUrl,
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback();
                                            }
                                        },
                                        cancel: function () {
                                            if (fcallback && fcallback instanceof Function) {
                                                fcallback();
                                            }
                                        }
                                    });
                                    break;
                                case "InviteFriends":
                                    //邀请好友分享
                                    shareUrl = $.shareRedirectFun(d.jsconfig.appId, encodeURIComponent(jsonData.link));
                                    //shareUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + d.jsconfig.appId + '&redirect_uri=' + encodeURIComponent(jsonData.link) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
                                    // add by weishuang 2016/12/22
                                    wx.hideMenuItems({
                                        menuList: [
                                            'menuItem:share:qq',
                                            'menuItem:share:weiboApp',
                                            'menuItem:share:QZone',
                                            'menuItem:share:facebook'
                                        ]
                                    });
                                    wx.onMenuShareTimeline({
                                        title: jsonData.title, // 分享标题
                                        link: shareUrl, // 分享链接
                                        imgUrl: 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback(0);
                                            }
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                            fcallback && fcallback();
                                        }
                                    });

                                    wx.onMenuShareAppMessage({
                                        title: jsonData.title, // 分享标题
                                        desc: jsonData.desc,
                                        link: shareUrl, // 分享链接
                                        imgUrl: 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback(1);
                                            }
                                        },
                                        cancel: function () {
                                            fcallback && fcallback();
                                        }
                                    });
                                    break;
                                case "activityshare":
                                    //邀请好友分享
                                    shareUrl = $.shareRedirectFun(d.jsconfig.appId, encodeURIComponent(jsonData.link));
                                    //shareUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + d.jsconfig.appId + '&redirect_uri=' + encodeURIComponent(jsonData.link) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
                                    //发送给好友
                                    wx.onMenuShareAppMessage({
                                        title: jsonData.title, // 分享标题
                                        desc: jsonData.desc,
                                        link: shareUrl, // 分享链接
                                        imgUrl: jsonData.imgUrl, // 分享图标
                                        success: function () {
                                            if (fcallback && fcallback instanceof Function) {
                                                fcallback();
                                            }
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                        }
                                    });
                                    //分享朋友圈
                                    wx.onMenuShareTimeline({
                                        title: jsonData.title, // 分享标题
                                        link: shareUrl, // 分享链接
                                        imgUrl: jsonData.imgUrl, // 分享图标
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback();
                                            }
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                        }
                                    });
                                    break;
                                //双12分享
                                case "doubleTwelveactivityshare":
                                    //邀请好友分享
                                    shareUrl = $.shareRedirectFun(d.jsconfig.appId, encodeURIComponent(jsonData.link));
                                    //shareUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + d.jsconfig.appId + '&redirect_uri=' + encodeURIComponent(jsonData.link) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
                                    //发送给好友
                                    wx.onMenuShareAppMessage({
                                        title: jsonData.title, // 分享标题
                                        desc: jsonData.desc,
                                        link: shareUrl, // 分享链接
                                        imgUrl: jsonData.imgUrl, // 分享图标
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback();
                                            }
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                        }
                                    });
                                    //分享朋友圈
                                    wx.onMenuShareTimeline({
                                        title: jsonData.title, // 分享标题
                                        link: shareUrl, // 分享链接
                                        imgUrl: jsonData.imgUrl, // 分享图标
                                        success: function () {
                                            if (scallback && scallback instanceof Function) {
                                                scallback();
                                            }
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                        }
                                    });
                                    break;
                            }

                        });
                        wx.error(function (res) {
                            //console.log("微信错误：" + res);
                        });

                    } else {
                        if (fcallback && fcallback instanceof Function) {
                            fcallback();
                        }
                        //document.write("获取微信配置错误");
                    }
                }
            });
        },

        /**
         * 底部导航配置
         */
        setupFooterBar: function () {
            // var apiUrl_host="http://192.168.3.27:8883";//开发用
            if ($("#footerBar").length > 0) {
                $.AkmiiAjaxPost(apiUrl_prefix + "/xdq/config/getxdqswitchinfo", {}, true, true).then(function (d) {
                    if (d.code == 200) {
                        if (d.data.imageUrl) {
                            $("#footerBar .xdq_pt").css("backgroundImage", "url('" + d.data.imageUrl + "')");
                        }
                    } else {
                        $.alertF(d.message);
                    }
                })
                $("#footerBar .xdq_pt").click(function () {
                    window.location.href = "/html/anonymous/xdq_trustedLogin.html?pagesource=1";
                });
            }
        }
    });

    if ($.getQueryStringByName("appkey")) {
        $.setSession("APP_unionKey", $.getQueryStringByName("appkey") == "null" ? "" : $.getQueryStringByName("appkey"));
    }


    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    Date.prototype.Format = function (formatStr, useUTC) {

        var fullYear = useUTC ? this.getUTCFullYear() : this.getFullYear();
        var year = useUTC ? this.getYear() : this.getYear();
        var month = useUTC ? this.getUTCMonth() : this.getMonth();
        var date = useUTC ? this.getUTCDate() : this.getDate();
        var day = useUTC ? this.getUTCDay() : this.getDay();
        var hours = useUTC ? this.getUTCHours() : this.getHours();
        var minutes = useUTC ? this.getUTCMinutes() : this.getMinutes();
        var seconds = useUTC ? this.getUTCMinutes() : this.getSeconds();

        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, fullYear);
        str = str.replace(/yy|YY/, (year % 100) > 9 ? (year % 100).toString() : '0' + (year % 100));

        str = str.replace(/MM/, (month + 1) > 9 ? (month + 1).toString() : '0' + (month + 1));
        str = str.replace(/M/g, month);

        str = str.replace(/w|W/g, Week[day]);

        str = str.replace(/dd|DD/, date > 9 ? date.toString() : '0' + date);
        str = str.replace(/d|D/g, date);

        str = str.replace(/hh|HH/, hours > 9 ? hours.toString() : '0' + hours);
        str = str.replace(/h|H/g, hours);
        str = str.replace(/mm/, minutes > 9 ? minutes.toString() : '0' + minutes);
        str = str.replace(/m/g, minutes);

        str = str.replace(/ss|SS/, seconds > 9 ? seconds.toString() : '0' + seconds);
        str = str.replace(/s|S/g, seconds);

        return str;
    };

    Date.prototype.addDays = function (number) {
        return new Date(this.setDate(this.getDate() + number));
    }

    Date.prototype.addMonth = function (number) {
        return new Date(this.setMonth(this.getMonth() + number));
    }

    function validateMoney(str) {
        str = str.replace(/[^0-9.]/g, ''); //^\d+(\.\d{2})?$
        var amount = parseFloat(str);
        return isNaN(amount) ? '' : amount;
    }
    $.fn.moneyInput = function () {
        $(this).change(function () {
            $(this).val(validateMoney($(this).val()));
        }).bind("paste", function () { //CTR+V事件处理
            $(this).val(validateMoney($(this).val()));
        }).css("ime-mode", "disabled"); //CSS设置输入法不可用
    }

    var loadingMoreListMethods = {
        init: function (options) {
            var opt = $.extend({
                text: "加载更多",
                textnoresults: "没有更多记录了！",
                callback: null,
                loadOnInit: false,
                loadingImg: $.resurl() + '/css/img/loadingSmall.gif'
            }, options);
            var ha = [];
            ha.push("<div class='az-list-loader'>");
            ha.push("<div class='az-loader'><img src='");
            ha.push(opt.loadingImg);
            ha.push("'/></div><button class='az-center ui-btn ui-shadow ui-corner-all'>");
            ha.push(opt.text);
            ha.push("</button></div>");
            var obj = $(ha.join(''));
            var btn = obj.find('button');
            btn.attr('textnoresults', opt.textnoresults);
            var loading = obj.find('.az-loader');
            btn.click(function () {
                btn.hide();
                loading.show();
                if (opt.callback && opt.callback instanceof Function) {
                    opt.callback();
                }
            });
            $(this).append(obj);

            if (opt.loadOnInit) {
                btn.click();
            }
        },
        complete: function (nomoreresult) {
            var obj = $(this).find('.az-list-loader');
            var btn = obj.find('button');
            obj.find('.az-loader').hide();
            if (nomoreresult) {
                btn.text(btn.attr('textnoresults'));
                btn.attr("disabled", "disabled");
            }
            btn.show();
        }
    }

    $.fn.loadingMoreList = function (method) {
        if (loadingMoreListMethods[method]) {
            return loadingMoreListMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return loadingMoreListMethods.init.apply(this, arguments);
        } else {
            $.error('Method' + method + 'does not exist on jQuery.loadingMoreList');
        }
    }

    var Ms = $.Ms = $.Ms || {
        version: '1.0'
    };
    $.extend($.Ms, {
        LoadMore: function (listContainer, text, callBackMethod) {

            if (listContainer.find(".ondata").length <= 0) {
                listContainer.append($("<div class='ondata text-center'>").text(text ? text : "点击加载更多"));
            }
            if (callBackMethod) {
                listContainer.find(".ondata").click(function () {
                    $(this).remove();
                    callBackMethod();
                });
            }
        }
    });
})(jQuery);

$(function () {

    //初始化底部菜单功能
    $.setupFooterBar();

    //微信菜单控制
    var controlWechatMenu = function () {
        if (window.location.hostname.indexOf("txslicai.com") < 0) {
            return;
        }
        var RecommendedCode = $.getQueryStringByName("c");
        if (!$.isNull(RecommendedCode)) {
            $.setCookie("RecommendedCode", RecommendedCode);
        }
        var loc = window.location.href.toLowerCase();
        var IshashShare = ["qujin-invite.html", "rock.html", "luckdraw.html", "2015bill.html", "look-movie.html", "redpacket.html", "see-going.html", "gift.html", "store/", "member_center.html", "vipday/index.html"];
        var ishiddemMenu = false;
        $.each(IshashShare, function (i, item) {
            ishiddemMenu = ishiddemMenu || (loc.indexOf(item) > -1);
        });
        if ($.is_weixn() && !ishiddemMenu) {
            // if ($.getCookie("IsHiddenWechatMenu") != "0" || document.referrer.toLowerCase().indexOf(document.location.host.toLowerCase()) == -1) {
            $.setCookie("IsHiddenWechatMenu", "0");
            $.AkmiiAjaxPost("/StoreServices.svc/user/wechatjsconfig", {
                "url": loc
            }, true).then(function (d) {
                if (d && d.result) {
                    jQuery.ajax({
                        url: $.resurl() + "/js/jweixin-1.0.0.js",
                        dataType: "script",
                        cache: true
                    }).done(function () {
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: d.jsconfig.appId, // 必填，公众号的唯一标识
                            timestamp: d.jsconfig.timestamp, // 必填，生成签名的时间戳
                            nonceStr: d.jsconfig.nonceStr, // 必填，生成签名的随机串
                            signature: d.jsconfig.signature, // 必填，签名，见附录1
                            jsApiList: ['hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 onMenuShareAppMessage
                        });
                        wx.ready(function () {
                            wx.hideOptionMenu();
                        });
                    });
                }
            });
            // }
        }
    }

    //触发resize事件，隐藏安全保障
    if ($.browserVersions().android || $.browserVersions().ios || $.browserVersions().iPhone || $.browserVersions().iPad) {
        $(window).resize(function () {
            if ($.is_weixn2()) {
                $(".btmpro-ab,.btmpro-ab2,.safety").toggle();
            }
        });
    }

    //判断当前平台信息
    $.delCookie("PLATFORMTYPE");
    if (!$.is_weixn()) {
        if ($.browserVersions().android) {
            $.setCookie("PLATFORMTYPE", "1");
        } else if ($.browserVersions().ios) {
            $.setCookie("PLATFORMTYPE", "2");
        }
    }

    controlWechatMenu();
});
/***********岂安设备指纹 begin***************/
(function () {
    var _stalkerid = $.getCookie('stalkerid') || '';
    if (!_stalkerid) {
        /*
            TODO:岂安设备指纹url分正式和测试环境,请注意修改
            本地环境，测试，验收：/js/fp.js
            正式环境：https://XXX
        */
        var protocol = window.location.protocol;
        var host = window.location.host;
        var origin = protocol + "//" + host;
        var stalker_jsurl = '';
        var stalker_host = ''; //正式环境stalker项目的主机名
        if (origin == 'https://service.txslicai.com') {
            stalker_jsurl = 'https://stalker.txslicai.com/js/fp.js'; //正式环境的地址
            stalker_host = 'https://stalker.txslicai.com'; //必填！！
        } else {
            if (protocol == 'https:') {
                stalker_jsurl = 'https://stalkeruat.txslicai.com/js/fp.js'; //正式环境的地址
                stalker_host = 'https://stalkeruat.txslicai.com'; //必填！！
            } else {
                stalker_jsurl = '/js/fp.js'; //本地调试，采用加载网站内部资源
                stalker_host = 'http://121.41.43.133';
            }
        }
        try {
            jQuery.ajax({
                url: stalker_jsurl,
                dataType: "script",
                cache: true
            }).done(function () {
                var bsDetect = new BsDetectSDK({
                    server: stalker_host, //填写 server 地址,不包含路径
                    timeout: 3000 //超时时间设置，默认是 3 秒
                });
                bsDetect.getDid(function (bsdid) {
                    //bsdid 是服务端生成的指纹
                    $.setCookie('stalkerid', bsdid || '');
                })
            });
        } catch (e) {
            console.log(e);
        }
    }
})();
/***********岂安设备指纹 end***************/

/***********百度统计 begin***************/
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?333c7d30126a58d17cb37f2289e0ad72";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
/***********百度统计 end****************/

/***********资邦统计 begin***************/
//var _zdq = _zdq || [];
// _zdq.push(['_setAccount', 'page1']);
// var baseUrl = "https://zbdc.txslicai.com/zbdata.js?v=" + (new Date()).getTime();
// (function() {
//     var ma = document.createElement('script');
//     ma.type = 'text/javascript';
//     ma.async = true;
//     ma.src = baseUrl; //('https:' == document.location.protocol ? 'https://analytics' : 'http://analytics') + '.codinglabs.org/ma.js';
//     var s = document.getElementsByTagName('script')[0];
//     s.parentNode.insertBefore(ma, s);
// })();
var initZdq = function (referrecode) {
    _zdq.push(['_setAccount', referrecode || '']);
}
/***********资邦统计 end****************/

/*********************国双统计 begin****************************/
var _gsq = _gsq || [];
// (function() {
//   var s = document.createElement('script');
//   s.type = 'text/javascript';
//   s.async = true;
//   s.src = (location.protocol == 'https:' ? 'https://ssl.' : 'http://static.') + 'gridsumdissector.com/js/Clients/GWD-002985-93DA74/gs.js';
//   var firstScript = document.getElementsByTagName('script')[0];
//   firstScript.parentNode.insertBefore(s, firstScript);
// })();

/**********************国双统计 end*****************************/

/*************** MediaV DSP统计****************/

var _CHANNELCODE = 'W0002020';

var _loadMVScript = function () {
    var mvl = document.createElement('script');
    mvl.type = 'text/javascript';
    mvl.async = true;
    mvl.src = ('https:' == document.location.protocol ? 'https://static-ssl.mediav.com/mvl.js' : 'http://static.mediav.com/mvl.js');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(mvl, s);
};
var _MVregist = function (username, userid) {
    var _mvq = _mvq || [];
    _mvq.push(['$setAccount', 'm-194324-0']);
    _mvq.push(['$setGeneral', 'registered', '', username, userid]);
    _mvq.push(['$logConversion']);
};
var _MVorder = function (username, userid, orderid, productid, amount, productname) {

    var _mvq = _mvq || [];
    _mvq.push(['$setAccount', 'm-194324-0']);

    _mvq.push(['$setGeneral', 'ordercreate', '', /*用户名*/ username, /*用户id*/ userid]);
    _mvq.push(['$logConversion']);
    _mvq.push(['$addOrder', /*订单号*/ orderid, /*订单金额*/ amount]);
    _mvq.push(['$addItem', /*订单号*/ orderid, /*商品id*/ productid, /*商品名称*/ productname, /*商品价格*/ amount, /*商品数量*/ '', /*商品页url*/ '', /*商品页图片url*/ '']);
    _mvq.push(['$logData']);

    //var _mvq = _mvq || [];
    //_mvq.push(['$setAccount', 'm-194324-0']);
    //_mvq.push(['$setGeneral', 'ordercreate', '', /*用户名*/ username, /*用户id*/userID]);
    //_mvq.push(['$logConversion']);
    //_mvq.push(['$addOrder',/*订单号*/ productid, /*订单金额*/ amount]);
    //_mvq.push(['$addItem',/*订单号*/ productid, /*订单金额*/ amount]);
    //_mvq.push(['$logData']);
};
var _MVbindCard = function () {
    var _mvq = window._mvq || [];
    window._mvq = _mvq;
    _mvq.push(['$setAccount', 'm-194324-0']);
    var d = new Date();
    var id = d.getYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
    id += "." + Math.random();
    _mvq.push(['custom', 'jzqu1', /*绑卡成功*/ id, '']);
    _mvq.push(['$logConversion']);

    //var _mvq = _mvq || [];
    //_mvq.push(['$setAccount', 'm-194324-0']);
    //_mvq.push(['custom', 'jzqu1', /*绑卡成功*/ id, '']);
    //_mvq.push(['$logConversion']);
};

/*************** MediaV DSP统计****************/


/************DSP统计 begin****************/

var _dspRegistered = function (_userId) {

};
/************DSP统计 end****************/


/*************品友互动 begin**************

var _py = _py || [];
_py.push(['a', 'jLs..VAkpUtS8zPDjtHbYB4-eQP']);
_py.push(['domain', 'stats.ipinyou.com']);
_py.push(['mapping', false]);
_py.push(['e', '']);
-function (d) {
    var s = d.createElement('script'),
    e = d.getElementsByTagName('script')[0]; e.parentNode.insertBefore(s, e),
    f = 'https:' == location.protocol;
    s.src = (f ? 'https' : 'http') + '://' + (f ? 'fm.ipinyou.com' : 'fm.p0y.cn') + '/j/adv.js';
}(document);
*/

//品友互动注册成功代码  注册:'jLs.3Ts._K4co24Dd5wdOnieN0YbzX'  ,绑卡：'jLs.kTs.pSCR6AHWNsS3O7IUHv2uvP'，投资：'jLs.gTs.cowypTW-6xaicxh3A_b34P'
var _pyRegister = function (_userId, _code, _ext) {
    //var w = window, d = document, e = encodeURIComponent;

    //var b = location.href, c = d.referrer, f, s, g = d.cookie, h = g.match(/(^|;)\s*ipycookie=([^;]*)/), i = g.match(/(^|;)\s*ipysession=([^;]*)/); if (w.parent != w) { f = b; b = c; c = f; }; u = '//stats.ipinyou.com/cvt?a=' + e(_code) + '&c=' + e(h ? h[2] : '') + '&s=' + e(i ? i[2].match(/jump\%3D(\d+)/)[1] : '') + '&u=' + e(b) + '&r=' + e(c) + '&rd=' + (new Date()).getTime() + '&OrderNo=' + e(_userId) + '&ProductList=' + e(_ext) + '&e=';
    //function _() { if (!d.body) { setTimeout(_(), 100); } else { s = d.createElement('script'); s.src = u; d.body.insertBefore(s, d.body.firstChild); } } _();
};
//注册成功
var _pyRegisterSuccess = function (_userId, _userName, _tel) {
    //var _ext = _userId + '||' + _userName + '||' + _tel;
    //_pyRegister(_userId, 'jLs.3Ts._K4co24Dd5wdOnieN0YbzX', _ext);
};
//绑卡成功
var _pyBindCardSuccess = function (_userId, _userName, _tel) {
    //var _ext = _userId + '||' + _userName + '||' + _tel;
    //_pyRegister(_userId, 'jLs.kTs.pSCR6AHWNsS3O7IUHv2uvP', _ext);
};
//投资成功
var _pyInvestmentSuccess = function (_userId, _userName, _tel, _orderId, _money, _productid, _duetime) {
    //var _ext = _userId + '||' + _userName + '||' + _tel + '||' + _orderId + '||' + _money + '||' + _productid + '||' + _duetime;
    //_pyRegister(_userId, 'jLs.gTs.cowypTW-6xaicxh3A_b34P', _ext);
};

/*************品友互动 end***************/

/*******************AjaxPost 可紧张异步************************/
function AjaxPost(url, data, option) {
    var defOpt = {
        type: "POST",
        url: url,
        data: data,
        cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: "json"
    };
    $.extend(defOpt, option);
    return $.ajax(defOpt);
};


//替换模板
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

/** common js */

//function require(p) {
//    var path = require.resolve(p);
//    var mod = require.modules[path];
//    if (!mod) throw new Error('failed to require "' + p + '"');
//    if (!mod.exports) {
//        mod.exports = {};
//        mod.call(mod.exports, mod, mod.exports, require.relative(path));
//    }
//    return mod.exports;
//}

//require.modules = {};

//require.resolve = function (path) {
//    var orig = path;
//    var reg = path + '.js';
//    var index = path + '/index.js';
//    return require.modules[reg] && reg
//      || require.modules[index] && index
//      || orig;
//};

//require.register = function (path, fn) {
//    require.modules[path] = fn;
//};

//require.relative = function (parent) {
//    return function (p) {
//        if ('.' != p.charAt(0)) return require(p);
//        var path = parent.split('/');
//        var segs = p.split('/');
//        path.pop();

//        for (var i = 0; i < segs.length; i++) {
//            var seg = segs[i];
//            if ('..' == seg) path.pop();
//            else if ('.' != seg) path.push(seg);
//        }

//        return require(path.join('/'));
//    };
//};