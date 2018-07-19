var productId = $.getQueryStringByName("id"); //rawassetid
// var productId = "897356497607069696";
$(function () {
    planList();
});

function planList(planList) {
    var url = "/StoreServices.svc/product/smrepayplan";
    var params = {
        methodname: "product_smrepayplan",
        productid: productId,
        bidamount: 10000
    }
    $.AkmiiAjaxPost(url, params, false).then(function (data) {
        if (data.result) {
            if (data.repayplanlist.length != 0) {
                var newArr = [];
                $.each(data.repayplanlist, function (index, item) {
                    newArr.push('<li><span class="interest t_l">' + item.repayday + 
                    '</span><span class="interest t_c">'+ item.capital.toFixed(2)+
                    '</span><span class="interest t_r">' + item.interests.toFixed(2) +
                    '</span></li>');
                });
                var html = $(newArr.join(""));
                $(".interest_list").append(html);
                $("#interest_price").html($.fmoney(data.intereststotal));
            }
        }
    });
}