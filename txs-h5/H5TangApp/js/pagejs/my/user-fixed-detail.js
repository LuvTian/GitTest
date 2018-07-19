$(function () {
    getUserInfo();
    getFixedList();
});
var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            if (account.customstatus < 3) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            }
            //$("#user-fixed-balance").text(account.fixedbalance);
            //$("#user-fixed-profit").text($.fmoney(account.fixedprofit));
            //$("#user-fixed-profit-count").text($.fmoney(account.fixedprofit));
            ////getFixedList();
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
            $("#product-title").text(bid.title);
            $("#product-biddate").text(bid.biddate);
            $("#product-rate").text(bid.rate);
            $("#product-bidamount").text(bid.bidamount);
            $("#product-duration").text(bid.duration);
            $("#product-guaranteetypetext").text(bid.guaranteetypetext);
            $("#product-interest").text(bid.interest);
            $("#product-type-text").text(bid.typetext);
            $("#product-redeem-date").text(bid.startdate + "-" + bid.enddate);
            $("#product-amount").text(bid.amount / 10000 + "万");

            $("#product-statustext").text(bid.statustext);
            $("#product-detail-link").attr("href", "/html/product/productfixeddetail.html?id=" + bid.productid);
            $("#product-loan-link").attr("href", "/html/my/userloanbid.html?id=" + bid.id);
            if (bid.status == 3 || bid.status == 4) {//3已赎回 4赎回中
                $(".buying").show();
                $("#btn-profit").removeClass("ransom").addClass("ransom-on").text(bid.statustext).unbind("click");
                $("#btn-profit").css("background-color", "gray");
            } else if (bid.status == 2) {
                $("#product-nextrepayday").prepend("下次还款预计：" + bid.nextrepayday);
            }
            $("#product-repayplan-link").attr("href", "/html/my/user-repay-plan.html?id=" + bid.id);
            if (bid.canredeem) {
                $(".buying").show();
                $("#btn-profit").removeClass("ransom-on").addClass("ransom").text("提前赎回").bind("click", redeem);
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var redeem = function () {
    $.confirmF("提前赎回需要扣除一定的手续费(本金×2%)，您确定要提前赎回么？", null, null, null, function () {
        $.PaymentHtml(null, function (password) {
            var url = "/StoreServices.svc/trans/redeemfixed";
            var data = { "paypassword": password, "productbidid": $.getQueryStringByName("id") };
            $.AkmiiAjaxPost(url, data, true).then(function (data) {
                if (data.result) {
                    $.alertF("赎回成功", null, function () { window.location.href = "/html/my/user-fixed.html"; });
                } else if (data.errorcode == "20019") {
                    $.confirmF(data.errormsg, null, "去重置", function () {
                        $(".reset").click();
                    }, function () {
                        window.location.href = "/html/my/resetpassword.html";
                    });
                }
                else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            });
        }, function () {

        });
    });

};