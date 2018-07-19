$(function() {
    "use strict";
    var Product = {};
    var User = {};
    var fanbaCookie = $.getCookie("fanbaModel");
    var fanbaModel = {};
    var user_deposit_url = "";
    var productbuy_url = "";
    var reset_password_url = "";
    var success_returnurl = "";
    var orderid="";
    var sign="";
    var requesttime =""; //时间戳
    var fixedamount = 0;
    if (fanbaCookie) {
        fanbaModel = JSON.parse(fanbaCookie);
        user_deposit_url = "/html/fanba/user-deposit.html?returnurl=" + encodeURIComponent(location.href);
        productbuy_url = "/html/fanba/productbuy.html?returnurl=" + encodeURIComponent(location.href);
        reset_password_url = "/html/my/resetpassword.html?returnurl=" + encodeURIComponent(location.href);
        if (fanbaModel && fanbaModel.returnurl && fanbaModel.fixedamount) {
            success_returnurl = fanbaModel.returnurl;
            fixedamount = fanbaModel.fixedamount;
            orderid=fanbaModel.orderid;
            sign=fanbaModel.sign;
            requesttime =fanbaModel.requesttime;
            $("#product-buy-amount").val(fixedamount).attr("readonly", "readonly");
        }
    }
    (function(Product) {
        function getProductItem(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/item";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductItem = getProductItem;

        function productBuy(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/buy";
            $.AkmiiAjaxPost(url, request, needLoder).then(success);
        }
        Product.productBuy = productBuy;

        function getCouponList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/couponlist";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getCouponList = getCouponList;
    })(Product);
    User.getUserInfo = function(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/user/info";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    var ProductFixedBuy = (function() {
        function ProductFixedBuy() {
            var self = this;
            this.productId = $.getQueryStringByName("id");
            this.type = $.getQueryStringByName("type");
            this.tid = $.getQueryStringByName("tid");
            this.returnUrl = window.location.pathname + window.location.search;
            if(!orderid){
                $.alertF("缺少订单号","",function(){
                    history.back();
                });
                return;
            }
            self.initPage();
            self.getUserInfo();
        }
        ProductFixedBuy.prototype.initPage = function() {
            $(".mask").click(function() {
                $(".bonus_ticket").hide()
                $(".mask").hide()
            })
            $(".hongbao").click(function() {
                $(".bonus_ticket").show();
                $(".mask").show();
            });
            $(".bt_bonus_title").click(function() {
                $(this).addClass('bon_t_on').siblings().removeClass('bon_t_on');
                $('.bt_bonus').show();
                $('.bt_tickets').hide();
            });
            $(".bt-tickets_title").click(function() {
                $(this).addClass('bon_t_on').siblings().removeClass('bon_t_on');
                $('.bt_bonus').hide();
                $('.bt_tickets').show();
            });
            $("#current-coupon-text").html("未使用优惠券");
            $("#current-coupon-value").val("0");
            $("#current-coupon-id").val("0");
            $("#current-interest-id").val("0");
        };
        ProductFixedBuy.prototype.getUserInfo = function() {
            var topDom = this;
            User.getUserInfo({}, function(data) {
                if (data.errorcode == 'missing_parameter_accountid') {
                    //返吧过来的一般都是登录的，不用考虑
                    $.alertNew("请先登录", "", function() {
                        window.history.back();
                    });
                    //$.Loginlink();
                    return;
                } else if (!data.result) {
                    $.alertF(data.errormsg);
                    return;
                }
                var account = data.accountinfo;
                if (data.ismaintenance) {
                    $(".maintenanct").attr("href", "/html/system/data-processing.html");
                }
                if (data.isglobalmaintenance) {
                    $(".global-maintenanct").attr("href", "/html/system/system-maintenance.html");
                }
                if (account.customstatus < 3) {
                    $.alertF("您的资料还未完善，现在去完善吧", null, function() {
                        $.RegistSteplinkFanba();
                    });
                    return;
                }
                if (account.invitedby == _CHANNELCODE) {
                    _loadMVScript();
                }
                if (topDom.tid) {
                    window.location.replace(window.localStorage.getItem("buyFixedSuccessKey" + account.referralcode));
                }
                topDom.getCurrentProduct(account);
            });
        };
        ProductFixedBuy.prototype.getCurrentProduct = function(account) {
            var topDom = this;

            Product.getProductItem({
                productid: this.productId
            }, function(data) {
                topDom.currentDate = data.date;
                if (!data.result) {
                    $.alertF("参数不正确", null, topDom.back);
                    return;
                }
                $("#invitexieyilink").click(function() {
                    window.location.href = "/Html/Product/contract/investment-agreement.html?matchmode=" + data.productinfo.matchmode + "";
                });
                topDom.initProductPage(data.productinfo, account);
                topDom.initProductBuyBtn(account, data.productinfo);
                topDom.productBtnKeyUp_Click(account, data.productinfo);

            });
        };
        ProductFixedBuy.prototype.initProductBuyBtn = function(account, product) {
            var topDom = this;
            if (!account.passinvestor ||
                !account.riskwarning ||
                account.questionnaire <= 0) {
                $(".xieyi").hide();
                $("#user-investmentcertification").show();
                $("#product-buy").text("立即评测").removeClass("pay_btn_op").attr("href", "/Html/fanba/risk-assesslist.html?rturl=" + encodeURI(this.returnUrl) + "&productrisklevel=" + product.risklevel + "&producttype=fixedbuy&type=wechat&channeltype=" + fanbaModel.channeltype);
                return;
            }
            $("#buy-agreement,#ck-buy-agreement").click(function() {
                if ($("#ck-buy-agreement").prop("checked")) {
                    $(".checkbox").removeClass("checkbox1");
                    $("#ck-buy-agreement").prop("checked", false);
                    $("#product-buy").addClass("pay_btn_op");
                } else {
                    $(".checkbox").addClass("checkbox1");
                    $("#ck-buy-agreement").prop("checked", true);
                    $("#product-buy").removeClass("pay_btn_op");
                }
                topDom.productBtnKeyUp_Click(account, product);
            });
            $(".nousecoupon").click(function() {
                $(".bonus_ticket").hide();
                $(".mask").hide();
                $(".use-choose").addClass("display-none");
                $("#current-coupon-text").html("未使用优惠券");
                $("#current-coupon-value").val("0");
                $("#current-coupon-id").val("0");
                $("#current-interest-id").val("0");
                topDom.productBtnKeyUp_Click(account, product);
            });
            $(".nouseticket").click(function() {
                $(".bonus_ticket").hide();
                $(".mask").hide();
                $(".use-choose").addClass("display-none");
                $("#current-coupon-text").html("未使用优惠券");
                $("#current-coupon-value").val("0");
                $("#current-coupon-id").val("0");
                $("#current-interest-id").val("0");
                topDom.productBtnKeyUp_Click(account, product);
            });
            $("#product-buy-amount").keyup(function() {
                topDom.productBtnKeyUp_Click(account, product);
            });
            $("#product-buy-amount").click(function() {
                if (product.remainingamount < product.amountmin) {
                    $("#product-buy-amount").val(product.remainingamount);
                }
                topDom.productBtnKeyUp_Click(account, product);
            });
            $("#product-buy").unbind().click(function() {
                topDom.choosePayType(product, account);
            });
        };
        ProductFixedBuy.prototype.productBtnKeyUp_Click = function(account, product) {

            if (account.passinvestor &&
                account.riskwarning &&
                account.questionnaire > 0 &&
                $("#ck-buy-agreement").prop("checked")) {
                var amount = Number($("#product-buy-amount").val());
                if (amount == 0 || amount > 999999) {
                    $("#product-buy").text("立即投资").removeClass("pay_btn_op").addClass("pay_btn_op");
                    return;
                }
                var couponAmount = Number($("#current-coupon-value").val());
                if (amount <= couponAmount) {
                    $("#product-buy").removeClass("pay_btn_op").addClass("pay_btn_op");
                } else {
                    $("#product-buy").removeClass("pay_btn_op");
                }
                if ((amount - couponAmount) > 0) {
                    $("#product-buy").text("实付" + $.fmoney(amount - couponAmount) + "元");
                } else {
                    $("#product-buy").text("立即投资");
                }

            }
        };
        ProductFixedBuy.prototype.initProductPage = function(product, account) {
            var topDom = this;
            $("#product-title").prepend(product.title).click(function() {
                window.location.href = "/html/fanba/productfixeddetail.html?id=" + product.productid;
            });
            if (product.status != 5) {
                $.alertF("产品尚未开售", null, topDom.back);
            }
            if (product.remainingamount <= 50000) {
                $("#product-remaining-div").show();
                // $("#product-remaining-buyall").click(function() {
                //     $("#product-buy-amount").val(product.remainingamount);
                //     topDom.initProductBuyBtn(account, product);
                //     $("#product-buy").removeClass("pay_btn_op");
                // });
            }
            $("#product-remainingamount").text($.fmoney(product.remainingamount));
            $('#product-rate').text($.fmoney(product.rate, 2));
            $("#product-rateactivite").text(topDom.formatActityRate(product.rateactivite));
            $("#product-duration").text(product.duration);
            if (product.remainingamount < product.amountmin) {
                //$("#product-buy-amount").attr("placeholder", "该产品目前限购" + product.remainingamount + "元");
                $("#product-buy-amount").val(product.remainingamount).attr("disabled", "disabled");
                $("#product-remainingamount").text($.fmoney(product.remainingamount));
                //$("#product-remaining-buyall").css("color", "#b9b9b9").unbind("click");
            } else {
                //$("#product-buy-amount").attr("placeholder", product.amountmin + "元起购,每" + product.step + "元追加");
                $("#product-buy-amount").attr("placeholder", product.amountmin + "元起投," + product.step + "元递增,最高" + $.fmoneytextV2(product.amountmax) + "元。");
            }
            $("#product-profitstartday").text(product.displayprofittime);
            if (account.questionnaire > 0 &&
                product.risklevel > account.questionnaire) {
                $("#user-highrisk").show();
                $("#user-risk-desc").html(account.riskleveldesc);
                $("#product-risk-desc").html(product.riskleveldesc.split('|')[0]);
            }
            if (product.type == 99 && !product.newuser) {
                $("#product-buy").hide();
            }
            if (product.type == 99) {
                $(".hongbao").hide();
            } else {
                //注释掉获取代金券代码，加息券同时也被注释掉了
                //topDom.getCouponList(0, account, product);
            }
        };
        ProductFixedBuy.prototype.choosePayType = function(product, account) {
            var topDom = this;
            var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
            switch (account.iswithholdauthoity) {
                case 0:
                    $.SetSinaPayPassword(returnurl, this.currentDate, account.referralcode, account.iscashdesknewuser);
                    break;
                case 1:
                    if ((product.paytype & 1) == 1) {
                        topDom.validateProductBuy(product, account);
                    } else {
                        $.ZzbWithholdAuthority(returnurl, null, account.referralcode, true);
                    }
                    break;
                case 2:
                case 3:
                default:
                    topDom.validateProductBuy(product, account);
                    break;
            }
        };
        ProductFixedBuy.prototype.getCouponList = function(pageindex, account, product) {
            var topDom = this;
            var url = "/StoreServices.svc/user/getcouponlistbyproductid";
            var param = {
                "saletypes": product.saletype,
                "pageindex": pageindex,
                "productid": product.productid,
                "status": 1
            };
            $.AkmiiAjaxPost(url, param, true).then(function(d) {
                var couponCount = 0;
                if (d.result) {
                    if (d.usercouponlist.length > 0) {
                        $.each(d.usercouponlist, function(index, item) {
                            topDom.initCoupon(item, account);
                        });
                        couponCount++;
                    }
                    topDom.getInterestList(1, couponCount, account, product);
                }
            });
        };;
        ProductFixedBuy.prototype.getInterestList = function(pageindex, couponCount, account, product) {
            var topDom = this;
            var url = "/StoreServices.svc/activity/fixedinterestcouponlistbyproductid";
            var param = {
                "type": 2,
                "saletypes": product.saletype,
                "pageindex": pageindex,
                "productid": product.productid
            };
            $.AkmiiAjaxPost(url, param, true).then(function(d) {
                var ticketCount = 0;
                if (d.result) {
                    var ticketlist = d.fixedinterestcouponlistbyproductid.length;
                    if (ticketlist != 0) {
                        $.each(d.fixedinterestcouponlistbyproductid, function(i, item) {
                            topDom.initInterest(item, account);
                            ticketCount++;
                        });
                    }
                }
                if (couponCount == 0 && ticketCount == 0) {
                    $(".hongbao").hide();
                }
            });
        };
        ProductFixedBuy.prototype.formatActityRate = function(actityrate) {
            return actityrate > 0 ? ("+" + $.fmoney(actityrate) + "%") : '';
        };
        ProductFixedBuy.prototype.initCoupon = function(coupon, account) {
            var topDom = this;
            var html = [];
            html.push("<div class=\"row bb\" id='coupon_" + coupon.couponid + "'  data-minamount=\"" + coupon.minamount + "\" data-option=\"" + coupon.couponid + "\" data-amount=\"" + coupon.amount + "\" data-suiproduct=\"" + coupon.suiproduct + "\">");
            html.push("<div class=\"bt_tips col-97 small-9 fl\">");
            html.push("<span>" + coupon.amount + "元（定期理财" + coupon.minamount + "元起）</span><br /><span>有效期至：" + coupon.enddate + "</span><br />");
            html.push("</div>");
            html.push("<div class=\"small-3 fl\"> ");
            html.push("<img src=\"https://txsres.txslicai.com/css/img2.0/use-choose.png\" class=\"use-choose az-right display-none\" alt=\"\"> </div> </div>");
            html.push("</div>");
            var result = $(html.join(''));
            $("#couponlist").append(result);
            result.click(function() {
                $(".use-choose").addClass("display-none");
                $(this).find(".use-choose").removeClass("display-none");
                $("#current-coupon-text").html($(this).attr("data-amount") + "元" + "(满" + $(this).attr("data-minamount") + "元可用)");
                $("#current-coupon-value").val($(this).attr("data-amount"));
                $("#current-coupon-id").val($(this).attr("data-option"));
                $("#current-interest-id").val(0);
                $(".bonus_ticket").hide();
                $(".mask").hide();
                topDom.productBtnKeyUp_Click(account);
            });
        };;
        ProductFixedBuy.prototype.initInterest = function(interest, account) {
            var topDom = this;
            var html = [];
            html.push("<div class=\"row bb\" id='coupon_" + interest.id + "' data-option=\"" + interest.id + "\" data-suiproduct=\"" + interest.suiproduct + "\" data-rate=\"" + interest.rate + "\" data-expireday=\"" + interest.expireday + "\">");
            html.push("<div class=\"bt_tips col-97 small-9 fl\" >");
            html.push("<span>" + interest.rate + "%（" + interest.expireday + "）</span><br /><span>有效期至：" + interest.expiredate + "</span>");
            html.push("</div>");
            html.push("<div class=\"small-3 fl\"> ");
            html.push("<img src=\"https://txsres.txslicai.com/css/img2.0/use-choose.png\" class=\"use-choose az-right display-none\" alt=\"\"> </div> </div>");
            html.push("</div>");
            var result = $(html.join(''));
            $("#ticketlist").append(result);
            result.click(function() {
                $(".use-choose").addClass("display-none");
                $(this).find(".use-choose").removeClass("display-none");
                $("#current-coupon-text").html($(this).attr("data-rate") + "%" + $(this).attr("data-expireday"));
                $("#current-interest-id").val($(this).attr("data-option"));
                $("#current-coupon-value").val(0);
                $("#current-coupon-id").val(0);
                $(".bonus_ticket").hide();
                $(".mask").hide();
                topDom.productBtnKeyUp_Click(account);
            });
            return result;
        };
        ProductFixedBuy.prototype.validateProductBuy = function(product, account) {
            var topDom = this;
            if (!$("#ck-buy-agreement").is(":checked")) {
                return;
            };
            if ($.isNull($("#product-buy-amount").val()) && $("#product-buy").hasClass("pay_btn_op")) {
                return;
            }
            if (account.questionnaire > 0 &&
                product.risklevel > account.questionnaire) {
                $(".x").click(function() {
                    $(this).parent().parent().parent().hide();
                    $(".mask").hide();
                });
                //$(".rule-tip").find(".btnok").attr("href", "/Html/Product/productfixedlist.html");
                //去看看别的产品
                $(".btnok").click(function() {
                    if (topDom.type == "ios") {
                        PhoneMode.jumpAppWithString({
                            'controller': 'InvestmentViewController'
                        });
                    } else if (topDom.type == "android") {
                        window.PhoneMode.callToPage("MainActivity", "licai");
                    } else {
                        //window.history.back();
                        //window.location.href = "/Html/Product/productfixedlist.html";
                        $(".mask,.rule-tip.rule1").hide();
                    }
                });
                $(".rule-tip").find(".tran-btn").attr("href", "/Html/fanba/risk-assesslist.html?istran=2&productrisklevel=" + product.risklevel + "&producttype=fixedbuy&type=wechat");
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
                return;
            } {
                var amount = Number($("#product-buy-amount").val());
                var couponAmount = Number($("#current-coupon-value").val());
                var couponId = $("#current-coupon-id").val();
                var interestId = $("#current-interest-id").val();
                var couponDom = $("#coupon_" + couponId);
                var interestDom = $("#coupon_" + interestId);
                var couponMinAmount = Number(couponDom.attr("data-minamount"));
            } {
                if (amount <= 0) {
                    $.alertF("购买金额不正确");
                    return;
                }
                if (product.remainingamount < product.amountmin && amount < product.remainingamount) {
                    $.alertF("目前只能购买" + product.remainingamount + "元了");
                    return;
                }
                if (amount < product.amountmin && product.remainingamount >= product.amountmin) {
                    $.alertF("此产品的起投金额为" + product.amountmin + "元");
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
                    $.alertF("产品投资金额只能为" + product.step + "的倍数");
                    return;
                }
                if (couponId > 0 && amount < couponMinAmount) {
                    $.alertF("不符合代金券使用条件");
                    return;
                }

            }
            if (account.iswithholdauthoity != 3) {
                topDom.productBuy("", window.location.href, product, account, 1);
                return;
            }; {
                $("#basicdiv").unbind('click');
                $("#basicdiv").click(function() {
                    $.UpdateTitle("立即投资");
                    $("#choicepay").hide();
                    $("#producthtml").show();
                    $(".box-content .active").hide();
                    $("#basicdiv .active").show();
                    $.PaymentHtmlNew(amount - couponAmount, "", function(password) {
                        $.closePWD();
                        topDom.productBuy(password, "", product, account, 1);
                    }, topDom.cancel, "", account.basicbalance, topDom.displayChoicePay);
                });
                $("#zzbdiv").unbind('click');
                $("#zzbdiv").click(function() {
                    $.UpdateTitle("立即投资");
                    $("#choicepay").hide();
                    $("#producthtml").show();
                    $(".box-content .active").hide();
                    $("#zzbdiv .active").show();
                    $.PaymentHtmlNew(amount - couponAmount, "", function(password) {
                        $.closePWD();
                        topDom.productBuy(password, "", product, account, 2);
                    }, topDom.cancel, "至尊宝", account.demandbalance, topDom.displayChoicePay);
                });
                $("#bankdiv").unbind('click');
                $("#bankdiv").click(function() {
                    $.closePWD();
                    $.UpdateTitle("立即投资");
                    $("#choicepay").hide();
                    $("#producthtml").show();
                    $(".box-content .active").hide();
                    $("#bankdiv .active").show();
                    $.PaymentHtmlNew(amount - couponAmount, "", function(password) {
                        $.closePWD();
                        topDom.productBuy(password, "", product, account, 4);
                    }, topDom.cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, topDom.displayChoicePay, true);
                });
            }
            if (this.validateBalance(product, account, amount, couponAmount)) {
                topDom.showPwdAndPay(product, account, amount, couponAmount);
            }
        };
        ProductFixedBuy.prototype.validateBalance = function(product, account, amount, couponAmount) {
            var lastAmount = amount - couponAmount;
            switch (product.paytype) {
                case 1:
                    if (account.basicbalance < lastAmount) {
                        $.confirmNew("账户余额不足", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = user_deposit_url;
                        });
                        return false;
                    }
                    break;
                case 2:
                    if (account.demandbalance < lastAmount) {
                        $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance + couponAmount)) + "）", "我知道了", "前往至尊宝", null, function() {
                            window.location.href = productbuy_url;
                        });
                        return false;
                    }
                    break;
                case 3:
                    if (account.basicbalance < lastAmount && account.demandbalance < lastAmount) {
                        $.confirmNew("账户余额和至尊宝余额不足", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = user_deposit_url;
                        });
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
                        $.confirmNew("账户余额不足且超出银行卡单笔支付限额", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = user_deposit_url;
                        });
                        return false;
                    }
                    break;
                case 6:
                    if (account.demandbalance < lastAmount && account.depositsinglemax < lastAmount) {
                        $.confirmNew("至尊宝余额不足且超出银行卡单笔支付限额", "null", "（还需为账户充值" + $.fmoney(amount - (account.demandbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = user_deposit_url;
                        });
                        return false;
                    }
                    break;
                case 7:
                    if (account.basicbalance < lastAmount && account.demandbalance < lastAmount && account.depositsinglemax < lastAmount) {
                        $.confirmNew("账户余额和至尊宝余额不足且超出银行卡单笔支付限额", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = user_deposit_url;
                        });
                        return false;
                    }
                    break;
                default:
                    return true;
            }
            return true;
        };
        ProductFixedBuy.prototype.showPwdAndPay = function(product, account, amount, couponAmount) {
            var topDom = this;
            topDom.displaySupportPayType(product, account, amount, couponAmount);
            if ((product.paytype & 1) == 1 &&
                account.basicbalance >= amount - couponAmount) {
                $.PaymentHtmlNew(amount - couponAmount, "", function(password) {
                    $.closePWD();
                    topDom.productBuy(password, "", product, account, 1);
                }, topDom.cancel, "账户余额", account.basicbalance, topDom.displayChoicePay);
                $("#basicdiv .active").show();
                return;
            }
            $("#basicdiv").unbind('click');
            if ((product.paytype & 2) == 2 &&
                account.demandbalance >= amount - couponAmount) {
                $.PaymentHtmlNew(amount - couponAmount, "", function(password) {
                    $.closePWD();
                    topDom.productBuy(password, "", product, account, 2);
                }, topDom.cancel, "至尊宝", account.demandbalance, topDom.displayChoicePay);
                $("#zzbdiv .active").show();
                return;
            }
            $("#zzbdiv").unbind('click');
            if ((product.paytype & 4) == 4 &&
                account.depositsinglemax >= amount - couponAmount) {
                $.PaymentHtmlNew(amount - couponAmount, "", function(password) {
                    $.closePWD();
                    topDom.productBuy(password, "", product, account, 4);
                }, topDom.cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, topDom.displayChoicePay, true);
                $("#bankdiv .active").show();
                return;
            }
        };
        ProductFixedBuy.prototype.displaySupportPayType = function(product, account, amount, couponAmount) {
            $(".box-content .active").hide();
            if ((product.paytype & 1) == 1) {
                $("#basicbalance").html($.fmoney(account.basicbalance));
                if (account.basicbalance < amount - couponAmount) {
                    $("#basicdiv.box-content").addClass('second-span');
                    $("#basicdiv").unbind('click');
                }
            } else {
                $("#basicdiv").hide();
            }
            if ((product.paytype & 2) == 2) {
                $("#demandbalance").html($.fmoney(account.demandbalance));
                if (account.demandbalance < amount - couponAmount) {
                    $("#zzbdiv.box-content").addClass('second-span');
                    $("#zzbdiv").unbind('click');
                }
            } else {
                $("#zzbdiv").hide();
            }
            if ((product.paytype & 4) == 4) {
                $("#bankname").html(account.bankname);
                $("#cardcode").html(account.cardcode);
                $("#depositsinglemax").html($.fmoney(account.depositsinglemax));
                if (account.depositsinglemax < amount - couponAmount) {
                    $("#bankdiv.box-content").addClass('second-span');
                }
            } else {
                $("#bankdiv").hide();
            }
        };
        ProductFixedBuy.prototype.productBuy = function(pwd, returnUrl, product, account, payType) {
            if (payType == 4 && !_BankMaintain.checkMaintain()) {
                return;
            }
            var topDom = this;
            var amount = $("#product-buy-amount").val();
            var couponId = $("#current-coupon-id").val();
            var interestId = $("#current-interest-id").val();
            var couponAmount = Number($("#current-coupon-value").val());
            var data = {
                productid: topDom.productId,
                amount: amount,
                paypassword: pwd,
                couponid: couponId,
                interestcouponid: interestId,
                returnurl: returnUrl,
                paytype: payType,
                ext1:"Fanba",
                ext2:decodeURIComponent(orderid),
                ext3:"",
                sign:sign,
                requesttime:requesttime
            };
            var balance = 0;
            var bankName = "";
            var pwdPayType = "";
            if (payType == 2) {
                bankName = pwdPayType = "至尊宝";
                balance = account.demandbalance;
            } else if (payType == 1) {
                bankName = pwdPayType = "账户余额";
                balance = account.basicbalance;
            } else if (payType == 4) {
                bankName = "银行卡";
                pwdPayType = account.bankname + "(" + account.cardcode + ")";
                balance = account.depositsinglemax;
            }
            var url = "/StoreServices.svc/product/buy";
            Product.productBuy(data, function(data) {
                if (data.result) {
                    var param_1 = "/html/fanba/operation-success.html?type=fixedbuy" +
                        "&product=" + encodeURIComponent(product.title) +
                        "&title=" + encodeURIComponent('投资成功') +
                        "&amount=" + amount +
                        "&buybank=" + encodeURIComponent(bankName) +
                        "&profittime=" + product.profitstartday +
                        "&starttime=" + data.date +
                        "&fillsignday=" + data.fillsignday +
                        "&iswithholdauthoity=" + account.iswithholdauthoity +
                        "&returnurl=" + success_returnurl;
                    if (!$.isNull(data.redirecturl)) {
                        window.localStorage.setItem("buyFixedSuccessKey" + data.referralcode, param_1);
                        document.write(data.redirecturl);
                        return;
                    }
                    _pyInvestmentSuccess(account.referralcode, account.username, account.mobile, data.tranid, $("#product-buy-amount").val(), $.getQueryStringByName("id"), product.duration);
                    if (account.invitedby == _CHANNELCODE) {
                        _MVorder(account.username, account.referralcode, data.tranid, product.productid, $("#product-buy-amount").val(), product.title);
                    }
                    if ((payType & 2) == 2) {
                        if (data.hascoupon) {
                            $.alertF("购买成功<br/>恭喜您获得" + (data.interestrate * 100) + "%加息劵一张 <br/> 请在" + data.expiredate + "前使用<br/><br/>请在&nbsp;<b>我的-平台奖励-加息劵</b>&nbsp;查看", null, function() {
                                window.location.replace(param_1);
                            });
                        } else {
                            window.location.replace(param_1);
                        }
                    } else {
                        if (data.hascoupon) {
                            $.alertF("购买成功<br/>恭喜您获得" + (data.interestrate * 100) + "%加息劵一张 <br/> 请在" + data.expiredate + "前使用<br/><br/>请在&nbsp;<b>我的-平台奖励-加息劵</b>&nbsp;查看", null, function() {
                                window.location.replace(param_1);
                            });
                        } else {
                            window.location.replace(param_1);
                        }
                    }
                } else if (data.errorcode == "20018") {
                    $.alertNew(data.errormsg, null, function() {
                        if (account.iswithholdauthoity == 3) {
                            $.PaymentHtmlNew(amount, "", function(password) {
                                $.closePWD();
                                topDom.productBuy(password, "", product, account, payType);
                            }, topDom.cancel, pwdPayType, balance);
                        } else {
                            topDom.productBuy("", "", product, account, payType);
                        }
                    });
                } else if (data.errorcode == "20019") {
                    $.confirmF(data.errormsg, null, "去重置", function() {
                        $(".reset").click();
                    }, function() {
                        window.location.href = reset_password_url;
                    });
                } else if (data.errorcode == "isnewuser") {
                    $.alertF(data.errormsg);
                } else if (data.errorcode == "missing_parameter_accountid") {
                    $.alertF("请先登录");
                    //$.confirmF("请先登录", null, null, null, $.Loginlink);
                } else if (data.errormsg == "余额不足") {
                    if (payType == 1) {
                        $.confirmNew("账户余额不足", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = user_deposit_url;
                        });
                    } else if (payType == 2) {
                        $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance + couponAmount)) + "）", "我知道了", "前往充值", null, function() {
                            window.location.href = productbuy_url;
                        });
                    }
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        ProductFixedBuy.prototype.cancel = function() {
            $(".basicimg").hide();
            $(".demandimg").hide();
            $(".bankimg").hide();
            $("#basic").removeClass("second-span");
            $("#basic").next().removeClass("second-span").addClass("select-span");
            $("#demand").removeClass("second-span");
            $("#demand").next().removeClass("second-span").addClass("select-span");
            $("#bank").removeClass("second-span");
            $("#bank").next().removeClass("second-span").addClass("select-span");
        };
        ProductFixedBuy.prototype.displayChoicePay = function() {
            $.UpdateTitle("支付方式");
            $.closePWD();
            $("#choicepay").show();
            $("#producthtml").hide();
        };
        ProductFixedBuy.prototype.back = function() {
            window.history.back();
        };
        return ProductFixedBuy;
    }());
    var productfixedbuy = new ProductFixedBuy();
    var _BankMaintain = new BankMaintain();
    _BankMaintain.getData();
    //修改更换银行卡的链接地址，为返吧专属链接，为了购买流程闭合
    $(".chance-bank").unbind("click").click(function() {
            window.location.href = "/html/fanba/mybankcard.html";
    });
});