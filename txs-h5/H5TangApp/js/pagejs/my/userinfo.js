var url = "";
var param = {};

var $updatepwd = $("#updatepwd"); //修改交易密码按钮
var $signout = $("#signout"); //安全登出
var $stepSelect = $("#stepSelect"); //注册步骤选择
var $personaldatapage = $("#personaldatapage");
var $phoneNo = $("#phoneNo"); //手机
var t = $.getQueryStringByName("t") || 0; //判断用户是否关闭委托
var returnurl = window.location.href;
$(function() {
    userinfo();
    pageInit();
    SignOut();
});

function pageInit() {
    $("#address_list").click(function() {
        //window.location.href = "/Html/My/addresslist.html";//老收货地址废弃
        window.location.href = "/html/store/manage-delivery-address.html";
    });
    $("#passinvestorlist").click(function() {
        window.location.href = "/html/my/passinvestorlist.html";
    });
}

function userinfo() {
    url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
        if (data.result) {
            currentDate = data.date;
            account = data.accountinfo;
            //风险提示书或合格投资人声明未做	(未完成合格投资人认证)
            if (account.riskwarning && account.passinvestor) {
                if (account.questionnaire != 0) {
                    //显示认证提示一栏
                    $("#accreditationhtml").html("您的投资风格为" + account.riskleveldesc);
                } else {
                    //显示认证提示一栏
                    $("#accreditationhtml").html("未进行风险评估");
                }
            } else {
                //显示认证提示一栏
                $("#accreditationhtml").html("未完成合格投资人认证");
            }
            if (account.customstatus <= 1) {
                $("#personaldatapage > a").hide();
                $stepSelect.show();
                $phoneNo.attr("href", "#");
                $phoneNo.show();
                $phoneNo.find(".wxicon").hide();
            } else {
                if (account.customstatus == 2) {
                    $("#my-card").click(function() {
                        window.location.href = "/html/my/regist-step3.html";
                    });
                    $("#my-bank").text("立即绑定");
                } else {
                    $("#my-card").click(function() {
                        window.location.href = "/html/my/mybankcard.html";
                    });
                    $("#my-bank").text(account.bankname + (account.cardcode).substr(2, 4));
                }
                var cardNum = 0,
                    cardId = "",
                    bankName = "",
                    txt = "";

                $.AkmiiAjaxPost(apiUrl_prefix + "/members/account/txs/cards", {}, false).then(function (d) {
                    if (d.code == 200) {
                        $.each(d.data, function (k, v) {
                            if (v.signId && v.signId.length > 0) {
                                cardNum++;
                                cardId = v.cardNo.length > 0 ? v.cardNo.substr(-4) : "";
                                bankName = v.bankName;
                            }
                        })
                        switch (cardNum) {
                            case 0:
                                txt = "立即绑定";
                                break;
                            case 1:
                                txt = bankName + "(" + cardId + ")";
                                break;
                            default:
                                txt = "共" + cardNum + "张";
                        }
                        $("#my-bank").text(txt);
                    } else {
                        $.alertF(d.message);
                    }

                });
                $("#my-card").click(function () {
                    window.location.href = "/html/my/mybanklist.html";
                });

                //修改手机号phoneNo  /Html/My/newmobile.html
                $("#phoneNo").click(function() {
                    showMenu(2, "变更唐小僧手机号", "变更新浪支付手机号", function() {
                        window.location.href = "/html/my/newmobile.html";
                    }, function() {
                        //调用新浪重定向url
                        $.sinarequest(10, false, returnurl);
                    });
                });
            }

            $("#my-mobile").text(account.mobile);
            $("#my-idnumber").text(account.idnumber);
            $("#my-name").text(account.username);


            if (data.inviternumber) {
                $('#myInviter').show();
                $("#my-inviter").text(data.inviternumber);
            } else {
                $('#myInviter').hide();
                $("#my-inviter").text('');
            };
            //我的邀请人
            //$( "#my-inviter" ).text();

            //委托代扣
            withholdauthoity(account);

            //修改支付密码
            UpdatePwd();
            SignOut();
            //重置交易密码resetPwd /Html/My/resetpassword.html
            $("#resetPwd").click(function() {
                showMenu(1, "找回唐小僧交易密码", "找回新浪支付交易密码", function() {
                    window.location.href = "/html/my/resetpassword.html";
                }, function() {
                    //调用新浪重定向url
                    $.sinarequest(22, false, returnurl);
                });
            });
            //关闭委托清除委托不再勾选的cookie
            if (t == 99) {
                localStorage.removeItem(account.referralcode + "knowwithholdauthority");
            }

        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
    });
}


