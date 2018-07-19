var appkey = $.getQueryStringByName("appkey");
$(function () {
    userinfo();
})

function userinfo()
{
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}).then(function (d) {
        if (d.result) {
            account = d.accountinfo;
            //已同意按钮隐藏
            if (!account.passinvestor) {
                $("#fixbtn_mod").show();
            }
        }
    });
}

//点击不同意
$("#no").click(function () {
    if (appkey == "") {
        //微信端返回上一页
        window.history.back(-1);
    }
    else {
        //app返回首页
        window.location.href = "https://tservice.txslicai.com/Html/My/";
    }
});

//同意
$("#yes").click(function () {
    var url = "/StoreServices.svc/userservice/consentriskagreement";
    //合格投资人声明
    var paramter = {
        passinvestor: '1'
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (d) {
        if (d.result) {
            if (appkey == "") {
                //微信端返回上一页
                window.history.back(-1);
            }
            else {
                //app返回首页
                window.location.href = "https://tservice.txslicai.com/Html/My/";
            }
        }
        else if (d.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
        else {
            $.alertF(d.errormsg);
        }
    });
});
