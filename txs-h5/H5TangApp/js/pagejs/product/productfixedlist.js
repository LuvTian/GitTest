/**
 * productfixedlist.js 对应了两个html
 * 1./html/product/productfixedlist.html
 * 2./html/product/index.html
 */
var id = $.getCookie("userid") || "123456"; //用户没登陆时就给个默认的id
var userId = $.getCookie("userid");
var MadisonToken = $.getCookie("MadisonToken");
var typename = "";
var customstatus, errmsg = "";
// var apiUrl_prefix = "http://192.168.3.30:8090";
$(function () {
    "use strict";
    //var a = "http://139.196.7.49:8002";
    // var url = "/StoreServices.svc/p2p/product/productfinanclist";

    //侨金所新接口
    var url = "/StoreServices.svc/qjs/productfinanclist";
    var account = {};
    footerBar.highlight(2);
    userinfo();
    top_banner();
    getFinancialProduct();

    if ($.CheckToken()) {
        $(".invite_signed").show();
    } else {
        $(".invite_signed").hide();
    }

    $(".JS_qbtn").click(function () {
        $("body,html").removeClass("no_scroll");
        $(".mask").hide();
        $(".q_fax").removeClass("q_scale");
        $(".q_fax").detach(); //移除弹窗代码
        if (!$.CheckToken()) {
            $.Loginlink();
        } else {
            //(！！！新手导游版本修改为进入侨金所页面登陆， 实名判断)
            if (customstatus == 0) {
                window.location.href = "/html/my/regist-step1.html";
            } else if (customstatus == 1) { //未实名
                window.location.href = "/html/my/regist-step2.html";
            }
            //  else if (customstatus == 2) { //未邦卡
            //     window.location.href = "/html/my/regist-step3.html";
            // }
            else if (customstatus >= 2) {
                $.showQfax("1");
                // var apiUrl_prefix = "http://192.168.90.228:8090";
                // var url = apiUrl_prefix + "/qjs/member/destination";
                // var D = { "txsAccountId": userId, "sourcePage": "1" };
                // $.AkmiiAjaxPost(url, D, true).then(function(data) {
                //     if (data.code == 200) {
                //         var url = data.data.url;
                //         window.location.href = url;
                //     }
                // })
            } else {
                $.alertF(errmsg);
            }
        }
    })


    //头部banner信息
    function top_banner() {
        $.AkmiiAjaxGet(apiUrl_prefix + "/operation/financing_top", true).then(function (data) {
            if (data.code == 200) {
                var datalist = data.data || [];
                var ad_array = [];
                if (datalist.length > 0) {
                    ad_array.push('<div class="ad_div"><div id="scroll">');
                    $.each(datalist, function (index) {
                        var url = datalist[index].linkAddress; //banner跳转地址
                        var title = datalist[index].subTitle; //banner文案
                        var pic = datalist[index].logoPic ? datalist[index].logoPic : ($.resurl() + '/css/img2.0/product2.8/banner_default.png'); //banner图片
                        ad_array.push('<div class="ad_show ad_' + index + '" data-img="' + pic + '" data-url="' + url + '" style="background:url({0});background-size:100% 100%;"><p>'.replace("{0}", pic) + title + '</p></div>')
                    })
                    ad_array.push('</div></div>');
                    var html_ad = $(ad_array.join(""));
                    $(".ad_position").append(html_ad);
                    //console.log($(".ad_show").data("url"));
                    setTimeout(function () {
                        $(".ad_show").on("click", function () {
                            var url = $(this).data("url");
                            // alert(url);
                            ad_url(url);

                        });
                    }, 500);
                    if (datalist.length > 1) {
                        rollRecode();
                    }
                }
            } else {
                $.alertF(data.message)
            }
        })
    }


    //获取用户账户信息
    function userinfo() {
        var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
        $.AkmiiAjaxPost(url, {}, true).then(function (data) {
            if (data.result) {
                account = data.accountinfo;
                customstatus = data.accountinfo.customstatus;
                $.setCookie("refcode", account.referralcode);
                $.setLS("refcode", account.referralcode);
                try {
                    _zdc && _zdc();
                } catch (e) {
                    ;
                }
                // 僧财宝处理逻辑
                // 如果已经签订了僧财宝协议
                if (!account.issignmoneyboxandhtffund) {
                    var uuid = account.referralcode + "";
                    // 如果点击了弹框的x按钮表示不同意
                    if (!$.getscbSigned(uuid)) { // 还没有弹出协议框
                        $.scgSignAlert(uuid, true, function () {
                            window.location.reload();
                        }, function () {
                            window.location.reload();
                        });
                    }
                }
                //签到链接
                // $(".invite_signed_qd").data("href", "/html/my/user-sign.html?referralcode=" + account.referralcode);
                // $(".invite_signed_yq").data("href", "/html/my/qujin.html");
            } else {
                errmsg = data.errormsg;
                //$.alertF(data.errormsg);
            }
        });
    }
    $(".invite_signed_qd img,.invite_signed_qd p,.invite_signed_yq img,.invite_signed_yq p").click(function () {
        window.location.href = $(this).parent("li").data("href");
    });

    function ignoreEmptyString(text) {
        return text ? text : "&nbsp;";
    }
    //获取理财产品
    function getFinancialProduct() {
        $.AkmiiAjaxPost(url, {}, true).then(function (data) {
            if (data.result) {
                $("#mainBody").removeClass('main_bg');
                var product_type = data.productfinanciallist.typelist;
                for (var i = 0; i < product_type.length; i++) {
                    var typedetaillist = product_type[i].typedetaillist;
                    var jys_paddingbottom = ((product_type[i].type == 8 || product_type[i].type == 10) && product_type[i].backgrounddisplaytype && typedetaillist.length <= 0) ? 'jys-pb' : '';
                    if (product_type[i].type == 3) { //变现专区
                        var realization_array = [];
                        realization_array.push('<div class="product_list"><div class="product_list_title" onclick="realization_url(\'' + product_type[i].typename + '\');"><i class="title_icon title_icon4"></i>');
                        realization_array.push('<strong>' + (product_type[i].typename || "") + '</strong><span>' + (product_type[i].tagdesc || "") + '</span><span class="arrow_icon"><i></i></span></div></div>');
                        var html = $(realization_array.join(""));
                        $("#mainBody").append(html);
                    } else {
                        if ((typedetaillist.length > 0 || product_type[i].backgrounddisplaytype) && (product_type[i].type == 1 || product_type[i].type == 2 || product_type[i].type == 4 || product_type[i].type == 5 || product_type[i].type == 8 || product_type[i].type == 7 || product_type[i].type == 9 || product_type[i].type == 10)) { //如果有产品
                            var current_array = [];
                            current_array.push('<div class="product_list ' + jys_paddingbottom + '"><div class="product_list_title ' + (product_type[i].backgrounddisplaytype ? 'clearafter' : '') + ' ">');
                            if (product_type[i].type == 1) { ////新手标
                                current_array.push('<i class="title_icon title_icon1"></i>');
                            } else if (product_type[i].type == 2) { ////定期
                                current_array.push('<i class="title_icon title_icon3"></i>');
                            } else if (product_type[i].type == 4) { //灵活投
                                current_array.push('<i class="title_icon title_icon2"></i>');
                            } else if (product_type[i].type == 5) { //网贷
                                current_array.push('<i class="title_icon title_icon5"></i>');
                            } else if (product_type[i].type == 8) { //侨金所
                                current_array.push('<i class="title_icon title_icon6"></i>');
                            } else if (product_type[i].type == 7) { //预约专区
                                typename = product_type[i].typename;
                                current_array.push('<i class="title_icon title_icon7"></i>');
                            } else if (product_type[i].type == 9) { //网贷二期
                                current_array.push('<i class="title_icon title_icon5"></i>');
                            } else if (product_type[i].type == 10) { //赣金所1.0
                                current_array.push('<i class="title_icon title_icon10"></i>');
                            }
                            current_array.push('<p class="title_pro">' + (product_type[i].typename || "") + '</p><span>' + (product_type[i].tagdesc || ""));
                            if (product_type[i].isshownewicon) {
                                current_array.push('<i class="remind_icon">new</i>');
                            }
                            current_array.push('</span></div>');
                            //banner形式的推荐产品
                            //侨金所
                            if (product_type[i].type == 8 && product_type[i].backgrounddisplaytype) {
                                current_array.push('<div onclick="jumpQJSFax()" class="jys-bg gjs-bg"><header>' + ignoreEmptyString(product_type[i].marketingsafedesc) + '</header><article>' + ignoreEmptyString(product_type[i].marketinginvestdesc) + '<span>' + ignoreEmptyString(product_type[i].viewproductdesc) + '</span></article></div>');
                            }
                            //赣金所
                            if (product_type[i].type == 10 && product_type[i].backgrounddisplaytype) {
                                current_array.push('<div onclick="jumpGJSFax(1,null)" class="jys-bg"><header>' + ignoreEmptyString(product_type[i].marketingsafedesc) + '</header><article>' + ignoreEmptyString(product_type[i].marketinginvestdesc) + '<span>' + ignoreEmptyString(product_type[i].viewproductdesc) + '</span></article></div>');
                            }
                            current_array.push('<ul class="regular_list2">');
                            for (var j = 0; j < typedetaillist.length; j++) {
                                var productname = typedetaillist[j].productname || "";
                                var rate = typedetaillist[j].rate;
                                var rate_array = rate ? rate.split(',') : ['0.00'];
                                var ratedesc = substrNum(typedetaillist[j].ratedesc || "", 8); //收益率描述
                                var duration = typedetaillist[j].duration; //产品需要投资多久
                                var duration_array = duration ? duration.split(',') : [""];
                                if (product_type[i].type == 1) { ////新手标
                                    current_array.push('<li onclick="list_url(\'' + typedetaillist[j].productid + '\',' + typedetaillist[j].matchmode + ')">');
                                } else if (product_type[i].type == 2) { ////定期
                                    current_array.push('<li onclick="list_url(\'' + typedetaillist[j].productid + '\',' + typedetaillist[j].matchmode + ')">');
                                } else if (product_type[i].type == 4) { //灵活投
                                    current_array.push('<li onclick="invest_url(' + typedetaillist[j].saletype + ',\'' + typedetaillist[j].productid + '\',\'' + (typedetaillist[j].productname) + '\')">');
                                } else if (product_type[i].type == 5) { //网贷
                                    current_array.push('<li onclick="net_list_url(\'' + typedetaillist[j].productid + '\')">');
                                } else if (product_type[i].type == 8) { //侨金所
                                    current_array.push('<li onclick="qfax_list_url(\'' + typedetaillist[j].productid + '\',' + 1 + ')">');
                                } else if (product_type[i].type == 7) { //预约专区
                                    current_array.push('<li onclick="appointment_url()">');
                                } else if (product_type[i].type == 9) { //网贷二期
                                    current_array.push('<li onclick="jumpP2PFax(\'1\',\'' + typedetaillist[j].productid + '\')">');
                                } else if (product_type[i].type == 10) { //赣金所1.0
                                    current_array.push('<li onclick="jumpGJSFax(1,\'' + typedetaillist[j].productid + '\')">');
                                }
                                if (productname) {
                                    current_array.push('<div class="product_name"><span>' + productname + '</span>');
                                    current_array.push('</div>');
                                }

                                var tagItems = typedetaillist[j].taglist;
                                if (tagItems != "" && tagItems != null) {
                                    current_array.push('<div class="product_label">');
                                    for (var k = 0; k < tagItems.length; k++) {
                                        if ((tagItems[k].tagcolor != "" || tagItems[k].tagcolor != null) && (tagItems[k].title != "" || tagItems[k].title != null) && tagItems[k].type=="1") {
                                            current_array.push('<i class="label_desc" style="color:{0};border-color:{1}">'.replace("{0}", tagItems[k].tagcolor).replace("{1}", tagItems[k].tagcolor) + tagItems[k].title + '</i>');
                                        }else if((tagItems[k].tagcolor != "" || tagItems[k].tagcolor != null) && (tagItems[k].title != "" || tagItems[k].title != null) && tagItems[k].type=="2"){
                                            current_array.push('<i class="label_desc" style="color:#fff;background-color:{3}">'.replace("{3}", tagItems[k].tagcolor) + tagItems[k].title + '</i>');
                                        }
                                    }
                                    //current_array.push('<i class="hot_product">' + typedetaillist[j].tagdesc + '</i>');
                                    current_array.push('</div>');
                                }
                                current_array.push('<div class="list_info "><div class="JS_profit_win" data-desc="' + (product_type[i].popupdesc || "") + '">');
                                if (rate_array.length > 1) { //判断收益率是区间段还是一个值
                                    current_array.push('<span class="product_price">' + rate_array[0] + '</span><span class="price_unit">%</span><span class="tilde">~</span><span class="product_price">' + rate_array[1] + '</span><span class="price_unit">%</span><p class="product_rate">' + (typedetaillist[j].ratedesc || '') + '</p></div>');
                                } else {
                                    current_array.push('<span class="product_price">' + rate_array[0] + '</span><span class="price_unit">%' + (typedetaillist[j].ratesuffix || "") + '</span>');
                                    if (typedetaillist[j].rateactivity) { //是否有加息券
                                        current_array.push('<span class="rateactivity">' + (typedetaillist[j].rateactivity || '') + '%</span>');
                                    }
                                    current_array.push('<p class="product_rate">' + (typedetaillist[j].ratedesc || '') + '</p></div>');
                                }
                                var minamount = (typedetaillist[j].minamount || '').split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
                                if (duration_array.length > 1) {
                                    current_array.push('<div><div class="invest_pro"><p class="product_date"><b>' + duration_array[0] + '~' + duration_array[1] + '</b> ' + (typedetaillist[j].durationsuffix || '') + '</p><p class="min_money"><b>' + (minamount || '') + '</b>' + (typedetaillist[j].minamountsuffix || '') + '</p></div></div></div></li>');
                                } else {
                                    current_array.push('<div><div class="invest_pro"><p class="product_date"><b>' + duration_array[0] + '</b> ' + (typedetaillist[j].durationsuffix || '') + '</p><p class="min_money"><b>' + (minamount || '') + '</b>' + (typedetaillist[j].minamountsuffix || '') + '</p></div></div></div></li>');
                                }

                            }
                            if (product_type[i].type == 2) { ////定期
                                current_array.push('<li class="look_more"><a href="/html/product/productfixedlist_new.html" class="arrow_icon">查看更多</a></li></ul></div>');
                            } else if (product_type[i].type == 8 && !product_type[i].backgrounddisplaytype) { //金融交易中心(侨金所)
                                current_array.push('<li class="look_more" onclick="$.showQfax(' + 1 + ')"><a href="javascript:void(0)" class="arrow_icon">查看更多</a></li></ul></div>');
                            } else if (product_type[i].type == 9) { //网贷
                                current_array.push('<li class="look_more"><a onclick="$.p2p_url(\'1\');" class="arrow_icon">查看更多</a></li></ul></div>');
                            } else {
                                current_array.push('</ul></div>');
                            }

                            var currenthtml = $(current_array.join(""));
                            $("#mainBody").append(currenthtml);
                        }
                    }
                }
                $("#mainBody").append('<p class="bottom_remind">网贷有风险 出借需谨慎</p>')
                var wel_btm_array = [];
                //wel_btm_array.push('<div class="wel_btm_com"><span class="wel_btm_comspan" onclick="window.location.href=\' / html / picc.html \'">账户资金防盗安全由新浪支付和太平财险共同保障</span><p>网贷有风险 出借需谨慎</p></div>');
                var wel_btmhtml = $(wel_btm_array.join(""));
                $("#mainBody").append(wel_btmhtml);
                $("#mainBody").append('<div class="bottom"><img src="' + $.resurl() + '/css/img2.0/product2.8/bottom_pic.png" class="bottom_pic"/></div>');



            }
        });
    }
    //字数过长截取
    function substrNum(content, len) {
        if (content.length > len) {
            return content.substr(0, len) + "...";
        } else {
            return content;
        }

    }

    //点击收益率弹框
    $.profit_win("JS_profit_win", "JS_win_parent");
    // var _setInterval = 0,
    //     desc = "",
    //     count = 0;
    // $("#mainBody").on('touchstart', ".JS_profit_win", function(e) {
    //     e.preventDefault();
    //     _setInterval = setInterval(time, 1000)
    //     desc = $(this).attr("data-desc");
    // })
    // $("#mainBody").on('touchend', ".JS_profit_win", function(e) {
    //     clearInterval(_setInterval);
    // })

    // function time() {
    //     count++;
    //     if (count >= 3) {
    //         count = 0;
    //         clearInterval(_setInterval);
    //         $("body").addClass("no_scroll");
    //         //alert("111111");
    //         $(".mask").show();
    //         $(".profit_win_content").text(desc);
    //         $(".profit_win").addClass("profit_win_scale");
    //     }
    // }
    // $(".JS_profit_btn").click(function() {
    //     $(".mask").hide();
    //     $(".profit_win_content").text("");
    //     $(".profit_win").removeClass("profit_win_scale");
    //     $("body").removeClass("no_scroll");
    // })

});
//定期产品列表链接
// metchmode：新老产品判断
function list_url(productid, metchmode) {
    var type = $.getQueryStringByName("type");
    // 如果是p2p产品，在app里直接跳转到h5产品详情页
    if (metchmode == 3) {
        window.location.href = "/html/product/productfixeddetail.html?id=" + productid;
    } else {
        if (type == "ios") {
            //alert("ios");
            //JS 调用本地分享方法
            PhoneMode.callToPage("/main/regulardetail", JSON.stringify({
                productid: productid
            }));
        } else if (type == "android") {
            //alert("android");
            //JS 调用本地分享方法
            window.PhoneMode.callToPage("/main/regulardetail", JSON.stringify({
                productid: productid
            }));
        } else {
            window.location.href = "/html/product/productfixeddetail.html?id=" + productid;
        }
    }
};
//灵活投资产品列表链接
function invest_url(SaleType, productid, productname) {
    //var type = $.getQueryStringByName("type");
    //var jumpurl = "/html/product/incremental-productdetail.html?id=" + productid + "&productname=" + productname;
    if (SaleType == "666666") { //至尊宝
        window.location.href = "/html/product/index-demand.html";
    }
    // if (SaleType == "98" || SaleType == "97" || SaleType == "96") {
    // 	if (type == "ios") {
    // 		//JS 调用本地分享方法
    // 		PhoneMode.callToPage("/main/regulardetail", JSON.stringify({ productid: productid }));
    // 	} else if (type == "android") {
    // 		//JS 调用本地分享方法
    // 		window.PhoneMode.callToPage("/main/lht", JSON.stringify({
    // 			type: SaleType,
    // 			product_id: productid
    // 		}));//"{"type":98,"product_id":"12314"}");
    // 	} else {
    // 		window.location.href = jumpurl;
    // 	}
    // }
    else if (SaleType == "98") { //周周僧
        window.location.href = "/html/product/incremental-productdetail.html?id=" + productid + "&productname=" + productname;
    } else if (SaleType == "97") { //月月僧
        window.location.href = "/html/product/incremental-productdetail.html?id=" + productid + "&productname=" + productname;
    } else if (SaleType == "96") { //季季僧
        window.location.href = "/html/product/incremental-productdetail.html?id=" + productid + "&productname=" + productname;
    }
}
//变现专区链接
function realization_url(productname) {
    window.location.href = "/html/product/producttransferlist.html?typename=" + productname;
}
//网贷详情页
function net_list_url(destinationPage, productid) {
    // $.p2p_url(destinationPage,productid);
    var tourl = encodeURIComponent("/zdhtml/p2p_product_detail.html?id=" + productid);
    window.location.href = P2P_MSD_URL_prefix + "/zdhtml/p2p_transfer_page.html?tourl=" + tourl + "&token=" + MadisonToken;
}
//跳网贷对应的页面
// function p2p_url(destinationPage,productid){//destinationPage入口页面，productid产品id
//     $.p2p_url(destinationPage,productid);
// }
//侨金所
function qfax_list_url(productid, type) {
    showPfax(id, productid, type);
}
//显示侨金所弹窗
function showWin() {
    $(".mask").show();
    $(".q_fax").addClass("q_scale");
    $(".q_content").load("/html/product/contract/qfax_introduce.html");
    $("body,html").addClass("no_scroll");
}
//侨金所背景banner，跳转侨金锁列表
function jumpQJSFax() {
    if ($.getLS("pfaxstatus")) {
        $.showQfax("1");
    } else {
        showWin(); //侨金所弹窗
        $.setLS("pfaxstatus", id);
    }
}
//判断侨金所弹窗是否需要出现
function showPfax(id, productid, type) {
    if ($.getLS("pfaxstatus")) {
        $.showQfax(type, '{"productCode":"' + productid + '"}');
    } else {
        showWin(); //侨金所弹窗
        $.setLS("pfaxstatus", id);
    }
}

