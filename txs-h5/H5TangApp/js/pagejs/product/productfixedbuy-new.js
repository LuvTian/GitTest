var _BankMaintain = new BankMaintain();
_BankMaintain.getData();
var productid = $.getQueryStringByName("id"); //产品id
var type = $.getQueryStringByName("type") || "wechat";
var surprised_btn_click = $.getQueryStringByName("surprised_btn_click"); //是否是点惊喜单按钮过来的
var pdata = {};
var product = [];
var account = [];
var tid = $.getQueryStringByName("tid");
var product_data = "";
var depositbtntext = "充值";
var withdrawbtntext = "提现";
var accounttext = "账户余额";
var returnUrl = window.location.pathname + window.location.search;
var pageindex = 0;
var tranid = 0;
var couponCount = 0; //代金券数量
var ticketCount = 0; //加息券数量
var search_couponid = $.getQueryStringByName("couponid") || "";//点击某个代金券进入购买页面
var bf_mode = 0;
var invertText = '立即投资';
$(function () {
    if ($("#product-buy-amount").val() != 0) {
        $("#product-buy-amount").val("");
    }
    pageInit();
});

function pageInit() {
    productItem();
    $(".mask").click(function () {
        $(".bonus_ticket").hide()
        $(".mask").hide()
        $(".rule1").hide()
    })
    //优惠券
    $(".hongbao").click(function () {
        $(".bonus_ticket").show();
        $(".mask").show();
    });
    $(".bt_bonus_title").click(function () {
        $(this).addClass('bon_t_on').siblings().removeClass('bon_t_on');
        $('.bt_bonus').show();
        $('.bt_tickets').hide();
    });
    $(".bt-tickets_title").click(function () {
        $(this).addClass('bon_t_on').siblings().removeClass('bon_t_on');
        $('.bt_bonus').hide();
        $('.bt_tickets').show();
    });
    $("#current-coupon-value").val("0");
    $("#current-coupon-id").val("0");
    $("#current-interest-id").val("0");
}

function initProductBuyBtn() {
    $("#zkall").click(function () {
        if ($("#zkall").html() == "展开所有协议") {
            $(".appiontxy").show();
            $("#zkall").html("收起");
        } else {
            $(".appiontxy").hide();
            $("#zkall").html("展开所有协议");
        }

    });
    //全部购买
    $(".allbuy").click(function () {
        var couponAmount = Number($("#current-coupon-value").val());
        $("#product-buy-amount").val(product.remainingamount);
        $("#product-buy").text("实付" + $.fmoney(product.remainingamount - couponAmount) + "元");
        $("#product-buy-div").removeClass("ivbtnnoclick");
    });

    //投资协议
    $("#invitexieyilink").click(function () {
        var _saletype = product.saletype;
        window.location.href = "/html/product/contract/investment-agreement.html?matchmode=" + product.matchmode + "&saletype=" + _saletype;
    });
    //不使用代金券
    $(".nousecoupon").click(function () {
        $(".bonus_ticket").hide();
        $(".mask").hide();
        $(".use-choose").addClass("display-none");
        // $("#iscan").html("未使用优惠券").removeClass("ivred").show();
        if (couponCount + ticketCount > 0) {
            $("#iscan").hide();
            $("#fulinumspan").show();
            $("#fulinum").html(couponCount + ticketCount);
        } else {
            $("#fulinumspan").hide();
            $("#iscan").html("暂无可用").show();
        }

        $("#current-coupon-value").val("0");
        $("#current-coupon-id").val("0");
        $("#current-interest-id").val("0");
        productBtnKeyUp_Click();
    });
    //不使用加息券
    $(".nouseticket").click(function () {
        $(".bonus_ticket").hide();
        $(".mask").hide();
        $(".use-choose").addClass("display-none");
        // $("#iscan").html("未使用优惠券").removeClass("ivred").show();
        if (couponCount + ticketCount > 0) {
            $("#iscan").hide();
            $("#fulinumspan").show();
            $("#fulinum").html(couponCount + ticketCount);
        } else {
            $("#fulinumspan").hide();
            $("#iscan").html("暂无可用").show();
        }
        $("#current-coupon-value").val("0");
        $("#current-coupon-id").val("0");
        $("#current-interest-id").val("0");
        productBtnKeyUp_Click();
    });
    $("#product-buy-amount").keyup(function () {
        productBtnKeyUp_Click();
    });
    $("#product-buy-amount").click(function () {
        if (product.remainingamount < product.amountmin) {
            $("#product-buy-amount").val(product.remainingamount);
            $("#product-buy-div").removeClass("ivbtnnoclick");
        }
        productBtnKeyUp_Click();
    });
    $("#product-buy").unbind().click(function () {
        if ($("#product-buy-div").hasClass("ivbtnnoclick")) {
            return;
        }
        if (!account.passinvestor ||
            !account.riskwarning ||
            account.questionnaire <= 0) {
            return;
        }
        choosePayType();
    });
    $("#cbspan").click(function () {
        if ($("#ck-buy-agreement").prop("checked")) {
            $(".checkbox").removeClass("ivcheckbox");
            $("#ck-buy-agreement").prop("checked", false);
            $("#product-buy-div").addClass("ivbtnnoclick");
        } else {
            $(".checkbox").addClass("ivcheckbox");
            $("#ck-buy-agreement").prop("checked", true);
            $("#product-buy-div").removeClass("ivbtnnoclick");
        }
        productBtnKeyUp_Click();
    });
}

function userInfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (d) {
        if (d.result) {
            account = d.accountinfo;
            if (d.ismaintenance) {
                $(".maintenanct").attr("href", "/html/system/data-processing.html");
            }
            if (d.isglobalmaintenance) {
                $(".global-maintenanct").attr("href", "/html/system/system-maintenance.html");
            }
            if (account.customstatus < 2) {
                $.alertF("您的资料还未完善，现在去完善吧", null, function () {
                    $.CheckAccountCustomStatusRedirect(encodeURIComponent(window.location.href), account);
                });
                return;
            }
            if (account && account.customstatus < 3) {
                $.alertF("您尚未绑卡，请绑定银行卡后进行投资。", null, function () {
                    window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                });
                return;
            }
            if (account.invitedby == _CHANNELCODE) {
                _loadMVScript();
            }
            if (tid) {
                checksuccess(window.localStorage.getItem("tranid" + account.referralcode));
            }
            //是否同意协议
            if (account.issignmoneyboxandhtffund) {
                accounttext = "僧财宝";
                depositbtntext = "转入";
                $("#basic").html("僧财宝");
                $(".withdrawtext").html("转出");
            }
            if (!account.passinvestor ||
                !account.riskwarning ||
                account.questionnaire <= 0) {
                $(".ivxieyi").hide();
                $("#user-investmentcertification").show();
                $("#product-buy").text("立即评测").attr("href", "/html/my/risk-assesslist.html?rturl=" + encodeURI(returnUrl) + "&productrisklevel=" + product.risklevel + "&producttype=fixedbuy&type=wechat");
                $("#product-buy-div").removeClass("ivbtnnoclick");
                return;
            }
            if (account.questionnaire > 0 &&
                product.risklevel > account.questionnaire) {
                $("#user-highrisk").show();
                $("#user-risk-desc").html(account.riskleveldesc);
                $("#product-risk-desc").html(product.riskleveldesc.split('|')[0]);
            }
        } else if (d.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(d.errormsg);
            return;
        }
    });
}


function formatActityRate(actityrate) {
    return actityrate > 0 ? ("+" + $.fmoney(actityrate) + "%") : '';
};

//产品信息
function productItem() {
    var url = "/StoreServices.svc/product/item";
    var data = {
        productid: productid
    };
    $.AkmiiAjaxPost(url, data, false).then(function (d) {
        if (d.result) {
            product_data = d;
            product = d.productinfo;
            var item = d.productinfo;
            bf_mode = item.matchmode;
            if (product.status != 5) {
                $.alertF("产品" + product.statusname, null, back);
            }
            if (product.matchmode == 3 || product.matchmode == 4) {
                $('.allbuy').text('全部出借');
                invertText = '立即出借';
                document.title = '确认出借';
            }
            if (product.isreservation) {
                //可预约
                $("#product-buy").html("立即预约");
                $("#ivprotext").html("预计将于" + item.dealtime + "成交,预计起息日:");
                $("#profitstartday").html(item.profitstartday); //起息日
                // $(".hongbao").hide(); //预约不显示优惠券
                $("#productinappoint").show(); //唐小僧预约规则
                $("#zkall").show(); //预约协议
                $("#isreservationtext").html("我已阅读并同意以下四条协议");
                $("#product-buy-amount").attr("placeholder", "输入预约金额，" + product.amountmin + "起预约，" + product.step + "递增，最多" + $.fmoneytextV2(product.amountmax));
                getCouponList();
            } else {
                //开放购买
                $("#ivprotext").html("预计起息日：");
                $("#profitstartday").html(item.profitstartday); //起息日
                $("#fixedbuyxy").show(); //购买协议
                $("#product-buy").html(invertText);
                $("#product-buy-amount").attr("placeholder", "输入投资金额，" + product.amountmin + "起投，" + product.step + "递增，最多" + $.fmoneytextV2(product.amountmax));
                if (product.matchmode == 3 || product.matchmode == 4) {
                    $("#product-buy-amount").attr("placeholder", product.amountmin + "起借，" + product.step + "递增，最多" + $.fmoneytextV2(product.amountmax));
                }
                getCouponList();
            }
            var amountbuy = 0;
            var couponAmount = Number($("#current-coupon-value").val());
            if (surprised_btn_click) {
                $(".allbuy,#product-buy-amount").addClass("disabled_color");
                $("#product-buy-amount").val(product.remainingamount).attr("disabled", "disabled");
                amountbuy = Number($("#product-buy-amount").val());
                $("#product-buy-div").removeClass("ivbtnnoclick");
                //$(".hongbao").hide();
                $("#product-buy").text("实付" + $.fmoney(product.remainingamount) + "元");
                $("#ivprotext").html("预期回收本息：");
                var aprofit = (((amountbuy * (product.rate / 100)) / 365) * product.duration) + amountbuy;
                $("#profitstartday").html($.fmoney(aprofit, 2) + "元");
                productBtnKeyUp_Click();
            } else {
                if (product.remainingamount < product.amountmin) {
                    $("#product-buy-amount").val(product.remainingamount).attr("disabled", "disabled");
                    amountbuy = Number($("#product-buy-amount").val());
                    $("#product-buy-div").removeClass("ivbtnnoclick");
                    //剩余金额小于起投金额，不隐藏代金券入口
                    //$(".hongbao").hide();
                    $("#product-buy").text("实付" + $.fmoney(product.remainingamount) + "元");
                    $("#ivprotext").html("预期回收本息：");
                    var aprofit = (((amountbuy * (product.rate / 100)) / 365) * product.duration) + amountbuy;
                    $("#profitstartday").html($.fmoney(aprofit, 2) + "元");
                    productBtnKeyUp_Click();
                } else {
                    if (amountbuy >= product.amountmin) {
                        $("#product-buy-div").removeClass("ivbtnnoclick");
                        $("#money").html($.fmoney(amountbuy - couponAmount));
                    }

                }
            }
            if (product.matchmode <= 1) {
                $(".dingxiangweituoxieyilink").attr("href", "/html/product/contract/dingxiangweituoxieyi.html");
            } else {
                $(".dingxiangweituoxieyilink").attr("href", "/html/product/contract/cxdingxiangweituoxieyi.html");
            }
            if (product.matchmode == 3 || product.matchmode == 4) {
                $(".dingxiangweituoxieyilink").attr("href", "/html/product/contract/txsp2pcontractslease.html");
            }
            $("#product-title").html(item.title); //产品名称
            // $("#product-rate").html($.fmoney(item.rate, 2)); //利率
            // $("#product-duration").html(item.duration + "天"); //期限
            // $("#amountmin").html(item.amountmin + "元起投"); //起投金额
            $("#product-remainingamount").html($.fmoney(item.remainingamount)); //剩余可投
            if (item.rateactivite > 0) {
                $("#product-rateactivite").html(formatActityRate(item.rateactivite)).show();
            }

            if (product.type == 99 && !product.newuser) {
                $("#product-buy").hide();
            }
            if (product.type == 99) {
                $(".hongbao").hide();
            }
            //惊喜单
            showtailed(d);
            userInfo();
            initProductBuyBtn();
        }
    });
}

