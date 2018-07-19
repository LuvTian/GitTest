
$(function () {
    $("#imgAgree").css("display", "none");
    $("#btnAgree").css("background", "#D4D4D4").unbind("click");
})

function userinfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}).then(function (d) {
        if (d.result) {
            account = d.accountinfo;
            if (account.riskwarning && account.passinvestor) {
                window.location.href = "/html/anonymous/";
            }
        }
    });
}

$(".ckAgree").click(function () {
   
    $("#imgAgree").toggle();
    var ck = $("#imgAgree").css("display");
    if (ck == "block") {
        $("#btnAgree").css("background", "#eb4936").bind("click", function () {
            var url = "/StoreServices.svc/userservice/consentriskagreement";
            var paramter = {
                passinvestor: '1',
                registerupgrade: '1',
                riskwarning: '1'
            };
            $.AkmiiAjaxPost(url, paramter, true).then(function (d) {
                if (d.result) {
                    var returnurl = $.getQueryStringByName("returnurl");
                    $.CheckAccountCustomStatusRedirect(returnurl,null,true);
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