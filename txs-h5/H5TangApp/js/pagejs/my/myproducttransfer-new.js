var productbidid = $.getQueryStringByName("id");
var productbid = [];
var regularproductdetail = [];
var accounttext = "账户余额";
var account = [];
var mintransferamount;
var maxtransferamount;
var productid = 0;
$(function() {
    productTransfer();
})

function userinfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                accounttext = "僧财宝";
            }
        }
    });
}

//查询购买记录信息
function productTransfer() {
    var url = "/StoreServices.svc/product/bid";
    var data = { productbidid: productbidid };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            productbid = d.productbid;
            regularproductdetail = d.regularproductdetail;
            productid = productbid.productid;
            pageinit();
            $.UpdateTitle(productbid.title);
            $("#transfer_rate").html($.fmoney(productbid.productrate) + "%");
            if (productbid.transferlockday > 0) {
                $("#transferhtml").html("转让锁定期" + productbid.transferlockday + "天后可转");
            } else {
                $("#transferhtml").html("起息即可转");
            }
            if (productbid.rateactivite > 0) {
                $("#product-rate-rateactivite").text("+" + $.fmoney(productbid.rateactivite) + "%").show();
            }
            $("#transfer_money").val(formatmoney(productbid.defaulttransferamount)); //默认转让金额
            var defaultrate = (productbid.bidamount + productbid.remaininginterest + productbid.haveinterest - productbid.defaulttransferamount) * 365 / (productbid.defaulttransferamount * productbid.remainingdays);
            $("#transferrate").val(formatmoney(defaultrate * 100)); //默认转让利率
            rateCanvasInit(formatmoney(defaultrate * 100));
            $("#remainingday").html(productbid.remainingdays + "天");
            $("#remainingamount").html($.fmoney(productbid.remainingamount) + "元");
            $("#remaininginterest").html($.fmoney(productbid.remaininginterest) + "元");
            $("#enddate").html(productbid.enddate);
            $("#interest").html($.fmoney(productbid.haveinterest) + "元");

            $("#minrate").html($.fmoney(regularproductdetail.transferminratelimit) + "%");
            $("#maxrate").html($.fmoney(regularproductdetail.transfermaxratelimit) + "%");
            $("#mintransferamount").html(regularproductdetail.secondmarketminamount);
            $("#maxtransferamount").html(regularproductdetail.secondmarketmaxamount + "元");
            pemaltyAndDealAmount(productbid.defaulttransferamount);
        }
    });
}

//计算转让利率
function transfer_rate(money) {
    var rate = (productbid.bidamount + productbid.remaininginterest + productbid.haveinterest - money) * 365 / (money * productbid.remainingdays);
    return rate;
}

//计算转让金额
function transfer_money(rate) {
    var sum = (productbid.bidamount + productbid.remaininginterest + productbid.haveinterest) / (((Number(rate) / 100) * productbid.remainingdays / 365) + 1);
    return sum;
}

function pageinit() {
    userinfo();
    //计算转让金额的最小最大值
    maxtransferamount = formatmoney(transfer_money(regularproductdetail.transferminratelimit));
    mintransferamount = formatmoney(transfer_money(regularproductdetail.transfermaxratelimit));
    // $("#mintransferamount").html(mintransferamount);
    // $("#maxtransferamount").html(maxtransferamount + "元");

    $("#zqxieyi").click(function() {
        window.location.href = "/Html/Product/contract/transfer-zcxieyi.html?productid=" +
            productid;
    });
    //改变转让利率（只柱状图改变）
    $("#transferrate").keyup(function() {
        var rate = Number($("#transferrate").val());
        if (rate != 0) {
            if (rate >= regularproductdetail.transferminratelimit && rate <= regularproductdetail.transfermaxratelimit) {
                var sum = transfer_money(rate);
                $("#transfer_money").val(formatmoney(sum));
                var transfermoney = $("#transfer_money").val();
                rateCanvasInit(rate);
                pemaltyAndDealAmount(transfermoney);
            }
        }
    });
    //改变转让金额（只柱状图改变）
    $("#transfer_money").keyup(function() {
        var money = Number($("#transfer_money").val());
        if (money != 0) {
            if (money >= mintransferamount && money <= maxtransferamount) {
                var rate = formatmoney(transfer_rate(money));
                // $("#transfer_money").val(Number(money).toFixed(2));
                $("#transferrate").val(formatmoney(rate * 100));
                rateCanvasInit(formatmoney(rate * 100));
                pemaltyAndDealAmount(money);
            }
        }
    });
    //验证转让利率
    $("#transferrate").blur(function() {
        var rate = Number($("#transferrate").val());
        if (rate < 4) {
            rate = 4;
            $("#transferrate").val("4.00");
        } else if (rate > 14) {
            rate = 14;
            $("#transferrate").val("14.00");
        }
        var sum = transfer_money(rate);
        $("#transfer_money").val(formatmoney(sum));
        var transfermoney = $("#transfer_money").val();
        rateCanvasInit(rate);
        pemaltyAndDealAmount(transfermoney);
    });
    //验证转让金额
    $("#transfer_money").blur(function() {
        var money = Number($("#transfer_money").val());
        if (money < mintransferamount) {
            money = mintransferamount;
            $("#transfer_money").val(formatmoney(money));
        } else if (money > maxtransferamount) {
            money = maxtransferamount;
            $("#transfer_money").val(formatmoney(money));
        }
        var rate = transfer_rate(formatmoney(money));
        $("#transfer_money").val(formatmoney(money));
        $("#transferrate").val(formatmoney(rate * 100));
        rateCanvasInit(formatmoney(rate * 100));
        pemaltyAndDealAmount(money);
    });
    // 确定转让
    $("#btn-transfer").click(function() {
        checkTransferAmount();
    });
    //是否勾选协议
    $("#checkbox").click(function() {
        if ($(this).hasClass("check-box")) {
            $(this).removeClass("check-box").addClass("no-check-box");
            $("#btn-transfer").css("background", "#979797");
        } else {
            $(this).removeClass("no-check-box").addClass("check-box");
            $("#btn-transfer").css("background", "#f43f3f");
        }
    });
}