//显示尾标
function showtailed(obj) {
    if (obj.productinfo.istailed && obj.activity.description) {
        $("#surprised").removeClass("display-none").html(obj.activity.description);
    }
}

// 添加宝付支付流程，于是需要对该函数进行修改
// payObj:object，支付对象类型
function validateProductBuy(payObj) {
    if (!$("#ck-buy-agreement").is(":checked")) {
        return;
    };
    if ($.isNull($("#product-buy-amount").val()) && $("#product-buy-div").hasClass("ivbtnnoclick")) {
        return;
    }
    if (account.questionnaire > 0 && product.risklevel > account.questionnaire) {
        $(".x").click(function () {
            $(this).parent().parent().parent().hide();
            $(".mask").hide();
        });
        $(".btnok").click(function () {
            if (type == "ios") {
                PhoneMode.jumpAppWithString({
                    'controller': 'InvestmentViewController'
                });
            } else if (type == "android") {
                window.PhoneMode.callToPage("MainActivity", "licai");
            } else {
                window.location.href = "/Html/Product/productfixedlist.html";
            }
        });
        $(".rule-tip").find(".tran-btn").attr("href", "/Html/my/risk-assesslist.html?istran=2&productrisklevel=" + product.risklevel + "&producttype=fixedbuy&type=wechat");
        switch (account.questionnaire) {
            case 1:
                $(".mask").show();
                $(".rule1").show();
                break;
            case 2:
                $(".mask").show();
                $(".rule2").show();
                break;
            case 3:
                $(".mask").show();
                $(".rule3").show();
                break;
            case 4:
                $(".mask").show();
                $(".rule4").show();
                break;
            case 5:
                $(".mask").show();
                $(".rule5").show();
                break;
        }
    } else {
        var amount = Number($("#product-buy-amount").val());
        var couponAmount = Number($("#current-coupon-value").val());
        var couponId = $("#current-coupon-id").val();
        var interestId = $("#current-interest-id").val();
        var couponDom = $("#coupon_" + couponId);
        var interestDom = $("#coupon_" + interestId);
        var couponMinAmount = Number(couponDom.attr("data-minamount"));
        if (amount <= 0) {
            $.alertF("购买金额不正确");
            return;
        }
        if (amount < product.amountmin && product.remainingamount >= product.amountmin) {
            $.alertF("您输入的购买金额少于" + product.amountmin + "元，请重新输入", "", function () {
                $("#product-buy-amount").val("")
                if (product.isreservation) {
                    //可预约
                    $("#product-buy-div").removeClass("ivbtnnoclick").addClass("ivbtnnoclick");
                    $("#product-buy").html("立即预约");
                } else {
                    //购买
                    $("#product-buy-div").removeClass("ivbtnnoclick").addClass("ivbtnnoclick");
                    $("#product-buy").html(invertText);
                }
            });
            return;
        }
        if (amount > product.remainingamount) {
            $.alertF("您输入的购买金额大于剩余可投金额，请重新输入", "", function () {
                $("#product-buy-amount").val("");
                if (product.isreservation) {
                    //可预约
                    $("#product-buy").html("立即预约");
                } else {
                    //购买
                    $("#product-buy").html(invertText);
                }
            });
            return;
        }
        if (amount > product.amountmax) {
            $.alertF("超出最高金额");
            return;
        }
        if (amount > product.remainingamount) {
            $.alertF("产品剩余金额不足");
            return;
        }
        if (amount % product.step != 0 && product.remainingamount >= product.amountmin) {
            $.alertF(" 购买金额要是" + product.step + "的倍数， 请重新输入", "", function () {
                $("#product-buy-amount").val("")
            });
            return;
        }
        if (couponId > 0 && amount < couponMinAmount) {
            $.alertF("不符合代金券使用条件");
            return;
        }

        // 如果matchmode==4，老的代码不再往下执行
        if (payObj && payObj.matchmode == 4) {
            var _reqdata = {
                productid: productid,
                amount: amount + '',
                couponid: couponId
            };
            payObj.funcCallback && payObj.funcCallback(_reqdata);
            return;
        }
        if (account.iswithholdauthoity != 3) {
            productBuy("", window.location.href, 1);
            return;
        }
        /*
        // 跳转到宝付支付
        if (bf_mode == 4) {
            // BFPassword($.extend({
            //     mobile: '15921790435',
            //     cardno: '尾号1234',
            //     cardname: '招商银行',
            //     prepayno: '29345829035'
            // }, {
            //         productid: 'productid',
            //         amount: '789',
            //         couponid: 'couponId'
            //     }), 6, 60);
            // return;
            // console.log(amount, couponAmount);
            var _reqdata = {
                productid: productid,
                amount: (amount - couponAmount) + '',
                couponid: couponId
            };
            // 先调用预投资接口
            bf_PrePayCheck(_reqdata, function (res) {
                BFPassword($.extend(res, _reqdata), 6, 60);
            })
            // $.AkmiiAjaxPost('/StoreServices.svc/baofu/preinvest', {
            //     productid: productid,
            //     amount: (amount - couponAmount) + '',
            //     couponid: couponId
            // }, true).then(function (res) {
            //     if (res.result) {
            //         var predata = res.preinvestdata;
            //         BFPassword($.extend(predata, {
            //             productid: productid,
            //             amount: (amount - couponAmount) + '',
            //             couponid: couponId
            //         }), 6, 60);
            //     } else {
            //         $.alertF(errormsg);
            //     }
            // });
            return;
        }
        */
        $("#basicdiv").unbind('click');
        $("#basicdiv").click(function () {
            $.UpdateTitle(invertText);
            $("#choicepay").hide();
            $(".producthtml").show();
            $("#bottom").show();
            $(".active").hide();
            $(".basicimg").show();
            $.PaymentHtmlNew(amount - couponAmount, "", function (password) {
                $.closePWD();
                productBuy(password, "", 1);
            }, cancel, "" + accounttext + "", account.basicbalance, displayChoicePay, false, account.reservefreezeamount);
        });
        $("#zzbdiv").unbind('click');
        $("#zzbdiv").click(function () {
            $.UpdateTitle(invertText);
            $("#choicepay").hide();
            $(".producthtml").show();
            $("#bottom").show();
            $(".active").hide();
            $(".demandimg").show();
            $.PaymentHtmlNew(amount - couponAmount, "", function (password) {
                $.closePWD();
                productBuy(password, "", 2);
            }, cancel, "至尊宝", account.demandbalance, displayChoicePay, false, 0);
        });
        $("#bankdiv").unbind('click');
        $("#bankdiv").click(function () {
            $.closePWD();
            $.UpdateTitle(invertText);
            $("#choicepay").hide();
            $(".producthtml").show();
            $("#bottom").show();
            $(".active").hide();
            $(".bankimg").show();
            $.PaymentHtmlNew(amount - couponAmount, "", function (password) {
                $.closePWD();
                productBuy(password, "", 4);
            }, cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, displayChoicePay, true, account.reservefreezeamount);
        });
        if (validateBalance(amount, couponAmount)) {
            showPwdAndPay(amount, couponAmount);
        }
    }
}

