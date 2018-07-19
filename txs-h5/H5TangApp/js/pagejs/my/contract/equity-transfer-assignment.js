/// <reference path="../../../_references.js" />
var number = $.getQueryStringByName("number");
$(function() {
    userinfo();
    productinfo();
});

function userinfo() {
    var url = "/StoreServices.svc/product/targetanduseraccountinfo";
    var data = { "productbidid": $.getQueryStringByName("bidid") };
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            if (number == 1) {
                $("#transfername").html(data.transfername_one);
                $("#transferidnumber").html(data.transferidnumber_one);
                $("#transfermobile").html(data.transfermobile_one);
                $("#targetname").html(data.targetname_one);
                $("#targetidnumber").html(data.targetidnumber_one);
                $("#targetmobile").html(data.targetmobile_one);
                $("#id").html(data.id_one);
                $("#sumamount").html($.fmoney(data.remainingamount_one));
                $("#transferamount").html($.fmoney(data.transferamount_one));
                $("#penalty").html($.fmoney(data.penalty_one));
                $("#transferdate").html(data.transferdate_one);

            } else if (number == 2) {
                $("#transfername").html(data.transfername_two);
                $("#transferidnumber").html(data.transferidnumber_two);
                $("#transfermobile").html(data.transfermobile_two);
                $("#targetname").html(data.targetname_two);
                $("#targetidnumber").html(data.targetidnumber_two);
                $("#targetmobile").html(data.targetmobile_two);
                $("#id").html(data.id_two);
                $("#sumamount").html($.fmoney(data.remainingamount_two));
                $("#transferamount").html($.fmoney(data.transferamount_two));
                $("#penalty").html($.fmoney(data.penalty_two));
                $("#transferdate").html(data.transferdate_two);

            }
        }

    })
};

function productinfo() {
    var url = "/StoreServices.svc/product/bid";
    var data = { "productbidid": $.getQueryStringByName("bidid") };
    $.AkmiiAjaxPost(url, data, true).then(function(data) {
        if (data.result) {
            var product = data.productbid;
            $("#penaltyrate").html(rateformat(data.regularproductdetail.penaltyrate)); //罚金

            $("#duration").html(product.duration);
            $("#startdate").html(product.startdate);
            $("#enddate").html(product.enddate);
            $("#productname").html(product.title);
            $("#rate").html(product.productrate);
            $("#typetext").html(product.typetext);
            $("#nextrepayday").html(product.nextrepayday);
            $("#bidamount").html(product.bidamount);
        }
    })
}

//罚金兼容千分和百分
function rateformat(rate) {
    var a = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    if (!!rate) {
        if (rate.length > 1 && rate.length != 0) {
            var b = rate.substr((rate.length - 1), rate.length);
            var num = a[b - 1];
            return "千分之" + num + "";
        } else if (rate.length == 1) {
            var num = a[rate - 1];
            return "百分之" + num + "";
        }
    } else {
        return "千分之二";
    }
}