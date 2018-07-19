
var appkey = $.getQueryStringByName("appkey");
$(function () {
   
});
//定义一个数组保存答题结果(6道题)
var list = new Array();
var i = 0;
var alist = 0;
var blist = 0;
var clist = 0;
//答案
var quest;


//获取当前是哪一题
//$("li[class^='question']").click(function () {
//    i += 1;
//});

//判断选中的答案
$(".A").click(function () {
    list[i] = "A";
    i += 1;
});
$(".B").click(function () {
    list[i] = "B";
    i += 1;
});
$(".C").click(function () {
    list[i] = "C";
    i += 1;
});


//遍历数组里的答案
function eachquestion() {
    $(".mask").hide();
    for (var j = 0; j < list.length; j++) {
        if (list[j] == "A") {
            alist += 1;
        }
        else if (list[j] == "B") {
            blist += 1;
        }
        else {
            clist += 1;
        }
    }
    if (alist >= 2 && blist <= alist) {
        var quest = 1;
    }
    else if (blist >= 2 && clist <= blist) {
        var quest = 2;
    }
    else {
        var quest = 3;
    }

    var url = "/StoreServices.svc/userservice/userquestionnaire";
    var data = { "questionnaire": quest };
    $.AkmiiAjaxPost(url, data).then(function (d) {
        if (d.result) {

            //1.保守型 2.稳健型 3.进取型
            if (quest == 1) {
                $(".q1").css("display", "block");
            }
            else if (quest == 2) {
                $(".q2").css("display", "block");
            }
            else {
                $(".q3").css("display", "block");
            }

        }
        else {
            $.alertF(d.errormsg);
        }
    });

}


    //点击确定返回上一页
$(".btnok").click(function () {
    if (appkey == "") {
        //微信端返回上一页
        window.history.back(-1);
    }
    else {
        //app返回首页
        window.location.href = "https://tservice.txslicai.com/Html/My/";
    }
    });



//开始测试
$(".riskstart").click(function () {
    $(this).closest("li").hide();

    $(this).closest("li").next().show();
    $("ul li .small-7").each(function () {
        $(this).prev().height($(this).outerHeight(true) + "px");
        $(this).next().height($(this).outerHeight(true) + "px");
    });
})

//选中跳到下一题

    $(".ques-answer").click(function () {
    $(".mask").show();

    $(this).closest("li").find(".ques-answer").not($(this)).find(".answ-box img").hide();

    $(this).find("img").show();
    //$(this).find("img").toggle();

    var quename = $(this);
    setTimeout(_show(quename), 400)
})

//上一题
$(".prev-quest").click(function () {
    i -= 1;
    $(this).closest("li").hide();
    $(this).closest("li").prev().show();

})

//显示题目
function show(_this) {
    var $this = _this;
    $this.closest("li").hide();
    if (i < 6) {
        $this.closest("li").next().show();
        $(".mask").hide();
    }
    else {
        eachquestion();
    }
    $this.closest("li").next().find(".small-2").height($this.closest("li").next().find(".small-7").outerHeight(true) + "px");
    $this.closest("li").next().find(".small-3").height($this.closest("li").next().find(".small-7").outerHeight(true) + "px");
    $.each($this.closest("li").next().find(".ques-answer"), function (i, y) {
        $(y).find(".small-2").height($(y).find(".small-7").outerHeight(true) + "px")
        $(y).find(".small-3").height($(y).find(".small-7").outerHeight(true) + "px")
    })
};

function _show(name) {
    return function () {
        show(name);
    }
}