function validateBalance(amount, couponAmount) {
    var lastAmount = amount - couponAmount;
    var text = "";
    if (account.issignmoneyboxandhtffund) {
        text = accounttext + "余额";
    } else {
        text = accounttext;
    }
    switch (product.paytype) {
        case 1:
            if (account.basicbalance < lastAmount) {
                if (product.isreservation) {
                    $.confirmNew("您" + text + "不足，无法预约", "null", "", "取消", "去" + depositbtntext, null, function () {
                        window.location.href = "/html/paycenter/user-deposit.html";
                    });
                    return false;
                } else {
                    $.confirmNew("" + text + "不足", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                        window.location.href = "/html/paycenter/user-deposit.html";
                    });
                    return false;
                }
            }
            break;
        case 2:
            if (account.demandbalance < lastAmount) {
                $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance + couponAmount)) + "）", "我知道了", "前往至尊宝", null, function () {
                    window.location.href = "/html/product/productbuy.html";
                });
                return false;
            }
            break;
        case 3:
            if (account.basicbalance < lastAmount && account.demandbalance < lastAmount) {
                if (product.isreservation) {
                    $.confirmNew("您" + text + "不足，无法预约", "null", "", "取消", "去" + depositbtntext, null, function () {
                        window.location.href = "/html/paycenter/user-deposit.html";
                    });
                    return false;
                } else {
                    $.confirmNew("" + accounttext + "和至尊宝余额不足", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                        window.location.href = "/html/paycenter/user-deposit.html";
                    });
                }
                return false;
            }
            break;
        case 4:
            if (account.depositsinglemax < lastAmount) {
                $.alertF("银行卡单笔支付金额不能大于" + account.depositsinglemax + "元");
                return false;
            }
            break;
        case 5:
            if (account.basicbalance < lastAmount && account.depositsinglemax < lastAmount) {
                $.confirmNew("" + accounttext + "不足且超出银行卡单笔支付限额", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                    window.location.href = "/html/paycenter/user-deposit.html";
                });
                return false;
            }
            break;
        case 6:
            if (account.demandbalance < lastAmount && account.depositsinglemax < lastAmount) {
                $.confirmNew("至尊宝余额不足且超出银行卡单笔支付限额", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.demandbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                    window.location.href = "/html/paycenter/user-deposit.html";
                });
                return false;
            }
            break;
        case 7:
            if (account.basicbalance < lastAmount && account.demandbalance < lastAmount && account.depositsinglemax < lastAmount) {
                $.confirmNew("" + accounttext + "和至尊宝余额不足且超出银行卡单笔支付限额", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                    window.location.href = "/html/paycenter/user-deposit.html";
                });
                return false;
            }
            break;
        default:
            return true;
    }
    return true;
};

function showPwdAndPay(amount, couponAmount) {
    displaySupportPayType(amount, couponAmount);
    if ((product.paytype & 1) == 1 &&
        account.basicbalance >= amount - couponAmount) {
        $.PaymentHtmlNew(amount - couponAmount, "", function (password) {
            $.closePWD();
            productBuy(password, "", 1);
        }, cancel, "" + accounttext + "", account.basicbalance, displayChoicePay, false, account.reservefreezeamount);
        $(".basicimg").show();
        return;
    }
    $("#basicdiv").unbind('click');
    if ((product.paytype & 2) == 2 &&
        account.demandbalance >= amount - couponAmount) {
        $.PaymentHtmlNew(amount - couponAmount, "", function (password) {
            $.closePWD();
            productBuy(password, "", 2);
        }, cancel, "至尊宝", account.demandbalance, displayChoicePay, false, 0);
        $(".demandimg").show();
        return;
    }
    $("#zzbdiv").unbind('click');
    if ((product.paytype & 4) == 4 &&
        account.depositsinglemax >= amount - couponAmount) {
        $.PaymentHtmlNew(amount - couponAmount, "", function (password) {
            $.closePWD();
            productBuy(password, "", 4);
        }, cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, displayChoicePay, true, account.reservefreezeamount);
        $(".bankimg").show();
        return;
    }
};

//银行icon
var bankicon = [{
    "BankName": "兴业银行",
    "BankCode": "CIB",
    "BankIcon": "bank-cib.png"
},
{
    "BankName": "光大银行",
    "BankCode": "CEB",
    "BankIcon": "bank-ceb.png"
},
{
    "BankName": "上海银行",
    "BankCode": "BOS",
    "BankIcon": "bank-bos.png"
},
{
    "BankName": "平安银行",
    "BankCode": "SZPAB",
    "BankIcon": "bank-szpab.png"
},
{
    "BankName": "中国银行",
    "BankCode": "BOC",
},
{
    "BankName": "中信银行",
    "BankCode": "CITIC",
    "BankIcon": "bank-citic.png"
},
{
    "BankName": "民生银行",
    "BankCode": "CMBC",
    "BankIcon": "bank-cmbc.png"
},
{
    "BankName": "中国邮政银行",
    "BankCode": "PSBC",
    "BankIcon": "bank-psbc.png"
},
{
    "BankName": "广发银行",
    "BankCode": "GDB",
    "BankIcon": "bank-gdb.png"
},
{
    "BankName": "华夏银行",
    "BankCode": "HXB",
    "BankIcon": "bank-hxb.png"
},
{
    "BankName": "农业银行",
    "BankCode": "ABC",
    "BankIcon": "bank-abc.png"
},
{
    "BankName": "浦发银行",
    "BankCode": "SPDB",
    "BankIcon": "bank-spdb.png"
},
{
    "BankName": "建设银行",
    "BankCode": "CCB",
    "BankIcon": "bank-ccb.png"
},
{
    "BankName": "招商银行",
    "BankCode": "CMB",
    "BankIcon": "bank-cmb.png"
},
{
    "BankName": "工商银行",
    "BankCode": "ICBC",
    "BankIcon": "bank-icbc.png"
},
{
    "BankName": "交通银行",
    "BankCode": "COMM",
    "BankIcon": "bank-comm.png"
}
];