// function getBindedCards() {
//     $.AkmiiAjaxPost(apiUrl_prefix_p2p + "/members/account/txs/cards", {}, false).then(function (d) {
//         var cardNum = 0;
//         $.each(d.data, function (k, v) {
//             if (v.signId != null) {
//                 cardNum++;
//             }
//         })
//         if (cardNum > 1) {
//             $("#my-bank").text("共" + cardNum + "张");
//         }
//     })
// }

//修改交易密码
function UpdatePwd() {
    var updatepwd = function() {
        var oldpwd = "";
        var newpwd = "";
        var newpwdagain = "";
        var showpwdhtml = function() {
            $.PaymentHtml("请输入原密码", Pwdcallback, function() {});
        }

        function Pwdcallback(res) {
            if ($.isNumeric(res)) {
                oldpwd = res;
                url = "/StoreServices.svc/user/checkpaymentpwd";
                param = {
                    "paymentpwd": oldpwd
                };
                $.AkmiiAjaxPost(url, param).then(function(data) {
                    if (data.result) {
                        $.PaymentHtml("请输入新密码", NewPwdcallback, function() {});
                    } else if (data.errorcode == "20019") {
                        $.confirmF(data.errormsg, null, "去重置", function() {
                            $(".reset").click();
                        }, function() {
                            window.location.href = "/html/my/resetpassword.html";
                        });
                    } else {
                        $.alertF(data.errormsg, null, function() {
                            $.PaymentHtml("请输入原密码", Pwdcallback, function() {});
                        });
                        return;
                    }
                });
            } else {
                $.alertF("交易密码需为6位数字");
            }
        }

        function NewPwdcallback(res) {
            if ($.isNumeric(res)) {
                newpwd = res;
                $.PaymentHtml("请再次输入新密码", Sumbit, function() {})
            } else {
                $.alertF("交易密码需为6位数字");
            }
        }

        function Sumbit(res) {
            if ($.isNumeric(res)) {
                newpwdagain = res;
                if (newpwdagain != newpwd) {
                    $.alertF("两次密码不一致", null, function() {
                        $.PaymentHtml("请输入新密码", NewPwdcallback, function() {})
                    });
                    return;
                }
                url = "/StoreServices.svc/user/editpaymentpwd";
                param = {
                    "paymentpwd": oldpwd,
                    "newpaymentpwd": newpwd
                };
                $.AkmiiAjaxPost(url, param).then(function(data) {
                    if (data.result) {
                        $.alertF("修改成功", null, function() {
                            $.closeWinDivPWD();
                        });
                    } else if (data.errorcode == "20019") {
                        $.confirmF(data.errormsg, null, "去重置", function() {
                            $(".reset").click();
                        }, function() {
                            window.location.href = "/html/my/resetpassword.html";
                        });
                    } else {
                        $.confirmF(data.errormsg, null, "去重置", function() {
                            $(".reset").click();
                        }, function() {
                            //updatepwd.init();
                            window.location.href = "/html/my/resetpassword.html";
                        });
                    }
                });
            } else {
                $.alertF("交易密码需为6位数字");
            }
        }
        return {
            init: function() {
                showpwdhtml();
            }
        }
    }();
    $updatepwd.click(function() {
        //updatepwd.init();
        showMenu(3, "修改唐小僧交易密码", "修改新浪支付交易密码", function() {
            updatepwd.init();
        }, function() {
            //调用新浪重定向url
            $.sinarequest(21, false, returnurl);
        });
    });
}

