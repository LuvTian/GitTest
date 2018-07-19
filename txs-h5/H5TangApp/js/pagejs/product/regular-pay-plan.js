//define(["require", "exports", '../api/product'], function (require, exports, product_1) {
$(function () {
    "use strict";
    var Product = {};
    Product.getSMrepayplan = function getSMrepayplan(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/smrepayplan";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }

    var RegularPayPlanClass = (function () {
        function RegularPayPlanClass() {
            this.ProductId = $.getQueryStringByName("productid");
            this.BidAmount = Number($.getQueryStringByName("bidamount"));
            this.ProductName = $.getQueryStringByName("productname");
            this.getRegularPayPlan();
        }
        RegularPayPlanClass.prototype.getRegularPayPlan = function () {
            var topDom = this;
            $(".pdtname").html(topDom.ProductName);
            $(".pdtamount").html("" + topDom.BidAmount);
            Product.getSMrepayplan({ productid: topDom.ProductId, bidamount: topDom.BidAmount }, function (data) {
                if (data) {
                    $("#intereststotal").html($.fmoney(data.intereststotal));
                    var ha = [];
                    $.each(data.repayplanlist, function (index, item) {
                        ha.push('<li class="bb"><span class="nouseinterest">' + item.repayday + '</span> <span class="nouseinterest">' + $.fmoney(item.capital) + '</span> <span class="nouseinterest">' + $.fmoney(item.interests) + '</span> </li>');
                    });
                    $("#recordPlanList").append($(ha.join('')));
                }
            });
        };
        return RegularPayPlanClass;
    }());
    var RegularPayPlan = new RegularPayPlanClass();
});
