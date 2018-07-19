$(function() {
    "use strict";
    var User = {};
    var Trans = {};
    User.getUserInfo = function(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/user/info";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    Trans.getFixedList = function(request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/trans/productbidlist";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    var MyRegularIndexPage = (function() {
        function MyRegularIndexPage() {
            this.LastID = "0";
            this.PageSize = 10;
            this.pageInit();
            this.getUserInfo();
            this.getFixedList(0);
            var topDom = this;
            $("#loadmoreProject").click(function() {
                topDom.getHistoryFixedList(0);
            });
        }
        MyRegularIndexPage.prototype.pageInit = function() {
            $("#historyTitle").hide();
            $("historyList").hide();
        };
        MyRegularIndexPage.prototype.getUserInfo = function() {
            var topDom = this;
            User.getUserInfo({}, function(data) {
                if (data.result) {
                    topDom.Account = data.accountinfo;
                    // if (topDom.Account.fixedbalance == 0) {
                    //     topDom.getHistoryFixedList(0);
                    // }
                    $.CheckAccountCustomStatusBeforeNext(data.accountinfo);
                    // if (topDom.Account.customstatus < 2) {
                    //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                    // }
                    // if (topDom.Account.customstatus < 3) {
                    //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
                    //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                    //     });
                    // }
                    $("#currentTotalAmont").html(topDom.formatZeroMoney(topDom.Account.fixedbalance));
                    $("#yesterdayInterest").html("+" + topDom.formatZeroMoney(topDom.Account.fixedyesterdayprofit));
                    $("#totalInterest").html("+" + topDom.formatZeroMoney(topDom.Account.fixedprofitcount));
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyRegularIndexPage.prototype.getFixedList = function(productid) {
            var topDom = this;
            var paramter = {
                "productid": productid,
                "type": 0,
                "isshowreservation": 1
            };
            Trans.getFixedList(paramter, function(data) {
                if (data.result) {
                    var productList = data.productbidlist;
                    if (productList.length == 0) {
                        topDom.getHistoryFixedList(0);
                    }
                    $("#user-fix-product").append(topDom.createFixedProduct(productList, 0));
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            });
            $("#historyTitle").show();
        };
        MyRegularIndexPage.prototype.getHistoryFixedList = function(productid) {
            var topDom = this;
            var paramter = {
                "productid": productid,
                "type": 1
            };
            Trans.getFixedList(paramter, (function(data) {
                if (data.result) {
                    var productList = data.productbidlist;
                    if (productList.length == 0) {
                        $("#nouserfixedlist").show();
                        $(".buytimeDeposit-list").text("立即抢购");
                        $("#loadmoreProject").hide();
                        $("#userfixedlist").hide();
                    }
                    $("#historyList").append(topDom.createFixedProduct(productList, 1));
                    $("#historyList").show();
                    if (Number(productList.length) < Number(topDom.PageSize)) {
                        $('#loadmoreProject').unbind("click").css({ border: '0px' }).html("没有更多投资记录了");
                    } else {
                        $('#loadmoreProject').unbind("click");
                        $('#loadmoreProject').on("click", function() {
                            topDom.getHistoryFixedList(topDom.LastID);
                        });
                    }
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                } else {
                    $.alertF(data.errormsg);
                }
            }));
        };
        MyRegularIndexPage.prototype.createFixedProduct = function(productList, type) {
            var ha = [];
            var str = "累计收益(元)";

            var topDom = this;
            $.each(productList, function(index, entry) {
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
                    ha.push("<p><span class=\"ts1\">投资金额</span><span class=\"tr ts1\">" + str + "  </span></p>");
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
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts11\">交易时间 " + entry.biddate + "</span></p>");
                    ha.push("<p><span class=\"ts1\">已还款</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.status == 4) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts22 apitred\">赎回中</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额(元)</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.cantransfer) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "<i class=\"assign_tip\">可转让</i></span><span class=\"tr ts1 ts11\">剩余" + entry.daysremaining + "天</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额(元)</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    // if (entry.interestrate != 0 &&
                    //     entry.interestenddate.replace(/-/g, "/") >= date) {
                    //     ha.push(" <img id=\"demand-img\" class=\"pic-pre\" src=\"" + $.resurl() + "/css/img2.0/pre" + entry.interestrate + ".png\"/>");
                    // }
                    //定期加息标签
                    if (entry.interestrate != "" || entry.interestrate != 0) {
                        ha.push('<font class="demand-img_2 reg_2">{0}</font>'.replace('{0}', $.formatInterest(entry.interestrate)));
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.status == 7) {
                    ha.push("<li onclick=\"javascript:window.location.href='/html/product/producttransferdetail.html?productbidid=" + entry.id + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "<i class=\"assign_tip\">转让中</i></span><span class=\"tr ts1 ts11\">剩余" + entry.daysremaining + "天</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额(元)</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    // if (entry.interestrate != 0 &&
                    //     entry.interestenddate.replace(/-/g, "/") >= date) {
                    //     ha.push(" <img id=\"demand-img\" class=\"pic-pre\" src=\"" + $.resurl() + "/css/img2.0/pre" + entry.interestrate + ".png\"/>");
                    // }
                    //定期加息标签
                    if (entry.interestrate != "" || entry.interestrate != 0) {
                        ha.push('<font class="demand-img_2 reg_2">{0}</font>'.replace('{0}', $.formatInterest(entry.interestrate)));
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.status == 8) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "<i class=\"assign_tip\">转让成功</i></span><span class=\"tr ts1 ts11\">交易时间 " + entry.biddate + "</span></p>");
                    ha.push("<p><span class=\"ts1\">已还款</span><span class=\"tr ts1\">" + str + "  </span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                    if (entry.producttype == 3) {
                        entry.currentinterest = Number(entry.transferamount) - entry.bidamount;
                    } else if (entry.producttype == 2) {
                        entry.currentinterest = Number(entry.transferamount) - entry.bidamount + entry.haveinterest;
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else if (entry.reservationbidstatus == 1) {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span>" + entry.title + "</span><span class=\"tr ts1 ts11 apitred\">已预约</span></p>");
                    ha.push("<p><span class=\"ts1\">预约金额(元)</span><span class=\"tr ts1\">预计成交时间</span></p>");
                    ha.push("<p><span>" + $.fmoney(entry.bidamount) + "");
                     //定期加息标签
                    if (entry.interestrate != "" || entry.interestrate != 0) {
                        ha.push('<font class="demand-img_2 reg_2">{0}</font>'.replace('{0}', $.formatInterest(entry.interestrate)));
                    }
                    ha.push("</span><span class=\"tr ts33\">" + $.fmoney(entry.currentinterest) + "</span></p>");
                    ha.push("</li>");
                } else {
                    ha.push("<li onclick=\"javascript:window.location.href='" + url + "'\">");
                    ha.push("<p><span class=\"col1\">" + entry.title + "</span><span class=\"tr ts1 ts11\">剩余" + entry.daysremaining + "天</span></p>");
                    ha.push("<p><span class=\"ts1\">在投金额(元)</span><span class=\"tr ts1\">" + str + "  </span></p>");
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
        MyRegularIndexPage.prototype.formatZeroMoney = function(varlue) {
            varlue += "";
            if (varlue == "0") {
                return "0.00";
            } else {
                return $.fmoney(varlue);
            }
        };
        return MyRegularIndexPage;
    }());
    var myRegularIndex = new MyRegularIndexPage();
});