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

        function Balance() {
            var self = this;
            //转入
            $("#btn-into").unbind("click").click(function (e) {
                window.location.href = "/Html/PayCenter/user-deposit.html";
                return false;
            });
            //转出
            $("#btn-out").unbind("click").click(function () {
                window.location.href = "/Html/PayCenter/user-withdraw.html";
                return false;
            });
            if (loginCookie) {
                this.GetUserInfo();
                // $(".nolog").hide();
                // $(".logged").show();
            } else {
                $("#btn-into-out").show();
                $("#btn-into,#btn-out").unbind("click").click(function (e) {
                    history.pushState({}, null, '');
                    $.Loginlink();
                    return false;
                });
            }
            this.GetRecom();
            var detailname = $.getQueryStringByName("detailname");
            !!detailname && $.UpdateTitle(decodeURIComponent(detailname));
        }
        Balance.prototype.GetUserInfo = function () {
            var self = this;
            var url = "/StoreServices.svc/user/info";
            $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                if (data.result) {
                    account = data.accountinfo;
                    accountResult = data;
                    var issignmoneyboxandhtffund = account.issignmoneyboxandhtffund; //是否签订存钱罐协议和汇添富基金协议
                    var monkyesterdayprofit = account.monkyesterdayprofit; //僧财宝昨日收益
                    var monkprofitcount = account.monkprofitcount; //僧财宝累计收益	
                    var basicbalance = account.basicbalance; //账户余额
                    $("#btn-into-out").show();
                    if ((monkprofitcount + basicbalance) > 0) {
                        $("#inverted").show();
                        $("#uninvert").hide();
                    } else {
                        $("#btn-out").hide();
                        $("#btn-into").addClass("column-10");
                    }
                    $("#acc-investing-amount").text($.fmoney(basicbalance));
                    $("#yesterday").text($.fmoney(monkyesterdayprofit));
                    $("#total").text($.fmoney(monkprofitcount));
                    //账单链接
                    $("#acc-investing-amount").click(function () {
                        window.location.href = "/html/product/account-b-bill.html";
                    });
                    //收益账单
                    $("#yesterday,#total").click(function () {
                        window.location.href = "/html/product/account-b-bill.html?type=7";
                    });
                    //七日年化
                    $(".js_rate").click(function () {
                        window.location.href = "/html/product/ac-profit-vs-rate.html?type=rate";
                    });
                    //万份收益                    
                    $(".js_ttprofit").click(function () {
                        window.location.href = "/html/product/ac-profit-vs-rate.html?type=ttprofit";
                    });
                    if (basicbalance <= 0) {
                        $("#btn-out").unbind("click").addClass("btn-noclick");
                    }
                }
            });
        }
        /**获取推荐产品 */
        Balance.prototype.GetRecom = function () {
            var self = this;
            var url = "/StoreServices.svc/product/recommandproductinfo"; //"/StoreServices.svc/product/hotproductinfo";
            $.AkmiiAjaxPost(url, {
                "type": 1
            }, true).then(function (data) {
                if (data.result) {
                    var autoswitchdemand = data.autoswitchdemand;
                    var productrecommandlist = data.productrecommandlist;
                    var avgmillionproceeds = data.avgmillionproceeds;
                    var avgpronumber = data.avgpronumber;
                    //七日年化,万份收益
                    $(".js_rate").html($.fmoney(avgpronumber));
                    $(".js_ttprofit").html($.fmoney(avgmillionproceeds, 4));
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
                        if (item.commentcolor) {
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
        return Balance;
    }());
    var balance = new Balance();
    /**导航点击 */
    $.fn.navSwitch = function () {
        var $pageNvaP = $(this).find("p"),
            translatex, linkage;
        return this.each(function () {
            $(this).find("li").click(function () {
                translatex = $(this).data("translatex");
                linkage = $(this).data("linkage");
                $pageNvaP.css("transform", "translateX(" + translatex + "rem)");
                $(this).siblings().removeClass("active").end().addClass("active");
                //联动的元素
                $(linkage).show().siblings(".content").hide();
                //导航吸附到最顶部
                $("html,body").animate({
                    scrollTop: ($("#product-intro-warp").offset().top)
                }, 100);
            })
        });
    }
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
                // //先不加首次点击侨金所产品的弹框
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
                pid && $.p2p_url(2, '{"productCode":"' + pid + '"}');
                !pid && $.p2p_url(1);
                //马上贷
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
            $("html,body").animate({
                scrollTop: $("#product-intro-warp").offset().top
            }, 500);
        }
        $(".pull-refresh svg").attr("class", "active");
    });
    $(".page-nav").navSwitch();

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