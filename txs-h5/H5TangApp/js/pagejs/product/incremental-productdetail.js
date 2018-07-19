/**
 * 灵活投产品，产品详情和购买详情
 * 周周僧
 * 月月僧
 * 季季僧
 */
$(function () {
    "use strict";
    var detailname = $.getQueryStringByName("detailname"); //产品周期类别
    var productbidid = $.getQueryStringByName("productbidid"); //持有产品id
    var productType = decodeURIComponent(detailname) || '';
    var productid = $.getQueryStringByName("id"); //产品id
    var Product = {};
    var User = {};
    var model;

    //开放转出日弹框
    $("#time-line").delegate("#tip", "click", function () {
        $("#open-house").show();
        $(".mask").show();
        $("html")[0].style.overflow = "hidden";
        $("body")[0].style.overflow = "hidden";
    });
    //关闭开放转出日弹框
    $("#open-house").delegate("#closeOpenHouse", "click", function () {
        $("#open-house").hide();
        $(".mask").hide();
        $("html")[0].style.overflow = "visible";
        $("body")[0].style.overflow = "visible";
    });

    if (productid) { //未购买详情页周周僧
        initialization();
        //购买前检查
        $("#product-buy").on("click",function() {
            var href = $("#product-buy").attr("href");
            if (!href.match(/^\/html/)) {
                return;
            }
            $.AkmiiAjaxPost("/StoreServices.svc/user/info", {}, false)
                .done(function (data) {
                    if (data.result) {
                        var account = data.accountinfo;
                        if (account.ismaintenance) {
                            window.location.href="/html/system/data-processing.html";
                            return;
                        }
                        if (account.isglobalmaintenance) {
                            window.location.href = "/html/system/system-maintenance.html";
                            return;                            
                        }
                        //产品详情页，购买前检查
                        if (!$.CheckAccountBeforeBuy(account)) {
                            return;
                        }
                        if (href) {
                            window.location.href = href;
                        }
                    }
                });
           return false; 
        });
    } else if (productbidid) {
        initialized(); //已购买详情页周周僧
    } else {
        $.alertF("参数错误");
    }
    //产品详情页未购买页面初始化
    function initialization() {
        $("#invest-detail").hide();
        var url = "/StoreServices.svc/product/ladderitem"; //老接口ladderlist
        var request = {
            productid: productid
        };
        $.AkmiiAjaxPost(url, request, false).then(function (data) {
            if (data.result) {
                var info = data.productinfo;
                model = factory(info.saletype);
                Product = {
                    isbid: false,
                    saletype: info.saletype,
                    lastperiods: info.ladderratelist.length > 0 ? info.ladderratelist[info.ladderratelist.length - 1].periods : 0,
                    productid: info.productid,
                    minrate: $.fmoney(info.minrate), //最低利率
                    maxrate: $.fmoney(info.maxrate), //最高利率
                    leastdays: info.leastdays, //最短投资期限
                    amountmin: info.amountmin, //起投金额
                    bidcount: info.bidcount, //已投资人数
                    amountmax: info.amountmax, //最大金额
                    endprofittime: info.endprofittime, //标的到期
                    profitstartday: info.profitstartday, //起息日
                    typetext: info.typetext, //回款方式文本
                    cantransfer: (info.cantransfer ? "是" : "否"), //是否可转让
                    finished: info.finished, //是否售罄
                    ladderfreewithdrawaltime: info.ladderfreewithdrawaltime, //每周x
                    laddersaleintroduce: info.laddersaleintroduce, //持有越久,收益越高(每周五可免费提现,次日到账)。
                    ladderwithdrawalrule: info.ladderwithdrawalrule, //7天开放提现一次,申请后次日到账
                    ladderendrule: info.ladderendrule, //到期偿还本息，次日到账
                    ladderratelist: info.ladderratelist, //柱状图列表
                    fmodel: model, //单位集合
                    opendaylist: data.opendateintroducelist, //开放日列表
                    opendateintroducehead: data.opendateintroducehead //开放日title
                }
                render("header", Product);
                render("bar", Product);
                render("rule", Product);
                render("time-line", Product);
                render("open-house", Product);
                var minrate = info.minrate; //最低利率
                var maxrate = info.maxrate; //最高利率
                var leastdays = info.leastdays; //最短投资期限
                var amountmin = info.amountmin; //起投金额
                var bidcount = info.bidcount; //已投资人数
                var amountmax = info.amountmax; //最大金额
                var endprofittime = info.endprofittime; //标的到期
                var profitstartday = info.profitstartday; //起息日
                var typetext = info.typetext; //回款方式文本
                var cantransfer = info.cantransfer; //是否可转让
                var finished = info.finished; //是否售罄
                var title = info.title; //
                $.UpdateTitle(title);

                $("#product-detail").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&tab=0&vtype=1&lockduration=" + info.lockduration);
                $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&tab=1&vtype=1");
                $("#product-active").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&tab=2&vtype=1");
                $("#arepayplan").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&tab=3&vtype=1");
                //点击人数跳转投资记录
                $(".amout-detail p").eq(2).click(function () {
                    window.location.href = "/html/product/productbidlist.html?id=" + info.productid;
                });
                //关于购买按钮，产品状态status //5在售 6售罄 8临时售罄 4预约--周周不用此状态
                if (info.paytype == 2 && info.zzbisready && !info.zzbreadyon) {
                    $("#product-buy-link").text("至尊宝预约");
                    $("#product-buy").attr("href", "/html/product/product-ready-zzb.html?id=" + info.productid); 
                } else if (info.countdown > 0 && info.countdownsecond > 0) { //未开售
                    $("#product-buy-link").text("即将开售");
                    $("#product-buy").removeClass('_toreduce_bg').attr("href", "javascript:void(0);");
                } else if (info.status == 5) { //可以购买
                    $("#product-buy").addClass('_toreduce_bg');
                    if ((info.paytype & 2) == 2 && (info.paytype & 1) != 1 && (info.paytype & 4) != 4) {
                        $("#product-buy").attr("href", "/html/product/productfixedbuy.html?id=" + info.productid + "&productType=incremental").find("#product-buy-link").html("立即投资(仅支持至尊宝购买)");
                    } else if ((info.paytype & 1) == 1 || (info.paytype & 4) == 4) {
                        $("#product-buy").attr("href", "/html/product/productfixedbuy.html?id=" + info.productid + "&productType=incremental").find("#product-buy-link").html("立即投资");
                        $("#product-buy").find("#product-countdown-timer-amount").text("剩余可投" + $.fmoney(info.remainingamount) + "元");
                    }
                } else if (info.status == 6) { //售罄
                    $("#product-buy-link").text("售  罄");
                    $("#product-buy").removeClass('_toreduce_bg').attr("href", "javascript:void(0);");
                } else if (info.status == 8) { //临时售罄
                    $("#product-buy-link").html("暂时满额<br/>还有机会");
                    $("#product-buy").removeClass('_toreduce_bg').attr("href", "javascript:void(0);");
                }
            } else {
                $.alertF(data.errormsg)
            }
        })
    }
    //产品详情页已经购买页面初始化
    function initialized() {
        var url = "/StoreServices.svc/user/productbidladderdetail";
        var request = {
            productbidid: productbidid,
        };
        $.AkmiiAjaxPost(url, request, false).then(function (data) {
            if (data.result) {
                var info = data.productbid;
                model = factory(info.saletype);
                $("#currentTotalAmont").html($.fmoney(info.rate) + "%");
                $(".sy_amout p").eq(0).html(data.leastdays + "天");
                $(".sy_amout p").eq(1).html(info.bidcount + "人");
                var typetext = info.typetext; //回款方式文本
                var cantransfer = info.cantransfer; //是否可转让
                var riskleveltext = info.riskleveltext; //风险品级
                var riskleveldesc = info.riskleveldesc; //风险品级描述
                var title = info.title;
                $.UpdateTitle(title);
                Product = {
                    isbid: true,
                    saletype: info.saletype,
                    productid: info.productid,
                    currentrate: $.fmoney(data.currentladderrate),
                    minrate: $.fmoney(data.minrate), //最低利率
                    maxrate: $.fmoney(data.maxrate), //最高利率
                    leastdays: data.leastdays, //最短投资期限
                    amountmin: data.amountmin, //起投金额
                    bidcount: info.bidcount, //已投资人数
                    amountmax: data.amountmax, //最大金额
                    endprofittime: info.enddate, //标的到期
                    profitstartday: info.startdate, //起息日
                    typetext: info.typetext, //回款方式文本
                    cantransfer: (info.cantransfer ? "是" : "否"), //是否可转让
                    finished: info.finished, //是否售罄
                    ladderfreewithdrawaltime: info.ladderfreewithdrawaltime, //每周x
                    laddersaleintroduce: "当前持有至第" + data.currentperiod + model.unit, //info.laddersaleintroduce,//当前持有第n周
                    ladderwithdrawalrule: info.ladderwithdrawalrule, //7天开放提现一次,申请后次日到账
                    ladderendrule: info.ladderendrule, //到期偿还本息，次日到账
                    currentperiod: data.currentperiod, //当前第x周
                    ladderratelist: data.ladderratelist, //柱状图列表
                    fmodel: model, //单位集合
                    opendaylist: data.opendateintroducelist, //开放日列表
                    opendateintroducehead: data.opendateintroducehead, //开放日title
                    lastperiods: data.ladderratelist.length > 0 ? data.ladderratelist[data.ladderratelist.length - 1].periods : 0
                }
                render("header", Product);
                render("bar", Product);
                render("rule", Product);
                render("time-line", Product);
                render("open-house", Product);
                $("#invest-amout").html($.fmoney(info.bidamount));
                $("#invest-detail").attr("href", "/html/my/userloanbid.html?bid=" + info.id + "&productid=" + info.productid);
                $("#riskleveltext").html(riskleveldesc + "<t>" + riskleveltext + "</t>");
                if (info.isoldproductintroduction == false) { //新产品
                    $("#product-detail").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&bidId=" + productbidid + "&isbid=true&vtype=1&tab=0&lockduration=" + info.lockduration);
                    $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&bidId=" + productbidid + "&tab=1&isbid=true&vtype=1");
                    $("#product-active").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&bidId=" + productbidid + "&tab=2&isbid=true&vtype=1");
                    $("#arepayplan").attr("href", "/html/product/regular-product-detail.html?id=" + info.productid + "&bidId=" + productbidid + "&tab=3&isbid=true&vtype=1");
                } else { //老产品
                    $("#product-detail").attr("href", "/html/product/regular-product-detail-old2.html?id=" + info.productid + "&bidId=" + productbidid + "&isbid=true&vtype=1&tab=0&lockduration=" + info.lockduration);
                    $("#product-xiangmuinfo").attr("href", "/html/product/regular-product-detail-old2.html?id=" + info.productid + "&bidId=" + productbidid + "&tab=1&isbid=true&vtype=1");
                    $("#product-active").attr("href", "/html/product/regular-product-detail-old2.html?id=" + info.productid + "&bidId=" + productbidid + "&tab=2&isbid=true&vtype=1");
                    $("#arepayplan").attr("href", "/html/product/regular-product-detail-old2.html?id=" + info.productid + "&bidId=" + productbidid + "&tab=3&isbid=true&vtype=1");
                }
                //关于底部按钮状态
                switch (info.status) {
                    case 1:
                        $("#product-buy-link").html("预约中");
                        $("#product-buy").removeClass("_toreduce_bg").unbind("click");
                        break;
                    case 2:
                        if (info.canredeem) { //产品是否可以赎回
                            $("#product-buy-link").html("立即转出");
                            $("#product-buy").click(function () { //弹出退出弹框
                                $(".mask").show();
                                $("#invest-mtk").show();
                                $("#paymentdate").html("预计到账日期为" + info.paymentdate); //预计赎回日期
                                $("#capital").html($.fmoney(String(info.bidamount)) + "元"); //赎回本金
                                $("#holdingsdays").html(info.holdingsdays + "天"); //持有天数
                                $("#earnings").html($.fmoney(String(info.calledawaybenefit)) + "元"); //提前退出收益
                                $("#currentladderrate").html($.fmoney(data.currentladderrate) + "%"); //本期收益率
                                $("#total").html($.fmoney(info.totalamount) + "元"); //总额
                                $("#cancel").click(function () { //点击取消
                                    $(".mask").hide();
                                    $("#invest-mtk").hide();
                                });
                                var account = [];
                                var _interval;
                                var _intervalTimeout;
                                var tradeno = "";
                                var password = "";
                                var currentDate = "";
                            });
                            var redeem = function (product) {
                                var topDom = this;
                                $.PaymentHtmlNew(product.totalamount, "赎回金额", function (password) {
                                    $.closePWD();
                                    var url = "/StoreServices.svc/trans/redeemfixed";
                                    var data = {
                                        "paypassword": password,
                                        "productbidid": productbidid
                                    };
                                    $.AkmiiAjaxPost(url, data).then(function (data) {
                                        if (data.result) {
                                            window.location.replace("/html/paycenter/operation-success.html?type=incrementalRedeem&amount=" + product.totalamount + "&paymentdate=" + product.paymentdate + "&product=" + encodeURIComponent(product.title) + "&status=" + encodeURIComponent('已从' + product.title + '赎回到账户') + "&title=" + encodeURIComponent('赎回成功'));
                                        } else if (data.errorcode == "20019") {
                                            $.confirmF(data.errormsg, null, "去重置", function () {
                                                $(".reset").click();
                                            }, function () {
                                                window.location.href = "/html/my/resetpassword.html";
                                            });
                                        } else if (data.errorcode == "20018") {
                                            $.alertF(data.errormsg, null, function () {
                                                redeem(product);
                                            });
                                        } else if (data.errorcode == 'missing_parameter_accountid') {
                                            $.Loginlink();
                                        } else {
                                            $.alertF(data.errormsg);
                                        }
                                    });
                                }, null, null, null, null, false);
                            };
                            $("#ensure").click(function () { //点击确定
                                $(".mask").hide();
                                $("#invest-mtk").hide();
                                redeem(info);
                            });
                        } else {
                            //nextopenredeemdate为空，产品为最后一期按钮禁用
                            $("#product-buy-link").html(info.nextopenredeemdate ? ("下一开放日:" + info.nextopenredeemdate) : ("到期结息日:" + info.enddate));
                            $("#product-buy").removeClass("_toreduce_bg").unbind("click");
                        };
                        break;
                    case 3:
                    case 5:
                        $("#product-buy-link").html("已转出");
                        $("#product-buy").removeClass("_toreduce_bg").unbind("click");
                        $("#invest-detail").attr("href", "javascript:void(0)"); //投资详情不可点
                        break;
                    case 4:
                    case 6:
                        $("#product-buy-link").html("转出中"); //转出中
                        $("#product-buy").removeClass("_toreduce_bg").unbind("click");
                        $("#invest-detail").attr("href", "javascript:void(0)"); //投资详情不可点
                        break;
                }

            } else {
                if (data.errorcode == "missing_parameter_accountid") {
                    $.alertF("用户未登录", '', function () {
                        $.Loginlink();
                    })
                } else {
                    $.alertF(data.errormsg)
                }
            }
        })
    }
    //根据不同产品，取产品的单位
    function factory(saletype) {
        var termtip, unit, unit2, alert;
        switch (saletype) {
            case '98':
                alert = false;
                unit = "周";
                unit2 = "";
                termtip = "";
                break;
            case '97':
                alert = true;
                unit = "月";
                unit2 = "个月"
                termtip = "每个月按30天计算";
                break;
            case '96':
                alert = true;
                unit = "季";
                unit2 = "季度"
                termtip = "每个季度按90天计算";
                break;
            default:
                break;
        }
        return {
            termtip: termtip,
            unit: unit,
            unit2: unit2,
            alert: alert
        }
    }

    //保留小数位数
    template.helper('toFixed', function (number, decimal) {
        return $.fmoney(number);
    });
    //柱状图动画
    var end = false;
    template.helper('barAnimation', function () {
        setTimeout(function () {
            //删除 will-change
            document.getElementsByClassName("bar")[0].addEventListener("webkitTransitionEnd", transitionend);
            document.getElementsByClassName("bar")[0].addEventListener("transitionend", transitionend);

            function transitionend() {
                if (!end) {
                    $("#bar-graph").addClass("animationed");
                    end = true;
                }
            }
            $("#bar-graph").addClass("bar-animation");
        }, 10);
    });


    //使用模板渲染数据
    function render(type, data) {
        if (type == "header") {
            var source = document.getElementById("product-header-tpl").innerHTML;
            var render = template.compile(source);
            var html = render({
                d: data
            });
            document.getElementById('product-header').innerHTML = html;
        } else if (type == "bar") {
            if (data && data.ladderratelist && data.ladderratelist.length > 0) {
                var source = document.getElementById("bar-graph-tpl").innerHTML;
                var render = template.compile(source);
                var html = render({
                    data: data
                });
                document.getElementById('bar-graph').innerHTML = html;
            }
        } else if (type == "rule") {
            var source = document.getElementById("product-rule-tpl").innerHTML;
            var render = template.compile(source);
            var html = render({
                d: data
            });
            document.getElementById('product-rule').innerHTML = html;
        } else if (type == "time-line") {
            var source = document.getElementById("time-line-tpl").innerHTML;
            var render = template.compile(source);
            var html = render({
                d: data
            });
            document.getElementById('time-line').innerHTML = html;
        } else if (type == "open-house") {
            var source = document.getElementById("openHouse-tpl").innerHTML;
            var render = template.compile(source);
            var html = render({
                d: data
            });
            document.getElementById('open-house').innerHTML = html;
        }
    }
});