function displaySupportPayType(amount, couponAmount) {
    $(".active").hide();
    if ((product.paytype & 1) == 1) {
        $("#basicbalance").html($.fmoney(account.basicbalance));
        if (account.basicbalance < amount - couponAmount) {
            $(".scb").addClass('second-span');
            $("#basicdiv").unbind('click');
        } else {
            $(".scb").removeClass('second-span');
        }
    } else {
        $("#basicdiv").hide();
    }
    if ((product.paytype & 2) == 2) {
        $("#demandbalance").html($.fmoney(account.demandbalance));
        if (account.demandbalance < amount - couponAmount) {
            $(".zzb").addClass('second-span');
            $("#zzbdiv").unbind('click');
        } else {
            $(".zzb").removeClass('second-span');
        }
    } else {
        $("#zzbdiv").hide();
    }
    if ((product.paytype & 4) == 4) {
        $("#bankname").html(account.bankname);
        // $("#cardcode").html(account.cardcode);
        $("#depositsinglemax").html($.fmoneytextV2(account.depositsinglemax));
        $("#dailymaxlimit").html($.fmoney(account.dailymaxlimit, 0));
        $.each(bankicon, function (i, item) {
            if (item.BankName == account.bankname) {
                $(".pbank").attr("src", $.resurl() + "/css/img2.0/" + item.BankIcon);
            }
        })
        if (account.depositsinglemax < amount - couponAmount) {
            $(".bank").addClass('second-span');
            $("#bankdiv").unbind('click');
        } else {
            $(".bank").removeClass('second-span');
        }
    } else {
        $("#bankdiv").hide();
    }
};



//查询可用代金券
function getCouponList() {
    var url = "/StoreServices.svc/user/getcouponlistbyproductid";
    var data = {
        "saletypes": product.saletype,
        "pageindex": pageindex,
        "productid": productid,
        "status": 1
    };
    $.AkmiiAjaxPost(url, data, true).then(function (d) {
        if (d.result) {
            couponCount = d.usercouponlist.length;
            if (couponCount > 0) {
                $.each(d.usercouponlist, function (index, item) {
                    initCoupon(item);
                });
            }
            getInterestList(1, couponCount);
        }
    });
}

//代金券布局
function initCoupon(coupon) {
    var html = [];
    html.push("<div class=\"row bb clearfix\" id='coupon_" + coupon.couponid + "'  data-minamount=\"" + coupon.minamount + "\" data-option=\"" + coupon.couponid + "\" data-amount=\"" + coupon.amount + "\" data-suiproduct=\"" + coupon.suiproduct + "\">");
    html.push("<div class=\"bt_tips col-97 small-9 fl\">");
    html.push("<span>" + coupon.amount + "元（定期理财" + coupon.minamount + "元起）</span><br /><span>有效期至：" + coupon.enddate + "</span><br />");
    html.push("</div>");
    html.push("<div class=\"small-3 fl\"> ");
    html.push("<img src=\"" + $.resurl() + "/css/img2.0/use-choose.png\" class=\"use-choose az-right display-none\" alt=\"\"> </div> </div>");
    html.push("</div>");
    var result = $(html.join(''));
    $("#couponlist").append(result);
    result.click(function () {
        $(".use-choose").addClass("display-none");
        $(this).find(".use-choose").removeClass("display-none");
        $("#iscan").addClass("ivred").show();
        $("#iscan").html(("满" + $(this).attr("data-minamount") + "减" + $(this).attr("data-amount") + "元"));
        $("#fulinumspan").hide();
        $("#current-coupon-value").val($(this).attr("data-amount"));
        $("#current-coupon-minamount").val($(this).data("minamount"));//适用券的最小金额
        $("#current-coupon-id").val($(this).attr("data-option"));
        $("#current-interest-id").val(0);
        $(".bonus_ticket").hide();
        $(".mask").hide();
        productBtnKeyUp_Click(account);
    });
}

//查询可用加息券
function getInterestList(pageindex, couponCount) {
    var url = "/StoreServices.svc/activity/fixedinterestcouponlistbyproductid";
    var param = {
        "type": 2,
        "saletypes": product.saletype,
        "pageindex": pageindex,
        "productid": product.productid
    };
    $.AkmiiAjaxPost(url, param, true).then(function (d) {
        if (d.result) {
            ticketCount = d.fixedinterestcouponlistbyproductid.length;
            if (ticketCount > 0) {
                $.each(d.fixedinterestcouponlistbyproductid, function (i, item) {
                    initInterest(item, account);
                });
            }
        }
        if (couponCount == 0 && ticketCount == 0) {
            $("#iscan").html("暂无可用");
        } else {
            //判断是否是点击优惠券进入，且选中此券，重新计算实付金额等
            if (search_couponid && $("#coupon_" + search_couponid).length > 0) {
                $("#coupon_" + search_couponid).click();
            }
            else {
                $("#iscan").hide();
                $("#fulinumspan").show();
                $("#fulinum").html(couponCount + ticketCount);
            }
        }
    });
};

//加息券布局
function initInterest(interest) {
    var html = [];
    html.push("<div class=\"row bb clearfix\" id='coupon_" + interest.id + "' data-option=\"" + interest.id + "\" data-suiproduct=\"" + interest.suiproduct + "\" data-rate=\"" + interest.rate + "\" data-expireday=\"" + interest.expireday + "\">");
    html.push("<div class=\"bt_tips col-97 small-9 fl\" >");
    html.push("<span>" + interest.rate + "%（" + interest.expireday + "）</span><br /><span>有效期至：" + interest.expiredate + "</span>");
    html.push("</div>");
    html.push("<div class=\"small-3 fl\"> ");
    html.push("<img src=\"" + $.resurl() + "/css/img2.0/use-choose.png\" class=\"use-choose az-right display-none\" alt=\"\"> </div> </div>");
    html.push("</div>");
    var result = $(html.join(''));
    $("#ticketlist").append(result);
    result.click(function () {
        $(".use-choose").addClass("display-none");
        $(this).find(".use-choose").removeClass("display-none");
        $("#iscan").addClass("ivred").show();
        $("#iscan").html($(this).attr("data-rate") + "%" + $(this).attr("data-expireday"));
        $("#fulinumspan").hide();
        $("#current-interest-id").val($(this).attr("data-option"));
        $("#current-coupon-value").val(0);
        $("#current-coupon-id").val(0);
        $(".bonus_ticket").hide();
        $(".mask").hide();
        productBtnKeyUp_Click(account);
    });
    return result;
};

