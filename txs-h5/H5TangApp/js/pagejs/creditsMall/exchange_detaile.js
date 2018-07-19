var userId = $.getCookie("userid"); //用户ID
var orderNo = $.getQueryStringByName("orderNo") || ''; //订单编号
var appkey = $.getQueryStringByName("appkey") || '';
var type = $.getQueryStringByName("type") || '';
var category = $.getQueryStringByName("category") || '';
var statusText;
//apiUrl_prefix = "http://192.168.3.30:8999";
$(function () {
    if (!$.CheckToken() && appkey == "") {
        if (type == "ios") {
            PhoneMode && PhoneMode.callLogin("");
        } else if (type == "android") {
            window.PhoneMode && window.PhoneMode.callLogin("");
        } else {
            $.Loginlink(); //未登录状态跳到登录页
        }

    } else {
        if (category == "physical") {
            $(".product_img").show();
            $(".vartur_img").hide();
            $(".take_delivery").show();
            $(".virtual_list").hide();
            $(".deliver_list").show();
            $(".product_price").show();
        } else {
            $(".product_img").hide();
            $(".vartur_img").show();
            $(".take_delivery").hide();
            $(".virtual_list").show();
            $(".deliver_list").hide();
            $(".product_price").hide();
        }
        var D = {
            orderNo: orderNo,
            accountId: userId
        }
        $.AkmiiAjaxPost(apiUrl_prefix + "/order/detail", D, true).then(function (data) {
            if (data.code == 200) {
                var address = data.data.orderAddress || '';
                var receive_peopel = address.receivingName || '无'; //收货人
                var receive_tel = address.cellPhone || '无'; //收货人电话
                var addressDetaile = address.address || ''; //收货詳細地址
                var provinceName = address.provinceName || ''; //收貨省
                var cityName = address.cityName || ''; //收貨市
                var countyName = address.countyName || ''; //收貨县
                var address_totle = provinceName + cityName + countyName + addressDetaile;
                var addressAll = address_totle || "无";
                var pic_img = data.data.mainImgUrl || data.data.imgUrl || ($.resurl() + '/css/img2.0/pointImg/product-default@2x.png'); //商品图片
                var pic_name = data.data.itemName || ''; //商品名称
                var point = data.data.pointAmount || 0; //唐果
                var price = data.data.marketPrice || '0'; //市场参考价
                var orderNo = data.data.orderNo || ''; //订单编号
                var createTime = data.data.createTime || ''; //订单时间
                var itemNum = data.data.itemNum || '0'; //购买数量
                var deliver_money = data.data.transportFee || '0'; //运费?
                var pointDiscount = data.data.pointDiscount || 0; //优惠唐果
                var present = data.data.present || '无'; //赠品
                var total_point = point - pointDiscount; //合计唐果
                var status = data.data.deliveryStatus; //状态
                var order_status = data.data.orderStatus; //订单状态
                var courierName = data.data.courierName || '无'; //快递公司
                var courierNum = data.data.courierNum || '无'; //快递单号
                var itemType = data.data.itemType;
                var promotionDetailObj = data.data.promotionDetailObj; //订单优惠明细标签
                var consumerNo = data.data.consumerNo; //一维码
                var item_invote_money = (data.data.itemVirtualDesc1).replace(/[^0-9]/ig, "");
                var overdueTime = data.data.itemVirtualDesc2 || '无'; //一维码到期时间
                var money_unit = (data.data.itemVirtualAmount || '0') + (data.data.unit || "");
                if (category == "physical") {
                    if (status == "FINISHED") {
                        statusText = "已发货";
                    } else if (status == "UNFINISHED") {
                        statusText = "待发货";
                    }
                } else {
                    if (status == "FINISHED") {
                        statusText = "交易成功";
                    } else if (status == "UNFINISHED") {
                        statusText = "待发货";
                    }
                }

                if (itemType == "COUPON") { //代金券
                    $(".vartur_img").addClass("coupon");
                } else if (itemType == "CINEMA_TICKET") { //电影票
                    $(".vartur_img").addClass("cinema_ticket");
                } else if (itemType == "PHONE_TRAFFIC") { //流量
                    $(".vartur_img").addClass("phone_traffic");
                } else if (itemType == "INTEREST") { //加息券
                    $(".vartur_img").addClass("interest");
                } else if (itemType == "REFUELING_CARD") { //加油卡
                    $(".vartur_img").addClass("refueling_card");
                } else { //其他
                    $(".vartur_img").addClass("other_coupon");
                }
                $(".JS_receive").text(receive_peopel);
                $(".receive_tel").text(receive_tel);
                $(".JS_address").text(addressAll);
                $(".product_img").attr("src", pic_img);
                $(".product_title,.product_name").text(pic_name);
                $(".money_unit").text(money_unit);

                $(".price_num").text(price);
                $(".JS_order_number").text(orderNo);
                $(".JS_time").text(createTime);
                $(".JS_number").text(itemNum);
                $(".JS_money").text(deliver_money);
                $(".JS_reduce_candy label").text(pointDiscount);
                $(".JS_gift").text(present);
                if (consumerNo == "0" && item_invote_money != "") {
                    $(".JS_code").siblings().text("起投金额")
                    $(".JS_code").text(item_invote_money);
                } else {
                    $(".JS_code").siblings().text("一维码")
                    consumerNo = data.data.consumerNo != "0" ? data.data.consumerNo : "无";
                    $(".JS_code").text(consumerNo);
                }

                $(".JS_dueTime").text(overdueTime);
                if (pointDiscount > 0) {
                    total_point = point + Math.abs(pointDiscount); //合计唐果
                } else {
                    total_point = point - Math.abs(pointDiscount); //合计唐果
                }
                $(".candy_num").text(total_point);
                $(".JS_total_candy").text(point);
                $(".JS_state").text(statusText);
                $(".JS_deliver").text(courierName);
                $(".JS_tracking_number").text(courierNum);

                if (promotionDetailObj && promotionDetailObj.limitTag) {
                    $(".limit_num").show().text(promotionDetailObj.limitTag);
                } else {
                    $(".limit_num").hide();
                }

                if (promotionDetailObj && promotionDetailObj.promotionDetail.length > 0) {
                    var promotion_arr = [];
                    var items = promotionDetailObj.promotionDetail;
                    for (var j = 0; j < items.length; j++) {
                        promotion_arr.push('<li><div>' + items[j].ironTitle);
                        if (items[j].ironTag) {
                            promotion_arr.push('<span class="tags_style limit_num" >' + items[j].ironTag + '</span>');
                        }
                        promotion_arr.push('</div>');
                        promotion_arr.push('<div class="JS_privilege">' + items[j].ironCount + '</div></li>');
                    }
                    var promotion_html = $(promotion_arr.join(''));
                    $(".preferential_list").append(promotion_html);
                }
            } else {

            }
        })
    }

})