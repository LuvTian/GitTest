var _BankMaintain = new BankMaintain();
_BankMaintain.getData();
$(function() {

    $("#product-buy-amount").val("");
    getUserInfo();
    $("#product-buy-amount").keyup(function() {
        if ($(this).val() == "" || isNaN($(this).val()) || parseInt($(this).val()) > 9999999) {
            $product_buy.removeClass("pay_btn_op").addClass("pay_btn_op");
            $("#product-buy").text("立即投资");
            return;
        };
        var ck = document.getElementById("ck-buy-agreement").checked;
        if (ck) {
            realPayment();
        }
    });
});
var accountBalance = 0;
var account = [];
var $product_buy = $("#product-buy");
var $product_buy_amount = $("#product-buy-amount");
var password = "";
var paytemp = 0; //1.账户余额2至尊宝4银行卡
var amount = 0;
var basictemp = false;
var banktemp = false;

var buyDemandSuccessKey = "buyDemandSuccessKey";
var currentDate = "";
var success_returnurl = $.getQueryStringByName("returnurl");
var user_deposit_url = "/html/fanba/user-deposit.html?returnurl=" + encodeURIComponent(success_returnurl); //将当前页面链接地址更换为成功的返回页面，就是定期购买页面
var getUserInfo = function() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            currentDate = data.date;
            account = data.accountinfo;
            if (account.ismaintenance) {
                window.location.replace("/html/system/data-processing.html");
                return;
            }
            if (account.isglobalmaintenance) {
                window.location.replace("/html/system/system-maintenance.html");
                return;
            }
            if (account.customstatus < 3) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplinkFanba);
            }
            if (data.ismaintenance) {
                $(".maintenanct").attr("href", "/html/system/data-processing.html")
            }
            if (data.isglobalmaintenance) {
                $(".global-maintenanct").attr("href", "/html/system/system-maintenance.html");
            }
            $("#user-balance").text($.fmoney(account.basicbalance));
            accountBalance = account.basicbalance;
            if (account.invitedby == _CHANNELCODE) {
                //MediaV-load
                _loadMVScript();
            }

            buyDemandSuccessKey = buyDemandSuccessKey + account.referralcode;
            //跳转投资成功
            var tid = $.getQueryStringByName("tid");
            if (tid) {
                window.location.replace(window.localStorage.getItem(buyDemandSuccessKey));
            }

        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
        getCurrentProduct();
    });
};

var product = [];
var getCurrentProduct = function() {
    var data = {
        productid: $.getQueryStringByName("id"),
        withlinechart: true
    };

    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            product = data.productinfo;
            if (product.status != 5) {
                $.alertF("产品尚未开售", null, back);
            }
            $("#product-remainingamount").text($.fmoney(product.remainingamount));
            $("#product-buy-amount").attr("placeholder", "" + product.amountmin + "元起购");
            $("#paytypeamount").html($.fmoney(account.basicbalance));
            $("#product-profitstartday").text(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).Format("yyyy-MM-dd"));
            $('#product-rate').text($.fmoney(data.proportion.avgpronumber, 2));
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else {
            $.alertF("页面出错了", null, back);
        }
    });
};

//step1:检查新浪设置
var checkiswithholdauthoity = function() {
        if (account.customstatus < 3) {
            $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplinkFanba);
            return;
        }
        //直连模式
        if (account.iswithholdauthoity == 3) {
            productBuy_click();
        } else if (account.iswithholdauthoity == 0) //未设置新浪支付密码
        {
            var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/welcome.html";
            $.SetSinaPayPassword(returnurl, currentDate, account.referralcode, account.iscashdesknewuser);
        } else if (account.iswithholdauthoity == 1) //未设置委托代扣
        {
            if ((product.paytype & 1) == 1) {
                paytemp = 1;
                productBuy_click();
            } //产品只支持银行卡购买不支持余额，点击弹框确定去新浪网站
            else if ((product.paytype & 1) != 1 && (product.paytype & 4) == 4) {
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
                $.WithholdAuthority(returnurl, function() {
                    $.alertF("定期银行卡购买必须先签订委托代扣协议");
                    return;
                }, account.referralcode, true);
            }
        } else {
            //收银台模式
            password = "";
            productBuy_click();
        }
    }
    //step2:检查输入金额
var productBuy_click = function() {

    if ($("#product-buy").hasClass("pay_btn_op")) {
        return;
    }
    if ($product_buy_amount.val() == "" || isNaN($product_buy_amount.val()) || parseInt($product_buy_amount.val()) > 9999999) {
        $product_buy.removeClass("pay_btn_op").addClass("pay_btn_op");
        return;
    };
    if (!$("#ck-buy-agreement").prop("checked")) {
        return;
    }
    amount = Number($("#product-buy-amount").val());
    if (amount == 0 || isNaN(amount)) {
        $.alertF("购买金额不正确")
        return;
    };
    if (amount > product.remainingamount) {
        $.alertF("产品剩余金额不足");
        return;
    }
    if (amount > product.amountmax) {
        $.alertF("单笔最大限额" + product.amountmax);
        return;
    }
    if (amount < product.amountmin || amount % product.step != 0) {
        $.alertF("投资" + product.amountmin + "元起投," + product.step + "元递增");
        return;
    }
    if (account.iswithholdauthoity == 3) {
        /*直连模式*/
        checkdisplaypay();
    } else {
        /*收银台模式*/
        var returnurl = window.location.href;
        productBuy("", returnurl);
    }
}

