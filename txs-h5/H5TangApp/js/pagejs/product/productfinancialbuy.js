/// <reference path="../../vendor/jquery-2.2.0.js" />
/// <reference path="../../common.js" />

//理财金券列表id
var $financiallist = $("#financiallist");
$(function () {
    getUserInfo();
    financiallist();
});

var list;//保存理财金列表信息
var summoney = 0;//购买金额
var financialids = "";//购买理财金的id
var original_id = "";
var profitstarttime = "";//起息日
var account;

//用户信息
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            $.CheckAccountCustomStatusBeforeNext(account);
            // if (account.customstatus < 2) {
            //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            // }
            // if (account.customstatus < 3) {
            //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
            //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
            //     });
            // }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
};

//理财金券列表
function financiallist() {
    var url = "/StoreServices.svc/user/financiallist?v=" + (new Date()).getTime();
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            list = data.userfinanciallist;
            profitstarttime = data.profitstarttime;
            //理财金总金额
            $(".sumamount").html($.fmoney(data.sumamount));
            $(".money").html($.fmoney(data.sumamount));
            $("#displayprofittime").html(data.displayprofittime);
            //理财金金额为0投资按钮淡
            if (data.sumamount == 0) {
                $("#btn-buy").addClass("pay_btn_op");
                $("#clickfinancial").unbind("click");
                $("#btn-buy").unbind("click");
            }
            //加载理财金列表
            $.each(list, function (index, item) {
                //根据状态判断显示
                $financiallist.append(financiallisthtml(item));
                if (item.status == 1) {
                    summoney += parseInt(item.amount);
                    financialids += item.financialid + ",";
                    original_id += item.financialid + ",";
                }
            });
            //样式称高
            $('.h-ticket:last').css('margin-bottom', '7rem');
        }
    });
}

//判断理财金券状态显示对应的效果
function financiallisthtml(item) {
    var ha = [];
    if (item.status == 1) {
        ha.push('<div class="h-ticket could-use ischoose">');
        ha.push('<div class="choose-box"> ');
        ha.push('<img src="/css/img2.0/answer-choosepic0.png" alt="" class="h-ticket-choose choose-img-posit  " data-money="' + item.amount + '" data-financialid="' + item.financialid + '"></div> ');
        ha.push(' <div class="mounets-num red">');
        ha.push(' <span class="mounets">' + item.amount + '</span>');
        ha.push('<span class="yuan">元</span></div>');
        ha.push(' <div class="h-ticket-content">');
        ha.push('<span class="name red">理财金</span>');
        ha.push('<span class="state border-col-eb7454 col-eb7454">可使用</span></div>');
        ha.push(' <div class="h-ticket-tip">');
        ha.push('<p>' + item.description + '</p>');
        ha.push(' <p>可投资指定理财产品</p>');
        ha.push('<p>有效期至：' + item.endtime + '</p>');
        ha.push('</div>');
        ha.push('<div class="h-ticket-qz">');
        ha.push(' <p>最终解释权归唐小僧理财</p>');
        ha.push(' </div></div>');
    }
    var result = $(ha.join(''));
    return result;
}

//点击理财金加载出理财金列表
$("#clickfinancial").click(function () {
    if (financialids != "") {
        $("#financiallist img").each(function (index, item) {
            var _financialid = $(this).data("financialid");
            if (financialids.indexOf(_financialid) > -1) {
                $(this).attr("src", "/css/img2.0/answer-choosepic0.png");
            }
            else {
                $(this).attr("src", "/css/img2.0/answer-choosepic2.png");
            }
        });
    }
    if (original_id == financialids) {
        $("#all").attr("src", "/css/img2.0/answer-choosepic0.png");
    }
    else {
        $("#all").attr("src", "/css/img2.0/answer-choosepic2.png");
    }
    $("#btn-rightnow").removeClass("bg-col-eebdbd");

    $("#contenthtml").hide();
    $("#financialhtml article.viewport,.btn-rightnow-fixed").css({ "left": "100%", "right": "-100%" });
    $("#financialhtml").show();
    $("#financialhtml article.viewport,.btn-rightnow-fixed").animate({ left: "0%", right: "0%" }, 500);
    //change hash
    window.location.hash = "#list";
    //样式称高
    $('.h-ticket:last').css('margin-bottom', '7rem');
});

