var bidid = $.getQueryStringByName("bid");

var id = 0;
var loanid = 0;
var qyloanid = 0;
var product = [];
var vtype = $.getQueryStringByName("vtype");
var _saletype = $.getQueryStringByName("saletype");
$(function () {
    $("#increaType-" + _saletype).show();
    if (!$.isNull(bidid)) {
        qyloanid = $.getQueryStringByName('loanid');
        userInfo();
        getProductBidItem();
    }
});

function userInfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            $("#username").html(account.username);
            $("#usercardnumber").html(account.idnumber);
            $("#userphone").html(account.bankmobile);
        }
    });
}


function getProductBidItem() {
    var url = "/StoreServices.svc/product/bid";
    var data = { productbidid: bidid };
    // 周周僧
    if (vtype == 1) {
        url = "/StoreServices.svc/user/productbidladderdetail";
    }
    $.AkmiiAjaxPost(url, data, false).then(function (data) {
        if (data.result) {
            product = data.productbid;
            id = product.productid;
            $("#rate").html(product.rate + "%");
            $("#startdate").html(product.startdate);
            $("#enddate").html(product.enddate);
            $("#huankdate").html(product.enddate);
            $("#huankamount").html((product.bidamount + product.interest) + "元");
            productinfo(id);
            if (!_saletype) {
                $("#increaType-" + data.productbid.saletype).show();
            }
        }
    });
}

// 通过loadid搜索对象
var getObjByloanId = function (loadObj, loanid) {
    var tmpobj = null;
    $.each(loadObj, function (i, k) {
        if (k.loanid == loanid) {
            tmpobj = k;
        }
    });
    return tmpobj;
}

var getLoanBid = function (bidid, assetrecordid, publisher) {
    var url = "/StoreServices.svc/trans/loanbid";
    $.AkmiiAjaxPost(url, { "productid": id, "bidid": bidid }, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            var loanobj = getObjByloanId(tranList, qyloanid) || tranList[0];
            loanid = loanobj.loanid;
            $("#bidamount").html(loanobj.amount + "元");
            $(".borrowename").html(loanobj.borrowename);
            $(".borroweidnumber").html(loanobj.borroweidnumber);
            $(".borrowaddr").html(loanobj.borroweraddress);
            $("#jkyt").html(loanobj.usage);
            $("#contractid").html(loanobj.contractid);
            $("#jkfangkdate").html(loanobj.productraisingenddate);
            $("#signdate").html(loanobj.productraisingenddate);
            safedetailinfo(assetrecordid, publisher);
        }
    });
}


function productinfo(id) {
    var url = "/StoreServices.svc/product/item";
    var paramter = {
        productid: id
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            $(".typetext").html(data.productinfo.typetext);
            $(".lockduration").html(data.productinfo.lockduration);
            getLoanBid(product.id, data.productinfo.assetrecordid, data.productinfo.publisher);
        }
    });
}

function safedetailinfo(assetrecordid, publisher) {
    var url = "/StoreServices.svc/product/projectintroduction";
    var paramter = {
        productid: id,
        assetrecordid: assetrecordid,
        publisher: publisher,
        loanid: loanid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
        if (data.result) {
            var projectintroduction = data.projectintroduction
            $("#issuername").html(projectintroduction.cooperativeorganization); /// 合作机构
            $("#assettype").html(projectintroduction.loantypedes); /// 资产类型
        }
    });
}

