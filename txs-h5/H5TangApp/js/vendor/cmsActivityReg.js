/// <reference path="vendor/jquery-2.2.0.js" />
(function ($) {
  var isNewUser = false;
  var hasYZM = false;
  // var resurl = "https://service.txslicai.com";
  var resurl = (function () {
    var orig = window.location.origin;
    if (orig.indexOf("cmstest1.txslicai.com") != -1) {
      return "https://tservice.txslicai.com";
    } else if (orig.indexOf("cmsuat.txslicai.com") != -1) {
      return "https://accept.txslicai.com";
    } else if (orig.indexOf("cmsxysuat.txslicai.com") != -1) {
      return "https://xysaccept.txslicai.com";
    } else if (orig.indexOf("cmsh5.txslicai.com") != -1) {
      return "https://service.txslicai.com";
    } else return "";
  })();
  $.fn.newUserReg = function (opts) {
    var opt = {
      phone: '#txtmobile', // 手机号编辑框
      txtimgyzm: '#txtimgyzm', // 图形验证码编辑框
      phoneyzm: '#txtsmsyzm', // 手机验证码编辑框
      getyzm: '#getYZM', // 获取手机验证码
      imgyzm: '#imgYZM', // 获取图形验证码
      register: '#luckydrawregister', // 点击立即注册
      InvitedBy: '', // 渠道号
      checkedPhoneNum: "", //获取过验证码的手机号码（私有，无需初始化）
      confirmRegister: false, //是否要弹框确认是否注册
      qjs: false,
      loginCallback: function (json) {
        if (!!opt.qjs) {
          $.showQfax();
        } else {
          window.location.href = "https://service.txslicai.com/html/product/index.html";
        }

      },
      regCallback: function (json) { } // 点击注册之后的callback
    };
    opt = $.extend(opt, opts || {});
    var $phone = $(opt.phone),
      $txtimgyzm = $(opt.txtimgyzm),
      $imgyzm = $(opt.imgyzm),
      $phoneyzm = $(opt.phoneyzm),
      $getyzm = $(opt.getyzm),
      $register = $(opt.register);
    var $txtInvitedBy = opt.InvitedBy || $.getQueryStringByName("c"); //推荐码
    if (!$.isNull($txtInvitedBy)) {
      $.setCookie("RecommendedCode", $txtInvitedBy);
    } else {
      $txtInvitedBy = $.getCookie("RecommendedCode");
    }
    var YZMObj = {
      getImgYZM: function (id) {
        var $id = $("#" + id);
        YZMObj.getimgCode(id);
        $id.click(function () {
          YZMObj.getimgCode(id);
        });
      },
      getimgCode: function (id) {
        var $id = $("#" + id);
        var imgkey = $id.attr("alt");
        $.AkmiiAjaxPost(resurl + "/StoreServices.svc/Anonymous/user/getimgcode", {
          imgkey: imgkey
        }, true).then(
          function (d) {
            $id.attr("src", d.imgcode);
            $id.attr("alt", d.imgkey);
          });
      }
    };
    return this.each(function () {
      YZMObj.getImgYZM(opt.imgyzm.replace('#', '')); //图形验证码
      $getyzm.click(function () {
        if (validate("getYZM")) {
          //获取验证码
          getSMSyzm();
        }
      });
      $register.click(function () {
        if (!isNewUser) {
          doLogin();
          return;
        }
        doRegister();
      });
    });

    function doRegister() {
      var regProcess = function () {
        var data = {
          "mobile": $phone.val(),
          "smscode": $phoneyzm.val(),
          "imgkey": $imgyzm.attr("alt"),
          "InvitedBy": $txtInvitedBy
        };
        $.AkmiiAjaxPost(resurl + "/StoreServices.svc/Anonymous/user/register", data, false).then(function (d) {
          if (d.result) {
            _gsq.push(["T", "GWD-002985", "track", "/targetpage/regok_success"]);
            try {
              window._zdc && window._zdc('adenroll');
            } catch(e){
              ;
            }
            $.alertF("恭喜,注册成功!", "确定", function () {
              if (opt.regCallback)
                opt.regCallback(d);
              else {
                if (!!opt.qjs) {
                  $.showQfax();
                } else {
                  window.location.href = "https://service.txslicai.com/html/product/index.html";
                }
              }
            });
          } else {
            $.alertF(d.errormsg);
          }
        });
      }

      if (validate()) {
        if (opt.confirmRegister) {
          $.confirmF("此手机号码未注册<br>继续将注册成为唐小僧会员", null, null, null, regProcess);
        } else {
          regProcess();
        }
      }


    }

    function doLogin() {
      if (validate()) {
        var data = {
          "mobile": $phone.val(),
          "smscode": $phoneyzm.val(),
          "imgkey": $imgyzm.attr("alt"),
          "InvitedBy": $txtInvitedBy
        };
        $.AkmiiAjaxPost(resurl + "/StoreServices.svc/Anonymous/user/loginverification", data, false).then(function (data) {
          if (data.result) {
            _gsq.push(["T", "GWD-002985", "track", "/targetpage/login_success"]);
            $.alertF('您已经是唐小僧注册用户', '', function () {
              //登录
              opt.loginCallback(data);
            })
          } else {
            $.alertF(data.errormsg);
          }
        });
      }
    }

    function getSMSyzm() {
      if ($(this).attr("disabled")) {
        return;
      } //避免重复获取
      var data = {
        "mobile": $phone.val(),
        "imgcode": $txtimgyzm.val(),
        "imgkey": $imgyzm.attr("alt")
      };
      $.AkmiiAjaxPost(resurl + "/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(
        function (json) {
          if (json.result) {
            hasYZM = true;
            opt.checkedPhoneNum = $phone.val();
            $.GetYzm(opt.getyzm.replace(/[#\.]/g, ''), 60);
            isNewUser = !json.isexists;
          } else {
            $.alertF(json.errormsg);
            return false;
          }
        });
    }

    function validate(type) {
      if (!$.isMobilePhone($phone.val())) {
        $.alertF("请输入正确的手机号码！");
        return false;
      }
      if ($.isNull($txtimgyzm.val())) {
        $.alertF("请输入图形验证码");
        return false;
      }
      if (type != "getYZM") { //非获取短信验证码，需要验证以下内容
        if (!hasYZM) {
          $.alertF("请先获取验证码！");
          return false;
        }
        if ($.isNull($phoneyzm.val())) {
          $.alertF("短信验证码不能为空！");
          return false;
        }
      } else {
        if ($.isNull($imgyzm.attr("alt"))) {
          $.alertF("请点击图形验证码刷新！");
          return false;
        }
        return true;
      }
      if (opt.checkedPhoneNum != $phone.val()) {
        $.alertF("请重新获取验证码！");
        return false;
      }
      return true;
    }
  }
})(jQuery);