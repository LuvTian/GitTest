<template>
  <div class="login-container">
    <div class="login-warp">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
        <h3 class="title">唐小僧欢迎您</h3>
        <transition-group name="breadcrumb" mode="out-in">
          <div v-if="isLogin" :key="1">
            <p class="sub-title">请先登录需要僧财宝转入的唐小僧账号</p>
            <el-form-item prop="phone">
              <span class="svg-container svg-container_login">
                <i class="icon-phone">
                </i>
              </span>
              <el-input maxlength="11" name="phone" type="text" v-model="loginForm.phone" @keyup.enter.native="handleLogin" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item class="sms-warp" prop="captcha">
              <span class="svg-container svg-container_login">
                <i class="icon-imgyzm">
                </i>
              </span>
              <el-input maxlength="4" name="captcha" type="text" v-model="loginForm.captcha" @keyup.enter.native="handleLogin" placeholder="请输入图形验证码" />
              <img :src="captchaUrl" title="点击刷新" alt="点击刷新" class="getyzm" @click="getCaptcha">
            </el-form-item>
            <el-form-item class="sms-warp" prop="smscode">
              <span class="svg-container svg-container_login">
                <i class="icon-sms">
                </i>
              </span>
              <el-input maxlength="6" name="smscode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.smscode" placeholder="请输入短信验证码"></el-input>
              <span class="getsms" :class="{'sms-disabled':smsDisabled}" @click="getSMSCode">
                {{smsText}}
              </span>
            </el-form-item>

            <el-form-item>
              <el-button class="login-submit" type="primary" :loading="loading" @click.native.prevent="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </div>
          <div v-else :key="2">
            <p class="sub-title">此功能暂时只对已注册用户开放，您可以扫描微信二维码，关注唐小僧公众号注册操作。</p>
            <img class="wechatqr" src="../../assets/login/wechatqr.png" alt="唐小僧微信公众号">
            <p class="goto-login" @click="toggleLogin">
              重新登录
            </p>
          </div>
        </transition-group>
      </el-form>
      <div class="banner">
      </div>
    </div>
    <div class="login-bg">
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { captcha, smsCode } from "@/api/login";
import { isPhoneNumber, isNumber } from "@/utils/validate";
export default {
  name: "login",
  data() {
    const validatePhone = (rule, value, callback) => {
      var _value = value.trim();
      if (_value.length < 1) {
        callback(new Error("请输入正确的手机号"));
      } else if (!isPhoneNumber(_value)) {
        callback(new Error("请输入正确的手机号格式"));
      } else {
        callback();
      }
    };
    const validateSmscode = (rule, value, callback) => {
      var _value = value.trim();
      let pat = /^[0-9]{6}$/;
      if (_value.length < 1) {
        callback(new Error("请输入短信验证码"));
      } else if (!pat.test(_value) || isNaN(_value)) {
        callback(new Error("请输入正确的短信验证码格式"));
      } else {
        callback();
      }
    };
    const validateCaptcha = (rule, value, callback) => {
      var _value = value.trim();
      let pat = /^[0-9]{4}$/;
      if (this.loginForm.imgkey === "") {
        callback(new Error("请重新获取图形验证码"));
      } else if (_value.length < 1) {
        callback(new Error("请输入图形验证码"));
      } else if (!pat.test(_value) || isNaN(_value)) {
        callback(new Error("请输入正确的图形验证码格式"));
      } else {
        callback();
      }
    };
    return {
      isLogin: true,
      captchaUrl: "",
      loginForm: {
        phone: "",
        smscode: "",
        imgkey: "",
        captcha: ""
      },
      loginRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        smscode: [
          { required: true, trigger: "blur", validator: validateSmscode }
        ],
        captcha: [
          { required: true, trigger: "blur", validator: validateCaptcha }
        ]
      },
      loading: false,
      countDown: 60, //倒计时60秒
      smsDisabled: false, //短信验证码按钮禁止点击
      smsText: "获取验证码",
      smsDefaultText: "获取验证码",
      sms_Interval: 0,
      smsSended: false, //是否已获取短信验证码
      isNewUser: false //是否是新用户
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    toggleLogin() {
      this.isLogin = !this.isLogin;
    },
    /**
     * 获取短信验证码
     */
    smsCountDown() {
      this.smsDisabled = true;
      let _countDown = this.countDown;
      this.sms_Interval = setInterval(() => {
        if (_countDown <= 0) {
          this.smsText = this.smsDefaultText;
          this.smsDisabled = false;
          clearInterval(this.sms_Interval);
          return;
        }
        this.smsText = _countDown + " S";
        _countDown--;
      }, 1000);
    },
    clearCountDown() {
      this.smsDisabled = false;
      this.smsText = this.smsDefaultText;
      clearInterval(this.sms_Interval);
    },
    getCaptcha() {
      captcha("APSNET")
        .then(
          data => {
            this.captchaUrl = data.imgcode;
            this.loginForm.imgkey = data.imgkey;
          },
          () => {
            Message({
              message: "网络异常验证码获取失败,请刷新",
              type: "error",
              duration: 5 * 1000
            });
          }
        )
        .catch(message => {
          console.log("get captcha error", message);
        });
    },
    /*获取短信验证码 */
    getSMSCode() {
      if (this.smsDisabled) {
        return;
      }
      this.$refs.loginForm.validateField("phone");
      this.$refs.loginForm.validateField("captcha");
      this.$refs.loginForm.validateField("phone", e => {
        if (!e) {
          this.$refs.loginForm.validateField("captcha", e2 => {
            if (!e2) {
              this.smsCodeFn();
            }
          });
        }
      });
    },
    smsCodeFn() {
      smsCode("APSNET", {
        mobile: this.loginForm.phone,
        imgcode: this.loginForm.captcha,
        imgkey: this.loginForm.imgkey,
        regnosms: true
      }).then(
        d => {
          if (d.result) {
            this.smsCountDown();
            this.smsSended = true;
            if (!d.isexists) {
              this.clearCountDown();
              this.isNewUser = true;
              this.toggleLogin();
              return;
            }
            this.isNewUser = false;
          } else {
            Message({
              message: d.errormsg || "网络异常请稍后再试",
              type: "error",
              duration: 5 * 1000
            });
          }
        },
        () => {
          Message({
            message: "网络异常请稍后再试",
            type: "error",
            duration: 5 * 1000
          });
        }
      );
    },
    handleLogin() {
      if (!this.smsSended) {
        Message({
          message: "请先获取短信验证码",
          type: "info",
          duration: 5 * 1000
        });
        return;
      }
      if (this.isNewUser) {
        this.toggleLogin();
        return;
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const loginReq = {
            mobile: this.loginForm.phone.trim(),
            smscode: this.loginForm.smscode.trim(),
            imgkey: this.loginForm.imgkey
          };
          this.$store
            .dispatch("Login", { BASE_API: "APSNET", userInfo: loginReq })
            .then(
              d => {
                if (d.result) {
                  this.loading = false;
                  this.$router.push({ path: "/pcpay" });
                } else {
                  this.loading = false;
                  Message({
                    message: d.errormsg || "网络异常请稍后再试",
                    type: "error",
                    duration: 5 * 1000
                  });
                }
              },
              () => {
                Message({
                  message: "网络异常请稍后再试",
                  type: "error",
                  duration: 5 * 1000
                });
              }
            )
            .catch(() => {
              Message({
                message: "网络异常请稍后再试",
                type: "error",
                duration: 5 * 1000
              });
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #fffefa;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-bg {
  position: fixed;
  z-index: -99;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg;
  background-image: url(../../assets/login/login_bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  // min-width: 1920px;
}

.login-container {
  width: 100%;
  .login-warp {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(
      -291px
    ); //TODO:此处卫衣值需要根据高度决定，不能用百分比，文字会模糊
    width: 748px;
    // height: 530px;
    height: 530px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    -moz-box-shadow: 0px 6px 25px #b7b7b7;
    -webkit-box-shadow: 0px 6px 25px #b7b7b7;
    filter: progid:DXImageTransform.Microsoft.Shadow(color='#b7b7b7', Direction=135, Strength=25);
    box-shadow: 0px 6px 25px #b7b7b7;
    // transition: box-shadow 1s;
    // animation: mymove 2s alternate infinite;
  }
  .wechatqr {
    width: 170px;
    height: 170px;
    margin-top: 20px;
  }
  .goto-login {
    font-size: 16px;
    color: #fc6333;
    margin-top: 60px;
    cursor: pointer;
  }
  .captcha-warp {
    .el-input {
      float: left;
      width: 150px;
    }
    .captcha {
      float: right;
      height: 40px;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .sms-warp {
    position: relative;
    .getyzm {
      height: 40px;
      line-height: 40px;
      width: 80px;
      font-size: 12px;
      text-align: center;
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    img.getyzm {
      top: 1px;
      bottom: 1px;
      right: 1px;
      height: 38px;
      line-height: 38px;
    }
    .getsms {
      height: 40px;
      line-height: 40px;
      width: 80px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      background: #fc6333;
      cursor: pointer;
      &.sms-disabled {
        background-color: #ccc;
        color: #fff;
      }
    }
  }
  .banner {
    height: 100%;
    width: 298px;
    margin-left: 450px;
    background-image: url(../../assets/login/banner.png);
    background-repeat: no-repeat;
    background-size: 100%;
  }
  input:-webkit-autofill {
    // -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important; // -webkit-text-fill-color: #fff !important;
  }
  input[name="captcha"] {
    padding-right: 50px;
  }
  .login-submit {
    color: #fff;
    border: none;
    height: 60px;
    width: 250px;
    margin-top: 47px;
    font-size: 18px;
    background-color: #ff5333;
    background-image: linear-gradient(left, #ff7700, #ff5333);
    background-image: -webkit-linear-gradient(left, #ff7700, #ff5333);
    background-image: -moz-linear-gradient(left, #ff7700, #ff5333);
  }
  .el-input {
    background: #ffffff;
    border: 1px solid #cccccc;
    font-size: 14px;
    color: #333333;
    line-height: 1;
    width: 250px;
    height: 40px;
    padding-left: 20px;
    .el-input__inner {
      line-height: 1;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      &::-webkit-input-placeholder,
      textarea::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #808080;
      }
      &:-moz-placeholder,
      textarea:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #808080;
      }
      &::-moz-placeholder,
      textarea::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #808080;
      }
      &:-ms-input-placeholder,
      textarea:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #808080;
      }
    }
  }
  .el-form-item__error {
    padding-top: 4px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    color: #333333;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
  }
  .icon-phone {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    display: inline-block;
    background-image: url(../../assets/login/phone.png);
    background-size: 100%;
  }
  .icon-imgyzm {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    display: inline-block;
    background-image: url(../../assets/login/imgyzm.png);
    background-size: 100%;
  }
  .icon-sms {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    display: inline-block;
    background-image: url(../../assets/login/sms.png);
    background-size: 100%;
  }
  .title {
    font-size: 30px;
    font-weight: normal;
    color: #333;
    text-align: left;
    margin-bottom: 12px;
  }
  .sub-title {
    font-size: 14px;
    color: #666666;
    margin-bottom: 40px;
    max-width: 300px;
    line-height: 21px;
  }
  .login-form {
    width: 450px;
    padding: 65px 0 0 100px;
    float: left;
  }
  .el-form-item {
    width: 250px;
    background: #fff;
    border-radius: 5px;
    color: #333;
    margin-bottom: 20px;
  }
  .el-form-item__content {
    line-height: 1;
  }
  .show-pwd {
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    right: 35px;
    bottom: 28px;
  }
}
</style>
