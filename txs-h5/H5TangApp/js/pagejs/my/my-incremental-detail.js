var account = [];
var pageindex = 1;
var type = 0; //0：持有中 1:赎回中 2:已还款
var laddertitle = "";
var htype = $.getQueryStringByName("type"); //页面类型（week周周僧month月月僧season季季僧）
$(function() {
    pageinit();
    checkchoose();
});

function pageinit() {
    switch (htype) {
        case "week":
            getweekList(pageindex);
            $.UpdateTitle("我的周周僧");
            break;
        case "month":
            getmonthList(pageindex);
            $.UpdateTitle("我的月月僧");
            break;
        case "season":
            getseasonList(pageindex);
            $.UpdateTitle("我的季季僧");
            break;
    }
}

//周周僧
function getweekList(pageindex) {
    var url = "/StoreServices.svc/user/productladderbidlist";
    var data = {
        "pageindex": pageindex,
        "type": type
    };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            var bidlist = d.productbidlist;
            // if (!laddertitle || laddertitle != d.productladdermodel.laddertitle) {
            //     laddertitle = d.productladdermodel.laddertitle || "周周僧"
            //     $.UpdateTitle(laddertitle);
            // }
            $("#totalbidamount").html($.fmoney(d.productladdermodel.totalbidamount));
            $("#incomeinterest").html($.fmoney(d.productladdermodel.incomeinterest));
            $("#totalarrivalinterest").html($.fmoney(d.productladdermodel.totalarrivalinterest));
            if (bidlist.length > 0) {
                if (pageindex <= 1) {
                    $(".bidlist ul").html("");
                }
                createBidList(bidlist, type);
                $.LoanMore($(".bidlist ul").eq(type), "加载更多", "getweekList(" + (pageindex += 1) + ")");
            } else {
                $.LoanMore($(".bidlist ul").eq(type), "没有更多产品了");
            }
        }
    });
}

//月月僧
function getmonthList(pageindex) {
    var url = "/StoreServices.svc/user/productmonthladderbidlist";
    var data = {
        "pageindex": pageindex,
        "type": type
    };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            var bidlist = d.productbidlist;
            // if (!laddertitle || laddertitle != d.productladdermodel.laddertitle) {
            //     laddertitle = d.productladdermodel.laddertitle || "月月僧"
            //     $.UpdateTitle(laddertitle);
            // }
            $("#totalbidamount").html($.fmoney(d.productladdermodel.totalbidamount));
            $("#incomeinterest").html($.fmoney(d.productladdermodel.incomeinterest));
            $("#totalarrivalinterest").html($.fmoney(d.productladdermodel.totalarrivalinterest));
            if (bidlist.length > 0) {
                if (pageindex <= 1) {
                    $(".bidlist ul").html("");
                }
                createBidList(bidlist, type);
                $.LoanMore($(".bidlist ul").eq(type), "加载更多", "getmonthList(" + (pageindex += 1) + ")");
            } else {
                $.LoanMore($(".bidlist ul").eq(type), "没有更多产品了");
            }
        }
    });
}

//季季僧
function getseasonList(pageindex) {
    var url = "/StoreServices.svc/user/productseasonladderbidlist";
    var data = {
        "pageindex": pageindex,
        "type": type
    };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            var bidlist = d.productbidlist;
            // if (!laddertitle || laddertitle != d.productladdermodel.laddertitle) {
            //     laddertitle = d.productladdermodel.laddertitle || "季季僧"
            //     $.UpdateTitle(laddertitle);
            // }
            $("#totalbidamount").html($.fmoney(d.productladdermodel.totalbidamount));
            $("#incomeinterest").html($.fmoney(d.productladdermodel.incomeinterest));
            $("#totalarrivalinterest").html($.fmoney(d.productladdermodel.totalarrivalinterest));
            if (bidlist.length > 0) {
                if (pageindex <= 1) {
                    $(".bidlist ul").html("");
                }
                createBidList(bidlist, type);
                $.LoanMore($(".bidlist ul").eq(type), "加载更多", "getseasonList(" + (pageindex += 1) + ")");
            } else {
                $.LoanMore($(".bidlist ul").eq(type), "没有更多产品了");
            }
        }
    });
}

