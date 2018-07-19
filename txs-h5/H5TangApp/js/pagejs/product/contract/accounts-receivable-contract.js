//应收账款收益权转让合同
var pid = "";
var bid = "";
var loanId = "";
$(function () {
    bid = $.getQueryStringByName("bid");
    pid = $.getQueryStringByName("pid");
    loanId = $.getQueryStringByName("loanid");
    loadDate(pid, bid, loanId);
})

var loadDate = function (pid,bid,loanid) {
    var url = "/StoreServices.svc/product/contract/accountsreceivable";
    var paramer = {
        "productid": pid,
        "productbid": bid,
        "loanid": loanid
    };
    $.AkmiiAjaxPost(url, paramer, true).then(function (data) {
        if (data.result) {
            var info = data.accountsreceivableinfo;
            $("#contractnumber").text(info.contractnumber);
            $("#transfername").text(info.transfername);
            $("#transfercard").text(info.transfercard);
            $("#transferphone").text(info.transferphone);
            $("#investorname").text(info.investorname);
            $("#investorcard").text(info.investorcard);
            $("#investorphone").text(info.investorphone);
            $("#originalcontractnumber").text(info.originalcontractnumber);
            $("#originalcontracttitle").text(info.originalcontracttitle);
            $("#originalcontractamount").text(info.originalcontractamount);
            $("#purchasecontractnumber").text(info.purchasecontractnumber);
            $("#purchasecontracttitle").text(info.purchasecontracttitle);
            $("#purchasecontractnumber2").text(info.purchasecontractnumber);
            $("#purchasecontracttitle2").text(info.purchasecontracttitle);
            $("#purchasecontractamount").text(info.purchasecontractamount);
            $("#investoramount").text(info.investoramount);
            $("#regularrate").text(info.regularrate+"%");
            $("#transfername2").text(info.transfername);
            $("#investorname2").text(info.investorname);
        }
    });
};