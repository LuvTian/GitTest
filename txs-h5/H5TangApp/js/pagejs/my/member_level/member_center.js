var apptype = $.getQueryStringByName('type');
var shareLevelText = "";
var jsondata;
var showLayer = $.getQueryStringByName('showLayer');
var id = $.getCookie("userid");
var levelName, referralcode, mobile;
$(function () {
    init();
    //iOS中后退分享接口调用问题
    iosBackShare();
    imgsUrl();
    //引导层显示
    function showLead() {
        $(".mask_lead").show();
        $(".lead_page").addClass("lead_scale");
    }


    //点击引导层跳转到会员说明页
    $(".JS_lead").click(function () {
        backShowLayer();
        $(".mask_lead").hide();
        $(".lead_page").removeClass("lead_scale");
        window.location.href = "/html/my/member_level/member_description.html?type=" + apptype;
    })
    //点击引导层中的我知道关闭引导层
    $(".JS_close_lead").click(function () {
        backShowLayer();
        $(".mask_lead").hide();
        $(".lead_page").removeClass("lead_scale");
        showUpLevel(levelName, id, referralcode, mobile); //升级弹框显示
        return false;

    })
    //升级说明页
    $(".JS_uplevel").click(function () {
        _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Grade_Rule', '会员中心-如何升级', '如何升级按钮']); //百度统计
        window.location.href = "/html/my/member_level/member_description.html?type=" + apptype;
    })
    //全部会员特权
    $(".all_privilege").click(function () {
        _hmt.push(['_trackEvent', 'Member Grade', 'Btn_AllMember', '会员中心-全部会员特权', '全部会员特权按钮']); //百度统计
        window.location.href = "/html/my/member_level/member_rights_all.html?type=" + apptype;
    })

    //页面初始化
    function init() {
        $.AkmiiAjaxPost(apiUrl_prefix + "/vipcenter/members/portal", {
            id: id
        }, true).then(function (data) {
            if (data.code == 200) {
                var level = data.data.level; //会员等级
                levelName = data.data.levelName; //等级名称
                var contr_value = data.data.currentContribution; //当前的贡献值
                var all_level = data.data.levelContributionIntervals;
                var my_privilege = data.data.currentLevelPrivileges || []; //我的特权
                mobile = data.data.mobile; //手机号
                referralcode = data.data.referralCode; //邀请码
                $.setCookie("refcode", data.data.referralCode);
                //var circleW=$(".default_bar").width()*5/305;//进度条上的圆圈的宽度
                //var width = ($(".default_bar").width()-circleW*5) / 4;//除去圆圈后进度条每个等级的宽度
                var width = 13.013333 / 4;
                all_level.sort(function (a, b) {
                    return a.id - b.id;
                });
                for (var i = 0; i < all_level.length; i++) {
                    var min = all_level[level].contributionValueStart;
                    var max = all_level[level].contributionValueEnd;
                    if (level == 0) {
                        var len_bar = width * (level + 1) / 2; //进度条长度
                        //会员等级为零的进度条
                        $(".current_bar").addClass("current_bar0");
                        $(".default_bar span:lt(" + (level + 1) + ")").addClass("curr_circle0");
                    } else {
                        var len_barW = width * level + width * (contr_value - min) / (max - min); //进度条长度
                        var len_bar = len_barW > width * 4 ? width * 4 : len_barW;
                        //会员等级为非零的进度条
                        $(".current_bar").addClass("curr_level_bar");
                        $(".default_bar span:lt(" + level + ")").addClass("curr_level_circle");
                    }
                    //进度条的显示
                    $(".default_bar").addClass("default_bar" + level);
                    $(".default_bar span").addClass("circle" + level);
                    $(".bar_length").css("width", len_bar + "rem");
                    $(".levelname" + i).text(all_level[i].levelName); //对应会员等级名称
                }
                //页面头部信息
                if (level == 0) {
                    $(".my_pri").html("当前为普通会员<b>（无特权）</b>");
                    $(".level_icon").attr("src", $.resurl() + "/css/img2.0/member_level/level0.png");
                    $(".ask_icon").attr("src", $.resurl() + "/css/img2.0/member_level/question_gray.png");

                } else if (level == 1) {
                    $(".center_head").addClass("brone_color");
                    $(".level_icon").attr("src", $.resurl() + "/css/img2.0/member_level/level1.png");
                } else if (level == 2) {
                    $(".center_head").addClass("baiyin_color");
                    $(".level_icon").attr("src", $.resurl() + "/css/img2.0/member_level/level2.png");
                } else if (level == 3) {
                    $(".center_head").addClass("gold_color");
                    $(".level_icon").attr("src", $.resurl() + "/css/img2.0/member_level/level3.png");
                } else if (level == 4) {
                    $(".center_head").addClass("bojin_color");
                    $(".level_icon").attr("src", $.resurl() + "/css/img2.0/member_level/level4.png");
                    //$(".JS_up").text("我要投资");
                    $(".add_level span").text("会员说明"); //?需要问问产品后面的图标
                }

                //我的特权,如果当期等级是铂金则显示的是我要投资按钮
                if (level == 0) {
                    $(".normal").show();
                    $(".my_list").hide();
                    $(".bottom").hide();
                } else if (level == 4) {
                    $(".normal").hide();
                    $(".my_list").show();
                    $(".bottom").show();
                    $(".JS_up").hide();
                    $(".JS_my_invest").show();
                } else {
                    $(".normal").hide();
                    $(".my_list").show();
                    $(".bottom").show();
                    $(".JS_up").show();
                    $(".JS_my_invest").hide();
                }
                // //如果当期等级是铂金则显示的是我要投资按钮
                // if (level == 4) {
                //     $(".JS_up").hide();
                //     $(".JS_my_invest").show();
                // } else {
                //     $(".JS_up").show();
                //     $(".JS_my_invest").hide();
                // }
                var list = [];
                for (var j = 0; j < my_privilege.length; j++) {
                    var privilegeNameTopShow = my_privilege[j].privilegeNameTopShow || '';
                    var privilegeName = my_privilege[j].privilegeName || '';
                    var sendStatusTip = my_privilege[j].sendStatusTip || '';
                    var privilege_id = my_privilege[j].id;
                    var giftBagType = my_privilege[j].giftBagType; //判断是否需要出现每月每日文案
                    var issueTime = my_privilege[j].issueTime; //表示月还是日1是日2是月
                    var issueDay = my_privilege[j].issueDay; //表示日期

                    list.push('<div class="privilege_list cls">');
                    list.push('<img src="' + my_privilege[j].imgPrivilege2d + '" />');
                    list.push('<div class="privilege_content"><div><p class="gift_value">' + privilegeNameTopShow + '</p>');
                    if (giftBagType == 1 || giftBagType == 3) {
                        if (issueTime == 1) {
                            list.push('<p class="gift_name">' + privilegeName + '(每日发放)</p></div>');
                        } else if (issueTime == 2) {
                            list.push('<p class="gift_name">' + privilegeName + '(每月' + issueDay + '日)</p></div>');
                        }
                    } else {
                        list.push('<p class="gift_name">' + privilegeName + '</p></div>');
                    }

                    if (my_privilege[j].privilegeType == 2) {
                        //显示去签到还是以签到
                        if (my_privilege[j].sendStatus == "NO_SEND") { //没有签到
                            var sendStatusTip = (my_privilege[j].sendStatusTip || '').substring(1, 3);
                            list.push('<div class="gift_status"><span class="go_sigin JS_candy">' + sendStatusTip + '<i class="arrow"></i></span></div></div></div>');
                        } else if (my_privilege[j].sendStatus == "HAS_SEND") { //已签到
                            list.push('<div class="gift_status">' + sendStatusTip + '</div></div></div>');
                        }
                    } else {
                        //list.push('<div class="gift_status">' + sendStatusTip + '</div></div></div>');
                        list.push('</div></div>');
                    }

                }
                var html = $(list.join(''));
                $(".my_list").append(html);

                $(".JS_candy").click(function () {
                    window.location.href = "/html/my/user-sign.html?referralcode="; //跳到签到页面
                    return false;
                })
                $(".privilege_list").click(function () {
                    _hmt.push(['_trackEvent', 'Member Grade', 'Icon_Privilege', '会员中心-单个特权', '会员中心-点击单个特权按钮']); //百度统计
                    var index = $(this).index();
                    var privilege_id = my_privilege[index].id;
                    window.location.href = "/html/my/member_level/member_rights_detail.html?id=" + privilege_id; //特权详情页
                })
                //我要投资按钮的跳转
                $(".JS_invote").click(function () {
                    _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Sprint', '会员中心-我要升级', '会员等级页面底部的我要升级、我要投资按钮']); //百度统计
                    if (apptype == 'ios') {
                        PhoneMode.jumpAppWithString({
                            'controller': 'InvestmentViewController'
                        });
                    } else if (apptype == 'android') {
                        //window.PhoneMode.callShare(JSON.stringify(jsondata));
                        window.PhoneMode.callToPage("MainActivity", "licai");
                    } else {
                        window.location.href = "/html/product/index.html";
                    }
                })
                $(".JS_invote_immed").click(function () {
                    _hmt.push(['_trackEvent', 'Member Grade', 'Btn_HowToUpgrade', '如何升级', '会员中心-底部按钮-如何升级弹框中的按钮']); //百度统计
                    if (apptype == 'ios') {
                        PhoneMode.jumpAppWithString({
                            'controller': 'InvestmentViewController'
                        });
                    } else if (apptype == 'android') {
                        //window.PhoneMode.callShare(JSON.stringify(jsondata));
                        window.PhoneMode.callToPage("MainActivity", "licai");
                    } else {
                        window.location.href = "/html/product/index.html";
                    }
                })
                //如果升级弹框显示关闭
                $(".JS_up").click(function () {
                    _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Sprint', '会员中心-我要升级', '会员等级页面底部的我要升级、我要投资按钮']); //百度统计
                    $(".mask_up").show();
                    $(".up_win").addClass("up_scale");
                    var up_array = [];
                    if (level == 0) {
                        money1 = all_level[1].contributionValueStart - contr_value;
                        money2 = all_level[2].contributionValueStart - contr_value;
                        money3 = all_level[3].contributionValueStart - contr_value;
                        money4 = all_level[4].contributionValueStart - contr_value;
                        up_array.push('<li>升级至青铜会员还需出借：<span class="up_money">' + money1 + '</span>元</li>');
                        up_array.push('<li>升级至白银会员还需出借：<span class="up_money">' + money2 + '</span>元</li>');
                        up_array.push('<li>升级至黄金会员还需出借：<span class="up_money">' + money3 + '</span>元</li>');
                        up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                    } else if (level == 1) {
                        money2 = all_level[2].contributionValueStart - contr_value;
                        money3 = all_level[3].contributionValueStart - contr_value;
                        money4 = all_level[4].contributionValueStart - contr_value;
                        up_array.push('<li>升级至白银会员还需出借：<span class="up_money">' + money2 + '</span>元</li>');
                        up_array.push('<li>升级至黄金会员还需出借：<span class="up_money">' + money3 + '</span>元</li>');
                        up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                    } else if (level == 2) {
                        money3 = all_level[3].contributionValueStart - contr_value;
                        money4 = all_level[4].contributionValueStart - contr_value;
                        up_array.push('<li>升级至黄金会员还需出借：<span class="up_money">' + money3 + '</span>元</li>');
                        up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                    } else if (level == 3) {
                        money4 = all_level[4].contributionValueStart - contr_value;
                        up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                    }
                    var html = $(up_array.join(""));
                    $(".up_content").append(html);
                });
                $(".JS_close").click(function () {
                    $(".mask_up").hide();
                    $(".up_win").removeClass("up_scale");
                    $(".up_content").html('');
                });

                //调用/members/info获取分享文案
                $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", {
                    id: id
                }, true).then(function (data) {
                    if (data.code == 200) {
                        $.setLS("phjs", "");
                        shareLevelText = data.data.shareLevelText; //分享的文案
                        //分享
                        //setTimeout(appShare,1000);
                        appShare(id, referralcode, mobile);
                        //alert(0000);
                    }
                });
                //是否要弹出升级弹窗
                //showUpLevel(levelName, id, referralcode, mobile)
                showLayers(levelName, id, referralcode, mobile);
            }
        })
    }

    function showLayers(levelName, id, referralcode, mobile) {
        //判读引导层是否需要显示
        if (apptype) {
            if (showLayer && showLayer == 'true') {
                showLead();
            } else {
                showUpLevel(levelName, id, referralcode, mobile);
            }
        } else {
            userArr(levelName, id, referralcode, mobile);
        }
    }
    //H5引导层是否出现判断
    function userArr(levelName, id, referralcode, mobile) {
        var uselist = ($.getLS("leadstatus") ? $.getLS("leadstatus").split(",") : $.getLS("leadstatus")) || [];
        if (uselist.length > 0) {
            if (uselist.indexOf(id) >= 0) {
                // handle
                showUpLevel(levelName, id, referralcode, mobile); //升级弹框
            } else {
                uselist.push(id);
                $.setLS("leadstatus", uselist);
                showLead();
            }
        } else {
            showLead();
            $.setLS("leadstatus", id);
        }
    }
    //是否要弹出升级弹窗
    function showUpLevel(levelName, id, referralcode, mobile) {
        $.AkmiiAjaxPost(apiUrl_prefix + "/vipcenter/members/need_pop_share", {
            id: id
        }, true).then(function (data) {
            if (data.code == 200) {
                var flag = data.data;
                if (flag == true) {
                    $(".mask_share").show();
                    $(".member_win").addClass("scale");
                    //升级弹窗内容
                    upLevel(levelName, id, referralcode, mobile);
                } else if (flag == false) {
                    $(".mask_share").hide();
                    $(".member_win").removeClass("scale");
                }

            }
        })
    }

    //升级弹窗内容
    function upLevel(levelName, id, referralcode, mobile) {
        $.AkmiiAjaxPost(apiUrl_prefix + "/vipcenter/members/upgrade", {
            id: id
        }, true).then(function (data) {
            if (data.code == 200) {
                var giftList = data.data;
                $(".win_text span").text(levelName);
                for (var i = 0; i < giftList.length; i++) {
                    var giftAmount = giftList[i].amount || '';

                    switch (giftList[i].goodsEnum) {
                        case 'JF':
                            var giftValue = "唐果<br>" + giftAmount;
                            $(".privilege_two").html(giftValue);
                            break;
                        case 'LCJ':
                            var giftValue = "理财金<br>" + giftAmount + "元";
                            if (giftAmount) {
                                $(".privilege_three_txt").show(); //有文字内容的显示
                                $(".privilege_three_pic").hide(); //用图片显示
                                $(".privilege_three").html(giftValue);
                            } else {
                                $(".privilege_three_txt").hide();
                                $(".privilege_three_pic").show();
                            }
                            break;
                        case 'FXQ':
                            if (giftAmount > (parseFloat($(".privilege_forth").html()) || 0)) {
                                var giftValue = "返利券<br>" + giftAmount + "%";
                                $(".privilege_forth").html(giftValue);
                            }
                            break;
                        case 'DJQ':
                            var giftValue = "代金券<br>" + giftAmount + "元";
                            if (giftAmount) {
                                $(".privilege_five_txt").show(); //有文字内容的显示
                                $(".privilege_five_pic").hide(); //用图片显示
                                $(".privilege_five").html(giftValue);
                            } else {
                                $(".privilege_five_txt").hide();
                                $(".privilege_five_pic").show();
                            }
                            break;
                        case 'JXQ':
                            if ($(".privilege_five").html() == "") {
                                var giftValue = "加息券<br>" + giftAmount + "%";
                                if (giftAmount) {
                                    $(".privilege_five_txt").show(); //有文字内容的显示
                                    $(".privilege_five_pic").hide(); //用图片显示
                                    $(".privilege_five").html(giftValue);
                                } else {
                                    $(".privilege_five_txt").hide();
                                    $(".privilege_five_pic").show();
                                }
                            }
                            break;
                    }

                    /* if (giftList[i].goodsEnum == "FXQ") { //返利券
                        var giftValue = "返利券<br>" + giftAmount;
                        $(".privilege_two").html(giftValue);
                    } else if (giftList[i].goodsEnum == "JF") { //唐果
                        var giftValue = "唐果<br>" + giftAmount;
                        $(".privilege_two").html(giftValue);
                    } else if (giftList[i].goodsEnum == "DJQ") { //代金券
                        var giftValue = "代金券<br>" + giftAmount + "元";
                        $(".privilege_forth").html(giftValue);
                    } else if (giftList[i].goodsEnum == "LCJ") { //理财金
                        var giftValue = "理财金<br>" + giftAmount + "元";
                        if (giftAmount) {
                            $(".privilege_three_txt").show(); //有文字内容的显示
                            $(".privilege_three_pic").hide(); //用图片显示
                            $(".privilege_three").html(giftValue);
                        } else {
                            $(".privilege_three_txt").hide();
                            $(".privilege_three_pic").show();
                        }
                    } else if (giftList[i].goodsEnum == "JXQ") { //加息券
                        var giftValue = "加息券<br>" + giftAmount + "%";
                        if (giftAmount) {
                            $(".privilege_five_txt").show(); //有文字内容的显示
                            $(".privilege_five_pic").hide(); //用图片显示
                            $(".privilege_five").html(giftValue);
                        } else {
                            $(".privilege_five_txt").hide();
                            $(".privilege_five_pic").show();
                        }
                    } */
                }
                //升级弹窗中的去炫耀按钮
                $(".JS_share").click(function () {
                    $(".mask_share").hide();
                    $(".member_win").removeClass("scale");
                    shareDate(id, referralcode, mobile);
                    if (apptype == 'ios') {
                        PhoneMode.callShare(jsondata);
                    } else if (apptype == 'android') {
                        window.PhoneMode.callShare(JSON.stringify(jsondata));
                    } else {
                        // AboutShare(id, referralcode, mobile);
                        tip_show();
                        setTimeout("tip_close()", 1500);
                    }
                    //
                    $.AkmiiAjaxPost(apiUrl_prefix + "/members/share", {
                        id: id
                    }, true).then(function (data) {
                        //console.log(1);
                    })

                });
                //升级弹框关闭
                $(".JS_close").click(function () {
                    $(".mask_share").hide();
                    $(".member_win").removeClass("scale");
                    //
                    $.AkmiiAjaxPost(apiUrl_prefix + "/members/share", {
                        id: id
                    }, true).then(function (data) {
                        //console.log(1);
                    })
                })
            }
        })
    }
})

