//define(["require", "exports", '../api/user', '../api/system', '../api/product'], function (require, exports, user_1, system_1, product_1) {
$(function () {
    "use strict";
    var Product = {};
    var User = {};
    var System = {};

    var detailtype = $.getQueryStringByName("detailtype") || 0;
    var productdurationmin = $.getQueryStringByName("productdurationmin") || 0;
    var productdurationmax = $.getQueryStringByName("productdurationmax") || 0;
    var detailname = $.getQueryStringByName("detailname") || "定期";
    var ratedesc = decodeURIComponent($.getQueryStringByName("ratedesc")) || "期望年化收益率";
    var durationdesc = decodeURIComponent($.getQueryStringByName("durationdesc")) || "投资期限";
    var duration = $.getQueryStringByName("duration") || 0;


    $.UpdateTitle(decodeURIComponent(detailname));

    (function (Product) {
        function getProductList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/onsalebyduration";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductList = getProductList;
    })(Product);
    User.getUserInfo = function (request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/user/info";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    System.getBannerByType = function (request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/anonymous/system/getbannerbytype";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success, error);
    }
    var ProductFixedListPage = (function () {
        function ProductFixedListPage() {
            this.getUserInfo();
        }
        ProductFixedListPage.prototype.getUserInfo = function () {
            var topDom = this;
            User.getUserInfo({}, function (data) {
                if (data.result) {} else if (data.errorcode == 'missing_parameter_accountid') {
                    $(".usercenter").attr("href", "/html/anonymous/login.html");
                    $(".qujin-nav").attr("href", "/html/anonymous/login.html");
                }
                topDom.getProductList("0", data);
            });
        };
        ProductFixedListPage.prototype.getProductList = function (lastId, accountResponse) {
            var topDom = this;
            Product.getProductList({
                detailtype: detailtype,
                productdurationmin: productdurationmin,
                productdurationmax: productdurationmax,
                lastproductid: lastId,
                duration: 90
            }, function (data) {
                if (data.result) {
                    $.each(data.productlist, function (index, entry) {
                        var html;
                        if (entry.status == 5) {
                            if (entry.countdownsecond > 0) {
                                html = topDom.initSoldOut(entry);
                            } else {
                                html = topDom.initSOling(entry, accountResponse);
                            }
                        } else if (entry.status == 6 || entry.status == 8) {
                            html = topDom.initSoldOut(entry);
                        }
                        var pHtml = $(".pid-" + entry.productid);
                        if (pHtml.length > 0) {
                            pHtml.replaceWith(html);
                        } else {
                            $("#productsList").append(html);
                        }
                        if (lastId != '0') {
                            lastId = entry.productid;
                        } else {
                            lastId = '922337203685477580';
                        }
                    });
                    //没有数据时显示
                    if ($("#productsList li").length == 0) {
                        $("#productsList").hide();
                        $("#noDataContainer").show();
                    }
                    //20170703产品要求去掉加载更多一页显示所有
                    // if (data.productlist.length > 0) {
                    //     $.LoadMore($("#productsList"), '加载更多', function() {
                    //         topDom.getProductList(lastId, accountResponse);
                    //     });
                    // } else {
                    //     $.LoadMore($("#productsList"), "没有更多产品了");
                    // }
                }
            });
            clearTimeout(this.TimerID);
            // this.TimerID = setTimeout(function() {
            //     topDom.getProductList("0", accountResponse);
            // }, 30000);
        };
        ProductFixedListPage.prototype.initSoldOut = function (product) {
            var htmlArray = [];
            var process = product.purchaseprogress;
            var neednewuser = (product.type == 99);
            var rateact = product.rateactivite > 10 ? 9.99 : product.rateactivite; //this.formatActityRate(product.rateactivite)
            var actrateHtml = product.rateactivite > 0 ? "<div class='productactrate'>{0}</div>".replace("{0}", this.formatActityRate(rateact)) : "";
            ratedesc = product.ratedesc;
            htmlArray.push("<li class=\"fund-list product_soldout bg-white mb8 pid-" + product.productid + "\">");
            // htmlArray.push("<div class=\"atricleclick\">");
            // if (neednewuser) {
            //     htmlArray.push("<div class=\"newuser\"><style>.fund-list .newuser::before{content:\"新手\";}</style></div>");
            // }
            htmlArray.push(" <p class='productName'>" + product.title + "</p>");
            htmlArray.push("<div class='productInfoContainer'>");
            htmlArray.push("<div class='productInterestRates'><div>" + product.rate + "<span class='unit'>%</span>" + actrateHtml + "</div><p class='desc'>" + ratedesc + "</p></div>");
            htmlArray.push("<div class='productTimeLimit'>");
            htmlArray.push("<div style='margin-top: .43rem;margin-bottom: .2rem;'>")
            htmlArray.push("<span class='num'>" + product.duration + "</span><span class='unit'> 天</span>")
            htmlArray.push("</div>")
            htmlArray.push("<p class='desc'>" + $.fmoney(product.minamount, 0, 0) + " 元起投</p>")
            htmlArray.push("</div></div>")
            switch (product.status) {
                case 6:
                    htmlArray.push("<div class='productSellProcessing'><span class='pspBar'></span><span class='pspPercent'>已售罄</span></div>")
                    break;
                case 8:
                    htmlArray.push("<div class='productSellProcessing'><span class='pspBar'><i></i></span><span class='pspPercent'>已购" + process + "%</span></div>")
                    break;
                case 5:
                    htmlArray.push("<div class='productSellProcessing'><span class='pspBar'><i></i></span><span class='pspPercent'>已购" + process + "%</span></div>")
                    break;
            }
            setTimeout(function () {
                html.find(".pspBar i").css("width", (process) + "%");
            }, 0);

            htmlArray.push("</li>");
            var html = $(htmlArray.join(""));
            html.click(function () {
                if (product.isentrust) {
                    if (product.saletype == 96) {
                        window.location.href = "/html/product/incremental-productdetail.html?id=" + product.productid;
                    } else {
                        window.location.href = "/html/product/productfixeddetail.html?id=" + product.productid;
                    }

                } else {
                    window.location.href = "/html/product/productfixeddetail-old.html?id=" + product.productid;
                }
            });
            html.find(".productAmount").click(function (e) {
                e.stopPropagation();
            })
            return html;
        };
        ProductFixedListPage.prototype.initSOling = function (product, accountResponse) {
            var process = product.purchaseprogress;
            var htmlArray = [];
            var neednewuser = (product.type == 99);
            var rateact = product.rateactivite > 10 ? 9.99 : product.rateactivite; //this.formatActityRate(product.rateactivite)
            var actrateHtml = product.rateactivite > 0 ? "<div class='productactrate'>{0}</div>".replace("{0}", this.formatActityRate(rateact)) : "";
            ratedesc = product.ratedesc;
            htmlArray.push("<li class=\"fund-list bg-white mb8 pid-" + product.productid + "\">");
            htmlArray.push(" <p class='productName'>" + product.title + "</p>");
            htmlArray.push("<div class='productInfoContainer'>");
            htmlArray.push("<div class='productInterestRates'><div>" + product.rate + "<span class='unit'>%</span>" + actrateHtml + "</div><p class='desc'>" + ratedesc + "</p></div>");
            htmlArray.push("<div class='productTimeLimit'>");
            htmlArray.push("<div style='margin-top: .43rem;margin-bottom: .2rem;'>")
            htmlArray.push("<span class='num'>" + product.duration + "</span><span class='unit'> " + product.durationsuffix + "</span>")
            htmlArray.push("</div>")
            htmlArray.push("<p class='desc'>" + $.fmoney(product.amountmin, 0, 0) + product.minamountsuffix + "</p>")
            htmlArray.push("</div></div>")
            htmlArray.push("<div class='productSellProcessing'><span class='pspBar'><i></i></span><span class='pspPercent'>已购" + process + "%</span></div>")
            htmlArray.push("</li>");

            var html = $(htmlArray.join(""));

            setTimeout(function () {
                html.find(".pspBar i").css("width", (process) + "%");
            }, 0);

            html.click(function () {
                if (product.isentrust) {
                    if (product.saletype == 96) {
                        window.location.href = "/html/product/incremental-productdetail.html?id=" + product.productid;
                    } else {
                        window.location.href = "/html/product/productfixeddetail.html?id=" + product.productid;
                    }

                } else {
                    window.location.href = "/html/product/productfixeddetail-old.html?id=" + product.productid;
                }
            });

            // var canvas = html.find("canvas")[0];
            // var ring = new Ring(0, process);  // 从2*Math.PI/3弧度开始，进度为50%的环
            // canvas.width=ring.circlePoint*2;
            // canvas.height=ring.circlePoint*2;
            // canvas.style.width="2.090667rem";
            // canvas.style.height="2.090667rem";
            // var ctx =  canvas.getContext('2d');

            // ring.drawRing(ctx);


            html.find("canvas").click(function (e) {
                if (!accountResponse.result) {
                    $.Loginlink();
                }
                if (neednewuser && !product.newuser) {
                    $.alertF("您已经投资过新手专享了");
                } else {
                    if (!accountResponse.ismaintenance &&
                        !accountResponse.isglobalmaintenance &&
                        !neednewuser &&
                        accountResponse.accountinfo &&
                        accountResponse.accountinfo.isnewuser) {
                        $.alertF(accountResponse.accountinfo.isnewusermsg, "立即投资", function () {
                            window.location.href = "/Html/Product/productfixedlist.html";
                        });
                    } else {
                        window.location.href = "/html/product/productfixedbuy.html?id=" + product.productid;
                        if (accountResponse && accountResponse.ismaintenance) {
                            window.location.href = "/html/system/data-processing.html";
                        }
                        if (accountResponse && accountResponse.isglobalmaintenance) {
                            window.location.href = "/html/system/system-maintenance.html";
                        }
                    }
                }
                e.stopPropagation();
            });


            return html;
        };
        ProductFixedListPage.prototype.formatActityRate = function (actityrate) {
            if (actityrate > 0) {
                return "+" + $.fmoney(actityrate) + "%";
            } else {
                return "";
            }
        };
        return ProductFixedListPage;
    }());
    //exports.ProductFixedListPage = ProductFixedListPage;
    var productFixedList = new ProductFixedListPage();






    var pixelRatio = window.devicePixelRatio || 1;

    function Circle() {
        this.radius = 22 * pixelRatio; // 圆环半径
        this.lineWidth = 3 * pixelRatio; // 圆环边的宽度
        this.circlePoint = this.radius + this.lineWidth; //圆心
        this.strokeStyle = '#E5E5E5'; //边的颜色
        this.fillStyle = '#ff8686'; //填充色
        this.lineCap = 'round';
    }

    Circle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.circlePoint, this.circlePoint, this.radius, 0, Math.PI * 2, true); // 坐标为250的圆，这里起始角度是0，结束角度是Math.PI*2
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke(); // 这里用stroke画一个空心圆，想填充颜色的童鞋可以用fill方法
    };


    function Ring(startAngle, percent) {
        Circle.call(this);
        this.startAngle = startAngle || 3 * Math.PI / 2; //弧起始角度
        this.percent = percent; //弧占的比例
    }

    Ring.prototype = Object.create(Circle.prototype);

    Ring.prototype.drawRing = function (ctx) {

        var current_percent = 0;

        function _drawRing() {
            if (current_percent <= this.percent) {
                ctx.clearRect(0, 0, 400, 400);

                ctx.font = 12 * pixelRatio + 'px Arial';
                ctx.fillStyle = '#f30';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(current_percent + '%', this.circlePoint, this.circlePoint);

                this.draw(ctx); // 调用Circle的draw方法画圈圈
                if (this.percent) { //0的时候不画进度圆圈，防止多一个点

                    // angle
                    ctx.beginPath();
                    var anglePerSec = 2 * Math.PI / (100 / current_percent); // 进度的弧度
                    ctx.arc(this.circlePoint, this.circlePoint, this.radius, this.startAngle, this.startAngle + anglePerSec, false); //这里的圆心坐标要和cirle的保持一致
                    ctx.strokeStyle = this.fillStyle;
                    ctx.lineCap = this.lineCap;
                    ctx.stroke();
                    ctx.closePath();
                    current_percent++;
                }
                setTimeout(_drawRing.bind(this), 20);
            }
        }

        _drawRing.call(this);
    }


});