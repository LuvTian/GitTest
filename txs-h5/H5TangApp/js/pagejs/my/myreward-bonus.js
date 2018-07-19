var pageindex1 = 1;
var pageindex2 = 1;
var pageindex3 = 1;
var amount = "";
var minamount = "";
var thirdpartplatform = "";
var couponid = "";
var flag = true;
var coupon_status = "";
$(function() {
        var bodyH = document.body.clientHeight - $(".fixed_top").height();
        $("body").height(bodyH); //设置去除头部fixed部分高度后的body的高度，以免出现滚动条

        //代金券和加息券下拉选择
        $(".JS_choose").click(function() {
            if (flag) {
                $(".choose_favourable").show();
                $(".JS_mask").show();
                $(".triangle").removeClass("triangle_up").addClass("triangle_down");
                flag = false;
                $("body").addClass("noscroll");
            } else {
                $(".choose_favourable").hide();
                $(".JS_mask").hide();
                $(".triangle").removeClass("triangle_down").addClass("triangle_up");
                flag = true;
                $("body").removeClass("noscroll");
            }

        });
        $(".choose_favourable li").click(function() {
            flag = true;
            $(".triangle").removeClass("triangle_down").addClass("triangle_up");
            $(this).addClass("choosed_favourable")
                .siblings().removeClass("choosed_favourable");
            $(".choose_favourable").hide();
            $(".JS_mask").hide();
            $(".title_name").text($(this).text());
            $("body").removeClass("noscroll");
            if ($(this).index() == 1) {
                window.location.href = "/html/my/myreward-ticket.html";
            }
        });
        $(".JS_mask").click(function() {
            flag = true;
            $(".triangle").removeClass("triangle_down").addClass("triangle_up");
            $(this).addClass("choosed_favourable")
                .siblings().removeClass("choosed_favourable");
            $(".choose_favourable").hide();
            $(".JS_mask").hide();
            $("body").removeClass("noscroll");
        });
        if ($.CheckToken()) {
            init();
        } else {
            $.Loginlink(); //未登录状态跳到登录页
        }


        function init() {
            bonus_list(1, pageindex1);
            slider();
        }
        //代金券滑动整屏
        function slider() {
            var width = $("body").width() > 720 ? 720 : $("body").width(); //设置网页最大宽度为720
            $hdpointer = $(".headbnitem");
            $btmpointer = $(".headspitem");
            $hdpointer.width(width);
            $(".headbnlist").width(width * ($hdpointer.size() || 1));
            flipsnap = Flipsnap(".headbnlist", {
                distance: width
            });
            flipsnap.element.addEventListener("fspointmove", function() {
                $hdpointer.filter(".show_item").removeClass("show_item").addClass("hide_item");
                $hdpointer.eq(flipsnap.currentPoint).addClass("show_item").removeClass("hide_item");
                $btmpointer.filter(".tab_selected").removeClass("tab_selected");
                $btmpointer.eq(flipsnap.currentPoint).addClass("tab_selected");
                if (flipsnap.currentPoint == 0) {
                    //alert(flipsnap.currentPoint+'y');
                    bonus_list(1, 1, "slider");
                    $("body").scrollTop(0)
                } else if (flipsnap.currentPoint == 1) {
                    //alert(flipsnap.currentPoint+'z');
                    bonus_list(2, 1, "slider");
                    $("body").scrollTop(0)
                } else if (flipsnap.currentPoint == 2) {
                    bonus_list(3, 1, "slider");
                    $("body").scrollTop(0)
                }

            }, false);
        }


        //代金券tab切换
        $(".JS_bonus_tab li").click(function() {
            var index = $(this).index();
            flipsnap.moveToPoint(index);

        });
    })
    //券列表接口
