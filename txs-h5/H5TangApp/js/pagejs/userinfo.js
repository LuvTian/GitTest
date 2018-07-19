/// <reference path="/_references.js" />


$(function () {
    var $inputPWD = $("#az-paymentpwdinput");//密码
    var oldPwd = "";//原始密码
    var newPwd = "";//新密码


    $("#updatePWD").click(function () {
        //原密码
        $.PayPWDHtml(1, "请输入原密码", true, CallBackOldPwd);
    });

    function CallBackOldPwd() {
        oldPwd = $inputPWD.val();
        //设置新密码
        $inputPWD.focus();
        $.PayPWDHtml(2, "请设置新密码", true, CallBackNewPwd);
    }

    function CallBackNewPwd() {
        newPwd = $inputPWD.val();

        var params = { "PaymentPwd": oldPwd, "newPaymentPwd": newPwd };
        $.AkmiiAjaxPost("/Service.svc/EditPaymentPwd", params).then(function (d) {
            if (d.result) {
                $.alertF("修改成功");
            }
            else {
                $.alertF(d.errormsg);
            }
        });
    }
});