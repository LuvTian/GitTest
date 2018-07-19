var appkey = $.getQueryStringByName("appkey");
var activekey=$.getCookie("activekey")||"";
var returnurl=$.getQueryStringByName("returnurl");

var rturl = $.getQueryStringByName("rturl");
var istran = $.getQueryStringByName("istran") || 0;
var app = $.getQueryStringByName("app") || false;
var productrisklevel = $.getQueryStringByName("productrisklevel") || 0;//产品等级
var account = [];
var type = $.getQueryStringByName("type");
var producttype = $.getQueryStringByName("producttype") || "fixedbuy";

var quest = 0;
$(function () {
    $('.ques-num:first').css('margin-top', '7px')

    if (document.getElementById("check").checked) {
        $(".riskstart").removeClass("bg-colefbdbc");
    }

    userinfo();
});
//定义一个数组保存答题结果(6道题)
var list = new Array();
var key = {};
var questionDic;

var i = 0;
var alist = 0;
var blist = 0;
var clist = 0;
var temp = false;
var queationnum;
var oldquestionnum;
var oldanswer;
var overall_score = [];
var sumscore = 0;
var b_r_len = 0;
$('.ques').bind('click', function () {
    var Dslider = $(this).closest('div').next().css('display');
    if (Dslider == "none") {
        $(this).closest('div').next().slideDown();
        $(this).removeClass("bb");
    } else {
        $(this).closest('div').next().slideUp();
        $(this).addClass("bb");
    }
    $(this).find('.icon-right-arrow').toggleClass('trans-up');
})
$('.ques-answer div').bind('click', function () {

    $(this).closest(".ansowerbox").prev().addClass("bb");
    //$(this).parent().prev().addClass("bb");
    $(this).parents().eq(2).find('.mart-t-1rem').show();
    $(this).parents().eq(2).find('.choosed-answer').text($(this).text());
    $(this).parents().eq(2).find('.ansowerbox').hide();
    $(this).parents().eq(2).closest('div').next().find('.ansowerbox').slideDown();
    $(this).parents().eq(2).find('.icon-right-arrow').removeClass('trans-up');

    b_r_len = $('.b-r-whity').length + 1;
    //获取到第几题
    queationnum = $(this).closest('div').attr("data-question");
    var answer = $(this).closest('div').attr("data-answer");
    var score = parseInt($(this).closest('div').attr("data-score"));
    var oldanswer = list[queationnum - 1];//旧的答案
    //逻辑：(如果list里有当前题的答案说明做过此题，whity变量变为false)

    //---------
    var info = { index: $(this).parents(".ques-num").data("question"), score: score };
    overall_score.map(function (item, index) {
        if (item.index == info.index) {
            item.score = info.score;
        }
        return item;
    });
    if (JSON.stringify(overall_score).indexOf(JSON.stringify(info)) < 0) {
        overall_score.push(info);
    }
    //---------

    var whity = false;
    if (oldanswer == undefined) {
        whity = true;
    }
    //把答案给list赋值
    list[queationnum - 1] = answer;
    if (b_r_len > 10) {
        return false;
    }
    else if (b_r_len == 10) {
        //题目做完后 显示按钮
        var answer = $(".mart-t-1rem");
        $.each(answer, function (index, item) {
            if ($(item).css("display") == "block") {
                temp = true;
                return false;
            }
        });
        //第一次做题才出现进度条
        if (whity) {
            $('.progress-qs').append("<span class='wt b-r-whity'></span>")
        }
        else {
            return false;
        }
    }
    else {
        if (whity) {
            $('.progress-qs').append("<span class='wt b-r-whity'></span>")
        }
        else {
            return false;
        }
    }
    //题目做完后 显示按钮
    if (temp) {
        $(".btnover").removeClass("bg-colefbdbc");
    }


})

//保存做过得题以及答案
function oldanswer() {

}
oldanswer();
//提交答案

