//TODO 微信分享
//android不能有同名变量
/*var PhoneMode = {
    appPlayerLocalWithString:function(){},
    appShakeWithStirng:function(){},
    callShake:function(){}
};*/
var phoneType = $.getQueryStringByName("type");
var referenceCode="";
var userId=$.getCookie("userid") || "";


document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
}, false);

var prizeLists = [];
var prizeMap = {};

function checkLogin() {
    if (!$.getCookie("MadisonToken") || $.getCookie("MadisonToken") == "") {
        phoneProxy.login(window.location.href);
        return false;
    }
    return true;
}

function _init(prizeLists) {
    return function (id) {
        for (var i = 0; i < prizeLists.length; i++) {
            $("#" + id).append("<li><img src='" + prizeLists[i] + "' /></li>");
        }
    }
}


$.AkmiiAjaxPost(apiUrl_prefix + "/members/referralcode", {                    
    "accountId": userId                
}, true).then(function (d) {
    referenceCode=d.data.referralcode;
});

function repeat(fun, times) {
    return function () {
        for (var i = 0; i < times; i++) {
            fun.apply(null, arguments);
        }
    }
}


$("#link_winnerDetail").click(function(){
    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent",referenceCode,"查看获奖详情","幸运西游机"]);
    window.location.href="/html/store/winnersDetail.html?activitytype=3";
})

function _animate(totalTimes) {
    var times = 0;
    var top = 0;
    return function run(id, duration, p) {
        (function aa() {
            $("#" + id).css({
                top: "0"
            }).animate({
                top: game.roundDistance
            }, duration, "linear", function () {
                if (times == totalTimes) {
                    times++;
                    end(game.p[p]);
                    return;
                }
                aa();
            });
            times++;
        })();

        function end(p) {
            $("#" + id).css({
                top: "0"
            }).animate({
                top: "-" + p * 100 + "%"
            }, duration, "linear", function () {
                game.endTimes++;
                if (game.endTimes == 3) {
                    game.end.apply(game);
                    game.runing = false;
                }
            });
            times = 0;
        }
    }
}

function randomN(min, offset) {
    return Math.random() * min + offset;
}



var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var $WinningImg = $("#WinningImg"); //中奖图片
var $WinningName = $("#WinningName"); //奖品名称
var $WinningPrice = $("#WinningPrice"); //奖品价值

var init = repeat(_init(prizeLists), 4);
var activitytype = 3;





var animate1 = _animate(3);
var animate2 = _animate(3);
var animate3 = _animate(3);


var game = {
    roundDistance: 0,
    runing: false,
    ready: false,
    endTimes: 0,
    spend: 3, //每局消耗糖果
    end: null, //结束触发事件
    playSound: false,
    p: [0, 1, 2], //停止位
    run: function () {
        if (this.runing) {
            return;
        }
        this.endTimes = 0;
        setTimeout(function () {
            animate1("pc1", randomN(prizeLists.length * 300, 600), 0);
            animate2("pc2", randomN(prizeLists.length * 300, 600), 1);
            animate3("pc3", randomN(prizeLists.length * 300, 600), 2);
        }, 0);
        this.runing = true;
        this.ready = false;
    },
    init: function () {
        this.roundDistance = -prizeLists.length * 300 + "%";
        init("pc1");
        init("pc2");
        init("pc3");
    }
}






//获取唐果
function getCandy() {
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/xiyoupointsandtimes", {activitytype:3}, true).then(function (data) {
        if (data.result) {
            $(".rockTimesDescContainer span").text(data.points);
            game.spend = data.everytimepoints || 0;
        } else {
            $.alertF(data.errormsg);
        }
    })
}


//手动扣唐果
function spendTangguo() {
    var tangguo_now = parseInt($(".rockTimesDescContainer span").text());
    $(".rockTimesDescContainer span").text(tangguo_now - parseInt(game.spend));
}



