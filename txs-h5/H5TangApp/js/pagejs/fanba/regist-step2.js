$(function () {
    getUserInfo();
    //第三方返吧隱藏先去逛逛
    var activekey=$.getCookie("activekey")||"";
    if(activekey=="Fanba"){$(".other").hide();}
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
var returnurl=$.getQueryStringByName("returnurl");
var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            if (account.invitedby == _CHANNELCODE) {
                //MediaV-load
                _loadMVScript();
            }
        }
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

            window.location.href = "/html/fanba/regist-step3.html?returnurl="+returnurl;
        } else if (data.errorcode == "missing_parameter_accountid") {
            $.alertF("请先登录", null, $.Loginlink);
        } else {
            $.alertF(data.errormsg);
        }
    });
};