function postQuestion() {
    if (sumscore < 20) {
        quest = 1;
    }
    else if (sumscore >= 21 && sumscore <= 45) {
        quest = 2;
    }
    else if (sumscore >= 46 && sumscore <= 70) {
        quest = 3;
    }
    else if (sumscore >= 71 && sumscore <= 85) {
        quest = 4;
    }
    else {
        quest = 5;
    }
    var url = "/StoreServices.svc/userservice/userquestionnaire";
    var data = { "questionnaire": quest };
    $.AkmiiAjaxPost(url, data).then(function (d) {
        if (d.result) {
            $(".btnover").hide();//隐藏完成按钮
            $(".question-list").hide();//隐藏题目
            //1.保守型 2.稳健型 3.平衡型 4.成长型 5.成长型
            if (quest == 1) {
                $(".q1").show();
            }
            else if (quest == 2) {
                $(".q2").show();
            }
            else if (quest == 3) {
                $(".q3").show();
            }
            else if (quest == 4) {
                $(".q4").show();
            }
            else {
                $(".q5").show();
            }
        }
        else {
            $.alertF(d.errormsg);
        }
    });
}


//点击完成v

$(".btnover").click(function () {
    $(".mask").hide();
    overall_score.forEach(function (item, index) {
        sumscore += item.score;
    });
    if (b_r_len >= 10) {
        postQuestion();
    }
});

//点击确定弹框提示
$(".btnok").click(function () {
    if (producttype == "fixedbuy") {
        //去看看别的产品
        $(".lookproduct").click(function () {
            if (type == "ios") {
                PhoneMode.jumpAppWithString({ 'controller': 'InvestmentViewController' });
            } else if (type == "android") {
                window.PhoneMode.callToPage("MainActivity", "licai");
            }
            else {
                // window.location.href = "/Html/Product/productfixedlist.html";
                $(".rule-tip").hide();
                $(".mask").hide();
                $(".btnok").unbind("click").click(function(){window.location.href=returnurl;})
            }
        });
    }
    else {
        //去看看别的产品
        $(".lookproduct").click(function () {
            if (type == "ios") {
                PhoneMode.jumpAppWithString({
                    'controller': 'InvestmentViewController'
                });
            } else if (type == "android") {
                window.PhoneMode.callToPage("MainActivity", "licai");
            }
            else {
                // window.location.href = "/Html/Product/producttransferlist.html";
                $(".rule-tip").hide();
                $(".mask").hide();
                $(".btnok").unbind("click").click(function(){window.location.href=returnurl;})
            }
        });
    }

    if (productrisklevel != 0) {
        $(".mask").show();
        //$(".rule-tip").find(".tran-btn").attr("href", "/Html/my/risk-assesslist.html?istran=2&productrisklevel=" + productrisklevel);//重新测评
        //1.保守型 2.稳健型 3.平衡型 4.成长型 5.成长型
        if (quest == 1 && quest >= productrisklevel) {
            $(".q1canbuy").show();
        } else if (quest == 1 && quest < productrisklevel) {
            $(".q1nocanbuy").show();
        }
        else if (quest == 2 && quest >= productrisklevel) {
            $(".q2canbuy").show();
        } else if (quest == 2 && quest < productrisklevel) {
            $(".q2nocanbuy").show();
        }
        else if (quest == 3 && quest >= productrisklevel) {
            $(".q3canbuy").show();
        } else if (quest == 3 && quest < productrisklevel) {
            $(".q3nocanbuy").show();
        }
        else if (quest == 4 && quest >= productrisklevel) {
            $(".q4canbuy").show();
        } else if (quest == 4 && quest < productrisklevel) {
            $(".q4nocanbuy").show();
        }
        else if (quest == 5 && quest >= productrisklevel) {
            $(".q5canbuy").show();
        } else if (quest == 5 && quest < productrisklevel) {
            $(".q5nocanbuy").show();
        }
    }
    else {
        
        if (type != "wechat" && $.browserVersions().ios) {
            PhoneMode.appGoBackWithStirng({
                'controller': 'InvestmentViewController'
            });
        }
        else if (type != "wechat" && $.browserVersions().android) {
            window.PhoneMode.callClosePage(null);
        }
    }
});


//点击重新测试
$(".tran-btn").click(function () {
    //window.location.href = "/Html/My/risk-assesslist.html?rturl=" + rturl + "&istran=1";
    window.location.reload();
});


