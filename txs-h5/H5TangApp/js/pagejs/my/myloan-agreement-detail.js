//define(["require", "exports", '../api/product'], function (require, exports, product_1) {
$(function () {
    "use strict";
    var Product = {};
    Product.getProductBidItem = function (request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/bid";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    var MyloanAgreementDetail = (function () {
        function MyloanAgreementDetail() {
            this.bid = $.getQueryStringByName("bidid");
            this.productId = $.getQueryStringByName("pid");
            this.lonId = $.getQueryStringByName("id");
            this.PageInIt();
            this.getproductBid();
        }
        MyloanAgreementDetail.prototype.PageInIt = function () {
            var topDom = this;
            var url = "/StoreServices.svc/product/targetanduseraccountinfo";
            var data = { "productbidid": $.getQueryStringByName("bidid") };
            $.AkmiiAjaxPost(url, data, true).then(function (data) {
                if (data.result) {
                    if (!$.isNull(data.transfername_one) && !$.isNull(data.targetname_one)) {
                        $("#myloan-detail-trans").attr("href", "/html/my/contract/equity-transfer-assignment.html?bidid={0}&loanid={1}".replace('{0}', topDom.bid).replace('{1}', topDom.lonId) + "&number=1").show();
                    }
                }
            });
        };
        MyloanAgreementDetail.prototype.getproductBid = function () {
            var topDom = this;
            Product.getProductBidItem({ productbidid: topDom.bid }, function (data) {
                var productbid = data.productbid;
                if (productbid.saletype == "98" ||productbid.saletype == "97"||productbid.saletype == "96") {
                    $("#myloan-detail-base").attr("href", "/html/product/contract/dingxiangweituozzs.html?bidid={0}&vtype=1&loanid={1}".replace('{0}', topDom.bid).replace('{1}', topDom.lonId));
                    return;
                }
                if (productbid.matchmode <= 1) {
                    $("#myloan-detail-base").attr("href", "/html/product/contract/dingxiangweituoxieyi.html?bidid={0}&loanid={1}".replace('{0}', topDom.bid).replace('{1}', topDom.lonId));
                }
                else {
                    $("#myloan-detail-base").attr("href", "/html/product/contract/cxdingxiangweituoxieyi.html?bidid={0}&loanid={1}".replace('{0}', topDom.bid).replace('{1}', topDom.lonId));
                }

            });
        };
        return MyloanAgreementDetail;
    }());
    var myloanAgreementDetail = new MyloanAgreementDetail();
});