//step3:直连模式、收银台模式的后续
var productBuy = function(pass, returnurl) {
    /*
        此位置添加银行卡维护通知
        检查购买方式为银行卡（收银台和直连模式）
        未签委托代扣的不能用银行卡购买产品！
        1.账户余额2至尊宝4银行卡
    */
    if (paytemp == 4 && !_BankMaintain.checkMaintain()) {
        return;
    }
    var data = {
        productid: $.getQueryStringByName("id"),
        amount: $("#product-buy-amount").val(),
        paypassword: pass,
        returnurl: returnurl,
        paytype: paytemp
    };
    var url = "/StoreServices.svc/product/buy";
    $.AkmiiAjaxPost(url, data).then(function(data) {
        if (data.result) {
            if (paytemp == 1) {
                var paramurl = "/html/fanba/operation-success.html?type=buy&profittime=" + data.date + "&amount=" + $product_buy_amount.val() + "&product=" + encodeURIComponent('至尊宝') + "&title=" + encodeURIComponent('投资成功') + "&buybank=" + encodeURIComponent("账户余额") + "&iswithholdauthoity=" + account.iswithholdauthoity + "&returnurl=" + success_returnurl;
            } else if (paytemp == 4) {
                var paramurl = "/html/fanba/operation-success.html?type=buy&profittime=" + data.date + "&amount=" + $product_buy_amount.val() + "&product=" + encodeURIComponent('至尊宝') + "&title=" + encodeURIComponent('投资成功') + "&buybank=" + encodeURIComponent("银行卡") + "&returnurl=" + success_returnurl;
            }
            if (!$.isNull(data.redirecturl)) {
                window.localStorage.setItem(buyDemandSuccessKey, paramurl);
                document.write(data.redirecturl);
                return;
            }
            //投资转化代码
            _pyInvestmentSuccess(account.referralcode, account.username, account.mobile, data.tranid, $("#product-buy-amount").val(), $.getQueryStringByName("id"), 0);
            if (account.invitedby == _CHANNELCODE) {
                //MediaV-order
                _MVorder(account.username, account.referralcode, data.tranid, product.productid, $("#product-buy-amount").val(), product.title);
            }

            if (!data.hascoupon) {
                window.location.replace(paramurl);
            } else {
                $.alertNew("恭喜您获得" + (data.interestrate * 100) + "%加息劵一张 <br/> 请在" + data.expiredate + "前使用<br/><br/>请在&nbsp;<b>我的-平台奖励-加息劵</b>&nbsp;查看", null, function() {
                    gotoSuccess(param);
                }, "购买成功", "icon-my-sigh-ok");
            }
        } else if (data.errorcode == "20018") {
            $.alertNew(data.errormsg, null, function() {
                //直连模式
                if (account.iswithholdauthoity == 3) {
                    $.PaymentHtmlNew($("#product-buy-amount").val(), "", function(password) {
                        $.closePWD();
                        productBuy(password);
                    }, cancel, "", account.basicbalance);
                } else {
                    //收银台模式
                    var returnurl = window.location.href;
                    productBuy("", returnurl);
                }
            });
        } else if (data.errorcode == "20019") {
            $.confirmF(data.errormsg, null, "去重置", function() {
                $(".reset").click();
            }, function() {
                window.location.href = "/html/my/resetpassword.html";
            });
        } else if (data.errorcode == "isnewuser") {
            $.alertF(data.errormsg);
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else if (data.errormsg == "余额不足") {
            $.confirmNew("账户余额不足", "null", "（还需为账户充值" + $.fmoney(amount - account.basicbalance) + "）", "我知道了", "前往充值", null, function() {
                window.location.href = user_deposit_url;
            });
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var back = function() {
    history.back();
};
var gotoSuccess = function(param) {
    window.location.replace("/html/fanba/operation-success.html" + param);
};

$("#buy-agreement,#ck-buy-agreement").click(function() {
    var ck = document.getElementById("ck-buy-agreement").checked;
    if (ck) {
        $(".checkbox").removeClass("checkbox1");
        document.getElementById("ck-buy-agreement").checked = false;
        $product_buy.addClass("pay_btn_op").text("立即投资");
    } else {
        $(".checkbox").addClass("checkbox1");
        document.getElementById("ck-buy-agreement").checked = true;
        if ($product_buy_amount.val().length > 0) {
            realPayment();
        }
    }
});

var realPayment = function() {
    $product_buy.removeClass("pay_btn_op");
    var amount = parseInt($product_buy_amount.val());
    if (amount > 0) {
        $product_buy.text("实付" + $.fmoney(amount) + "元");
    } else {
        $product_buy.text("立即投资");
    }
}

//点击立即投资（pay_btn_op存在则不能点击按钮）
$("#product-buy").click(function() {
    if (!$(this).hasClass('pay_btn_op')) {
        checkiswithholdauthoity();
    }
})


//多种支付方式
function paymethod() {
    $.UpdateTitle("支付方式");
    $.closePWD();
    $("#choicepay").show();
    $("#producthtml").hide();
    switch (paytemp) {
        case 1:
            $(".basicimg").show();
            $(".bankimg").hide();
            break;
        case 4:
            $(".bankimg").show();
            $(".basicimg").hide();
            break;
    }
    issupportpaytype();
    checxpaytype();
}
//判断产品支持哪几种支付方式
function issupportpaytype() {
    if ((product.paytype & 1) == 1) //余额购买
    {
        basictemp = true;
    }
    if ((product.paytype & 2) == 2) { //至尊宝
        zzbtemp = true;
    }
    if ((product.paytype & 4) == 4) {
        banktemp = true; //银行卡
    }
}

//支付方式显示判断
function checxpaytype() {
    if (basictemp) {
        $("#basicbalance").html($.fmoney(account.basicbalance)); //账户余额
        if (account.basicbalance < amount) {
            $("#basic").addClass("second-span");
            $("#basic").next().removeClass("select-span").addClass("second-span");
        }
    } else {
        $("#basicdiv").hide();
    }
    if (banktemp) {
        $("#bankname").html(account.bankname); //银行
        $("#cardcode").html(account.cardcode); //尾号
        $("#depositsinglemax").html($.fmoneytext(account.depositsinglemax)); //银行限额
        if (account.depositsinglemax < amount) {
            $("#bank").addClass("second-span");
            $("#bank").next().removeClass("select-span").addClass("second-span");
        }
    } else {
        $("#bankdiv").hide();
    }
}

//step2.1:直连模式，选择默认购买方式，检查金额，弹出密码框
function checkdisplaypay() {
    issupportpaytype();
    if (basictemp) {
        if (account.basicbalance >= amount) {
            $.PaymentHtmlNew(amount, "", function(password) {
                $.closePWD();
                productBuy(password);
            }, cancel, "账户余额", account.basicbalance, paymethod);
            paytemp = 1;
        } else if (banktemp && account.depositsinglemax >= amount) {
            bankpay();
            paytemp = 4;
        } else if (!banktemp && account.basicbalance < amount) {
            if (account.basicbalance < amount) {
                $.confirmNew("账户余额不足", "null", "（还需为账户充值" + $.fmoney(amount - account.basicbalance) + "）", "我知道了", "前往充值", null, function() {
                    window.location.href = user_deposit_url;
                });
                return;
            }
        } else if (account.depositsinglemax < amount && banktemp && account.basicbalance < amount) {
            $.confirmNew("账户余额不足且超出银行卡单笔支付限额", "null", "（还需为账户充值" + $.fmoney(amount - account.basicbalance) + "）", "我知道了", "前往充值", null, function() {
                window.location.href = user_deposit_url;
            });
        }

    } else if (banktemp && account.depositsinglemax >= amount) {
        bankpay();
        paytemp = 4;
    } else if (banktemp && account.depositsinglemax < amount) {
        $.alertF("购买金额超过银行限额");
    }
}

//银行卡弹窗
function bankpay() {
    $.PaymentHtmlNew(amount, "", function(password) {
        $.closePWD();
        productBuy(password);
    }, cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, paymethod, true);
}

function cancel() {
    $(".basicimg").hide();
    $(".demandimg").hide();
    $(".bankimg").hide();
    $("#basic").removeClass("second-span");
    $("#basic").next().removeClass("second-span").addClass("select-span");
    $("#demand").removeClass("second-span");
    $("#demand").next().removeClass("second-span").addClass("select-span");
    $("#bank").removeClass("second-span");
    $("#bank").next().removeClass("second-span").addClass("select-span");
}

//点击支付方式
$("#basicdiv").click(function() {
    if (!$("#basic").hasClass("second-span")) {
        $.UpdateTitle("立即投资");
        //当前img显示,其他隐藏
        $(".basicimg").show();
        $(".demandimg").hide();
        $(".bankimg").hide();
        $("#choicepay").hide();
        $("#producthtml").show();
        paytemp = 1;
        $.PaymentHtmlNew(amount, "", function(password) {
            $.closePWD();
            productBuy(password);
        }, cancel, "", account.basicbalance, paymethod);
    }
});

$("#bankdiv").click(function() {
    if (!$("#bank").hasClass("second-span")) {
        $.UpdateTitle("立即投资");
        //当前img显示,其他隐藏
        $(".bankimg").show();
        $(".basicimg").hide();
        $(".demandimg").hide();
        $("#choicepay").hide();
        $("#producthtml").show();
        paytemp = 4;
        $.PaymentHtmlNew(amount, "", function(password) {
            $.closePWD();
            productBuy(password);
        }, cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, paymethod, true);
    }
});