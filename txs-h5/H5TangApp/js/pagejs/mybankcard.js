/// <reference path="/_references.js" />


$(function () {
    var IsUnbindingBank = "";

    init();
    function init() {
        $.AkmiiAjaxGet("/Service.svc/GetUserBank").then(function (data) {
            if (data.result) {
                /**/
                $("#bankId").val(data.bankid);
                $("#bankName").text(data.bankname);
                $("#bankCode").text(data.cardno);
                $("#CardType").text(data.codetype);
                IsUnbindingBank = data.IsUnbindingBank;
                $("#unbindbank").show();
            } else {
                $("#cardInfo").hide();
                $("#bindbank").show();
            }
        });
    }

    //解绑银行卡
    $("#unbindbank").click(function () {
        if (!IsUnbindingBank) {
            $.alertF("当前账号还有余额，不能解绑银行卡");
            return;
        }
    });
    //跳转绑定银行卡
    $("#bindbank").click(function () {
        window.location.href = "./bankcard.html";
    });




});