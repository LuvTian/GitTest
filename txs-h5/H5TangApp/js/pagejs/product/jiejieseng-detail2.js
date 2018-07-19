//define(["require", "exports", '../api/user', '../api/trans'], function (require, exports, user_1, trans_1) {

function getUserInfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            if (topDom.Account.customstatus < 3) {
                $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
            }
            $("#currentTotalAmont").html($.fmoney(topDom.Account.fixedbalance));
            $("#yesterdayInterest").html("+" + $.fmoney(topDom.Account.fixedyesterdayprofit));
            $("#totalInterest").html("+" + $.fmoney(topDom.Account.fixedprofitcount));
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg);
        }
    });
}

function getBidList(){
    var url = "/StoreServices.svc/user/productladderbidlist";
     $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        if (data.result) {
        }
     });
}
var account = [];
$(function () {
    var MyRegularIndexPage = (function () {
        function MyRegularIndexPage() {
            var topDom = this;
            this.LastID = "0";
            this.PageSize = 10;
            this.pageindex = 1; //从1开始
            this.type = 0; //0：持有中 1:赎回中 2:已还款
            this.pageInit();
            this.getUserInfo();
            this.switchOver();
            this.getFixedList();
            $("#loadmoreProject").click(function () {
                topDom.getHistoryFixedList(0);
            });
        }
        MyRegularIndexPage.prototype.getFixedList = function () {
            var topDom = this;
            var paramter = {
                "pageindex": pageindex,
                "type": type
            };
            Trans.getFixedList(paramter, function (data) {
                if (data.result) {
                    var productList = data.productbidlist;
                    $("#user-fix-product").append(topDom.createFixedProduct(productList, 0));
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            });
            $("#historyTitle").show();
        };
        MyRegularIndexPage.prototype.getHistoryFixedList = function (productid) {
            var topDom = this;
            var paramter = {
                "productid": productid,
                "type": 1
            };
            Trans.getFixedList(paramter, (function (data) {
                if (data.result) {
                    var productList = data.productbidlist;
                    if (productList.length == 0 && topDom.Account.fixedbalance == 0) {
                        $("#nouserfixedlist").show();
                        $(".buytimeDeposit-list").text("立即抢购");
                        $("#loadmoreProject").hide();
                        $("#userfixedlist").hide();
                    }
                    $("#historyList").append(topDom.createFixedProduct(productList, 1));
                    $("#historyList").show();
                    if (Number(productList.length) < Number(topDom.PageSize)) {
                        $('#loadmoreProject').unbind("click").css({
                            background: '#F0EFF5',
                            border: '0px'
                        }).html("没有更多投资记录了");
                    } else {
                        $('#loadmoreProject').unbind("click");
                        $('#loadmoreProject').on("click", function () {
                            topDom.getHistoryFixedList(Number(topDom.LastID));
                        });
                    }
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            }));
        };
        MyRegularIndexPage.prototype.createFixedProduct = function (productList, type) {
            var ha = [];
            var str = "累计收益";

            var topDom = this;
            $.each(productList, function (index, entry) {
                var now = new Date();
                var date = now.Format("yyyy-MM-dd");
                topDom.LastID = entry.id;
                var url = "/html/my/my-regular-detail.html?id=" + entry.id;
                if (entry.isentrust) {
                    url = "/html/my/my-regular-entrust-detail.html?id=" + entry.id;
                }

                if (entry.ismatchmoderaisingdate == true) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts11\">募集期内</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    //定期加息标签
                    if (entry.interestrate != "" || entry.interestrate != 0) {
                        ha.push('<font class="demand-img_2 reg_2">{0}</font>'.replace('{0}', $.formatInterest(entry.interestrate)));
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if ((entry.status == 5 ||
                        entry.status == 3) &&
                    !entry.cantransfer) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts11\">投资时间 " + entry.biddate + "</span></p>");
                    ha.push("<p><span class=\"ts1\">已还款</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.status == 4) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts22\">赎回中</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.cantransfer) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "<i class=\"assign_tip\">可转让</i></span><span class=\"tr ts1 ts11\">还剩" + entry.daysremaining + "天</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    if (entry.interestrate != 0 &&
                        entry.interestenddate.replace(/-/g, "/") >= date) {
                        ha.push(" <img id=\"demand-img\" class=\"pic-pre\" src=\"/css/img2.0/pre" + entry.interestrate * 100 + ".png\"/>");
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.status == 7) {
                    ha.push("<li onclick=\"javascript:window.location.href='/html/product/producttransferdetail.html?productbidid=" + entry.id + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "<i class=\"assign_tip\">转让中</i></span><span class=\"tr ts1 ts11\">还剩" + entry.daysremaining + "天</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    if (entry.interestrate != 0 &&
                        entry.interestenddate.replace(/-/g, "/") >= date) {
                        ha.push(" <img id=\"demand-img\" class=\"pic-pre\" src=\"/css/img2.0/pre" + entry.interestrate * 100 + ".png\"/>");
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.status == 8) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "<i class=\"assign_tip\">转让成功</i></span><span class=\"tr ts1 ts11\">投资时间 " + entry.biddate + "</span></p>");
                    ha.push("<p><span class=\"ts1\">已还款</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    if (entry.producttype == 3) {
                        entry.currentinterest = Number(entry.transferamount) - entry.bidamount;
                    } else if (entry.producttype == 2) {
                        entry.currentinterest = Number(entry.transferamount) - entry.bidamount + entry.haveinterest;
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else {

                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts11\">还剩" + entry.daysremaining + "天</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    //定期加息标签
                    if (entry.interestrate != "" || entry.interestrate != 0) {
                        ha.push('<font class="demand-img_2 reg_2">{0}</font>'.replace('{0}', $.formatInterest(entry.interestrate)));
                    }
                    //ha.push(" <img id=\"demand-img\" class=\"pic-pre\" src=\"/css/img2.0/pre1.png\"/>")
                    //if (entry.interestrate != "" || entry.interestrate != 0) {
                    //    ha.push(" <img id=\"demand-img\" class=\"pic-pre\" src=\"/css/img2.0/pre" + entry.interestrate * 100 + ".png\"/>")
                    //}
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                }
            });
            return ha.join('');
        };
        // MyRegularIndexPage.prototype.formatZeroMoney = function (varlue) {
        //     varlue += "";
        //     if (varlue == "0") {
        //         return "0.00";
        //     }
        //     else {
        //         return $.fmoney(varlue);
        //     }
        // };
        //------------切换选项列表
        MyRegularIndexPage.prototype.switchOver = function () {
            $.each($(".list-header li"), function (i, v) {
                $(v).click(function () {
                    type = i; //持有记录的状态
                    $(".list-header li").removeClass("on");
                    $(this).addClass("on");
                    $(".option").hide();
                    $(".option:eq(" + i + ")").show(200);
                    getFixedList();
                })
            })
        }
        return MyRegularIndexPage;
    }());
    var myRegularIndex = new MyRegularIndexPage();
});
//加载更多
var $window = $(window),
    viewHeight = $window.height(),
    contentHeight = $('body').height();
$window.on('scroll', function () {
    var scrollTop = $(this).scrollTop();
    console.log($(this))
    if (contentHeight <= viewHeight) {
        $.alertF("2")
    } else if (scrollTop + viewHeight === contentHeight) {
        //ajax请求
        $.alertF("1")
    }
})