//跳转p2p之前的判断
function jumpP2PFax(sourcePage, productId) {
    var sourceParamValue = productId ? '{"productCode":"' + productId + '"}' : '';
    $.p2p_url(sourcePage, sourceParamValue);
}


//跳转赣金所之前的判断
function jumpGJSFax(sourcePage, productId) {
    var sourceParamValue = productId ? '{"productCode":"' + productId + '"}' : '';
    var platForm = 'GJSTZ';
    confirmGJS._jumpGJSFax = function () {
        $.jumpGJSFax(platForm, sourcePage, sourceParamValue, confirmGJS);
    }
    $.jumpGJSFax(platForm, sourcePage, sourceParamValue, confirmGJS);
}

//显示赣金所弹窗
function confirmGJS() {
    $(".mask").show();
    $(".q_fax").addClass("q_scale");
    $(".q_content").load("/html/product/contract/gfax_introduce.html?v=v1");
    $("body,html").addClass("no_scroll");
    //覆盖弹框的确定按钮
    $(".JS_qbtn").unbind("click").click(function () {
        $("body,html").removeClass("no_scroll");
        $(".mask").hide();
        $(".q_fax").removeClass("q_scale");
        $(".q_fax").detach(); //移除弹窗代码
        confirmGJS._jumpGJSFax();
    })
}

//预约专区
function appointment_url() {
    window.location.href = "/html/product/product-appointment.html?typename=" + typename;
}
//广告链接跳转页
function ad_url(url) {
    window.location.href = url;
}

function rollRecode() {
    var box = document.getElementById("scroll"),
        can = true;
    box.innerHTML += box.innerHTML;
    box.onmouseover = function () {
        can = false
    };
    box.onmouseout = function () {
        can = true
    };
    var h = $("#scroll > div").height();

    function roll() {
        var stop = box.scrollTop % h == 0 && !can;
        if (!stop) box.scrollTop == parseInt(box.scrollHeight / 2) ? box.scrollTop = 0 : box.scrollTop++;
        setTimeout(roll, box.scrollTop % h ? 5 : 5000);
    };
    roll();
}