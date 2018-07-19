var currentIndex = 0;
var firstShowIndex = -1;
var datelist = [];
var url;
var appointmentEnd = 6; //售罄/预约满
var defaultDays = 7;
var typename = "";
var calendar_len = 7;

//入口
$(function () {
    typename = decodeURIComponent($.getQueryStringByName("typename"));
    typename && $.UpdateTitle(typename);

    //点击日期切换导航
    $(".product-nav").on("click", "p", function () {
        switch_page($(this).index());
    });
    //查看产品详情
    $("#swiper-wrapper").on("click", "li", function () {
        var pid = $(this).data("pid");
        // history.replaceState({
        //     index: currentIndex
        // }, "预约专区", window.location.pathname + "?index=" + (currentIndex+10));
        window.location.href = "/html/product/productfixeddetail.html?id=" + pid;
    });
    //跳转侨金锁
    $("#swiper-wrapper").on("click", ".redirect-qfax", function () {
        $.showQfax("5");
        return;
    });
    //模拟日期列表
    concatHtml_datelist(simulation_datelist());
    //获取日期列表
    get_date_list();

    correct_dot();
});

//调整日历圆点的宽高
function correct_dot(params) {
    var dot_width = $(".dot").width();
    dot_width && ($(".dot").width(dot_width), $(".dot").height(dot_width));
}

//切换导航
function switch_page(index) {
    $(".product-nav > p").eq(index).addClass("active").siblings().removeClass("active");
    $(".nav-progress").css("transform", "translateX(" + Number(0.8 + (index * 14.4 / calendar_len)) + "rem)");
    if (currentIndex != index) {
        $('html,body').animate({
            scrollTop: "0px"
        }, 20);
    }
    currentIndex = index;
    swiperobj.switchswiper(currentIndex);
    //获取对应页面的预约产品
    get_appointment_productlist(currentIndex);
    history.replaceState({
        index: currentIndex
    }, "预约专区", window.location.pathname + "?index=" + (currentIndex + 10) + (typename ? "&typename=" + typename : ""));
}

//获取预约产品的日历
function get_date_list() {
    url = "/StoreServices.svc/reservationzone/reservationdatelist";
    $.AkmiiAjaxPost(url, {}, false).then(function (data) {
        /*
        //测试数据
        data = {
            "reservationinfodatelist": [{
                "isexistreservationproduct": true,
                "reservationzonedate": "2017-11-14",
                "dayofweek": "明天"
            }, {
                "isexistreservationproduct": false,
                "reservationzonedate": "2017-11-15",
                "dayofweek": "周三"
            }, {
                "isexistreservationproduct": true,
                "reservationzonedate": "2017-11-16",
                "dayofweek": "周四"
            }],
            "methodname": null,
            "platformtype": 0,
            "errorcode": null,
            "errormsg": null,
            "suberrorcode": null,
            "suberrormsg": null,
            "result": true,
            "date": "2017/11/13 17:14:12",
            "isinglobalmaintenance": false
        } */
        

        if (data.result) {
            var list = data.reservationinfodatelist;
            calendar_len = list.length;
            add_product_html(list.length);
            swiperobj.init(switch_page);
            datelist = list;
            concatHtml_datelist(list);
            $(".nav-progress").width(14.4 / calendar_len + "rem");
        }
    });
}

//在html中添加产品列表len个容器
function add_product_html(len) {
    var _ha = [];
    for (var i = 0; i < len; i++) {
        _ha.push('<div class="swiper-slide"></div >');
    }
    $("#swiper-wrapper").html(_ha.join(''));
}

//模拟预约产品日历
function simulation_datelist() {
    var list = [],
        simulation_date;
    for (i = 0; i < defaultDays; i++) {
        simulation_date = export_date(i + 1);
        if (i == 0) {
            list.push({
                reservationzonedate: simulation_date.day,
                dayofweek: "明天",
                isexistreservationproduct: false
            });
        } else {
            list.push({
                reservationzonedate: simulation_date.day,
                dayofweek: "周" + simulation_date.week,
                isexistreservationproduct: false
            });
        }
    }
    list.issimulation = true;
    return list;
}

//导出模拟的预约日历
function export_date(addedValue) {
    var initialDate = new Date().addDays(addedValue);
    return {
        day: initialDate,
        week: "日一二三四五六".charAt(initialDate.getDay())
    };
}

