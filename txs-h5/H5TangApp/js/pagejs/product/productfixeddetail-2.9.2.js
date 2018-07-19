"use strict";
var Product = {};
var User = {};
var isLock = false;

var distY = 0;        // 滑动的距离
var _pageY = 0;     // 手势按下的时候
var lstpageY = 0;
var upLock = false,    // 向上滑动是否锁住
    downLock = true,  // 向下滑动是否锁住
    count = 0;
var $good = null;
var moveDist = 60;
var isstart = false;
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

var Invit = {
    threshold: 10, // 阈值
    // 判断是否滑到了底部
    isScrBottom: function () {
        var isbtm = false;
        var offsetY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        var winHeight = window.innerHeight || document.body.clientHeight;
        var scrHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        // var transY = Math.abs(Math.floor($("#mainBody").css("-webkit-transform").replace(/[A-Za-z\(\)]/g, "")[5])) || 0;
        // console.log(scrHeight - winHeight, offsetY);
        var factor = Math.abs(scrHeight - winHeight - offsetY);
        // console.log(factor);
        // if (scrHeight - winHeight === offsetY) {
        if (factor >= 0 && factor <= 15) {
            isbtm = true;
        }
        return isbtm;
    },
    init: function () {
        var isSupport = "ontouchstart" in document ? true : false;
        // console.log(Invit.isScrBottom());
        document.getElementById("mainBody").addEventListener(isSupport ? "touchstart" : "mousedown", function (e) {
            // console.log(e);
            // return;
            _pageY = e.pageY || e.touches[0].pageY;
            lstpageY = _pageY;
            isstart = true;
        }, false);
        document.getElementById("mainBody").addEventListener(isSupport ? "touchmove" : "mousemove", function (e) {
            //e.preventDefault();
            // console.log(Invit.isScrBottom());
            //console.log(e);
            if (!isSupport) {
                if (!isstart) return;
            }
            lstpageY = e.pageY || e.touches[0].pageY;
            // console.log(lstpageY-_pageY);
            if (Invit.isScrBottom() && lstpageY - _pageY < -Invit.threshold) {
                // console.log(Invit.isScrBottom());
                if ($(".pro_info").css("display") == "block") {
                    return;
                }
                $(".btm_arrow").find(".img_arrow").addClass("clicked");
                Invit.setMainTransform(e, lstpageY);
            }
            // 如果已经加载了更多信息
            // 做向上滑动
            if (upLock) {
                // console.log(100);
                // 滚动条在滚动少于1px时就可以做滑动了
                if (!((window.pageYOffset || window.scrollY) > 1) && lstpageY - _pageY > Invit.threshold) {
                    Invit.setMainTransform(e, lstpageY);
                }
            }
        }, false);
        document.getElementById("mainBody").addEventListener(isSupport ? "touchend" : "mouseup", function (e) {
            //console.log(e);
            var _dist = lstpageY - _pageY;
            var isup = _dist < 0 ? true : false;
            var lastdist = Math.abs(lstpageY - _pageY);
            isstart = false;
            if (upLock) {// 如果底部更多显示了
                if (!isup) { // 手是否是向下滑动的，如果是
                    // 滚动的部分必须是小于10况且向下滑动，开始和结束的手势的坐标距离必须是60以上
                    // console.log(window.pageYOffset || window.scrollY);
                    if ((window.pageYOffset || window.scrollY) < Invit.threshold) {
                        // alert(100);
                        if (lastdist <= 5 && lastdist >= 0) {
                            // console.log(909090);
                            return;
                        }
                        Invit.setElemCss(0);
                        $(".global_tablist").hide();
                        $(".inner_tablist").show();
                        $(".pro_tabview").css({
                            paddingTop: "0"
                        })
                        setTimeout(function () {
                            Invit.showmore(false);
                            $(".btm_arrow span").text("上滑查看详情");
                            $(".wel_btm_com").hide();
                            upLock = false;
                        }, 1024);
                    } else {
                        // console.log(Invit.isScrBottom());
                        // console.log(90);
                        Invit.setElemCss($(".pro_ul").height());
                        $(".btm_arrow").find(".img_arrow").removeClass("clicked");
                        $(".btm_arrow span").text("上滑查看详情");
                    }
                }
            }
            else {
                if (!Invit.isScrBottom()) {
                    // console.log(9220);
                    $(".btm_arrow").find(".img_arrow").removeClass("clicked");
                    $(".btm_arrow span").text("上滑查看详情");
                    Invit.setdefTransform();
                    $(".wel_btm_com").hide();
                    return;
                }
                // console.log(lastdist, moveDist)
                if (lastdist >= moveDist) { //显示更多内容
                    // $good.css({
                    //     "transition": "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
                    //     "transform": "translateY(-{0}px) translateZ(0)".replace("{0}", $good.height())
                    // });
                    if (isup && !upLock) {
                        Invit.setElemCss($(".pro_ul").height());
                        Invit.showmore(true);
                        $(".wel_btm_com").show();
                    }
                } else {
                    if (!upLock) { // 如果info这个更多信息没有显示，说明滑动没有效果
                        $(".btm_arrow").find(".img_arrow").removeClass("clicked");
                        Invit.setdefTransform();
                        Invit.showmore(false);
                        // console.log(79790);
                        $(".wel_btm_com").hide();
                    }
                    //$(".btm_arrow span").text("继续拖动，查看详情");
                }
            }
        }, false);
    },
    setMainTransform: function (e, pageY) {
        e.preventDefault();
        var dist = Math.abs(pageY - _pageY);
        // $good.css({
        //     "transition": "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
        //     "transform": "translateY(-{0}px) translateZ(0)".replace("{0}", 200 / window.innerHeight * dist)
        // });
        var transfLen = 200 / window.innerHeight * dist;
        // console.log(transfLen);
        var _height = $(".pro_ul").height();
        if (upLock) {
            transfLen = _height - transfLen;
            // console.log(transfLen);
        }
        Invit.setElemCss(transfLen);
        if (dist >= moveDist) {
            if (!upLock) {
                // $(".btm_arrow").find(".img_arrow").removeClass("clicked");
                $(".btm_arrow").find(".img_arrow").addClass("clicked");
                $(".btm_arrow span").text("上滑查看详情");
            } else {
                $(".btm_arrow").find(".img_arrow").removeClass("clicked");
                $(".btm_arrow span").text("下滑查看详情");
                $(".global_tablist").hide();
                $(".inner_tablist").show();
                $(".pro_tabview").css({
                    paddingTop: "0"
                })
            }
        }
    },
    setdefTransform: function () {
        // $good.css({
        //     "transition": "none",
        //     "transform": "translateY(0px)"
        // });
        Invit.setElemCss(0, "none");
    },
    setElemCss: function (transf, trans) {
        $good.css({
            "transition": trans || "transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
            "transform": "translateY(-{0}px) translateZ(0)".replace("{0}", transf),
            "-webkit-transition": trans || "-webkit-transform 1s cubic-bezier(0, 0, 0.25, 1) 0ms",
            "-webkit-transform": "translateY(-{0}px) translateZ(0)".replace("{0}", transf)
        });
    },
    showmore: function (isshow) {
        var _height = $(".pro_ul").height();
        // var _height = $(".pro_info").offset().top;
        if (isshow) {
            //$('<div class="info"></div>').appendTo($good);
            $(".pro_info").show();
            $good.css("marginBottom", -_height);
            upLock = true; // 表示向上拖动之后，成功添加了更多信息
            setTimeout(function () {
                window.scrollTo(0, 0);
            }, 10);
            // window.scrollTo(0, 0)
        } else {
            //$good.find(".info").remove();
            $(".pro_info").hide();
            $good.css("marginBottom", 0);
            this.setdefTransform();
        }
    }
}
var ProductFixedDetailPage = (function () {
    function ProductFixedDetailPage() {
        this.ProductId = $.getQueryStringByName("id");
        this.saleType = 0;
        this.GetCurrentProduct();
        this.pageInIt();
    }
    ProductFixedDetailPage.prototype.pageInIt = function () {
        $good = $("#mainBody");
        Invit.init();
        $(".mask").click(function () {
            $(".mtk2").hide();
            $(".mask").hide();
        });
        //$.alertF(90);
        // $.alertNew("yui","90","89","rr");
        // $.confirmNew("至尊宝账户余额不足", "null", "（至尊宝账户还需转入）", "我知道了", "前往至尊宝", null, function() {
        //     window.location.href = "/html/product/productbuy.html";
        // });
        $(window).bind("scroll", this.fixedTabTop);
        $(".pro_tab").on("click", function () {
            var cur = $(this).index();
            var bf_index = $(".pro_tablist").data("bfindex") || 0;
            $(".pro_tablist").data("index", cur);
            $(".pro_tablist").data("bfindex", cur);
            $(".pro_tab").removeClass("cur").eq(cur).addClass("cur");
            // $(".btm_line").addClass("p");
            var posp = ["p0", "p1", "p2", "p3"];
            $(".btm_line").removeClass(posp[bf_index]).addClass(posp[cur]);
            // for (var i = 0, j = posp.length; i < j; i++) {
            //     if ($(".btm_line").hasClass(posp[i])) {
            //         $(".btm_line").removeClass(posp[i]).addClass(posp[cur]);
            //         break;
            //     }
            // }
            $(".pro_tabview").hide();
            $(".pro_tabview").css({
                paddingTop: $(".global_tablist").css("display") == "block" ? $(".pro_tablist").height() : "0"
            }).eq(cur).show();
            // isLock = true;
            // $("html,body").animate({
            //     scrollTop: $(".pro_info").offset().top
            // }, 600, function () { });
        });
        // $(".btm_arrow").on("click", function() {
        //     $(this).find(".img_arrow").addClass("clicked");
        //     setTimeout(function() {
        //         $(".pro_info").show();
        //         $(".btm_arrow").hide();
        //         $("html,body").animate({
        //             scrollTop: $(".pro_info").offset().top
        //         }, 600, function() {
        //             $(".wel_btm_com").show();
        //         });
        //     }, 400);
        // });
    };
    ProductFixedDetailPage.prototype.fixedTabTop = function () {
        var $itemlist = $(".pro_tablist");
        var $globallist = $(".global_tablist");
        var $innerlist = $(".inner_tablist");
        var $prodlist = $(".pro_tabview");
        var cur = $(".pro_tablist").data("index"); //$(".pro_tablist li").eq(0).data("index");
        // if (isLock) return;
        if ($(window).scrollTop() > $(".pro_info").offset().top) {
            $innerlist.hide();
            $globallist.show().css({
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
            $innerlist.show();
            $globallist.hide()
            $itemlist.css({
                'position': 'relative'
            });
            $prodlist.eq(cur).css({
                paddingTop: "0"
            })
        }
    };
    ProductFixedDetailPage.prototype.GetCurrentProduct = function () {
        var topDom = this;
        var isjump = false;
        var iszzb = false;
        Product.getProductItem({
            productid: topDom.ProductId
        }, function (data) {
            if (data.result) {
                var product_2 = data.productinfo;
                var activity_1 = data.activity;
                topDom.saleType = data.saletype;
                if (activity_1.description != "" && activity_1.description != null) {
                    $("#description").html(activity_1.description).show(); //惊喜单
                    $("#description").click(function () {
                        window.location.href = activity_1.link;
                    })
                }
                if (product_2.isreservation) {
                    //预约
                    $("#ready").show();
                    $(".product-dealtime").html(product_2.dealtime);
                } else {
                    $("#noready").show();
                }
                $("#product-transferlockday").html(product_2.transferlockdaydescription);
                if (product_2.cantransfer) {
                    $("#transpty").html("转让条件");
                    $("#product-transferlockday").html(product_2.transferlockdaydescription);
                    $("#producttransferlink").click(function () {
                        $.alertNew("转让条件：项目成立后存在转让锁定期{0}天，在产生收益2天后且剩余期限大于{1}天该产品方可转让。<br />转让手续费：转让金额*{2}%，{3}元起，不高于{4}元。".replace("{0}", product_2.transferlockday)
                            .replace("{1}", product_2.remainingnottransferdays)
                            .replace("{2}", product_2.penaltyrate)
                            .replace("{3}", $.fmoneytextV2(product_2.minpenalty) || "0")
                            .replace("{4}", $.fmoneytextV2(product_2.maxpenalty) || "0"),
                            "确认",
                            function () { }, "转让说明", '', true);
                        // $("#open-house").show();
                        // $(".mask").show();
                        //window.location.href = "/html/product/transferinfo.html?transferlockday=" + product_2.transferlockday + "&ruletype=" + product_2.ruletype + "&remainingnottransferdays=" + product_2.remainingnottransferdays;
                    });
                } else {
                    $("#producttransferlink").addClass("incon_hide");
                    $(".tran_tip").hide();
                    $("#transpty").html("是否可转");
                    $("#product-transferlockday").html("否");
                }
                $("#closeOpenHouse").click(function () {
                    $("#open-house").hide();
                    $(".mask").hide();
                });
                if (product_2.matchmode == 2) {
                    $("#icontext").html("交易所");
                }
                $("#iconclick").attr("href", "/html/product/contract/regular-product-safedetail.html?matchmode=" + product_2.matchmode + "&id=" + product_2.productid + "&assetrecordid=" + product_2.assetrecordid + "&publisher=" + product_2.publisher);
                $("#product-rate").text($.fmoney(product_2.rate));
                if (product_2.rateactivite > 0) {
                    $("#product-rate-rateactivite").text(topDom.formatActityRate(product_2.rateactivite)).show();
                }
                $("#product-duration").text(product_2.duration);
                $("#product-bidcount").text(product_2.bidcount);
                $("#product_startmoney").text($.fmoney(product_2.amountmin));
                $("#product-bidcount").click(function () {
                    window.location.href = "/html/product/productbidlist.html?id=" + product_2.productid;
                });
                $(".product-profitstartday").text(product_2.profitstartday);
                $(".product-rebackday").text(product_2.repaytime);

                if (product_2.type == 2) {
                    $(".midtext").text("付息");
                    $(".product-profitendday").text("每30天");
                    $("#product-typetext").click(function () {
                        window.location.href = "/html/product/investmentexamples.html?id=" + product_2.productid;
                    });
                } else {
                    $(".product-profitendday").text(product_2.endprofittime);
                    $("#product-typetext").find(".i_right").hide();
                }
                $("#purchaseprogress").html("已投" + product_2.purchaseprogress + "%");
                $("#product-typetext").find("z").html(product_2.typetext);
                $("#product-countdown-timer-amount").find("z").text($.fmoney(product_2.remainingamount));
                // if (product_2.status < 5 && product_2.paytype != 2) {
                //     //
                //     topDom.initAppoint(product_2);
                // } else if (product_2.paytype == 2 && product_2.zzbisready && !product_2.zzbreadyon) {
                //     //
                //     topDom.initZZBReadyProduct(product_2);
                // } else if (product_2.status < 6 && !product_2.zzbreadyon) {
                //     //
                // } else if (product_2.status == 6 || product_2.zzbreadyon) {
                //     //
                // }
                // if ((product_2.paytype & 2) == 2 && (product_2.paytype & 1) != 1 && (product_2.paytype & 4) != 4) {
                //     $("#incommen").html("已预约人数");
                //     // $("#product-buy").attr("href", "/html/product/productfixedbuy-new.html?id=" + product_2.productid).find(".product_buy").html("立即投资(仅支持至尊宝购买)");
                //     $("#product-buy").attr("href", "/html/product/productfixedbuy-new.html?id=" + product_2.productid).find(".product_buy").html("至尊宝预约");
                // } else if ((product_2.paytype & 1) == 1 || (product_2.paytype & 4) == 4) {
                //     $("#product-buy").attr("href", "/html/product/productfixedbuy-new.html?id=" + product_2.productid).find(".product_buy").html("立即投资");
                // }

                // if (product_2.cantransfer) {
                //     if (product_2.transferlockday > 0) {
                //         $("#product-transferlockday").html("转让锁定期" + product_2.transferlockday + "天后可转" + '<img src="/css/img2.0/question_icon.png">');
                //     } else {
                //         $("#product-transferlockday").html("起息后即可转让" + '<img src="/css/img2.0/question_icon.png">');
                //     }
                // } else {
                //     $("#product-transferlockday").html("不可转让" + '<img src="/css/img2.0/question_icon.png">');
                // }
                // $("#product-risklevel").html(product_2.riskleveldesc.split('|')[2] + "<i>" + product_2.riskleveltext + "</i>");
                // $.UpdateTitle(product_2.title);
                // $("#product-detail").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=0&lockduration=" + product_2.lockduration);

                // $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=1");
                // $("#product-active").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=2");
                // $("#arepayplan").attr("href", "/html/product/regular-product-detail.html?id=" + product_2.productid + "&tab=3");
                // $(".calculator").click(function () {
                //     window.location.href = "/html/product/calculator.html?id=" + product_2.productid;
                //     return false;
                // });
                // topDom.initSelling(product_2);
                // if (product_2.status == 6 || product_2.status == 8) {
                //     topDom.initSold(product_2);
                // }
                // if (product_2.status != 6 && data.activity && data.activity.title) {
                //     $("#product-activity").show().click(function() {
                //         window.location.href = activity_1.link;
                //     }).find("#product-activity-title").text(activity_1.description);
                // }
                var bidurl = "/html/product/productbidlist.html?id=" + product_2.productid;
                if (product_2.paytype == 2) {
                    if (product_2.zzbisready || product_2.zzbreadyon) {
                        $("#incommen").html("已预约");
                        bidurl = "/html/product/productReadylist.html?id=" + product_2.productid;
                    } else {
                        $("#incommen").html("已投资");
                    }
                } else {
                    if ((product_2.status == 5 && product_2.countdownsecond <= 0) || product_2.status == 6 || product_2.status == 8) {
                        $("#incommen").html("已投资");
                    } else {
                        $("#incommen").html("已提醒");
                    }
                }
                $("#product-bidcount").click(function () {
                    window.location.href = bidurl;
                });
                if ((product_2.paytype & 2) == 2 && (product_2.paytype & 1) != 1 && (product_2.paytype & 4) != 4) {
                    if (product_2.zzbisready && !product_2.zzbreadyon) {
                        $("#product-buy").find(".product_buy").html("至尊宝预约");
                        isjump = true;
                        iszzb = true;
                    } else if (product_2.zzbreadyon) {
                        $("#product-soldout").find(".product_buy").html("预约满");
                    } else if (!product_2.zzbisready && product_2.status == 5) {
                        $("#product-buy").find(".product_buy").html("立即投资(仅支持至尊宝购买)");
                        isjump = true;
                        iszzb = true;
                    } else if (product_2.status == 6) {
                        $("#product-soldout").find(".product_buy").html("已售罄");
                        // $(".buying").css("background-color", "gray");
                    } else if (product_2.status == 8) {
                        $("#product-soldout").find(".product_buy").html(product_2.statusname.replace(/\|/g, ''));
                        // $(".buying").css("background-color", "gray");
                    }
                } else {

                    if (product_2.status <= 4) {
                        if (product_2.isappointment) {
                            $("#product-soldout").find(".product_buy").html("已提醒");
                            // $(".buying").css("background-color", "gray");
                        } else {
                            $("#product-buy").find(".product_buy").html("开售提醒");
                            isjump = true;
                        }
                    } else if (product_2.status == 6) {
                        $("#product-soldout").find(".product_buy").html("已售罄");
                        // $(".buying").css("background-color", "gray");
                    } else if (product_2.status == 8) {
                        $("#product-soldout").find(".product_buy").html(product_2.statusname.replace(/\|/g, ''));
                        //$("#product-soldout").show();
                        //$(".buying").css("background-color", "gray");
                    } else if (product_2.status == 5) {
                        if (product_2.countdownsecond > 0) {
                            // $("#product-soldout").find(".product_buy").html("即将开售");
                            topDom.coundDownTimer(product_2);
                            topDom.Interval = setInterval(function () {
                                topDom.coundDownTimer(product_2);
                            }, 1000);
                            // $(".buying").css("background-color", "gray");
                        } else {
                            isjump = true;
                            // if (product.type == 99 && !product.newuser) {
                            //     $(".buying").css("background-color", "gray");
                            //    $("#product-buy").attr("href", "");
                            //     //isjump = false;
                            // } else {
                            User.getUserInfo({}, function (data) {
                                var accountResult = data;
                                var account = data.accountinfo;
                                topDom.share(account.referralcode, product_2);
                                topDom.Account = data.accountinfo;
                                $("#product-buy").click(function () {
                                    if (product_2.type == 99 && product_2.newuser) {
                                        window.location.href = "/html/product/productfixedbuy.html?id=" + product_2.productid;
                                    }
                                    $.alertF(account.isnewusermsg, "立即投资", function () {
                                        window.location.href = "/html/product/productfixedlist.html";
                                    });
                                });
                                if (accountResult && accountResult.ismaintenance) {
                                    $("#product-buy").attr("href", "/html/system/data-processing.html");
                                }
                                if (accountResult && accountResult.isglobalmaintenance) {
                                    $("#product-buy").attr("href", "/html/system/system-maintenance.html");
                                }
                            });
                            // }
                            if (product_2.isreservation) {
                                $("#product-buy").show().find(".product_buy").html("预约投资");
                            } else {
                                $("#product-buy").show().find(".product_buy").html("立即投资");

                            }
                        }
                    }
                }
                if (isjump) {
                    // 新手
                    if (product_2.type == 99 && !product_2.newuser) {
                        $(".buying").css("background-color", "rgb(212, 212, 212)");
                        $("#product-buy").attr("href", "");
                    } else {
                        // if (iszzb) {
                        //     $("#product-buy").attr("href", "/html/product/product-ready-zzb.html?id=" + product_2.productid);
                        // } else {
                        $("#product-buy").attr("href", "/html/product/productfixedbuy-new.html?id=" + product_2.productid);
                        // }
                    }
                    $("#product-buy").show();
                } else {
                    $("#product-soldout").show();
                }
                // 如果是唐粉
                if (topDom.saleType == 19 || topDom.isTangfens()) {
                    $("#product-buy").hide();
                    $("#product-soldout").hide();
                }
                $("#product-buy").click(function () {
                    var href = $(this).attr("href");
                    if (!!href) {
                        window.location.href = $(this).attr("href");
                    }
                });
                // if (topDom.saleType == 19 || topDom.isTangfens()) {
                //     $("#product-buy").hide();
                // }
                $.UpdateTitle(product_2.title);
                topDom.getDetail(product_2);
                topDom.getIntroductionDetail(product_2.matchmode, product_2.assetrecordid, product_2.publisher);
            } else {
                $.alertF(data.errormsg, null, history.back());
            }
        });
        // setTimeout(function () {
        //     topDom.GetCurrentProduct();
        // }, 30000);
    };
    // ProductFixedDetailPage.prototype.initAppoint = function (product) {

    // };
    // ProductFixedDetailPage.prototype.initZZBReadyProduct = function (product) {

    // };
    // ProductFixedDetailPage.prototype.initSelling = function (product) {
    //     var topDom = this;
    //     clearInterval(topDom.Interval);
    //     if (product.countdownsecond > 0) {
    //         topDom.coundDownTimer(product);
    //         topDom.Interval = setInterval(function () {
    //             topDom.coundDownTimer(product);
    //         }, 1000);
    //     } else {
    //         if (product.type == 99 && !product.newuser) {
    //             $(".buying").css("background-color", "gray");
    //             $("#product-buy").attr("href", "");
    //         } else {
    //             User.getUserInfo({}, function (data) {
    //                 var accountResult = data;
    //                 var account = data.accountinfo;
    //                 topDom.share(account.referralcode, product);
    //                 topDom.Account = data.accountinfo;
    //                 $("#product-buy").click(function () {
    //                     if (product.type == 99 && product.newuser) {
    //                         window.location.href = "/html/product/productfixedbuy.html?id=" + product.productid;
    //                     }
    //                     $.alertF(account.isnewusermsg, "立即投资", function () {
    //                         window.location.href = "/html/product/productfixedlist.html";
    //                     });
    //                 });
    //                 if (accountResult && accountResult.ismaintenance) {
    //                     $("#product-buy").attr("href", "/html/system/data-processing.html");
    //                 }
    //                 if (accountResult && accountResult.isglobalmaintenance) {
    //                     $("#product-buy").attr("href", "/html/system/system-maintenance.html");
    //                 }
    //             });
    //         }
    //     }
    //     // $("#product-purchaseprogress").text(product.purchaseprogress + "%");
    //     // $("#product-process").width(product.purchaseprogress + "%");
    //     // $("#product-publish").show();
    //     // $("#product-publish-date").text(product.publishjsondate);
    //     $(".buying").hide();
    //     if (topDom.saleType == 19 || topDom.isTangfens()) {
    //         $("#product-buy").hide();
    //         return;
    //     }
    //     $("#product-buy").show();
    // };;
    // ProductFixedDetailPage.prototype.initSold = function (product) {
    //     var topDom = this;
    //     User.getUserInfo({}, function (data) {
    //         var accountResult = data;
    //         var account = data.accountinfo;
    //         topDom.share(account.referralcode, product);
    //         topDom.Account = data.accountinfo;
    //     });
    //     if (product.zzbreadyon) {
    //         $("#product-soldout").find(".product_buy").html("预约满");
    //     } else {
    //         if (product.status == 8) {
    //             $("#product-soldout").find(".product_buy").html(product.statusname.replace(/\|/g, ''));
    //         }
    //     }
    //     $(".buying").hide();
    //     $("#product-soldout").show();
    // };;
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
        // $("#product-countdown-timer-amount").text(topDom.checkTime(minutes) + ":" + topDom.checkTime(second) + " 后开售");
        $("#product-status-count").text(product.appointment);
        $("#product-status-text").text("提醒记录");
        $(".product-status-text-parent").click(function () {
            window.location.href = "/html/product/productappointlist.html?id=" + product.productid;
        });
        $("#product-buy").find(".product_buy").text("即将开售");
        $("#product-buy").attr("href", "");
    };
    // 产品详情tab
    ProductFixedDetailPage.prototype.getDetail = function (product) {
        var topDom = this;
        var url = "/StoreServices.svc/product/productdetail";
        var paramter = {
            productid: product.productid,
            bid: ""
        };
        $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
            if (data.result) {
                var detail = data.regularproductdetail;
                topDom.matchmode = detail.matchmode;
                topDom.isoldpro = detail.isoldproduct;
                // topDom.pageInit();
                // 定向委托协议做一些处理工作
                $("#productleavel").click(function () {
                    window.location.href = "/html/product/productfixedinfo.html";
                });
                $("#entrustxieyi").click(function () {
                    //var _saletype = topDom.saleType;
                    // if (topDom.isbid) {
                    //     // matchmode:是否是定向委托==1、非定向委托==0、承销结构==2
                    //     if (topDom.matchmode <= 1) {
                    //         window.location.href = "/html/product/contract/dingxiangweituoxieyi.html?bidid=" + topDom.Bidid;
                    //     } else {
                    //         window.location.href = "/html/product/contract/cxdingxiangweituoxieyi.html?bidid=" + topDom.Bidid;
                    //     }
                    // } else {
                    if (topDom.matchmode <= 1) {
                        window.location.href = "/html/product/contract/dingxiangweituoxieyi.html";
                    } else {
                        window.location.href = "/html/product/contract/cxdingxiangweituoxieyi.html";
                    }
                    // }
                });
                $("#productleavel").find(".s_text").html((detail.riskleveldesc || "").split('|')[2]); // + '（' + detail.riskleveltext + '）');
                $("#productleavel").find(".zm").html(detail.riskleveltext);

                if (!detail.cantransfer && detail.type != 99 && detail.type != 3) {
                    $("#redpenaltyhtml").show();
                    $("#redpenalty").show().html("手续费=投资本金*2%");
                }
                if (Number(detail.saletype) == 12 ||
                    Number(detail.saletype) == 1 || (detail.isentrust && !detail.cantransfer)) {
                    //$("#transferpenalty").show();
                    //$("#producttransferhtml").html("转让说明");
                    //$("#earlyredemptionfee").html("不可转让");
                    // $('#zr_218').show();
                    $("#enddate").show();
                } else if (detail.cantransfer) {
                    //$("#transferpenalty").show();
                    $("#earlyredemptionfee").html(detail.earlyredemptionfee);
                    $("#enddate").show();
                    //$("#penalty").show();
                    //$("#counterfee").html(detail.counterfee);
                } else {
                    //$("#penalty").show();
                    $("#redpenalty").show();
                    $("#redtime").show();
                }

                if (detail.cantransfer) {
                    $("#closedperiod").html("无");
                } else { //不能转让
                    $("#closedperiod").html(detail.closedperiod);
                    $("#transferpenalty").hide();
                    $("#enddate").hide();
                }
                $('#zr_218').show();
                //$("#investnumber").html(detail.totalallowinvestmentcount);
                $("#rate").html(detail.productrate + "%"); //期望年化收益率
                $("#investor_num").html(detail.totalallowinvestmentcount); //投资人数
                $("#rulesay").html(detail.expirepayrule); //到期回款规则
                $("#enddate_value").html(detail.transferarrivaltime); //转让到账时间
                $("#tax_calculation").html(detail.taxcalculation); //税费计算
                $("#risk_warn").html(detail.riskwarning); //风险提示
                // matchmode:是否是定向委托==1、非定向委托==0、承销结构==2
                if (detail.saletype != "98" || detail.saletype != "97" || detail.saletype != "96") { //周周僧
                    $("#rateitem").show(); //期望年化收益率
                }
                if (topDom.matchmode == 2) { //承销结构
                    $("#investor").show(); //投资人数
                }
                $("#counterfee").html(detail.counterfee);
                $("#dateofinterest").html(detail.dateofinterest || "次日起息");
                $("#fitcustomertype").html((detail.riskleveldesc || "").split('|')[1]);
                $("#projectduration").html(detail.projectduration || "60天");
                $("#raisetotal").html((detail.raisetotal / 10000) + "万");
                $("#recruitmentperiod").html(detail.recruitmentperiod);
                $("#repaymentmethod").html(detail.repaymentmethod);
                var startAmount = parseInt(detail.startamountnote);
                $("#startamountnote").html("起投金额" + startAmount + "元,以" + detail.step + "元倍数递增,最高可投资金额" + $.fmoneytextV2(detail.amountmax) + "元");
                if (!detail.cantransfer) {
                    //$("#productleavel").parent().hide();
                    //$("#fitcustomer").hide();
                    $("#product-right").hide();
                    //$("#dateofinterest").text("次日起息");
                    //$("#recruitmentperiod").parent().hide();
                    //$("#projectduration").text(detail.duration + "天");
                    $("#redeemday").text("2");
                    $("#transferpenalty").hide();
                    $("#enddate").hide();
                }
                topDom.later218Hand(detail);
                topDom.checkContent(topDom.isoldpro, topDom.matchmode, detail);
                // topDom.zzsHand(detail);
            } else if (data.errorcode == 'missing_parameter_accountid') {
                $.Loginlink();
            } else {
                $.alertF(data.errormsg);
            }
        });
    };
    // 218之后上线的产品处理
    ProductFixedDetailPage.prototype.later218Hand = function (item) {
        var topDom = this;
        // 如果是218之后的产品
        if (item.isentrust) {
            $('.old_218').hide();
            // 如果是可转让的
            if (item.cantransfer) {
                $('#zr_218').show();
                // 产品转让锁定期
                if (item.transferlockday == 0) {
                    $('#zr_218 .pro_it_right').html('购买当天可转让');
                } else if (item.transferlockday > 0) {
                    $('#zr_218 .pro_it_right').html('持有{0}天后可转让'.replace('{0}', item.transferlockday));
                }
            }
        }
    };
    ProductFixedDetailPage.prototype.checkContent = function (isoldpro, matchmode, detail) {
        var self = this;
        // 是否是老产品
        if (isoldpro || matchmode == 0) {
            $("#regamount").html("起投金额");
            $("#startamountnote").html(parseInt(detail.startamountnote) + "元/份，一份起投，投资金额为" + detail.step + "的整数倍");
            $(".old_218").show();
            $("#closedperiod").html(detail.closedperiod);
            $("#regrepaystyle").html("还款方式");
            $("#regreback").hide();
            $("#zr_218").hide();
            $("#producttransferhtml").html("提前赎回手续费");
            $("#enddate").find(".pro_it_left").html("赎回到账时间");
            $("#enddate").find(".pro_it_right").html("申请赎回后2个工作日内，具体以第三方支付公司到账时间为准");
        }
        // 非定向委托
        if (isoldpro) {
            $("#reglevel").hide();
            $("#regmuji").hide();
            $("#fitcustomer").hide();
        }
    };
    //项目介绍
    ProductFixedDetailPage.prototype.getIntroductionDetail = function (matchmode, assetrecordid, publisher) {
        var topDom = this;
        var url = "/StoreServices.svc/product/projectintroductiondetailinfo";
        var paramter = {
            productid: topDom.ProductId,
            assetrecordid: assetrecordid,
            publisher: publisher
        };
        $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
            if (data.result) {
                $(".init_class").removeClass("init_class"); //去掉数据没加载出来之前的样式
                var projectintrodetaillist = data.projectintrodetaillist;

                var conside = ''; //projectintrodetaillist[2]; // 受托方
                var coagency = []; //projectintrodetaillist[0]; // 合作机构
                var assetside = ''; //projectintrodetaillist[1]; // 标的资产
                var tractarr = null; // 交易
                var strhtml = "";
                var tpl = $("#itemtpl").html();
                var litpl = $("#litmtpl").html();
                if (!!projectintrodetaillist) {
                    $.each(projectintrodetaillist, function (index, item) {
                        if (item.type == 0) {
                            conside = item;
                        } else if (item.type == 2) {
                            assetside = item;
                        } else if (item.type == 1) {
                            coagency = item;
                        } else if (item.type == 3) {
                            tractarr = item;
                        }
                    });
                }
                if (conside) {
                    $.each(conside.projectdetailinfolist, function (i, item) {
                        // strhtml += tpl.replace("{0}", item.columnname || "")
                        //     .replace("{1}", item.columnvalue || "")
                        //     .replace("{3}", "");
                        strhtml += tpl.replace("{0}", item.columnname || "");
                        if (item.columntype == 1) {
                            strhtml = strhtml.replace("{3}", "").replace("{1}", item.columnvalue || "");
                        } else if (item.columntype == 2) { //只有name没有value值的展示         
                            strhtml = strhtml.replace("{3}", "padtop0").replace("{1}", "");
                        } else if (item.columntype == 3) { //只有简介值没有name列名展示（如标的简介内容）
                            strhtml = strhtml.replace("{3}", "padtop0").replace("{1}", item.columnvalue || "");
                        } else if (item.columntype == 4) {
                            strhtml = strhtml.replace("{1}", ('<a href="' + item.url + '">' + (item.columnvalue || "") + '</a>')).replace("{3}", "padtop0 pro_compy_item").replace("rp4", "not100");
                        } else if (item.columntype == 5) {
                            strhtml = strhtml.replace("{1}", ('<a href="' + item.url + '">' + (item.columnvalue || "") + '</a>')).replace("{3}", "padtop0 pro_more"); //.replace("{4}", '<div class="pro_more"><a href="' + item.url + '">' + item.columnvalue + '</a></div>');
                        }
                    });
                    $("#pro_tab3").html(strhtml);
                }
                if (coagency) {
                    var cArr = [];
                    strhtml = "";

                    if (!!tractarr) {
                        cArr = (coagency.projectdetailinfolist || []).concat(tractarr.projectdetailinfolist);
                    } else {
                        cArr = coagency.projectdetailinfolist || [];
                    }
                    // return;
                    $.each(cArr, function (i, item) {
                        // strhtml += tpl.replace("{0}", item.columnname || "")
                        //     .replace("{1}", item.columnvalue || "")
                        //     .replace("{3}", "");
                        strhtml += tpl.replace("{0}", item.columnname || "");
                        if (item.columntype == 1) {
                            strhtml = strhtml.replace("{3}", "").replace("{1}", item.columnvalue || "");
                        } else if (item.columntype == 2) { //只有name没有value值的展示         
                            strhtml = strhtml.replace("{3}", "padtop0").replace("{1}", "");
                        } else if (item.columntype == 3) { //只有简介值没有name列名展示（如标的简介内容）
                            strhtml = strhtml.replace("{3}", "padtop0").replace("{1}", item.columnvalue || "");
                        } else if (item.columntype == 4) {
                            strhtml = strhtml.replace("{1}", ('<a href="' + item.url + '">' + (item.columnvalue || "") + '</a>')).replace("{3}", "padtop0 pro_compy_item").replace("rp4", "not100");
                        } else if (item.columntype == 5) {
                            strhtml = strhtml.replace("{1}", ('<a href="' + item.url + '">' + (item.columnvalue || "") + '</a>')).replace("{3}", "padtop0 pro_more"); //.replace("{4}", '<div class="pro_more"><a href="' + item.url + '">' + item.columnvalue + '</a></div>');
                        }
                    });
                    $("#pro_tab2").html(strhtml);
                }
                if (assetside) {
                    strhtml = "";
                    $.each(assetside.projectdetailinfolist, function (i, item) {
                        strhtml += tpl.replace("{0}", item.columnname || "");
                        if (item.columntype == 1) {
                            strhtml = strhtml.replace("{3}", "").replace("{1}", item.columnvalue || "");
                        } else if (item.columntype == 2) { //只有name没有value值的展示         
                            strhtml = strhtml.replace("{3}", "padtop0").replace("{1}", "");
                        } else if (item.columntype == 3) { //只有简介值没有name列名展示（如标的简介内容）
                            strhtml = strhtml.replace("{3}", "padtop0").replace("{1}", item.columnvalue || "");
                        } else if (item.columntype == 4) {
                            strhtml = strhtml.replace("{1}", ('<a href="' + item.url + '">' + (item.columnvalue || "") + '</a>')).replace("{3}", "padtop0 pro_compy_item").replace("rp4", "not100");
                        } else if (item.columntype == 5) {
                            strhtml = strhtml.replace("{1}", ('<a href="' + item.url + '">' + (item.columnvalue || "") + '</a>')).replace("{3}", "padtop0 pro_more"); //.replace("{4}", '<div class="pro_more"><a href="' + item.url + '">' + item.columnvalue + '</a></div>');
                        }
                    });
                    $("#pro_tab1").html(strhtml);
                }
                // for (var i = 0; i < projectintrodetaillist.length; i++) {
                //     var client_arry = [];
                //     var title = 'title' + (i + 1);
                //     var titlename = projectintrodetaillist[i].titlename;
                //     var projectdetailinfolist = projectintrodetaillist[i].projectdetailinfolist;
                //     client_arry.push('<div class="intro_block"><div class="insurance-header title_change ' + title + '" id="aa">');
                //     client_arry.push('<span>' + titlename + '</span><i style="float:right;color:#979797;" ></i></div>');
                //     client_arry.push('<ul class="JS_list">');
                //     for (var j = 0; j < projectdetailinfolist.length; j++) {
                //         var type = projectdetailinfolist[j].columntype; //列类型（对应不同的展示样式）
                //         if (type == 1 && projectdetailinfolist[j].columnname != null) { //正常的name跟value值的展示
                //             var columnvalue = projectdetailinfolist[j].columnvalue || "";
                //             client_arry.push('<li><span class="title_key">' + projectdetailinfolist[j].columnname + '</span><span class="title_value"><span>' + columnvalue + '</span></span></li>');
                //         } else if (type == 3 && (projectdetailinfolist[j].columnvalue != null && projectdetailinfolist[j].columnvalue != "")) { //只有简介值没有name列名展示（如标的简介内容）
                //             client_arry.push('<li><span class="title_value intro_detail"><span>' + projectdetailinfolist[j].columnvalue + '</span></span></li>');
                //         } else if (type == 2 && projectdetailinfolist[j].columnname != null) { //只有name没有value值的展示
                //             client_arry.push('<li><span class="title_key">' + projectdetailinfolist[j].columnname + '</span><span class="title_value"></span></li>');
                //         } else if (type == 4) { //明细下面的公司或个人
                //             client_arry.push('<li class="detaile_list" ><a href="' + projectdetailinfolist[j].url + '"><span>' + projectdetailinfolist[j].columnvalue + '</span><span class="detaile_list_arrow"><i style="float:right;color:#979797;" class="up_arrow"></i></span></a></li>');
                //         } else if (type == 5) { //更多债权
                //             client_arry.push('<li class="detaile_list more_list"><a href="' + projectdetailinfolist[j].url + '">' + projectdetailinfolist[j].columnvalue + '</a></li>');
                //         }

                //     }
                //     client_arry.push('</ul></div>');
                //     var html = $(client_arry.join(''));
                //     $(".introduction").append(html);
                // }
            }
        });
    };
    ProductFixedDetailPage.prototype.checkTime = function (i) {
        i = parseInt(i);
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };
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