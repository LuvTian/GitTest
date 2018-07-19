var today = new Date();
var CURRENT_MONDAY = new Date(getMonDate());
var CURRENT_TODAY = new Date(new Date().Format("yyyy/MM/dd 00:00:00"));
var type = $.getQueryStringByName("type");
var $user_sign = $("#user-sign");
var $sign_div = $("#user-sign").parent();
var leaksignday;
var signupdaynum;
var luckday = 0;
var fromLeaking = false;

// 获取用户信息
var account = [];
var getUserInfo = function () {
  var url = "/StoreServices.svc/user/info";
  $.AkmiiAjaxPost(url, {}, true).then(function (data) {
    if (data.result) {
      account = data.accountinfo;
      $.setCookie("refcode", data.accountinfo.referralcode);
      account.cansign = (account.demandbalance + account.fixedbalance) >= 1000
      $.CheckAccountCustomStatusBeforeNext(account);
      share();
    }
    initMonth();
  });
}

// 计算周一日期
function getMonDate() {
  var _today = new Date(today); // 当前日期
  var _day = _today.getDay(); // 礼拜几
  var _monday = _today.addDays(_day == 0 ? (-6) : (1 - _day));
  return new Date(_monday);
}

//计算周日历显示日期
var initMonth = function () {
  var _monday_date = getMonDate();
  var _sunday_date = new Date(_monday_date).addDays(6);
  for (var start = _monday_date; start.getTime() <= _sunday_date.getTime(); start.addDays(1)) {
    var _day = start.getDay();
    var _date = start.getDate();
    if (_date == new Date().getDate()) {
      $(".signlista").eq(_day - 1).find(".num2").text("今日").addClass("adCtoday")
      $(".signlista").eq(_day - 1).find(".num1").hide();
      $(".signlista").eq(_day - 1).data("bind", start.Format("yyyy/MM/dd"));
    } else {
      $(".num1").eq(_day == 0 ? 6 : (_day - 1)).text(_date);
      $(".signlista").eq(_day == 0 ? 6 : (_day - 1)).data("bind", start.Format("yyyy/MM/dd"));
    }
  }
  getSignList();
}

//获取周日历签到列表
var getSignList = function () {
  var url = "/StoreServices.svc/user/weeksignlist?v=" + (new Date()).getTime();
  var param = {
    "signtime": today.Format("yyyy/MM/dd")
  };
  $.AkmiiAjaxPost(url, param).then(function (data) {
    if (data.result) {
      leaksignday = data.leaksignday;
      signupdaynum = data.signupdaynum;
      if (leaksignday == 0) {
        $(".gift_tip").text("抽取大奖");
        $(".percent_2 img").attr("src", $.resurl() + "/css/signed/gift02.png");
      }
      var signList = data.usersigninfolist;
      $.each(signList, function (index, entry) {
        entry.signdate = entry.signdate.replace(/-/g, '/');
        //控制按钮对应的显示
        if ((new Date(data.date).getDay()) == 0 && leaksignday == 0) {
          //周日永远显示“签到”按钮
          $user_sign.text("签到");
        } else {
          if ((entry.signdate != new Date().Format("yyyy/MM/dd"))) {
            $user_sign.text("签到");
          } else if (entry.signdate == new Date().Format("yyyy/MM/dd") && data.leaksignday == 0) {
            $sign_div.unbind("click").addClass("bg-eebdbd");
            $user_sign.text("已签到").css("color", "#E2A761");
          } else if (entry.signdate == new Date().Format("yyyy/MM/dd") && data.leaksignday != 0) {
            $user_sign.html("补签(" + signupdaynum + "次机会)");
          };

        }
        //已签
        getDataValue(entry.signdate).find("img.signedshow").show();
      })
      if ((new Date().getDay()) == 0 && leaksignday == 0) {
        $("#user-sign").text("签到");
      } else if ((new Date().getDay()) == 0 && leaksignday != 0) {
        $("#user-sign").text("补签(" + signupdaynum + "次机会)");
      }
    } else {
      $.alertF(data.errormsg);
    }
  })
}

