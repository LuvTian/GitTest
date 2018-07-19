var productId = $.getQueryStringByName("id"); //rawassetid
var interestcouponid = $.getQueryStringByName("interestcouponid");
var bidstatus = $.getQueryStringByName("bidstatus");
var title = $.getQueryStringByName("title");
$(function () {
    $('.title').text(decodeURIComponent(title));
    planList();
});

function planList(planList) {
    var url = "/StoreServices.svc/product/repayplan2";
    var params = {
        productbidid: productId
    }
    $.AkmiiAjaxPost(url, params, false).then(function (data) {
        if (data.result) {
            if (bidstatus == "8") {
                $('.title_p').text('转让产品手续费：' + $.fmoney(data.penalty) + '元');
            }
            if (data.repayplanlist.length != 0) {
                $.each(data.repayplanlist, function (index, item) {
                    if (interestcouponid != "0") {
                        var arr = [];
                        $('.list_add').show();
                        $('.interest_list_add').show();
                        arr.push('<li><span class="interest_add t_l">' + item.repaytime +
                            '</span><span class="interest_add t_c">' + $.fmoney(item.monthlyprincipal) +
                            '</span><span class="interest_add t_r">' + $.fmoney(item.monthinterst) +
                            '</span><span class="interest_add t_r">' + $.fmoney(item.interstprofit) + '</span></li>');
                        var html_add = $(arr.join(""));
                        $(".interest_list_add").append(html_add);
                    } else {
                        var newArr = [];
                        $('.list').show();
                        $('.interest_list').show();
                        newArr.push('<li><span class="interest t_l">' + item.repaytime +
                            '</span><span class="interest t_c">' + $.fmoney(item.monthlyprincipal) +
                            '</span><span class="interest t_r">' + $.fmoney(item.monthinterst) +
                            '</span></li>');
                        var html = $(newArr.join(""));
                        $(".interest_list").append(html);
                    }
                });
                $("#interest_price").html($.fmoney(data.totalinterest));
                $("#corpus").html($.fmoney(data.totalprincipae));

            }
        }
    });
}