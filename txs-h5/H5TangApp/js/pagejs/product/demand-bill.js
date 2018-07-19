//define(["require", "exports", '../api/trans'], function (require, exports, trans_1) {
$(function () {
    "use strict";
    var Trans = {};
    Trans.getHistory = function (request, success, needLoder, error, complete) {
        var url = "/StoreServices.svc/trans/history";
        $.AkmiiAjaxPost(url, request, !needLoder).then(success);
    }
    var TransHistoryClass = (function () {
        function TransHistoryClass() {
            var topDom = this;
            topDom.TransType = Number($.getQueryStringByName("type"));
            topDom.getHistory("0", topDom.TransType);
            $("#gozzb").click(function () {
                window.location.href = "/html/product/index-demand.html";
            });
            $(".zzb-nav").on("click", ".tab-title", function () {
                topDom.TransType = $(this).data("type");
                topDom.switchtab(topDom.TransType);
                if (!$("#panel" + topDom.TransType).children(".translist").html()) {
                    topDom.getHistory("0", Number(topDom.TransType));
                }
            });
            $(window).on('hashchange', function () {
                if (window.location.hash.length <= 0) {
                    $("#contract").hide();
                    $("#bill-list").show().siblings().hide();
                }
            });
        }
        ;
        TransHistoryClass.prototype.getHistory = function (lastId, type) {
            var topDom = this;
            topDom.switchtab(topDom.TransType);
            var data = {
                lastid: lastId,
                transtype: type,
                accounttype: 3
            };
            Trans.getHistory(data, function (data) {
                if (data.result) {
                    var tranList = data.transhistorys;
                    $.each(tranList, function (index, entry) {
                        $("#panel" + type + " .translist").append(topDom.initTranItem(entry, type));
                        topDom.LastId = entry.id;
                    });
                    if (tranList.length > 9) {
                        $.LoadMore($("#panel" + type + " > div"), '加载更多', function () {
                            topDom.getHistory(topDom.LastId, type);
                        });
                    }
                    else {
                        if (tranList.length <= 0 && Number(type) == 3) {
                            if (!$("#panel" + topDom.TransType).children(".translist").html()) {
                                $("#notinvest").show();
                                return;
                            }
                        }
                        else {
                            $("#notinvest").hide();
                        }
                        $.LoanMore($("#panel" + type + " > div"), "没有更多交易记录了");
                    }
                }
                else if (data.errorcode == 'missing_parameter_accountid') {
                    $.Loginlink();
                }
                else {
                    $.alertF(data.errormsg);
                }
            });
        };
        ;
        TransHistoryClass.prototype.switchtab = function (type) {
            $(".zzb-nav .tab-title").removeClass("active");
            $("#title" + type).addClass("active");
            $(".tabs-content .content").removeClass("active");
            $("#panel" + type).addClass("active");
        };
        ;
        TransHistoryClass.prototype.initTranItem = function (tranItem, type) {
            var h = [];
            var direction = "";
            var color = "";
            var sign = "";
            var detatil = "";
            var productName = "";
            var initDom = this;
            if (tranItem.accountdetailtype == 9) {
                sign = '<span class="wxicon dj-icon"></span>';
                color = "gray";
                detatil = tranItem.detailtext;
                productName = tranItem.memo;
            }
            else if (tranItem.accountdetailtype == 91) {
                sign = '<span class="wxicon dj-icon1"></span>';
                color = "gray";
                detatil = tranItem.detailtext;
                productName = tranItem.memo;
            }
            else if (tranItem.direction) {
                sign = "+";
                color = "red";
                detatil = initDom.changetext(tranItem);
            }
            else {
                sign = '-';
                color = "green";
                detatil = initDom.changetext(tranItem);
            }
            h.push('<article class="billdetail bg-white bt"');
            h.push(' data-id="' + tranItem.id + '"');
            h.push(' data-title="' + tranItem.detailtext + '"');
            h.push(' data-accountdetailtype="' + tranItem.accountdetailtype + '"');
            h.push(' data-direction="' + (tranItem.direction == true ? '1' : '0') + '"');
            h.push(' data-amount="' + $.fmoney(tranItem.tranamount) + '"');
            h.push(' data-detail="' + detatil + '"');
            h.push(' data-time="' + initDom.dateFormat(tranItem.created) + '"');
            h.push(' data-balance="' + $.fmoney(tranItem.afterbalance) + '"');
            h.push(' data-transtype="' + initDom.TransType + '"');
            if (productName) {
                h.push(' data-remark="' + productName + '"');
            }
            h.push('><div class="small-5 left">');
            h.push('<p class="oh">' + tranItem.detailtext + '</p><span class="gray">' + initDom.dateFormat(tranItem.created) + '</span></div><div class="small-7 left text-right">');
            if (initDom.TransType == 0) {
                h.push('<p class="' + color + ' transamount">' + sign + '' + $.fmoney(tranItem.tranamount) + '</p>');
            }
            else {
                h.push('<p class="' + color + ' transamount">' + sign + '' + $.fmoney(tranItem.tranamount) + '</p>');
            }
            h.push('</article>');
            var result = $(h.join(''));
            result.click(function () {
                initDom.AccountDetailType = $(this).data("accountdetailtype");
                direction = $(this).data("direction");
                if (~~initDom.AccountDetailType == 9) {
                    sign = '<span class="wxicon dj-icon"></span>';
                    color = "gray";
                }
                else if (~~initDom.AccountDetailType == 91) {
                    sign = '<span class="wxicon dj-icon1"></span>';
                    color = "gray";
                }
                else if (~~direction) {
                    sign = "+";
                    color = "red";
                }
                else {
                    sign = '-';
                    color = "green";
                }
                window.location.hash = "#billdetail";
                if ($(initDom).data("remark") && $(this).data("remark").length > 0) {
                    $("#remark").text($(this).data("remark")).parent().show();
                }
                else {
                    $("#remark").parent().hide();
                }
                if ($(this).data("transtype") == "0") {
                    $("#li-balance").show();
                }
                else {
                    $("#li-balance").hide();
                }
                $("#amount").html(sign + $(this).data("amount")).removeClass("red green gray").addClass(color);
                $("#detail").html($(this).data("detail"));
                $("#time").html($(this).data("time"));
                $("#balance").html($(this).data("balance"));
                $("#id").html($(this).data("id"));
                $("#bill-list").hide().siblings().not("#notinvest").show();
            });
            return result;
        };
        ;
        TransHistoryClass.prototype.changetext = function (tranItem) {
            switch (tranItem.detailtext) {
                case "投资":
                    if (tranItem.direction) {
                        return "余额转入";
                    }
                    return "转入定期";
                case "赎回":
                    return "余额转出";
                default:
                    return tranItem.detailtext;
            }
        };
        ;
        TransHistoryClass.prototype.dateFormat = function (date) {
            date = new Date(date);
            var todaymin = new Date();
            todaymin = new Date(todaymin.Format("yyyy/MM/dd 00:00:0000"));
            var todaymax = new Date((todaymin.getTime() / 1000 + 86400) * 1000);
            if (date > todaymin && date < todaymax) {
                return "今天" + date.Format("HH:mm");
            }
            return date.Format("yyyy-MM-dd HH:mm");
        };
        return TransHistoryClass;
    }());
    //exports.TransHistoryClass = TransHistoryClass;
    var TransHistory = new TransHistoryClass();
});