//获取data属性
var getDataValue = function (target) {
  var targetElement = $("");
  $(".signlista").each(function (i, item) {
    if ($(item).data("bind") == target.replace(/-/g, '/')) {
      targetElement = $(item);
      return false;
    }
  });
  return targetElement;
}
//签到
var sign = function () {

  var signtext = $user_sign.html();
  if (signtext == "签到") { //签到
    var url = "/StoreServices.svc/user/signdaynew";
    $.AkmiiAjaxPost(url, {}).then(function (data) {
      if (data.result) {
        if (data.memberpoints == 0) {
          $("#tgcount").parent().hide();
        } else {
          $("#tgcount i").text(data.memberpoints);
          $("#tgcount span").text(data.memberunit);
          if (data.memberlevelname == "铂金") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_bj.png")
          } else if (data.memberlevelname == "黄金") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_hj.png")
          } else if (data.memberlevelname == "白银") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_by.png")
          } else if (data.memberlevelname == "青铜") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_qt.png")
          }
        };
        if (data.rewardtype == 1) {
          $("#signrwardsaward .getredname").text("代金券");
        } else if (data.rewardtype == 2) {
          $("#signrwardsaward .getredname").text("加息券");
        } else if (data.rewardtype == 3) {
          $("#signrwardsaward .getredname").text("理财金");
        } else if (data.rewardtype == 4) {
          $("#signrwardsaward .getredname").text("现金");
        } else if (data.rewardtype == 6) {
          $("#signrwardsaward .getredname").text("福利券");
        } else if (data.rewardtype == 7) {
          $("#signrwardsaward .getredname").text("流量");
        } else if (data.rewardtype == 9) {
          $("#signrwardsaward .getredname").text("现金券");
        } else {
          $("#signrwardsaward .getredname").text("唐果");
        }
        $("#sign_rew_count i").text(Number(data.amount))
        $("#sign_rew_count span").text(data.unit)

        $(".medium-box,.mask").show();
        $("#gettangsweetsreward").click(function () {
          window.location.href = "/html/store/myCredits.html";
        })
        $("#signrwardsaward").click(function () {
          if ($("#signrwardsaward .getredname").text() == "代金券") {
            window.location.href = "/html/my/myreward-bonus.html";
          } else if ($("#signrwardsaward .getredname").text() == "加息券") {
            window.location.href = "/html/my/myreward-bonus.html";
          } else if ($("#signrwardsaward .getredname").text() == "理财金") {
            window.location.href = "/html/product/product-financialbuylist.html";
          } else if ($("#signrwardsaward .getredname").text() == "现金") {
            window.location.href = "/html/my/myreward-money.html";
          } else if ($("#signrwardsaward .getredname").text() == "福利券") {
            //暂时没有以后可扩展
            //福利券
          } else if ($("#signrwardsaward .getredname").text() == "流量") {
            //暂时没有以后可扩展
          } else if ($("#signrwardsaward .getredname").text() == "现金券") {
            window.location.href = "/html/my/mymitteilung.html";
          } else {
            window.location.href = "/html/store/myCredits.html";
          }
        })
        share();
        getSignList();

      } else if (data.errorcode == 'missing_parameter_accountid') {
        $.Loginlink();
        return;
      } else if (data.errorcode == "99999") {
        $.confirmF("您当天在投金额未满一千元，不能参与签到！", "取消", "去投资", null, function () {
          window.location.replace("/html/product/index.html");
        });
      } else {
        $.alertF(data.errormsg);
      }
    });
    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "日签正常签到", "签到"]);
  } else {


    //getSignList();
    leaksign(); //补签
  }
};



//补签
$("#gobuyproduct").click(function () {
  _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "补签-->跳转到理财列表", "签到"]);
  window.location.href = "/html/product/index.html"; //定期理财列表
});

