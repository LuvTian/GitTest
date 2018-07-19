$(function() {
    //islogin = $.isNull($.getCookie("MadisonToken"))
    //if (islogin) {
    //    $.Loginlink();
    //}
    getUserInfo();

});

var account = [];
var step = 2;
//用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
var levelArry = [{
    level: 0,
    count: 1,
    icon: 'vs1.png',
    rate: '0%',
    text: '白龙马'
}, {
    level: 1,
    count: 1,
    icon: 'vs2.png',
    rate: '0.2%',
    text: '卷帘大将'
}, {
    level: 2,
    count: 3,
    icon: 'vs3.png',
    rate: '0.3%',
    text: '天蓬元帅'
}, {
    level: 3,
    count: 5,
    icon: 'vs4.png',
    rate: '0.5%',
    text: '齐天大圣'
}];

//用户信息
var getUserInfo = function() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            $("#chaxun").attr("href", "/html/my/user-qujin.html?referralcode=" + account.referralcode); //我的奖励
            $("#myadwards").attr("href", "/html/my/user-qujin.html?referralcode=" + account.referralcode); //我的奖励
            $("#invite").attr("href", "/html/my/qujin-invite.html?referralcode=" + account.referralcode + "&type=" + $.getQueryStringByName("type")); //邀请好友
            LevelData(); //用户等级
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
    });
};

//用户等级
var LevelData = function() {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    $.AkmiiAjaxPost(url, {}, true).then(function(data) {
        if (data.result) {
            var list = data.data;
            var icon, shengji, nextleve, leveltext;
            $.each(levelArry, function(i, item) {
                if (list.currentlevel == item.level) {
                    if (list.currentlevel == 3) {
                        //齐天大圣页面处理
                        //$("#nextlevelimg").addClass("img-wukong");
                        $("#relhtml").html("每连续保持30天，将额外获得大圣礼包");
                    }
                    icon = item.icon;
                    if (list.levelplus < item.count) {
                        shengji = item.count - list.levelplus;
                    } else {
                        shengji = (item.count + step) - list.levelplus;
                    }
                    leveltext = item.text;
                    nextleve = item.level + 1;
                    return;
                }
            });
            if (account.yesterdaybalance < 1000) {
                $("#relhtml").html("");
                $("#relhtml").append("昨日在投不满<span class='red'>1000</span>，不满足条件");
            }
            $("#leveltext").html(leveltext); //等级text
            $("#currentlevel").attr("src", $.resurl() + "/css/img2.0/" + icon); //当前用户等级头像
            $("#needcount").html(shengji); //再邀人数
            $("#nextlevelimg").attr("src", $.resurl() + "/css/img2.0/user-grade-v" + nextleve + ".jpg"); //升级图片
        }
    });
}

//箭头
$("#top").click(function() {
    $("#topcenter").toggle();
    $(".viewport").animate({ scrollTop: $("#topcenter").offset().top }, 1000)
    $("#top img").toggleClass("rotated")
});


//升级说明
$("#shuoming").click(function() {
    $("#topcenter").toggle();
    var scroll_val = $("#topcenter").offset().top + $(".viewport").scrollTop();
    $(".viewport").animate({ scrollTop: scroll_val }, 1000)
    $("#top img").toggleClass("rotated")
        // alert($("#topcenter").offset().top)
});