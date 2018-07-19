//银行公告
var Notice = (function (callback) {
    var _currentid = "";
    var _title = "";
    var _content = "";
    var _list = [];
    var flag = false;
    var firstRoll = true;
    var rollHeight = "";

    function Notice(callback) {
        InsertHtml();
        var self = this;
        //关闭提示框
        $("#notice-ok").unbind("click").click(function () {
            self.closeAlert();
        });
        //关闭消息
        $(".notice-wrap .close").unbind("click").click(function () {
            self.close();
            return false;
        });
        //查看详情
        $("#notice-wrap #content").delegate("p", "click", function (e) {
            self.showDetail(e);
        });
        this.getData(callback);
    }
    //获取数据
    Notice.prototype.getData = function (callback) {
        var self = this;
        var url = "/StoreServices.svc/user/getnoticeinfolist";
        $.txsAjaxLoading();
        $.AkmiiAjaxPost(url, {}, true).done(function (data) {
            if (data.result) {
                var list = data.banknoticeinfolist;
                if (list && list.length > 0) {
                    var html = self.sort(list);
                    if (html) {
                        $(".notice-wrap .content").html(html);
                        $(".notice-wrap").show();
                        if (_list.length > 1) {
                            rollHeight = $("#content p").eq(0).height();
                            self.roll();
                        }
                        callback && callback(list.length);
                        return;
                    }
                }
            }
            callback && callback(0);
        }).fail(function () {
            callback && callback(0);
        }).always(function () {
            $.txsHideAjaxLoading();
        });
    };
    //顺序重排+过滤已读
    Notice.prototype.sort = function (list) {
        var self = this;
        var id = "";
        var history = $.getLS('history-notice') || "";
        _list = list.filter(function (item, index) {
            id = item.noticeid;
            var index = history.indexOf(id);
            if (index == -1) {
                return true;
            }
            return false;
        });
        var html = _list.map(function (item, index) {
            return "<p data-bankname=" + item.bankname + " data-noticeid=" + item.noticeid + " data-noticetitle=" + item.noticetitle + " data-noticecontent=" + item.noticecontent + " data-recoverytime=" + item.recoverytime + ">" + item.noticetitle + "</p>";
        });
        return html.join('');

    };
    //上下滚动
    Notice.prototype.roll = function () {
        flag = true; //作用，多个对象的动画会产生多个回调
        var self = this;
        var rollH = ~~rollHeight;
        if (firstRoll) {
            firstRoll = false;
            setTimeout(function () {
                self.roll();
            }, 3000);
        } else {
            $("#content p").animate({
                top: -rollH
            }, 1000, function () {
                if (flag) {
                    flag = false;
                    var firstarr = _list.shift();
                    _list.push(firstarr);
                    var html = self.sort(_list);
                    $(".notice-wrap .content").html(html);
                    $("#content p").css({
                        top: "0px"
                    });
                    setTimeout(function () {
                        self.roll();
                    }, 3000);
                }
            });
        }
    };
    Notice.prototype.check = function () {
        var history = $.getLS('history-notice') || "";
        var index = history.indexOf(_currentid);
        return index == -1;
    };
    //关闭
    Notice.prototype.close = function () {
        $(".notice-wrap").hide();
        var history_notice = $.getLS('history-notice') || "";
        var arr = history_notice.split(',');
        //限制存储条数，50条左右
        arr = arr.reverse().filter(function (item, index) {
            if (index > 50) {
                return false
            }
            return true;
        }).reverse();
        _list.forEach(function (item, index) {
            var id = item.noticeid;
            if (id && id != "0") {
                if (arr.indexOf(id) == -1) {
                    arr.push(id);
                    $.setLS('history-notice', arr.join(','));
                }
            }
        });
        return;
    };
    //显示公告详情
    Notice.prototype.showDetail = function (e) {
            $("#notice-alert-title").html($(e.target).data("noticetitle"));
            $("#notice-alert-content").html($(e.target).data("noticecontent"));
            $("#notice-alert").removeClass("display-none");
            $("#notice-alert-bg").removeClass("display-none");
        },
        //关闭公告详情
        Notice.prototype.closeAlert = function () {
            $("#notice-alert").addClass("display-none");
            $("#notice-alert-bg").addClass("display-none");
        }
    return Notice;
}());

