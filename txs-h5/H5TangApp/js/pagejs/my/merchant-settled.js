/// <reference path="//_references.js" />

(function ($) {
    //判断商户入驻状态 applystatus:0可申请  1企业管理员  2变更处理中  3商户申请正在处理中
    //Html/My/merchant-apply.html
    var data = {};
    $.AkmiiAjaxPost("/StoreServices.svc/store/getstoresettledapply?v=" + (new Date()).getTime(), data).then(function (d) {
        if (d.result) {
            if (d.applystatus == 0) {
                $("#okmerchant").show().find("a").attr("href", "/Html/My/merchant-apply.html");
                $("#nomerchant").hide();
                $("#merchantinfo").hide();
            }
            else if (d.applystatus == 0) {
                $("#okmerchant").hide();
                $("#nomerchant").show();
                $("#merchantinfo").show();
            }
            else {
                $.alertF(d.applymsg);
                $("#okmerchant").show().find("a").click(function () {
                    $.alertF(d.applymsg);
                });
                $("#nomerchant").hide();
                $("#merchantinfo").hide();
            }
        }
        else {
            if (d.errormsg == "该用户未通过实名认证") {
                $("#okmerchant").show().click(function () {
                    $.confirmF("请完成实名认证后，再继续进行商户入驻申请！", "取消", "去设置", null, function () {
                        window.location.href = "/html/My/regist-step.html";
                    });
                });
                $.confirmF("请完成实名认证后，再继续进行商户入驻申请！", "取消", "去设置", null, function () {
                    window.location.href = "/html/My/regist-step.html";
                });
            }
            else {
                $.alertF("网络不好，您的网络不太稳定哦");
            }
        }
    });
})(jQuery);
