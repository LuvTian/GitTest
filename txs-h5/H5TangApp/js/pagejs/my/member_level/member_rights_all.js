var member = {
    level: 0,
    contributions: 0, //贡献值
    point: 0, //积分
    levelName: '',
    lastLevelDays: 0 //等级持续时间
}
var level;

var userId = $.getCookie("userid");
var allPrivileges = [];

$(window).scrollTop(0);//修复回退位置

function getUserLevel() {
    var getUserLevel_url = apiUrl_prefix + "/vipcenter/members/portal";
    $.AkmiiAjaxPost(getUserLevel_url, {
        id: userId
    }, false).then(function (d) {
        if (d.code == 200) {
            member.level = d.data.level;
            member.contributions = d.data.currentContribution;
            var levelContributionIntervals=d.data.levelContributionIntervals;
            $(".privilegesContainer").each(function (k, v) {
                var tmp_level = levelContributionIntervals[k];
                if (k == member.level) {
                    $(v).find(".title span").text("(当前等级)");
                    setTimeout(function(h){return function(){$(window).scrollTop(h)}}($(v).position().top),0);
                } else {
                    if (k > member.level) {
                        $(v).find(".title span").text("(还需投资" + (tmp_level.contributionValueStart - member.contributions) + "元)");
                    }
                }
            })

            if(member.level==levelContributionIntervals[levelContributionIntervals.length-1].id){
                $("#wantUp").attr({"href":"javascript:phoneProxy.jumpToPage('licai')"}).text("我要投资").unbind("click");
            }

            var tpl_upWin = '<li>升级至{0}会员还需投资：<span class="up_money">{1}</span>元</li>';
            $.each(d.data.levelContributionIntervals, function (k, v) {
                if (v.id > member.level) {
                    $(".up_content").append(tpl_upWin.format(v.levelName, v.contributionValueStart - member.contributions))
                }
            })
        } else {
            alert(d.message);
        }
    })
}


function getAllPrivileges(cb) {
    if (allPrivileges.length == 0) {
        var getAllPrivileges_url = apiUrl_prefix + "/vipcenter/privilege/all";
        $.AkmiiAjaxPost(getAllPrivileges_url, {
            id: userId
        }, false).then(function (d) {
            if (d.code == 200) {
                console.log(d);
                var tpl = '<section class="privilegesContainer" id="{1}">\
                            <div class="title">{0}会员特权<span></span></div>\
                            <ul></ul>\
                        </section>';
                var tpl_item = '<li>\
                                <img class="pImg" src="{0}" alt="">\
                                <div class="content">\
                                    <p class="name">{1}</p>\
                                    <p class="giftBag">{2}{4}</p>\
                                    <span class="status">{3}</span>\
                                </div>\
                            </li>';
                //imgPrivilege2d
                $.each(d.data, function (k, v) {
                    var _section = $(tpl.format(v.levelName, "sec"+(k+1)));
                    var _ul = _section.find("ul");
                    var level = v.levelId;
                    $.each(v.privilege4VipModels, function (k, v) {
                        var sendStatus = "";//v.sendStatusTip  产品要求不显示
                        if (v.privilegeType == 2) {
                            switch (v.sendStatus) {
                                case "NO_SEND":
                                    sendStatus = "<a href='/html/my/user-sign.html'>签到<i class='leftArrow'></i></a>";
                                    break;
                                case "HAS_SEND":
                                    sendStatus = "已签";
                                    break;
                            }
                        }
                        var issue="";
                        if(v.giftBagType==1 || v.giftBagType==3){
                            if(v.issueTime==2){
                                issue="(每月"+v.issueDay+"号)";
                            }
                            if(v.issueTime==1){
                                issue="(每日)";                           
                            }
                        }
                        //TODO判断类型为唐果单独处理
                        var _li = $(tpl_item.format(v.imgPrivilege2d, v.privilegeNameTopShow || "", v.privilegeName || "", sendStatus || "",issue));
                        _li.click(function (e) {
                            if (e.target.nodeName != "A") {
                                checkLevelBeforeJump(level, "member_rights_detail.html?id=" + v.id);
                            }
                        })
                        _ul.append(_li);
                    })
                    $("#mainBody").append(_section);
                })

                if (cb) {
                    cb.call();
                }
            } else {
                alert(d.message);
            }

        })
    }
}


function checkLevelBeforeJump(level, url) {
    if (level >= member.level) {
        window.location.href = url;
    } else {
        return false;
    }
}


$(function () {
    $("#wantUp").click(function () {
        $(".upPopWin").show();
    })
    $(".upPopWin .up_cose").click(function () {
        $(".upPopWin").hide();
    })

    getAllPrivileges(getUserLevel);
})