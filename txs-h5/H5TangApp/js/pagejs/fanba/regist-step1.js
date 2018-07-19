$(function () {
    var pass = new Array();
    var rePass = new Array();
    var isReset = false;
    //第三方返吧隱藏先去逛逛
    var activekey=$.getCookie("activekey")||"";
    if(activekey=="Fanba"){$(".other").hide();}
    var returnurl=$.getQueryStringByName("returnurl");
    FastClick.attach(document.body);

    $(".small-4").click(function () {
        if (this.id == "del-pass") {
            $(".pasdbox span:eq(" + (pass.length - 1) + ")").text("");
            pass.pop();
            return;
        };
        if (this.id == "reset") {
            pass = new Array();
            rePass = new Array();
            isReset = false;
            $("#setpass-title").text("请设置交易密码");
            $(".pasdbox span").text("");
            return;
        };
        pass.push($(this).text());
        $(".pasdbox span:eq(" + (pass.length - 1) + ")").text("●");

        if (pass.length == 6) {
            //$.alertF("交易密码只允许6位数字");
            if (!isReset) {
                isReset = true;
                rePass = pass;
                pass = new Array();
                $(".pasdbox span").text("");
                $("#setpass-title").text("请再次输入交易密码");
                return;
            }
            if (pass.join('') == rePass.join('')) {
                setPass(pass.join(''));
            } else {
                pass = new Array();
                rePass = new Array();
                isReset = false;
                $("#setpass-title").text("请设置交易密码");
                $(".pasdbox span").text("");
                $.alertF("输入密码不一致，请重新输入");
            }
            return;
        };
    });
    var setPass = function (pass) {
    var url = "/StoreServices.svc/user/setpaymentpwd";
    var data = { paymentpwd: pass };
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            window.location.href = "regist-step2.html?returnurl="+returnurl;
        } else {
            pass = new Array();
            rePass = new Array();
            isReset = false;
            $("#setpass-title").text("请设置交易密码");
            $(".pasdbox span").text("");
            $.alertF("设置密码失败，请重试一次", null, function () {
                window.location.reload();
            });
        }
    });
};
});

