var rewardtype, level;
var isdrawing = false; //是否正在旋转转盘
var isposting = false; //是否正在ajax请求
var luckday = 0;
var _time;
$(function () {
  luckday = $.getQueryStringByName("luckday") || 0;
  pageInit();
});

var pageInit = function () {
  sundayluckdraw();
  if (new Date().getDay() == luckday) {
    weekdrawlist(); //中奖名单
  } else {
    $(".noluck").show();
    $("#weekdrawlist").hide();
  }
  //抽奖
  $("#luckdraw").bind("click", function () {
    if (!isdrawing && !isposting) {
      if (new Date().getDay() == luckday) {
        luckdraw();
      } else {
        $("._undraw").show()
        $(".mask").show()
      }
    }
  });

  $("#gobuyproduct").click(function () {
    $("._undraw").hide()
    $(".mask").hide()
  })

  $(".icon-cancle").click(function () {
    $(".mask").hide(); //遮罩
    $("#missday").hide(); //弹框
  });
}

function luckdraw() {
  isposting = true;
  var url = "/StoreServices.svc/user/signindraw";
  $.AkmiiAjaxPost(url, {}, true).then(function (data) {
    isposting = false;
    if (data.result) {
      //奖品类型 1:理财红包,2:加息券,3:理财金,4:现金,5:实物,6:福利券,7流量
      rewardtype = data.rewardtype;
      level = data.level;
      // if (data.level == 16 && data.rewardtype == 5) {
      //     rotateFunc(0, '恭喜您 获得Beats Solo3！<br>奖励将于20个工作日内发放，请保持手机通畅');
      // }
      if (data.level == 40 && data.rewardtype == 5) {
        rotateFunc(0, '<span>恭喜获奖</span><span>碧然德（BRITA）过滤净水器 家用滤水壶 净水壶 Marella 金典系列 3.5L（蓝色）</span><a href="/html/my/address_sign.html?time=' + _time + '" class="writeaddress">请填写收货地址</a>');
      } else if (data.level == 3 && data.rewardtype == 8) {
        rotateFunc(36, '<span>恭喜获奖</span><span>200个唐果已放入您的账户<span>');
      }
      // else if (data.level == 18 && data.rewardtype == 5) {
      //     rotateFunc(72, '恭喜您 获得飞利浦声波电动牙刷！<br>奖励将于20个工作日内发放，请保持手机通畅');
      // }
      else if (data.level == 39 && data.rewardtype == 5) {
        rotateFunc(72, '<span>恭喜获奖</span><span>九阳料理机JYL-Y12H</span><a href="/html/my/address_sign.html?time=' + _time + '" class="writeaddress">请填写收货地址</a>');
      } else if (data.level == 4 && data.rewardtype == 8) {
        rotateFunc(108, '<span>恭喜获奖</span><span>30个唐果已放入您的账户<span>');
      }
      // else if (data.level == 1 && data.rewardtype == 8) {
      //     rotateFunc(108, '恭喜您获得300个唐果');
      // }
      else if (data.level == 1 && data.rewardtype == 4) {
        rotateFunc(142, '<span>恭喜获奖</span><span>0.18元已放入您的账户<span>');
      }
      // else if (data.level == 1 && data.rewardtype == 7) {
      //     rotateFunc(142, '恭喜您获得500M流量！<br>奖励将于20个工作日内发放，请保持手机通畅');
      // }
      else if (data.level == 3 && data.rewardtype == 8) {
        rotateFunc(178, '<span>恭喜获奖</span><span>200个唐果已放入您的账户<span>');
      } else if (data.level == 2 && data.rewardtype == 4) {
        rotateFunc(214, '<span>恭喜获奖</span><span>0.66元已放入您的账户<span>');
      } else if (data.level == 1 && data.rewardtype == 8) {
        rotateFunc(250, '<span>恭喜获奖</span><span>10个唐果已放入您的账户<span>');
      }
      //  else if (data.level == 17 && data.rewardtype == 5) {
      //     rotateFunc(286, '恭喜您获得SWAROVSKI（项链耳饰套装）！<br>奖励将于20个工作日内发放，请保持手机通畅');
      // } 
      else if (data.level == 41 && data.rewardtype == 5) {
        rotateFunc(286, '<span>恭喜获奖</span><span>膳魔师（THERMOS）膳魔师保温杯不锈钢真空滤网办公泡茶水杯男士咖啡杯CMK-501 咖啡色,</span><a href="/html/my/address_sign.html?time=' + _time + '" class="writeaddress">请填写收货地址</a>');
      } else if (data.level == 2 && data.rewardtype == 8) {
        rotateFunc(322, '<span>恭喜获奖</span><span>30个唐果已放入您的账户<span>');
      }
    } else {
      if (data.errormsg == "本周未满签，无法抽奖！") {
        $(".mask").show(); //遮罩
        $("#missday").show(); //弹框
      } else {
        $.alertF(data.errormsg);
      }
    }
  }, function () {
    isposting = false;
  });
}

