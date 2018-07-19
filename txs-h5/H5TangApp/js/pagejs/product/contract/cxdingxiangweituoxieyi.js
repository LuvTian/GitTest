var bidid = $.getQueryStringByName("bidid");
var id = 0;
var loanid = 0;
var qyloanid = 0;
var vtype = $.getQueryStringByName("vtype");
$(function () {
    qyloanid = $.getQueryStringByName('loanid');
    if (!$.isNull(bidid)) {
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
        }
    });
}


function getProductBidItem() {
    var url = "/StoreServices.svc/product/bid";
    var data = { productbidid: bidid };
    if (vtype == 1) {
        url = "/StoreServices.svc/user/productbidladderdetail";
    }
    $.AkmiiAjaxPost(url, data, false).then(function (data) {
        if (data.result) {
            var product = data.productbid;
            id = product.productid;
            //$("#bidamount").html(product.amount + "元");
            $("#rate").html(product.rate + "%");
            $("#startdate").html(product.startdate);
            $("#enddate").html(product.enddate);
            $(".duration").html(product.duration);
            //getLoanBid(product.id);
            // productinfo(id);
            getLoanBid(id, product.id);
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

var getLoanBid = function (id, bidid) {
    var url = "/StoreServices.svc/trans/loanbid";
    $.AkmiiAjaxPost(url, { "productid": id, "bidid": bidid }, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            var loanobj = getObjByloanId(tranList, qyloanid) || tranList[0];
            loanid = loanobj.loanid;
            $("#bidamount").html(loanobj.amount + "元");
            $(".borrowename").html(loanobj.borrowename);
            //$("#productname").html(loanobj.assetnum + '期');
            $("#productname").data('numq', loanobj.assetnum + '期');
            $(".borroweidnumber").html(loanobj.borroweidnumber);
            $(".name").html(loanobj.legalperson);
            productinfo(id);
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
            safedetailinfo(data.productinfo.assetrecordid, data.productinfo.publisher);
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
            var assetrecordmodel = data.assetrecordmodel;
            //$("#productname").html(assetrecordmodel.assetrecordname);
            $("#productname").html(assetrecordmodel.assetrecordname + ($("#productname").data('numq') || ''));
            $("#exchangename").html(assetrecordmodel.exchangename);/// 备案交易所
            $("#issuername").html(assetrecordmodel.issuername); /// 发行机构
            $("#assettype").html(assetrecordmodel.assettype); /// 资产类型
        }
    });
}

