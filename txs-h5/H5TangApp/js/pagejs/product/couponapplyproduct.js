var couponid = $.getQueryStringByName("couponid");
var MadisonToken = $.getCookie("MadisonToken");
var cpamount = $.getQueryStringByName("cpamount") || 0 //代金券门槛
var cpsalemoney = $.getQueryStringByName("cpsalemoney") || 0 //代金券优惠金额
var account = [];
$(function() {
    if ($.isNull(MadisonToken)) { //未登录
        window.location.href = "/html/anonymous/login.html?returnurl=/html/product/couponapplyproduct.html?couponid=" + couponid;
    } else {
        getUserInfo();
    }
})

function getcouponapplyproductlist() {
    var url = "/StoreServices.svc/product/canuselist";
    var data = { "couponid": couponid };
    $.AkmiiAjaxPost(url, data, false).then(function(d) {
        if (d.result) {
            if (d.productlist.length > 0) {
                if (cpamount > 0 && cpsalemoney > 0) {
                    $("#cp_productinfo").show();
                    $("#cpamount").html(cpamount);
                    $("#cpsalemoney").html(cpsalemoney);
                }
                $.each(d.productlist, function(i, item) {
                    var dom = $(productinfohtml(item));
                    dom.click(function() {
                        window.location.href = "/html/product/productfixeddetail.html?id=" + item.productid + "&couponid=" + couponid;
                    });
                    dom.find(".tzbtn").click(function() {
                        event.stopImmediatePropagation();
                        if(!$.CheckAccountBeforeBuy(account)){
                            return;
                        }
                        window.location.href = "/html/product/productfixedbuy-new.html?id=" + item.productid + "&couponid=" + couponid;                        
                        // if (account.customstatus < 2) {
                        //     $.alertF("您的资料还未完善，现在去完善吧", null, $.RegistSteplink);
                        // } else if (account.customstatus < 3){
                        //     $.confirmF("您尚未绑卡，请绑定银行卡", "", "", null, function () {
                        //         window.location.href = "/html/my/regist-step3.html?returnurl=" + encodeURIComponent(window.location.href);
                        //     });
                        // }
                        //  else {
                        //     window.location.href = "/html/product/productfixedbuy-new.html?id=" + item.productid + "&couponid=" + couponid;
                        // }
                    });
                    $("#productlist").append(dom);
                });
                $("#productlist").find("div:last-child").removeClass("borb");
            }
        } else {
            $.alertF(d.errormsg);
        }
    });
}

function productinfohtml(item) {
    var html = [];
    //5可使用 6售罄(其他情况也暂时显示可使用样式)
    if (item.status == 6) {
        html.push('<div class="cp_product borb" data-id=' + item.productid + '>');
        html.push('<div class="cp_p_info">');
        html.push('<div class="cp_left float_l flex_left">');
        html.push('<span class="cp_pname over">' + item.title, 12 + '</span>');
        html.push('<p class="cp_prate over">' + item.ratedesc + '  <span class="cp_prate_v over"> ' + item.rate + '%</span></p>');
        html.push('</div>');
        html.push('<div class="float_l cp_center">');
        html.push('<span class="cp_pday_v over">' + item.duration + '</span><span class="cp_pday over">天</span>');
        html.push('</div>');
        html.push('<div class="cp_right float_l over">');
        html.push('<div class="cp_btn_overbox"><span class="cp_btn over">已售罄</span></div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
    } else {
        html.push('<div class="cp_product borb" data-id=' + item.productid + '>');
        html.push('<div class="cp_p_info">');
        html.push('<div class="cp_left float_l flex_left">');
        html.push('<span class="cp_pname">' + item.title, 12 + '</span>');
        html.push('<p class="cp_prate">' + item.ratedesc + ' <span class="cp_prate_v">' + item.rate + '%</span></p>');
        html.push('</div>');
        html.push('<div class="float_l cp_center">');
        html.push('<span class="cp_pday_v">' + item.duration + '</span><span class="cp_pday">天</span>');
        html.push('</div>');
        html.push('<div class="cp_right float_l">');
        html.push('<div class="cp_btn_box tzbtn"><span class="cp_btn">立即投资</span></div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
    }
    return html.join("");
}

//用户信息
function getUserInfo() {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, false).then(function(data) {
        if (data.result) {
            account = data.accountinfo;
            getcouponapplyproductlist();
        }
    });
}