//拼接预约日历列表
function concatHtml_datelist(list) {
    var ha = [];
    for (var i = 0; i < list.length; i++) {
        if (firstShowIndex == -1 && list[i].isexistreservationproduct) {
            firstShowIndex = i;
            currentIndex = i;
        }
        ha.push('<p class="' + (i == 0 ? "active" : "") + '">');
        ha.push('<span>' + new Date((list[i].reservationzonedate + "").replace(/-/g, "/")).Format("DD") + '</span>');
        ha.push('<z>' + list[i].dayofweek + '</z>');
        ha.push('<b class="dot ' + (list[i].isexistreservationproduct ? "" : "visib-hide") + '"></b>');
        ha.push('</p>');
        if (i == list.length - 1) {
            ha.push('<p class="nav-progress"></p><p class="nav-progress-bg"></p>');
        }
    }
    $(".product-nav").html($(ha.join('')));
    if (!list.issimulation) {
        var _index = $.getQueryStringByName("index")
        if (_index) {
            switch_page(_index - 10);
        } else {
            //定位到第一个有预约产品的页面
            switch_page(currentIndex);
        }
    }
    correct_dot();
}

//获取某一天的预约产品列表
function get_appointment_productlist(index) {
    var item = datelist[index];
    if ($("#swiper-wrapper .swiper-slide").eq(index).find("ul.product-list").length == 0 &&
        $("#swiper-wrapper .swiper-slide").eq(index).find(".no-products-warp").length == 0) {
        productlist_post(item.reservationzonedate, index);
    }
    // else {
    //     if ($("#swiper-wrapper .swiper-slide").eq(index).find(".no-products-warp").length == 0) {
    //         concatHtml_productlist("", index);
    //     }
    // }
}

//获取某一天的预约产品列表--post
function productlist_post(date, index) {
    url = "/StoreServices.svc/reservationzone/reservationproductlist";
    $.AkmiiAjaxPost(url, {
        date: date
    }, false).then(function (data) {
        if (data.result) {
            concatHtml_productlist(data.productlist, index);
        }
    });
}

//拼接预约产品列表，暂时没有调试
function concatHtml_productlist(product, index) {
    var ha = [];
    if (product && product.length > 0) {
        for (var j = 0; j < product.length; j++) {
            var rateact = product[j].rateactivite > 10 ? 9.99 : product[j].rateactivite;
            var actrateHtml = product[j].rateactivite > 0 ? "<div class='productactrate'>{0}</div>".replace("{0}", formatActityRate(rateact)) : "";

            ha.push('<li data-pid=' + product[j].productid + '>');
            if (product[j].status == appointmentEnd) {
                ha.push('<span class="appointment-end"></span>');
            }
            ha.push('<p class="product-name">' + product[j].title + '</p>');
            ha.push('<div class="product-info">');
            ha.push('<div class="productInterestRates">');
            ha.push('<div>' + product[j].rate + '<span class="unit">%</span>');
            ha.push(actrateHtml);
            ha.push('</div>');
            ha.push('<p class="desc">' + product[j].ratedesc + '</p>');
            ha.push('</div>');
            ha.push('<div class="productTimeLimit">');
            ha.push('<div class="product-due">');
            ha.push('<span class="num">' + product[j].duration + '</span>');
            ha.push('<span class="unit"> ' + product[j].durationsuffix + '</span>');
            ha.push('</div>');
            ha.push('<p class="desc"><span>' + $.fmoney(product[j].amountmin, 0, 0) + '</span>' + product[j].minamountsuffix + '</p>');
            ha.push('</div>');
            ha.push('</div>');
            ha.push('</li>');
        }
        $("#swiper-wrapper .swiper-slide").eq(index).html($('<a href="javascript:void(0);" class="visit-qfax redirect-qfax"></a><ul class="product-list">' + ha.join('') + '</ul>'));
    } else {
        ha.push('<div class="no-products-warp">');
        ha.push('<div class="no-products">');
        ha.push('</div>');
        ha.push('<p>当前无可预约产品</p>');
        ha.push('<a href="javascript:void(0);" class="redirect-qfax">去看看金融资产交易中心其他产品</a>');
        ha.push('</div>');
        $("#swiper-wrapper .swiper-slide").eq(index).html(ha.join(''));
    }
}

