/// <reference path="//_references.js" />


var $divbanner = $("#divbanner");//banner图 list

var orbitbullets = $(".orbit-bullets");

var $totalregisteredcount = $("#totalregisteredcount");//总注册人数
var $totalinvestamount = $("#totalinvestamount");//累计投资金额
var $ProductList = $("#ProductList");//产品列表

$(function () {
    //banner图片
    LoadBanner();

    LoadHome();
});

//获取首页信息
var LoadHome = function () {
    $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/system/gethomeresponseinfo", {}, true).then(function (d) {
        if (d.result) {
            $ProductList.empty();
            $totalinvestamount.html(CalculationMoney(d.cumulativeinvestmentamount));
            $totalregisteredcount.html(CalculationPeople(d.registeredusernumber));

            var productlist = d.recommandproductlist;
            if (productlist) {
                if (d.isonline) {
                    $.each(productlist, function (index, entry) {
                        $ProductList.append(GetProductModelHtml(entry));
                    });
                } else {
                    $.each(productlist, function (index, entry) {
                        $ProductList.append(GetAnonymousProductModelHtml(entry));
                    });
                }
            }
        }
    });
}

//未登录的model
var GetAnonymousProductModelHtml = function (obj) {
    var ha = [];
    var className = obj.type == 99 ? "yellow" : "buff";

    ha.push("<div class=\"fund-list bg-white border margin\"><div class=\"pltitle oh\">");
    ha.push(obj.title + "<span> " + obj.description + "</span>");
    ha.push("</div><div class=\"row noreg\">");
    ha.push("<div class=\"small-7 left\"><span class=\"" + className + "\">●</span> 随存随取<br><span class=\"" + className + "\">●</span> 实时提现</div>");
    ha.push("<div class=\"small-5 left\"><span class=\"" + className + " f28\">");
    ha.push(obj.rate);
    ha.push("%+</span>7日年化收益率</div></div></div>");

    var result = $(ha.join(''));
    result.click(function () {
        if (obj.type == 1) {
            window.location.href = "/html/product/productdetail.html?id=" + obj.productid;
        } else {
            window.location.href = "/html/product/productfixeddetail.html?id=" + obj.productid;
        }
    });
    return result;
}

//已登录的model
var GetProductModelHtml = function (obj) {
    var ha = [];
    ha.push("<article class=\"fund-list bg-white border margin\">");

    if (obj.type == 99) {
        ha.push("<div class=\"newuser\"></div>");
    }
    ha.push("<div class=\"small-8 left productdetail\"><div class=\"pltitle\">");
    ha.push(obj.title + "<span> " + obj.description + "</span>");
    ha.push("</div><div class=\"row\"><div class=\"small-4 left productdetail\"><span class=\"f28 red\">");
    ha.push(obj.rate);
    ha.push("<i>%</i></span>年化收益率</div><div class=\"small-4 left productbidcount\"><span class=\"red\">");
    ha.push(obj.bidcount);
    ha.push("</span>投资人数</div><div class=\"small-4 left productdetail\"><span class=\"black\">");
    ha.push((obj.totalamount / 10000));
    ha.push("</span>项目金额(万)</div></div></div><div class=\"small-4 left\">");
    if (obj.status < 5) {
        ha.push("<div class=\"progress reserve\">");
        ha.push("<span onclick=\"javascript:appoint('" + obj.productid + "')\">预约提醒</span>");
    } else if (obj.status == 5) {
        var process = (Math.ceil(obj.purchaseprogress / 10) * 10);

        ha.push("<div class=\"progress inp in" + process + "\">");

        var buyUrl = obj.type == 1 ? "/html/product/productbuy.html?id=" : "/html/product/productfixedbuy.html?id=";
        buyUrl += obj.productid;

        ha.push("<span onclick=\"javascript:window.location.href='" + buyUrl + "'\">" + obj.purchaseprogress + "%</span>");
    } else {
        ha.push("<div class=\"progress end\">");
        ha.push("<span>已售罄</span>");
    }

    ha.push("</div></div></article>");

    var result = $(ha.join(''));
    //投资人数列表
    //$(result).find(".productbidcount").click(function () {
    //    window.location.href = "/html/product/productbidlist.html?id=" + obj.productid;
    //});

    //产品详情
    $(result).find(".productdetail").click(function () {
        if (obj.type == 1) {
            window.location.href = "/html/product/productdetail.html?id=" + obj.productid;
        } else {
            window.location.href = "/html/product/productfixeddetail.html?id=" + obj.productid;
        }
    });
    return result;
}

//获取banner
var LoadBanner = function () {
    var data = { "type": "TopBanner" };
    $.AkmiiAjaxPost("/StoreServices.svc/anonymous/system/getbannerbytype", data, true).then(function (d) {
        if (d.result) {
            if (d.appbanners.length > 0) {
                var ha = [];
                var hao = [];
                $.each(d.appbanners, function (i, item) {
                    var className = i == 0 ? "class=\"active\"" : "";
                    ha.push("<li " + className + "><img src=\"" + item.imageurl + "\" /></li>");
                    hao.push("<li " + className + " data-orbit-slide=\"" + i + "\"></li>");
                });

                $divbanner.empty().html(ha.join(''));
                orbitbullets.empty().html(hao.join(''));
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
        }
    });
};

//计算投资金额
var CalculationMoney = function (number) {
    if ($.isNumeric(number)) {
        var str = number.toString();
        var resultHtml = [];
        if (number < 10000) {
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
        }
        else if (number < 100000000) {
            str = str.substr(0, str.length - 4);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("万");
        }
        else {
            str = str.substr(0, str.length - 8);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("亿");
            str = number.toString();
            str = str.substring(str.length - 8, str.length - 4);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("万");
        }
        return (resultHtml.join(''));
    }
};

//计算注册人数
var CalculationPeople = function (number) {
    if ($.isNumeric(number)) {
        var str = number.toString();
        var resultHtml = [];
        if (str.length > 8) {
            str = str.substr(0, str.length - 8);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("亿");
        }
        if (number.toString().length > 4) {
            str = number.toString();
            str = str.substring(str.length - 8, str.length - 4);
            for (var i = 0; i < str.length ; i++) {
                resultHtml.push("<span>" + str.charAt(i) + "</span> ");
            }
            resultHtml.push("万");
        }
        str = number.toString();
        str = str.substring(str.length - 4, str.length);
        for (var i = 0; i < str.length ; i++) {
            resultHtml.push("<span>" + str.charAt(i) + "</span> ");
        }
        resultHtml.push("人");
        return (resultHtml.join(''));
    }
};


var appoint = function (productid) {
    var data = {
        productid: productid
    };
    var url = "/StoreServices.svc/product/appoint";
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            $.alertF("预约成功，我们将会在产品开售前通过短信通知您，敬请留意！");
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};