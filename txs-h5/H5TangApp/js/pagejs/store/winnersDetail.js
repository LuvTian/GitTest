var activitytype=$.getQueryStringByName("activitytype") || 3;

$("#tab_winners_menu li").click(function () {
    $("#tab_winners_menu li").removeClass("current");
    var i = $(this).addClass("current").index();
    $(".tab_contents").hide().eq(i).show();
})

$("#tab_winners_menu li:first").trigger("click");




function getWinnersList() {
    var page = 1;
    var noMoreData = false;
    return function () {
        if (!noMoreData) {
            $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getactivitywinnerslist", {
                activitytype: activitytype,
                pageindex: page,
                pagesize: 10
            }, true).then(function (data) {
                if (data.result) {
                    var winner = renderTemplate('<li><span class="prize">{0} 获得{1}</span><span class="dateTime">{2}</span></li>');
                    if (data.activitywinnersinfomodel.length > 0) {
                        winnersList = data.activitywinnersinfomodel;
                        var winnersContainer = $(".winnersContainer ul");
                        for (var i = 0; i < winnersList.length; i++) {
                            var winnerInfo = winnersList[i];
                            winnersContainer.append($(winner(winnerInfo.username, winnerInfo.couponactivityname, winnerInfo.gettime)));
                        }
                    } else {
                        $(".winnersContainer .loadMore").text("没有更多数据").off("click");
                    }
                } else {
                    $.alertF(data.errormsg);
                }
            })
            page++;
        }
    }
}

function getMyPrizesList() {
    var page = 1;
    var noMoreData = false;
    return function () {
        if (!noMoreData) {
            $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/getmywinninginfolist", {
                activitytype: activitytype,
                pageindex: page,
                pagesize: 10
            }, true).then(function (data) {
                if (data.result) {
                    var winner = renderTemplate('<li><span class="prize">获得{0}</span><span class="dateTime">{1}</span></li>');
                    if (data.mywinninginfos.length > 0) {
                        winnersList = data.mywinninginfos;
                        var winnersContainer = $(".myPrizeContainer ul");
                        for (var i = 0; i < winnersList.length; i++) {
                            var winnerInfo = winnersList[i];
                            winnersContainer.append($(winner(winnerInfo.couponactivityname, winnerInfo.wintime)));
                        }
                    } else {
                        $(".myPrizeContainer .loadMore").text("没有更多数据");
                        noMoreData = true;
                    }
                } else {
                    $.alertF(data.errormsg);
                }
            })
            page++;
        }
    }
}


function loadMoreData(type) {
    switch (type) {
        case 0:
            loadMoreWinnersList();
            break;
        case 1:
            loadMoreMyPrizesList();
            break;
    }
}

function renderTemplate(tpl) {
    return function () {
        return tpl.format.apply(tpl, arguments);
    }
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


var loadMoreWinnersList = getWinnersList();
loadMoreWinnersList();
var loadMoreMyPrizesList = getMyPrizesList();
loadMoreMyPrizesList();