//理财金选中
$(document).on("click", ".ischoose", function () {
    var attrsrc = $(this).find(".choose-img-posit").attr("src");
    if (attrsrc == "/css/img2.0/answer-choosepic2.png") {
        $(this).find(".choose-img-posit").attr("src", "/css/img2.0/answer-choosepic0.png")
        $('#all').attr("src", "/css/img2.0/answer-choosepic2.png");
    } else {
        $(this).find(".choose-img-posit").attr("src", "/css/img2.0/answer-choosepic2.png")
        $('#all').attr("src", "/css/img2.0/answer-choosepic2.png");
    }
    var allchoose = $(".ischoose");
    var temp = true;
    var btntemp = false;
    $.each(allchoose, function (index, item) {
        if ($(item).find(".choose-img-posit").attr("src") == "/css/img2.0/answer-choosepic2.png") {
            temp = false;
            return false;
        }
    });
    //判断按钮
    $.each(allchoose, function (index, item) {
        if ($(item).find(".choose-img-posit").attr("src") == "/css/img2.0/answer-choosepic0.png") {
            btntemp = true;
            return false;
        }
    });
    //判断全选
    if (temp) {
        $('#all').attr("src", "/css/img2.0/answer-choosepic0.png");
    }
    //判断按钮
    if (btntemp) {
        $("#btn-rightnow").removeClass("bg-col-eebdbd");
        $("#btn-rightnow").unbind("click").bind("click", rightnowFun);
    }
    else {
        $("#btn-rightnow").addClass("bg-col-eebdbd");
        $("#btn-rightnow").unbind("click");
    }
});

//全选
$(".choose-all").click(function () {
    var allsrc = $("#all").attr("src");
    if (allsrc == "/css/img2.0/answer-choosepic0.png") {
        $('.ischoose').find(".choose-img-posit").attr("src", "/css/img2.0/answer-choosepic2.png");
        $('#all').attr("src", "/css/img2.0/answer-choosepic2.png");
        //立即使用
        $("#btn-rightnow").addClass("bg-col-eebdbd");
        $("#btn-rightnow").unbind("click");
    } else {
        $('.ischoose').find(".choose-img-posit").attr("src", "/css/img2.0/answer-choosepic0.png");
        $('#all').attr("src", "/css/img2.0/answer-choosepic0.png");
        $("#btn-rightnow").removeClass("bg-col-eebdbd");
        $("#btn-rightnow").unbind("click").bind("click", rightnowFun);
    }
});

//理财金购买
function financialbuy() {
    var allchoose = $(".ischoose");
    //clear summony
    summoney = 0;
    financialids = "";
    //判断金额
    $.each(allchoose, function (index, item) {
        if ($(item).find(".choose-img-posit").attr("src") == "/css/img2.0/answer-choosepic0.png") {
            summoney = parseInt($(item).find(".choose-img-posit").attr("data-money")) + summoney;
            financialids += $(item).find(".choose-img-posit").attr("data-financialid") + ",";
        }
    });
    $(".money").html($.fmoney(summoney));
}

var rightnowFun = function () {
    $("#financialhtml article.viewport,.btn-rightnow-fixed").animate({ left: "100%", right: "-100%" }, 500, "swing", function () { $("#financialhtml").hide(); $("#contenthtml").show(); });
    window.history.back();
    financialbuy();
}

//立即使用
$("#btn-rightnow").click(function () {
    rightnowFun();
});

//立即投资
$("#btn-buy").click(function () {
    if (summoney <= 0) {
        $.alertNew("投资金额必须大于0");
        return;
    }
    if (!account) {
        return
    }
    if (!$.CheckAccountCustomStatusBeforeNext(account)) {
        return;
    }
    // if (account.customstatus < 3) {
    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
    //     });
    //     return;
    // }
    $.PaymentHtmlNew(summoney, "", function (password) {
        $.closePWD();
        financialbuy_post(password);
    }, null);
});

function financialbuy_post(password) {
    var data = {
        bidamount: summoney,
        financialids: financialids,
        paypassword: password,
    };
    var url = "/StoreServices.svc/product/financialbuy";
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            $.closePWD();
            param = "?type=financialbuy" +
                "&title=" + encodeURIComponent('投资成功') +
                "&product=" + encodeURIComponent('理财金专享') +
                "&buybank=" + encodeURIComponent('理财金') +
                "&amount=" + summoney +
                "&profittime=" + profitstarttime;
            _gsq.push(["T", "GWD-002985", "track", "/targetpage/buy_success"]);
            window.location.href = "/html/paycenter/operation-success.html" + param;
        }
        else if (data.errorcode == "20018") {
            $.alertNew(data.errormsg, null, function () {
                $.PaymentHtmlNew(summoney, "", function (password) {
                    $.closePWD();
                    financialbuy_post(password);
                }, null);
            });
        }
        else if (data.errorcode == "20019") {
            $.confirmF(data.errormsg, null, "去重置", function () {
                $(".reset").click();
            }, function () {
                window.location.href = "/html/my/resetpassword.html";
            });
        }
        else if (data.errorcode == "isnewuser") {
            $.alertF(data.errormsg);
        }
        else if (data.errorcode == "missing_parameter_accountid") {
            $.confirmF("请先登录", null, null, null, $.Loginlink);
        } else {
            $.alertF(data.errormsg);
        }
    });
}
//监听锚点改变事件
window.onhashchange = function () {
    if (window.location.hash.length <= 0) {
        $.UpdateTitle("立即投资");
        $("#financialhtml article.viewport,.btn-rightnow-fixed").animate({ left: "100%", right: "-100%" }, 500, "swing", function () { $("#financialhtml").hide(); $("#contenthtml").show(); });
    }
    else {
        $.UpdateTitle("理财金");
    }
}