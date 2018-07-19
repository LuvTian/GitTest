var referralcode = $.getQueryStringByName("referralcode");
$(function () {
    getUserInfo();

});

var account = [];
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            $("#qujinadwards").attr("href", "/html/my/user-grade-reward.html?referralcode=" + referralcode);//取金奖励
            $("#invitelink").attr("href", "/html/my/qujin-invite.html?referralcode=" + referralcode);//邀请按钮
            $("#financiallink").attr("href", "/Html/My/financiallist.html");//理财金奖励
            LevelData();//用户等级
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.delCookie("MadisonToken");
            $.Loginlink();
        }
    });
};


//用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
var levelArry = [{
    level: 0,
    count: 1,
    icon: 'vs1.png',
    rate: '0%'
}, {
    level: 1,
    count: 1,
    icon: 'vs2.png',
    rate: '0.2%'
}, {
    level: 2,
    count: 3,
    icon: 'vs3.png',
    rate: '0.3%'
}, {
    level: 3,
    count: 5,
    icon: 'vs4.png',
    rate: '0.5%'
}];



//用户等级
var LevelData = function () {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    var data = { type: 100, status: 0 };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {
            var list = data.data;
            var icon;
            $.each(levelArry, function (i, item) {
                if (list.currentlevel == item.level) {
                    icon = item.icon;
                }
            });
            //用户在投不满千元
            var notFullfiled = false;
            if (account.yesterdaybalance < 1000) {
                notFullfiled = true;
                $("#qujininfo").hide();
                $("#relinfo").hide();
            }
            var list = data.data;
            $("#adwardsrank").html(list.adwardsrank + "%"); //排名领先百分比
            $("#currentlevel").attr("src", $.resurl()+"/css/img2.0/" + icon);//当前用户等级头像
            $("#count").html(list.levelplus);//推荐人数
            $("#financialadwards").html($.fmoney(data.financialamount));//理财金收益
            $("#CouponTotalAmount").html($.fmoney(data.coupontotalamount));//理财金收益
            $("#adwardssummary").html($.fmoney(list.adwardssummary)); //累计奖励
            if (notFullfiled) {
                $("#upgradeComment").html("昨日在投不满<span class='red'>1000</span>，不参与排名。");
            }
        }
    });
}

////取金奖励
//$("#qujinadwards").click(function () {
//    window.location.href = "/html/my/user-grade-reward.html?referralcode=" + referralcode;
//});

////邀请按钮
//$("#invitelink").click(function () {
//    window.location.href = "/html/my/qujin-invite.html?referralcode=" + referralcode;
//});



