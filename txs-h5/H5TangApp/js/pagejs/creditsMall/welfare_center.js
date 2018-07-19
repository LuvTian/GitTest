var pageSize = 10;
var pageIndexPhy = 1;
var pageIndexVir = 1;
var totalPagePhy = 1;
var totalPageVir = 1;
var category = $.getQueryStringByName("category"); //"virtual" //"physical" ////获取福利类型
var type = category;
var view = document.getElementById("move_up");
var product_name = "";
var userId = $.getCookie("userid"); //用户ID
var fg = true;

var apptype = $.getQueryStringByName('type');
var appkey = $.getQueryStringByName("appkey");
// apiUrl_prefix = "http://192.168.105.120:8999";
$(function() {
    //价格保留两位小数点处理
    template.helper("pricefixed", function(price) {
        var strPrice = price + "";
        if (strPrice.indexOf(".") != -1) {
            var price = price.toFixed(2);
        } else {
            var price = price + ".00";
        }

        return price;
    });
    // var sm_event = {
    // 	start: function() {},
    // 	move: function() {},
    // 	end: function() {}
    // };

    // 检查当前要显示那个tab
    function checkCurTab() {
        var cur = "physical";
        if (category == "virtual") {
            cur = "virtual";
        }
        $.setLS("currtype", cur);
    }


    //$.getLS("currtype") == 0 && checkCurTab();
    checkCurTab();
    //小僧精选和礼券Tab切换js
    $(".JS_tab li").click(function() {
        var index = $(this).index();
        $(".JS_tab li span").removeClass("tab_current");
        $(this).find("span").addClass("tab_current");
        //alert(index);
        $(".welfare_content >div").eq(index).show().siblings().hide();
        if (index == 0) {
            type = "physical";
            history.replaceState(null, null, '/html/store/welfare_center.html?category=physical&type=' + apptype);
            //window.location.hash = "#physical";
            $.BaiduStatistics("Integral Mall", "Btn_More_Selected", "福利中心-小僧精选");
        } else if (index == 1) {
            type = "virtual";
            history.replaceState(null, null, '/html/store/welfare_center.html?category=virtual&type=' + apptype);
            //window.location.hash = "#virtual";
            $.BaiduStatistics("Integral Mall", "Btn_More_Coupon", "福利中心-小僧礼券");
        }
        $.setLS("currtype", type);
        // window.location.href = "/Html/store/welfare_center.html?category=" + type;
    });
    //currentType = $.getLS("currtype");
    if ($.getLS("currtype") == "virtual") {
        $(".JS_tab li span").removeClass("tab_current");
        $(".JS_tab li span").eq(1).addClass("tab_current");
        $(".welfare_content >div").eq(1).show().siblings().hide();
        type = "virtual";
    } else {
        $(".JS_tab li span").removeClass("tab_current");
        $(".JS_tab li span").eq(0).addClass("tab_current");
        $(".welfare_content >div").eq(0).show().siblings().hide();
        type = "physical";
    }

    //小僧精选接口
    dataListPhy(pageIndexPhy);
    //小僧礼券接口
    dataListVir(pageIndexVir);
    //小僧精选
    function dataListPhy(pageIndexPhy) {
        var D = {
            "code": category,
            "top": "",
            "size": pageSize,
            "page": pageIndexPhy,
            "userId": userId
        }
        $.AkmiiAjaxGet(apiUrl_prefix + "/categories/physical" + "?size=" + pageSize + "&page=" + pageIndexPhy, true).then(function(data) {
            if (data.code == 200) {
                fg = true;
                var phy_list = data.data.recordList;
                var totalCount = data.data.totalCount;
                //var pageSize = data.data.pageSize;
                //alert(pageSize);
                //var num = Math.ceil(totalCount / pageSize)
                totalPagePhy = data.data.totalPage;
                var currentPage = data.data.currentPage;
                //小僧精选实物类型
                var source = $("#welfare_choice").html();
                var render = template.compile(source);
                if (phy_list != null && phy_list != "") {
                    var html = render({
                        list: phy_list || []
                    });

                    $(".welfare_choice").append(html); //小僧精选内容渲染
                    $(".welfare_choice .more_product").remove();
                }

                if (pageIndexPhy == totalPagePhy || totalPagePhy == 0) {
                    $(".welfare_choice").append('<p class="more_product">没有更多数据</p>');
                } else {
                    $(".welfare_choice").append('<p class="more_product">上拉查看更多商品</p>');
                    //sm_event = showMore(pageIndexPhy, totalPage, welfare_phy, type); //调用加载更多商品方法
                }
            } else {
                $.alertF(data.message)
            }
        });
    }
    //小僧礼券
    function dataListVir(pageIndexVir) {
        var D = {
            "code": category,
            "top": "",
            "size": pageSize,
            "page": pageIndexVir

        }
        $.AkmiiAjaxGet(apiUrl_prefix + "/categories/virtual" + "?size=" + pageSize + "&page=" + pageIndexVir, true).then(function(data) {
            if (data.code == 200) {
                fg = true;
                var phy_list = data.data.recordList;
                var totalCount = data.data.totalCount;
                //var pageSize = data.data.pageSize;
                //var num = Math.ceil(totalCount / pageSize)
                totalPageVir = data.data.totalPage;
                var currentPage = data.data.currentPage;
                //小僧礼券虚拟类型
                var source = $("#welfare_profit").html();
                var render = template.compile(source);
                if (phy_list != null && phy_list != "") {
                    var html = render({
                        list: phy_list || []
                    });
                    $(".welfare_profit").append(html); //小僧礼券内容渲染
                    $(".welfare_profit .more_product").remove();

                }
                //alert(num);
                //num == totalCount
                if (pageIndexVir == totalPageVir || totalPageVir == 0) {
                    $(".welfare_profit").append('<p class="more_product">没有更多数据</p>');

                } else {
                    $(".welfare_profit").append('<p class="more_product">上拉查看更多商品</p>');
                    //sm_event = showMore(pageIndexVir, totalPage, welfare_vir, type); //调用加载更多商品方法
                }
            } else {
                $.alertF(data.message)
            }
        });
    }



    // view.addEventListener("touchstart", start);
    // view.addEventListener("touchmove", move);
    // view.addEventListener("touchend", end);

    //上拉加载更多商品方法
    var flag = 0;

    function start(e) {
        if ($(window).height() + $(document).scrollTop() >= $("body").height()) {
            flag = 1;
        }
    }

    function move() {
        if (flag == 1) {
            flag = 2;
        }
    }

    function end(e) {
        if (flag == 2) {
            if (type == "virtual") { //虚拟类型
                if (pageIndexVir < totalPageVir) {
                    pageIndexVir++;
                    dataListVir(pageIndexVir); //加载小僧礼券虚拟物品数据
                    flag = 0;
                    setTimeout(function() {
                        $("body").scrollTop($(".more_product").position().top)
                    }, 0);
                }
            } else if (type == "physical") { //实物类型
                if (pageIndexPhy < totalPagePhy) {
                    pageIndexPhy++;
                    dataListPhy(pageIndexPhy); //加载小僧精选实物数据
                    flag = 0;
                    setTimeout(function() {
                        $("body").scrollTop($(".more_product").position().top)
                    }, 0);
                }
            }

        }
        flag = 0;
    }



    $(window).scroll(function() {  
        // alert("1");      
        var $this = $(".view"),
                    viewH = $(window).height(), //可见高度
                    contentH = $(".view").height(), //内容高度
                    scrollTop = $(window).scrollTop(); //滚动高度
                //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
               
        if (((scrollTop + viewH) / contentH) >= 1) { //到达底部100px时,加载新内容
            if (fg) {

                if (type == "virtual") { //虚拟类型
                    if (pageIndexVir < totalPageVir) {
                        pageIndexVir++;
                        dataListVir(pageIndexVir); //加载小僧礼券虚拟物品数据
                        fg = false;
                        setTimeout(function() {
                            $("body").scrollTop($(".more_product").position().top)
                        }, 0);
                    }
                } else if (type == "physical") { //实物类型
                    if (pageIndexPhy < totalPagePhy) {
                        pageIndexPhy++;
                        dataListPhy(pageIndexPhy); //加载小僧精选实物数据
                        fg = false;
                        setTimeout(function() {
                            $("body").scrollTop($(".more_product").position().top)
                        }, 0);
                    }
                } 
            }     
        }    
    });

    getrefcodeByInter($.getCookie("userid"), function(referralCode) {
        $.setCookie("refcode", referralCode);
    })
})

function returnDetail(pid, point) {
    if (!$.CheckToken() && appkey == "") {
        if (apptype == "ios") {
            PhoneMode && PhoneMode.callLogin("");
        } else if (apptype == "android") {
            window.PhoneMode && window.PhoneMode.callLogin("");
        } else {
            $.Loginlink(); //未登录状态跳到登录页
        }
    } else {
        window.location.href = '/html/store/conform_exchange.html?pid=' + pid + '&point=' + point;
    }

}

function phy_url(id) {
    window.location.href = '/html/store/choice_detail.html?category=physical&id=' + id + "&type=" + apptype;
}

function vartur_url(id) {
    window.location.href = '/html/store/profit_detail.html?category=virtual&id=' + id + "&type=" + apptype;
}
//var point = 0;//当前兑换商
/**
 * 通过接口获取用户邀请码
 * @param {String} 用户id
 * @param {function} 获取邀请码成功之后回调
 */
function getrefcodeByInter(userId, callback) {
    $.AkmiiAjaxPost(apiUrl_prefix + "/members/referralcode", {
        "accountId": userId
    }, true).then(function(data) {
        if (data.code == 200) {
            callback && callback(data.data.referralcode);
            //referralCode = data.data.referralcode; //邀请码
        }
    });
}