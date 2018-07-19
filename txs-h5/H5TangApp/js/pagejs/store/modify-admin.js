
//修改管理员

$(function () {
    getUserInfo();
});
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            var userType = "1,2";
            if (userType.indexOf(account.storetype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
        }
    })
};
$("#submitapplication").click(function () {
    var reason = $("#reason").val();//更换原因
    var successorphone = $("#successorphone").val();//继任管理员手机
    var applicantphone = $("#applicantphone").val();//申请人手机
    if (successorphone.length == 0)
    {
        $.alertS("您没有填写继任管理员");
        return;
    }
    if (!$.isMobilePhone(successorphone))
    {
        $.alertS("继任管理员请填写正确的手机号码");
        return;
    }
    if (applicantphone.length == 0) {
        $.alertS("请填写申请人手机号");
        return;
    }
    if (!$.isMobilePhone(applicantphone)) {
        $.alertS("申请人手机号不合法");
        return;
    }
    //更换管理员手机号
    var url = "/StoreServices.svc/store/updatecompanyadmin";
    var param = {
        replacementreason: reason,
        succeedadminphone: successorphone,
        applicantphone: applicantphone
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            $.alertS("提交成功！", function () {
                window.location.href = "/Html/My/index.html";
            });
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    });
});