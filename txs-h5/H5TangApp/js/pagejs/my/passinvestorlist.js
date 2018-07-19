$(function () {
    //网贷风险测评页

    var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
    $.AkmiiAjaxPost(url, {}).then(function (d) {
        if (d.result) {
            account = d.accountinfo;
            isshowp2pinfo = account.isshowp2pinfo;
            if (account.riskwarning) {
                $(".risk-tip").html("已同意").css("color", "#979797");
            } else {
                $(".risk-tip").html("未同意");
            }
            if (account.passinvestor) {
                $(".investor-announcement").html("已同意").css("color", "#979797");
            } else {
                $(".investor-announcement").html("未同意");
            }
            //风险提示书或合格投资人声明未做	(未完成合格投资人认证)
            if (account.riskwarning && account.passinvestor) {
                if (account.questionnaire != 0) {
                    //显示认证提示一栏
                    $("#accreditationhtml").html("您的投资风格为" + account.riskleveldesc);
                } else {
                    //显示认证提示一栏
                    $("#accreditationhtml").html("立即测评");
                }
            } else {
                //显示认证提示一栏
                $("#accreditationhtml").html("立即测评");
            }
            if (isshowp2pinfo) {//p2p风险测评
                $(".p2p_test").show();
                $("#mark_p2p").text("投资人问卷、网贷风险测评分别用于投资定期和网贷产品的资格认证");
                $(".protocol").removeClass("strong_text");
                var url_p2p = window.apiUrl_prefix + "/members/account/txs/info";
                $.AkmiiAjaxGet(url_p2p, false).then(function (data) {
                    if (data.code = 200) {
                        if (data.data.risk) {
                            $("#p2p_result").html("您的投资风格为" + data.data.riskLevelDesc);
                        } else {
                            $("#p2p_result").html("立即测评");
                        }

                    }
                })

            } else {
                $(".p2p_test").hide();//网贷风险测评入口关掉
                $("#mark_p2p").text("");
                $(".protocol").addClass("strong_text");
            }
        }
    });


})

function risk_url(destinationPage) {
    $.p2p_url(destinationPage);
}