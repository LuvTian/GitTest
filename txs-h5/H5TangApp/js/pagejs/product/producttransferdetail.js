//define(["require", "exports", '../api/product'], function (require, exports, product_1) {
$(function() {

    "use strict";

    var Product = {};
    (function(Product) {

        function getTransferDetail(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/producttransferdetail";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getTransferDetail = getTransferDetail;

        function transferWithdraw(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/producttransferwithdraw";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.transferWithdraw = transferWithdraw;

    })(Product);


    var ProductTransferDetailPage = (function() {
        function ProductTransferDetailPage() {
            this.TransferID = $.getQueryStringByName("producttransferid");
            this.BidID = $.getQueryStringByName("productbidid");
            this.getTransferDetail();
            this.date = "";
            this.timecount = 0;
        }
        ProductTransferDetailPage.prototype.pageInIt = function(productid) {
            var url = "/StoreServices.svc/product/item";
            $.AkmiiAjaxPost(url, {
                "productid": productid
            }, true).then(function(data) {
                if (data.result) {
                    $(".check_tips_question").click(function() {
                        window.location.href = "/html/product/transferinfo.html?transferlockday=" + data.productinfo.transferlockday + "&ruletype=" + data.productinfo.ruletype + "&remainingnottransferdays=" + data.productinfo.remainingnottransferdays;
                    });
                }
            });
        };
        ProductTransferDetailPage.prototype.getTransferDetail = function() {
            var topDom = this;
            Product.getTransferDetail({
                productbidid: this.BidID,
                transferid: this.TransferID
            }, function(data) {
                if (data.result) {
                    var product = data.transferinfo;
                    topDom.date = data.date;
                    topDom.pageInIt(product.productid);
                    $.UpdateTitle(product.title);
                    $("#remainingday").html(product.remainingday);
                    $("#remainingprice").html($.fmoney(product.remainingprice));
                    $("#remaininginterest").html($.fmoney(product.remaininginterest));
                    $("#endtime").html(product.endprofittime);
                    if (product.type == 2) {
                        $("#interest-text").text("当期已产生利息");
                    } else if (product.type == 3) {
                        $("#interest-text").text("已产生利息");
                    }
                    $("#interest").html($.fmoney(product.interest));
                    $("#transferamount").html($.fmoney(product.transferamount));
                    $("#transferrate").html(product.transferrate);
                    if (product.status == 1 && product.istransfer == true) {
                        $("#btn-withdraw").show();
                        $("#product-buy").hide();
                        $(".check_tips_question").hide();
                    } else if (product.status == 2 && product.istransfer == true) {
                        $("#btn-withdraw").html("已售罄").css("background", "rgb(212, 212, 212)").unbind().show();
                        $("#product-buy").hide();
                        $(".check_tips_question").hide();
                    } else {
                        $("#product-buy").attr("href", "/html/product/producttransferbuy.html?id=" + product.producttransferid);
                    }
                    topDom.countDown(product);
                    topDom.pageInit(product);
                    topDom.rateCanvasInit(product);
                } else {
                    $.alertF(data.errormsg, null, function() {
                        window.location.replace("/html/my/my-regular-detail.html?id=" + topDom.BidID);
                    });
                    return;
                }
            }, true);
        };
        ProductTransferDetailPage.prototype.countDown = function(product) {
            var topDom = this;
            var now = new Date(topDom.date);
            var saleDate = new Date((product.exptime.replace(/-/g, "/")));
            topDom.timecount = (saleDate.getTime() - now.getTime()) / 1000;
            var int = setInterval(function() {
                var day = 0;
                var hour = 0;
                var minute = 0;
                var seconds = 0;
                var timecount = topDom.timecount--;
                day = parseInt(timecount / 86400);
                hour = parseInt((timecount % 86400) / 3600);
                minute = parseInt(((timecount % 86400) % 3600) / 60);
                seconds = parseInt(((timecount % 86400) % 3600) % 60);
                var text = (day == 0 ? "" : day.toFixed(0) + "天") + (hour == 0 ? "" : hour.toFixed(0) + "时") + (minute == 0 ? "" : minute.toFixed(0) + "分") + seconds.toFixed(0) + "秒";
                if (timecount > 0) {
                    $("#countdown").html(text);
                } else if (timecount <= 0) {
                    $("#dowmhtml").hide();
                    if (!$.isNull(topDom.BidID) && product.status != 2) {
                        $("#btn-withdraw").html("已下架").css("background", "rgb(212, 212, 212)").unbind();
                    } else {
                        $("#product-buy").html("已售罄").css("background", "rgb(212, 212, 212)").unbind();
                        $("#product-buy").removeAttr("href");
                    }
                }
            }, 1000);
        };
        ProductTransferDetailPage.prototype.pageInit = function(product) {
            var topDom = this;
            $("#oldproductinfo").click(function() {
                window.location.href = "/html/product/productfixeddetail.html?id=" + product.productid;
            });
            $("#btn-withdraw").click(function() {
                $.confirmF("是否真的要撤回", "取消", "确定", null, function() {
                    Product.transferWithdraw({
                        transferid: product.producttransferid
                    }, function(data) {
                        if (data.result) {
                            var param = "?type=transferwithdrawok" +
                                "&transfertitle=" + product.title +
                                "&title=" + encodeURIComponent('撤回成功') +
                                "&transferamount=" + product.transferamount;
                            window.location.replace("/html/paycenter/operation-success.html" + param);
                        } else {
                            var errorCode = data.errorcode;
                            $.alertF(data.errormsg, "", function() {
                                if (errorCode == "1001") {
                                    return;
                                }
                                topDom.getTransferDetail();
                            });
                            return;
                        }
                    });
                });
            });
        };
        ProductTransferDetailPage.prototype.rateCanvasInit = function(product) {
            var topDom = this;
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
                        text: '剩余期限' + product.remainingday + '天',
                        style: {
                            color: '#b9b9b9',
                            fontSize: '1.2rem',
                        },
                        offset: 10,
                        align: 'middle'
                    }
                },
                yAxis: {
                    tickPositioner: function() {
                        var positions = [],
                            tick = (Number(product.minratevalue)),
                            increment = ((Number(product.maxratevalue) - Number(product.minratevalue)) / 5);
                        for (tick; tick - increment <= Number(product.maxratevalue); tick += increment) {
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
                    max: Number(product.maxratevalue),
                    min: Number(product.minratevalue),
                    startOnTick: false,
                    title: {
                        text: '历史年化',
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
                                format: '{y} %',
                                y: Number(product.minratevalue) + 30,
                                inside: true,
                                verticalAlign: 'bottom',
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'MicrosoftYahei',
                                    textShadow: null
                                }
                            },
                            y: Number(product.oldrate)
                        }, {
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
                                y: Number(product.minratevalue) + 30,
                                inside: true,
                                verticalAlign: 'bottom',
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'MicrosoftYahei',
                                    textShadow: null
                                }
                            },
                            y: Number(product.transferrate)
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
            }, function(chart) {
                $('.highchat_box').each(function() {
                    $(this).append('<span>期限</span>');
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
        return ProductTransferDetailPage;
    }());
    var productTransferDetailPage = new ProductTransferDetailPage();
});