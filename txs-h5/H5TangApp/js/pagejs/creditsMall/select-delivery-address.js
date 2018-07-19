$(function() {
    //var apiUrl_prefix = "http://192.168.3.30:8090"111;
    var userId = $.getCookie("userid");
    var returnUrl = decodeURIComponent($.getQueryStringByName("returnUrl") || "");
    var ha = [];
    var itemId = $.getQueryStringByName("pid");
    var point = $.getQueryStringByName("point");
    var activityId=$.getQueryStringByName("activityId");
    $("#to_manage").click(function() {
        window.location.href = "/html/store/manage-delivery-address.html"
    });
    $.AkmiiAjaxPost(apiUrl_prefix + "/members/address/list", {
        accountId: userId
    }, true).then(function(d) {
        if (d.code == 200) {
            $.each(d.data, function(index, item) {
                ha.push('<div class="content_box_address bor_top">');
                if (returnUrl && point && itemId) {
                    ha.push('<div class="con_name_tel" onclick="window.location.href=\'/html/store/conform_exchange.html?pid=' + itemId + '&addressId=' + item.id + '&point=' + point +'&activityId='+activityId+ '\'">');
                } else {
                    if (returnUrl.indexOf("?") >= 0) { //链接有参数
                        ha.push('<div class="con_name_tel" onclick="window.location.href=\'' + returnUrl + '&addressId=' + item.id + '\'">');
                    } else {
                        ha.push('<div class="con_name_tel" onclick="window.location.href=\'' + returnUrl + '?addressId=' + item.id + '\'">');
                    }

                }
                ha.push('<div class="flex_1">' + item.receivingName + '</div>');
                ha.push('<div class="flex_1 flex_end">' + item.cellPhone + '</div>');
                ha.push('</div>');
                if (returnUrl && point && itemId) {
                    ha.push('<div class="address_details" onclick="window.location.href=\'/html/store/conform_exchange.html?pid=' + itemId + '&addressId=' + item.id + '&point=' + point + '&activityId='+activityId+'\'">');
                } else {
                    if (returnUrl.indexOf("?") >= 0) { //链接有参数
                        ha.push('<div class="address_details" onclick="window.location.href=\'' + returnUrl + '&addressId=' + item.id + '\'">');
                    } else {
                        ha.push('<div class="address_details" onclick="window.location.href=\'' + returnUrl + '?addressId=' + item.id + '\'">');
                    }
                }


                if (item.defaultAddress == "TRUE") {
                    ha.push('<span class="txt-red">[默认地址]</span>')
                }
                ha.push(item.provinceName + item.cityName + item.countyName + item.address);
                ha.push('</div>');
                ha.push('</div>');
            })

        }
        var htmlContent = ha.join("");
        $(".content_box").after(htmlContent);
    })
    $(".content_box_address").first().removeClass("bor_top");
    $(".content_box_address").last().css("margin-bottom", ".768rem");
    $("#newaddress").click(function() {
        if ($(".content_box_address").length >= 10) {
            $.alertF("地址添加不得超过10条");
            return false;
        } else {
            window.location.href = "/html/Store/addressmodify.html?returnUrl=" + returnUrl
        }

    })
})