<template>
  <div class="pcpay-container">
      <account></account>
      <record></record> 
  </div>
</template>

<script>
import Account from "@/views/pcpay/account";
import Record from "@/views/pcpay/record";

export default {
  components: {
    Account,
    Record
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pcpay-container {
  position: relative;
  width: 1080px;
  margin: 30px auto;
}
.pcpay-container .el-button--primary {
  border-radius: 5px;
  background-color: #fc6333;
  border: 1px solid #fc6333;
  box-sizing: border-box;
  padding: 10px 20px;
}
.pcpay-container .el-button--default {
  background: #ffffff;
  border: 1px solid #fc6333;
  border-radius: 5px;
  color: #fc6333;
  box-sizing: border-box;
  padding: 10px 20px;
}
.d4 > .el-button--default {
  padding: 10px 60px;
}
.safe-exit {
  position: absolute;
  font-size: 14px;
  color: #198fff;
  line-height: 14px;
  top: 10px;
  right: 22px;
}
.el-dialog__headerbtn,
.el-message-box__headerbtn {
  font-size: 20px;
}
.el-dialog__headerbtn:hover .el-icon-close,
.el-message-box__headerbtn:hover .el-icon-close {
  color: #fc6333;
}
.d4 .el-dialog {
  width: 400px !important;
  box-shadow: 0 5px 8px 0 rgba(51, 51, 51, 0.5);
  border-radius: 5px;
}
.el-dialog__header {
  padding: 50px 20px 10px;
  font-size: 18px;
  color: #333;
  line-height: 18px;
}
.el-message-box--center .el-message-box__header {
  padding-top: 50px;
  font-size: 18px;
  color: #4a4a4a;
  line-height: 18px;
}
.el-message-box__message p {
  font-size: 14px;
  color: #333;
  line-height: 18px;
  margin-bottom: 38px;
}
.el-message-box__btns {
  padding: 5px 50px 0;
}
.el-message-box__btns,
.el-dialog--center .el-dialog__body {
  padding: 10px 50px 5px;
}
.el-message-box__btns button:nth-child(1) {
  float: right;
  width: 145px;
  background: #fff;
  border: 1px solid #fc6333;
  border-radius: 5px;
  font-size: 14px;
  color: #fc6333;
}
.el-message-box__btns button:nth-child(2) {
  float: left;
  width: 145px;
  background: #fc6333;
  border: 1px solid #fc6333;
  border-radius: 5px;
  font-size: 14px;
  color: #ffffff;
}
.el-dialog__footer {
  padding: 10px 50px 50px;
}
.el-button + .el-button {
  margin-left: 0;
}

.el-input .el-input__inner:focus {
  border-color: #dcdfe6; 
}
.el-input__inner {
  border-radius: 0;
  color: #333;
}
</style>
