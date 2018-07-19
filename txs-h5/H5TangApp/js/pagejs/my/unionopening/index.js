$(function () {
    if (!$.CheckToken()) {
        $.Loginlink();
        return;
    }
    $.delSession("JUMPSWITCHKEY");
    //联系客服
    if (phoneProxy.getPhoneType() != "h5") {
        $("#contactUs").click(function () {
            phoneProxy.onlineService();
        });
    } else {
        $("#contactUs").html("客服电话").click(function () {
            window.location.href = $.txsOfficialTel();
        });
    }
    var $agreementCkboximg = $("#ckbox-agree img")
    var $jysBtnSubmit = $("#jys-btn-submit")
    var $agreeCkBox = $("#ckbox-agree");

    var agreed = getAgreementStatus();
    $jysBtnSubmit.click(function () {
        var disabled = getBtnSubmitStatus();
        if (agreed && !disabled) {
            checkOpeningTime();
            //window.location.href = '/html/my/unionopening/depository.html';
        }
    });
    $agreeCkBox.click(function () {
        agreed = !getAgreementStatus();
        agreed ? ($agreementCkboximg.css('visibility', 'visible')) : ($agreementCkboximg.css('visibility', 'hidden'));
        agreed ? $jysBtnSubmit.removeClass('disabled') : $jysBtnSubmit.addClass('disabled')
    });
    function getAgreementStatus() {
        return $agreementCkboximg.css('visibility') == "visible";
    }
    function getBtnSubmitStatus() {
        return $jysBtnSubmit.hasClass('disabled');
    }
    /**检查开户是否是银行受理时间 */
    function checkOpeningTime() {
        var url = apiUrl_prefix + "/jys/member/validate-bank-working-period";
        $.AkmiiAjaxPost(url, {}, false).then(function (d) {
            if (d.code == 200) {
                window.location.href = '/html/my/unionopening/depository.html' + window.location.search;
            }
            else if (d.code == 5002) {
                $.confirmF("银行受理开户时间为每日的7:30~19:30，感谢您的支持，我们将努力为您提供最优质的服务", "取消", "拨打客服", function () {
                    //window.location.href = "/html/anonymous/welcome.html";
                }, function () {
                    window.location.href = $.txsOfficialTel();
                })
            }
            else {
                $.txsToast(d.message);
            }
        })
    }
});
