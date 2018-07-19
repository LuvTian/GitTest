/**
 * 一键开户页面
 */
$(function() {
    var userName,
        idCardNumber,
        bankNo,
        bankNoOriginal,
        bankCode,
        bankName,
        bankBoundPhone,
        canEditBankNo, //是否可以编辑银行卡号
        CardBinResult = {},
        // platForm = $.getQueryStringByName('platform'),
        // sourcePage = $.getQueryStringByName('sourcepage'),
        // sourceParamValue = $.getQueryStringByName('sourceparamvalue'),
        isReady = false,
        $agreementCkboximg = $("#ckbox-agree img"),
        $jysBtnSubmit = $("#submit"),
        $agreeCkBox = $("#ckbox-agree"),
        depositoryResult,
        //_sessionStorage = !!sessionStorage,
        jumpSwitchKey = 'JUMPSWITCHKEY',
        resultInterval,
        queryDepositorySwitch = true;
    if (!$.CheckToken()) {
        $.Loginlink();
        return;
    }

    init();

    function init() {
        var agreed = getAgreementStatus();
        $jysBtnSubmit.click(function() {
            var disabled = getBtnSubmitStatus();
            if (agreed && !disabled) {
                //开户
                depository();
            }
        });
        $agreeCkBox.click(function() {
            agreed = !getAgreementStatus();
            agreed ? ($agreementCkboximg.css('visibility', 'visible')) : ($agreementCkboximg.css('visibility', 'hidden'));
            toggleBtnStatus();
        });
        $("#clearBankbtn").click(function() {
            $(this).hide();
            clearBankNo();
        });
        $("#smsBtn").click(function() {
            if (!$(this).hasClass("disabled")) {
                getSms();
            }
            return false;
        });
        $("#bankNo").blur(function(e) {
            setTimeout(function() {
                CardBinResult = {};
                bankNo = $("#bankNo").val().trim();
                if (!bankNo) {
                    return;
                }
                checkCardBin();
            }, 100);
        });
        $("#bankNo").keyup(function() {
            var _bankNo = $("#bankNo").val().trim();
            if (!_bankNo) {
                $("#clearBankbtn").hide();
            } else {
                $("#clearBankbtn").show();
            }
        });

        //用户返回时弹框提示---begin
        window.onpopstate = function() {
            var _jump = $.getQueryStringByName("jump");
            if (!_jump) {
                $.confirmF("还差一步开户成功，您的账户安全即将升级，确定退出吗？", "不开户了", "继续开户", function() {
                    history.back();
                }, function() {
                    window.history.pushState({}, "", "/html/my/unionopening/depository.html?jump=jump");
                })
            }
        }
        var _jump = $.getQueryStringByName("jump");
        if (!_jump) {
            if ($.getSession(jumpSwitchKey)) {
                $.delSession(jumpSwitchKey);
                jumpHome();
            } else {
                window.history.pushState({}, "", "/html/my/unionopening/depository.html?jump=jump");
            }
        }
        // }
        //--------------------end
        //start

        getUserInfo();
    }
    //跳转到首页
    function jumpHome() {
        // 获取设备类型
        var apptype = phoneProxy.getPhoneType();
        // 根据访问设备判断‘联系客服’按钮是否显示,ios & android显示
        if (apptype == 'h5') {
            window.location.replace('/html/anonymous/welcome.html');
        } else {
            phoneProxy.jumpToPage("main");
        };
    }

    function getAgreementStatus() {
        return $agreementCkboximg.css('visibility') == "visible";
    }

    function getBtnSubmitStatus() {
        return $jysBtnSubmit.hasClass('disabled');
    }

    function clearBankNo() {
        $("#bankNo").val('').attr("disabled", false);
        //$("#clearBankbtn").hide();
        $("#bank-tip").css(('visibility', 'hidden'));
    }
    /**切换开户按钮的状态 */
    function toggleBtnStatus() {
        var _status = isReady && getAgreementStatus();
        _status ? $jysBtnSubmit.removeClass('disabled') : $jysBtnSubmit.addClass('disabled')
        return _status
    }
    /**获取用户信息 */
    function getUserInfo() {
        var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
        $.AkmiiAjaxPost(url, {}, false).then(function(d) {
            if (d.result) {
                setTimeout(function() {
                    //联系客服
                    if (phoneProxy.getPhoneType() != "h5") {
                        $("#contactUs").click(function() {
                            phoneProxy.onlineService();
                        });
                    } else {
                        $("#contactUs").html("客服电话").click(function() {
                            window.location.href = $.txsOfficialTel();
                        });
                    }
                }, 0)
                userName = d.accountinfo.username;
                idCardNumber = d.accountinfo.idnumber;
                bankNo = d.accountinfo.cardCodeNew;
                bankNoOriginal = d.accountinfo.cardCodeNew;
                bankCode = d.accountinfo.bankcode;
                bankName = d.accountinfo.bankname;
                //bankBoundPhone = d.accountinfo.;
                canEditBankNo = bankNo ? true : false;
                if (canEditBankNo) {
                    $("#clearBankbtn").show();
                    $("#bankNo").attr("disabled", true)
                }
                if (!userName || !idCardNumber) {
                    $.alertF("缺少实名信息", '', function() {
                        window.history.back();
                    });
                    return;
                }
                $("#userName").val(userName);
                $("#cardNo").val(idCardNumber);
                $("#bankNo").val(bankNo);
                $("#bankPhone").val(bankBoundPhone);
                if (bankCode && bankName) {
                    $("#bankLogo img").attr("src", $.resurl() + '/css/img2.0/bank-' + bankCode.toLowerCase() + '.png').css('visibility', 'visible');
                    $("#bankDesc").html(bankName);
                }
            } else {
                $.txsToast(d.errormsg);
            }
        });
    }
    /**发送验证码 */
    function getSms() {
        //检查卡bin
        if (CardBinResult.code && CardBinResult.code != 200) {
            $.alertF("请检查银行卡号是否正确");
            return;
        }
        //检查银行预留手机号码
        var bankPhone = $("#bankPhone").val().trim();
        if (!bankPhone) {
            $.alertF("请填写银行预留手机号码");
            return;
        }
        if (!$.isMobilePhone(bankPhone)) {
            $.alertF("银行预留手机号码格式错误");
            return;
        }
        var url = apiUrl_prefix + "/jys/register-binding-card/sms";
        var parameter = {
            "mobile": bankPhone,
            "operation": "JYSRB"
        };
        $.AkmiiAjaxPost(url, parameter, false).then(function(d) {
            if (d.code == 200) {
                isReady = true;
                toggleBtnStatus();
                var maxSecond = 60;
                $("#smsBtn").addClass("disabled");
                $("#smsBtn").html(maxSecond + 's')
                var smsCount = 0,
                    smsInterval = setInterval(function() {
                        maxSecond--;
                        if (maxSecond <= 0) {
                            clearInterval(smsInterval);
                            $("#smsBtn").removeClass("disabled").html('重新获取');
                            return;
                        }
                        $("#smsBtn").html(maxSecond + 's');
                    }, 1000);
            } else {
                $.txsToast(d.message);
            }
        })
    }
    /**检查卡bin */
    function checkCardBin() {
        bankNo = $("#bankNo").val().trim();
        if (!bankNo) {
            $.txsToast("请填写银行卡号");
            return;
        }
        var url = apiUrl_prefix + "/jys/member/card-bin";
        var parameter = {
            "cardNo": bankNo
        };
        $.AkmiiAjaxGet(url + "?cardNo=" + bankNo, parameter, false).then(function(d) {
            CardBinResult = d;
            if (d.code == 200) {
                bankCode = d.data.bankCode;
                bankName = d.data.bankName;
                $("#bankLogo img").attr("src", $.resurl() + '/css/img2.0/bank-' + bankCode.toLowerCase() + '.png').css('visibility', 'visible');
                $("#bankDesc").html(bankName);
            } else {
                $("#bankLogo img").css('visibility', 'hidden');
                $("#bankDesc").html('');
                $.txsToast(d.message);
            }
        });
    }
    /**开户 */
    function depository() {
        //检查银行卡号
        bankNo = $("#bankNo").val().trim();
        if (!bankNo) {
            $.txsToast("请填写银行卡号");
            return;
        }
        //检查卡bin
        if (CardBinResult.code && CardBinResult.code != 200) {
            $.alertF("请检查银行卡号是否正确");
            return;
        }
        //检查预留手机号
        var bankPhone = $("#bankPhone").val().trim();
        if (!bankPhone) {
            $.alertF("请填写银行预留手机号码");
            return;
        }
        if (!$.isMobilePhone(bankPhone)) {
            $.alertF("银行预留手机号码格式错误");
            return;
        }
        //检查手机短信验证码
        var smsInput = $("#smsInput").val().trim();
        if (!smsInput) {
            $.txsToast("短信验证码不能为空");
            return;
        }
        var _bankCode, _bankName, _cardType;
        if (CardBinResult.code && CardBinResult.code != 200) {
            _bankCode = CardBinResult.data.bankCode;
            _bankName = CardBinResult.data.bankName;
            _cardType = CardBinResult.data.cardType;
        } else {
            _bankCode = bankCode;
            _bankName = bankName;
            _cardType = 'D';
        }
        var url = apiUrl_prefix + "/jys/member/register-binding-card";
        var parameter = {
            "mobile": bankPhone,
            "operation": 'JYSRB',
            "smsCode": smsInput,
            "cardNumber": bankNo,
            "bankCode": _bankCode,
            "bankName": _bankName,
            "cardType": _cardType, //D-借记卡、C-贷记卡
            "idCardType": '01', //01-身份证
            "idCardNo": idCardNumber,
            "name": userName,
            "bankMobile": bankPhone,
            "memberType": '1', //1-个人、0-企业
            "isDefault": bankNo == bankNoOriginal.trim() //是否使用默认带入银行卡
        };
        $.weuiLoading('安全开户中');
        $.AkmiiAjaxPost(url, parameter, true).then(function(d) {
            if (d.code == 200) {
                $.hideWeuiLoading();
                var timer = 10;
                $.weuiLoading('安全开户中<br/>' + timer + 's');
                resultInterval = setInterval(function() {
                    if (timer <= 0) {
                        clearInterval(resultInterval);
                        $.setSession(jumpSwitchKey, 'true');
                        window.location.replace('/html/my/unionopening/open-waiting.html');
                        return;
                    }
                    timer--;
                    $.weuiLoading('安全开户中<br/>' + timer + 's');
                    //查询结果
                    if (queryDepositorySwitch) {
                        queryDepositoryResult();
                    }
                }, 1000);
            } else {
                $.hideWeuiLoading();
                if (d.code == 5002) {
                    $.confirmF("银行受理开户时间为每日的7:30~19:30，感谢您的支持，我们将努力为您提供最优质的服务",
                        "取消",
                        "拨打客服",
                        function() {},
                        function() {
                            window.location.href = $.txsOfficialTel();
                        })
                } else {
                    $.alertF(d.message);
                }
            }
        }, function() {
            $.hideWeuiLoading();
        });
    }
    /**查询开户结果 */
    function queryDepositoryResult() {
        queryDepositorySwitch = false;
        var url = apiUrl_prefix + "/jys/member/register-binding-card/result";
        $.AkmiiAjaxGet(url, {}, false).then(function(d) {
            depositoryResult = d;
            queryDepositorySwitch = true;
            if (d.code == 200) {
                var allOk = d.data.every(function(v, k) {
                    if (v.activationStatus == "3")
                        return true;
                });
                if (allOk && d.data.length > 0) {
                    resultInterval && clearInterval(resultInterval);
                    $.hideWeuiLoading();
                    $(".txs_toast_container").show().find('.txs_toast_text').html('开户成功');
                    setTimeout(function() {
                        jumpHome();
                    }, 1500);
                }
            } else {
                //$.alertF(d.message);
            }
        }, function() {
            queryDepositorySwitch = true;
            //$.hideWeuiLoading();
        })
    }
})