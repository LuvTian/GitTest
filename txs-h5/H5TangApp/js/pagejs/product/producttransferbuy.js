//define(["require", "exports"], function (require, exports) {
$(function () {
    "use strict";
    var depositbtntext = "充值";
    var withdrawbtntext = "提现";
    var accounttext = "账户余额";
    var ProductTransferBuy = (function () {
        function ProductTransferBuy() {
            this.transferID = $.getQueryStringByName("id");
            this.getUserInfo();
            this.returnUrl = window.location.href;
            this.status = 0;
        }
        ProductTransferBuy.prototype.getUserInfo = function () {
            var topDom = this;
            var url = "/StoreServices.svc/user/info";
            $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                if (data.result) {
                    $.CheckAccountCustomStatusBeforeNext(data.accountinfo);
                    // if (data.accountinfo.customstatus < 2) {
                    //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                    // }
                    // if (data.accountinfo.customstatus < 3) {
                    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
                    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                    //     });
                    // }
                    var buyFixedSuccessKey = "buyFixedSuccessKey";
                    buyFixedSuccessKey = buyFixedSuccessKey + data.accountinfo.referralcode;
                    var tid = $.getQueryStringByName("tid");
                    if (!$.isNull(tid)) {
                        window.location.replace(window.localStorage.getItem(buyFixedSuccessKey));
                    }
                    //是否同意协议
                    if (data.accountinfo.issignmoneyboxandhtffund) {
                        accounttext = "僧财宝";
                        depositbtntext = "转入";
                        $("#basic").html("僧财宝");
                    }
                } else if (data.errorcode == "missing_parameter_accountid") {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }

                topDom.getTransferProduct(data.accountinfo);
            });
        };
        ProductTransferBuy.prototype.getTransferProduct = function (account) {
            var topDom = this;
            var url = "/StoreServices.svc/product/producttransferdetail";
            var data = {
                "transferid": this.transferID
            };
            $.AkmiiAjaxPost(url, data, true).then(function (data) {
                topDom.currentDate = data.date;
                topDom.status = data.transferinfo.status;
                topDom.initProduct(data.transferinfo);
                topDom.initProductBuyBtn(data.transferinfo, account);
            });
        };
        ProductTransferBuy.prototype.initProduct = function (product) {
            $("#product-title").prepend(product.title).click(function () {
                window.location.href = "/html/product/productfixeddetail.html?id=" + product.productid;
            });
            $("#zcxieyi").click(function () {
                window.location.href = "/Html/Product/contract/transfer-zcxieyi.html?productid=" +
                    product.productid;
            });
            $("#product-rate").text(product.transferrate);
            $("#product-duration").text(product.remainingday);
            $("#product-profitstartday").text(product.displayprofittime);
            $("#product-buy-amount-text").text($.fmoney(product.transferamount));
            $("#product-buy-amount").val(product.transferamount);
            $("#product-buy").html("支付" + $.fmoney(product.transferamount) + "元");
        };
        ProductTransferBuy.prototype.initProductBuyBtn = function (product, account) {
            var topDom = this;
            if (!account.passinvestor ||
                !account.riskwarning ||
                account.questionnaire <= 0) {
                $(".xieyi").hide();
                $("#user-investmentcertification").show();
                $("#product-buy").text("立即评测").removeClass("pay_btn_op").attr("href", "/Html/My/risk-assesslist.html?rturl=" + encodeURI(this.returnUrl) + "&productrisklevel=" + product.risklevel + "&producttype=transferbuy");
                return;
            }
            if (account.questionnaire > 0 &&
                product.risklevel > account.questionnaire) {
                $("#user-highrisk").show();
                $("#user-risk-desc").html(account.riskleveldesc);
                $("#product-risk-desc").html(product.riskleveldesc.split('|')[0]);
            }
            $("#buy-agreement,#ck-buy-agreement").click(function () {
                if ($("#ck-buy-agreement").prop("checked")) {
                    $(".checkbox").removeClass("checkbox1");
                    $("#ck-buy-agreement").prop("checked", false);
                    $("#product-buy").addClass("pay_btn_op");
                } else {
                    $(".checkbox").addClass("checkbox1");
                    $("#ck-buy-agreement").prop("checked", true);
                    $("#product-buy").removeClass("pay_btn_op");
                }
            });
            $("#product-buy").unbind().click(function () {
                topDom.choosePayType(product, account);
            });
        };
        ProductTransferBuy.prototype.choosePayType = function (product, account) {
            var topDom = this;
            var returnurl = topDom.returnUrl;
            if (!$.CheckAccountCustomStatusBeforeNext(account)) {
                return;
            }
            // if (account.customstatus < 2) {
            //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            //     return;
            // }
            // if (account && account.customstatus < 3) {
            //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
            //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
            //     });
            //     return;
            // }
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
        ProductTransferBuy.prototype.validateProductBuy = function (product, account) {
            var topDom = this;
            if (!$("#ck-buy-agreement").is(":checked")) {
                return;
            };
            if (account.questionnaire > 0 &&
                product.risklevel > account.questionnaire) {
                $(".x").click(function () {
                    $(this).parent().parent().parent().hide();
                    $(".mask").hide();
                });
                $(".rule-tip").find(".btnok").attr("href", "/Html/Product/producttransferlist.html");
                $(".rule-tip").find(".tran-btn").attr("href", "/Html/my/risk-assesslist.html?istran=2&productrisklevel=" + product.risklevel + "&producttype=transferbuy");
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
            }
            topDom.getTransferProduct(account);
            if (topDom.status > 1) {
                $.alertF("啊哦，晚了一步，您购买的转让产品已经被别人抢走了", null, function () {
                    window.location.href = "/Html/Product/producttransferlist.html"
                }, null);
            } else {
                var amount = Number($("#product-buy-amount").val());
                if (account.iswithholdauthoity != 3) {
                    topDom.productBuy("", topDom.returnUrl, product, account, 1);
                    return;
                } {
                    $("#basicdiv").unbind('click');
                    $("#basicdiv").click(function () {
                        $.UpdateTitle("立即投资");
                        $("#choicepay").hide();
                        $("#producthtml").show();
                        $(".box-content .active").hide();
                        $("#basicdiv .active").show();
                        $.PaymentHtmlNew(amount, "", function (password) {
                            $.closePWD();
                            topDom.productBuy(password, "", product, account, 1);
                        }, topDom.cancel, "", account.basicbalance, topDom.displayChoicePay);
                    });
                    $("#zzbdiv").unbind('click');
                    $("#zzbdiv").click(function () {
                        $.UpdateTitle("立即投资");
                        $("#choicepay").hide();
                        $("#producthtml").show();
                        $(".box-content .active").hide();
                        $("#zzbdiv .active").show();
                        $.PaymentHtmlNew(amount, "", function (password) {
                            $.closePWD();
                            topDom.productBuy(password, "", product, account, 2);
                        }, topDom.cancel, "至尊宝", account.demandbalance, topDom.displayChoicePay);
                    });
                    $("#bankdiv").unbind('click');
                    $("#bankdiv").click(function () {
                        $.closePWD();
                        $.UpdateTitle("立即投资");
                        $("#choicepay").hide();
                        $("#producthtml").show();
                        $(".box-content .active").hide();
                        $("#bankdiv .active").show();
                        $.PaymentHtmlNew(amount, "", function (password) {
                            $.closePWD();
                            topDom.productBuy(password, "", product, account, 4);
                        }, topDom.cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, topDom.displayChoicePay, true);
                    });
                }
                if (this.validateBalance(product, account, amount)) {
                    topDom.showPwdAndPay(product, account, amount);
                }
            }
        }

        ProductTransferBuy.prototype.validateBalance = function (product, account, amount) {
            var lastAmount = amount;
            switch (product.paytype) {
                case 1:
                    if (account.basicbalance < lastAmount) {
                        $.confirmNew("" + accounttext + "不足", "null", "（还需为账户" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/paycenter/user-deposit.html";
                        });
                        return false;
                    }
                    break;
                case 2:
                    if (account.demandbalance < lastAmount) {
                        $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance)) + "）", "我知道了", "前往至尊宝", null, function () {
                            window.location.href = "/html/product/productbuy.html";
                        });
                        return false;
                    }
                    break;
                case 3:
                    if (account.basicbalance < lastAmount && account.demandbalance < lastAmount) {
                        $.confirmNew("" + accounttext + "和至尊宝余额不足", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/paycenter/user-deposit.html";
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
                        $.confirmNew("" + accounttext + "不足且超出银行卡单笔支付限额", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/paycenter/user-deposit.html";
                        });
                        return false;
                    }
                    break;
                case 6:
                    if (account.demandbalance < lastAmount && account.depositsinglemax < lastAmount) {
                        $.confirmNew("至尊宝余额不足且超出银行卡单笔支付限额", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.demandbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/paycenter/user-deposit.html";
                        });
                        return false;
                    }
                    break;
                case 7:
                    if (account.basicbalance < lastAmount && account.demandbalance < lastAmount && account.depositsinglemax < lastAmount) {
                        $.confirmNew("" + accounttext + "和至尊宝余额不足且超出银行卡单笔支付限额", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/paycenter/user-deposit.html";
                        });
                        return false;
                    }
                    break;
                default:
                    return true;
            }
            return true;
            //if ((product.paytype & 1) == 1 &&
            //    (product.paytype & 2) == 2 &&
            //    account.basicbalance < amount &&
            //    account.demandbalance < amount &&
            //    account.iswithholdauthoity != 3) {
            //    $.confirmNew("账户余额及至尊宝余额不足", "null", " ", "我知道了", "前往充值", null, function () {
            //        window.location.href = "/html/paycenter/user-deposit.html";
            //    });
            //    return false;
            //}
            //if ((product.paytype & 2) == 2 &&
            //    (product.paytype & 4) == 4 &&
            //    account.demandbalance < amount &&
            //    account.depositsinglemax < amount) {
            //    $.confirmNew("至尊宝余额不足且超出银行卡单笔支付限额", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance)) + "）", "我知道了", "前往至尊宝", null, function () {
            //        window.location.href = "/html/product/productbuy.html";
            //    });
            //    return false;
            //}
            //if ((product.paytype & 1) == 1 &&
            //    (product.paytype & 4) == 4 &&
            //    account.basicbalance < amount &&
            //    account.depositsinglemax < amount) {
            //    $.confirmNew("账户余额不足且超出银行卡单笔支付限额", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往充值", null, function () {
            //        window.location.href = "/html/paycenter/user-deposit.html";
            //    });
            //    return false;
            //}
            //if (product.paytype == 1 &&
            //    account.basicbalance < amount) {
            //    $.confirmNew("账户余额不足", "null", "（还需为账户充值" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往充值", null, function () {
            //        window.location.href = "/html/paycenter/user-deposit.html";
            //    });
            //    return false;
            //}
            //if (product.paytype == 2 &&
            //    account.demandbalance < amount) {
            //    $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance)) + "）", "我知道了", "前往至尊宝", null, function () {
            //        window.location.href = "/html/product/productbuy.html";
            //    });
            //    return false;
            //}
            //if (product.paytype == 4 &&
            //    account.depositsinglemax < amount) {
            //    $.alertF("购买金额超过银行限额");
            //    return false;
            //}
            //return true;
        };
        ProductTransferBuy.prototype.showPwdAndPay = function (product, account, amount) {
            var topDom = this;
            topDom.displaySupportPayType(product, account, amount);
            if ((product.paytype & 1) == 1 &&
                account.basicbalance >= amount) {
                $.PaymentHtmlNew(amount, "", function (password) {
                    $.closePWD();
                    topDom.productBuy(password, "", product, account, 1);
                }, topDom.cancel, "" + accounttext + "", account.basicbalance, topDom.displayChoicePay);
                $("#basicdiv .active").show();
                return;
            }
            $("#basicdiv").unbind('click');
            if ((product.paytype & 2) == 2 &&
                account.demandbalance >= amount) {
                $.PaymentHtmlNew(amount, "", function (password) {
                    $.closePWD();
                    topDom.productBuy(password, "", product, account, 2);
                }, topDom.cancel, "至尊宝", account.demandbalance, topDom.displayChoicePay);
                $("#zzbdiv .active").show();
                return;
            }
            $("#zzbdiv").unbind('click');
            if ((product.paytype & 4) == 4 &&
                account.depositsinglemax >= amount) {
                $.PaymentHtmlNew(amount, "", function (password) {
                    $.closePWD();
                    topDom.productBuy(password, "", product, account, 4);
                }, topDom.cancel, "" + account.bankname + "(" + account.cardcode + ")", account.depositsinglemax, topDom.displayChoicePay, true);
                $("#bankdiv .active").show();
                return;
            }
        };
        ProductTransferBuy.prototype.displaySupportPayType = function (product, account, amount) {
            $(".box-content .active").hide();
            if ((product.paytype & 1) == 1) {
                $("#basicbalance").html($.fmoney(account.basicbalance));
                if (account.basicbalance < amount) {
                    $("#basicdiv.box-content").addClass('second-span');
                    $("#basicdiv").unbind('click');
                }
            } else {
                $("#basicdiv").hide();
            }
            if ((product.paytype & 2) == 2) {
                $("#demandbalance").html($.fmoney(account.demandbalance));
                if (account.demandbalance < amount) {
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
                if (account.depositsinglemax < amount) {
                    $("#bankdiv.box-content").addClass('second-span');
                }
            } else {
                $("#bankdiv").hide();
            }
        };
        ProductTransferBuy.prototype.productBuy = function (pwd, returnUrl, product, account, payType) {
            if (payType == 4 && !_BankMaintain.checkMaintain()) {
                return;
            }
            var topDom = this;
            var amount = Number($("#product-buy-amount").val());
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
            var data = {
                transferid: topDom.transferID,
                paypassword: pwd,
                returnurl: returnUrl,
                paytype: payType
            };
            var url = "/StoreServices.svc/product/transferbuy";
            $.AkmiiAjaxPost(url, data).then(function (data) {
                if (data.result) {
                    var param = "/html/paycenter/operation-success.html?type=fixedbuy" +
                        "&product=" + encodeURIComponent(product.title) +
                        "&title=" + encodeURIComponent('投资成功') +
                        "&amount=" + amount +
                        "&buybank=" + encodeURIComponent(bankName) +
                        "&profittime=" + data.date +
                        "&starttime=" + data.date +
                        "&fillsignday=" + data.fillsignday +
                        "&iswithholdauthoity=" + account.iswithholdauthoity;
                    if (!$.isNull(data.redirecturl)) {
                        window.localStorage.setItem("buyFixedSuccessKey" + data.referralcode, param);
                        document.write(data.redirecturl);
                        return;
                    }
                    _pyInvestmentSuccess(account.referralcode, account.username, account.mobile, data.tranid, $("#product-buy-amount").val(), $.getQueryStringByName("id"), product.duration);
                    if (account.invitedby == _CHANNELCODE) {
                        _MVorder(account.username, account.referralcode, data.tranid, product.productid, $("#product-buy-amount").val(), product.title);
                    }
                    _gsq.push(["T", "GWD-002985", "track", "/targetpage/buy_success"]);
                    window.location.replace(param);
                } else if (data.errorcode == "20018") {
                    $.alertNew(data.errormsg, null, function () {
                        if (account.iswithholdauthoity == 3) {
                            $.PaymentHtmlNew(amount, "", function (password) {
                                $.closePWD();
                                topDom.productBuy(password, "", product, account, 1);
                            }, topDom.cancel, pwdPayType, balance);
                        } else {
                            topDom.productBuy("", "", product, account, 1);
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
                        $.confirmNew("" + accounttext + "不足", "null", "（还需为账户" + depositbtntext + "" + $.fmoney(amount - (account.basicbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/paycenter/user-deposit.html";
                        });
                    } else if (payType == 2) {
                        $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入" + $.fmoney(amount - (account.demandbalance)) + "）", "我知道了", "前往" + depositbtntext + "", null, function () {
                            window.location.href = "/html/product/productbuy.html";
                        });
                    }
                } else if (data.errormsg == "啊哦，晚了一步，您购买的转让产品已经被别人抢走了") {
                    $.alertF(data.errormsg, "我知道啦");
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        ProductTransferBuy.prototype.cancel = function () {
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
        ProductTransferBuy.prototype.displayChoicePay = function () {
            $.UpdateTitle("支付方式");
            $.closePWD();
            $("#choicepay").show();
            $("#producthtml").hide();
        };
        ProductTransferBuy.prototype.back = function () {
            window.history.back();
        };
        return ProductTransferBuy;
    }());
    var productTransfer = new ProductTransferBuy();
    var _BankMaintain = new BankMaintain();
    _BankMaintain.getData();
});