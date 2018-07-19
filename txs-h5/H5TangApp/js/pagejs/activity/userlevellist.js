/// <reference path="/_references.js" />
(function ($) {

    var pageUserlevel = $('#pageUserlevel');
    GetList();

    var lastID = "0";
    var k = 0;
    function initList() {
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/InvestFestivalList", { "pagesize": "10", "lastid": lastID }, true).then(function (d) {
            if (d) {
                var last = null;
                if (d.investlist.length > 0) {
                    $.each(d.investlist, function (i, product) {
                        last = product;
                        k = i;
                        pageUserlevel.find('.list').append(getLogHTML(product, i));
                    });
                    lastID = last.lastID;
                } else {
                    k = 0;
                    //pageUserlevel.find(".noinvitation").show();
                    //pageUserlevel.find('.list').hide();
                    //$("#loadmore").hide();
                }
            }
        });
    }


    function GetList() {
        lastID = "0";
        pageUserlevel.find('.list').html('<div class="row bg-yellow"><div class="small-3 left"><b>姓名</b></div><div class="small-3 left"><b>手机号</b></div><div class="small-3 left"><b>投资奖励</b></div><div class="small-3 left"><b>投满千元</b></div></div>');
        initList();
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/InvestFestivalRecNum", {}, true).then(function (d) {
            if (d) {
                var levelsrc = $("#imglevel").attr("src");
                levelsrc = levelsrc.substr(0, levelsrc.lastIndexOf("/") + 1);
                $("#imglevel").attr("src", levelsrc + d.userlevel);
                $("#rcount").text(d.recnum);
                $("#lastProfit").text(d.profitamount);
                $("#totalAmout").text(d.totalamount);
            }
        });
    }


    function getLogHTML(item, i) {
        var className = "row";
        if ((i + 1) % 2 == 0) { className = "row bg-yellow"; }
        var imgUrl = item.Status ? "/css/img2.0/ok.png" : "/css/img2.0/wrong.png";
        var ha = [];
        ha.push('<div class="' + className + '"><div class="small-3 left">');
        ha.push(item.Name);
        ha.push('</div><div class="small-3 left">');
        ha.push(item.Mobile);
        ha.push('</div><div class="small-3 left">');
        ha.push(item.Amount);
        ha.push('</div><div class="small-3 left"><img src="');
        ha.push(imgUrl);
        ha.push('" class="img-status"></div></div>');

        return ha.join('');
    }


    $("#loadmore").click(function () {
        if (k < 9) {
            $.alertF("没有更多的邀请记录了");
        } else {
            initList();
        }
    });

})(jQuery);