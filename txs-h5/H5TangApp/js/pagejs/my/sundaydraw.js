
var rewardtype, level;
var isdrawing = false;//是否正在旋转转盘
var isposting = false;//是否正在ajax请求
$(function () {
    $("#gobuyproduct").click(function () {
        $("._undraw").hide()
        $(".mask").hide()
    })
    if (new Date().getDay() == 0) {
        weekdrawlist();//中奖名单
        $(".notice").append('<marquee direction="up" scrollamount="5" id="weekdrawlist"></marquee>');
    }
    else {
        $(".notice").append('<p id="not-sunday-tip" class="az-text-center font-col-fff font-size-14rem padding-t-1rem">今天不抽奖哦，一周每日签到，即可在周日<br />参与大转盘赢大奖活动</p>');
    }
});

//抽奖
$("#luckdraw").bind("click", function () {
    if (!isdrawing && !isposting) {
        if (new Date().getDay() == 0) {
            luckdraw();
        }
        else {
            $("._undraw").show()
            $(".mask").show()
        }
    }
});

//抽大奖
function luckdraw() {
    isposting = true;
    var url = "/StoreServices.svc/user/signindraw";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        isposting = false;
        if (data.result) {
            //奖品类型 1:理财红包,2:加息券,3:理财金,4:现金,5:实物,6:福利券,7流量
            rewardtype = data.rewardtype;
            level = data.level;
            //--加息券
            if (data.level == 1 && data.rewardtype == 2) {
                rotateFunc(5, 108, '恭喜你获得1%加息券');
            }
            if (data.level == 2 && data.rewardtype == 2) {
                rotateFunc(5, 180, '恭喜你获得3%加息券');
            }
            if (data.level == 3 && data.rewardtype == 2) {
                rotateFunc(5, 36, '恭喜你获得5%加息券');
            }
            //--现金
            if (data.level == 1 && data.rewardtype == 4) {
                rotateFunc(5, 30, '恭喜你获得0.88元');
            }
            if (data.level == 2 && data.rewardtype == 4) {
                rotateFunc(5, 210, '恭喜你获得1.88元');
            }
            //--代金券
            else if (data.level == 1 && data.rewardtype == 1) {
                rotateFunc(11, 142, '恭喜你获得20元代金券');
            }
            else if (data.level == 2 && data.rewardtype == 1) {
                rotateFunc(2, 70, '恭喜你获得30元代金券');
            }
            else if (data.level == 3 && data.rewardtype == 1) {
                rotateFunc(3, 285, '恭喜你获得50元代金券');
            }
            //--理财金
            else if (data.level == 2 && data.rewardtype == 3) {
                rotateFunc(4, 175, '恭喜你获得3000元理财金');
            }
            else if (data.level == 3 && data.rewardtype == 3) {
                rotateFunc(4, 107, '恭喜你获得5000元理财金');
            }
            //--实物+虚拟
            else if (data.level == 1 && data.rewardtype == 5) {
                rotateFunc(6, 322, '恭喜您 获得iPad mini2！<br>奖励将于20个工作日内发放，请保持手机通畅');
            }
            else if (data.level == 2 && data.rewardtype == 5) {
                rotateFunc(4, 247, '恭喜您 获得电影票<br>奖励将于15个工作日内发放，请注意查收短信');
            }
            else if (data.level == 1 && data.rewardtype == 7) {
                rotateFunc(3, 0, '恭喜您 获得了500M流量包<br>奖励将在下个月15日之前，直接发放至您的手机账户中');
            }
        }
        else {
            if (data.errormsg == "本周未满签，无法抽奖！") {
                $(".mask").show();//遮罩
                $("#missday").show();//弹框
            }
            else {
                $.alertF(data.errormsg);
            }
        }
    }, function () {
        isposting = false;
    });
}

var rotateFunc = function (awards, angle, text) {
    isdrawing = true;
    $("#luckdraw").stopRotate();
    $("#luckdraw").rotate({
        angle: 0,
        duration: 5000,
        animateTo: angle + 360 * 10,
        callback: function () {
            isdrawing = false;
            if (rewardtype == 7 || rewardtype == 5) {
                $.alertF(text);
                return;
            }
            $.confirmF(text, null, "查看详情", null, function () { window.location.href = rewardlink(); });
        }
    });
};

//获得奖品对应跳转
function rewardlink() {
    switch (rewardtype) {
        case 1:
            var url = "/Html/My/myreward-bonus.html";//代金券
            return url;
        case 2:
            var url = "/Html/My/myreward-ticket.html";//加息券
            return url;
        case 3:
            var url = "/Html/My/financiallist.html";//理财金
            return url;
        case 4:
            var url = "/Html/My/myreward-money.html";//现金奖励
            return url;
        case 5:
            var url = "/Html/My/addresslist.html";//实物奖
            return url;
        case 6:
            //暂时没有以后可扩展
            //福利券
            break;
    }
}

//奖品名单
function weekdrawlist() {
    var url = "/StoreServices.svc/user/signindrawinfolist";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var list = data.usersigninrewardlist;
            var ha = [];
            $.each(list, function (index, item) {
                ha.push('<p class="note-info">恭喜' + item.rewardmobile + '获得 <span>' + item.rewardname + '</span></p>');
            });
            var html = $(ha.join(""));
            $("#weekdrawlist").append(html);
        }
    });
}

//弹框X
$(".icon-cancle").click(function () {
    $(".mask").hide();//遮罩
    $("#missday").hide();//弹框
});