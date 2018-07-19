var welfare = {
    size: 10,
    page: 1,
    canLoad: false,
    startLoad: false,
    credits_tpl: '<li>\
					<dl>\
						<dt class="creditsChange_itemName">{0}</dt>\
						<dt class="creditsChange_date">{1}</dt>\
					</dl>\
					<div class="creditsChange_num">{2}{3}</div>\
				</li>',
    getMemberCreditsChangRecords: function() {
        this.startLoad = true;
        var data = {
            "page": this.page,
            "pageSize": this.size,
            // "start": 1,
            "userId": this.checkLogin()
        }

        $("#creditsChangeHistoryStatus").attr("data-needLoad", "false").text("正在加载数据...");

        $.AkmiiAjaxPost(apiUrl_prefix + "/members/points", data, true).then(function(d) {
                if (d.code == 200) {
                    if (d.data.recordList.length) {
                        $("#creditsChangeHistoryContainer").show();
                        $("#noneCreditsChangeHistory").hide();
                    } else if ($("#creditsChangeRecords li").length == 0) {
                        $("#creditsChangeHistoryContainer").hide();
                        $("#noneCreditsChangeHistory").show();
                    }
                    if (d.data.hasNext) {
                        welfare.page++;
                        welfare.canLoad = true;
                        $("#creditsChangeHistoryStatus").attr("data-needLoad", "false").text("上拉加载...");
                    } else {
                        // alert("没了")
                        welfare.canLoad = false;
                        $("#creditsChangeHistoryStatus").attr("data-needLoad", "false").text("没有更多数据了！");
                    }
                    var data = d.data.recordList;
                    var temp = "";
                    for (var i = 0; i < data.length; i++) {
                        var operation = "+";
                        if (data[i].operationType == "DEDUCTION") {
                            operation = "";
                        }
                        if (data[i].pointCount != 0) {
                            temp += welfare.credits_tpl.format(
                                data[i].operationReason,
                                data[i].createTime,
                                operation,
                                data[i].pointCount
                            );
                        }
                    }
                    $("#creditsChangeRecords").append(temp);
                    myScroll.refresh();


                    welfare.startLoad = false;
                }
            },
            function() {
                welfare.startLoad = false;
                welfare.canLoad = true;
                // alert("出错啦");
                // $.alertF("您的网络不好，请稍候再试！");
                $("#creditsChangeHistoryStatus").attr("data-needLoad", "false").text("上拉加载...");
            }
        )
    },
    showMyCredits: function(nowPoints) {
        /*唐果动画*/
        /*var n = parseInt($(".creditsNum").text());
        if (n == nowPoints) {
        	return;
        }
        var deltaCredits = Math.abs(nowPoints - n);
        var totalSeconds = 600 + deltaCredits * 4;
        var speed = totalSeconds / Math.abs(nowPoints - n);
        var rateNum = n < nowPoints ? 1 : -1;
        animateCreditsNum();

        function animateCreditsNum() {
        	var n = parseInt($(".creditsNum").text());
        	$(".creditsNum").text(n + rateNum);
        	// var speed=(n-2000)/(zz-2000)*80;
        	console.log(speed);
        	if (n != nowPoints - rateNum) {
        		setTimeout(animateCreditsNum, speed);
        	}
        }*/

        //去掉动画
        $(".creditsNum").text(nowPoints);
    },
    getMyCredits: function() {
        var myCredits = 0;
        var cb = null;
        if (localStorage["points"]) {
            myCredits = parseInt(localStorage["points"]);
            $(".creditsNum").text(myCredits);
            cb = this.showMyCredits;
        }
        var data = {
            "id": this.checkLogin()
        }
        $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", data, true).then(function(d) {
            if (d.code == 200) {
                if (cb) {
                    cb.call(welfare, d.data.points);
                }
                localStorage["points"] = d.data.points;
            }
        })
    },
    checkLogin: function() {
        if ($.getCookie("MadisonToken") && $.getCookie("userid")) {
            return $.getCookie("userid");
        } else {
            document.location.href = "/html/Anonymous/login.html"
        }
    }
}


//替换模板
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

$(function() {
    welfare.getMemberCreditsChangRecords();
    welfare.getMyCredits();



    /*上拉加载*/
    myScroll = new IScroll('#creditsChangeHistoryContainer', {
        probeType: 3,
        click: true
    });

    myScroll.on("scroll", function() {
        // console.log(this.currentPage);
        if (welfare.canLoad) {
            if (!welfare.startLoad && this.y < this.maxScrollY + 10) {
                $("#creditsChangeHistoryStatus").attr("data-needLoad", "true").text("放开加载...");
            } else {
                $("#creditsChangeHistoryStatus").attr("data-needLoad", "false").text("上拉加载...");
            }
        }
    })

    $("#creditsChangeHistoryContainer").on("touchend", function() {
        if ($("#creditsChangeHistoryStatus").attr("data-needLoad") == "true") {
            $("#creditsChangeHistoryStatus").attr("data-needLoad", "false");
            welfare.canLoad = false;
            welfare.getMemberCreditsChangRecords();
            console.log("needLoad")
        }
    })


    myScroll.on("scrollEnd", function() {
        // setTimeout(function(){$("#creditsChangeHistoryStatus").text("上拉加载...");},300)
        if ($("#creditsChangeHistoryStatus").attr("data-needLoad") == "true") {
            $("#creditsChangeHistoryStatus").attr("data-needLoad", "false");
            welfare.canLoad = false;
            welfare.getMemberCreditsChangRecords();
            console.log("needLoad")
        }
    })

    $("#currentCreditsContainer").click(function(e) {
        if (e.target.nodeName != "A") {
            document.location.href = "/html/store/";
        }
    })



    $("#currentCreditsContainer").click(function() {
        $.BaiduStatistics("Integral Mall", "TanGuo_Head", "我的唐果-头部");
    });
    $(".title .link_exchange").click(function() {
        $.BaiduStatistics("Integral Mall", "Btn_TangGuo", "我的唐果-立即兑换");
        //_hmt.push(['_trackEvent', '我的唐果立即兑换', '我的唐果立即兑换link', 'click', '我的唐果立即兑换']); //百度统计
    });
    $(".title .wenhao a").click(function() {
        $.BaiduStatistics("Integral Mall", "Btn_TangGuo_Rule", "我的唐果-问号");
        //_hmt.push(['_trackEvent', '我的唐果右方的小问号', '我的唐果右方的小问号link', 'click', '我的唐果右方的小问号']); //百度统计
    });
})