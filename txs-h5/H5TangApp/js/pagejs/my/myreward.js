/// <reference path="//_references.js" />


var moneylist = $(".moneylist");//列表
var datalist = [];

$(function () {
    getUserInfo();
    loaddata(0);
    $('.tabs-content .bg-white:last').removeClass('bb-e4')
});
function loaddata(lastid) {
    var url = "/StoreServices.svc/user/queryaccountdetailawards";
    var param = { "lastid": lastid };
    $.AkmiiAjaxPost(url, param, true).then(function (d) {
        if (d.result) {
            if (lastid == 0) {
                $("#total").html($.fmoney(d.balance));
            }
            var list = d.data;
            $.each(list, function (index, element) {
                lastid = element.accountdetailid;
                if (datalist.indexOf(element.accountdetailid) < 0) {
                    datalist.push(element.accountdetailid);
                    var ha = [];
                    ha.push(' <div class="bg-white bt-e4">');
                    ha.push(' <div class="small-4 fl text-left ver-mid">');
                    ha.push('<p class="col-979 ver-mid-con">' + element.createdtostring + '</p>');
                    ha.push(' </div><div class="small-4 fl text-center">');
                    ha.push('<p class="col-979 line-h-5">' + element.typetext + '</p></div>');
                    ha.push('<div class="small-4 left text-right"><p class="red line-h-5">+' + $.fmoney(element.amount) + '</p></div></div>');

                    moneylist.append($(ha.join('')));
                }
            });
            if (list.length > 9) {
                $.LoanMore($("#load-more"), null, "loaddata('" + lastid + "')");
            } else {
                $.LoanMore($("#load-more"), "没有更多记录了");
            }
        }
    });
}

var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            $("#canout").html($.fmoney(data.accountinfo.demandprofit));
             //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                $("#canoutbtn").html("转入僧财宝");
            } 
            if (Number(data.accountinfo.demandprofit) <= 0) {
                $("#canoutbtn").removeClass("red");
            }
            else {
                $("#canoutbtn").attr("href", "/html/paycenter/user-profit-redeem.html");
            }
            
        }
        else if (data.errorcode == 'missing_parameter_accountid') {
            $.Loginlink();
        }
    });
};

