//define(["require", "exports", '../api/user', '../api/system', '../api/product'], function (require, exports, user_1, system_1, product_1) {
$(function() {
    "use strict";
    var Product = {};
    // var User = {};
    // var System = {};

    var saletype = $.getQueryStringByName("saletype") || "";
    var minduration = $.getQueryStringByName("minduration") || 0;
    var maxduration = $.getQueryStringByName("maxduration") || 0;
    var huiyuanri = $.getQueryStringByName("huiyuanri") || "";
    // var detailname = $.getQueryStringByName("detailname") || "定期";
    var ratedesc = decodeURIComponent($.getQueryStringByName("ratedesc")) || "期望年化收益率";
    // var durationdesc = decodeURIComponent($.getQueryStringByName("durationdesc")) || "投资期限";
    // var duration = $.getQueryStringByName("duration") || 0;


    // $.UpdateTitle(decodeURIComponent(detailname));

    var ProductFixedListPage = function() {
        // this.getProductList()
    };

    (function(Product) {
        function getProductList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/productdurationregionortype";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductList = getProductList;
    })(Product);

    ProductFixedListPage.prototype.getProductList = function(lastId, accountResponse) {
        var topDom = this;
        Product.getProductList({
            minduration: minduration, //最小期限
            maxduration: maxduration, //最大期限
            saletype: saletype //定期类型
                // detailtype: detailtype,
                // productdurationmin: productdurationmin,
                // productdurationmax: productdurationmax,
                // lastproductid: lastId,
                // duration: 90
        }, function(data) {
            // console.log(data);
            if (data.result) {
                $.each(data.productlist, function(index, entry) {
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
                    if (huiyuanri) {
                        $("#noDataContainer p").html("今日会员狂欢专享标已售罄");
                    }
                    $("#noDataContainer").show();
                } else if ($("#productsList li").length > 0 && huiyuanri) { //会员日活动
                    $("#productsList").prepend("<p style='color:#333;font-size:.597333rem;padding: .512rem .725333rem 0 .512rem;'>每个标的最后一笔投资加赠5万元理财金！</p>");
                    $("#productsList").append("<p style='color:#ff0000;font-size:0.512rem;padding: .512rem .725333rem;'>会员日专享产品不可使用优惠券、不可转让、不可提前赎回</p>");
                }
            }
        });
        clearTimeout(this.TimerID);
    };
    ProductFixedListPage.prototype.initSoldOut = function(product) {
        var htmlArray = [];
        var process = product.purchaseprogress;
        var neednewuser = (product.type == 99);
        var rateact = product.rateactivite > 10 ? 9.99 : product.rateactivite;
        var actrateHtml = product.rateactivite > 0 ? "<div class='productactrate'>{0}</div>".replace("{0}", this.formatActityRate(rateact)) : "";
        ratedesc = product.ratedesc;
        htmlArray.push("<li class=\"fund-list product_soldout bg-white mb8 pid-" + product.productid + "\">");
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
        setTimeout(function() {
            html.find(".pspBar i").css("width", (process) + "%");
        }, 0);

        htmlArray.push("</li>");
        var html = $(htmlArray.join(""));
        html.click(function() {
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
        html.find(".productAmount").click(function(e) {
            e.stopPropagation();
        })
        return html;
    };

    ProductFixedListPage.prototype.initSOling = function(product, accountResponse) {
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

        setTimeout(function() {
            html.find(".pspBar i").css("width", (process) + "%");
        }, 0);

        html.click(function() {
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

        html.find("canvas").click(function(e) {
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
                    $.alertF(accountResponse.accountinfo.isnewusermsg, "立即投资", function() {
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
    ProductFixedListPage.prototype.formatActityRate = function(actityrate) {
        if (actityrate > 0) {
            return "+" + $.fmoney(actityrate) + "%";
        } else {
            return "";
        }
    };
    (new ProductFixedListPage()).getProductList();
});