function productBtnKeyUp_Click() {
    // $("#product-buy-amount").addClass("clickivnumred");
    // $("#product-buy-amount").attr("placeholder", "");
    if (account.passinvestor &&
        account.riskwarning &&
        account.questionnaire > 0 &&
        $("#ck-buy-agreement").prop("checked")) {
        var amount = Number($("#product-buy-amount").val()); //购买金额
        if (amount != 0) {
            $("#ivprotext").html("预期回收本息：");
            var aprofit = (((amount * (product.rate / 100)) / 365) * product.duration) + amount;
            $("#profitstartday").html($.fmoney(aprofit, 2) + "元");
            // if (!product.isreservation) {
            //     $("#ivprotext").html("预计回收本息：");
            //     var aprofit = (((amount * (product.rate / 100)) / 365) * product.duration) + amount;
            //     $("#profitstartday").html($.fmoney(aprofit, 2) + "元");
            // } else {
            //     //可预约
            //     $("#product-buy").html("预约投资");
            //     $("#ivprotext").html("预计将于" + product.dealtime + "成交,预计起息日:");
            //     $("#profitstartday").html(product.profitstartday); //起息日
            // }
        }
        if (amount == 0 || amount > 999999) {
            $("#product-buy-div").removeClass("ivbtnnoclick").addClass("ivbtnnoclick");
            $("#ivprotext").html("预计起息日：");
            $("#profitstartday").html(product.profitstartday); //预计日期日
            if (product.isreservation) {
                //可预约
                $("#product-buy").html("立即预约");
            } else {
                //购买
                $("#product-buy").html(invertText);
            }
            return;
        }

        var couponAmount = Number($("#current-coupon-value").val());
        var couponMinAmount = Number($("#current-coupon-minamount").val());
        if (amount < couponAmount) {
            $("#product-buy-div").removeClass("ivbtnnoclick").addClass("ivbtnnoclick");
        } else {
            $("#product-buy-div").removeClass("ivbtnnoclick");
        }
        if (amount > couponAmount && amount >= couponMinAmount) {
            $("#product-buy").text("实付" + $.fmoney(amount - couponAmount) + "元");
        }
        else {
            $("#product-buy").text("实付" + $.fmoney(amount) + "元");
        }
    }
}

function choosePayType() {
    if (!$.CheckAccountBeforeBuy(account)) {
        return;
    }
    var url = window.location.origin + "/eback.html?r=" + window.location.href;
    // 跳转到宝付支付
    if (bf_mode == 4) {
        validateProductBuy({
            matchmode: bf_mode,
            funcCallback: function (req) {
                // console.log(req);
                // 先调用预投资接口
                bf_PrePayCheck(req, function (res) {
                    BFPassword($.extend(res, req), 6, 60);
                })
            }
        });
        return;
    } else {
        // 0未签订；
        // 1签订银行卡;
        // 2签订账户
        switch (account.iswithholdauthoity) {
            case 0:
                $.SetSinaPayPassword(url, product_data.date, account.referralcode, account.iscashdesknewuser);
                break;
            case 1:
                if (product.isreservation) {
                    $.ZzbWithholdAuthority(url, null, account.referralcode, true);
                } else {
                    if ((product.paytype & 1) == 1) {
                        validateProductBuy();
                    } else {
                        $.ZzbWithholdAuthority(url, null, account.referralcode, true);
                    }
                }
                break;
            case 2:
            case 3:
            default:
                validateProductBuy();
                break;
        }
    }
};

function cancel() {
    $(".basicimg").hide();
    $(".demandimg").hide();
    $(".bankimg").hide();
    $(".zzb .scb .bank").removeClass("second-span");
}

function displayChoicePay() {
    $.UpdateTitle("支付方式");
    $.closePWD();
    $("#choicepay").show();
    $(".producthtml").hide();
    $("#bottom").hide();
    paymarketingtag();
}

function back() {
    window.history.back();
}

