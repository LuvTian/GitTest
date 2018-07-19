$(function () {
    var pass = new Array();
    var rePass = new Array();
    var isReset = false;
    FastClick.attach(document.body);
    getUserInfo();

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
});

var setPass = function (pass) {
    var url = "/StoreServices.svc/user/setpaymentpwd";
    var data = { paymentpwd: pass };
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            var returnurl=$.getQueryStringByName("returnurl");
            var skip_sina_process = $.getQueryStringByName("skip_sina_process");
            window.location.replace("regist-step2.html?returnurl=" + returnurl + "&skip_sina_process=" + skip_sina_process);
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

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;
            var returnurl = $.getQueryStringByName("returnurl");
            if (account.customstatus < 2) {
                $.CheckAccountCustomStatusRedirect(returnurl, account, true);
            }
        }
    });
};