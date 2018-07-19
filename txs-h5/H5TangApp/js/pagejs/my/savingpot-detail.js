$(function () {

    //$("#savingpotlist").html('');
    getHistory(0, 7);

});


var getHistory = function (lastId, type) {
    var url = "/StoreServices.svc/trans/history";
    $.AkmiiAjaxPost(url, { "lastid": lastId, "transtype": type }, false).then(function (data) {
        if (data.result) {
            var tranList = data.transhistorys;
            $.each(tranList, function (index, entry) {
                //交易记录列表
                $("#savingpotlist").append(initTranItem(entry, type));
                lastId = entry.id;
            });

            if (tranList.length > 0) {
                $.LoanMore($("#savingpotlist"), null, "getHistory('" + lastId + "'," + type + ")");
            } else {
                $.LoanMore($("#savingpotlist"), "没有更多交易记录了");
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
    html.push('<p style="font-size:1.333rem;padding: 1rem 1rem;border-bottom: 1px solid #ddd;">');
    html.push(tranItem.created);
    html.push('<span style="float: right;color:#CE517F">+');
    html.push($.fmoney(tranItem.tranamount));
    html.push('</span></p>');

    return html.join("");
};