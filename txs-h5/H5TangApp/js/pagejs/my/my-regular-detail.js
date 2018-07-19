//define(["require", "exports", '../api/user', '../api/product'], function (require, exports, user_1, product_1) {
$(function () {
"use strict";
var Product = {};
var User = {};
(function (Product) {
   
    function getProductBidItem(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/bid";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    Product.getProductBidItem = getProductBidItem;
    function getProductItem(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/item";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    Product.getProductItem = getProductItem;
})(Product);
User.getUserInfo=function(request, success, needLoder, error, complete) {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, request, !needLoder).then(success);
}
    var MyRegularDetailPage = (function () {
        function MyRegularDetailPage() {
            this.BidID = $.getQueryStringByName("id");
            this.pageInit();
            this.getUserInfo();
        }
        MyRegularDetailPage.prototype.pageInit = function () {
            $("#redeemed").hide();
            $("#calledAway").hide();
            $("#check_tips_question").click(function () {
                window.location.href = "/html/product/transfer.html";
            });
        };
        MyRegularDetailPage.prototype.getUserInfo = function () {
            var topDom = this;
            User.getUserInfo({}, function (data) {
                topDom.CurrentDate = data.date;
                if (data.result) {
                    var account = data.accountinfo;
                    if (data.ismaintenance) {
                        window.location.replace("/html/system/data-processing.html");
                        return;
                    }
                    if (data.isglobalmaintenance) {
                        window.location.replace("/html/system/system-maintenance.html");
                        return;
                    }
                    if (!$.CheckAccountCustomStatusBeforeNext(account)) {
                        return;
                    }
                    // if (account.customstatus < 2) {
                    //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                    //     return;
                    // }
                    // if (account.customstatus < 3) {
                    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
                    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                    //     });
                    //     return false;
                    // }
                    
                    topDom.getProductBidDetail(account);
                }
                else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                }
                else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyRegularDetailPage.prototype.getProductBidDetail = function (account) {
            var topDom = this;
            Product.getProductBidItem({
                productbidid: this.BidID
            }, function (data) {
                if (data.result) {
                    var product_2 = data.productbid;
                    $.UpdateTitle(product_2.title);
                    if (product_2.status == 8) {
                        $("#lowfile").show().click(function () {
                            window.location.href = "/html/my/equity-transfer-assignment-list.html?bidid=" + product_2.id;
                        });
                    }
                    var name = "";
                    if (product_2.riskleveltext.length == 0) {
                        name = product_2.title;
                    }
                    else {
                        name = product_2.title + "<a class=\"zm info\" href=\"/Html/Product/productfixedinfo.html\">" + product_2.riskleveltext + "</a>";
                    }
                    $("#productName").html(name);
                    if (product_2.status != 2) {
                        $("#investDetail").unbind("click");
                        $("#contractDocument").hide();
                    }
                    $('#product-rate').text($.fmoney(product_2.rate, 2));
                    if (product_2.rateactivite > 0) {
                        $("#product-rate-rateactivite").text(topDom.formatActityRate(product_2.rateactivite)).show();
                    }
                    if (product_2.cantransfer && product_2.transferlockday > 0) {
                        $("#transferlockday").html("持有" + product_2.transferlockday + "天可转");
                    }
                    else if (product_2.cantransfer && product_2.transferlockday == 0) {
                        $("#transferlockday").html("起息即可转");
                    }
                    $("#startInterestDay").html(product_2.startdate + " 起息");
                    $("#intvestTime").html(product_2.duration + "");
                    $("#investMoney").html($.fmoney(product_2.bidamount));
                    $("#bidCount").html(product_2.bidcount + "人");
                    $("#repayPlanetxt").html(product_2.typetext);
                    Product.getProductItem({ productid: product_2.productid }, function (data) {
                        if (data.result) {
                            if (product_2.status == 2) {
                                $("#investDetail").click(function () {
                                    window.location.href = "/html/my/userloanbid.html?bid=" + topDom.BidID + "&productid=" + product_2.productid + "&isentrust=" + data.productinfo.isentrust;
                                });
                            }
                            $("#productDetail").click(function () {
                                if (data.productinfo.isentrust) {
                                    window.location.href = "/html/product/regular-product-detail.html?id=" + product_2.productid + "&bid=" + topDom.BidID + "&lockduration=" + product_2.lockduration + "&isentrust=" + product_2.isentrust + "&cantransfer=" + product_2.cantransfer;
                                }
                                else {
                                    window.location.href = "/html/product/regular-product-detail-old.html?id=" + product_2.productid + "&bid=" + topDom.BidID + "&lockduration=" + product_2.lockduration + "&isentrust=" + product_2.isentrust + "&cantransfer=" + product_2.cantransfer;
                                }
                            });
                            if (data.productinfo.saletype == 12) {
                                $("#calledAway").hide();
                            }
                        }
                    });
                    $("#repayPlane").click(function () {
                        window.location.href = "/html/product/regular-recordplan.html?id=" + topDom.BidID + "&interestcouponid=" + product_2.interestcouponid;
                    });
                    $("#productIntroduce").click(function () {
                        window.location.href = "/html/product/regular-product-introduce.html?id=" + product_2.productid;
                    });
                    if (product_2.status == 8) {
                        $("#contractDocument").hide();
                    }
                    else {
                        $("#contractDocument").click(function () {
                            window.location.href = "/html/my/contract/my-contract-document.html?bidid=" + topDom.BidID + "&productid=" + product_2.productid;
                        });
                    }
                    $("#investRecord").click(function () {
                        window.location.href = "/html/product/productbidlist.html?id=" + product_2.productid;
                    });
                    if (product_2.canredeem && !product_2.cantransfer && product_2.lockduration == 0 && !product_2.isentrust) {
                        $("#calledAway").show().click(function () {
                            topDom.checkiswithholdauthoity(account, product_2);
                        });
                    }
                    else if (product_2.lockduration > 0 && !product_2.cantransfer && product_2.status != 8 && product_2.isentrust) {
                        $("#transfer").show();
                        $("#transfer").removeClass("timeDeposit_sh_btn").addClass("timeDeposit_sh_btn1");
                        $("#transfer").css("background", "rgb(212, 212, 212)");
                        $(".check_tips").show();
                    }
                    else if (product_2.cantransfer) {
                        $("#transfer").show().click(function () {
                            window.location.replace("/html/my/my-product-transfer.html?id=" + product_2.id + "");
                        });
                    }
                    else if (product_2.status == 8) {
                        $("#transfer").show().html("已转让");
                        $("#transfer").removeClass("timeDeposit_sh_btn").addClass("timeDeposit_sh_btn1");
                        $("#transfer").css("background", "rgb(212, 212, 212)");
                        $(".check_tips").show();
                    }
                    else if (product_2.status != 6 && product_2.cantransfer) {
                        $("#transfer").show();
                        $("#transfer").removeClass("timeDeposit_sh_btn").addClass("timeDeposit_sh_btn1");
                        $("#transfer").css("background", "rgb(212, 212, 212)");
                        $(".check_tips").show();
                    }
                    else {
                        $("#redeemed").show().html(product_2.statustext);
                    }
                    switch (product_2.status) {
                        case 3:
                        case 5:
                            $("#redeemed").show();
                            break;
                        case 6:
                            $("#redeemed").show().html(product_2.statustext);
                            break;
                    }
                    if (product_2.status != 2) {
                        $("#investDetail").unbind("click");
                        $("#contractDocument").hide();
                    }
                    if (product_2.isoldproduct) {
                        $("#startInterestDay").text("次日起息");
                        $("#productIntroduce").hide();
                        $(".check_tips").hide();
                    }
                    if (product_2.cantransfer) {
                        $(".check_tips").show();
                    }
                }
                else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                }
                else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyRegularDetailPage.prototype.formatShowRate = function (value) {
            value = $.fmoney(value);
            var arry = value.split('.');
            var ha = [];
            ha.push("<span class=\"t1 f-s-2rem\">" + value + "</span>");
            ha.push("%");
            return ha.join("");
        };
        MyRegularDetailPage.prototype.checkiswithholdauthoity = function (account, product) {
            if (account.iswithholdauthoity >= 2) {
                this.redeemConfirm(product);
            }
            else if (account.iswithholdauthoity == 0) {
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/my/index.html";
                $.SetSinaPayPassword(returnurl, this.CurrentDate, account.referralcode, account.iscashdesknewuser);
            }
            else if (account.iswithholdauthoity == 1) {
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
                $.WithholdAuthority(returnurl, function () { this.redeemConfirm(); }, account.referralcode);
            }
            else {
                this.redeemConfirm(product);
            }
        };
        MyRegularDetailPage.prototype.redeemConfirm = function (product) {
            var topDom = this;
            var ha = [];
            ha.push(" <div class=\"timeDeposit-info-pop\">");
            ha.push("    <div class=\"tit\">提前赎回需要扣除一定的手续费(本金×2%) 您确定要提前赎回么？</div>");
            ha.push("    <ul class=\"ti-list\">");
            ha.push("        <li><span class=\"tl\">赎回本金(元)</span><span class=\"c1 tr\">＋" + $.fmoney(product.bidamount) + "</span></li>");
            ha.push("        <li><span class=\"tl\">赎回收益(元)</span><span class=\"c1 tr\">＋" + $.fmoney(product.calledawaybenefit) + "</span></li>");
            ha.push("        <li><span class=\"tl\">扣除手续费(元)</span><span class=\"c2 tr\">－" + $.fmoney(product.penalty) + "</span></li>");
            ha.push("        <li><span class=\"c4 tl\">赎回合计(元)</span><span class=\"c3 tr\">" + $.fmoney(product.totalamount) + "</span></li>");
            ha.push("    </ul>");
            ha.push("    <div class=\"pop_txt tc\" style=\"border-bottom: 0;\">预计赎回到账日期为" + product.paymentdate + "</div>");
            ha.push("</div>");
            var html = ha.join('');
            $.confirmF2(html, null, null, null, function () {
                topDom.redeem(product);
            });
        };
        MyRegularDetailPage.prototype.redeem = function (product) {
            var topDom = this;
            $.PaymentHtmlNew(product.totalamount, "赎回金额", function (password) {
                $.closePWD();
                var url = "/StoreServices.svc/trans/redeemfixed";
                var data = { "paypassword": password, "productbidid": topDom.BidID };
                $.AkmiiAjaxPost(url, data).then(function (data) {
                    if (data.result) {
                        window.location.replace("/html/paycenter/operation-success.html?type=fixedRedeem&amount=" + product.totalamount + "&paymentdate=" + product.paymentdate + "&product=" + encodeURIComponent(product.title) + "&status=" + encodeURIComponent('已从' + product.title + '赎回到账户') + "&title=" + encodeURIComponent('赎回成功'));
                    }
                    else if (data.errorcode == "20019") {
                        $.confirmF(data.errormsg, null, "去重置", function () {
                            $(".reset").click();
                        }, function () {
                            window.location.href = "/html/my/resetpassword.html";
                        });
                    }
                    else if (data.errorcode == "20018") {
                        $.alertF(data.errormsg, null, function () {
                            topDom.redeem(product);
                        });
                    }
                    else if (data.errorcode == 'missing_parameter_accountid') {
                        $.Loginlink();
                    }
                    else {
                        $.alertF(data.errormsg);
                    }
                });
            }, null, null, null, null, false);
        };
        MyRegularDetailPage.prototype.formatActityRate = function (actityrate) {
            if (actityrate > 0) {
                return "+" + $.fmoney(actityrate) + "%";
            }
            else {
                return "";
            }
        };
        return MyRegularDetailPage;
    }());
    var myRegularDetail = new MyRegularDetailPage();
});
