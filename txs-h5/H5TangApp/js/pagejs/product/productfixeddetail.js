"use strict";
var Product = {};
var User = {};
var isLock = false;
var riskModel = '';
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
        this.Account = {};
        this.ProductId = $.getQueryStringByName("id");
        this.couponid = $.getQueryStringByName("couponid") || "";
        this.saleType = 0;
        this.GetCurrentProduct();
        this.pageInIt();
    }
    ProductFixedDetailPage.prototype.pageInIt = function () {
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
                paddingTop: "0"
            }).eq(cur).show();
            // isLock = true;
            $("html,body").animate({
                scrollTop: $(".pro_info").offset().top
            }, 600, function () { });
        });
        $(".btm_arrow").on("click", function () {
            $(this).find(".img_arrow").addClass("clicked");
            setTimeout(function () {
                $(".pro_info").show();
                $(".wel_btm_com").show();
                $(".btm_arrow").hide();
                $("html,body").animate({
                    scrollTop: $(".pro_info").offset().top
                }, 600, function () {
                    $(".wel_btm_com").show();
                });
            }, 400);
        });
        $('.pro_info').on('click', '.tip', function () {
            $.alertF('根据借款人申报的借款人基本信息和项目基本信息，经我平台在授权和能力范围内通过第三方公开渠道对借款人涉诉情况和受到行政处罚并可能影响还款情况进行查询，本项目风险评估结果为<zz>' + riskModel + '</zz>投资本项目可能造成的后果为出借金额的本金和利息部分(全部)受到损失。');
        })
    };
    ProductFixedDetailPage.prototype.fixedTabTop = function () {
        var $itemlist = $(".pro_tablist");
        var $prodlist = $(".pro_tabview");
        var cur = $(".pro_tablist").data("index"); //$(".pro_tablist li").eq(0).data("index");
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
                'position': 'relative'
            });
            $prodlist.eq(cur).css({
                paddingTop: "0"
            })
        }
    };
    ProductFixedDetailPage.prototype.ProductHandle = function (product) {
        //p2p产品
        if (Number(product.matchmode) === 3 || Number(product.matchmode) === 4) {
            $('.unified-rate-text').html('借款年化利率');
            $('#collection_amount').html('借款金额');
            // $('#entrustxieyi').hide();
            // $(".pro_tablist").addClass('p2p_tab');
            $("#protocol_old").hide();
            $('.js_min_step').html('起借金额');
            $('.js_invert_term').html('出借期限');
            $('.js_invert_percent').html('项目撮合进度');
            $('.js_return_money').show().find('z').html(product.repaymentdirection);
            //p2p相关的tab
            $('.pro_tablist .pro_tab').eq(1).text('项目详情').end().eq(2).text('常见问题').end().eq(3).text('安全保障');
            //***p2p产品时间线***
            //隐藏其他时间线
            $('#noready,#ready').hide();
            $('#p2ptimeline').show();
            //投标开始日
            $('.product-invertstartday').html(product.investbiddate);
        }
        else {
            $("#protocol_new").hide();
            $('.unified-rate-text').html('历史年化收益率');
        }
    }
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

                var bidurl = "/html/product/productbidlist.html?id=" + product_2.productid;
                if (product_2.paytype == 2) {
                    if (product_2.zzbisready || product_2.zzbreadyon) {
                        $("#incommen").html("已预约");
                        bidurl = "/html/product/productReadylist.html?id=" + product_2.productid;
                    } else {
                        if (product_2.matchmode == 3 || product_2.matchmode == 4) {
                            $("#incommen").html("已出借");
                        } else {
                            $("#incommen").html("已投资");
                        }
                    }
                } else {
                    if ((product_2.status == 5 && product_2.countdownsecond <= 0) || product_2.status == 6 || product_2.status == 8) {
                        if (product_2.matchmode == 3 || product_2.matchmode == 4) {
                            $("#incommen").html("已出借");
                        } else {
                            $("#incommen").html("已投资");
                        }
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
                        if (product_2.matchmode == 3 || product_2.matchmode == 4) {
                            $("#product-buy").find(".product_buy").html("立即出借(仅支持至尊宝购买)");
                        }
                        else {
                            $("#product-buy").find(".product_buy").html("立即投资(仅支持至尊宝购买)");
                        }
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
                        isjump = true;
                        if (product_2.countdownsecond > 0) {
                            // $("#product-soldout").find(".product_buy").html("即将开售");
                            topDom.coundDownTimer(product_2);
                            topDom.Interval = setInterval(function () {
                                topDom.coundDownTimer(product_2);
                            }, 1000);
                        } else {
                            if (product_2.isreservation) {
                                $("#product-buy").show().find(".product_buy").html("预约投资");
                            } else {
                                if (product_2.matchmode == 3 || product_2.matchmode == 4) {
                                    $("#product-buy").show().find(".product_buy").html("立即出借");
                                } else {
                                    $("#product-buy").show().find(".product_buy").html("立即投资");
                                }
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
                        $("#product-buy").attr("href", "/html/product/productfixedbuy-new.html?id=" + product_2.productid + "&couponid=" + topDom.couponid);
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
                $.AkmiiAjaxPost("/StoreServices.svc/user/info", {}, false)
                    .done(function (data) {
                        if (data.result) {
                            var account = data.accountinfo;
                            topDom.share(account.referralcode, product_2);
                            topDom.Account = data.accountinfo;
                            if (topDom.Account && topDom.Account.ismaintenance) {
                                $("#product-buy").attr("href", "/html/system/data-processing.html");
                            }
                            if (topDom.Account && topDom.Account.isglobalmaintenance) {
                                $("#product-buy").attr("href", "/html/system/system-maintenance.html");
                            }
                        }
                    })
                    .always(function () {
                        $("#product-buy").click(function () {
                            if (!$.CheckToken()) {
                                $.Loginlink();
                                return;
                            }
                            //产品详情页，购买前检查
                            if (!$.CheckAccountBeforeBuy(topDom.Account)) {
                                return;
                            }
                            if (product_2.type == 99 && product_2.newuser) {
                                //ios采用productfixedbuy-new.html新样式
                                window.location.href = "/html/product/productfixedbuy-new.html?id=" + product_2.productid + "&couponid=" + topDom.couponid;
                                return;
                            }
                            if (topDom.Account.isnewusermsg) {
                                if (product_2.matchmode == 3 || product_2.matchmode == 4) {
                                    $.alertF(topDom.Account.isnewusermsg, "立即出借", function () {
                                        window.location.href = "/html/product/productfixedlist.html";
                                    });
                                } else {
                                    $.alertF(topDom.Account.isnewusermsg, "立即投资", function () {
                                        window.location.href = "/html/product/productfixedlist.html";
                                    });
                                }
                                return;
                            }
                            var href = $("#product-buy").attr("href");
                            if (!!href) {
                                window.location.href = $("#product-buy").attr("href");
                            }
                        });
                    });

                $.UpdateTitle(product_2.title);
                topDom.getDetail(product_2);
                //p2p产品单独借款获取“资产标的”
                if (product_2.matchmode === 3 || product_2.matchmode === 4) {
                    topDom.getP2PIntroductionDetail(product_2.productid);
                }
                else {
                    topDom.getIntroductionDetail(product_2.matchmode, product_2.assetrecordid, product_2.publisher);
                }
                topDom.ProductHandle(data.productinfo);
            } else {
                $.alertF(data.errormsg, null, history.back());
            }
        });
    };

    ProductFixedDetailPage.prototype.coundDownTimer = function (product) {
        var topDom = this;
        product.countdownsecond = product.countdownsecond - 1;
        var second = product.countdownsecond % 60;
        var minutes = product.countdownsecond / 60;
        //topDom.initSelling(product);
        if (minutes <= 0 && second <= 0) {
            $("#product-buy,#product-soldout").hide();
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
                var _startAmount = parseInt(detail.startamountnote);
                if (product && (product.matchmode === 3 || product.matchmode === 4)) {
                    //p2p类型，产品详情tab
                    var tpl0 = $("#itemtpl0").html();
                    var resultHtml = tpl0.format(
                        (detail.productrate || '0') + "%",//年化利率
                        detail.raisetotal ? (detail.raisetotal / 10000) + "万" : '',//产品规模
                        _startAmount + "元起投,以" + detail.step + "元倍数递增",//起投金额，投资倍数
                        detail.repaymentmethod || '',//回款方式
                        detail.dateofinterest || "",//起息日
                        product.repaytime || '',//回款日
                        (product.cantransfer ? product.transferlockdaydescription : '否')//是否可转
                    );
                    $('#pro_tab0').html(resultHtml);
                    return;
                }
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
                $("#rate").html(detail.productrate + "%"); //历史年化收益率
                $("#investor_num").html(detail.totalallowinvestmentcount); //投资人数
                $("#rulesay").html(detail.expirepayrule); //到期回款规则
                $("#enddate_value").html(detail.transferarrivaltime); //转让到账时间
                $("#tax_calculation").html(detail.taxcalculation); //税费计算
                $("#risk_warn").html(detail.riskwarning); //风险提示
                // matchmode:是否是定向委托==1、非定向委托==0、承销结构==2
                if (detail.saletype != "98" || detail.saletype != "97" || detail.saletype != "96") { //周周僧
                    $("#rateitem").show(); //历史年化收益率
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
    /**
     * p2p产品详情
     * @param {object} productid 
     */
    ProductFixedDetailPage.prototype.getP2PIntroductionDetail = function (productid) {
        var topDom = this;
        var url = "/StoreServices.svc/product/txsp2ploandetailinfo";
        var paramter = {
            productid: productid
        };
        $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
            if (data.result) {
                var _detail = data.detailinfo;
                if (_detail) {
                    var strhtml = "";
                    //安全保障tab
                    var tpl3 = $("#prod_safety").html();
                    $('#pro_tab3').html(tpl3);
                    //常见问题tab
                    var tpl2 = $("#common_qa").html();
                    $('#pro_tab2').html(tpl2);
                    //项目详情tab
                    var tpl1 = $("#itemtpl1").html();
                    var riskText = (_detail.riskleveldesc || '') + '-' + (_detail.risklevel || '');
                    riskModel = '“' + (_detail.riskleveldesc || '-') + '”，适合评级结果为' + (_detail.investleveldesc || '-') + '出借投资人。';
                    strhtml = tpl1.format(
                        _detail.borrower || '',//借款公司
                        $.fmoney(_detail.borroweramount || '0', 0),//借款金额
                        _detail.productname || '',//项目名称
                        _detail.projectintroduction || '',//项目简介
                        _detail.borrowerduration ? _detail.borrowerduration : '',//借款期限
                        _detail.borrowerusage || '',//借款用途
                        _detail.repaymentmethod || '',//还款方式
                        _detail.repaymentsource || '',//还款来源
                        (_detail.borrowerrate || '0') + "%",//年化借款利率
                        _detail.profitstartday || '',//起息日
                        _detail.raisingduration ? _detail.raisingduration : '',//募集期
                        riskText,//项目风险等级
                        _detail.relatedexpenses || ''//相关费用
                    );
                    $('#pro_tab1').html(strhtml);
                    //企业信息
                    $('.loan_company').click(function () {
                        window.location.href = '/html/product/product_company_detail.html?productid=' + productid;
                    });
                    //贷后情况
                    $('.after_invert').click(function () {
                        window.location.href = '/html/product/assetinfoafterloan.html?loanid=' + (_detail.loanid || '');
                    });
                }
            }
        })
        //
    }
    //项目介绍(标的资产，合作机构，受托方)
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