var pageindex = 1;
var orderbytype = 0;
var upordown = 0;
var temp = 0; //（1是点击加载更多就不清楚原来的html）
var yuqiyeartemp = 0; //(期望年化0是顺序1是倒叙)
var durationtemp = 0; //(剩余期限0是顺序1是倒叙)
var transfertemp = 0; //(转让价格0是顺序1是倒叙)
$(function() {
    producttransferlist(pageindex, temp);
    // loadBanner();
    // if ($.getCookie("MadisonToken")) {
    //     $.getMitteilung($("#myicon"));
    // }
});

var typename = $.getQueryStringByName("typename") || "变现专区";
// var ratedesc = decodeURIComponent($.getQueryStringByName("ratedesc")) || "历史年化收益率";
// var durationdesc = decodeURIComponent($.getQueryStringByName("durationdesc")) || "投资期限";





//变现专区列表
function producttransferlist(pageindex, temp) {
    var url = "/StoreServices.svc/product/producttransferlist";
    var data = {
        pageindex: pageindex,
        pagesize: 10,
        orderbytype: orderbytype,
        upordown: upordown
    };
    $.AkmiiAjaxPost(url, data, true).then(function(d) {
        if (d.result) {
            $.UpdateTitle(decodeURIComponent(typename));
            if (temp <= 0) {
                $("#productsList").html('');
            }
            if (d.producttransferlist.length != 0) {
                var ha = [];
                $.each(d.producttransferlist, function(index, item) {
                    // ha.push('<article class="fund-list bg-white mb8" data-pid="' + item.producttransferid + '">');
                    // ha.push('<div class="atricleclick">');
                    // ha.push('<div class="pltitle oh">');
                    // ha.push('<span class="ptt left">' + item.title + '</span>');
                    // ha.push('</div>');
                    // ha.push('<div class="small-12 left">');
                    // ha.push('<div class="row earnings-title">');
                    // ha.push('<div class="small-4 left">期望年化收益率</div>');
                    // ha.push('<div class="small-3 left text-right">剩余期限</div>');
                    // ha.push('<div class="small-5 left text-right">转让价格</div>');
                    // ha.push('</div>');
                    // ha.push('<div class="row earnings">');
                    // ha.push('<div class="small-4 left red">');
                    // ha.push('<span class="enumber">' + $.fmoney(item.transferrate) + '</span><span class="epercent">%</span>');
                    // ha.push('</div>');
                    // ha.push('<div class="small-3 mid left text-right">');
                    // ha.push('<span class="edays">' + item.remainingday + '</span>天</div>');
                    // ha.push('<div class="small-5 mid left text-right right">');
                    // ha.push('<span class="edays">' + $.fmoney(item.transferamount) + '</span>元');
                    // ha.push('</div></div></div></div></article>');

                    ha.push('<li data-pid=' + item.producttransferid + '>');
                    ha.push('<p class="productName">' + item.title + '</p>')
                    ha.push('<div class="productInfoContainer">')
                    ha.push('<div class="productInterestRates"><div>' + item.transferrate + '<span class="unit">%</span></div><p class="desc">' + item.yearlyratedesc + '</p></div>')
                    ha.push('<div class="productTimeLimit">')
                    ha.push('<div>')
                    ha.push('<span class="num">' + item.remainingday + '</span><span class="unit"> 天</span>')
                    ha.push('</div>')
                    ha.push('<p class="desc">' + item.investdurationdesc + '</p>')
                    ha.push('</div>')
                    ha.push('<div class="productAmount">')
                    ha.push('<div>' + $.fmoney(item.transferamount) + '<span class="unit">元</span></div>')
                    ha.push('<p class="desc">' + item.transferamountdesc + '</p>')
                    ha.push('</div>')
                    ha.push('</div>')
                    ha.push('</li>')

                });
                var html = $(ha.join(""));
                html.click(function() {
                    var producttransferid = $(this).attr("data-pid");
                    window.location.href = "/html/product/producttransferdetail.html?producttransferid=" + producttransferid;
                    return false;
                });
                $("#productsList").append(html);
                if (d.producttransferlist.length > 0) {
                    $.LoanMore($("#productsList"), null, "producttransferlist(" + (pageindex += 1) + ")");
                } else {
                    $.LoanMore($("#productsList"), "没有更多变现产品了");
                }
            } else {
                $.LoanMore($("#productsList"), "没有更多变现产品了");
            }
            if ($("#productsList li").length == 0) {
                $("#productsList").hide();
                $("#noDataContainer").show();
            }
        }
    });
}

$("#productSortContainer li").click(function() {
    $(this).siblings().find(".sortArrow").removeClass("down up");
    orderbytype = $(this).attr("data-orderbytype");
    var sortArrow = $(this).find(".sortArrow");
    if (orderbytype == 1 && !sortArrow.is(".up,.down")) {
        sortArrow.addClass("down");
        upordown = 1;
    } else {
        if (sortArrow.hasClass("down")) {
            sortArrow.removeClass("down").addClass("up");
            upordown = 0;
        } else if (sortArrow.hasClass("up")) {
            sortArrow.removeClass("up").addClass("down");
            upordown = 1;
        } else {
            sortArrow.addClass("up");
            upordown = 0;
        }
    }
    pageindex = 1;
    temp = 0;
    producttransferlist(pageindex, temp);
})