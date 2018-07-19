$(function () {
    getUserInfo();
    getFixedList();
    getRepayPlan();
});
var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            $.CheckAccountCustomStatusBeforeNext(account);
            // if (account.customstatus < 2) {
            //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            // }
            // if (account.customstatus < 3) {
            //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
            //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
            //     });
            // }
            //getFixedList();
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var getFixedList = function () {
    var url = "/StoreServices.svc/product/bid";
    $.AkmiiAjaxPost(url, { "productbidid": $.getQueryStringByName("id") }, true).then(function (data) {
        if (data.result) {
            var bid = data.productbid;
            $("#bid-amount").text("+ " + $.fmoney(bid.bidamount));
            $("#bid-interest").text("+ " + $.fmoney(bid.currentinterest));
            if (bid.penalty > 0) {
                $("#bid-penalty").text("- " + $.fmoney(bid.penalty)).parent.show();
            }
            $("#product-title").text(bid.title);
            $("#profit-loss").text($.fmoney(bid.bidamount + bid.currentinterest - bid.penalty));
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var getRepayPlan = function () {
    var url = "/StoreServices.svc/product/repayplan";
    $.AkmiiAjaxPost(url, { "productbidid": $.getQueryStringByName("id") }, true).then(function (data) {
        if (data.result) {
            var repayplan = data.repayplanlist;
            $.each(repayplan, function (index, entry) {
                var html = [];
                if (entry.islast) {
                    html.push("<div class=\"record-list bb\">");
                    html.push("<div class=\"small-4 columns gray-font\">本金<br/>" + entry.repayday + "</div>");
                    html.push("<div class=\"small-4 columns tc gray-font\">" + entry.statustext + "</div>");
                    html.push("<div class=\"small-4 columns tr gray-font red\">+" + $.fmoney(entry.amount) + "</div></div>");
                    if (entry.penalty > 0) {
                        html.push("<div class=\"record-list bb\">");
                        html.push("<div class=\"small-4 columns gray-font \">提前赎回手续费<br/>" + entry.repayday + "</div>");
                        html.push("<div class=\"small-4 columns tc gray-font\">" + entry.statustext + "</div>");
                        html.push("<div class=\"small-4 columns tr gray-font green\">-" + $.fmoney(entry.penalty) + "</div></div>");
                    }
                } else {
                    html.push("<div class=\"record-list bb\">");
                    html.push("<div class=\"small-4 columns gray-font\">收益<br/>" + entry.repayday + "</div>");
                    html.push("<div class=\"small-4 columns tc gray-font\">" + entry.statustext + "</div>");
                    html.push("<div class=\"small-4 columns tr gray-font red\">+" + $.fmoney(entry.amount) + "</div></div>");
                }
                $(".wrap").append(html.join(''));
            });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};


