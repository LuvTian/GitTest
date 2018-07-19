$(function () {
    var productid = $.getQueryStringByName("id");
    var bid = $.getQueryStringByName("bid");
    getDetail(productid, bid);
});

var getDetail = function (productid, bid) {
    var url = "/StoreServices.svc/product/productdetail";
    var param = {
        productid: productid,
        bid: bid
    };
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            var detail = data.regularproductdetail;
            //产品评级 1.0 不显示
            $("#productleavel").html('<b class="zm">' + detail.riskleveltext + '</b>' + detail.riskleveldesc.split('|')[2]);

            $("#closedperiod").html(detail.closedperiod); //封闭期
            $("#counterfee").html(detail.counterfee); //手续费
            //暂时修改为次日起息
            $("#dateofinterest").html(detail.dateofinterest); //起息日
            $("#earlyredemptionfee").html("手续费=投资本金*2%"); //提前赎回手续费
            $("#fitcustomertype").html(detail.riskleveldesc.split('|')[1]); //适合投资客户类型
            $("#projectduration").html(detail.projectduration); //项目期限
            $("#raisetotal").html(detail.raisetotal / 10000 + "万"); //总募集金额

            $("#recruitmentperiod").html(detail.recruitmentperiod); //募集期限
            $("#repaymentmethod").html(detail.repaymentmethod); //还款方式
            var startAmount = parseInt(detail.startamountnote);
            $("#startamountnote").html(startAmount + "元/份，1份起投，投资金额为" + detail.step + "元的整数倍"); //起投金额说明
            if (detail.isoldproduct) {
                $("#productleavel").parent().hide();
                $("#fitcustomer").hide();
                $("#product-right").hide();
                $("#dateofinterest").text("次日起息");
                $("#recruitmentperiod").parent().hide();
                $("#projectduration").text(detail.duration + "天");
                $("#redeemday").text("2");
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
}
