/// <reference path="/_references.js" />

var pid = $.getQueryStringByName("pid");
var productinfo = [];
var loanId = $.getQueryStringByName("id");
    var productBid = $.getQueryStringByName("bid");
    var loantype = $.getQueryStringByName("loantype");
$(function () {
    getLoanBidItem(loanId, productBid);
});

var getLoanBidItem = function (loanid, productbid) {
    var url = "/StoreServices.svc/trans/loanbiditem";
    $.AkmiiAjaxPost(url, { "loanid": loanid, "productid": productbid }, true).then(function (data) {
        if (data.result) {
            productitem(data.loanbiditem);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var productitem = function (bidItem) {
       var data = {"productid": pid};
        var url = "/StoreServices.svc/product/item";
        $.AkmiiAjaxPost(url, data, true).then(function (d) {
            if (d.result) {
                productinfo = d.productinfo;
                initBidItem(bidItem)
            }
        });
    }

var initBidItem = function (bidItem) {
        if (productinfo.isentrust) {
            $("#linlcontract").attr("href", "/html/my/myloan-agreement-detail.html?id=" + bidItem.loanid + "&bidid=" + $.getQueryStringByName("bid") + "&pid=" + $.getQueryStringByName("pid"));
        }
        else {
            $("#linlcontract").attr("href", "/html/my/userloancontract.html?id=" + bidItem.loanid + "&bid=" + $.getQueryStringByName("bid"));
        }
        $("#holddate").text(bidItem.holddate);
        $("#contractid").text(bidItem.contractid);
        $("#amount").text("+" + bidItem.amount);
        $("#borrowename").text(bidItem.borrowename);
        $("#borroweidnumber").text(bidItem.borroweidnumber);
        $("#repaydate").text(bidItem.repaydate);
        if (productinfo.matchmode == 0) {
            $("#contractid_text").text("债权转让协议编号：");//协议名称
            $("#borrowename_text").text("发行人");//发行人
            $("#borroweamount_text").text("转让方投资规模");//投资规模
            $("#repaycount_text").text("基础产品缓存期限");//期限
            $("#loantitle_text").hide();//隐藏产品名称
            $("#borroweamount").text(bidItem.borroweamount + "元");
            $("#repaycount").text(bidItem.repaycount);
        }
        // else if (productinfo.matchmode == 1) {
        //     $.UpdateTitle("受托人详情");
        //     $("#contractid_text").text("定向委托投资协议编号：");//协议名称
        //     $("#borrowename_text").text("受托人");//发行人
        //     $("#borroweamount_text").text("定向投资标的期限");
        //     $("#borroweamount").html(bidItem.repaycount);
        //     $("#repaycount_text").parent().hide();
        // }
        else {
            $.UpdateTitle("受托人详情");
            $("#contractid_text").text("定向委托投资协议编号：");//协议名称
            $("#borrowename_text").text("受托人");//发行人
            $("#borroweamount_text").text("定向委托托管期限");//投资规模
            $("#borroweamount").html(bidItem.repaycount);
            $('.record-dxwt').hide();
            // $("#repaycount_text").text("受托投资金额");//期限
            // $("#repaycount").html($.fmoney(bidItem.borroweamount) + "元");
        }
        if (bidItem.type == 1) {
            $("#loantitle").hide();
        } else {
            $("#loantitle").text(bidItem.loantitle).show();
        }
        $("#product-safaty").attr("href", "/Html/Product/contract/regular-product-safedetail.html?matchmode=" + productinfo.matchmode + "&assetrecordid=" + productinfo.assetrecordid + "&publisher=" + productinfo.publisher + "&id="+productinfo.productid);
       
    };