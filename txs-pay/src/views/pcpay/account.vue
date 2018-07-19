<template>
    <div class="account-box" v-loading="loading1">
        <div class="account">
            <el-button type="text" @click="safeExit" class="safe-exit">安全退出</el-button>
            <div class="d1">{{ username }}欢迎使用僧财宝转入功能</div>
            <div class="d2">僧财宝余额<span>（原账户余额）</span></div>
            <div class="d3">￥{{ basicbalance }}</div>
            <div class="d4" v-if="!isBindingFlag">
                请在手机端完成实名绑卡后可使用僧财宝转入功能
            </div>
            <div class="d4" v-else>
                <el-button @click="transferDialog = true">转 入</el-button>
                <div class="transferDialogBox">
                  <transition name="fade">
                    <el-dialog title="僧财宝转入" :visible.sync="transferDialog" width="30%" center :before-close="transferDialogClose">
                        <h3>转入金额</h3>
                        <el-form :model="acountForm" :rules="accountRules" ref="acountForm" class="demo-ruleForm">
                            <el-form-item prop="num">
                                <el-input v-model="acountForm.num" placeholder="请输入金额，最低5元起" ref="acountInput" @keyup.native="acountInto" maxlength=8></el-input>
                            </el-form-item>
                        </el-form>
                        <p class="des">确认金额后请在新浪支付完成后续网银充值操作</p>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="cancledialog('acountForm')">取 消</el-button>
                            <el-button type="primary" @click="goSinaPay('acountForm')">去新浪支付，完成转入</el-button>
                        </span>
                    </el-dialog>
                  </transition>
                </div>
                <div class="waitingDialogBox">
                  <transition name="fade">
                    <el-dialog title="僧财宝转入" :visible.sync="waitingDialog" width="30%" center>
                        <p>若您已完成充值，请刷新页面。如有疑问可拨打</p>
                        <p class="tel"><span>客服电话400 - 607 - 8587&nbsp;&nbsp;</span>（周一至周五9:00至18:00）。</p>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="reGoSinaPay">转入失败，重新转入</el-button>
                            <el-button type="primary" @click="refleshPage">转入成功，刷新页面</el-button>
                        </span>
                    </el-dialog>
                  </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getUserInfo, accountDeposit, sinaPay, signOut } from "@/api/pcpay";
import { fmoney } from "@/utils/index";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    let checkTransfer = (rule, value, callback) => {
      // let pat = /^[5-9]{1,8}|([1-9]+\d{1,7})$/gim;
      let pat = /^[1-9]\d*/;
      if (value == "" || isNaN(value) || !pat.test(value)) {
        callback(new Error("请输入正确的转入金额"));
        return;
      } else if (value < 5) {
        callback(new Error("单笔转入金额需大于等于5元"));
        return;
      } else {
        callback();
      }
    };
    return {
      username: "", //姓名
      basicbalance: "00.00", //僧财宝余额
      transferDialog: false,
      waitingDialog: false,
      isBindingFlag: false,
      loading1: true,
      acountForm: {
        num: ""
      },
      accountRules: {
        num: [{ validator: checkTransfer, trigger: "blur" }]
      }
    };
  },
  created() {
    this._getUserInfo();
  },
  methods: {
    //获取个人信息
    _getUserInfo() {
      getUserInfo()
        .then(res => {
          if (res.result && res.accountinfo && Object.keys(res.accountinfo)) {
            let account = res.accountinfo;
            this.username = (account.username || this.username) + "您好，";
            this.basicbalance =
              fmoney(account.basicbalance) || this.basicbalance;
            if (account.customstatus === 3) {
              this.isBindingFlag = true;
            } else {
              this.isBindingFlag = false;
            }
          }
          this.loading1 = false;
        })
        .catch(() => {
          console.log("网络超时,请重试");
          this.loading1 = false;
        });
    },
    //跳转第三方新浪支付页面
    goSinaPay(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let amount = this.$refs.acountInput.value;
          let obj = {
            amount
          };
          let newWin = window.open();
          accountDeposit(obj)
            .then(res => {
              if (res.data && res.data.url) {
                //跳转至新浪支付的逻辑
                // this.openURL(res.data.url);
                newWin.location = res.data.url;
              }
              this.cancledialog("acountForm");
              this.waitingDialog = true;
            })
            .catch(() => {
              this.cancledialog("acountForm");
              console.log("网络超时,请重试");
            });
        } else {
          return false;
        }
      });
    },
    openURL(url) {
      let a = document.createElement("a"); //创建a对象
      a.setAttribute("href", url);
      a.setAttribute("style", "display:none");
      a.setAttribute("target", "_blank");
      document.body.appendChild(a);
      a.click(); //执行当前对象
      a.parentNode.removeChild(a);
    },
    //支付成功后刷新页面
    refleshPage() {
      window.location.reload();
    },
    //重新发起新浪支付
    reGoSinaPay() {
      this.waitingDialog = false;
      this.transferDialog = true;
    },
    //安全退出确认弹框
    safeExit() {
      this.$confirm("您正在进行安全退出，请确认操作。", "安全退出", {
        confirmButtonText: "确认退出",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          //确定退出
          this._signOut();
        })
        .catch(() => {});
    },
    //退出逻辑
    _signOut() {
      signOut().then(res => {
        if (res.result) {
          removeToken("MadisonToken");
          removeToken("userid");
          localStorage.removeItem("userid");
          removeToken("refcode");
          localStorage.removeItem("refcode");
          //下面三行代码是为了兼容新验收环境退出登录userid没删掉的问题
          var exp = new Date();
          exp.setTime(exp.getTime() - 1);
          document.cookie = "userid=''; domain=.xysaccept.txslicai.com;path=/;expires=" + exp.toGMTString();
          window.location.href = "http://txslicai.com/";
        } else {
          this.$message.error(res.errormsg);
        }
      });
    },
    //对表单金额输入进行替换
    acountInto() {
      let val = this.acountForm.num;
      this.acountForm.num = val.replace(/[^\d+]/g, "");
      return false;
    },
    //取消对话框
    cancledialog(formName) {
      this.$refs[formName].resetFields();
      this.transferDialog = false;
    },
    transferDialogClose() {
      this.cancledialog("acountForm");
    }
  }
};
</script>

