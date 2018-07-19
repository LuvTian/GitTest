"use strict";
var Product = {};
var User = {};
var isLock = false;
(function (Product) {
    function getProductItem(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/item";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    Product.getProductItem = getProductItem;
})(Product);
User.getUserInfo = function (request, success, needLoder, error, complete) {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, request, !needLoder).then(success);
}
var ProductFixedDetailPage = (function () {
    function ProductFixedDetailPage() {
        this.ProductId = $.getQueryStringByName("id");
        this.saleType = 0;
        this.GetCurrentProduct();
        this.pageInIt();
    }
    ProductFixedDetailPage.prototype.pageInIt = function () {
        $(".mask").click(function () {
            $(".mtk2").hide();
            $(".mask").hide();
        });
        $(window).bind("scroll", this.fixedTabTop);
        $(".pro_tab").on("click", function () {
            var cur = $(this).index();
            $(".pro_tablist").data("index", cur);
            $(".pro_tab").removeClass("cur").eq(cur).addClass("cur");
            $(".pro_tabview").hide();
            $(".pro_tabview").css({
                paddingTop: "0"
            }).eq(cur).show();
            // isLock = true;
            // $("html,body").animate({
            //     scrollTop: $(".pro_tabview").eq(cur).offset().top
            // }, 600, function () {
            //     isLock = false;
            //     // $(".pro_tabview").eq(cur).css({
            //     //     paddingTop:0
            //     // });
            // });
        });
        $(".btm_arrow").on("click", function () {
            $(this).find(".img_arrow").addClass("clicked");
            setTimeout(function () {
                $(".pro_info").show();
                $(".btm_arrow").hide();
                $("html,body").animate({
                    scrollTop: $(".pro_info").offset().top
                }, 600, function () {

                });
            }, 400);
        });
    };
    ProductFixedDetailPage.prototype.fixedTabTop = function () {
        var $itemlist = $(".pro_tablist");
        var $prodlist = $(".pro_tabview");
        var cur = $(".pro_tablist").data("index");//$(".pro_tablist li").eq(0).data("index");
        // if (isLock) return;
        if ($(window).scrollTop() > $(".pro_info").offset().top) {
            $itemlist.css({
                position: 'fixed',
                // boxShadow: 'rgb(237, 237, 237) 0px 2px 5px',
                top: 0
            });
            //if (!isLock) {
            $prodlist.eq(cur).css({
                paddingTop: $itemlist.height()
            })
            //}
        } else {
            $itemlist.css({
                'position': 'static'
            });
            $prodlist.eq(cur).css({
                paddingTop: "0"
            })
        }
    };
    ProductFixedDetailPage.prototype.GetCurrentProduct = function () {
        var topDom = this;
        Product.getProductItem({
            productid: topDom.ProductId
        }, function (data) {
            if (data.result) {
                var product_2 = data.productinfo;
                var activity_1 = data.activity;
                topDom.saleType = data.saletype;
                $("#producttransferlink").click(function () {
                    window.location.href = "/html/product/transferinfo.html?transferlockday=" + product_2.transferlockday + "&ruletype=" + product_2.ruletype + "&remainingnottransferdays=" + product_2.remainingnottransferdays;
                });
                if (product_2.matchmode == 2) {
                    $("#icontext").html("交易所");
                }
                $("#iconclick").attr("href", "/Html/Product/contract/regular-product-safedetail.html?matchmode=" + product_2.matchmode + "&id=" + product_2.productid + "&assetrecordid=" + product_2.assetrecordid + "&publisher=" + product_2.publisher);
                $("#product-rate").text($.fmoney(product_2.rate));
                if (product_2.rateactivite > 0) {
                    $("#product-rate-rateactivite").text(topDom.formatActityRate(product_2.rateactivite)).show();
                }
                $("#product-duration").text(product_2.duration + "天");
                $("#product-bidcount").text(product_2.bidcount + "人");
                $("#product-bidcount").click(function () {
                    window.location.href = "/html/product/productbidlist.html?id=" + product_2.productid;
                });
                $("#product-profitstartday").text(product_2.profitstartday);
                $("#product-profitendday").text(product_2.endprofittime);
                $("#product-typetext").html(product_2.typetext);
                if ((product_2.paytype & 2) == 2 && (product_2.paytype & 1) != 1 && (product_2.paytype & 4) != 4) {
                    $("#product-buy").attr("href", "/html/product/productfixedbuy.html?id=" + product_2.productid).find("#product-buy-link").html("立即抢购(仅支持至尊宝购买)");
                } else if ((product_2.paytype & 1) == 1 || (product_2.paytype & 4) == 4) {
                    $("#product-buy").attr("href", "/html/product/productfixedbuy.html?id=" + product_2.productid).find("#product-buy-link").html("立即抢购");
                    $("#product-buy").find("#product-countdown-timer-amount").text("剩余金额" + $.fmoney(product_2.remainingamount));
                }
                $("#product-transferlockday").html(product_2.transferlockdaydescription + '<img src="/css/img2.0/question_icon.png">');
                // if (product_2.cantransfer) {
                //     if (product_2.transferlockday > 0) {
                //         $("#product-transferlockday").html("转让锁定期" + product_2.transferlockday + "天后可转" + '<img src="/css/img2.0/question_icon.png">');
                //     } else {
                //         $("#product-transferlockday").html("起息后即可转让" + '<img src="/css/img2.0/question_icon.png">');
                //     }
                // } else {
                //     $("#product-transferlockday").html("不可转让" + '<img src="/css/img2.0/question_icon.png">');
                // }
                $("#product-risklevel").html(product_2.riskleveldesc.split('|')[2] + "<i>" + product_2.riskleveltext + "</i>");
                $.UpdateTitle(product_2.title);
                $("#product-detail").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=0&lockduration=" + product_2.lockduration);

                $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=1");
                $("#product-active").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=2");
                $("#arepayplan").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=3");
                $(".calculator").click(function () {
                    window.location.href = "/html/product/calculator.html?id=" + product_2.productid;
                    return false;
                });
                topDom.initSelling(product_2);
                if (product_2.status == 6 || product_2.status == 8) {
                    topDom.initSold(product_2);
                }
                if (product_2.status != 6 && data.activity && data.activity.title) {
                    $("#product-activity").show().click(function () {
                        window.location.href = activity_1.link;
                    }).find("#product-activity-title").text(activity_1.description);
                }
            } else {
                $.alertF(data.errormsg, null, history.back());
            }
        });
        setTimeout(function () {
            topDom.GetCurrentProduct();
        }, 30000);
    };
    ProductFixedDetailPage.prototype.initSelling = function (product) {
        var topDom = this;
        clearInterval(topDom.Interval);
        if (product.countdownsecond > 0) {
            topDom.coundDownTimer(product);
            topDom.Interval = setInterval(function () {
                topDom.coundDownTimer(product);
            }, 1000);
        } else {
            if (product.type == 99 && !product.newuser) {
                $(".buying").css("background-color", "gray");
                $("#product-buy").attr("href", "javascript:void(0);");
            } else {
                User.getUserInfo({}, function (data) {
                    var accountResult = data;
                    var account = data.accountinfo;
                    topDom.share(account.referralcode, product);
                    topDom.Account = data.accountinfo;
                    $("#product-buy").click(function () {
                        if (product.type == 99 && product.newuser) {
                            window.location.href = "/html/product/productfixedbuy.html?id=" + product.productid;
                        }
                        $.alertF(account.isnewusermsg, "立即投资", function () {
                            window.location.href = "/Html/Product/productfixedlist.html";
                        });
                    });
                    if (accountResult && accountResult.ismaintenance) {
                        $("#product-buy").attr("href", "/html/system/data-processing.html");
                    }
                    if (accountResult && accountResult.isglobalmaintenance) {
                        $("#product-buy").attr("href", "/html/system/system-maintenance.html");
                    }
                });
            }
        }
        $("#product-purchaseprogress").text(product.purchaseprogress + "%");
        $("#product-process").width(product.purchaseprogress + "%");
        $("#product-publish").show();
        $("#product-publish-date").text(product.publishjsondate);
        $(".buying").hide();
        if (topDom.saleType == 19 || topDom.isTangfens()) {
            $("#product-buy").hide();
            return;
        }
        $("#product-buy").show();
    };;
    ProductFixedDetailPage.prototype.initSold = function (product) {
        var topDom = this;
        User.getUserInfo({}, function (data) {
            var accountResult = data;
            var account = data.accountinfo;
            topDom.share(account.referralcode, product);
            topDom.Account = data.accountinfo;
        });
        if (product.zzbreadyon) {
            $("#product-soldout").html("预约满");
        } else {
            if (product.status == 8) {
                $("#product-soldout").html(product.statusname.replace(/\|/g, ''));
            }
        }
        $(".buying").hide();
        $("#product-soldout").show();
    };;
    ProductFixedDetailPage.prototype.coundDownTimer = function (product) {
        var topDom = this;
        product.countdownsecond = product.countdownsecond - 1;
        var second = product.countdownsecond % 60;
        var minutes = product.countdownsecond / 60;
        //topDom.initSelling(product);
        if (minutes <= 0 && second <= 0) {
            clearInterval(topDom.Interval);
            topDom.GetCurrentProduct();
            return;
        }
        $("#product-countdown-timer-amount").text(topDom.checkTime(minutes) + ":" + topDom.checkTime(second) + " 后开售");
        $("#product-status-count").text(product.appointment);
        $("#product-status-text").text("提醒记录");
        $(".product-status-text-parent").click(function () {
            window.location.href = "/html/product/productappointlist.html?id=" + product.productid;
        });
        $("#product-buy-link").text("即将开售");
        $("#product-buy").attr("href", "javascript:void(0);");
    };;
    ProductFixedDetailPage.prototype.checkTime = function (i) {
        i = parseInt(i);
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };;
    // 是否是唐粉活动进来的
    ProductFixedDetailPage.prototype.isTangfens = function () {
        if ($.getQueryStringByName('type') == 'tangfens') {
            return true;
        }
        return false;
    };
    ProductFixedDetailPage.prototype.formatActityRate = function (actityrate) {
        if (actityrate > 0) {
            return "+" + $.fmoney(actityrate) + "%";
        } else {
            return "";
        }
    };
    ProductFixedDetailPage.prototype.share = function (referralcode, product) {
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
    ProductFixedDetailPage.prototype.Success = function () {
        $(".mtk2").hide();
        $(".mask").hide();
    };
    return ProductFixedDetailPage;
}());

var ProductFixedDetail = new ProductFixedDetailPage();
var Notice1 = new Notice();