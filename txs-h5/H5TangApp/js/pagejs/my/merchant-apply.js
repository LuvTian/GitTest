/// <reference path="//_references.js" />


$(function () {
    var storename = $("#storename");
    var businesslicensenumber = $("#businesslicensenumber");
    var legalrepresentative = $("#legalrepresentative");
    var phone = $("#phone");
    var btnsubmit = $("#btnsubmit");
    var address = $("#store-address");
    var id = "";
    var approveopinion = "";

    btnsubmit.click(function () {
        var _storename = $.FilterXSS(storename.val());
        var _businesslicensenumber = $.FilterXSS(businesslicensenumber.val());
        var _legalrepresentative = $.FilterXSS(legalrepresentative.val());
        var _phone = $.FilterXSS(phone.val());
        var _address = $.FilterXSS(address.val());

        if ($.isNull(_storename) || $.isNull(_businesslicensenumber) || $.isNull(_legalrepresentative) || $.isNull(_phone) || $.isNull(_address)) {
            $.alertF("请完善申请资料");
            return;
        }
        var data = {
            "storename": _storename,
            "businesslicensenumber": _businesslicensenumber,
            "legalrepresentative": _legalrepresentative,
            "phone": _phone,
            "address": _address
        };
        $.AkmiiAjaxPost("/StoreServices.svc/store/createstoresettledapply", data).then(function (d) {
            if (d.issuccess) {
                $.alertF("商户入驻申请已成功提交！<br/>在7个工作日内，商务将与您取得联系", null, function () {
                    window.location.href = "/Html/My/index.html";
                    btnsubmit.unbind();
                });
            }
            else {
                $.alertF(d.errormsg || $.defaultError());
            }
        });
    });

    var page_load = function () {
        //判断商户入驻状态 applystatus:0可申请  1企业管理员  2变更处理中  3商户申请正在处理中
        var data = {};
        $.AkmiiAjaxPost("/StoreServices.svc/store/getstoresettledapply?v=" + (new Date()).getTime(), data).then(function (d) {
            if (d.result) {
                if (d.applystatus != 0) {
                    $.alertF(d.applymsg, "", function () { history.back(); });
                    return;
                }
                if (d.approveopinion) {
                    $("aside").html("拒绝原因:" + d.approveopinion);
                }
            }
            else {
                if (d.errormsg == "该用户未通过实名认证") {
                    $("#okmerchant").show();
                    $.confirmF("请完成实名认证后，再继续进行商户入驻申请！", "取消", "去设置", null, function () {
                        window.location.href = "/html/My/regist-step.html";
                    });
                }
                else {
                    $.alertF("网络不好，您的网络不太稳定哦");
                }
            }
        });
    }
    page_load();

});

