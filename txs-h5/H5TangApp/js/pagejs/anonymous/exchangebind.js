(function($) {
    var isNewUser = false;
    var hasYZM = false;
    $.fn.newUserReg = function(opts) {
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
            loginCallback: function(json) {

            },
            regCallback: function(json) {} // 点击注册之后的callback
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
        return this.each(function() {
            $.getImgYZM(opt.imgyzm.replace('#', '')); //图形验证码
            $getyzm.click(function() {
                if (validate("getYZM")) {
                    //获取验证码
                    getSMSyzm();
                }
            });
            $register.click(function() {
                if (!isNewUser) {
                    doLogin();
                    return;
                }
                doRegister();
            });
        });

        function doRegister() {
            var regProcess = function() {
                var data = {
                    "mobile": $phone.val(),
                    "smscode": $phoneyzm.val(),
                    "imgkey": $imgyzm.attr("alt"),
                    "InvitedBy": $txtInvitedBy
                };
                $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/register", data, false).then(function(d) {
                    if (d.result) {
                        //_gsq.push(["T", "GWD-002985", "track", "/targetpage/regok_success"]);
                        $.alertF("恭喜,注册成功!", "确定", function() {
                            if (opt.regCallback)
                                opt.regCallback(d);
                            else {
                                window.location.replace("/html/product/index.html");
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
                $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/loginverification", data, false).then(function(data) {
                    if (data.result) {
                        //_gsq.push(["T", "GWD-002985", "track", "/targetpage/login_success"]);
                        $.alertF('您已经是唐小僧注册用户', '', function() {
                            //登录
                            opt.loginCallback.apply();
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
            $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/user/sendusersms", data, false).then(
                function(json) {
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

var type = $.getQueryStringByName("type");
var voucherNo = $.getQueryStringByName("voucherNo") || 0; //券码

$(function() {
    pageinit();
});

function pageinit() {
    $("#imgYZM2").click(function() {
        getcode();
    });
    if (voucherNo != 0) {
        $("#voucherno").val(voucherNo);
    }
    getcode();
}

//获取验证码
function getcode() {
    var url = apiUrl_prefix + "/validatecode/get";
    $.AkmiiAjaxGet(url).then(function(d) {
        if (d.code == 200) {
            $("#imgYZM2").attr("src", d.data.imgData);
            $("#imgYZM2").attr("alt", d.data.imgKey);
        }
    });
    // $("#imgYZM").attr("src", "http://192.168.101.101:8884/validatecode/get?t=" + Date.now());
}

//点击兑换
$("#btn-change").click(function() {
    $("#errortext").hide();
    if ($.isNull($("#voucherno").val())) {
        $("#errortext").show().html("请输入正确的券码");
        return false;
    }
    if ($.isNull($("#verificationcode").val())) {
        $("#errortext").show().html("图形验证码不能为空");
        return false;
    }
    if ($.isNull($("#verificationcode").val())) {
        $("#errortext").show().html("短信验证码不能为空");
        return false;
    }
    voucherNo = $("#voucherno").val();
    var token = $.getCookie("MadisonToken");
    if ($.isNull(token)) {
        register();
        //window.location.href = "/html/anonymous/login.html?returnurl=" + encodeURIComponent("/html/anonymous/exchangebind.html?voucherNo=" + $("#voucherno").val());
    } else {
        exchangecode();
    }
});

//兑换
function exchangecode() {
    // http: //192.168.101.101:8884
    var url = apiUrl_prefix + "/voucher/exchange";
    var data = {
        id: $.getCookie("userid"),
        voucherNo: $("#voucherno").val(),
        verificationCode: $("#verificationcode").val(),
        imgKey: $("#imgYZM2").attr("alt")
    };
    $.AkmiiAjaxPost(url, data, true).then(function(d) {
        if (d.code == 200) {
            $("#reward").html(d.data.name);
            $("#ecalert").show();
            $(".mask").show();
            click(d.data.type);
        } else if (d.code == 401) {
            $.alertF(d.message, "", function() {
                register();
            });
        } else {
            $.alertF(d.message, "", hidecode);
        }
    });
}

function click(rewardtype) {
    //继续兑换
    $("#continueec").click(function() {
        hidealert();
    });
    //立即查看
    $("#look").click(function() {
        if (type == "ios") {
            PhoneMode.jumpAppWithString({
                'controller': 'UserViewController'
            });
        } else if (type == "android") {
            window.PhoneMode.callToPage("MainActivity", "mine");
        } else {
            window.location.href = "/html/my/";
        }
        // if (rewardtype = "coupon") {
        //     if (type == "ios") {
        //         PhoneMode.jumpAppWithString({
        //             'controller': 'RewardViewController'
        //         });
        //     } else if (type == "android") {
        //         window.PhoneMode.callToPage("/main/award", "");
        //     } else {
        //         window.location.href = "/html/my/myreward-bonus.html";
        //     }
        // } else if (rewardtype = "finanal") {
        //     if (type == "ios") {
        //         PhoneMode.jumpAppWithString({
        //             'controller': 'TXSFinanciaTicketViewController'
        //         });
        //     } else if (type == "android") {
        //         window.PhoneMode.callToPage("LCJActivity", "");
        //     } else {
        //         window.location.href = "/html/product/product-financialbuylist.html";
        //     }
        // }
    });
}

function hidealert() {
    $(".mask").hide();
    $("#ecalert").hide();
    $("#voucherno").val("");
    $("#verificationcode").val("");
    getcode();
}

function hidecode() {
    $(".mask").hide();
    $("#ecalert").hide();
    $("#verificationcode").val("");
    getcode();
}

function register() {
    $("#form").show();
    $(".cancle").click(function() {
        $("#form,.mask").hide();
        $("body").css("overflow", "auto");
    });
    $("#luckydrawregister").click(function() {
        $("body").scrollTop(0).css("overflow", "hidden");
        $("#form,.mask").show();
    });
    $("#luckydrawregister").newUserReg({
        phone: '#txtmobile', // 手机号编辑框
        txtimgyzm: '#txtimgyzm', // 图形验证码编辑框
        phoneyzm: '#txtsmsyzm', // 手机验证码编辑框
        getyzm: '#getYZM', // 获取手机验证码
        imgyzm: '#imgYZM', // 获取图形验证码
        register: '#luckydrawregister', // 点击立即注册
        InvitedBy: $.getQueryStringByName("c") || '', // 渠道号
        loginCallback: function() {
            window.location.href = "/html/anonymous/exchangebind.html?voucherNo=" + voucherNo;
            // window.location.reload();
        },
        regCallback: function(json) {
                if (json.result) {
                    window.location.href = "/html/anonymous/exchangebind.html?voucherNo=" + voucherNo;
                    // window.location.reload();
                } else {
                    $.alertF(json.errormsg);
                }
                //window.location.replace("/html/product/index.html");
            } // 点击注册之后的callback
    });
}