//检查转让金额是否符合
function checkTransferAmount() {
    if ($("#checkbox").hasClass("check-box")) {
        if ($.isNull($("#transfer_money").val())) {
            $.alertF("请输入转让金额");
            return;
        }
        var transferamount = Number(formatmoney($("#transfer_money").val()));
        if (transferamount <= maxtransferamount &&
            transferamount >= mintransferamount) {
            $.PaymentHtmlNew(transferamount, "", function(password) {
                $.closePWD();
                checkPayPassword(password, transferamount);
            }, "", "" + accounttext + "", account.basicbalance, null);
        }
    } else {
        return;
    }
};

//检查密码是否正确
function checkPayPassword(password, transferamount) {
    var url = "/StoreServices.svc/user/checkpaymentpwd";
    var data = {
        "paymentpwd": password
    };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            btn_productTransfer(transferamount);
        } else if (d.errorcode == "20018") {
            $.alertNew(d.errormsg, null, function() {
                $.PaymentHtmlNew(transferamount, "", function(password) {
                    $.closePWD();
                    checkPayPassword(password, transferamount);
                }, "", "" + accounttext + "", account.basicbalance, null);
            });
        } else if (d.errorcode == "20019") {
            $.confirmF(d.errormsg, null, "去重置", function() {
                $(".reset").click();
            }, function() {
                window.location.href = "/html/my/resetpassword.html";
            });
        } else {
            $.alertF(d.errormsg);
        }
    });
};

//确认转让
function btn_productTransfer(transferamount) {
    var url = "/StoreServices.svc/product/producttransfer";
    var data = {
        productbidid: productbid.id,
        transferamount: transferamount
    };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            window.location.replace("/html/paycenter/operation-success.html?type=producttransfer&title=" + productbid.title + "&transferamount=" + transferamount);
        } else {
            $.alertF(d.errormsg);
        }
    });
}

//计算手续费和到手金额
function pemaltyAndDealAmount(money) {
    if (money != 0) {
        var penalty = money * regularproductdetail.penaltyrate / 100 + "";
        if (penalty <= 10) {
            penalty = 10;
        } else if (penalty >= 100000) {
            penalty = 100000;
        } else {
            penalty = formatmoney(penalty);
        }
        $("#penalty").html($.fmoney(penalty) + "元");
        $("#dealamount").html($.fmoney(money - penalty) + "元");
    } else {
        $("#penalty").html("0.00");
        $("#dealamount").html("0.00");
    }
}

function formatmoney(value) {
    value += "";
    if (value == "0") {
        return "0.00";
    } else {
        var num = value.indexOf('.') + "";
        if (num > -1) {
            var money = value.substring(0, value.indexOf('.') + 3);
            return money;
        } else if (num == -1) {
            return value + ".00";
        }
    }

}

