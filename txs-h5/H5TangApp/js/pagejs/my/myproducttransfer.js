//define(["require", "exports", '../api/product'], function (require, exports, product_1) {
$(function() {
    "use strict";
    var Product = {};
    (function(Product) {
        function getProductBidItem(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/bid";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductBidItem = getProductBidItem;

        function productTransfer(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/producttransfer";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.productTransfer = productTransfer;
    })(Product);
    var MyProductTransfer = (function() {
        function MyProductTransfer() {
            this.ProductBidID = $.getQueryStringByName("id");
            this.PageInit();
            this.GetProductDetail();
        }
        MyProductTransfer.prototype.PageInit = function() {
            var topDom = this;
            $("#transferamount").keyup(function() {
                var transferamount = parseFloat($("#transferamount").val());
                if (transferamount < topDom.Product.mintransferamount) {
                    topDom.checkmintransferamount(transferamount);
                } else {
                    topDom.checkmaxtransferamount(transferamount);
                }
                topDom.pemaltyAndDealAmount();
            });
            $("#minus").click(function() {
                var transferamount = parseFloat($("#transferamount").val());
                if ($.isNull(transferamount)) {
                    return;
                } else {
                    if (transferamount >= 10) {
                        transferamount = transferamount - 10;
                        $("#transferamount").val(transferamount);
                        topDom.pemaltyAndDealAmount();
                    }
                }
                topDom.checkmintransferamount(transferamount);
            });
            $("#plus").click(function() {
                var transferamount;
                if ($("#transferamount").val() == "") {
                    transferamount = 0;
                } else {
                    transferamount = parseFloat($("#transferamount").val());
                }
                transferamount = (transferamount + 10).toFixed(2);
                $("#transferamount").val(transferamount);
                topDom.pemaltyAndDealAmount();
                topDom.checkmaxtransferamount(transferamount);
                topDom.checkmintransferamount(transferamount);
            });
            $("#checkbox").click(function() {
                if ($(this).find("img").css("display") == "block") {
                    $(this).find("img").hide();
                    $("#btn-transfer").removeClass("pro-info-pay_btn").addClass("timeDeposit_sh_btn1");
                } else {
                    $(this).find("img").show();
                    $("#btn-transfer").removeClass("timeDeposit_sh_btn1").addClass("pro-info-pay_btn");
                }
            });
            $("#btn-transfer").click(function() {
                topDom.checkTransferAmount();
            });
            $(".interest_info").click(function() {
                window.location.href = "/html/product/transfer.html";
            });

        };
        MyProductTransfer.prototype.GetProductDetail = function() {
            var topDom = this;
            Product.getProductBidItem({
                productbidid: this.ProductBidID
            }, function(data) {
                if (data.result) {
                    topDom.Product = data.productbid;
                    $("#zqxieyi").click(function() {
                        window.location.href = "/Html/Product/contract/transfer-zcxieyi.html?productid=" +
                            topDom.Product.productid;
                    });
                    $.UpdateTitle(topDom.Product.title);
                    $("#transferrate").html($.fmoney(topDom.Product.rate));
                    if (topDom.Product.transferlockday > 0) {
                        $("#transferhtml").html("转让锁定期" + topDom.Product.transferlockday + "天后可转");
                    } else {
                        $("#transferhtml").html("起息即可转");
                    }
                    $("#transferlink").click(function() {
                        window.location.href = "/html/product/transferinfo.html?transferlockday=" + topDom.Product.transferlockday + "";
                    });
                    $("#remainingday").html(topDom.Product.remainingdays + "");
                    $("#remainingamount").html($.fmoney(topDom.Product.remainingamount));
                    $("#transferamount").val(topDom.Product.defaulttransferamount);
                    topDom.pemaltyAndDealAmount();
                    if (topDom.Product.rateactivite > 0) {
                        $("#product-rate-rateactivite").text(topDom.formatActityRate(topDom.Product.rateactivite)).show();
                    }
                    $("#remaininginterest").html($.fmoney(topDom.Product.remaininginterest));
                    $("#enddate").html(topDom.Product.enddate);
                    //if (topDom.Product.producttype == 2) {
                    //    $("#interest-text").text("已发放利息");
                    //}
                    if (topDom.Product.producttype == 2) {
                        $("#interest-text").text("当期已产生利息");
                    } else if (topDom.Product.producttype == 3) {
                        $("#interest-text").text("已产生利息");
                    }
                    $("#interest").html($.fmoney(topDom.Product.haveinterest));
                    if (topDom.Product.interestcouponid > 0) {
                        $(".interest_info").show();
                    }
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyProductTransfer.prototype.pemaltyAndDealAmount = function() {
            var transferamount = Number($("#transferamount").val());
            if (transferamount > 0) {
                var penalty = transferamount * 0.002 + "";
                if (penalty <= 10) {
                    penalty = 10;
                } else if (penalty >= 300) {
                    penalty = 300;
                } else {
                    var num = penalty.indexOf('.') + "";
                    if (num == -1) {
                        penalty = Number(penalty).toFixed(2);
                    } else {
                        penalty = penalty.substring(0, penalty.indexOf('.') + 3);
                    }
                }
                var dealamount = transferamount - penalty;
                $("#penalty").html($.fmoney(penalty));
                $("#dealamount").html($.fmoney(dealamount));
            } else {
                $("#penalty").html("0.00");
                $("#dealamount").html("0.00");
            }
        };
        MyProductTransfer.prototype.checkTransferAmount = function() {
            if ($("#checkbox").find("img").css("display") == "block") {
                var topDom_1 = this;
                if ($.isNull($("#transferamount").val())) {
                    $.alertF("请输入转让金额");
                    return;
                }
                var transferamount = Number($("#transferamount").val());
                if (transferamount <= topDom_1.Product.maxtransferamount &&
                    transferamount >= topDom_1.Product.mintransferamount) {
                    $.PaymentHtmlNew(null, "", function(password) {
                        $.closePWD();
                        topDom_1.checkPayPassword(password, transferamount);
                    }, "", null, null, "", null);
                } else if (transferamount < topDom_1.Product.mintransferamount) {
                    topDom_1.checkmintransferamount(transferamount);
                } else {
                    topDom_1.checkmaxtransferamount(transferamount);
                }
            } else {
                return;
            }
        };
        MyProductTransfer.prototype.checkPayPassword = function(password, transferamount) {
            var topDom = this;
            var url = "/StoreServices.svc/user/checkpaymentpwd";
            var data = {
                "paymentpwd": password
            };
            $.AkmiiAjaxPost(url, data, false).then(function(data) {
                if (data.result) {
                    topDom.productTransfer(transferamount);
                } else if (data.errorcode == "20018") {
                    $.alertNew(data.errormsg, null, function() {
                        $.PaymentHtmlNew(null, "", function(password) {
                            $.closePWD();
                            topDom.checkPayPassword(password, transferamount);
                        }, "", null, null, "", null);
                    });
                } else if (data.errorcode == "20019") {
                    $.confirmF(data.errormsg, null, "去重置", function() {
                        $(".reset").click();
                    }, function() {
                        window.location.href = "/html/my/resetpassword.html";
                    });
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyProductTransfer.prototype.checkmintransferamount = function(transferamount) {
            if (transferamount < this.Product.mintransferamount) {
                $("#pricetip").show().html("*请输入" + $.fmoney(this.Product.mintransferamount) + "-" + $.fmoney(this.Product.maxtransferamount) + "的价格");
                return;
            } else if (transferamount >= this.Product.mintransferamount && transferamount <= this.Product.maxtransferamount) {
                $("#pricetip").hide();
            }
        };
        MyProductTransfer.prototype.checkmaxtransferamount = function(transferamount) {
            if (transferamount > this.Product.maxtransferamount) {
                $("#pricetip").show().html("*请输入" + $.fmoney(this.Product.mintransferamount) + "-" + $.fmoney(this.Product.maxtransferamount) + "的价格");
                return;
            } else {
                $("#pricetip").hide();
            }
        };
        MyProductTransfer.prototype.productTransfer = function(transferamount) {
            var topDom = this;
            var data = {
                productbidid: this.ProductBidID,
                transferamount: transferamount
            };
            Product.productTransfer(data, function(data) {
                if (data.result) {
                    window.location.replace("/html/paycenter/operation-success.html?type=producttransfer&title=" + topDom.Product.title + "&transferamount=" + transferamount);
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyProductTransfer.prototype.formatActityRate = function(actityrate) {
            if (actityrate > 0) {
                return "+" + $.fmoney(actityrate) + "%";
            } else {
                return "";
            }
        };
        return MyProductTransfer;
    }());
    var myProductTransfer = new MyProductTransfer();
});