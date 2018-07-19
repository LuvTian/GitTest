;
/***
  * 还款计划入口, Created by Eddie Wang, 2015-12-31
 **/
$(function () {
    var pageSettings = { pageIndex: 1, pageCount: 1 };
    var productID = getUrlRequestParamater("productid");
    var bidAmount = getUrlRequestParamater("bidamount");
    bidAmount = $.trim(bidAmount) == "" ? "0" : bidAmount;
    initRepaymentPlan(pageSettings, $.trim(productID), $.trim(bidAmount));
});
/***
  * 初始化还款计划相关数据
 **/
var initRepaymentPlan = function (pageSettings, productID, bidAmount) {
    var url = "/StoreServices.svc/product/smrepayplan";
    var pdata = { productid: productID, bidamount: bidAmount };
    var productName = getUrlRequestParamater("productname");
    $(".pdtname").html(productName);
    $(".pdtamount").html(bidAmount);
    $.AkmiiAjaxPost(url, pdata, true).always(function (data) {
        var rplist = [];
        if (data.result && data.repayplanlist) {
            rplist = data.repayplanlist;
        }
        if ($.isArray(rplist) && rplist.length > 0) {
            var pIndex = pageSettings.pageIndex;
            var pCount = pageSettings.pageCount;
            showRepayPlanAll(rplist);
            $(".nodata").hide();
            $(".loadmore").hide();
        } else {
            $(".nodata").show();
            $(".loadmore").hide();
        }
    });
};
/***
  * 展示所有还款计划数据
 **/
var showRepayPlanAll = function (rplist) {
    if ($.isArray(rplist) && rplist.length > 0) {
        var tmplt = $(".tmplt-rpitem").html();
        $.each(rplist, function (index, item) {
            var t = tmplt;
            t = t.replace(/\$\{RepayNum\}/g, "第" + (item.islast && rplist.length > 1 ? (rplist.length - 1) : (index + 1)) + "期");
            t = t.replace(/\$\{AmountType\}/g, (item.islast ? "本金" : "利息"));
            //t = t.replace(/\$\{Status\}/g, item.statustext);
            t = t.replace(/\$\{Amount\}/g, cutDigitNumber(item.amount, 2));
            $(".rpitemanchor").before(t);
        });
    }
};
/***
  * 展示部分还款计划数据
 **/
var showRepayPlanParts = function (rplist, pidx, pct) {
    if ($.isArray(rplist) && rplist.length > 0) {
        var tmplt = $(".tmplt-rpitem").html();
        $.each(rplist, function (index, item) {
            if (index >= ((pidx - 1) * pct) && index < (pidx * pct)) {
                var t = tmplt;
                t = t.replace(/\$\{RepayDay\}/g, item.repayday);
                t = t.replace(/\$\{AmountType\}/g, (item.islast ? "本金" : "利息"));
                t = t.replace(/\$\{Status\}/g, item.statustext);
                t = t.replace(/\$\{Amount\}/g, $.fmoney(item.amount,2));
                $(".rpitemanchor").before(t);
            }
        });
        if (rplist.length > pidx * pct) {
            $(".nodata").hide();
            $(".loadmore").show();
        } else {
            $(".nodata").hide();
            $(".loadmore").hide();
        }
    }
};
/***
  * 获取url参数
 **/
var getUrlRequestParamater = function (name) {
    var url = window.location.href;
    var reg = new RegExp("(^|[&?]+)(" + name + ")=([^&]*)(&|$)");
    var mts = url.match(reg);
    if (mts && mts.length > 3) {
        return decodeURIComponent(mts[3]);
    } else {
        return "";
    }
};
/***
  * 数字大写处理(1-99内的数字)
 **/
var toUpperNumber = function (v) {
    var upperNum1 = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    if (v > 0 && v < 99) {
        if (v <= 10) {
            return upperNum1[v - 1];
        } else {
            var vn1 = v.toString()[0];
            var vn2 = v.toString()[1];
            if (Number(vn1) == 1) {
                return "十" + upperNum1[Number(vn2) - 1];
            } else {
                return $.trim(upperNum1[Number(vn1) - 1] + "十" + (Number(vn2) == 0 ? "" : upperNum1[Number(vn2) - 1]));
            }
        }
    } else {
        return v;
    }
};
/***
  * 数字小数位处理，返回对应数字字符表示
 **/
var cutDigitNumber = function (v, n) {
    var a = v.toString().split(".");
    if (a.length == 2) {
        if (a[1].length > n) {
            a[1] = a[1].substr(0, n);
        } else if (a[1].length < n) {
            for (var i = 0; i < (n - a[1].length) ; i++) {
                a[1] += "0";
            }
        }
    } else {
        if (n > 0) {
            a.push("0");
            for (var i = 0; i < (n - 1) ; i++) {
                a[1] += "0";
            }
        }
    }
    return a[0] + (n > 0 ? ("." + a[1]) : (""));
};
/***
  * date增加毫秒数（分钟需换成毫秒）
 **/
var addDateMilliseconds = function (d, s) {
    var dt = new Date(d);
    dt = dt.valueOf() + s;
    dt = new Date(dt);
    return dt;
};