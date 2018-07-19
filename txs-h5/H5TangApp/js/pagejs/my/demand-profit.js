$(function () {
    getHistory(0, 5);
});

var getHistory = function (lastId, type) {
    var url = "/StoreServices.svc/trans/history";
    $.AkmiiAjaxPost(url, { "lastid": lastId, "transtype": type }, true).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $.each(tranList, function (index, entry) {
                //交易记录列表
                $(".translist").append(initTranItem(entry, type));
                lastId = entry.id;
            });

            if (tranList.length > 0) {
                $.LoanMore($(".translist"), null, "getHistory('" + lastId + "'," + type + ")");
            } else {
                $.LoanMore($(".translist"), "没有更多交易记录了");
            }
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};

var initTranItem = function (tranItem, type) {
    var html = [];
    html.push('<article class="bg-white bb">');

    var productName = "";
    html.push('<div class="small-7 left"><p class="oh">' + tranItem.detailtext + productName + '</p><span class="gray">' + tranItem.created + '</span></div>');

    html.push("<div class=\"small-5 left text-right\"><p class=\"red " + (tranItem.direction ? "\">+" : "green\">-") + $.fmoney(tranItem.tranamount) + "</p>");
    html.push('</article>');
    return html.join("");
};
