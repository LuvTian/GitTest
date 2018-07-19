/*
 *至尊宝(bid=0)、定期spv合同列表
 */

var bid = "0";
$(function () {
    //bid = $.getQueryStringByName("bid") || "";
    getHistory(bid);
});
var getHistory = function (bid) {
    var url = "/StoreServices.svc/product/spvinfo";
    $.AkmiiAjaxPost(url, { "productbidid": bid }, true).then(function (data) {
        if (data.result) {
            var publisherspv = data.publisherspv;
            $.each(publisherspv, function (index, entry) {
                $("#contract").append(initBidItem(entry));
            });
        } else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
            return;
        } else {
            $.alertF(data.errormsg);
        }
    });
};
var initBidItem = function (item, date) {
    var url = "/html/my/contract/zzb-assets-agreement.html";
    var htmlArray = [];
    htmlArray.push('<dd><div class="l">');
    htmlArray.push('<p>发行人：' + item.spvtitle + '</p>');
    htmlArray.push('<p class="f12 col2">协议编号：' + item.spvno + '</p>');
    htmlArray.push('</div>');
    htmlArray.push('<div class="r">');
    htmlArray.push('<p class="col1">' + $.fmoney(item.amount) + '</p>');
    htmlArray.push('<p class="col2">在投金额</p>');
    htmlArray.push('<div class="wxicon ar"></div>');
    htmlArray.push('</div>');
    htmlArray.push('</dd>');

    var result = $(htmlArray.join(""));
    result.click(function () {
        window.location.href = url + "?amount=" +
           encodeURIComponent(item.amount) + "&created=" +
            encodeURIComponent(date) + "&id=" +
            item.id + "&legal=" +
            encodeURIComponent(item.legal) + "&manager=" +
            encodeURIComponent(item.manager) + "&remark=" +
            encodeURIComponent(item.remark) + "&spvno=" +
            encodeURIComponent(item.spvno) + "&spvtitle=" +
            encodeURIComponent(item.spvtitle) + "&tel=" +
            encodeURIComponent(item.tel) + "&spvprotoal=" +
            encodeURIComponent(item.spvprotoal)
    });
    return result;
};
