var Product = {};
var User = {};
var regularproductdetail = [];
(function(Product) {
    function getProductBidItem(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/bid";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    Product.getProductBidItem = getProductBidItem;
})(Product);
User.getUserInfo = function(request, success, needLoder, error, complete) {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, request, !needLoder).then(success);
}
var MyRegularEntrustDetailPage = (function() {
    function MyRegularEntrustDetailPage() {
        this.BidID = $.getQueryStringByName("id");
        this.assetrecordid = $.getQueryStringByName("assetrecordid");
        this.publisher = $.getQueryStringByName("publisher");
        this.pageInit();
        this.getUserInfo();
    }
    MyRegularEntrustDetailPage.prototype.pageInit = function() {
        $("#check_tips_question").click(function() {
            window.location.href = "/html/product/transferinfo.html";
        });
        $(".mask").click(function() {
            $(".mtk2").hide();
            $(".mask").hide();
        });
    };
    MyRegularEntrustDetailPage.prototype.getUserInfo = function() {
        var topDom = this;
        User.getUserInfo({}, function(data) {
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
                //     return ;
                // }
                topDom.getCurrentProductBid(account);
            } else if (data.errorcode == 'missing_parameter_accountid') {
                $.Loginlink();
            } else {
                $.alertF(data.errormsg);
            }
        });
    };
    MyRegularEntrustDetailPage.prototype.getCurrentProductBid = function(account) {
        var topDom = this;
        Product.getProductBidItem({
            productbidid: this.BidID
        }, function(data) {
            var product = data.productbid;
            regularproductdetail = data.regularproductdetail;
            $("#producttransferlink").click(function() {
                window.location.href = "/html/product/transferinfo.html?transferlockday=" + product.transferlockday + "&remainingnottransferdays=" + regularproductdetail.remainingnottransferdays + "&ruletype=" + regularproductdetail.ruletype;
            });
            if (product.matchmode == 2) {
                $("#icontext").html("交易所");
            }
            $("#iconclick").attr("href", "/Html/Product/contract/regular-product-safedetail.html?matchmode=" + product.matchmode + "&id=" + product.productid + "&assetrecordid=" + product.assetrecordid + "&publisher=" + product.publisher);
            topDom.share(account.referralcode, product);
            $.UpdateTitle(product.title);
            if (!product.isentrust) {
                window.location.replace("/html/my/my-regular-detail.html?id=" + product.id);
                return;
            }
            $('#product-rate').text($.fmoney(product.rate, 2));
            if (product.rateactivite > 0) {
                $("#product-rate-rateactivite").text(topDom.formatActityRate(product.rateactivite)).show();
            }
            $("#product-profitstartday").text(product.startdate);
            $("#product-profitendday").text(product.enddate);
            $("#product-duration").text(product.duration + "天");
            $("#product-bidcount").text(product.bidcount + "人");
            $("#product-bidcount").click(function() {
                window.location.href = "/html/product/productbidlist.html?id=" + product.productid;
            });
            $("#product-typetext").html(product.typetext);
            $("#product-transferlockday").html(product.transferlockdaydescription + '<img src="'+$.resurl()+'/css/img2.0/question_icon.png">');
            // if (product.transfer) {
            //     if (product.transferlockday > 0) {
            //         $("#product-transferlockday").html("转让锁定期" + product.transferlockday + "天后可转" + '<img src="/css/img2.0/question_icon.png">');
            //     } else {
            //         $("#product-transferlockday").html("起息后即可转让" + '<img src="/css/img2.0/question_icon.png">');
            //     }
            // } else {
            //     $("#product-transferlockday").html("不可转让" + '<img src="/css/img2.0/question_icon.png">');
            // }
            $("#product-risklevel").html(product.riskleveldesc.split('|')[2] + "<i>" + product.riskleveltext + "</i>");
            $("#product-detail").attr("href", "/html/product/regular-product-detail.html?id=" + product.productid + "&tab=0&isbid=true&interestcouponid=" + product.interestcouponid + "&bidid=" + product.id);

            $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-detail.html?id=" + product.productid + "&tab=1&isbid=true&interestcouponid=" + product.interestcouponid + "&bidid=" + product.id);
            $("#product-active").attr("href", "/html/product/regular-product-detail.html?id=" + product.productid + "&tab=2&isbid=true&interestcouponid=" + product.interestcouponid + "&bidid=" + product.id);
            $("#arepayplan").attr("href", "/html/product/regular-product-detail.html?id=" + product.productid + "&interestcouponid=" + product.interestcouponid + "&bidId=" + product.id + "&tab=3&isbid=true");
            $("#product-invited-detail").show();
            $("#investMoney").html($.fmoney(product.bidamount));
            if (product.status != 8 && product.status != 5 && product.status != 3 && product.status != 6) {
                $("#product-investMoney").attr("href", "/html/my/userloanbid.html?bid=" + topDom.BidID + "&productid=" + product.productid);
            }
            topDom.initTransferBtn(product, account);
            if (product.isoldproduct) {
                $(".check_tips").hide();
                return;
            }
            if (product.cantransfer) {
                $(".check_tips").show();
                return;
            }
            if (product.lockduration > 0 && !product.cantransfer && product.status != 8 && product.isentrust) {
                $(".check_tips").show();
            } else if (product.status == 8) {
                $(".check_tips").show();
            } else if (product.status != 6 && product.cantransfer) {
                $(".check_tips").show();
            } else {
                $(".check_tips").hide();
            }
        });
    };
    MyRegularEntrustDetailPage.prototype.initTransferBtn = function(product, account) {
        if (product.cantransfer) {
            $("#operBtn").text("转让").removeClass("timeDeposit_sh_btn1").addClass("timeDeposit_sh_btn").click(function() {
                if (regularproductdetail.ruletype == 1) {
                    window.location.href = ("/html/my/my-product-transfer.html?id=" + product.id);
                } else {
                    window.location.href = ("/html/my/my-product-transfer-new.html?id=" + product.id);
                }
            });
        } else if (product.status == 8) {
            $("#operBtn").text("已转让");
        } else if (product.status == 3 || product.status == 6 || product.status == 5) {
            $("#operBtn").text(product.statustext);
            //$("#investicon").hide();
        }
        //else {
        //    $("#investicon").hide();
        //}
    };
    MyRegularEntrustDetailPage.prototype.share = function(referralcode, product) {
        var topDom = this;
        var jsondata = {
            'link': window.location.origin + '/html/product/productfixeddetail.html?id=' + product.productid + '&c=' + referralcode,
            'title': '我发现唐小僧上的这款理财产品挺不错的，你也来看看吧',
            'desc': '' + product.title + ',期望年化收益+' + product.rate + '%,期限' + product.duration + '天',
            'imgUrl': 'http://www.txslicai.com/images/wechaticon.png',
        };
        $.getWechatconfig("InviteFriends", topDom.Success, topDom.Success, jsondata);
        var shareUrl = "https://s.txslicai.com/s.html?c=" + referralcode;
    };
    MyRegularEntrustDetailPage.prototype.Success = function() {
        $(".tipswrap").hide();
    };
    MyRegularEntrustDetailPage.prototype.formatActityRate = function(actityrate) {
        if (actityrate > 0) {
            return "+" + $.fmoney(actityrate) + "%";
        } else {
            return "";
        }
    };
    return MyRegularEntrustDetailPage;
}());
var myRegularEntrust = new MyRegularEntrustDetailPage();