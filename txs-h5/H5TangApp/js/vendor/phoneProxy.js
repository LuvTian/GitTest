var phoneProxy = {
    phoneType: "",
    //获取url参数
    getQueryStringByName: function (name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    getPhoneType: function () {
        this.phoneType = (this.getQueryStringByName("type") || (window.PhoneMode && window.PhoneMode.getPhoneType()) || "h5").toLowerCase();
        return this.phoneType;
    },
    checkPhoneType: function () {
        if (this.phoneType || this.getPhoneType()) {
            return true;
        }
        return false;
    },
    /**
     * 播放本地音频
     */
    playLocalSound: function (name) {
        if (name == "" || !this.checkPhoneType()) return;
        if (this.phoneType == "ios") {
            PhoneMode.appPlayerLocalWithString({
                'musicName': name
            });
        } else if (this.phoneType == "android") {
            window.PhoneMode.callPlaySound('{"musicName":"' + name + '"}');
        }
    },
    /**
     * 播放网络音频
     */
    playNetSound: function (url) {
        if (name == "" || !this.checkPhoneType()) return;
        if (this.phoneType == "ios") {
            PhoneMode.appPlayerNetworkWithString({
                'musicUrl': url
            });
        } else if (this.phoneType == "android") {
            window.PhoneMode.callPlaySound('{"musicUrl":"' + url + '"}');
        }
    },
    /**
     * 手机震动
     */
    shake: function () {
        if (!this.checkPhoneType()) return;
        if (this.phoneType == "ios") {
            PhoneMode.appShakeWithStirng("");
        } else if (this.phoneType == "android") {
            window.PhoneMode.callShake();
        }
    },
    /**
     * 登录
     */
    login: function (returnUrl, domain) {
        domain = domain ? domain : "";
        if (!this.checkPhoneType()) return;
        if (this.phoneType == "ios") {
            PhoneMode.callLogin(decodeURIComponent(returnUrl));
        } else if (this.phoneType == "android") {
            window.PhoneMode.callLogin(decodeURIComponent(returnUrl));
        } else {
            window.location.replace(domain + "/html/Anonymous/login.html?returnurl=" + returnUrl);
        }
    },
    /**
     * 分享
     */
    share: function (jsonData, success, fail, h5Callback) {
        //待修改
        this.checkPhoneType();
        var jsondata = jsonData || {};
        jsondata.callback = success;
        jsondata.failback = fail;
        if (this.phoneType == "ios") {
            //JS 调用本地分享方法
            PhoneMode.callShare(jsondata);
        } else if (this.phoneType == "android") {
            //JS 调用本地分享方法
            window.PhoneMode.callShare(JSON.stringify(jsondata));
        } else {
            if (h5Callback instanceof Function) {
                h5Callback.apply();
            }
        }
    },
    /**
     * 跳转地址
     */
    jumpToPage: function (page) {
        if (!this.checkPhoneType()) return;
        var jtp = {
            iosC: "",
            androidC: "",
            h5C: ""
        };
        switch (page) {
            case "licai":
                jtp.iosC = 'InvestmentViewController';
                jtp.androidC = 'licai';
                jtp.h5C = '/Html/Product/index.html';
                break;
            case "main":
                jtp.iosC = 'HomeViewController';
                jtp.androidC = null;
                jtp.h5C = '/html/anonymous/welcome.html';
                break;
        }
        if (jtp.iosC == "" && jtp.androidC == "" && jtp.h5C == "") return;
        if (this.phoneType == "ios") {
            PhoneMode.jumpAppWithString({
                'controller': jtp.iosC
            });
        } else if (this.phoneType == "android") {
            window.PhoneMode.callToPage("MainActivity", jtp.androidC);
        } else {
            window.location.href = jtp.h5C;
        }
    },
    /** 
     * 调用在线客服
    */
    onlineService: function () {
        window.PhoneMode.callToPage("/main/onlinecustomerservice", null);
    },
    /**
     * 内嵌h5触发关闭当前webiew方法封装
     */
    closePage: function () {
        this.checkPhoneType();
        if (this.phoneType == "ios") {
            PhoneMode && PhoneMode.callClosePage("");
        } else if (this.phoneType == "android") {
            window.PhoneMode && window.PhoneMode.callClosePage("");
        } else {
            window.history.go(-1);
        };
    },
    /**
     * 单页面形式ios的title为空白的问题
     * title:字符串
     */
    updateAppTitle: function (title) {
        this.checkPhoneType();
        if (this.phoneType == "ios") {
            PhoneMode && PhoneMode.callUpdateTitle(title);
        }
    }
} 