//获奖列表
function getMyPrizes() {
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitywinnerslist", {
        activitytype: activitytype,
        pageindex: 1,
        pagesize: 10
    }, true).then(function (data) {
        if (data.result) {
            var winner = renderTemplate("<li>恭喜{0}抽到{1}</li>");
            if (data.activitywinnersinfomodel.length > 0) {
                winnersList = data.activitywinnersinfomodel;
                var winnersContainer = $("#list_of_winners ul");
                for (var i = 0; i < winnersList.length; i++) {
                    var winnerInfo = winnersList[i];
                    winnersContainer.append($(winner(winnerInfo.username, winnerInfo.couponactivityname)));
                }
                winnerInfo = winnersList[0];
                winnersContainer.append($(winner(winnerInfo.username, winnerInfo.couponactivityname)));
                list_of_winners.init().run();
            }
        } else {
            $.alertF(data.errormsg);
        }
    })
}

function playSound() {
    if ($(".musicB").hasClass("musicOn")) {
        if (phoneType == "ios" || phoneType == "android") {
            //lucdraw因为android拼错了
            phoneProxy.playLocalSound("lucdraw");
        } else {
            document.getElementById("musicBox").play();
        }

    }
}


function choujiang() {
    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", referenceCode, "立即抽奖", "幸运西游机"]);
    if (!game.runing && !game.ready) {
        $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/xiyoulotteryactivityservice", {
            activitytype: activitytype,
            region: "310000"
        }, true).then(function (data) {
            game.playSound = true;
            if (data.result) {
                setTimeout(function () {
                    switch (data.errorcode) {
                        case null:
                            {

                            }
                        case "20108":
                            {

                            }
                        case "0":
                            {
                                playSound();
                                game.run();
                                if (data.validatecode == "" || data.validatecode == null) {
                                    //没中
                                    var l = prizeLists.length - 1;
                                    var pos = [Math.round(randomN(l, 0)), Math.round(randomN(l, 0)), Math.round(randomN(l, 0))];
                                    while (pos[0] == pos[1] && pos[0] == pos[2]) {
                                        pos[Math.round(randomN(3, 0))] = Math.round(randomN(l, 0));
                                    }
                                    game.p = pos;
                                    game.end = function () {
                                        $.alertF("很遗憾，什么都没有！", "再玩一次", function () {
                                            choujiang()
                                        }, false)
                                        getCandy();
                                    };
                                } else {
                                    /**
                                     * TemplateType:6  唐果
                                     * TemplateType:7  代金券
                                     * TemplateType:5  理财金
                                     * TemplateType:0  实物
                                     */
                                    var pos = 0;
                                    if (data.coupontemplates) {
                                        pos = prizeMap["t" + data.coupontemplates.TemplateType];
                                    } else {
                                        pos = prizeMap["t" + data.couponactivityid];
                                    }
                                    game.p = [pos, pos, pos];
                                    game.end = function () {
                                        $.alertF("好运挡不住，恭喜获得" + data.couponactivityname + "可至我的福利中查看详情", "再玩一次", function () {
                                            choujiang();
                                        }, false)
                                        getCandy();
                                    }
                                }
                                break;
                            }
                        case "20107":
                            {
                                $.confirmF(data.errormsg, "取消", "去赚唐果", $.noop(), function () {
                                    phoneProxy.jumpToPage("licai");
                                });
                            }
                    }
                }, 500);

            } else {
                $.alertF(data.errormsg);
                game.ready = false;
            }
        })
    }
}

