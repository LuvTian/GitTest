//define(["require", "exports", '../api/user', '../api/system', '../api/product'], function (require, exports, user_1, system_1, product_1) {
$(function() {
    "use strict";
    var Product = {};
    var User = {};
    var System = {};
    (function(Product) {
        function getProductList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/list";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductList = getProductList;
    })(Product);
    User.getUserInfo = function(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/user/info";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    System.getBannerByType = function(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/anonymous/system/getbannerbytype";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success, error);
    }
    var ProductFixedListPage = (function() {
        function ProductFixedListPage() {
            this.initBanner();
            this.getUserInfo();
        }
        ProductFixedListPage.prototype.getUserInfo = function() {
            var topDom = this;
            User.getUserInfo({}, function(data) {
                if (data.result) {} else if (data.errorcode == 'missing_parameter_accountid') {
                    $(".usercenter").attr("href", "/html/anonymous/login.html");
                    $(".qujin-nav").attr("href", "/html/anonymous/login.html");
                }
                topDom.getProductList("0", data);
            });
        };
        ProductFixedListPage.prototype.initBanner = function() {
            System.getBannerByType({
                type: "TopBanner"
            }, function(data) {
                var appBanner = data.appbanners;
                $.preloaderFadeOut();
                if (appBanner.length > 0) {
                    var ha = [];
                    var hao = [];
                    $.each(appBanner, function(i, item) {
                        ha.push("<li class=\"\" onclick=\"javascript:window.location.href='" + item.link + "'\">");
                        ha.push("<img src=\"" + item.imageurl + "\" class=\"img-responsive\" /></li>");
                        hao.push("<li class=\"\" data-orbit-slide=\"" + i + "\"></li>");
                    });
                    $("#divbanner").empty().html(ha.join(''));
                    $(".orbit-bullets").empty().html(hao.join(''));
                    $._imgLoad($("#divbanner").find("img"), function(img) {
                        $(img).attr("src", $(img).attr("data-src"));
                    });
                    $(document).foundation({
                        orbit: {
                            animation: 'slide',
                            pause_on_hover: false,
                            animation_speed: 5,
                            navigation_arrows: true,
                            bullets: false
                        }
                    });
                }
            }, function() {
                $.preloaderFadeOut();
            });
        };
        ProductFixedListPage.prototype.getProductList = function(lastId, accountResponse) {
            var topDom = this;
            Product.getProductList({
                producttype: 2,
                lastproductid: lastId
            }, function(data) {
                if (data.result) {
                    $.each(data.productlist, function(index, entry) {
                        var html;
                        if (entry.status == 5) {
                            html = topDom.initSOling(entry, accountResponse);
                        } else if (entry.status == 6 || entry.status == 8) {
                            html = topDom.initSoldOut(entry);
                        }
                        var pHtml = $(".pid-" + entry.productid);
                        if (pHtml.length > 0) {
                            pHtml.replaceWith(html);
                        } else {
                            $("#product-list").append(html);
                        }
                        if (lastId != '0') {
                            lastId = entry.productid;
                        } else {
                            lastId = '922337203685477580';
                        }
                    });
                    if (data.productlist.length > 0) {
                        $.LoadMore($("#product-list"), '加载更多', function() {
                            topDom.getProductList(lastId, accountResponse);
                        });
                    } else {
                        $.LoadMore($("#product-list"), "没有更多产品了");
                    }
                }
            });
            clearTimeout(this.TimerID);
            this.TimerID = setTimeout(function() {
                topDom.getProductList("0", accountResponse);
            }, 30000);
        };
        ProductFixedListPage.prototype.initSoldOut = function(product) {
            var htmlArray = [];
            var neednewuser = (product.type == 99);
            htmlArray.push("<article class=\"fund-list bg-white mb8 pid-" + product.productid + "\">");
            htmlArray.push("<div class=\"atricleclick\">");
            if (neednewuser) {
                htmlArray.push("<div class=\"newuser\"><style>.fund-list .newuser::before{content:\"新手\";}</style></div>");
            }
            htmlArray.push("<div class=\"pltitle oh\"><span class=\"ptt left\">" + product.title + "</span></div>");
            htmlArray.push("<div class=\"small-9 left\">");
            htmlArray.push("<div class=\"row earnings-title\">");
            htmlArray.push('<div class="small-8 left">期望年化收益率</div>');
            htmlArray.push('<div class="small-3 left text-left">投资期限</div>');
            htmlArray.push('</div>');
            htmlArray.push('<div class="row earnings">');
            if ((product.paytype & 2) == 2 &&
                (product.paytype & 1) != 1 &&
                (product.paytype & 4) != 4 &&
                !product.zzbisready) {
                if ((product.rateactivite) == 0) {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><span class="eprompt">仅支持至尊宝购买</span></div>');
                } else {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><i class="pluscoupons">' + this.formatActityRate(product.rateactivite) + '</i><span class="eprompt">仅支持至尊宝购买</span></div>');
                }
            } else if (product.zzbisready &&
                (product.paytype & 2) == 2) {
                if ((product.rateactivite) == 0) {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><span class="eprompt">仅支持至尊宝预约</span></div>');
                } else {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><i class="pluscoupons">' + this.formatActityRate(product.rateactivite) + '</i><span class="eprompt">仅支持至尊宝预约</span></div>');
                }
            } else {
                if ((product.rateactivite) == 0) {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span></div>');
                } else {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><i class="pluscoupons">' + this.formatActityRate(product.rateactivite) + '</i></div>');
                }
            }
            htmlArray.push("<div class=\"small-3 left text-left\"><span class=\"edays\">" + product.duration + "</span>天</div>");
            htmlArray.push("</div></div></div>");
            htmlArray.push("<div class=\"small-3 right\">");
            if (product.status == 6) {
                htmlArray.push("<div class=\"progress end\"><span>已售罄</span></div>");
            } else if (product.status == 8) {
                htmlArray.push('<div class="progress end"><span style="line-height: 1.6rem;top: 20%;font-size:1.0rem">' + product.statusname.replace(/\|/g, '<br />') + '</span></div>');
            }
            htmlArray.push("</div></article>");
            var html = $(htmlArray.join(""));
            html.find(".atricleclick").click(function() {
                if (product.isentrust) {
                    window.location.href = "/html/product/productfixeddetail.html?id=" + product.productid;
                } else {
                    window.location.href = "/html/product/productfixeddetail-old.html?id=" + product.productid;
                }
            });
            return html;
        };
        ProductFixedListPage.prototype.initSOling = function(product, accountResponse) {
            var process = Math.ceil(product.purchaseprogress / 10) * 10;
            var htmlArray = [];
            var neednewuser = (product.type == 99);
            htmlArray.push("<article class=\"fund-list bg-white mb8 pid-" + product.productid + "\">");
            htmlArray.push("<div class=\"atricleclick\">");
            if (neednewuser) {
                htmlArray.push("<div class=\"newuser\"><style>.fund-list .newuser::before{content:\"新手\";}</style></div>");
            }
            htmlArray.push("<div class=\"pltitle oh\"><span class=\"ptt left\">" + product.title + "</span></div>");
            htmlArray.push("<div class=\"small-9 left\">");
            htmlArray.push("<div class=\"row earnings-title\">");
            htmlArray.push('<div class="small-8 left">期望年化收益率</div>');
            htmlArray.push('<div class="small-3 left text-left">投资期限</div>');
            htmlArray.push('</div>');
            htmlArray.push('<div class="row earnings">');
            if ((product.paytype & 2) == 2 && (product.paytype & 1) != 1 && (product.paytype & 4) != 4 && !product.zzbisready) {
                if ((product.rateactivite) == 0) {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><span class="eprompt">仅支持至尊宝购买</span></div>');
                } else {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><i class="pluscoupons">' + this.formatActityRate(product.rateactivite) + '</i><span class="eprompt">仅支持至尊宝购买</span></div>');
                }
            } else if (product.zzbisready && (product.paytype & 2) == 2) {
                if ((product.rateactivite) == 0) {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><span class="eprompt">仅支持至尊宝预约</span></div>');
                } else {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><i class="pluscoupons">' + this.formatActityRate(product.rateactivite) + '</i><span class="eprompt">仅支持至尊宝预约</span></div>');
                }
            } else {
                if ((product.rateactivite) == 0) {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span></div>');
                } else {
                    htmlArray.push('<div class="small-8 left red"><span class="enumber">' + $.fmoney(product.rate) + '</span><span class="epercent">%</span><i class="pluscoupons">' + this.formatActityRate(product.rateactivite) + '</i></div>');
                }
            }
            htmlArray.push("<div class=\"small-3 left text-left\"><span class=\"edays\">" + product.duration + "</span>天</div>");
            htmlArray.push("</div></div></div>");
            htmlArray.push("<div class=\"small-3 right\">");
            if (product.zzbisready) {
                htmlArray.push("<div class=\"progress reserve\"><span>预约中</span></div>");
            } else if (product.countdownsecond > 0) {
                htmlArray.push("<div class=\"progress reserve\"><span>即将开售</span></div>");
            } else {
                htmlArray.push("<a class=\"progress inp in" + process + "\" >");
                htmlArray.push("<span id=\"pl-num\">" + product.purchaseprogress + "%</span></a>");
            }
            htmlArray.push("</div></article>");
            var html = $(htmlArray.join(""));
            html.find(".atricleclick").click(function() {
                if (product.isentrust) {
                    window.location.href = "/html/product/productfixeddetail.html?id=" + product.productid;
                } else {
                    window.location.href = "/html/product/productfixeddetail-old.html?id=" + product.productid;
                }
            });
            html.find(".progress.inp").click(function() {
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
            });
            if (product.countdownsecond > 0) {
                html.find(".progress.reserve")
                    .attr("href", "javascript:void(0)")
                    .children("span").text("即将开售");
            };
            return html;
        };
        ProductFixedListPage.prototype.formatActityRate = function(actityrate) {
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
});