//柱状图表格
function rateCanvasInit(rate) {
    var colorArr = [
        '#fbd28a',
        '#fdf1d9',
        '#ec8c8f',
        '#ffdbdc'
    ];
    $('#container').highcharts({
            credits: {
                enabled: false
            },
            labels: {
                style: {
                    color: "#ff0000"
                },
                items: [{
                    html: "",
                    style: {
                        fontSize: '1rem',
                        color: '#f7a414'
                    }
                }, {
                    html: "",
                    style: {
                        fontSize: '1rem',
                        color: '#e36769'
                    }
                }]
            },
            chart: {
                type: 'column',
                className: 'highchat_box',
                backgroundColor: 'rgba(0,0,0,0)',
                marginTop: 20,
                height: 245
            },
            title: {
                text: null
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    groupPadding: 0,
                    borderWidth: 0,
                    states: {
                        hover: {
                            brightness: 0.05
                        }
                    }
                }
            },
            xAxis: {
                tickLength: 0,
                showFirstLabel: false,
                showLastLabel: false,
                labels: {
                    enabled: false
                },
                lineColor: '#c86163',
                lineWidth: 1,
                title: {
                    text: '剩余期限' + productbid.remainingdays + '天',
                    style: {
                        color: '#b9b9b9',
                        fontSize: '0.4rem',
                    },
                    offset: 10,
                    align: 'middle'
                }
            },
            yAxis: {
                tickPositioner: function() {
                    var positions = [],
                        tick = (Number(regularproductdetail.minlinechartvalue || 2)),
                        increment = ((Number(regularproductdetail.maxlinechartvalue || 10) - Number(regularproductdetail.minlinechartvalue || 2)) / 5);
                    for (tick; tick - increment <= Number(regularproductdetail.maxlinechartvalue || 10); tick += increment) {
                        positions.push(tick);
                    }
                    return positions;
                },
                allowDecimals: true,
                gridLineColor: '#f8e5dc',
                labels: {
                    format: '{value:.2f} %',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'MicrosoftYahei',
                        color: '#b9b9b9'
                    }
                },
                lineColor: '#eacdcb',
                lineWidth: 1,
                max: Number(regularproductdetail.maxlinechartvalue || 10),
                min: Number(regularproductdetail.minlinechartvalue || 2),
                startOnTick: false,
                title: {
                    text: '期望年化',
                    style: {
                        color: '#b9b9b9',
                        fontSize: '1 rem'
                    },
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    x: -13,
                    y: -8
                },
                endOnTick: false,
                tickInterval: 2
            },
            subtitle: {
                text: null
            },
            series: [{
                name: ' ',
                data: [null, {
                        color: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, colorArr[0]],
                                [1, colorArr[1]]
                            ]
                        },
                        dataLabels: {
                            enabled: true,
                            color: '#fff',
                            align: 'center',
                            format: '{point.y:.2f} %',
                            y: Number(regularproductdetail.minlinechartvalue) + 1, //Number(regularproductdetail.minlinechartvalue || 5) + 30,
                            inside: true,
                            verticalAlign: 'bottom',
                            style: {
                                fontSize: '13px',
                                fontFamily: 'MicrosoftYahei',
                                textShadow: null,

                            }
                        },
                        y: Number(formatmoney(regularproductdetail.sameperiodproductrate)),
                    },
                    {
                        color: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, colorArr[2]],
                                [1, colorArr[3]]
                            ]
                        },
                        dataLabels: {
                            enabled: true,
                            color: '#fff',
                            align: 'center',
                            format: '{point.y:.2f} %',
                            y: Number(regularproductdetail.minlinechartvalue) + 1, //Number(regularproductdetail.minlinechartvalue || 2) + 30,
                            inside: true,
                            verticalAlign: 'bottom',
                            style: {
                                fontSize: '13px',
                                fontFamily: 'MicrosoftYahei',
                                textShadow: null
                            }
                        },
                        y: Number(formatmoney(rate))
                    },
                    null
                ]
            }],
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                floating: true,
                y: 5,
                itemStyle: {
                    color: '#b9b9b9',
                    fontWeight: 'normal',
                },
                symbolWidth: 0
            },
            tooltip: {
                enabled: false,
            }
        },
        function(chart) {
            $('.highchat_box').each(function() {
                // $(this).append('<span>期限</span>');
                $(this).append('<p class="old-product">同期限产品</p >');
                $(this).append('<p class="new-product">本产品</p >');
            });
            var Kot_heiht = Number($('rect').eq(2).attr("height")) + 52 + 'px';
            var Kot_heiht_old = Number($('rect').eq(3).attr("height")) + 52 + 'px';
            $('.old-product').css('bottom', Kot_heiht);
            $('.new-product').css('bottom', Kot_heiht_old);
            $("text").eq(2).attr("x", "34vw");
            $("text").eq(3).attr("x", "57vw");
        });
};