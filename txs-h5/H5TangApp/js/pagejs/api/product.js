define(["require", "exports"], function (require, exports) {
    "use strict";
    var Product;
    (function (Product) {
        function getProductItem(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/item";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductItem = getProductItem;
        function productBuy(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/buy";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.productBuy = productBuy;
        function getCouponList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/couponlist";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getCouponList = getCouponList;
        function getProductBidItem(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/bid";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductBidItem = getProductBidItem;
        function productTransfer(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/producttransfer";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.productTransfer = productTransfer;
        function getProjectintroduction(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/projectintroduction";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProjectintroduction = getProjectintroduction;
        function getProductDetail(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/productdetail";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductDetail = getProductDetail;
        function getSMrepayplan(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/smrepayplan";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getSMrepayplan = getSMrepayplan;
        function getRepayPlanByBid(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/repayplan2";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getRepayPlanByBid = getRepayPlanByBid;
        function getTransferDetail(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/producttransferdetail";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getTransferDetail = getTransferDetail;
        function transferWithdraw(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/producttransferwithdraw";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.transferWithdraw = transferWithdraw;
        function getProductList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/product/list";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Product.getProductList = getProductList;
    })(Product = exports.Product || (exports.Product = {}));
});