function animateFunc(parent, css, time, height) {
  //var curtop = '-.81';
  //var lheigth = $('#weekdrawlist').find('li').first().height();
  // 顶部动画
  setInterval(function () {
    parent.animate({
      marginTop: height
    }, 600, function () {
      var $li = parent.find(css).first();
      $li.remove();
      parent.append($li).css({
        marginTop: 0
      });
    });
  }, time);
}

var rotateFunc = function (angle, text) {
  isdrawing = true;
  $(".zhuanpan_img").stopRotate();
  $(".zhuanpan_img").rotate({
    //angle: 0,
    duration: 6000,
    animateTo: angle + 360 * 3,
    callback: function () {
      isdrawing = false;
      if (rewardtype == 7 || rewardtype == 5) {
        $.alertF(text);
        return;
      }
      // $.confirmF(text, null, "查看详情", null, function() { window.location.href = rewardlink(); });
      $.alertF(text, '确定', function () {
        window.location.href = rewardlink();
      })
    }
  });
};

//奖品名单
function weekdrawlist() {
  var url = "/StoreServices.svc/user/signindrawinfolist";
  $.AkmiiAjaxPost(url, {}, true).then(function (data) {
    if (data.result) {
      var list = data.usersigninrewardlist;
      var ha = [];
      $.each(list, function (index, item) {
        ha.push(' <li><span >恭喜' + item.rewardmobile + '</span><span class="srespan">获得' + item.rewardname + '</span></li>');
      });
      var html = $(ha.join(""));
      $("#weekdrawlist").append(html);
      animateFunc($("#weekdrawlist"), 'li', 1000, -$("#weekdrawlist").find('li').eq(0).height());
    }
  });
}

//获得奖品对应跳转
function rewardlink() {
  switch (rewardtype) {
    case 1:
      var url = "/html/my/myreward-bonus.html"; //代金券
      return url;
    case 2:
      var url = "/html/my/myreward-ticket.html"; //加息券
      return url;
    case 3:
      var url = "/html/my/financiallist.html"; //理财金
      return url;
    case 4:
      var url = "/html/my/myreward-money.html"; //现金奖励
      return url;
    case 5:
      var url = "/html/my/addresslist.html"; //实物奖
      return url;
    case 8:
      var url = "/html/store/myCredits.html"; //糖果
      return url;
    case 6:
      //暂时没有以后可扩展
      //福利券
      break;
    case 8:
      return "/html/store/myCredits.html";
    case 9:
      return "/html/my/mymitteilung.html"; // 第三方券码
  }
}

//大奖名单
function sundayluckdraw() {
  var url = "/StoreServices.svc/user/getsigninrealcouponlistbydate";
  $.AkmiiAjaxPost(url, {}, true).then(function (data) {
    if (data.result) {
      var gettime = new Date(data.date)
      _time = gettime.getFullYear() + "-" + (gettime.getMonth() + 1) + "-" + gettime.getDate()
      // var _month=gettime.getMonth+1;
      // var _day=
      var list = data.signinrealcouponbydatelist;
      var ha = [];
      $.each(list, function (index, item) {
        ha.push('<p class="retext">' + item.showrewardmes + '<span class="re_red">' + item.rewardmemo + '</span></p>');
      });
      var html = $(ha.join(""));
      $(".plist").append(html);
      animateFunc($(".plist"), '.retext', 3000, '-.81rem');
    }
  });
}