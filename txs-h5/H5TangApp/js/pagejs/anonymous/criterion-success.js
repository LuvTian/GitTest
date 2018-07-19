$(function () {
    userinfo();
    $("#imgAgree").css("display", "none");
    $("#btnAgree").css("background", "#D4D4D4").unbind("click");
})

function userinfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (d) {
        if (d.result) {
            account = d.accountinfo;
            $.setLS("refcode", account.referralcode);
            try {
                _zdc && _zdc();
            } catch (e) {
                ;
            }
            initZdq(account.referralcode);
            if (account.riskwarning && account.passinvestor) {
                window.location.href = "/html/my/regist-step.html";
            }
        }
    });
}

$(".ckAgree").click(function () {
    $("#imgAgree").toggle();
    var ck = $("#imgAgree").css("display");
    if (ck == "block") {
        $("#btnAgree").css("background", "#cd3830").bind("click", function () {
            var url = "/StoreServices.svc/userservice/consentriskagreement";
            var paramter = {
                passinvestor: '1',
                registerupgrade: '1',
                riskwarning: '1'
            };
            $.AkmiiAjaxPost(url, paramter, true).then(function (d) {
                if (d.result) {
                    window.location.href = "/html/my/regist-step.html";
                }
                else {
                    $.alertF(d.errormsg);
                }
            });
        });
    } else {
        $("#btnAgree").css("background", "#D4D4D4").unbind("click");
    }
});