//支付通道维护
var BankMaintain = (function () {
    var _isMaintain = false;
    var _canChange = false;
    var _noticeContent = "";
    var _noticeTitle = "";

    function BankMaintain() {
        InsertHtml_banklimit();
        InsertHtml();
        $(".js-model-close").click(function () {
            $("#txs-model-bg").hide();
            $("#txs-model").hide();
        });
        $(".chance-bank").click(function () {
            window.location.href = "/html/my/mybankcard.html";
        });
    }

    //获取银行维护信息，是独立于其他接口的，但是必须有loading效果，让用户等待，
    //用通用的loading效果有个bug，loading出现时会隐藏$.alertF,导致提示消息无法显示
    //所以直接调用 $.txsAjaxLoading(); 此方法没有副作用。
    BankMaintain.prototype.getData = function (bankname) {
        var dtd = $.Deferred();
        var self = this;
        $.txsAjaxLoading();
        var url = "/StoreServices.svc/user/getnoticeinfobybankname";
        $.AkmiiAjaxPost(url, {
                "bankname": bankname
            }, true)
            .done(function (data) {
                if (data.result) {
                    var info = data.noticeinfomodel;
                    if (info) {
                        _isMaintain = true;
                        _canChange = info.iscanchangebankcard;
                        _noticeContent = info.noticecontent;
                        _noticeTitle = info.noticetitle;
                        dtd.resolve();
                    }
                }
            })
            .fail(function () {
                dtd.reject();
            })
            .always(function () {
                $.txsHideAjaxLoading();
            });
        return dtd;
    }
    //检查银行是否在维护中
    BankMaintain.prototype.checkMaintain = function () {
        if (_isMaintain) {
            $(".model-title").html(_noticeTitle);
            $(".model-content").html(_noticeContent + (_canChange ? "<br/>您可以换卡" : ""));
            if (_canChange) {
                $(".btn-double").show();
                $(".btn-signle").hide();
            } else {
                $(".btn-double").hide();
                $(".btn-signle").show();
            }
            $("#txs-model-bg").show();
            $("#txs-model").show();
            return false;
        }
        return true;
    }
    //绑卡时银行维护
    BankMaintain.prototype.bindCardMaintain = function () {
        $(".model-title").html(_noticeTitle);
        $(".model-content").html(_noticeContent + "<br/>您可以换卡");
        $(".btn-double").show();
        $(".btn-signle").hide();
        $("#txs-model-bg").show();
        $("#txs-model").show();
    }

    return BankMaintain;
}());

