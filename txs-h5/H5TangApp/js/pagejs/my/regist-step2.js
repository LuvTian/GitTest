$(function () {
    if (!$.CheckToken()) {
        $.Loginlink();
        return;
    }
    getUserInfo();
    $("#btn-ok").click(function () {
        var realName = $("#realname").val();
        var idNumber = $("#idnumber").val();
        if (realName == "") {
            $.alertF("为了您的资金安全，实名认证需要正确填写您的真实姓名");
            return;
        }
        if (idNumber == "") {
            $.alertF("为了您的资金安全，实名认证需要正确填写您的身份证号");
            return;
        };
        setRealName(idNumber, realName);
    });
});
var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false)
        .done(function (data) {
            if (data.result) {
                account = data.accountinfo;
                if (account.invitedby == _CHANNELCODE) {
                    //MediaV-load
                    _loadMVScript();
                }
                var returnurl = $.getQueryStringByName("returnurl");
                if (account.faceidentity && account.faceidentity === 1 && account.customstatus === 1) {
                    window.location.replace("/Html/Anonymous/faceAuthorization.html");
                    return;
                }
                //customstatus:0未设置密码 1未实名 2未绑卡
                $.CheckAccountCustomStatusRedirect(returnurl, account, true);
            }
        })
        .always(function () {
            $('#all-body-div-preloader,#all-body-div-status').removeClass('dis-none');
        });
};
var setRealName = function (idnumber, fullname) {
    var url = "/StoreServices.svc/user/setrealname";
    var data = {
        idnumber: idnumber,
        fullname: fullname
    };
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            if (account.invitedby == _CHANNELCODE) {
                //MediaV-regist
                _MVregist(fullname.replace(fullname.substr(1), '*'), account.referralcode);
            }
            _pyRegisterSuccess(account.referralcode, fullname.replace(fullname.substr(1), '*'), account.mobile);
            _gsq.push(["T", "GWD-002985", "track", "/targetpage/real-name_success"]);
            var returnurl = $.getQueryStringByName("returnurl");
            var skip_sina_process = $.getQueryStringByName("skip_sina_process");
            //新版注册流程，实名完成之后返回
            if (returnurl) {
                window.location.replace(decodeURIComponent(returnurl));
            } else {
                window.location.replace("/");
            }
            //window.location.href = "/html/my/regist-step3.html?returnurl=" + returnurl + "&skip_sina_process=" + skip_sina_process;
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.alertF("请先登录", null, $.Loginlink);
        } else {
            $.alertF(data.errormsg);
        }
    });
};