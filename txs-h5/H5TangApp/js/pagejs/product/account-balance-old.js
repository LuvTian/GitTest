$(function () {
    var Balance = (function () {
        var product;
        var account;
        var accountResult;
        var proportion;
        var lineChartData;
        var labels = [];
        var data_pro = [];
        var data_millionProceeds = [];
        var loginCookie = $.getCookie("MadisonToken");
        var maxpronumber;
        var minpronumber;
        var maxmillionproceeds;
        var minmillionproceeds;
        function Balance() {
            var self = this;
            //切换曲线图
            $(".chart-title li").unbind("click").click(function () {
                var target = $(this).data("chart");
                $("#" + target + "-cont").removeClass("abs-hide").siblings().addClass("abs-hide");
                $("#" + target + "-title").addClass("active").siblings().removeClass("active");
                self.LoadChar(target);
            });
            //转入
            $("#btn-into").unbind("click").click(function (e) {
                window.location.href="/Html/PayCenter/user-deposit.html";
                return false;
            });
            //转出
            $("#btn-out").unbind("click").click(function () {
                window.location.href="/Html/PayCenter/user-withdraw.html";
                return false;
            });
            //立即投资，引导登录
            $("#btn-invest").unbind("click").click(function () {
                $.Loginlink();
            });
            if (loginCookie) {
                $("#btn-into-out").removeClass("hide");
                this.GetUserInfo();
            }
            else {
                $("#btn-invest").removeClass("hide");
                $(".on-line").hide();
                $(".off-line").removeClass("hide");
                this.GetCurrentProduct();
            }
            var detailname = $.getQueryStringByName("detailname");
            !!detailname && $.UpdateTitle(decodeURIComponent(detailname));
            //var Notice1 = new Notice();
        }
        Balance.prototype.GetUserInfo = function () {
            var self = this;
            var url = "/StoreServices.svc/user/info";
            $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                if (data.result) {
                    account = data.accountinfo;
                    accountResult = data;
                    var issignmoneyboxandhtffund = account.issignmoneyboxandhtffund;//是否签订存钱罐协议和汇添富基金协议
                    var monkyesterdayprofit = account.monkyesterdayprofit;//僧财宝昨日收益
                    var monkprofitcount = account.monkprofitcount;//僧财宝累计收益	
                    var basicbalance = account.basicbalance;//账户余额
                    $("#acc-investing-amount").text($.fmoney(basicbalance));
                    $("#yesterday").text("+" + $.fmoney(monkyesterdayprofit));
                    $("#total").text("+" + $.fmoney(monkprofitcount));
                    //如果没有签订协议或者余额为0，不能转出
                    if (!issignmoneyboxandhtffund || !basicbalance) {
                        $("#btn-out").unbind("click").addClass("colorb9");
                    }
                    //账单链接
                    $("#acc-investing-amount").click(function(){
                        window.location.href="/html/product/account-b-bill.html";
                    });
                    //收益账单
                    $(".acc-yesterday,.acc-total").click(function(){
                        window.location.href="/html/product/account-b-bill.html?type=7";
                    });
                }
                self.GetCurrentProduct();
            });
        }

        Balance.prototype.GetCurrentProduct = function () {
            var self = this;
            var url = "/StoreServices.svc/product/monkitem";
            $.AkmiiAjaxPost(url, { "withlinechart": true }, true).then(function (data) {
                if (data.result) {
                    maxpronumber = data.proportion.maxpronumber;
                    minpronumber = data.proportion.minpronumber;
                    maxmillionproceeds = data.proportion.maxmillionproceeds;
                    minmillionproceeds = data.proportion.minmillionproceeds;
                    product = data.productinfo;
                    proportion = data.proportion;
                    //七日年化
                    $("#char-avgpronumber").html($.fmoney(proportion.avgpronumber));
                    $("#char-avgmillionproceeds").html($.fmoney(proportion.lastmillionproceeds, 4));
                    if (labels.length <= 0) {
                        self.LoadChar("chart1");
                    };
                };
            });
        }

        /**加载折线图 */
        Balance.prototype.LoadChar = function (chart) {
            if (!(labels & data_pro & data_millionProceeds & labels.length > 0 & data_pro.length > 0 & data_millionProceeds.length > 0)) {
                labels = [];
                data_pro = [];
                data_millionProceeds = [];
                $.each(proportion.proportionlist, function (index, item) {
                    labels.push(item.ProTime);
                    data_pro.push(item.ProNumber);
                    data_millionProceeds.push(item.MillionProceeds);
                });
            }
            lineChartData = {
                labels: labels,
                datasets: [
                    {
                        fillColor: "rgba(255,223,209,1)",
                        strokeColor: "rgba(255,255,255,1)",
                        data: chart == "chart1" ? data_pro : data_millionProceeds,
                    }]
            };

            var ctx = document.getElementById(chart).getContext("2d");
            if (chart == "chart1") {
                new Chart(ctx).Line(lineChartData, {
                    responsive: true,
                    scaleShowHorizontalLines: false,
                    scaleShowVerticalLines: false,
                    scaleOverride: true,
                    scaleSteps: 5,
                    scaleStepWidth: ((maxpronumber - minpronumber) / 5).toFixed(2),
                    scaleStartValue: minpronumber
                    //scaleBeginAtZero:true
                });
            }
            else {
                new Chart(ctx).Line(lineChartData, {
                    responsive: true,
                    scaleLabel: "<%=value%>",
                    scaleShowHorizontalLines: false,
                    scaleShowVerticalLines: false,
                    scaleOverride: true,
                    scaleSteps: 5,
                    scaleStepWidth: ((maxmillionproceeds - minmillionproceeds) / 5).toFixed(4),
                    scaleStartValue: minmillionproceeds
                    //scaleBeginAtZero: true
                });
            }
        }
        return Balance;
    }());
    var balance = new Balance();
});
