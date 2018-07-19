//添加店员
var telllist=[];
$(function () {
    if ($("input[type=\"tel\"]").length == 1) {
        $(".delete").hide().unbind("click");
    }
    getUserInfo();
});

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            var userType = "1,2,3";
            if (userType.indexOf(account.storetype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
        }
    })
};
//继续添加
var addMore = function () {
    var tellength = $("input[type=\"tel\"]").length;
    if (tellength > 0 && tellength < 10) {
        $.each($("input[type=\"tel\"]"), function (i, item) {
            telllist[i] = $(item).prop("value");
        });
        var oldlength = telllist.length;
        telllist.sort();
        $.unique(telllist);
        var newlength = telllist.length;
        if (newlength != oldlength) {
            $.alertS("用户已录入，无法添加！");
            return false;
        } else {
            var index = tellength - 1;
            var phone = $("input[type=\"tel\"]:eq(" + index + ")").prop("value");
            if (phone == "") {
                $.alertS("手机号码不能为空");
                return;
            }
            else if (!$.isMobilePhone(phone)) {
                $.alertS("您填写的手机号格式错误");
                return;
            } else {
                addHtml();
            }
        }
    } else {
        $.alertS("一次性提交不得超过10个");
    }
}
var errorPhone = "";//报错的电话
$("#btnsubmit").click(function () {
    btnSubmit();
});
//提交
var btnSubmit = function () {
    var tellength = $("input[type=\"tel\"]").length;
    var index = tellength - 1;
    var phone = $("input[type=\"tel\"]:eq(" + index + ")").prop("value");//判断最后一行手机号是否为空
    if (phone == "") {
        $.alertS("手机号码不能为空");
        return;
    }
    else if (!$.isMobilePhone(phone)) {
        $.alertS("您填写的手机号格式错误");
        return;
    } else {
        var phones = "";
        $("input[type=\"tel\"]").each(function () {
            var phone = $(this).val();
            phones += phone + ",";
        })
        phones = phones.substr(0, phones.length - 1);
        addClick(phones);
    }
}
//添加用户
var addClick = function (phones) {
    $.each($("input[type=\"tel\"]"), function (i, item) {
        telllist[i] = $(item).prop("value");
    });
    var oldlength = telllist.length;
    telllist.sort();
    $.unique(telllist);
    var newlength = telllist.length;
    if (newlength != oldlength) {
        $.alertS("用户已录入，无法添加！");
        return false;
    } else {
        var url = "/StoreServices.svc/store/addclerk";
        var param = {
            clerkphones: phones
        }
        $.AkmiiAjaxPost(url, param, false).then(function (data) {
            if (data.result) {
                $.alertS("添加成功", function () {
                    window.location.replace("clerklist.html");
                });
            }
            else {
                $.alertS(data.errormsg.replace(/\,/g,"<br/>"), function () {
                    window.location.replace("clerklist.html");
                });
                return;
            }
        })
    }
}
//添加新行
var addHtml = function () {
    var html = [];
    html.push(" <article name=\"phonelist\" class=\"bg-white padd-15 col-3 bb az-positionr\">");
    html.push("     <input type=\"tel\"  maxlength=\"11\" class=\"add-manager\" placeholder=\"输入唐小僧注册用户手机号\">");
    html.push("     <div class=\"textclear\">");
    html.push("        <icon class=\"wechat icon-clear\" onclick=\"clearTxt(this)\"></icon>");
    html.push("     </div>");
    html.push("     <div name=\"delete\" class=\"delete\" onclick=\"deleteRow(this)\">删除</div>");
    html.push(" </article>");

    var __el = html.join("");
    $('.infobox').append($(__el))
    $("article").prev().find('icon').hide();
    $("article").prev().find('.add-manager').attr("disabled", "disabled").css('background', '#fff');
    var len = $("input[type=\"tel\"]").length;
    if (len == 1) {
        $(".delete").hide().unbind("click");
    } else {
        $(".delete").show().unbind("click").bind("click", function () {
            deleteRow(this);
        });
    }
}
//清空文本框值
var clearTxt = function (obj) {
    $(obj).closest('article').find('input').val('');
}
//删除
var deleteRow = function (obj) {
    var len = $("input[type=\"tel\"]").length;
    if (len == 1) {
        $(".delete").hide().unbind("click");
    } else {
        $(obj).closest('article').remove();
        if ($("input[type=\"tel\"]").length == 1) {
            $(".delete").hide().unbind("click");
        }
    }
}