function productBuy(pwd, url, payType) {
    //支付loading
    $(".pay-loading").show();
    $(".mask").show();
    if (payType == 4 && !_BankMaintain.checkMaintain()) {
        $(".pay-loading").hide();
        $(".mask").hide();
        return;
    }
    var amount = $("#product-buy-amount").val();
    var couponId = $("#current-coupon-id").val();
    var interestId = $("#current-interest-id").val();
    var couponAmount = Number($("#current-coupon-value").val());
    var param = {};
    if (product.isreservation) {
        //预约（包含定期预约和至尊宝预约）
        param = {
            productid: productid,
            amount: amount,
            paypassword: pwd,
            couponid: couponId,
            interestcouponid: interestId,
            returnurl: url,
            paytype: payType,
            isdemandpreorderfixed: true
        };
    } else {
        param = {
            productid: productid,
            amount: amount,
            paypassword: pwd,
            couponid: couponId,
            interestcouponid: interestId,
            returnurl: url,
            paytype: payType
        };
    }
    var balance = 0;
    var bankName = "";
    var pwdPayType = "";
    if (payType == 2) {
        bankName = pwdPayType = "至尊宝";
        balance = account.demandbalance;
    } else if (payType == 1) {
        bankName = pwdPayType = accounttext;
        balance = account.basicbalance;
    } else if (payType == 4) {
        bankName = "银行卡";
        pwdPayType = account.bankname + "(" + account.cardcode + ")";
        balance = account.depositsinglemax;
    }

    var url = "/StoreServices.svc/product/buy";
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            tranid = data.tranid;
            if (!$.isNull(data.redirecturl)) {
                window.localStorage.setItem("tranid" + data.referralcode, data.tranid);
                document.write(data.redirecturl);
                return;
            } else {
                if (product.isreservation) {
                    checksuccess(data.tranid);
                } else {
                    setTimeout("checksuccess(\"" + (data.tranid) + "\")", data.intervaltime);
                }
            }
            _pyInvestmentSuccess(account.referralcode, account.username, account.mobile, data.tranid, $("#product-buy-amount").val(), $.getQueryStringByName("id"), product.duration);
            if (account.invitedby == _CHANNELCODE) {
                _MVorder(account.username, account.referralcode, data.tranid, product.productid, $("#product-buy-amount").val(), product.title);
            }
            _gsq.push(["T", "GWD-002985", "track", "/targetpage/buy_success"]);
        } else {
            $(".pay-loading").hide();
            $(".mask").hide();
            if (data.errorcode == "20018") {
                $.alertNew(data.errormsg, null, function () {
                    if (account.iswithholdauthoity == 3) {
                        $.PaymentHtmlNew(amount, "", function (password) {
                            $.closePWD();
                            productBuy(password, "", payType);
                        }, cancel, pwdPayType, balance, displayChoicePay, false, account.reservefreezeamount);
                    } else {
                        productBuy("", "", payType);
                    }
                });
            } else if (data.errorcode == "20019") {
                $.confirmF(data.errormsg, null, "去重置", function () {
                    $(".reset").click();
                }, function () {
                    window.location.href = "/html/my/resetpassword.html";
                });
            } else if (data.errorcode == "isnewuser") {
                $.alertF(data.errormsg);
            } else if (data.errorcode == "missing_parameter_accountid") {
                $.confirmF("请先登录", null, null, null, $.Loginlink);
            } else if (data.errormsg == "余额不足") {
                if (payType == 1) {
                    $.confirmNew("" + accounttext + "不足", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                        window.location.href = "/html/paycenter/user-deposit.html";
                    });
                } else if (payType == 2) {
                    $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance + couponAmount)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                        window.location.href = "/html/product/productbuy.html";
                    });
                }
            } else {
                $.alertF(data.errormsg);
            }
        }
    });

}

//检查订单是否购买成功
function checksuccess(tranid) {
    var url = "/StoreServices.svc/product/purchaselog";
    var data = {
        purchaselogid: tranid,
        istailed: product_data.productinfo.istailed
    };
    $.AkmiiAjaxPost(url, data, true).then(function (d) {
        if (d.result) {
            $(".pay-loading").hide();
            $(".mask").hide();
            if (d.status <= 2) {
                window.location.href = encodeURI("/html/paycenter/operation-success-new.html?tailedrewardamount=" + product_data.productinfo.tailedrewardamount + "&istailsucess=" + d.istailsucess + "&istailed=" + product_data.productinfo.istailed + "&status=" + d.status + "&amount=" + d.amount + "&createtime=" + d.createtime + "&profitstartday=" + d.profitstartday + "&repaytime=" + d.repaytime + "&productbidid=" + d.productbidid + "&isreservation=" + d.isreservation + "&dealtime=" + d.dealtime + "&matchmode=" + bf_mode);
            } else {
                $.alertF(d.statusmsg);
            }
        } else {
            $(".pay-loading").hide();
            $(".mask").hide();
            $.alertF("交易失败");
        }
    });
}

//支付方式折扣标签
function paymarketingtag() {
    var url = "/StoreServices.svc/product/paymarketingtag";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var paymarketingtaglist = data.paymarketingtaglist;
            if (paymarketingtaglist != 0) {
                $.each(paymarketingtaglist, function (index, item) {
                    if (item.paytype == 1) {
                        $("#scbpaytag").html(item.marketingtagtext).show(); //僧财宝标签
                    } else if (item.paytype == 2) {
                        $("#bankpaytag").html(item.marketingtagtext).show(); //银行标签
                    } else if (item.paytype == 4) {
                        $("#zzbpaytag").html(item.marketingtagtext).show(); //至尊宝标签
                    }
                });
            }
        }
    });
}

// 调用宝付预支付接口
function bf_PrePayCheck(reqdata, callback, errCallback) {
    // 先调用预投资接口
    // console.log("reqdata:", reqdata);
    $.AkmiiAjaxPost('/StoreServices.svc/baofu/preinvest', {
        productid: reqdata.productid,
        amount: reqdata.amount + '',
        couponid: reqdata.couponid
    }, false).then(function (res) {
        if (res.result) {
            // var predata = res.preinvestdata;
            callback && callback(res.preinvestdata);
        } else {
            errCallback && errCallback();
            $.alertF(res.errormsg);
        }
    });
}

