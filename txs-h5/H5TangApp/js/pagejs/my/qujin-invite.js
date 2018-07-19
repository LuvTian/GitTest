$(function () {

    var url = window.location.href;
    var list = url.split('#')[1];
    //页面初始化时描点定位
    if (list != '') {
        $(".list").toggle();
        $(".invite-title").toggleClass('on');
    }
    //加载二维码
    //jQuery('.output').qrcode("http://www.txslicai.com/0002");

    InvitationRegister(1);
    var referralcode = $.getQueryStringByName("referralcode");
    jsondata = {
        'link': window.location.origin + '/Landing.html?c=' + referralcode,
        'title': '邀请有礼，敢约财能富', // 分享标题
        'desc': '【唐小僧】期望年化收益8%+，多种期限标的信息任你选，红包福利享不停',
        'imgUrl': 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
    };
    $.getWechatconfig("InviteFriends", Success, fail, jsondata);
    var shareUrl = "https://s.txslicai.com/sq.html?domain={0}&c={1}&sqy=1".replace('{0}', window.location.origin).replace('{1}', referralcode);
    $(".icode").append(referralcode); //邀请码
    CreateCode(shareUrl);

    //生成二维码方法
    function CreateCode(couponcode) {
        var qrcode = new QRCode(document.getElementById("referralcodeimg"), {
            //width: 500,//设置宽高
            //height: 500 
        });
        var a = decodeURIComponent(couponcode);
        qrcode.makeCode(a);
    }
});

var pageindex = 1;
var pageSize = 10;
var total = 0;
var dataLength = 0;

var jsondata = "";
//好友列表
var InvitationRegister = function (index) {
    var paramter = {
        pageindex: index
    };
    $.AkmiiAjaxPost("/StoreServices.svc/Activity/getaccountreferral", paramter, true).then(function (d) {
        if (d.result) {
            var list = d.data;
            total = d.totalcount;
            dataLength = list.length;
            if (dataLength == 0) {
                $("#listData").parent().hide();
            } else {
                $.each(list, function (index, entry) {
                    $("#listData").append(initBidItem(entry, index));
                });
                if (dataLength < pageSize) {
                    $("#loadmoreFriends").hide();
                }
            }
        }
    });
}

//加载更多
$(".img-responsive").bind("click", function () {
    loadmore();
})
var loadmore = function () {
    if (pageindex * pageSize < total) {
        pageindex++;
        InvitationRegister(pageindex);
    }
}

var initBidItem = function (bidItem, index) {
    var html = [];
    var txt = "";
    if (index % 2 == 0) {
        html.push('<div class="row">');
    } else {
        html.push('<div class="row bg-yellow">');
    }
    //if (bidItem.location == null || $.trim(bidItem.location) == "") {
    //txt = "其它";
    //}
    // else {
    //txt = bidItem.location;
    //}
    if (bidItem.level == 1) {
        txt = "一级好友";
    } else {
        txt = "二级好友";
    }
    html.push(' <div class="small-3 left">' + txt + '</div>');
    html.push(' <div class="small-3 left">' + bidItem.mobile + '</div>');
    html.push(' <div class="small-3 left">' + bidItem.totalamount + '元</div>');
    //是否满千元无法判断
    if (bidItem.isexceedthousand) {
        html.push(' <div class="small-3 left"><img src="' + $.resurl() + '/css/img2.0/ok.png" class="img-status"></div>');
    } else {
        html.push(' <div class="small-3 left"><img src="' + $.resurl() + '/css/img2.0/wrong.png" class="img-status"></div>');
    }
    html.push('</div>');
    return html.join('');
};

var shareWechatSuccess = function () {
    var type = $.getQueryStringByName("type");
    if (!$.isNull(type)) {
        type = type.toLocaleLowerCase();
    }
    if (type == "android") {
        $.BaiduStatistics('Invite', 'qujin_android_share', '全面取经-Android分享-成功');
    } else if (type == "ios") {
        $.BaiduStatistics('Invite', 'qujin_ios_share', '全面取经-IOS分享-成功');
    }
};

$(".invite-title").click(function () {
    if (dataLength > 0) {
        $(".list").toggle();
        $(this).toggleClass('on');
    } else {
        $(".ondata").toggle();
        $("#loadmoreFriends").toggle();
        //$(".ondata").show();
        //$("#loadmoreFriends").hide();
        $(this).toggleClass('on');
    }
})

$(".tipswrap").click(function () {
    $(this).hide();
});

$(".invite-button").click(function () {
    var type = $.getQueryStringByName("type");
    if (!$.isNull(type)) {
        type = type.toLocaleLowerCase();
    }
    jsondata.callback = "shareWechatSuccess";
    jsondata.failback = "shareWechatSuccess";
    if (type == "ios") {
        //JS 调用本地分享方法
        PhoneMode.callShare(jsondata);
    } else if (type == "android") {
        //JS 调用本地分享方法
        window.PhoneMode.callShare(JSON.stringify(jsondata));
    } else {
        $(".tipswrap").toggle();
        setTimeout("SetTimeClose()", 4000);
    }
})

function SetTimeClose() {
    $(".tipswrap").hide();
}

$(".weixincode").click(function () {
    $(this).hide();
});

$(".output").click(function () {
    $(".weixincode").toggle();
    var url = $("#referralcodeimg img").attr("src");
    $("#bigCode").attr("src", url);
})

function Success(n) {
    $.BaiduStatistics('Invite', 'qujin_wechat_share_ok', '全面取经-微信分享-成功');
    if (n == 1) { // 1表示分享给朋友
        _gsq.push(["T", "GWD-002985", "track", "/targetpage/invite_success2"]);
    } else if (n == 0) { // 0表示分享给朋友圈
        _gsq.push(["T", "GWD-002985", "track", "/targetpage/invite_success1"]);
    } else {
        _gsq.push(["T", "GWD-002985", "track", "/targetpage/invite_success"]);
    }
    $(".tipswrap").hide();
}

function fail() {
    $.BaiduStatistics('Invite', 'qujin_wechat_share_cancel', '全面取经-微信分享-取消');
    _gsq.push(["T", "GWD-002985", "track", "/targetpage/invite_success"]);
    $(".tipswrap").hide();
}