function appShare(id, referralcode, mobile) {
    //alert(111);
    shareDate(id, referralcode, mobile);
    if (apptype == 'ios') {
        PhoneMode.headerShare(jsondata);
    } else if (apptype == 'android') {
        window.PhoneMode.headerShare(JSON.stringify(jsondata));
    } else {
        AboutShare(id, referralcode, mobile);
    }
}
//分享引导层的显示与隐藏
function tip_show() {
    $(".guide_layer").show();
    $(".tip_img").show();
}

function tip_close() {
    $(".guide_layer").hide();
    $(".tip_img").hide();
}
//iOS中后退分享接口调用问题
function iosBackShare() {
    setTimeout(function () {
        var phjs = $.getLS("phjs");
        //alert(phjs);
        if (!!phjs) {
            //var vphjs
            jsondata = JSON.parse(phjs);
            //alert(vphjs.title);
            if (apptype == 'ios') {
                // alert(apptype);
                PhoneMode.headerShare(jsondata);
            }
        }
    }, 500);
}

function imgsUrl() {
    //不同环境静态图片位置
    window.imgUrl_hostname = "http://txsh5.zbjf.com";
    window.imgUrl_host = window.location.hostname;
    if (imgUrl_host == "tservice.txslicai.com.cn") {
        imgUrl_hostname = "https://tservice.txslicai.com.cn";
    } else if (imgUrl_host == "tservice.txslicai.com") {
        imgUrl_hostname = "https://tservice.txslicai.com";
    } else if (imgUrl_host == "accept.txslicai.com") {
        imgUrl_hostname = "https://accept.txslicai.com";
    } else if (imgUrl_host == "xysaccept.txslicai.com") {
        imgUrl_hostname = "https://xysaccept.txslicai.com";
    } else if (imgUrl_host == "service.txslicai.com" || apiUrl_host == "service.txslicai.com.cn" || apiUrl_prefix == "preprod.txslicai.com") {
        imgUrl_hostname = "https://txsres.txslicai.com";
    } else {
        imgUrl_hostname = "http://txsh5.zbjf.com";
    }
}