// 添加支付静默绑卡提示框
function BFPassword(predata, sms_length, second) {
    var ha = [];
    ha.push('<div class="bf-pwd-mask"></div>');
    ha.push('<div class="bf-pwd" id="bf-pwd">');
    ha.push('<header>');
    // ha.push('<h1>短信验证</h1>');
    ha.push('<div class="input-desc">');
    ha.push('<p id="bankcard"></p>');
    ha.push('<div class="bf-banklevel"></div>');
    ha.push('<p id="paymobile"></p>');
    // ha.push('<z id="payamount"></z>元</p>');
    ha.push('</div>');
    ha.push('<div class="input-warp">');
    ha.push('<input id="bf-pwd-input" type="tel" name="" maxlength="6" placeholder="请输入短信验证码"><span id="sms-btn" class>重新获取</span>');
    ha.push('</div>');
    ha.push('<p class="sms-tip bf-hide"></p>');
    ha.push('</header>');
    ha.push('<footer>');
    ha.push('<span id="bf-pwd-cancel">取消</span>');
    ha.push('<span class="bl" id="bf-pwd-submit">确定</span>');
    ha.push('</footer>');
    ha.push('</div>');
    $("body").append(ha.join(''));
    clearInterval(window._setinterval);
    window._setinterval = 0;
    var _sms_length = sms_length || 6,
        _second = second || 60,
        _tel = '',
        $sms_btn = $("#sms-btn"),
        $bankcard = $("#bankcard"),
        $paymobile = $("#paymobile"),
        $sms_tip = $(".sms-tip"),
        $p2p_pwd_input = $("#bf-pwd-input"),
        $p2p_pwd_submit = $("#bf-pwd-submit"),
        // sms_click = false,
        can_get_sms = true,
        prepareTradeNo = predata.prepayno; // 预投资订单号
    $bankcard.html(predata.cardname + "({0})".replace("{0}", predata.cardno));
    $paymobile.html("验证码已发送到" + predata.mobile);

    //-------验证码倒计时逻辑----------
    // var _second_temp = _second;
    // 一弹框就让获取验证码按钮不可点击，因为默认是倒计时的
    // sms_click = true;
    sms_func();
    //-------验证码逻辑结束-----------
    // $("#payamount").html($.fmoney(_payamount));
    //获取验证码
    $sms_btn.on("click", function () {
        // sms_click = true;
        if (!can_get_sms) {
            return;
        }
        can_get_sms = false;
        // sms_func(true);
        reloadPrePay(predata);
    });
    // $("#bf-pwd").on("click", "#sms-btn", function () {
    //     sms_click = true;
    //     if (!can_get_sms) {
    //         return;
    //     }
    //     can_get_sms = false;
    //     var _url = window.apiUrl_prefix_p2p + "/p2p/order/verify"; //"/StoreServices.svc/user/info" //
    //     $.AkmiiAjaxPost(_url, {
    //         amount: payamount,
    //         productId: productid
    //     }, true).then(function (d) {
    //         if (d.code == 200 && d.data) {
    //             _tel = d.data.phoneNo;
    //             prepareTradeNo = d.data.prepareTradeNo; //预约单ID/流水号
    //             var _second_temp = _second;
    //             $sms_btn.html(_second_temp + "s").addClass("notactive");
    //             $sms_tip.html("验证码已发送至" + _tel).removeClass("vhide");
    //             ckeckStatus().result ? $p2p_pwd_submit.addClass("active") :
    //                 $p2p_pwd_submit.removeClass(
    //                     "active");
    //             window._setinterval = setInterval(function () {
    //                 if (_second_temp <= 1) {
    //                     clearInterval(window._setinterval);
    //                     can_get_sms = true;
    //                     $sms_btn.html("重新获取").removeClass("notactive");
    //                     return;
    //                 }
    //                 _second_temp--;
    //                 $sms_btn.html(_second_temp + "s");
    //             }, 1000);
    //         } else {
    //             can_get_sms = true;
    //             $.alertF(d.message);
    //         }
    //     });
    // });
    $p2p_pwd_submit.click(function () {
        // console.log(ckeckStatus().result);
        if (($p2p_pwd_input.val() || "").length < _sms_length) {
            $sms_tip.removeClass('bf-hide').html("请输入正确的验证码");
            return;
        }
        $sms_tip.addClass('bf-hide').html("");
        // 如果确定按钮激活了，才能往下走
        if (!$p2p_pwd_submit.hasClass("active")) {
            return;
        }
        // 防止频繁点击发送ajax请求
        if ($p2p_pwd_submit.data('reqing')) {
            return;
        }
        $p2p_pwd_submit.data('reqing', 1);
        // console.log({
        //     prepayno: predata.prepayno,
        //     smscode: $p2p_pwd_input.val(),
        //     productid: predata.productid,
        //     amount: predata.amount,
        //     couponid: predata.couponid
        // });
        $.AkmiiAjaxPost('/StoreServices.svc/baofu/invest', {
            prepayno: predata.prepayno,
            smscode: $p2p_pwd_input.val(),
            productid: predata.productid,
            amount: predata.amount,
            couponid: predata.couponid
        }, true).then(function (res) {
            $p2p_pwd_submit.data('reqing', 0);
            if (res.result) {
                // console.log(res);
                $sms_tip.addClass('bf-hide');
                $(".pay-loading").show();
                // 成功之后做什么事情
                setTimeout("checksuccess(\"" + (res.tranId) + "\")", res.intervaltime);
            } else {
                $sms_tip.removeClass('bf-hide').html(res.errormsg);
            }
        })
    })
    //取消
    $("#bf-pwd-cancel").click(function () {
        clearInterval(window._setinterval);
        $("#bf-pwd,.bf-pwd-mask").remove();
    });
    $("#bf-pwd-input").on("keyup", function () {
        // console.log(90);
        $(this).val($(this).val().replace(/[^0-9.]/g, ''));
        $sms_tip.addClass('bf-hide').html("");
        ckeckStatus().result ? $p2p_pwd_submit.addClass("active") : $p2p_pwd_submit.removeClass("active");
    });
    // $("#bf-pwd").on("click", "#bf-pwd-cancel", function () {
    //     clearInterval(window._setinterval);
    //     $("#bf-pwd,.bf-pwd-mask").remove();
    // });
    // //输入框检查
    // $("#bf-pwd").on("keyup", "#bf-pwd-input", function () {
    //     ckeckStatus().result ? $p2p_pwd_submit.addClass("active") : $p2p_pwd_submit.removeClass("active");
    // });
    // //确定提交
    // $("#bf-pwd").on("click", "#bf-pwd-submit", function () {
    //     var data = ckeckStatus();
    //     if (data.result) {
    //         $("#bf-pwd,.bf-pwd-mask").remove();
    //     }
    //     clearInterval(window._setinterval);
    //     data.result && submit_cb && submit_cb(data.value, data.prepareTradeNo);
    // });
    // 封装重新获取验证码方法
    function reloadPrePay(reqdata) {
        bf_PrePayCheck(reqdata, function (res) {
            sms_func();
        }, function () {
            can_get_sms = true;
        });
    }
    // 封装验证码倒计时方法
    function sms_func() {
        var _second_temp = _second;
        can_get_sms = false;
        $sms_btn.html(_second_temp + "s").addClass("clock");
        ckeckStatus().result ? $p2p_pwd_submit.addClass("active") : $p2p_pwd_submit.removeClass("active");
        window._setinterval = setInterval(function () {
            if (_second_temp <= 1) {
                clearInterval(window._setinterval);
                can_get_sms = true;
                $sms_btn.html("重新获取").removeClass("clock");
                return;
            }
            _second_temp--;
            $sms_btn.html(_second_temp + "s");
        }, 1000);
    }
    // //检查输入状态,并返回输入值
    function ckeckStatus() {
        var _value = $p2p_pwd_input.val();
        var result = false;
        // if (sms_click && _value && _value.length >= _sms_length && prepareTradeNo) {
        if (_value && _value.length >= _sms_length && prepareTradeNo) {
            result = true;
        }
        return {
            value: _value,
            result: result,
            prepareTradeNo: prepareTradeNo
        }
    }
}