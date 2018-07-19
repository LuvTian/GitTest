$(function () {
    getUserInfo();
    getFixedList(0);
});
var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            if (account.customstatus < 2) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            }
            if (account.customstatus < 3) {
                $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
                    window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                });
            }
            $("#user-fixed-balance").text(account.fixedbalance);
            $("#user-fixed-profit").text($.fmoney(account.fixedprofit));
            $("#user-fixed-profit-count").text($.fmoney(account.fixedprofitcount));
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var getFixedList = function (productid) {
    var url = "/StoreServices.svc/trans/productbidlist";
    var paramter = {
        "productid": productid,
        "type": 0
    }
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var html = [];
            $.each(data.productbidlist, function (index, entry) {
                $("#user-fix-product").append(createFixedProduct(entry));
                productid = entry.id;
            });

            if (data.productbidlist.length > 0) {
                $.LoanMore($("#user-fix-product"), null, "getFixedList('" + productid + "')");
            } else {
                getHistoryFixedList(0);
                $.LoanMore($("#user-fix-product"), "历史投资");
                $("#user-fix-product .ondata").removeClass("ondata");
            }

        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var getHistoryFixedList = function (productid) {
    var url = "/StoreServices.svc/trans/productbidlist";
    $.AkmiiAjaxPost(url, { "productid": productid, "type": 1 }, true).then(function (data) {
        if (data.result) {
            var html = [];
            $.each(data.productbidlist, function (index, entry) {
                $("#user-fix-product").append(createFixedProduct(entry));
                productid = entry.id;
            });

            if (data.productbidlist.length > 0) {
                $.LoanMore($("#user-history-fix-product"), null, "getHistoryFixedList('" + productid + "')");
            } else {
                $.LoanMore($("#user-history-fix-product"), "没有更多投资记录了");
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var createFixedProduct = function (product) {
    var divHtml = [];

    divHtml.push("<div class=\"finances-list\" onclick=\"javascript:window.location.href='/html/my/user-fixed-detail.html?id=" + product.id + "'\">");
    divHtml.push("<div class=\"invest-time gray-font\">投资时间 " + product.biddate + "</div>");
    divHtml.push("<div class=\"pltitle\">" + product.title + "</div>");
    divHtml.push("<div class=\"row\"><div class=\"small-3 fl\"><span class=\"f28 gray\">" + product.rate + "<i>%</i></span>年化收益率</div>");
    divHtml.push("<div class=\"small-3 fl\"><span class=\"black\">" + product.duration + "</span>投资期限(天)</div>");
    divHtml.push("<div class=\"small-6 fl tr\">");
    if (product.status == 3 || product.status == 5) {
        divHtml.push("<span class=\"green\">+" + product.bidamount + "</span>" + product.statustext);
    } else {
        divHtml.push("<span class=\"red\">-" + product.bidamount + "</span>" + product.statustext);
    }
    divHtml.push("</div></div></div>");
    return divHtml.join('');
};