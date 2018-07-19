$(function () {

    TRANS_HISTORY = function () {
        //apiUrl_prefix = "http://192.168.3.30:8991"; //联调地址
        var depositbtntext = "",
            withdrawbtntext = "",
            accountbalance = "",
            lastid = "0",
            p2plastid = "0",
            qjslastid = "0",
            trans_history_api = apiUrl_prefix + "/txs/trans/transrecordlist",
            //记录页数
            pageIndexList = {
                pageOf_transType0: 1,
                pageOf_transType1: 1,
                pageOf_transType2: 1,
                pageOf_transType3: 1,
                pageOf_transType4: 1,
            }

        function init() {
            $.sengcaibaobtntext(function (d) {
                depositbtntext = d[0];
                withdrawbtntext = d[1];
                accountbalance = d[3]
                $(".accountbalance").html(accountbalance);
                $("#deposit").html(depositbtntext);
                $("#withdraw").html(withdrawbtntext);
            });
            var transType = 0;
            if ($.getQueryStringByName("type")) {
                transType = $.getQueryStringByName("type");
            }
            getHistory(transType);
            $(".tab-title").removeClass("active");
            $(".tab-title:eq(" + transType + ")").addClass("active");
            $(".tabs-content .content").removeClass("active");
            $(".tabs-content .content:eq(" + transType + ")").addClass("active");

            $('.content').on('toggled', function (event, tab) {
                if (!tab.children(".translist").html()) {
                    getHistory(tab.attr("data-transtype"));
                }
            });
        }


        //僧财宝收益的第一条，需要超链接
        var savingpotlink = false;

        function getHistory(type) {
            var url = trans_history_api;
            var pageIndexKey = "pageOf_transType" + type
            var data = {
                pageIndex: pageIndexList[pageIndexKey],
                transType: Number(type),
            };
            $.AkmiiAjaxPost(url, data, true).then(function (data) {
                if (data.code==200) {
                    pageIndexList[pageIndexKey]++;
                    var tranList = data.data;
                    $.each(tranList, function (index, entry) {
                        //交易记录列表
                        $("#panel" + type + " .translist").append(initTranItem(entry, type, entry.datasource));
                    });
                    if (tranList.length > 0) {
                        $.LoanMore($("#panel" + type + " .translist"), null, "trans_history.getHistory(" + type + ")");
                    } else {
                        $.LoanMore($("#panel" + type + " .translist"), "没有更多交易记录了");
                    }
                } else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                    return;
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };

        function initTranItem(tranItem, type, datasource) {
            //僧财宝收益超链
            if (type == 0 && !savingpotlink && tranItem.detailvalue == "1024") {
                savingpotlink = true;
                return savingpotHtml(tranItem);
            }
            var html = [];
            html.push('<article class="bg-white borb">');
            var productName = "";
            if (type == 3) {
                productName = "<span>&nbsp;-&nbsp;" + tranItem.productname + "</span>";
            }
            if (tranItem.detailtext == "银行卡购买") {
                tranItem.detailtext = "银行卡购买" + depositbtntext + ""
            }
            html.push('<div class="small-7 left"><p class="oh">' + tranItem.detailtext + productName + '</p><span class="gray">' + tranItem.created + '</span></div>');

            html.push("<div class=\"small-5 left text-right\"><p class=\"red" + (tranItem.direction ? "\">+" : " green\">-") + $.fmoney(tranItem.tranamount) + "</p>");
            if (datasource == 0) {
                if (type == 0) {
                    html.push("<span class=\"gray fz\">余额：" + $.fmoney(tranItem.afterbalance) + "</span></div>");
                } else if (type == 1 || type == 2) {
                    html.push("<span class=\"gray fz\">" + tranItem.statustext + "</span></div>");
                }
            } else if (datasource == 10) {
                // if (type == 1 || type == 2) {
                //     html.push("<span class=\"gray fz\">" + tranItem.statustext + "</span></div>");
                // }
            } else if (datasource == 20){
                html.push("<span class=\"gray fz\">" + (tranItem.statustext||'') + "</span></div>");
            }
            html.push('</article>');
            return html.join("");
        };

        function savingpotHtml(tranItem) {
            var html = [];
            html.push('<article class="bg-white borb">');
            html.push('<div class="small-7 left">');
            html.push('<p class="oh" style="color:#4198F6"><a href="/html/anonymous/savingpot-help.html" style="color:#4198F6"><z class="accountbalance">' + accountbalance + '</z>收益？</a></p>');
            html.push('<span class="gray" style="font-size:1.2rem;">' + tranItem.created + '</span>');
            html.push('</div>');
            html.push('<div class="small-5 left text-right">');
            html.push('<p class="red line-h ">+' + $.fmoney(tranItem.tranamount) + '</p>');
            // html.push('<span class="gray">余额：' + $.fmoney(tranItem.afterbalance) + '</span>');
            html.push('</div>');
            html.push('</article>');
            return html.join("");
        }

        return {
            init: init,
            getHistory: getHistory
        }
    }
    trans_history = new TRANS_HISTORY();
    trans_history.init();
});