<style>
.account-box {
  background: #fff;
  background: #fff url(../../assets/pcpay/bg.png) no-repeat 100% 100%;
  background-size: 562px 163px;
  margin: 0 0 20px;
}
.account {
  position: relative;
  height: 266px;
  box-sizing: border-box;
  padding: 40px 0 0 60px;
}
.account .d1 {
  font-size: 16px;
  color: #333333;
  line-height: 16px;
}
.account .d2 {
  margin-top: 30px;
  font-size: 16px;
  color: #333333;
  line-height: 16px;
  font-weight: bold;
}
.account .d2 span {
  font-size: 14px;
  color: #151515;
  line-height: 18px;
}
.account .d3 {
  margin-top: 20px;
  font-size: 36px;
  color: #333333;
  line-height: 36px;
}
.account .d4 {
  margin-top: 40px;
  font-size: 16px;
  color: #888888;
  line-height: 16px;
}
.d4 h3 {
  margin: 5px 0 10px;
  font-size: 14px;
  color: #333;
  line-height: 18px;
}
.d4 .des {
  margin-top: 37px;
  font-size: 12px;
  color: #757575;
  line-height: 14px;
}
.d4 .dialog-footer:after {
  content: ".";
  display: block;
  height: 0;
  font-size: 0;
  clear: both;
  visibility: hidden;
}
.d4 .dialog-footer .el-button--default {
  float: right;
}
.d4 .dialog-footer .el-button--primary {
  float: left;
}
.transferDialogBox .dialog-footer .el-button--default {
  width: 100px;
}
.transferDialogBox .dialog-footer .el-button--primary {
  width: 190px;
}
.waitingDialogBox .dialog-footer .el-button--default,
.waitingDialogBox .dialog-footer .el-button--primary {
  width: 145px;
  font-size: 14px;
  padding: 10px 0;
}
.waitingDialogBox p {
  font-size: 14px;
  color: #333333;
  line-height: 21px;
}
.waitingDialogBox p.tel {
  margin-bottom: 30px;
}
.waitingDialogBox p.tel span {
  color: #fc6333;
}
.el-pager li:hover,
.el-pagination button:hover .el-icon {
  color: #fc6333;
}
.el-input__inner:focus {
  border-color: #fc6333;
}
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #dcdfe6;
}
.el-form-item__error {
  color: #fc6333;
  padding-top: 10px;
}
.el-dialog__title,
.el-message-box__title {
  font-weight: bold;
}
.transferDialogBox .el-input__inner {
  font-size: 14px;
  font-weight: bold;
}
</style>