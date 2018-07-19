$(function () {
    var Balance = (function () {
        var product;
        var account;
        var accountResult;
        var proportion;
        var lineChartData;
        var labels = [];
        var data_pro = [];
        var data_millionProceeds = [];
        var loginCookie = $.getCookie("MadisonToken");
        var maxpronumber;
        var minpronumber;
        var maxmillionproceeds;
        var minmillionproceeds;
        var _interval;

        function Balance() {
            var self = this;
            //切换曲线图
            $(".chart-title li").click(function () {
                var target = $(this).data("chart");
                $("#" + target + "-cont").removeClass("abs-hide").siblings().addClass("abs-hide");
                self.LoadChar(target);
            });
            //初始化投资按钮跳转链接
            $("#btn-invest").click(function () {
                //产品详情页，购买前检查
                if (!$.CheckAccountBeforeBuy(account)) {
                    return;
                }
                if ($(this).data("href") != "") {
                    window.location.href = $(this).data("href");
                }
            });
            //赎回按钮
            $(".redeem").click(function () {
                window.location.href = "/html/paycenter/user-demand-redeem.html";
            });

            if (loginCookie) {
                $(".product-rule").hide();
                $(".logged").show();
                this.GetUserInfo();
            } else {
                $(".nolog").show();
                $("#navbar").hide();
                $("#btn-login-out").removeClass("hide").show().click(function () {
                    history.pushState({}, null, '');
                    $.Loginlink();
                    return;
                });
                $(".on-line").hide();
                $(".off-line").removeClass("hide");
                //自动转入至尊宝
                $("#mainBody").on("click", ".automatic", function () {
                    history.pushState({}, null, '');
                    $.Loginlink();
                    return;
                });
                this.GetCurrentProduct();
            }
            this.GetRecom();
            var detailname = $.getQueryStringByName("detailname");
            !!detailname && $.UpdateTitle(decodeURIComponent(detailname));
            //var Notice1 = new Notice(); 李怀刚需求，去掉至尊宝的公告
        }
        Balance.prototype.GetUserInfo = function () {
            var self = this;
            var url = "/StoreServices.svc/user/info?t=" + new Date().getTime();
            $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                if (data.result) {
                    account = data.accountinfo;
                    accountResult = data;
                    var demandbalance = account.demandbalance + account.freezeamount; //至尊宝在投金额
                    var demandyesterdayprofit = account.demandyesterdayprofit; //至尊宝昨日收益
                    var demandprofitcount = account.demandprofitcount; //累计收益

                    var ha = [];
                    ha.push('<div class="line1">');
                    ha.push('      <p>投资金额(元)</p>');
                    ha.push('      <p class="info-num col-highlight-1">' + $.fmoney(demandbalance) + '</p>');
                    ha.push('  </div>');
                    ha.push('  <div class="line4">');
                    ha.push('      <ul>');
                    ha.push('          <li class="br">');
                    ha.push('              <p>昨日收益(元)</p>');
                    ha.push('              <p class="col-highlight-2">' + $.fmoney(demandyesterdayprofit) + '</p>');
                    ha.push('          </li>');
                    ha.push('          <li>');
                    ha.push('              <p>累计收益(元)</p>');
                    ha.push('              <p class="col-highlight-2">' + $.fmoney(demandprofitcount) + '</p>');
                    ha.push('          </li>');
                    ha.push('      </ul>');
                    ha.push('  </div>');
                    $(".info-head.logged").html(ha.join(''));

                    $(".line1 .info-num").text($.fmoney(demandbalance)).unbind("click").click(function () {
                        window.location.href = "/html/product/demand-bill.html";
                    });
                    $(".line4").unbind("click").click(function () {
                        window.location.href = "/html/product/demand-bill.html?type=5";
                    });
                    //资金自动转入至尊宝,也可以读取本页面的热门推荐接口里面的，是否开通字段
                    if (account.autoswitchdemand) {
                        $("#product-recom").after($(".automatic").find(".item1 p").html("已开通").end().click(
                            function () {
                                window.location.href = "/html/Product/automatic-on.html";
                            }
                        ));
                    } else {
                        $(".automatic").find(".item1 p").html("未开通").end().click(
                            function () {
                                self.Checkiswithholdauthoity("/html/Product/automatic.html", null);
                            }
                        );
                    }
                    if (account.demandbalance == 0) {
                        $(".redeem").unbind("click").addClass("btn-noclick");
                    }
                }
                self.GetCurrentProduct();
            });
        }

        /**获取推荐产品 */
        Balance.prototype.GetRecom = function () {
            var self = this;
            var url = "/StoreServices.svc/product/recommandproductinfo"; //"/StoreServices.svc/product/hotproductinfo";
            $.AkmiiAjaxPost(url, {
                "type": 2
            }, true).then(function (data) {
                if (data.result) {
                    var autoswitchdemand = data.autoswitchdemand;
                    var productrecommandlist = data.productrecommandlist;
                    var rewardsinfo = data.rewardsinfo;
                    var rewardsinfocolor = data.rewardsinfocolor;
                    if (rewardsinfo) {
                        $("#automatic-text").append('<i style="color:' + rewardsinfocolor + ';border: 1px solid ' + rewardsinfocolor + ';">' + rewardsinfo + '</i>');
                    }
                    if (productrecommandlist.length == 0) {
                        return;
                    }
                    var rateArr, rateStr, commentcolor = "",
                        remarkcolor = "",
                        tagcolor = "";
                    var ha = [];
                    ha.push('<h2>更高收益</h2>');
                    $.each(productrecommandlist, function (index, item) {
                        rateArr = item.rate.split(/[~,]/);
                        if (item.commentcolor) {
                            commentcolor = 'style="color:' + item.commentcolor + ';"'
                        }
                        if (item.remarkcolor) {
                            remarkcolor = 'style="color:' + item.remarkcolor + ';"'
                        } else {
                            remarkcolor = 'style="color:#ff4949;"'
                        }
                        if (item.tagcolor) {
                            tagcolor = 'style="color:' + item.tagcolor + ';"'
                        }
                        if (rateArr.length === 1) {
                            rateStr = rateArr[0] + "<i>%</i>";
                        } else {
                            rateStr = rateArr[0] + "<i>%</i>~" + rateArr[1] + "<i>%</i>";
                        }
                        ha.push('<div class="line bb" data-type=' + item.type + ' data-pid="' + item.productid + '">');
                        ha.push('    <div class="col col1">');
                        ha.push('        <h3>' + rateStr + '</h3>');
                        ha.push('        <p ' + tagcolor + '>' + item.tag + '</p>');
                        ha.push('    </div>');
                        ha.push('    <div class="col col2 item' + (item.remark && item.comment ? 2 : 1) + '">');
                        if (item.comment) {
                            ha.push('    <p ' + commentcolor + '>' + item.comment + '</p>');
                        }
                        if (item.remark) {
                            ha.push('    <p ' + remarkcolor + '>' + item.remark + '</p>');
                        }
                        ha.push('    </div>');
                        ha.push('</div>');
                    });
                    $("#product-recom").show().html(ha.join(''));
                }
            })
        }

        Balance.prototype.GetCurrentProduct = function () {
            var self = this;
            var url = "/StoreServices.svc/product/item";
            $.AkmiiAjaxPost(url, {
                "withlinechart": true
            }, true).then(function (data) {
                if (data.result) {
                    maxpronumber = data.proportion.maxpronumber;
                    minpronumber = data.proportion.minpronumber;
                    maxmillionproceeds = data.proportion.maxmillionproceeds;
                    minmillionproceeds = data.proportion.minmillionproceeds;
                    product = data.productinfo;
                    proportion = data.proportion;
                    //七日年化
                    $("#char-avgpronumber,#info-rate-value").html($.fmoney(proportion.avgpronumber));
                    $("#char-avgmillionproceeds,#info-profit-value").html($.fmoney(proportion.lastmillionproceeds, 4));
                    if (labels.length <= 0) {
                        self.LoadChar("chart1");
                    };
                    if (accountResult && accountResult.result) {
                        if (product.status < 5) {
                            self.initAppoint(product);
                        } else if (product.status < 6) {
                            self.initSelling(product);
                        } else {
                            self.initSold(product);
                        }
                    }
                };
            });
        }
        //初始化预约
        Balance.prototype.initAppoint = function (product) {
            var self = this;
            $(".navbar").addClass("hide");
            $("#btn-remind-redeem").removeClass("hide");
            if (product.isappointment) {
                $("#btn-remind").text("已提醒").unbind("click").addClass("btn-noclick");
            } else {
                $("#btn-remind").text("开售提醒").unbind("click").bind("click", function () {
                    self.appoint(self)
                });
            }
        };

        //预约事件
        Balance.prototype.appoint = function (self) {
            var data = {
                productid: product.productid
            };
            var url = "/StoreServices.svc/product/appoint";
            $.AkmiiAjaxPost(url, data).then(function (data) {
                if (data.result) {
                    $.alertF("开售提醒成功，我们将会在产品开售前通过短信通知您，敬请留意！");
                    product.isappointment = true;
                    $("#btn-remind").text("已提醒").unbind("click").addClass("btn-noclick");
                } else if (data.errorcode == "missing_parameter_accountid") {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg, null, function () {
                        self.GetCurrentProduct()
                    });
                }
            });
        };

        //初始化在售
        Balance.prototype.initSelling = function (product) {
            var self = this;
            $(".navbar").addClass("hide");
            clearInterval(_interval);
            if (product.countdownsecond > 0) {
                self.coundDownTimer();
                _interval = setInterval(function () {
                    self.coundDownTimer()
                }, 1000);
            } else {
                $("#btn-invert-redeem").removeClass("hide");
                $("#btn-invest").data("href", "/html/product/productbuy.html").text("投资").removeClass("btn-noclick");
            }
        };
        //即将开售倒计时
        Balance.prototype.coundDownTimer = function () {
            var self = this;
            product.countdownsecond = product.countdownsecond - 1;
            var second = product.countdownsecond % 60;
            var minutes = parseInt(product.countdownsecond / 60);
            if (minutes <= 0 && second <= 0) {
                clearInterval(_interval);
                self.initSelling(product);
                return;
            }
            $("#btn-invert-redeem").removeClass("hide");
            $("#btn-invest").data("href", "").text("即将开售").addClass("btn-noclick");
        };

        //初始化售罄
        Balance.prototype.initSold = function (product) {
            $(".navbar").addClass("hide");
            $("#btn-sold-redeem").removeClass("hide");
        };

        /**加载折线图 */
        Balance.prototype.LoadChar = function (chart) {
            if (!(labels & data_pro & data_millionProceeds & labels.length > 0 & data_pro.length > 0 & data_millionProceeds.length > 0)) {
                labels = [];
                data_pro = [];
                data_millionProceeds = [];
                $.each(proportion.proportionlist, function (index, item) {
                    labels.push(item.ProTime);
                    data_pro.push(item.ProNumber);
                    data_millionProceeds.push(item.MillionProceeds);
                });
            }
            lineChartData = {
                labels: labels,
                datasets: [{
                    fillColor: "rgba(255,223,209,1)",
                    strokeColor: "rgba(255,255,255,1)",
                    data: chart == "chart1" ? data_pro : data_millionProceeds,
                }]
            };

            var ctx = document.getElementById(chart).getContext("2d");
            if (chart == "chart1") {
                new Chart(ctx).Line(lineChartData, {
                    responsive: true,
                    scaleShowHorizontalLines: false,
                    scaleShowVerticalLines: false,
                    scaleOverride: true,
                    scaleSteps: 5,
                    scaleStepWidth: ((maxpronumber - minpronumber) / 5).toFixed(2),
                    scaleStartValue: minpronumber
                    //scaleBeginAtZero:true
                });
            } else {
                new Chart(ctx).Line(lineChartData, {
                    responsive: true,
                    scaleLabel: "<%=value%>",
                    scaleShowHorizontalLines: false,
                    scaleShowVerticalLines: false,
                    scaleOverride: true,
                    scaleSteps: 5,
                    scaleStepWidth: ((maxmillionproceeds - minmillionproceeds) / 5).toFixed(4),
                    scaleStartValue: minmillionproceeds
                    //scaleBeginAtZero: true
                });
            }
        }

        //检查新浪设置
        Balance.prototype.Checkiswithholdauthoity = function (url, withcallback) {
            if (account.customstatus < 2) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                return;
            }
            if (account.customstatus < 3) {
                $.confirmF("您尚未绑卡，请绑定银行卡。", "", "", null, function () {
                    window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                });
                return false;
            }
            //直连模式
            if (account.iswithholdauthoity == 0) //未设置新浪支付密码
            {
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
                $.SetSinaPayPassword(returnurl, accountResult.date, account.referralcode, account.iscashdesknewuser);
            } else if (account.iswithholdauthoity == 1) //未设置委托代扣
            {
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
                $.WithholdAuthority(returnurl, withcallback, account.referralcode, true);
            } else {
                window.location.href = url;
            }
        }
        return Balance;
    }());
    var balance = new Balance();

    /**导航点击 */
    $.fn.navSwitch = function (switcth) {
        var $pageNvaP = $(this).parent().find("p"),
            translatex, linkage;
        return this.each(function () {
            $(this).bind("click", function () {
                translatex = $(this).data("translatex");
                linkage = $(this).data("linkage");
                $pageNvaP.css("transform", "translateX(" + translatex + "rem)");
                $(this).siblings().removeClass("active").end().addClass("active");
                if (switcth) {
                    //联动的元素
                    $(linkage).show().siblings(".content").hide();
                    //导航吸附到最顶部
                    $("html,body").animate({
                        scrollTop: ($("#product-intro-warp").offset().top)
                    }, 100);
                }
            })
        });
    }
    $(".chart-title .page-nav li").navSwitch(false);
    $(".product-intro .page-nav li").navSwitch(true);
    $("#product-recom").on("click", ".line", function () {
        var type = $(this).data("type");
        var pid = $(this).data("pid");
        switch (~~type) {
            case 2:
                window.location.href = "/html/product/index-demand.html";
                break;
            case 4:
            case 99:
                window.location.href = "/html/product/productfixeddetail.html?id=" + pid;
                break;
            case 6:
                //侨金所
                //------------
                //先不加首次点击侨金所产品的弹框
                // if ($.getLS("pfaxstatus")) {
                //     $.showQfax(7);
                // } else {
                //     $(".mask").show();
                //     $(".q_fax").addClass("q_scale");
                //     $(".q_content").load("/html/product/contract/qfax_introduce.html");
                //     $("body").addClass("no_scroll");
                //     $.setLS("pfaxstatus", "true");
                // }
                // //侨金所弹窗的按钮：知道了，去看看
                // $(".JS_qbtn").click(function () {
                //     $("body").removeClass("no_scroll");
                //     $(".mask").hide();
                //     $(".q_fax").removeClass("q_scale");
                //     $(".q_fax").detach(); //移除弹窗代码
                //     $.showQfax(7);
                // });
                //------------
                pid && $.showQfax(7, '{"productCode":"' + pid + '"}');
                !pid && $.showQfax(7);
                break;
            case 10:
                pid && $.jumpGJSFax('GJSTZ', 7, '{"productCode":"' + pid + '"}');
                !pid && $.jumpGJSFax('GJSTZ', 7);
                break;
            case 96:
                window.location.href = "/html/product/incremental-productdetail.html?id=" + pid + "&productname=季季僧";
                break;
            case 97:
                window.location.href = "/html/product/incremental-productdetail.html?id=" + pid + "&productname=月月僧";
                break;
            case 98:
                window.location.href = "/html/product/incremental-productdetail.html?id=" + pid + "&productname=周周僧";
                break;
            case 100:
                //马上贷
                pid && $.p2p_url(2, '{"productCode":"' + pid + '"}');
                !pid && $.p2p_url(1);
                break;
        }
    });
    $(".pull-refresh").click(function () {
        //Safari 3.1 到 6.0 代码
        $(".pull-refresh svg")[0].addEventListener("webkitTransitionEnd", myFunction);
        // 标准语法
        $(".pull-refresh svg")[0].addEventListener("transitionend", myFunction);

        function myFunction() {
            $(".pull-refresh,.paddbottom").hide();
            $("#product-intro-warp,.wel_btm_com").show();
            $("#product-intro-tab,#product-intro-warp .content").addClass("scroll");
            $("html,body").animate({
                scrollTop: $("#product-intro-warp").offset().top
            }, 400);
        }
        $(".pull-refresh svg").attr("class", "active");
    });

    //页面三个tab滚动时固定在顶部
    var $warp = $("#product-intro-warp");
    var $scroll = $("#product-intro-tab,#product-intro-warp .content");
    var $window = $(window);
    $window.scroll(function () {
        var scrollTop = $window.scrollTop(); //滚动高度
        if (scrollTop - $warp.offset().top > 0) {
            $scroll.addClass("scroll");
        } else {
            $scroll.removeClass("scroll");
        }
    });
});