function leaksign() {
  fromLeaking = true;
  if (parseInt(leaksignday) <= 0) {
    return;
  } else {
    if (signupdaynum == 0) {
      $("#nosign").show();
      $(".mask").show();
      $("#leaksignz").html(leaksignday); //漏签天数
      $("#buymoney").html((leaksignday * 1000));
    } else {
      $.AkmiiAjaxPost("/StoreServices.svc/activity/accountsignup", {}).then(function (data) {
        if (data.result) {

          if (data.memberlevelname == "铂金") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_bj.png")
            $(".medium-box,.mask,#member_level_sc").show();
            $("#gettangsweetsreward").click(function () {
              window.location.href = "/html/store/myCredits.html";
            })

            $("#signrwardsaward").hide();
            $("#tgcount i").text(data.memberpoints);
            $("#tgcount span").text(data.memberunit);
          } else if (data.memberlevelname == "黄金") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_hj.png")
            $(".medium-box,.mask,#member_level_sc").show();
            $("#gettangsweetsreward").click(function () {
              window.location.href = "/html/store/myCredits.html";
            })

            $("#signrwardsaward").hide();
            $("#tgcount i").text(data.memberpoints);
            $("#tgcount span").text(data.memberunit);
          } else if (data.memberlevelname == "白银") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_by.png")
            $(".medium-box,.mask,#member_level_sc").show();
            $("#gettangsweetsreward").click(function () {
              window.location.href = "/html/store/myCredits.html";
            })

            $("#signrwardsaward").hide();
            $("#tgcount i").text(data.memberpoints);
            $("#tgcount span").text(data.memberunit);
          } else if (data.memberlevelname == "青铜") {
            $("#member_level_sc").attr("src", $.resurl() + "/css/signed/sc_qt.png")
            $(".medium-box,.mask,#member_level_sc").show();
            $("#gettangsweetsreward").click(function () {
              window.location.href = "/html/store/myCredits.html";
            })

            $("#signrwardsaward").hide();
            $("#tgcount i").text(data.memberpoints);
            $("#tgcount span").text(data.memberunit);
          } else {
            $.alertT('恭喜', '补签成功', '确定')
          }

          var url = "/StoreServices.svc/user/weeksignlist?v=" + (new Date()).getTime();
          var param = {
            "signtime": today.Format("yyyy/MM/dd")
          };
          $.AkmiiAjaxPost(url, param).then(function (data) {
            if (data.result) {
              signupdaynum = data.signupdaynum;
              leaksignday = data.leaksignday;
              var signList = data.usersigninfolist;
              $.each(signList, function (index, item) {
                item.signdate = item.signdate.replace(/-/g, '/');
                //控制按钮对应的显示
                if ((new Date(data.date).getDay()) == 0 && leaksignday == 0) {
                  //周日永远显示“签到”按钮
                  $user_sign.text("签到");
                } else {

                  if ((item.signdate != new Date().Format("yyyy/MM/dd"))) {
                    $user_sign.text("签到");
                  } else if (item.signdate == new Date().Format("yyyy/MM/dd") && data.leaksignday == 0) {
                    $sign_div.unbind("click").addClass("bg-eebdbd");
                    $user_sign.text("已签到").css("color", "#E2A761");
                  } else if (item.signdate == new Date().Format("yyyy/MM/dd") && data.leaksignday != 0) {
                    $user_sign.html("补签(" + signupdaynum + "次机会)");
                  }
                }
                getDataValue(item.signdate).find("img.signedshow").show();
              })
              if ((new Date().getDay()) == 0 && data.leaksignday == 0) {
                $("#user-sign").text("签到");
              } else if ((new Date().getDay()) == 0 && data.leaksignday != 0) {
                $("#user-sign").text("补签(" + signupdaynum + "次机会)");
              }
            } else {
              $.alertF(data.errormsg)
            }
          })

        } else {
          $.alertF(data.errormsg)
        }
      })
    }

  }
  _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "补签", "签到"]);
}

//查看奖励
$(".btn_getward").click(function () {
  if (fromLeaking) {
    window.location.href = "/html/store/myCredits.html";
  } else {
    window.location.href = "/html/my/sign-rewards.html";
  }
});

$(".sign-close,.cancle_sure,.mask").click(function () {
  $(".medium-box,.miss-tip,.mask").hide();
}) //关闭

$(".sharemask,.share_icon,.share_icon img").click(function () {
  $(".share_icon,.sharemask").hide();
})

function share() {
  var url = "/StoreServices.svc/user/getsigninsharefriendconfig";
  $.AkmiiAjaxPost(url, {}, true).then(function (data) {
    if (data.result) {
      var model = data.signinsharemodel;
      luckday = model.signinturntabledate;
      jsondata = {
        'link': window.location.origin + '/html/my/user-sunday-sign-rewardlist.html?c=' + account.referralcode+'&luckday='+luckday,
        'title': model.rewardmemo || "每日签到", // 分享标题
        'desc': '' + model.content + '',
        'imgUrl': 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
      };
      $.getWechatconfig("activityshare", Success, sharecallback, jsondata);
    }
  });
  //getSignList();
}
// 点击签到
$sign_div.click(function () {
  if ((new Date().getDay()) == 0 && leaksignday == 0) {
    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "周签", "签到"]);
    window.location.href = "/html/my/user-sunday-sign-rewardlist.html"; //抽大奖页面
    return;
  } else if ((new Date().getDay()) == 0 && leaksignday != 0) {
    $("#user-sign").text("补签(" + signupdaynum + "次机会)");
    sign()
  } else {
    sign(); 
  }

});

