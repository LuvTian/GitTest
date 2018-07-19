/// <reference path="//_references.js" />

$(function () {
    $(document).on("click", "#btnAgree", function () {
        authInvestorRiskwarning();
    });
});

var authInvestorRiskwarning = function () {
    var url = "/StoreServices.svc/userservice/consentriskagreement";
    //风险提示和合格投资人声明
    var paramter = {
        passinvestor: '1',
        riskwarning: '1'
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (d) {
        if (d.result) {
                window.history.back()+"?v="+Date.now();
        }
        else if (d.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
        else {
            $.alertF(d.errormsg);
        }
    });
}

$("#aboutPicc").click(function () {
    window.location.href = "/Html/picc.html";
});