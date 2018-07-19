var level = 0;
var shareLevelText, shareDesc, mobile,referralcode;
$(function () {
    //头部图片跳转页面
    $(".member_bg,.all_privilege").click(function () {
        // _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
        console.log($(this));
        if ($(this).hasClass("member_bg")) {
            _hmt.push(['_trackEvent', 'Member Grade', 'Entrance_Head', '会员中心-头部', '会员等级头部区域块']); //百度统计
        } else {
            _hmt.push(['_trackEvent', 'Member Grade', 'Btn_AllMember', '会员中心-全部会员特权', '全部会员特权按钮']); //百度统计
        }

        window.location.href = "/html/my/member_level/member_rights_all.html";
    });
    //取金等级头像点击跳转页
    $("#qujin").click(function () {
        window.location.href = "/html/my/qujin.html";
        _hmt.push(['_trackEvent', 'Member Grade', 'Icon_Qujin', '会员中心-取金入口', '取金等级图标入口']); //百度统计
    });

    //用户等级 图标 00 白龙马；01 卷帘；02 天蓬；03 齐天
    var levelArry = [{
        level: '0',
        count: 8,
        icon: 'v1.png',
        rate: '0%',
        v: 'v1',
        name: "白龙马"
    }, {
        level: '1',
        count: 20,
        icon: 'v2.png',
        rate: '0.2%',
        v: 'v2',
        name: "卷帘大将"
    }, {
        level: '2',
        count: 35,
        icon: 'v3.png',
        rate: '0.3%',
        v: 'v3',
        name: "天蓬元帅"
    }, {
        level: '3',
        count: 0,
        icon: 'v4.png',
        rate: '0.5%',
        v: 'v4',
        name: "齐天大圣"
    }];
    MemberLevel.alertRule(".member_rule");
    //用户等级显示
    $.AkmiiAjaxPost("/StoreServices.svc/Activity/getaccountlevel", {}, true).then(function (data) {
        if (data.result) {
            var i = data.data.currentlevel;
            if (i > levelArry.length - 1) {
                i = levelArry.length - 1;
            }
            var icon = levelArry[i].icon;
            var name = levelArry[i].name;
            $(".member_bg,.member_rule").addClass("pic_show");
            $("#qujin img").attr("src", $.resurl()+"/css/img2.0/img/" + icon);
            $("#qujin span").text(name);

        }
    });
    //会员等级
    var vipArry = [{
        vip_icon: 'normal.png',
        bar_color: 'normal',
        level_icon: 'Level0',
        desc: '唐小僧理财，收益赚不停。会员等级越高所获收益越多，快来看看吧！'
    }, {
        vip_icon: 'bronze.png',
        bar_color: 'bronze',
        level_icon: 'Level1',
        desc: '我已打败66%青铜等级的会员，快来看看我能享受哪些特权！'
    }, {
        vip_icon: 'silver.png',
        bar_color: 'silver',
        level_icon: 'Level2',
        desc: '我在唐小僧的投资收益已超过30元，快来看我能享受哪些特权！'
    }, {
        vip_icon: 'gold.png',
        bar_color: 'gold',
        level_icon: 'Level3',
        desc: '我在唐小僧的投资收益已超过300元，快来看我能享受哪些特权！'
    }, {
        vip_icon: 'platinum.png',
        bar_color: 'platinum',
        level_icon: 'Level4',
        desc: '我在唐小僧的投资收益已超过600元，快来看我能享受哪些特权！'
    }];
    var id = $.getCookie("userid");
    //会员电话号码
    $.AkmiiAjaxPost("/StoreServices.svc/user/info", {}, false).then(function (data) {
        if (data.result) {
            var account = data.accountinfo;
            // referralcode=account.referralcode;//邀请码
            mobile = account.mobile; //会员电话号码
            //$(".member_tel").text(account.mobile); //会员电话号码 
            referralcode=data.accountinfo.referralcode;//邀请码


            $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", {
                id: id
            }, true).then(function (data) {
                if (data.code == 200) {
                    level = data.data.level;
                    var vip_icon = vipArry[level].vip_icon;
                    var bar_color = vipArry[level].bar_color;
                    var level_icon = vipArry[level].level_icon;
                    var desc = vipArry[level].desc;
                    var sacel = data.data.rankProportion || ''; //占当前会员等级的比例
                    var rankProportionDesc = data.data.rankProportionDesc; //排名比例文字
                    var bar_width = (data.data.contributions / data.data.contributionValueEnd) * 100 || 0;
                    shareLevelText = data.data.shareLevelText; //分享的文案
                    shareDesc = data.data.shareDesc; //弹窗内容
                    if (sacel.slice(0, -1) < 30) { //	若用户的排名低于30%，显示的值为30%
                        sacel = "30%";
                    }
                    var shareFlag = data.data.shareFlag; //是否弹窗提示升级标志
                    if (level == 0) {
                        $(".contribution").hide();
                        $(".mark_words").hide();
                    } else {
                        $(".contribution").show();
                        $(".mark_words").show();
                    }
                    // if (level == 1) {
                    //     desc = '我已打败' + sacel + '青铜等级的会员，快来看看我能享受哪些特权！';
                    // }
                    $(".member_vip").css("background-image", "url("+$.resurl()+"/css/img2.0/img/" + vip_icon + ")"); //会员等级图片
                    $(".member_level img").attr("src", $.resurl()+"/css/img2.0/img/" + level_icon + ".png"); //会员等级icon
                    $(".contribution_bar").addClass(bar_color); //贡献值进度条颜色
                    $(".current_value").text(data.data.contributions); //贡献值
                    $(".all_value").text(data.data.contributionValueEnd); //贡献总值
                    $(".mark_words").text(rankProportionDesc); //占当前会员等级的比例
                    $(".progress_bar").css("width", (bar_width > 100 ? 100 : bar_width) + "%"); //贡献值进度条

                    //会员特权
                    //level = level;
                    $.AkmiiAjaxGet(apiUrl_prefix + "/privileges/{0}".replace("{0}", encodeURIComponent(level)), true).then(function (data) {
                        if (data.code == 200) {
                            var list = data.data;
                            var source = $("#privilege_list").html();
                            var render = template.compile(source);
                            if (list != null) {
                                var html = render({
                                    list: list || []
                                });
                                $(".privilege_list").append(html);
                                //加载特权弹窗的内容
                                addPrivilege(list);
                            }
                            MemberLevel.powerLege(".privilege_list li");
                            if (shareFlag == 1) { //是否需要弹窗提示会员升级了
                                //弹窗
                                var win_content = "<b class='tip_title'>会员升级</b><span class='tip_text'>" + shareDesc + "</span>";
                                $.confirmF(win_content, "取消", "去炫耀", function () {
                                    $.AkmiiAjaxPost(apiUrl_prefix + "/members/share", {
                                        id: id
                                    }, true).then(function (data) {
                                        //console.log(1);
                                    })
                                }, function () {
                                    tip_show()
                                    setTimeout(tip_close, 1000);
                                    _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Show off', '会员中心-去炫耀', '会员中心升级弹框去炫耀按钮']); //百度统计
                                    $.AkmiiAjaxPost(apiUrl_prefix + "/members/share", {
                                        id: id
                                    }, true).then(function (data) {
                                        // console.log(2);
                                    })

                                });
                                $(".az-showmasker-Text ._right-btn").addClass("tip_blue");
                            }
                        } else {
                            $.alertF(data.message);
                        }
                    });

                    //分享
                    AboutShare();

                } else {
                    $.alertF(data.message);
                }
            }, function (e) {
                console.log(e);
            });
        }
    })

    //去冲刺按钮跳转页面
    $(".to_rush").click(function () {
        _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Sprint', '会员中心-冲刺会员', '会员等级页面底部的冲刺会员按钮']); //百度统计
        window.location.href = "/html/product/";

    });
})
var id = $.getCookie("userid");

function tip_show() {
    $(".guide_layer").show();
    $(".tip_img").show();
}

function tip_close() {
    $(".guide_layer").hide();
    $(".tip_img").hide();
}

function AboutShare() {
    var jsondata = {
        'title': shareLevelText,
        'desc':'唐小僧，移动生活理财大师',
        'imgUrl': $.resurl()+ '/css/img2.0/img/share_icon.jpg',
        'link': window.location.origin + '/html/store/member/member_share.html?id=' + id + '&c=' +referralcode+'&tel='+ mobile
    };
    //分享到朋友圈
    $.getWechatconfig("LuckdrawShare", Success, Fail, jsondata);
    _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Share', '会员中心-分享', '会员中心用户点击的分享按钮']); //百度统计
}
//分享成功
var Success = function () {
    $.alertF("分享成功");
};
//分享失败
var Fail = function () {
    $.alertF("分享失败，请稍后重试！");
}