function formatActityRate(actityrate) {
    if (actityrate > 0) {
        return "+" + $.fmoney(actityrate) + "%";
    } else {
        return "";
    }
}
//滑动
var swiperobj = {
    swiper: document.getElementById("swiper-wrapper"),
    item_length: 0,
    item_width: 0,
    index: 0,
    horizontalSliding: false,
    checkDirectionEnd: false,
    endPos: {},
    startPos: {},
    callback: {},
    init: function (callback) {
        this.callback = callback;
        for (var i = 0; i < this.swiper.children.length; i++) {
            this.swiper.children[i].addEventListener('touchstart', this.touchstart.bind(this), false);
            this.swiper.children[i].addEventListener('touchmove', this.touchmove.bind(this), false);
            this.swiper.children[i].addEventListener('touchend', this.touchend.bind(this), false);
        }
        this.item_length = this.swiper.children.length;
        this.item_width = Number(window.getComputedStyle(this.swiper, null).width.replace("px", ""));
    },
    touchstart: function (event) {
        var touch = event.targetTouches[0];
        this.startPos = {
            x: touch.pageX,
            y: touch.pageY,
            time: +new Date
        };
        // swiper.addEventListener('touchmove', touchmove, false);
        // swiper.addEventListener('touchend', touchend, false);
    },
    touchmove: function (event) {
        if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        var touch = event.targetTouches[0];
        this.endPos = {
            x: touch.pageX - this.startPos.x,
            y: touch.pageY - this.startPos.y
        };
        var lastDistance = (Number(-this.index * this.item_width) + Number(this.endPos.x));
        if (!this.checkDirectionEnd) {
            if (Math.abs(this.endPos.x) > 10 || Math.abs(this.endPos.y) > 10) {
                this.checkDirectionEnd = true;
                if (Math.abs(this.endPos.x) < Math.abs(this.endPos.y)) {
                    this.horizontalSliding = false;
                } else {
                    this.horizontalSliding = true;;
                }
            }
        }
        if (this.horizontalSliding) {
            event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
            this.swiper.style.transition = "-webkit-transform 0ms ease-out";
            this.swiper.style.webkitTransform = "translate3d(" + lastDistance + "px,0px,0px)";
        }

    },
    touchend: function (event) {
        var duration = +new Date - this.startPos.time; //滑动的持续时间
        if (this.horizontalSliding) { //当为水平滚动时
            if (Number(duration) > 10) {
                //判断是左移还是右移，当偏移量大于10时执行
                if (this.endPos.x > 10) {
                    if (this.index !== 0) this.index -= 1;
                } else if (this.endPos.x < -10) {
                    if (this.index !== this.item_length - 1) this.index += 1;
                }
            }
            this.swiper.style.transition = "-webkit-transform 200ms ease-out";
            this.swiper.style.webkitTransform = "translate3d(" + -this.index * this.item_width +
                "px,0px,0px)";
        }
        this.checkDirectionEnd = false;
        this.startPos = {
            x: 0,
            y: 0,
            time: ""
        };
        this.endPos = {
            x: 0,
            y: 0
        };
        this.callback(this.index);
    },
    switchswiper: function (index) {
        this.index = index;
        this.swiper.style.transition = "-webkit-transform 200ms ease-out";
        this.swiper.style.webkitTransform = "translate3d(" + -index * this.item_width +
            "px,0px,0px)";
    }
}

// data = {
//     list: [{
//             product: [{
//                     title: "金刚1",
//                     id: "913679094531624960"
//                 },
//                 {
//                     title: "金刚2",
//                     id: "913679094531624960"
//                 }
//             ]
//         },
//         {
//             product: [{
//                     title: "金刚3",
//                     id: "913679094531624960"
//                 },
//                 {
//                     title: "金刚4",
//                     id: "913679094531624960"
//                 }
//             ]
//         },
//         {
//             product: []
//         },
//         {
//             product: [{
//                     title: "金刚5",
//                     id: "913679094531624960"
//                 },
//                 {
//                     title: "金刚6",
//                     id: "913679094531624960"
//                 }
//             ]
//         },
//         {
//             product: [{
//                     title: "金刚7",
//                     id: "913679094531624960"
//                 },
//                 {
//                     title: "金刚8",
//                     id: "913679094531624960"
//                 }
//             ]
//         },
//         {
//             product: [{
//                     title: "金刚9",
//                     id: "913679094531624960"
//                 },
//                 {
//                     title: "金刚10",
//                     id: "913679094531624960"
//                 }
//             ]
//         },
//         {
//             product: [{
//                     title: "金刚11",
//                     id: "913679094531624960"
//                 },
//                 {
//                     title: "金刚12",
//                     id: "913679094531624960"
//                 }
//             ]
//         }
//     ],
//     result: true
// }