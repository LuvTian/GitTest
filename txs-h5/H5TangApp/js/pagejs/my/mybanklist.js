var yzm = ""; //输入的验证码
var qjsBindCardUrl = ""; //侨金所绑卡地址
var gjsBindCardUrl = ""; //赣金所绑卡地址
var jysurl = "";
var qjsUnBinding = false; //侨金所正在解绑标志
var gjsUnBinding = false; //赣金所正在解绑标志

var countDownTimeOut;


var mt = $.getCookie("MadisonToken");

/**
 * 获取已绑卡列表
 */
function getMyBankList() {
    var tpl = '<li>\
                <div class="bankInfo">\
                    <img src="{9}/css/img2.0/bank-{0}.png" alt="" class="bankIcon">\
                    <div class="bankName">{1}</div>\
                    <div class="bankCardInfo">尾号{2} {8}</div>\
                </div>\
                <div style="position:relative;">\
                    <ul class="bankLimitInfo">{3}</ul>\
                    <button class="untied" {11} onclick="untiedCard(\'{4}\',\'{5}\',\'{6}\',\'{7}\')">{10}</button>\
                </div>\
            </li>'
    var tpl_unbind = '<li class="noTiedCard {3}" onclick="window.location.href=\'{0}\'">\
                        <i class="addCardIco"></i>\
                        <div class="tips">{1}</div>\
                        <div class="subTips">{2}</div>\
                    </li>'

    var cards = [];
    $.AkmiiAjaxPost(apiUrl_prefix + "/members/account/txs/cards", {}, false).then(function(d) {
        if (d.code == 200) {
            $.each(d.data, function(k, v) {
                if (!!v.signId) {
                    var bankDesc = "";
                    $.each(v.bankDesc, function(k, v) {
                        if (v.indexOf("用于") != -1 && v.indexOf("理财") != -1) {
                            var start = v.indexOf("用于") + 2;
                            var end = v.indexOf("理财");
                            var yellow_txt = v.substring(start, end);
                            v = v.replace(yellow_txt, "<span class='yellow'>" + yellow_txt + "</span>");
                        }
                        bankDesc += "<li>" + (k + 1) + "." + v + "</li>";
                    })
                    var bindid = 0; //赣金所解卡用（其他卡用signid）
                    if (v.accountType == "QJSTZH") {
                        bindId = v.signId; //其他卡用signid
                        if (!!v.unbindFlag) {
                            (v.unbindFlag == "true") ? bindcartext = "换卡": bindcartext = "解绑";
                            (v.unbindFlag == "false") ? bindcardisabled = "disabled": bindcardisabled = "";
                        } else {
                            bindcartext = "解绑";
                            bindcardisabled = "disabled";
                        }

                    } else if (v.accountType == "GJSTZH") {
                        bindId = v.bindId; //赣金所解绑卡用，其他不需要。
                        bindcartext = "解绑";
                        bindcardisabled = "";
                    } else {
                        bindcartext = "解绑";
                        bindcardisabled = "";
                        if (v.accountType == "MSDTZH") {
                            bindId = v.bindId || "";
                        } else {
                            bindId = v.signId || "";
                        }
                    }
                    cards.push(tpl.format(
                        (v.bankCode || "").toLowerCase(), //0
                        v.bankName, //1
                        v.cardNo && v.cardNo.substr(-4), //2
                        bankDesc, //3
                        bindId, //4
                        v.cardId || "", //5
                        v.accountType, //6
                        v.phoneNo, //7
                        v.cardTypeDesc, //8
                        $.resurl(), //9
                        bindcartext, //10
                        bindcardisabled //11
                        // (v.accountType == "QJSTZH" && v.unbindFlag == "true") ? "换卡" : "解绑", //10
                        // (v.accountType == "QJSTZH" && v.unbindFlag == "false") ? "disabled" : "" //11
                    ));
                } else {
                    var url = "",
                        bindCardTypeTxt = "",
                        bindCardTipTxt = "";
                    switch (v.accountType) {
                        case "SINACQGH":
                            url = "/html/my/regist-step3.html";
                            bindCardTypeTxt = "绑定理财账户银行卡";
                            bindCardTipTxt = "仅用于定期、活期类理财产品购买";
                            break;
                        case "MSDTZH":
                            // url = P2P_MSD_URL_prefix + "/zdhtml/p2p_tiedcard.html?token=" + mt;
                            url = "javascript:$.p2p_url(4)";
                            bindCardTypeTxt = "绑定网贷账户银行卡";
                            bindCardTipTxt = "仅用于网贷类理财产品出借";
                            break;
                        case "QJSTZH":
                            url = qjsBindCardUrl;
                            bindCardTypeTxt = "绑定侨金所账户银行卡";
                            bindCardTipTxt = "仅用于侨金所理财产品购买";
                            getQjsBindCardUrl();
                            break;
                        case "GJSTZH":
                            url = gjsBindCardUrl;
                            bindCardTypeTxt = "绑定赣金中心账户银行卡";
                            bindCardTipTxt = "仅用于赣金中心理财产品购买";
                            getGjsBindCardUrl();
                            break;
                    }
                    var start = bindCardTipTxt.indexOf("用于") + 2;
                    var end = bindCardTipTxt.indexOf("理财");
                    var yellow_txt = bindCardTipTxt.substring(start, end);
                    bindCardTipTxt = bindCardTipTxt.replace(yellow_txt, "<span class='yellow'>" + yellow_txt + "</span>");
                    cards.push(tpl_unbind.format(url, bindCardTypeTxt, bindCardTipTxt, v.accountType));
                }
            })
            $("#mybankList").append(cards.join(""));
        } else {
            $.alertF(d.message);
        }
    })
}
/**
 * 解绑卡
 */
