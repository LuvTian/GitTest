$(function () {
    getUserInfo();
});
var lastProductId = "0";
var accountResult;
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            accountResult = data;
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $(".usercenter").attr("href", "/html/anonymous/login.html");
            $(".qujin-nav").attr("href", "/html/anonymous/login.html");
        }
        getProductList(0);
    });
};

var getProductList = function (lastId) {
    if (!lastId) {
        lastId = 0;
    }
    var data = {
        lastproductid: lastId,
        producttype: 1
    };
    var url = "/StoreServices.svc/product/list";
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            var list = data.productlist;
            $.each(list, function (index, entry) {

                //$(".pid-" + entry.productid).remove();
                var html = "";
                if (entry.status < 5) {
                    html = initReadyProduct(entry);
                } else if (entry.status == 5) {
                    html = initSoling(entry);
                } else {
                    html = initSoldOut(entry);
                }

                var pHtml = $(".pid-" + entry.productid);
                if (pHtml.length > 0) {
                    pHtml.replaceWith(html);
                } else {
                    $("#product-list").append(html);
                }
                lastProductId = entry.productid;
            });
            if (list.length > 0) {
                $.LoanMore($("#product-list"), null, "getProductList('" + lastProductId + "')");
            } else {
                $.LoanMore($("#product-list"), "没有更多产品了");
            }
        }
    });
    setTimeout("getProductList(0)", 30000);
};

var initReadyProduct = function (product) {
    var htmlArray = [];
    var neednewuser = (product.type == 99);
    var matchProcess = Math.ceil(product.matchprogress / 10) * 10;

    htmlArray.push("<article class=\"fund-list bg-white border margin pid-" + product.productid + "\">");
    if (neednewuser) {
        htmlArray.push("<div class=\"newuser\"></div>");
    }
    htmlArray.push("<div class=\"small-8 left\">");
    htmlArray.push("<div class=\"pltitle oh\">" + product.title + "<span class=\"gray\">" + $.null2str(product.description) + "</span></div>");
    htmlArray.push("<div class=\"row\">");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"f28 red\">" + product.rate + "<i>%</i></span>年化收益率</div>");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"red\">" + product.appointment + "</span>预约人数</div>");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"black\">" + (product.totalamount / 10000) + "</span>项目金额(万)</div>");
    htmlArray.push("</div></div><div class=\"small-4 left\">");

    htmlArray.push("<a class=\"progress reserve\" href=\"javascript:appoint('" + product.productid + "')\">");
    htmlArray.push("<span>预约提醒</span></a></div></article>");

    var html = $(htmlArray.join(""));

    html.find(".small-8.left").click(function () {
        window.location.href = "/html/product/productdetail.html?id=" + product.productid;
    });
    if (product.isappointment) {
        html.find(".progress.reserve")
            //.addClass("end").removeClass("reserve")
            .attr("href", "javascript:void(0)")
            .children("span").text("已预约");
    }
    return html;
};

var initSoling = function (product) {
    var process = Math.ceil(product.purchaseprogress / 10) * 10;
    var htmlArray = [];

    htmlArray.push("<article class=\"fund-list bg-white border margin pid-" + product.productid + "\">");
    htmlArray.push("<div class=\"small-8 left\">");
    htmlArray.push("<div class=\"pltitle oh\">" + product.title + "<span class=\"gray\">" + $.null2str(product.description) + "</span></div>");
    htmlArray.push("<div class=\"row\">");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"f28 red\">" + product.rate + "<i>%</i></span>年化收益率</div>");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"red\">" + product.bidcount + "</span>投资人数</div>");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"black\">" + (product.totalamount / 10000) + "</span>项目金额(万)</div>");
    htmlArray.push("</div></div><div class=\"small-4 left\">");

    var isNewUserFixed = true;
    if (product.countdownsecond > 0) {
        htmlArray.push("<a class=\"progress reserve\">");
        htmlArray.push("<span id=\"pl-num\">即将开标</span></a></div></article>");
        isNewUserFixed = false;
    } else {
        var url = "/html/product/productbuy.html?id=" + product.productid;

        if (accountResult && accountResult.ismaintenance) {
            url = "/html/system/data-processing.html";
            isNewUserFixed = false;
        }
        if (accountResult && accountResult.isglobalmaintenance) {
            url = "/html/system/system-maintenance.html";
            isNewUserFixed = false;
        }

        htmlArray.push("<a class=\"progress inp in" + process + "\" href=\"" + url + "\">");

        htmlArray.push("<span id=\"pl-num\">" + product.purchaseprogress + "%</span></a></div></article>");
    }

    var html = $(htmlArray.join(""));

    //特殊渠道必须先买新手标
    if (isNewUserFixed && accountResult && accountResult.accountinfo.isnewuser) {
        html.find(".progress").attr("href", "javascript:void(0);").click(function () {
            $.alertF(accountResult.accountinfo.isnewusermsg, "立即投资", function () {
                window.location.href = "/Html/Product/productfixedlist.html";
            });
        });
    }

    html.find(".small-8.left").click(function () {
        window.location.href = "/html/product/productdetail.html?id=" + product.productid;
    });

    return html;
};

var initSoldOut = function (product) {
    var htmlArray = [];

    htmlArray.push("<article class=\"fund-list bg-white border margin pid-" + product.productid + "\">");
    htmlArray.push("<div class=\"small-8 left\">");
    htmlArray.push("<div class=\"pltitle oh\">" + product.title + "<span class=\"gray\">" + $.null2str(product.description) + "</span></div>");
    htmlArray.push("<div class=\"row\">");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"f28 red\">" + product.rate + "<i>%</i></span>年化收益率</div>");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"red\">" + product.bidcount + "</span>投资人数</div>");
    htmlArray.push("<div class=\"small-4 left\"><span class=\"black\">" + (product.totalamount / 10000) + "</span>项目金额(万)</div>");
    htmlArray.push("</div></div><div class=\"small-4 left\">");
    htmlArray.push("<div class=\"progress end\">");
    htmlArray.push("<span id=\"pl-num\">已售罄</span></div></div></article>");
    var html = $(htmlArray.join(""));
    html.find(".small-8.left").click(function () {
        window.location.href = "/html/product/productdetail.html?id=" + product.productid;
    });
    return html;
};

var appoint = function (productid) {
    var data = {
        productid: productid
    };
    var url = "/StoreServices.svc/product/appoint";
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            $.alertF("预约成功，我们将会在产品开售前通过短信通知您，敬请留意！");
            $(".pid-" + productid + " .progress.reserve")
                .addClass("end").removeClass("reserve")
                .attr("href", "javascript:void(0)")
                .children("span").text("已预约");

        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg, null, getProductList);
        }
    });
};