$(".signlista").click(function () {
  if (this.id == "week" && CURRENT_MONDAY.getTime() == getMonDate().getTime()) {
    window.location.href = "/html/my/user-sunday-sign-rewardlist.html?luckday=" + luckday; //抽大奖页面
  }
});
//分享补签一次
function Success() {
  var url = "/StoreServices.svc/user/sharefriendsignup";
  $.AkmiiAjaxPost(url, {}).then(function (data) {
    //sharecallback();
    $(".sharemask").hide();
    $(".share_icon").hide();
    if (data.result) {
      getSignList();
      if (leaksignday == 1) {
        $.alertT("小僧已为您补签1天", "保持每日签到的良好习惯，即有机会在周日抽中大奖哦！", "确定");
      } else if (leaksignday > 1) {
        $.alertT("小僧已为您补签1天，<br>剩余" + parseInt(leaksignday - 1) + "天漏签", "今天单笔投资定期理财产品达" + parseInt(leaksignday - 1) * 1000 + "元，即可补完本周漏签！参加周日赢大奖！", "去投资", linkinvest);
      }
    } else {
      if (leaksignday == 0) {
        $.alertT("您本周已签满", "据说分享次数多的人，能够提升中大奖的机率哦！", "确定");
      } else {
        $.alertT("分享补签机会已用完，<br>剩余" + leaksignday + "天漏签", "今天单笔投资定期理财产品达" + leaksignday * 1000 + "元 即可补完本周漏签！参加周日赢大奖！", "确定");
      }
    }
  });
}

function linkinvest() {
  _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "去投资", "签到"]);
  window.location.href = "/html/product/index.html";
}

$("#leaksignhtml,.flt-r button").click(function () {
  if (type == "ios") {
    jsondata.callback = "Success";
    jsondata.failback = "sharecallback";
    //JS 调用本地分享方法
    PhoneMode.callShare(jsondata);
  } else if (type == "android") {
    jsondata.callback = "Success";
    jsondata.failback = "sharecallback";
    //JS 调用本地分享方法
    window.PhoneMode.callShare(JSON.stringify(jsondata));
  } else {
    $(".sharemask").show();
    setTimeout(function () {
      $(".share_icon").show();
    }, 500);
  }
});

function sharecallback() {
  $(".sharemask").hide();
  $(".share_icon").hide();
  $.alertT("","施主需要分享到朋友圈才能获得奖励哦！","确定")
}

function changeNum(n){
  
  var t = ["零","一","二","三","四","五","六","七","八"]
  if(n>t.length){
    return false;
  }
  return t[n]
}

//排行
function ranking(){
  $.AkmiiAjaxPost("/StoreServices.svc/activity/financialmasterracelamp", {}, false).then(function(d){
    if(d.result){
      if(d.list && d.list.length>0){
        var _t = d.list.slice(0,10),
            t = "",
            gt = $("#showlist").html();  
          $.each(_t,function(ind,rank){
            if(ind<3){
              $(".tel").eq(ind).text(rank.Mobile);
              $(".start").eq(ind).text(changeNum(rank.CurrentLevel)+"星");
              $(".moneyrewards").eq(ind).text(rank.TotalReward);
            }else{
              t += gt.replace("{0}",ind+1)
                  .replace("{1}",rank.Mobile)
                  .replace("{2}",changeNum(rank.CurrentLevel))
                  .replace("{3}",rank.TotalReward)
            }
            $(".rankbody").html(t)
            $(".relist:even").css("background","#F7F7F7")
          })
      }
    }else{
      $.alertF(d.errormsg)
    }
  })
}

$(function () {
  ranking()
  getUserInfo();
  $(".rewardsname").click(function () {
    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "我的奖励", "签到"]);
    window.location.href = "/html/my/sign-rewards.html"
  })
  $(".rule").click(function () {
    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", account.referralcode, "签到规则", "签到"]);
    window.location.href = "/html/my/sign-rule.html"
  })
})
