$(function () {
    var TransferAssignmentList = (function () {
        function TransferAssignmentList() {
            this.bid = $.getQueryStringByName("bidid");
            this.PageInIt();
        }
        TransferAssignmentList.prototype.PageInIt = function () {
            var topDom = this;
            var url = "/StoreServices.svc/product/targetanduseraccountinfo";
            var data = { "productbidid": $.getQueryStringByName("bidid") };
            $.AkmiiAjaxPost(url, data, true).then(function (data) {
                if (data.result) {
                    if (!$.isNull(data.transfername_one) && !$.isNull(data.targetname_one) && $.isNull(data.targetname_two)) {
                        $("#myloan-detail-trans-two").hide();
                        $("#myloan-detail-trans-one").attr("href", "/html/my/contract/equity-transfer-assignment.html?bidid=" + topDom.bid + "&number=1");
                    }
                    else if (!$.isNull(data.transfername_one) && !$.isNull(data.targetname_one) && !$.isNull(data.targetname_two)) {
                        $("#myloan-detail-trans-one").attr("href", "/html/my/contract/equity-transfer-assignment.html?bidid=" + topDom.bid + "&number=1");
                        $("#myloan-detail-trans-two").attr("href", "/html/my/contract/equity-transfer-assignment.html?bidid=" + topDom.bid + "&number=2");
                    }
                    else if ($.isNull(data.transfername_one) && $.isNull(data.targetname_one) && $.isNull(data.targetname_two)) {
                        $("#myloan-detail-trans-one").hide();
                        $("#myloan-detail-trans-two").hide();
                        $("#loanmore").show();
                        $.LoanMore($("#loanmore"), "暂无资产权益转让及受让协议");
                    }
                }
                else {
                    $("#myloan-detail-trans-one").hide();
                    $("#myloan-detail-trans-two").hide();
                    $("#loanmore").show();
                    $.LoanMore($("#loanmore"), "暂无资产权益转让及受让协议");
                }
            });
        };
        return TransferAssignmentList;
    }());
    var transferassignmentlist = new TransferAssignmentList();
});
