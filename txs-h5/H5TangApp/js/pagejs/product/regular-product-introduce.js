//define(["require", "exports", '../api/product'], function (require, exports, product_1) {
$(function () {

    "use strict";
    var Product = {};
    Product.getProjectintroduction = function getProjectintroduction(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/product/projectintroduction";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }

    var RegularProductIntroduceClass = (function () {
        function RegularProductIntroduceClass() {
            this.ProductId = $.getQueryStringByName("id");
            this.getIntroductionDetail();
        }
        RegularProductIntroduceClass.prototype.getIntroductionDetail = function () {
            var topDom = this;
            Product.getProjectintroduction({ productid: topDom.ProductId }, function (data) {
                if (data) {
                    var introduction = data.projectintroduction;
                    $("#assetprofile").append(introduction.assetprofile);
                    $("#cooperativeorganization").html(introduction.cooperativeorganization);
                    $("#documentdisplay").attr("src", introduction.documentdisplay);
                    $("#transferor").html(introduction.transferor);
                }
                else {
                    $.alertF(data.errormsg, null, history.back());
                }
            });
        };
        return RegularProductIntroduceClass;
    }());
    var RegularProductIntroduce = new RegularProductIntroduceClass();
});
