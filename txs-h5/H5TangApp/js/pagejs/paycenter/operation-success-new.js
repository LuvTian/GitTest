var status = $.getQueryStringByName("status");
var amount = $.getQueryStringByName("amount");
var createtime = $.getQueryStringByName("createtime"); //创建时间
var profitstartday = $.getQueryStringByName("profitstartday"); //起息时间
var repaytime = $.getQueryStringByName("repaytime"); //还款时间
var isreservation = eval($.getQueryStringByName("isreservation")); //是否是预约产品
var dealtime = $.getQueryStringByName("dealtime"); //成交时间
var productbidid = $.getQueryStringByName("productbidid");
var tailedrewardamount = $.getQueryStringByName("tailedrewardamount"); //尾标奖励理财金金额
var istailsucess = eval($.getQueryStringByName("istailsucess")); //尾标是否成功
var istailed = eval($.getQueryStringByName("istailed")); //是否是尾标
var bf_mode = $.getQueryStringByName("matchmode");
$(function () {
    pageInit();
});

function pageInit() {
    banner();
    if (bf_mode == 4) {
        $("#accounttext").html("支付的银行卡");
    } else {
        $.sengcaibaobtntext(function (d) {
            $("#accounttext").html(d[2]);
        });
    }
    if (isreservation) {
        $(".pay-mg").attr("src", "/css/img2.0/ps-img4.png");
        $("#isreservation").show();
        $("#dealtime").html(dealtime); //成交时间
        $("#amount").html($.fmoney(amount) + "元预约成功");
        $(".hg").removeClass("hg").addClass("hg4");
    } else {
        if (status == 1) {
            $("#amount").html("投资申请" + $.fmoney(amount) + "元提交成功");
        } else {
            $("#amount").html("投资" + $.fmoney(amount) + "元成功");
        }
    }

    if (status == 1 && istailed && istailsucess) {
        $(".p2p_wb").show();
        $(".p2p_wbtext").html("投资成功后可获");
        $(".p2p_wbcol").html(tailedrewardamount + "元理财金！");
        $(".p2p_wbsize").addClass("pt33");
    } else if (status == 2 && istailed && istailsucess) {
        $(".p2p_wb").show();
        $("#p2p_flook").show();
        $(".p2p_wbcol").html(tailedrewardamount + "元理财金！");
        $("#p2p_flook").click(function () {
            window.location.href = "/html/product/product-financialbuylist.html";
        })
    }
    $("#createtime").html(createtime); //投资时间
    $("#profitstartday").html(profitstartday); //起息时间
    $("#repaytime").html(repaytime); //还款时间

    $("#lookdetail").click(function () {
        if (status == 1) {
            //查看详情（交易记录）
            window.location.replace("/html/my/trans-history.html");
        } else if (status == 2) {
            //查看详情（持仓）
            window.location.replace("/html/my/my-regular-entrust-detail.html?id=" + productbidid + "&inappoint=" + isreservation);
        }
    });

    //继续投资
    $("#productlist").click(function () {
        window.location.replace("/html/product/index.html");
    });
}

function banner() {
    var url = "/StoreServices.svc/Anonymous/system/getbannerbytype";
    var data = {
        "type": "LucioBanner"
    };
    $.AkmiiAjaxPost(url, data, true).then(function (d) {
        if (d.result && d.appbanners.length > 0) {
            $(".banner").show();
            $("#activity-img").click(function () {
                window.location.href = d.appbanners[0].link;
            });
            $("#activity-img").attr({
                "data-src": d.appbanners[0].imageurl,
                "src": $.resurl() + "/css/img2.0/loadbanner.gif"
            });
            $("#activity-img").next().show();
            $._imgLoad($("#activity-img"), function (img) {
                $(img).attr("src", $(img).attr("data-src"));
            });
        }
    });
}