$(function() {
    $.AkmiiAjaxPost("/StoreServices.svc/product/txsp2pdisclosureoperationinfo", {}, false).then(function(data) {
        if (!!data.disclosureinfo && JSON.stringify(data.disclosureinfo) != "{}") {
            var obj = data.disclosureinfo;
            $(".date").text("(截至" + dataFormat(obj.date) + ")");
            $(".accumulativeloanamount").text(moneyFormat(obj.accumulativeloanamount)); //累计借贷金额
            $(".accumulativeloannumber").text(dataFormat(obj.accumulativeloannumber));
            $(".loanbalance").text(moneyFormat(obj.loanbalance));   //借贷余额
            $(".loanbalancenumber").text(dataFormat(obj.loanbalancenumber));
            $(".loanrelatedbalance").text(moneyFormat(obj.loanrelatedbalance)); //关联关系借款余额
            $(".loanrelatedbalancenumber").text(dataFormat(obj.loanrelatedbalancenumber));
            $(".accumulativeborrowernumber").text(dataFormat(obj.accumulativeborrowernumber));
            $(".currentperiodborrowernumber").text(dataFormat(obj.currentperiodborrowernumber));
            $(".toptennonrepaymentproportion").text(dataFormat(obj.toptennonrepaymentproportion));
            $(".maxamountnonrepaymentproportion").text(dataFormat(obj.maxamountnonrepaymentproportion));
            $(".accumulativelendernumber").text(dataFormat(obj.accumulativelendernumber));
            $(".currentperiodlendernumber").text(dataFormat(obj.currentperiodlendernumber));
            $(".overdueamount").text(dataFormat(obj.overdueamount));
            $(".overduenumber").text(dataFormat(obj.overduenumber));
            $(".overduemorethanninetydaysamount").text(dataFormat(obj.overduemorethanninetydaysamount));
            $(".overduemorethanninetydaysnumber").text(dataFormat(obj.overduemorethanninetydaysnumber));
            $(".accumulativecompensationamount").text(dataFormat(obj.accumulativecompensationamount));
            $(".accumulativecompensationnumber").text(dataFormat(obj.accumulativecompensationnumber));
        } else {
            $.alertF(d.errormsg);
        }
    });

    //对返回的int、float及string进行格式化和为空处理
    function dataFormat(d) {
        if (typeof d === "number") {
            return d.toLocaleString();
        } else if (typeof d === "string" && d !== "") {
            return d;
        } else {
            return " -- ";
        };
    };
    //对于超过万得数额，以万为单位
    function moneyFormat(money) {
        if (typeof money !== "number") {
            return " -- ";
        };
        var _money = parseFloat(money);
        if(_money == 0) {
            return _money;
        } else if (_money > 0 && _money < 10000) {
            return _money.toLocaleString() + "元";
        } else if (_money >= 10000) {
            var s1 = Math.floor(_money / 10000); // 万位
            var s2 = toDb(Math.round((_money - s1 * 10000) / 100)); //万以下两位
            var s3 = s1.toLocaleString() + "." + s2;
            return s3 + "万";
        };
    };
    //保留两位小数，不足两位补零
    function toDb(n) {
        if (n < 10) {
            return '0' + n;
        } else {
            return '' + n;
        }
    };
});