function bonus_list(status, pageindex, slider) { //status=1未使用,2已使用,3已过期
    var D = {
        "pageindex": pageindex,
        "type": 0,
        "status": status
    }
    $.AkmiiAjaxPost("/StoreServices.svc/user/couponlist", D, false).then(function(data) {
        if (data.result) {
            var couponlist = data.usercouponlist;

            if (couponlist && couponlist.length > 0) {
                if (status == 1) {
                    pageindex1 = parseInt(pageindex) + 1;
                } else if (status == 2) {
                    pageindex2 = parseInt(pageindex) + 1;
                } else if (status == 3) {
                    pageindex3 = parseInt(pageindex) + 1;
                }

                render_html(couponlist, status, slider);
                if (status == 1) {
                    $.LoadMore($(".bonus_list_" + status), null, "bonus_list(" + status + "," + pageindex1 + ")");
                    $(".bonus_content").height(($(".bonus_list_1").height() > 567 ? $(".bonus_list_1").height() : 567));
                } else if (status == 2) {
                    $.LoadMore($(".bonus_list_" + status), null, "bonus_list(" + status + "," + pageindex2 + ")");
                    $(".bonus_content").height(($(".bonus_list_2").height() > 567 ? $(".bonus_list_2").height() : 567));
                } else if (status == 3) {
                    $.LoadMore($(".bonus_list_" + status), null, "bonus_list(" + status + "," + pageindex3 + ")");
                    $(".bonus_content").height(($(".bonus_list_3").height() > 567 ? $(".bonus_list_3").height() : 567));
                }
                $(".JS_use_btn").on("click", function() {
                    var platform = $(this).data("platform");
                    var coupid = $(this).data("coupid");
                    var minamount = $(this).data("minamount");
                    var amount = $(this).data("amount");
                    if (platform == "TXSTZ") { //唐小僧券
                        window.location.href = "/html/product/couponapplyproduct.html?couponid=" + coupid + "&cpamount=" + minamount + "&cpsalemoney=" + amount;
                    } else if (platform == "QJSTZ") { //侨金所券
                        $.showQfax(6, '{"qjsCouponId":"' + coupid + '"}');
                    } else if (platform == "GJSTZ") { //赣金所券
                        $.jumpGJSFax('GJSTZ', 6, '{"qjsCouponId":"' + coupid + '"}');
                    }
                })
            } else {
                $.LoadMore($(".bonus_list_" + status), "没有更多理财代金券了");
                var no_bonus_str = ""; //没有券
                var tmpl_bonus = $("#no_bonus").html();
                var status_name = "";
                if (status == 1) {
                    status_name = "未使用";
                } else if (status == 2) {
                    status_name = "已使用";
                } else if (status == 3) {
                    status_name = "已失效";
                }
                no_bonus_str = tmpl_bonus.replace("{0}", status_name);
                if (status == 1 && pageindex1 == 1) { //未使用
                    $(".bonus_list_1").html(no_bonus_str);
                    $(".bonus_content").height(($(".bonus_list_1").height() > 567 ? $(".bonus_list_1").height() : 567));
                } else if (status == 2 && pageindex2 == 1) { //已使用
                    $(".bonus_list_2").html(no_bonus_str);
                    $(".bonus_content").height(($(".bonus_list_2").height() > 567 ? $(".bonus_list_2").height() : 567));
                } else if (status == 3 && pageindex3 == 1) { //已失效
                    $(".bonus_list_3").html(no_bonus_str);
                    $(".bonus_content").height(($(".bonus_list_3").height() > 567 ? $(".bonus_list_3").height() : 567));
                }
            }

        }
    })
}

function render_html(couponlist, status, slider) {
    var not_use_list = ""; //未使用
    var tmpl_not = $("#not_used").html(); //未使用
    var statusimg = "";
    var platformimg = "";
    var usagedescription = "";
    var description = "";
    var coupon_start_time = "";
    var end_time = "";
    var time = "";
    var startdate = "";
    var now_time = "";
    var time_value = "";
    var btn_text = "";
    var classname = "";
    var suitableproduct = "";

    $.each(couponlist, function(i, item) {
        coupon_status = item.status;
        statusimg = item.statusimg ? '<img src="' + item.statusimg + '" class="bonus_icon"/>' : "";
        platformimg = item.platformimg || "";
        usagedescription = item.usagedescription || ""; //专用通道
        description = item.description; //代金券门槛
        amount = item.amount; //代金券优惠金额
        minamount = item.minamount; //代金券价格
        coupon_start_time = item.couponexpirystartdate; //开始时间 
        end_time = item.enddate; //结束时间
        startdate = item.startdate;
        now_time = (new Date()).getTime();
        time_value = now_time - new Date((coupon_start_time.replace(/\./g, "/"))).getTime(); //new Date中时间格式必须是xxxx/xx/xx不然不兼容IOS端
        thirdpartplatform = item.thirdpartplatform; //会员平台名称TXSTZ； QJSTZ；
        couponid = item.couponid;
        suitableproduct = item.suitableproduct;
        if (time_value < 0 && (coupon_status == 1 || coupon_status == 1000)) { //未使用且还未开始
            btn_text = '<span class="bonus_btn no_start_btn">尚未开始</span>';
            classname = "";
        } else if (time_value >= 0 && coupon_status == 1) { //未使用已经开始
            btn_text = '<span class="bonus_btn use_now_btn">立即使用</span>';
            classname = "JS_use_btn";
        }
        if (coupon_status == 1 || coupon_status == 1000) { //未使用
            time = coupon_start_time + "-" + end_time;
        } else if (coupon_status == 2 || coupon_status == 999) { //已使用
            if (startdate) {
                time = '使用时间：' + startdate;
            } else {
                time = coupon_start_time + "-" + end_time;
            }

        } else if (status == 3) { //已过期
            if (end_time) {
                time = "有效期至：" + end_time;
            } else {
                time = "";
            }
        }

        not_use_list += tmpl_not.replace("{0}", statusimg)
            .replace("{1}", platformimg)
            .replace("{2}", usagedescription)
            .replace("{3}", description)
            .replace("{4}", amount)
            .replace("{5}", time)
            .replace("{6}", btn_text)
            .replace("{7}", suitableproduct)
            .replace("{8}", classname)
            .replace("{9}", thirdpartplatform)
            .replace("{10}", couponid)
            .replace("{11}", minamount)
            .replace("{12}", amount);

    })
    if (slider == "slider") {
        if (coupon_status == 1 || coupon_status == 1000) { //未使用
            $(".JS_not_use").html(not_use_list);
        } else if (coupon_status == 2 || coupon_status == 999) { //已使用
            $(".JS_used").html(not_use_list);
        } else if (coupon_status == 3) { //已过期
            $(".JS_lost_used").html(not_use_list);
        }
    } else {
        if (coupon_status == 1 || coupon_status == 1000) { //未使用
            $(".JS_not_use").append(not_use_list);
        } else if (coupon_status == 2 || coupon_status == 999) { //已使用
            $(".JS_used").append(not_use_list);
        } else if (coupon_status == 3) { //已过期
            $(".JS_lost_used").append(not_use_list);
        }
    }
}