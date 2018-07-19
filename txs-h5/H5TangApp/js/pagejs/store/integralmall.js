$(function () {
    var productId = $.getQueryStringByName("id"); //当前产品的id
    var appType = $.getQueryStringByName("apptype"); //当前设备类型
    var typeId = $.getQueryStringByName("category"); //当前产品类型
    exchangeGet();

    function exchangeGet() {
        $.AkmiiAjaxGet(apiUrl_prefix + "/items/" + productId, true).then(function (data) {
            if (data.code == 200) {
                var productDetail = data.data;
                name = productDetail.name; //商品名称
                var arrNew = [];
                if (typeId == "physical") {
                    arrNew.push('<p class="word_down">' + name + '</p><p><span class="color_red">' + productDetail.pointPayAmount + '</span> 唐果</p>' +
                        '<div class="color_gray">市场参考价：' + productDetail.marketPrice + '元</div>');
                } else {
                    arrNew.push('<p class="word_down m_t25">' + name + '</p><p><span class="color_red">' + productDetail.pointPayAmount + '</span> 唐果</p>');
                }
                var html = $(arrNew.join(''));
                $('.shop_right').append(html);
                if(!!productDetail.imgUrl){
                    $('#logoImg').attr('src', productDetail.imgUrl);
                }     
                $('.fixed_bottom').click(function () {
                    if (typeId == "physical") {
                        window.location.href = "/html/store/choice_detail.html?category=physical&id=" + productId + "&type=" + appType;
                    } else {
                        window.location.href = "/html/store/profit_detail.html?category=virtual&id=" + productId + "&type=" + appType;
                    }

                });
                $('.virtual').click(function () {
                    window.location.href = "/html/store/welfare_center.html?category=virtual&type=" + appType;
                });
                $('.realy').click(function () {
                    window.location.href = "/Html/store/welfare_center.html?category=physical";
                });
                $('.gout').click(function () {
                    window.location.href = "/html/store/gamecenter.html";
                });
            } else {
                $.alertS(data.errormsg);
                return false;
            }
        })
    }
});