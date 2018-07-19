$(window).load(function () {
    getUserInfo();
    $("#all-body-div-status").fadeOut();
    $("#all-body-div-preloader").delay(350).fadeOut("slow");

    $(".invite-title").click(function () {
        $(".rule").toggle();
        $(this).toggleClass('on');
    })

    $(".qujin-help-wrap").click(function () {
        $(this).hide();
    });

    $(".qujin-help-prompt").click(function () {
        $(".qujin-help-wrap").toggle();
    })

    $(".qujin-help-first-wrap").click(function () {
        $(this).hide();
    });

    $(".qujin-help-first").click(function () {
        $(".qujin-help-first-wrap").toggle();
    })

    $(".qujin-help-invite-wrap").click(function () {
        $(this).hide();
    });

    $(".qujin-help-invite").click(function () {
        $(".qujin-help-invite-wrap").toggle();
    })

});

var account = [];
var currentLeavel;
var bgImg = $.resurl()+"/css/img2.0/qujin-icon-money-bg.png";
var grayImg = $.resurl()+"/css/img2.0/qujin-icon-money-gray.png";

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            $("#investFriend").attr("href", "/html/my/qujin-invite.html?referralcode=" + account.referralcode);
            $("a.small-2,a.small-4").attr("href", "/html/my/qujin-invite.html?referralcode=" + account.referralcode);
            $("#noReturn").attr("href", "/html/my/qujin-invite.html?referralcode=" + account.referralcode);
            BindCurrentData();
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.delCookie("MadisonToken");
            $.Loginlink();
        }
    });
};

//用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
var levelArry = [{
    level: '0',
    count: 1,
    icon: 'rating-00.png',
    rate: '0%'
}, {
    level: '1',
    count: 3,
    icon: 'rating-01.png',
    rate: '0.2%'
}, {
    level: '2',
    count: 5,
    icon: 'rating-02.png',
    rate: '0.3%'
}, {
    level: '3',
    count: 0,
    icon: 'rating-03.png',
    rate: '0.5%'
}];

var BindCurrentData = function () {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var item = data.data;
            var notFullfiled = false;
            if (account.fixedbalance + account.demandbalance < 1000) {
                item.currentlevel = 0;
                notFullfiled = true;
            }
            var icon = levelArry[0].icon;
            var shengji = 0; //在邀请x人即可升级

            if (item == "" || item == null) {
                currentLeavel = levelArry[0].level;
                $(".img-rating").attr("src", $.resurl()+"/css/img2.0/" + icon);
                $("#currentlevel").attr("href", "qujin-shuoming.html?currentlevel=" + currentLeavel);
                $("#upgradedescribe").attr("href", "qujin-shuoming.html?currentlevel=" + currentLeavel); //等级
                return;
            }
            currentLeavel = item.currentlevel;

            $.each(levelArry, function (i, entry) {
                if (item.currentlevel == entry.level) {
                    icon = entry.icon;
                    shengji = entry.count - item.levelplus;
                    bindItem(i, item.levelplusadwards);
                    if (i == 3) {
                        $("#upgradeComment").hide();
                    }
                    return;
                }
            });

            $("#currentlevel").attr("href", "/html/my/qujin-shuoming.html?currentlevel=" + item.currentlevel); //等级
            $(".img-rating").attr("src", $.resurl()+"/css/img2.0/" + icon);

            $("#referralfloweecount").html(item.recnum); //动员人数
            $("#referralcount").html(item.levelplus); //成功推荐人数

            $("#needcount").html(shengji);
            if (notFullfiled) {
                $("#upgradeComment").html("在投不满<span class='red'>1000</span>，不满足条件");
            }

            $("#upgradedescribe").attr("href", "/html/my/qujin-shuoming.html?currentlevel=" + item.currentlevel); //等级
            $("#signtimes").html(item.signtimes + "天"); //签到次数
            $("#signadwards").html($.fmoney(item.signadwards) + "元"); //签到累计奖励
            $("#referralfloweecount2").html(item.referralfloweecount + "人"); //推荐关注人数
            $("#referralfloweeadwards").html($.fmoney(item.referralfloweeadwards) + "元"); // 推荐关注奖励
            $("#friendhelpcount").html(item.friendhelpcount + "人"); //好友帮助推荐人数
            $("#friendhelpadwards").html($.fmoney(item.friendhelpadwards) + "元"); //好友帮助推荐奖励
            $("#newreferralcount").html(item.referralcount + "人"); //好友成功推荐人数
            $("#referraladwards").html($.fmoney(item.referraladwards) + "元"); //成功推荐奖励
            $("#levelplus").html(item.levelplus + "人"); //昨日累计加成人数
            $("#levelplusadwards").html($.fmoney(item.levelplusadwards) + "元"); //累计加成金额
            $("#adwardssummary").html(item.adwardssummary); //累计奖励
            $("#adwardsrank").html(item.adwardsrank + "%"); //排名领先百分比
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.delCookie("MadisonToken");
            $.Loginlink();
        }
    });
}

var bindItem = function (index, levelplusadwards) {
    if (levelplusadwards == "0") {
        $("#noReturn").find("img").attr("src", grayImg);
        $("#levelProfit").html("<span class='qujin-pl'>暂无收益<br>请立即动员好友</span>");
        $("#imgRate").html(levelArry[0].rate);
    } else {
        $("#noReturn").find("img").attr("src", bgImg);
        $("#levelProfit").html("<span class='qujin-pl'>收益加成<br/>年化" + levelArry[index].rate+"</span>");
        $("#imgRate").html(levelArry[index].rate);
    }
}