//奖品列表
function getPrizesList() {
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivityinfolist", {
        activitytype: activitytype,
        region: "310000",
        pageindex: 1,
        pagesize: 100
    }, true).then(function (data) {
        if (data.result) {
            var tpl = '<li>\
                        <img src="{0}" alt="" class="prizeImg" />\
                        <div class="descContainer">\
                            <div class="prizeName">{1}</div>\
                            <div class="prizeValue">价值{2}元</div>\
                            <div class="prizeIndate">有效期至{3} <span class="prizeSellNum">已出{4}件</span></div>\
                        </div>\
                    </li>';
            var infoList = renderTemplate(tpl);
            var list = data.couponactivitylist;
            var prizesList = $(".prizesList");
            $.each(list, function (k, info) {
                var url = "/html/store/activitydetail.html?id=" + info.id + "&longitude=" + longitude + "&latitude=" + latitude;
                var li = $(infoList(info.couponimagesmall, $.Cutstring(info.name, 10, ".."), info.couponprice, info.activityend, info.deliverycount))/*.click(function () {
                    _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", referenceCode, "点击奖品-" + info.name, "幸运西游机"]);
                    window.location.href = url;
                });*/
                prizesList.append(li);


                var tType = "t" + info.coupontemplates.TemplateType;
                if (info.coupontemplates.TemplateType == 0) {
                    tType = "t" + info.id;
                }
                if (prizeMap[tType] != undefined) {
                    return;
                }
                prizeLists.push(info.couponimagesmall);
                prizeMap[tType] = prizeLists.length - 1;
            })
            if(prizeLists.length==1){
                prizeLists.push($.resurl()+"/css/img2.0/luckdrawDefaultGift1.jpg");
                prizeLists.push($.resurl()+"/css/img2.0/luckdrawDefaultGift2.jpg");
            }
            if (list.length) {
                configShare(list[0]);
            }
            game.init();
            $(".control_show_local").removeClass("control_show_local");
        } else {
            $.alertF(data.errormsg);
        }
    })
}


function renderTemplate(tpl) {
    return function () {
        return tpl.format.apply(tpl, arguments);
    }
}

//中奖名单滚动
var list_of_winners = {
    l: 0, //数量
    currentNo: 0,
    distance: 0, //移动距离
    run: function () {
        if (this.l <= 0) {
            return;
        }
        $(".ul_list_of_winners").css({
            transform: "translateY(-" + (this.currentNo++) * this.distance + "%)",
            transition: "transform 200ms"
        });
        if (this.currentNo == this.l) {
            setTimeout(function () {
                $(".ul_list_of_winners").css({
                    transform: "translateY(0)",
                    transition: "transform 0ms"
                });
            }, 200);

            this.currentNo = 0;
        }

        setTimeout(function () {
            list_of_winners.run.apply(list_of_winners)
        }, 1000);
    },
    init: function () {
        this.l = $(".ul_list_of_winners li").length;
        if (this.l <= 0) {
            return;
        }
        this.distance = 100 / this.l;
        return this;
    }
}


if (checkLogin()) {

    getCandy();
    getMyPrizes();
    getPrizesList();

    $("#btn_choujiang").click(choujiang);

    $(".musicB").click(function () {
        _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", referenceCode, "音乐开关", "幸运西游机"]);
        $(this).toggleClass("musicOn musicOff");
    })

    $(".shareContainer").click(function () {
        $(this).hide();
    })

    $("#link_rules").click(function () {
        _gsq.push(["H", "GWD-100354", "GWD-002985", "trackEvent", referenceCode, "查看规则", "幸运西游机"]);
        $(".rule-tip").show();
    })

    $(".questionMark").click(function () {
        $(".tangguo-tip").show();
    })

    $(".rule-tip .icon-turnoff2,.tangguo-tip .icon-turnoff2").click(function () {
        $(".rule-tip").hide();
        $(".tangguo-tip").hide();
    })


    $("body").delegate(".az-showmasker-Text", "click", function (e) {
        if (e.offsetX > $(".az-showmasker-Text").width() * 0.9 && Math.abs(e.offsetY) < 15) {
            $('.az-showmasker-Text,.az-showmasker').hide();
        }
    })



}

function configShare(element) {
    var shareJson = {
        title: "唐小僧邀您参与幸运抽奖，千万福利大放送！",
        desc: $.Cutstring(element.couponabstract, 14, ".."),
        link: window.location.origin + "/html/anonymous/wap.html",
        imgUrl: element.couponimagesmall
    };
    //分享朋友圈
    $.getWechatconfig("LuckdrawShare", function () {
        // $("#enjoydiv").click();
    }, function () {
        // $("#enjoydiv").click();
    }, shareJson);
}


//替换模板
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
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