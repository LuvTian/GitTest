/// <reference path="//_references.js" />

var url = "";
var param = {};
var $bankName = $("#bankName");//银行卡号
var $bankCode = $("#bankCode");//卡号
var $unbindcard = $("#unbindbank");//解绑银行卡
var $cardid = $("#cardid");//卡编号
var $bankImg = $("#bankImg");//银行图片
var canunbind = false;

$(function () {

    Page_Load();
    function Page_Load() {
        url = "/StoreServices.svc/user/queryuserbank";
        $.AkmiiAjaxPost(url, param, true).then(function (data) {
            if (data.result) {
                $bankName.html(data.bankname);

                $bankCode.html(data.code);
                $cardid.val(data.cardid);
                $bankImg.addClass("icon-bank-" + data.bankcode);
                if (data.canunbind) {
                    canunbind = true;
                }
            } else {
                //DO NOTHING
            }
        });
    };

    $unbindcard.click(function () {
        if (!canunbind) {
            $.alertF("账户有余额或有在投资金,暂时不能解绑！");
            return;
        }

        $.PaymentHtmlNew(null,null,function Pwdcallback(res) {
            if ($.isNumeric(res)) {
                $.closePWD();
                $.confirmF("确定解绑此银行卡?", null, null, function () {
                    $.closeWinDivPWD();
                }, function () {
                    var data = { "paypwd": res, "cardid": $cardid.val() };
                    $.AkmiiAjaxPost("/StoreServices.svc/user/unbindbank", data).then(function (d) {
                        $.closeWinDivPWD();
                        if (d.issuccess) {
                            $.alertF("解绑成功", null, function () { window.history.back(); });
                        } else if (d.errorcode == "20019") {
                            $.confirmF(d.errormsg, null, "去重置", function () {
                                $(".reset").click();
                            }, function () {
                                window.location.href = "/html/my/resetpassword.html";
                            });
                        } else {
                            $.alertF(d.errormsg);
                        }
                    });
                });
            }
            else {
                $.alertF("交易密码需为6位数字");
            }
        }
        )
    });
});