function SignOut() {
    $signout.click(function() {
        url = "/StoreServices.svc/user/userquit";
        $.AkmiiAjaxPost(url, {}).then(function(data) {
            if (data.result) {
                $.delCookie("MadisonToken");
                $.delCookie("userid");
                $.removeLS("userid");
                $.delCookie("refcode");
                $.removeLS("refcode");
                //下面三行代码是为了兼容新验收环境退出登录userid没删掉的问题
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                document.cookie = "userid=''; domain=.xysaccept.txslicai.com;path=/;expires=" + exp.toGMTString();

                window.location.href = "/html/anonymous/welcome.html";
            } else {
                $.alertF(data.errormsg);
            }
        });
    });
}

var withholdauthoity = function (account) {
    $("#my-HandleWithholdAuthority").click(function () {
        if (!$.CheckAccountCustomStatusBeforeNext(account)) {
            return;
        }
        // if (account.customstatus < 2) {
        //     $.confirmF("您的个人安全资料还未完善，现在去完善吧", null, null, null, $.RegistSteplink);
        //     return false;
        // }
        // if (account.customstatus < 3) {
        //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
        //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
        //     });
        //     return false;
        // }
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/my/";
        if (account.iswithholdauthoity == 0) {
            $.sinarequest(20, false, returnurl);
        } else if (account.iswithholdauthoity == 1) {
            $.sinarequest(30, false, returnurl); //签订委托代扣
        } else if (account.iswithholdauthoity == 3) {
            if (account.isexsitreservebid) {
                $.confirmF("您已预约投资产品，暂时无法关闭委托代扣", "取消", "确定", $.noop(), $.noop());
                return false;
            }
            returnurl = window.location.origin + "/eback.html?r=" + window.location.origin + "/Html/My/UserInfo.html?t=99";
            $.sinarequest(32, false, returnurl); //取消委托代扣
        }
    });
}

var showMenu = function(type, oneTitle, twoTitle, oneback, twoback, cback) {
    var h = [];
    /*
    <div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;display:none"></div>
    <div style="background: #fff;border-radius: 2px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;display:none">
        <h1 style="font-size: 1.6rem;padding:2rem;border-bottom:1px solid #f6f6f8;color:#53a1f3">修改唐小僧交易密码</h1>
        <h1 style="font-size: 1.6rem;padding:2rem;border-bottom:1px solid #f6f6f8;color:#53a1f3">修改新浪支付交易密码</h1>
        <h1 style="font-size: 1.6rem;padding:1rem;color:#c7c7c7">取消</h1>
    </div>
    */
    h.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');
    h.push('<div style="background: #fff;border-radius: 2px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;top:50%;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);">');
    h.push('<h1 id="one" style="font-size: .68rem;padding: 1rem;border-bottom:1px solid #f6f6f8;color:#53a1f3">' + oneTitle + '</h1>');
    h.push('<h1 id="two" style="font-size: .68rem;padding: 1rem;border-bottom:1px solid #f6f6f8;color:#53a1f3">' + twoTitle + '</h1>');
    h.push('<h1 id="Cancel" style="font-size: .68rem;padding: .6rem;color:#c7c7c7">取消</h1>');
    h.push('</div>');
    var html = $(h.join(''));
    html.find("#one").click(function() {
        html.remove();
        if (oneback && oneback instanceof Function) {
            if ((type == 1 || type == 3) && account.customstatus == 0) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                return;
            }
            oneback();
        }
    });
    html.find("#two").click(function() {
        html.remove();
        if (twoback && twoback instanceof Function) {
            if (!$.CheckAccountCustomStatusBeforeNext(account)) {
                return;
            }
            // if (account.customstatus < 2) {
            //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            //     return;
            // }
            // if (account.customstatus < 3) {
            //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
            //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
            //     });
            //     return;
            // }

            if ((type == 1 || type == 2 || type == 3) && account.iswithholdauthoity == 0) //未设置新浪支付密码
            {
                var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
                $.SetSinaPayPassword(returnurl, currentDate, account.referralcode, account.iscashdesknewuser);
                return;
            }

            twoback();
        }
    });
    html.find("#Cancel").click(function() {
        html.remove();
        if (cback && cback instanceof Function) {
            cback();
        }
    });
    $("body").append(html);
}