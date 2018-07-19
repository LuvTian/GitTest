/// <reference path="/_references.js" />
var today = new Date();
$(function () {
    getUserInfo();

    $("#user-sign").click(function () {
        sign();
    });

    $(document).click(function (event) {
        var dom = $(event.target);

        //if (dom.parents(".off").find(".fail-prompt").length > 0) {
            if (dom.hasClass("fail-prompt") || dom.parentsUntil(".off").length == 1) {
            var signin_prompt = dom.parents(".off").find(".signin-prompt");
            signin_prompt.toggle();
            $(".signin-prompt").not(signin_prompt).hide();
        } else {
            $(".signin-prompt").hide();
        }
    });

    $(".small-4.left.text-left").click(function () {
        today = today.addMonth(-1);
        if (today.Format("yyyy-MM") != new Date().Format("yyyy-MM")) {
            $(".small-4.left.text-right").removeClass("gray").unbind("click").bind("click", function () {
                today = today.addMonth(1);
                if (today.Format("yyyy-MM") == new Date().Format("yyyy-MM")) {
                    $(".small-4.left.text-right").addClass("gray").unbind("click");
                }
                initMonth();
            });
        }
        initMonth();
    });
    //
    var referralcode = $.getQueryStringByName("referralcode");
    $.getWechatconfig("InviteFriends", Success, fail, {
        "link": window.location.origin + "/Landing.html?c=" + referralcode
    });
});

//周签
function Success() {
    var url = "/StoreServices.svc/user/signweek";
    var param = {};
    $.AkmiiAjaxPost(url, param).then(function (data) {
        window.location.reload();
    });
}

function fail() {
    $(".mask").hide();
    $(".showshare").hide();
}

var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            account.cansign = (account.demandbalance + account.fixedbalance) >= 1000
        }
        initMonth();
    });
}
var getSignList = function () {
    var url = "/StoreServices.svc/user/signlist";
    var param = {
        "signtime": today.Format("yyyy-MM-dd")
    };
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            $("ul li").removeClass("red");
            var signList = data.usersigninfolist;
            $.each(signList, function (index, entry) {
                $(".row.calendar-list .left[data-bind='" + entry.signdate + "'] em").remove();
                if (entry.signdate == today.Format("yyyy-MM-dd") && account.cansign) {
                    $("#user-sign").unbind("click");
                    $("#user-sign").text("已签到").addClass("sold");
                }
                if (entry.signreward == 2 || (entry.signdate == today.Format("yyyy-MM-dd") && !account.cansign)) {
                    var text = $(".row.calendar-list .left[data-bind='" + entry.signdate + "']").text();
                    var failHtml = [];
                    failHtml.push("<div class='fail-prompt'>" + text + "<em>签到失效</em></div>");
                    failHtml.push("<div class=\"signin-prompt\"><img src=\""+$.resurl()+"/css/img2.0/signin-prompt.png\"></div>");
                    $(".row.calendar-list .left[data-bind='" + entry.signdate + "']").addClass("off").remove("em").html(failHtml.join(''));
                } else {
                    $(".row.calendar-list .left[data-bind='" + entry.signdate + "']").addClass("on").remove("em").append("<em>已签</em>");
                }
            });
            $("#user-curent-signcount").text(data.currentsigncount);
            $("#user-yesterday-signcount").text(data.yesterdaysigncount);
            $("#user-signtimes").text(data.signtimes);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var sign = function () {
    var url = "/StoreServices.svc/user/signday";
    $.AkmiiAjaxPost(url).then(function (data) {
        if (data.result) {
            $.alertF("签到成功", null, getSignList);
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        }else if (data.errorcode == "99999") {
            $.confirmF("未满足签到条件，去投资", null, null, null, function () {
                window.location.replace("/html/product/");
            });
        } else {
            $.alertF(data.errormsg);
        }
    });

};

var initMonth = function () {

    var FullYear = today.getFullYear(); //获取年份
    var m = today.getMonth(); //获取月号
    var month = today.getMonth() + 1; //获取月份

    if (month < 10) {
        month = "0" + month;
    }
    var date = today.getDate(); //获取日期
    var day = today.getDay(); //获取星期

    var monthsNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var isleapyear = FullYear % 4 == 0 && FullYear % 100 != 0; //判断闰年
    if (isleapyear) {
        monthsNum[1] = 29;
    } else {
        monthsNum[1] = 28;
    }

    if (day == 0) {
        day = 7;
    }
    var firstDay = day - (date % 7 - 1); //!important 计算月初星期数

    if (firstDay == 7) { //如果月初为七，归零
        firstDay = 0;
    }
    if (firstDay < 0) { //如果月初为负，加七循环
        firstDay += 7;
    }
    $(".row.calendar-list").html("");
    //向上取整
    var temp = Math.ceil((monthsNum[m] + firstDay) / 7);
    for (var i = 0; i < temp * 7; i++) {
        $(".row.calendar-list").append("<div class=\"left\">&nbsp;</div>");
    }

    var f = firstDay;
    for (var j = 1; j <= monthsNum[m]; j++) {
        var date = new Date(FullYear, month - 1, j);

        $(".row.calendar-list .left").eq(f).text(j).attr("data-bind", date.Format("yyyy-MM-dd"));
        f++;
    }
    $(".small-4.left.text-center").text(FullYear + "年" + month + "月");
    getSignList();
}
