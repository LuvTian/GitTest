var userId = $.getCookie("userid"); //用户ID
var itemId = $.getQueryStringByName("pid") //产品id
var point = $.getQueryStringByName("point") || '0';
var total_point, pointDiscount;
var addressId = $.getQueryStringByName("addressId") || '0'; //地址id
var itemCount = 0; //商品数量
var transportFee = 0; //运费
var present = ""; //赠品
var appkey = $.getQueryStringByName("appkey") || '';
var apptype = $.getQueryStringByName("type") || '';
var activityId = $.getQueryStringByName("activityId") || ''; //活动id
var product_id = $.getQueryStringByName("id"); //当前产品的id
var imgUrl = ""; //分享的图片
//var promotionType = $.getQueryStringByName("promotionType") || ''; //活动类型
//apiUrl_prefix = "http://192.168.90.182:8999";
// apiUrl_prefix = "http://192.168.107.236:8999";
$(function() {
    if (!$.CheckToken() && appkey == "") {
        if (apptype == "ios") {
            PhoneMode && PhoneMode.callLogin("");
        } else if (apptype == "android") {
            window.PhoneMode && window.PhoneMode.callLogin("");
        } else {
            $.Loginlink(); //未登录状态跳到登录页
        }

    } else {
        var num = $(".JS_number").text(); //商品数量
        if (addressId == '0') {
            getProductInfo();
        } else {
            getAddress();
        }

    }
    //确认兑换时产品的相关信息
    function pro_detaile(pic_img, pic_name, point, price, deliver_money, pointDiscount, present, total_point, limitTag, promotionDetail, afterPoint) {
        ////优惠唐果的选择
        $(".check_box").click(function() {
            if ($(".check_box").hasClass("choose_check")) {
                $(".check_box").removeClass("choose_check");
            } else {
                $(".check_box").addClass("choose_check");
            }
            if ($(".input_check").attr("checked") == "checked") {
                $(".input_check").attr("checked", false);
            } else {
                $(".input_check").attr("checked", "checked");
            }
            if ($(".input_check").attr("checked") == "checked") {
                if (pointDiscount > 0) {
                    total_point = point + Math.abs(pointDiscount); //合计唐果
                } else {
                    total_point = point - Math.abs(pointDiscount); //合计唐果
                }

                $(".JS_total_candy").text(total_point);
            } else {
                total_point = point; //合计唐果
                $(".JS_total_candy").text(total_point);
            }
        })

        $(".product_img").attr("src", pic_img);
        $(".product_title").text(pic_name);
        $(".candy_num").text(point);
        $(".price_num").text(price);
        $(".JS_money").text(deliver_money);
        $(".JS_reduce_candy label").text(pointDiscount);
        $(".JS_gift").text(present);
        $(".JS_total_candy").text(afterPoint);
        if ($(".JS_privilege").text() == "0") {
            $(".JS_privilege").hide();
        } else {
            $(".JS_privilege").show();
        }
        if ($(".JS_discount").text() == "0") {
            $(".JS_discount").hide();
        } else {
            $(".JS_discount").show();
        }
        if ($(".JS_activity").text() == "0") {
            $(".JS_activity").hide();
        } else {
            $(".JS_activity").show();
        }

        if (limitTag) {
            $(".limit_num").show().text(limitTag);
        } else {
            $(".limit_num").hide();
        }
        //活动优惠明细
        var count_arr = [];
        if (promotionDetail && promotionDetail.length > 0) {
            var promotion_arr = [];
            var items = promotionDetail;
            for (var j = 0; j < items.length; j++) {
                promotion_arr.push('<li><div>' + items[j].ironTitle + '<span class="tags_style limit_num" >' + items[j].ironTag + '</span></div>');
                promotion_arr.push('<div class="JS_privilege">' + items[j].ironCount + '</div></li>');
            }
            var promotion_html = $(promotion_arr.join(''));
            $(".pro_list").append(promotion_html);
        }

        if ($(".JS_reduce_candy label").text() == '0') {
            $(".JS_reduce_candy .input_check,.JS_reduce_candy .check_box").hide();
        } else {
            $(".JS_reduce_candy .input_check,.JS_reduce_candy .check_box").show();
        }
        $(".JS_exchange_btn").click(function() {
            exchange(pic_name, afterPoint, itemId, point, "PHYSICAL", activityId);
        })
    }
    // //确认兑换接口
    // function confirmExchange(pic_name, afterPoint, itemId, point,activityId){
    //     var data={
    //             "activityId":activityId,
    //             "itemId": itemId,
    //             "userId":userId
    //     }
    //     $.AkmiiAjaxPost(apiUrl_prefix +"/boost/validate",data,false).then(function(data){
    //         if(data.code==200){

    //         }else{
    //             $.confirmF(d.message, '取消','去投资',function(){
    //             }, function () {
    //                 window.location.href = "/html/product/index.html";
    //             },function(){})
    //         }
    //     })
    // }
    //获取兑换的商品相关信息
    function getProductInfo() {
        var D = {
            itemId: itemId,
            accountId: userId,
            itemNum: num,
            activityId: activityId
        }
        $.AkmiiAjaxPost(apiUrl_prefix + "/boost/tradeconfirm", D, true).then(function(data) {
            if (data.code == 200) {
                var adress = data.data.address || '';
                var item = data.data.item || '';
                var receive_peopel = adress.receivingName || ''; //收货人
                var receive_tel = adress.cellPhone || ''; //收货人电话
                var addressDetaile = adress.address || ''; //收货詳細地址
                var provinceName = adress.provinceName || ''; //收貨省
                var cityName = adress.cityName || ''; //收貨市
                var countyName = adress.countyName || ''; //收貨县
                var addressAll = provinceName + cityName + countyName + addressDetaile;
                var pic_img = item.mainImgUrl || item.imgUrl || ($.resurl() + '/css/img2.0/pointImg/product-default@2x.png'); //商品图片
                imgUrl = item.imgUrl || ($.resurl() + "/css/img2.0/pointImg/share_icon.jpg"); //分享的图片
                var pic_name = item.name || ''; //商品名称
                //point = item.pointPayAmount || '0'; //唐果
                point = item.pointPayAmount || '0'; //唐果
                var price = item.marketPrice || '0'; //市场参考价
                var deliver_money = data.data.transportFee || '0'; //运费
                var pointDiscount = data.data.pointDiscount || 0; //优惠唐果?
                present = data.data.present; //赠品
                total_point = point; //合计唐果
                // var tags = data.data.tags || []; //活动优惠标志
                var promotionDetail = data.data.promotionDetail || []; //活动优惠
                var afterPoint = data.data.afterPoint || '0'; //折后价

                addressId = adress.id; //地址id
                itemCount = data.data.itemCount; //商品数量
                transportFee = data.data.transportFee; //运费

                var promotionDetail = data.data.promotionDetail || {}; //订单优惠明细标签
                var limitTag = data.data.limitTag; //限购标志


                if (!receive_peopel || !receive_tel || !addressDetaile) {
                    $(".no_address").show(); //没有默认地址的代码
                    $(".choose_address").hide(); //有默认地址的代码
                    $(".JS_exchange_btn").hide(); //可兑换的按钮
                    $(".gray_btn").show(); //不可兑换的按钮
                } else {
                    $(".choose_address").show();
                    $(".no_address").hide();
                    $(".JS_exchange_btn").show();
                    $(".gray_btn").hide();
                }


                $(".JS_receive").text(receive_peopel);
                $(".receive_tel").text(receive_tel);
                $(".JS_address").text(addressAll);
                pro_detaile(pic_img, pic_name, point, price, deliver_money, pointDiscount, present, total_point, limitTag, promotionDetail, afterPoint); //确认兑换时产品的相关信息


            }

        });
    }
    //根居地址id得到收貨地址
    function getAddress() {
        var D = {
            itemId: itemId,
            accountId: userId,
            itemNum: num,
            activityId: activityId
        }
        $.AkmiiAjaxPost(apiUrl_prefix + "/boost/tradeconfirm", D, true).then(function(data) {
            if (data.code == 200) {
                var item = data.data.item || '';
                var pic_img = item.mainImgUrl || item.imgUrl || ($.resurl() + '/css/img2.0/pointImg/product-default@2x.png'); //商品图片
                var pic_name = item.name || ''; //商品名称
                point = item.pointPayAmount || '0'; //唐果
                var price = item.marketPrice || '0'; //市场参考价
                var deliver_money = data.data.transportFee || '0'; //运费
                var pointDiscount = data.data.pointDiscount || 0; //优惠唐果?
                present = data.data.present; //赠品
                total_point = point; //合计唐果
                //var tags = data.data.tags || []; //活动优惠标志
                var promotionDetail = data.data.promotionDetail || []; //活动优惠
                var afterPoint = data.data.afterPoint || '0'; //折后价
                itemCount = data.data.itemCount; //商品数量
                transportFee = data.data.transportFee; //运费
                var promotionDetail = data.data.promotionDetail || {}; //订单优惠明细标签
                var limitTag = data.data.limitTag; //限购标志

                pro_detaile(pic_img, pic_name, point, price, deliver_money, pointDiscount, present, total_point, limitTag, promotionDetail, afterPoint); //确认兑换时产品的相关信息

                $.AkmiiAjaxGet(apiUrl_prefix + "/members/address/" + addressId, true).then(function(data) {
                    if (data.code == 200) {
                        var receive_peopel = data.data.receivingName || ''; //收货人
                        var receive_tel = data.data.cellPhone || ''; //收货人电话
                        var addressDetaile = data.data.address || ''; //收货詳細地址
                        var provinceName = data.data.provinceName || ''; //收貨省
                        var cityName = data.data.cityName || ''; //收貨市
                        var countyName = data.data.countyName || ''; //收貨县
                        var addressAll = provinceName + cityName + countyName + addressDetaile;
                        if (!receive_peopel || !receive_tel || !addressDetaile) {
                            $(".no_address").show(); //没有默认地址的代码
                            $(".choose_address").hide(); //有默认地址的代码
                            $(".JS_exchange_btn").hide(); //可兑换的按钮
                            $(".gray_btn").show(); //不可兑换的按钮
                        } else {
                            $(".choose_address").show();
                            $(".no_address").hide();
                            $(".JS_exchange_btn").show();
                            $(".gray_btn").hide();
                        }
                        $(".JS_receive").text(receive_peopel);
                        $(".receive_tel").text(receive_tel);
                        $(".JS_address").text(addressAll);
                    } else {}
                })
            }
        })

    }


})

function return_url() {
    var rurl = '/html/store/conform_exchange.html?pid=' + itemId + '&point=' + point + '&activityId=' + activityId;
    window.location.href = '/html/store/addressmodify.html?first=true&returnUrl=' + encodeURIComponent(rurl); //跳到新增地址页面
}

function return2_url() {
    var rurl = '/html/store/conform_exchange.html?pid=' + itemId + '&point=' + point + '&activityId=' + activityId;
    window.location.href = '/html/store/select-delivery-address.html?returnUrl=' + encodeURIComponent(rurl); //跳到选择收货地址页面
}