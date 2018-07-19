//var appkey = $.getQueryStringByName("appkey");
$(function () {
    $('.ques-num:first').css('margin-top', '7px')
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

    //if (alist >= 2 && blist <= alist) {
    //    var quest = 1;
    //}
    //else if (blist >= 2 && clist <= blist) {
    //    var quest = 2;
    //}
    //else {
    //    var quest = 3;
    //}
    if (sumscore < 20) {
        var quest = 1;
    }
    else if (sumscore >= 21 && sumscore <= 45) {
        var quest = 2;
    }
    else if (sumscore >= 46 && sumscore <= 70) {
        var quest = 3;
    }
    else if (sumscore >= 71 && sumscore <= 85) {
        var quest = 4;
    }
    else {
        var quest = 5;
    }
    var url = "/StoreServices.svc/userservice/userquestionnaire";
    var data = { "questionnaire": quest };
    $.AkmiiAjaxPost(url, data).then(function (d) {
        if (d.result) {
            $(".btnover").hide();//隐藏完成按钮
            $(".question-list").hide();//隐藏题目

            //1.保守型 2.稳健型 3.平衡型 4.成长型 5.进取型
            if (quest == 1) {
                $(".q1").css("display", "block");
            }
            else if (quest == 2) {
                $(".q2").css("display", "block");
            }
            else if (quest == 3) {
                $(".q3").css("display", "block");
            }
            else if (quest == 4) {
                $(".q4").css("display", "block");
            }
            else {
                $(".q5").css("display", "block");
            }
        }
        else {
            $.alertF(d.errormsg);
        }
    });
}

//开始测试
$(".riskstart").click(function () {
    $(".question-title").hide();//会员测试表头隐藏
    $(".question-list").show();//显示题目
    $(".btnover").show();//显示完成按钮
});

//点击完成

$(".btnover").click(function () {
    $(".mask").hide();

    overall_score.forEach(function (item, index) {
        sumscore += item.score;
    });

    //for (var j = 0 ; j < overall_score.length; j++) {        
    //    sumscore += overall_score[j];
    //}
    console.log(sumscore)
    if (b_r_len >= 10) {
        postQuestion();
    }
    //for (var j = 0; j < list.length; j++) {
    //    if (list[j] == "A") {
    //        alist += 1;
    //    }
    //    else if (list[j] == "B") {
    //        blist += 1;
    //    }
    //    else if (list[j] == "C") {
    //        clist += 1;
    //    }
    //    else {
    //        //未完成所有题目
    //        return;
    //    }
    //    if (j == 5) {
    //        postQuestion();
    //    }
    //}
});

//点击确定返回上一页
$(".btnok").click(function () {
    window.location.href = window.location.protocol + "//" + window.location.host + "/html/my/";
    /*
    if (appkey == "") {
        //微信端返回上一页
        //window.history.back() + "?v=" + Date.now(+);
        window.history.go(-1);
    }   
    else {
        //app返回首页
        window.location.href = "https://tservice.txslicai.com/Html/My/";
    }
    */
});


//点击重新测试
$(".tran-btn").click(function () {
    window.location.reload();
});

//function getSum() {
//    var sumscore = 0;
//    for (var i = 0; i < overall_score.length; i++) {
//        sumscore += overall_score[i]
//    }
//    return sumscore;
//}
//getSum()
