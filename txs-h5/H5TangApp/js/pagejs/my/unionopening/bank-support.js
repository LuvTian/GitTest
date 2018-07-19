$(function() {
    function BankLimit() {
        this.getData();
    };
    // 请求获取支持银行列表数据
    BankLimit.prototype.getData = function() {
        var dtd = $.Deferred();
        var self = this;
        $.txsAjaxLoading();
        $.AkmiiAjaxGet(window.apiUrl_prefix + "/jys/supported-banks")
            .done(function(result) {
                var list = result.data;
                if (list) {
                    var template =
                        '<li class="item border-1px"><div class="bankName"><img src="' + $.resurl() +
                        '/css/img2.0/bank-{bankcode}.png" class="limit-bank-logo"><span>{bankname}</span></div><div class="bankLimit">{bankrecharge}</div></li>';
                    $(".supportItems").html(self.toHtml(list, template));
                }
            })
            .fail(function() {
                dtd.reject();
            }).always(function() {
                $.txsHideAjaxLoading();
            });
    };
    // 该方法将每个银行对象，处理成对应的html
    BankLimit.prototype.toHtml = function(list, template) {
        var self = this;
        return list.map(function(item, index) {
            var bankname = item.bankName;
            var bankcode = item.bankCode.toLowerCase();
            var singleTradeLimitedAmount = item.singleTradeLimitedAmount;
            var singleDayLimitedAmount = item.singleDayLimitedAmount;
            var bankrecharge = "单笔限" + self.moneyFormat(singleTradeLimitedAmount) + "，单日限" +
                self.moneyFormat(singleDayLimitedAmount);
            var html = template.replace('{bankcode}', bankcode).replace('{bankname}',
                bankname).replace('{bankrecharge}', bankrecharge);
            return html;
        }).join('');
    };
    // 该方法用于将限额转成几千或几万
    BankLimit.prototype.moneyFormat = function(money) {
        // var _money = ~~money;
        var _money = parseInt(money);
        if(!_money){
            return 0 + '元';
        };
        if (_money < 10000) {
            return (_money / 1000) + "千";
        } else {
            return (_money / 10000) + "万";
        }
    };
    var _BankLimit = new BankLimit();
}); 
