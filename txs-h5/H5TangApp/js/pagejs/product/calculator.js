/// <reference path="//_references.js" />



$(document).foundation();
var $txtPrincipal = $("#txtPrincipal"); //计划投资
var $txtDays = $("#txtDays"); //天数
var $divTotal = $("#divTotal"); //回收本息
var $divPrincipal = $("#divPrincipal"); //理财本金
var $divInterest = $("#divInterest"); //理财收益
var $Calculation = $("#Calculation"); //开始计算
var $title = $("#title"); //标题
var rate = 0; //年化收益率 
var duration = 0; //期限
var type = 1; //1活期，其他定期

$(function () {

    Page_load();
    $Calculation.click(function () {
        CalculationFun();
    });

    function CalculationFun() {
        if ($txtPrincipal.val() < 100) {
            $.alertF("投资金额不能小于100元");
            return;
        }
        if ($txtPrincipal.val().length > 8 || !$.isNumber($txtPrincipal.val())) {
            $.alertF("计划投资金额格式不正确");
            return;
        }
        if ($txtDays.val().length > 4 || !$.isNumber($txtDays.val())) {
            $.alertF("投资期限格式不正确");
            return;
        }

        var day = Number($txtDays.val());
        var capital = Number($txtPrincipal.val());

        var profit = Math.floor((capital * day * (rate / 100 / 365)) * 100) / 100;
        $divInterest.text($.fmoney(profit) + "元");
        $divPrincipal.text($.fmoney(capital) + "元");
        $divTotal.text($.fmoney(capital + profit) + "元");
    }

    function Page_load() {
        var data = {
            productid: $.getQueryStringByName("id")
        };
        var url = "/StoreServices.svc/product/item";
        $.AkmiiAjaxPost(url, data).then(function (data) {
            if (data.result) {
                var product = data.productinfo;
                $title.text(product.title);
                rate = Number(product.rate) +Number(product.rateactivite);
                type = product.type;
                duration = product.duration;
                if (type != 1) {
                    $txtDays.val(duration);
                    $txtDays.attr("readonly", "readonly")
                }
                CalculationFun();
            } else {
                $.alertF(data.errormsg, null, history.back());
            }
        });
    }
});