function shareDate(id, referralcode, mobile) {
    jsondata = {
        'title': shareLevelText,
        'desc': '唐小僧，移动生活理财大师',
        'imgUrl': imgUrl_hostname + '/css/img2.0/img/share_icon.jpg',
        'link': window.location.origin + '/html/store/member/member_share.html?id=' + id + '&c=' + referralcode + '&tel=' + mobile
    };
    $.setLS("phjs", JSON.stringify(jsondata));
}

function AboutShare(id, referralcode, mobile) {
    _hmt.push(['_trackEvent', 'Member Grade', 'Box_Share', '会员中心-弹框分享', '会员中心弹框中的分享按钮']); //百度统计
    shareDate(id, referralcode, mobile);
    //分享到朋友圈
    $.getWechatconfig("LuckdrawShare", Success, Fail, jsondata);
    // _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Share', '会员中心-分享', '会员中心用户点击的分享按钮']); //百度统计
}
//分享成功
var Success = function () {
    $.alertF("分享成功");
};
//分享失败
var Fail = function () {
    $.alertF("分享失败，请稍后重试！");
}
//解决APP后退出现引导层的问题
function backShowLayer() {
    if (apptype == 'ios') {
        history.replaceState(null, null, "/html/my/member_level/member_center.html?type=ios");
    } else if (apptype == 'android') {
        history.replaceState(null, null, "/html/my/member_level/member_center.html?type=android");
    } else {
        history.replaceState(null, null, "/html/my/member_level/member_center.html");
    }
}