function createBidList(bidlist, type) {
    var ha = [];
    var productbidid
    $.each(bidlist, function(index, item) {
        if (type == 0) {
            ha.push('<li>');
            ha.push('<div class="padd-left" data-id=' + item.id + '>');
            var date;
            var text;
            if ((item.nextopenredeemdate == "" || item.nextopenredeemdate == null) && item.status == 2) {
                date = item.enddate;
                text = "到期日";
            } else {
                date = item.nextopenredeemdate;
                text = "最近开放日";
            }
            ha.push('<p class="name">' + $.Cutstring(item.title, 8) + '<span>' + text + ':' + date + '</span></p>');
            ha.push('<p class="amout-left">' + $.fmoney(item.bidamount) + '</p><p class="amout-right"><span>' + $.fmoney(item.currentinterest) + '</span></p>');
            ha.push('<p class="state">持有中</p><p class="state-amout">已计收益</p>');
            ha.push('</div>');
            ha.push('</li>');
        } else if (type == 1) {
            ha.push('<li>');
            ha.push('<div class="padd-left" data-id=' + item.id + '>');
            var date;
            var text;
            if (item.status == 6) {
                date = item.enddate;
                text = "到期日";
            } else {
                date = item.redeemtime;
                text = "转出申请日";
            }
            ha.push('<p class="name">' + $.Cutstring(item.title, 8) + '<span>' + text + ':' + date + '</span></p>');
            ha.push('<p class="amout-left">' + $.fmoney(item.bidamount) + '</p><p class="amout-right">持有<span>' + item.holdingsdays + '</span> 天</p>');
            ha.push('<p class="state">转出中</p><p class="state-amout">已计收益 <span>' + $.fmoney(item.currentinterest) + '</span></p>');
            ha.push('</div>');
            ha.push('</li>');
        } else {
            ha.push('<li>');
            ha.push('<div class="padd-left" data-id=' + item.id + '>');
            var date;
            var text;
            if (item.status == 3) {
                date = item.enddate;
                text = "到期日";
            } else {
                date = item.redeemtime;
                text = "转出申请日";
            }
            ha.push('<p class="name">' + $.Cutstring(item.title, 8) + '<span>' + text + ':' + date + '</span></p>');
            ha.push('<p class="amout-left">' + $.fmoney(item.bidamount) + '</p><p class="amout-right">持有<span>' + item.holdingsdays + '</span> 天</p>');
            ha.push('<p class="state">已转出</p><p class="state-amout">到账收益 <span>' + $.fmoney(item.interest) + '</span></p>');
            ha.push('</div>');
            ha.push('</li>');
        }

    });
    var html = ha.join('');
    $(".bidlist ul").eq(type).append(html);
    $(".padd-left").click(function() {
        window.location.href = "/html/product/incremental-productdetail.html?productbidid=" + $(this).data("id");
    });
}

function checkchoose() {
    $.each($(".list-header li"), function(i, v) {
        $(v).click(function() {
            type = i; //持有记录的状态
            $(".list-header li").removeClass("on");
            $(this).addClass("on");
            $(".option").hide();
            $(".option").eq(i).show(200);
            pageinit();
        })
    })
}

$(window).scroll(function(e) {
    if ($(this).scrollTop() > $(".jiejieseng-detail-top").height()) {
        $(".list-header").addClass("fix_top");
        $(".bidlist").css("paddingTop", $(".list-header").height() + "px");
    } else {
        $(".list-header").removeClass("fix_top");
        $(".bidlist").css("paddingTop", 0);
    }
})