function untiedCard(signId, cardId, accountType, phoneNum) {
    if (accountType == "QJSTZH") {
        $.AkmiiAjaxPost(apiUrl_prefix + "/qjs/card/changebindCard", {
            bindId: signId + "",
            accountId: $.getCookie("userid")
        }, true).then(function(d) {
            if (d.code == 200) {
                if (d.data.changeBindCardFlag) {
                    $.confirmF(d.data.message, "取消", "拨打电话", $.noop(), function() {
                        window.location.href = "tel:4006887608"
                    });
                } else {
                    $.alertF(d.data.message);
                }
            } else {
                $.alertF(d.message);
            }
        })
    } else if (accountType == "GJSTZH") {
        getGjsYzm(this, signId, phoneNum);
    } else if (accountType == "MSDTZH") {
        unBindP2P.getYzm(this, signId, phoneNum);
    } else {
        $.PaymentHtmlNew("", "",
            function(pwd) {
                $.closePWD();
                switch (accountType) {
                    case "SINACQGH":
                        $.AkmiiAjaxPost("/StoreServices.svc/user/unbindbank", {
                            cardid: cardId + "",
                            paypwd: pwd
                        }, true).then(function(d) {
                            if (d.result) {
                                if (d.issuccess) {
                                    $.alertF("解绑成功", "确定", function() {
                                        window.location.reload();
                                    })
                                } else {
                                    $.alertF(d.errormsg);
                                }
                            } else {
                                if (d.errorcode == "20019") {
                                    $.alertF(d.errormsg, "确定", function() {
                                        window.location.href = "/html/my/resetpassword.html";
                                    });
                                }
                                $.alertF(d.errormsg);
                            }
                        })
                        break;
                }
            }
        );
    }




    /**
     * 解绑侨金所
     */
    function untiedQjsCard(tpl) {
        $.confirmF(tpl, "取消", "确定", function() {
            clearTimeout(countDownTimeOut);
            qjsUnBinding = false;
        }, function() {
            clearTimeout(countDownTimeOut);
            qjsUnBinding = false;
            $.AkmiiAjaxPost(apiUrl_prefix + "/qjs/card/unbundled", {
                bindId: signId + "",
                accountId: $.getCookie("userid"),
                smsCode: yzm
            }, true).then(function(d) {
                yzm = "";
                if (d.code == 200) {
                    $.alertF("解绑成功", "确定", function() {
                        window.location.reload();
                    })
                } else {
                    $.alertF(d.message);
                }
            });
        })
    }


}


/**
 * 解绑赣金所
 */
function untiedGjsCard(tpl, signId) {
    $.confirmF3(tpl, "取消", "确定", function() {
        clearTimeout(countDownTimeOut);
        gjsUnBinding = false;
    }, function() {
        clearTimeout(countDownTimeOut);
        gjsUnBinding = false;
        $.AkmiiAjaxPost(apiUrl_prefix + "/gjs/card/unbundled", {
            bindId: signId + "",
            accountId: $.getCookie("userid"),
            smsCode: yzm
        }, true).then(function(d) {
            yzm = "";
            if (d.code == 200) {
                $.alertF("解绑成功", "确定", function() {
                    window.location.reload();
                })
            } else {
                $.alertF(d.message);
            }
        });
    })
}


//弹框
// function confirmF(text, ltext, rtext, lcallback, rcallback) {
//     _showMainDiv();
//     var ha = [];
//     ha.push('<p>');
//     ha.push(text);
//     ha.push('</p><div class="row"><div class="small-6 columns az-padding0 az-text-center col-r _left-btn left">');
//     ha.push(ltext ? ltext : '取消');
//     ha.push('</div><div style="border-right:0;" class="small-6 columns az-padding0 az-text-center col-r _right-btn right">')
//     ha.push(rtext ? rtext : '确定');
//     ha.push('</div></div>');
//     var html = $(ha.join(''));

//     html.find('._left-btn').click(function() {
//         _closeWinDiv();
//         if (lcallback && lcallback instanceof Function) {
//             lcallback();
//         }
//     });
//     html.find('._right-btn').click(function() {
//         _closeWinDiv();
//         if (rcallback && rcallback instanceof Function) {
//             rcallback();
//         }
//     });