//银行限额列表
var BankLimit = (function () {
    function BankLimit() {
        this.getData();
        this.getTipsData();
    }
    BankLimit.prototype.getData = function () {
        var self = this;
        var url = "/StoreServices.svc/user/getbankrechargelimitlist";
        $.txsAjaxLoading();
        $.AkmiiAjaxPost(url, {}, true)
            .done(function (data) {
                if (data.result) {
                    var list = data.bankrechargelimitinfolist;
                    if (list) {
                        var template = '<div class="bg-white bt"><div class="small-4 fl tl"><img src="'+$.resurl()+'/css/img2.0/bank-{bankcode}.png" class="limit-bank-logo">{bankname}</div><div class="small-8 fl tr gray-font">{bankrecharge}</div></div>';
                        $("#bank-limite-contain").html(self.toHtml(list, template));
                    }
                }
            })
            .fail(function () {
                dtd.reject();
            }).always(function () {
                $.txsHideAjaxLoading();
            });
    }
    // 添加银行提示接口
    BankLimit.prototype.getTipsData = function () {
        var self = this;
        var url = "/StoreServices.svc/user/getbankpromptlist";
        $.AkmiiAjaxPost(url, {}, true)
            .done(function (data) {
                if (data.result) {
                    var list = data.bankpromptinfolist;
                    if (list) {
                        var htmlstr = list.map(function (item, index) {
                            return item + "<br />";
                        }).join("");
                        $(".bank-tip-ques").html(htmlstr);
                    }
                }
            })
            .fail(function () {
                dtd.reject();
            })
    }
    BankLimit.prototype.toHtml = function (list, template) {
        var self = this;
        return list.map(function (item, index) {
            var bankname = item.bankname;
            var bankcode = item.bankcode.toLowerCase();
            var rechargesingle = item.rechargesingle;
            var rechargedaily = item.rechargedaily;
            var rechargemonthly = item.rechargemonthly;
            var recharge = "单笔" + self.moneyFormat(rechargesingle) + "/每日" + self.moneyFormat(rechargedaily) + (~~rechargemonthly ? "/每月" + self.moneyFormat(rechargemonthly) : "");
            var html = template.replace('{bankcode}', bankcode).replace('{bankname}', bankname).replace('{bankrecharge}', recharge);;
            return html;
        }).join('');
    }
    BankLimit.prototype.moneyFormat = function (money) {
        var _money = ~~money;
        if (_money < 10000) {
            return (_money / 1000) + "千";
        } else {
            return (_money / 10000) + "万";
        }
    }
    return BankLimit;
}());

/**
 * 插入弹框html
 * 
 */
function InsertHtml() {
    var h = [];
    if ($("#notice-alert").length == 0) {
        h.push('<article id="notice-alert" class="_pop poplayer fund-poplayer text-center notice-alert display-none">');
        h.push('<article class="poplayer-content text-center">');
        h.push('<p class="notice-alert-title" id="notice-alert-title"></p>');
        h.push('<p id="notice-alert-content"></p>');
        h.push('</article>');
        h.push('<article class="okbtn row" id="notice-ok">');
        h.push('<div class="left small-12">');
        h.push('<span class="fpbutton">确定</span>');
        h.push('</div>');
        h.push('</article>');
        h.push('</article>');
        h.push('<article id="notice-alert-bg" class="_alert_pop bg-black notice-alert-bg display-none"></article>');
        var result = $(h.join(''));
        $("body").append(result);
    }
}

/**
 * 支付绑卡时银行维护提示，插入弹框html
 * 
 */
function InsertHtml_banklimit() {
    var h = [];
    if ($("#txs-model").length == 0) {
        h.push('<article id="txs-model" class="txs-model" style="display:none">');
        h.push('<img class="model-close js-model-close" src="'+$.resurl()+'/css/img2.0/close.png" />');
        h.push('<article class="model-header">');
        h.push('    <p class="model-title"></p>');
        h.push('    <p class="model-content"></p>');
        h.push('</article>');
        h.push('<article class="model-img">');
        h.push('    <img src="'+$.resurl()+'/css/img2.0/notice-1.png" />');
        h.push('</article>');
        h.push('<article class="btn-double" style="display:none">');
        h.push('    <div class="model-btn">');
        h.push('        <div class="cancel js-model-close">');
        h.push('            <span>取消</span>');
        h.push('        </div>');
        h.push('        <div class="btnok chance-bank">');
        h.push('            <span>换张卡</span>');
        h.push('        </div>');
        h.push('    </div>');
        h.push('</article>');
        h.push('<article class="model-btn btn-signle" style="display:none">');
        h.push('    <div class="btnok oneline js-model-close">');
        h.push('        <span>好的，我知道了</span>');
        h.push('    </div>');
        h.push('</article>');
        h.push('</article>');
        h.push('<article id="txs-model-bg" class="txs-model-bg" style="display:none"></article>');
        var result = $(h.join(''));
        $("body").append(result);
    }
}