var authInvestorRiskwarning = function () {
    var url = "/StoreServices.svc/userservice/consentriskagreement";
    //风险提示和合格投资人声明
    var paramter = {
        passinvestor: '1',
        riskwarning: '1'
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (d) {
        if (d.result) {
            if (account.questionnaire <= 0) {
                $(".question-title").hide();//会员测试表头隐藏
                $(".question-list").show();//显示题目
                $(".btnover").show();//显示完成按钮
            }
            else {
                if (type == "ios") {
                    //JS 调用本地分享方法
                    PhoneMode.appGoBackWithStirng({
                        'controller': 'InvestmentViewController'
                    });
                } else if (type == "android") {
                    //JS 调用本地分享方法
                    window.PhoneMode.callClosePage(null);
                } else {
                    window.history.back() + "?v=" + Date.now();
                }
            }
        }
        else if (d.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
        else {
            $.alertF(d.errormsg);
        }
    });
}

$("#check").click(function () {
    var ck = document.getElementById("check").checked;
    if (ck) {
        $(".riskstart").removeClass("bg-colefbdbc");
    }
    else {
        $(".riskstart").addClass("bg-colefbdbc");
    }
});
//开始测试
$(".riskstart").click(function () {
    if ($(".riskstart").hasClass("bg-colefbdbc")) {
        return;
    }
    if ($(".riskstart").html() == "开始测试") {
        if (account.questionnaire <= 0) {
            authInvestorRiskwarning();
        }
        else {
            $(".question-title").hide();//会员测试表头隐藏
            $(".question-list").show();//显示题目
            $(".btnover").show();//显示完成按钮
        }
    }
    else {
        authInvestorRiskwarning();
    }
});

function userinfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {
    }).then(function (d) {
        if (d.result) {
            account = d.accountinfo;
            var ck = document.getElementById("check").checked;
            if (!account.passinvestor && !account.riskwarning && account.questionnaire <= 0) {
                $("#checkboxtob").show();
                if (!ck) {
                    $(".riskstart").addClass("bg-colefbdbc");
                }
            }
            else if (account.passinvestor && !account.riskwarning && account.questionnaire > 0) {
                $("#checkboxtob").show();
                $("#passinvestor").hide();
                $("#he").hide();
                $(".riskstart").html("我同意");
                $("#risktitle").html("合格投资人认证");
                $("#riskcenter").html("您需要阅读和同意以下协议方可投资。");
                if (!ck) {
                    $(".riskstart").addClass("bg-colefbdbc");
                }
            }
            else if (!account.passinvestor && account.riskwarning && account.questionnaire > 0) {
                $("#checkboxtob").show();
                $("#riskwarning").hide();
                $("#he").hide();
                $(".riskstart").html("我同意");
                $("#risktitle").html("合格投资人认证");
                $("#riskcenter").html("您需要阅读和同意以下协议方可投资。");
                if (!ck) {
                    $(".riskstart").addClass("bg-colefbdbc");
                }
            }
            else if (!account.passinvestor && !account.riskwarning && account.questionnaire > 0) {
                $("#checkboxtob").show();
                $(".riskstart").html("我同意");
                $("#risktitle").html("合格投资人认证");
                $("#riskcenter").html("您需要阅读和同意以下协议方可投资。");
                if (!ck) {
                    $(".riskstart").addClass("bg-colefbdbc");
                }
            }
            else if (account.passinvestor && !account.riskwarning && account.questionnaire <= 0) {
                $("#checkboxtob").show();
                $("#passinvestor").hide();
                $("#he").hide();
                if (!ck) {
                    $(".riskstart").addClass("bg-colefbdbc");
                }

            }
            else if (!account.passinvestor && account.riskwarning && account.questionnaire <= 0) {
                $("#checkboxtob").show();
                $("#riskwarning").hide();
                $("#he").hide();
                if (!ck) {
                    $(".riskstart").addClass("bg-colefbdbc");
                }
            }
            else if (account.passinvestor && account.riskwarning && account.questionnaire > 0 && istran == 0) {
                window.location.replace(rturl);
            }
        }
        else if (d.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        }
    });
}

$(".x").click(function () {
    $(this).parent().parent().parent().hide();
    $(".mask").hide();
});


//可以购买了
$(".btnikonw").click(function () {
    if (type == "ios") {
        PhoneMode.appGoBackWithStirng({
            'controller': 'InvestmentViewController'
        });
    } else if (type == "android") {
        window.PhoneMode.callClosePage(null);
    } else {
        window.history.back() + "?v=" + Date.now();
    }
});