//     $('.az-showmasker-Text').append(html);
// }

/**
 * 验证码倒计时
 */
function countDown(t, id) {
    if (t > 0) {
        $("#" + id).text(t-- + "s");
        countDownTimeOut = setTimeout(function() {
            countDown(t, id);
        }, 1000);
    } else {
        $("#" + id).prop("disabled", false).text("重新获取");
        qjsUnBinding = false;
    }
}

/**
 * 保存输入的验证码
 */
function saveIptYzm(that) {
    $(".right").addClass("right_red");
    yzm = $(that).val();
}

/**
 * 查询用户跳转地址
 */
function getQjsBindCardUrl() {
    $.AkmiiAjaxPost(apiUrl_prefix + "/qjs/member/destination", {
        sourcePage: "3",
        txsAccountId: $.getCookie("userid")
    }, true).then(function(d) {
        if (d.code == 200) {
            qjsBindCardUrl = d.data.url;
            if ($(".QJSTZH").length) {
                $(".QJSTZH").attr("onclick", "window.location.href='" + qjsBindCardUrl + "'");
            }
        } else {
            $.alertF(d.message);
        }
    })
}

/**
 * 查询赣金所用户跳转地址
 */
function getGjsBindCardUrl() {
    $.AkmiiAjaxPost(apiUrl_prefix + "/jys/member/destination", {
        platForm: "GJSTZ",
        sourcePage: "3"
            // txsAccountId: $.getCookie("userid")
    }, true).then(function(d) {
        if (d.code == 200) {
            gjsBindCardUrl = d.data.url;
            if ($(".GJSTZH").length) {
                $(".GJSTZH").attr("onclick", "window.location.href='" + gjsBindCardUrl + "'");
            }
        } else {
            $.alertF(d.message);
        }
    })
}


/**
 * 获取侨金所验证码
 */
function getQjsYzm(that, signId) {
    $(that).prop("disabled", true);
    $.AkmiiAjaxPost(apiUrl_prefix + "/qjs/card/unbundled/verification", {
        bindId: signId + "",
        accountId: $.getCookie("userid")
    }, true).then(function(d) {
        if (d.code == 200) {
            countDown(60, "getYzm");
        } else {
            $.alertF(d.message);
        }
    })
}

/**
 * 获取赣金所验证码
 */
function getGjsYzm(that, signId, phoneNum) {
    $(that).prop("disabled", true);
    $.AkmiiAjaxPost(apiUrl_prefix + "/gjs/card/unbundled/verification", {
        bindId: signId + "",
        accountId: $.getCookie("userid")
    }, true).then(function(d) {
        if (d.code == 200) {
            var gjs_yzm = '<div id="gjsYzmTip2">验证码已发送至' + phoneNum + '</div><div id="iptYzmContainer"><input type="text" id="gjsYzm" onkeyup="saveIptYzm(this)" maxlength="6" placeholder="请输入短信验证码"/><button id="getGjsyzm" onclick="getGjsYzm(this,' + signId + ',\'' + phoneNum + '\')" disabled="true"></button></div>';
            untiedGjsCard(gjs_yzm, signId);
            countDown(60, "getGjsyzm");
        } else {
            $.alertF(d.message);
        }
    })
}

//解绑p2p卡
var unBindP2P = {
    unBinding: false,
    getYzm: function(that, signId, phoneNum) {
        $(that).prop("disabled", true);
        $.AkmiiAjaxPost(apiUrl_prefix + "/members/otp/m1/s3_send_sms_captcha", {
            otpBusiCode: "05"
        }, true).then(function(d) {
            if (d.code == 200) {
                var tpl_yzm = '<div id="p2pYzmTip2">验证码已发送至' + phoneNum + '</div><div id="iptYzmContainer"><input type="text" id="p2pYzm" onkeyup="saveIptYzm(this)" maxlength="6" placeholder="请输入短信验证码"/><button id="getP2Pyzm" onclick="unBindP2P.getYzm(this,' + signId + ',\'' + phoneNum + '\')" disabled="true"></button></div>';
                unBindP2P.untiedCard(tpl_yzm, signId);
                countDown(60, "getP2Pyzm");
            } else {
                $.alertF(d.message);
            }
        })
    },
    untiedCard: function(tpl, signId) {
        $.confirmF3(tpl, "取消", "确定", function() {
            clearTimeout(countDownTimeOut);
            this.unBinding = false;
        }, function() {
            clearTimeout(countDownTimeOut);
            this.unBinding = false;
            $.AkmiiAjaxPost(apiUrl_prefix + "/members/card/txs/unbind", {
                bindId: signId + "",
                accountId: $.getCookie("userid"),
                smsCode: yzm
            }, true).then(function(d) {
                yzm = "";
                if (d.code == 200) {
                    $.alertF("解绑成功", "确定", function() {
                        window.location.href = window.location.href;
                    })
                } else {
                    $.alertF(d.message);
                }
            });
        })
    }
}

$(function() {
    getMyBankList();
})