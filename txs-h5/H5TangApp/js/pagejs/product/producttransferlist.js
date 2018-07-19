var pageindex = 1;
var orderbytype = 0;
var upordown = 0;
var temp = 0; //（1是点击加载更多就不清楚原来的html）
var yuqiyeartemp = 0; //(期望年化0是顺序1是倒叙)
var durationtemp = 0; //(剩余期限0是顺序1是倒叙)
var transfertemp = 0; //(转让价格0是顺序1是倒叙)
$(function() {
    producttransferlist(pageindex, temp);
    loadBanner();
    // if ($.getCookie("MadisonToken")) {
    //     $.getMitteilung($("#myicon"));
    // }
});

//变现专区列表
function producttransferlist(pageindex, temp) {
    var url = "/StoreServices.svc/product/producttransferlist";
    var data = {
        pageindex: pageindex,
        pagesize: 10,
        orderbytype: orderbytype,
        upordown: upordown
    };
    $.AkmiiAjaxPost(url, data, true).then(function(d) {
        if (d.result) {
            if (temp <= 0) {
                $("#producttransferlist").html('');
            }
            if (d.producttransferlist.length != 0) {
                var ha = [];
                $.each(d.producttransferlist, function(index, item) {
                    ha.push('<article class="fund-list bg-white mb8" data-pid="' + item.producttransferid + '">');
                    ha.push('<div class="atricleclick">');
                    ha.push('<div class="pltitle oh">');
                    ha.push('<span class="ptt left">' + item.title + '</span>');
                    ha.push('</div>');
                    ha.push('<div class="small-12 left">');
                    ha.push('<div class="row earnings-title">');
                    ha.push('<div class="small-4 left">期望年化收益率</div>');
                    ha.push('<div class="small-3 left text-right">剩余期限</div>');
                    ha.push('<div class="small-5 left text-right">转让价格</div>');
                    ha.push('</div>');
                    ha.push('<div class="row earnings">');
                    ha.push('<div class="small-4 left red">');
                    ha.push('<span class="enumber">' + $.fmoney(item.transferrate) + '</span><span class="epercent">%</span>');
                    ha.push('</div>');
                    ha.push('<div class="small-3 mid left text-right">');
                    ha.push('<span class="edays">' + item.remainingday + '</span>天</div>');
                    ha.push('<div class="small-5 mid left text-right right">');
                    ha.push('<span class="edays">' + $.fmoney(item.transferamount) + '</span>元');
                    ha.push('</div></div></div></div></article>');
                });
                var html = $(ha.join(""));
                html.click(function() {
                    var producttransferid = $(this).attr("data-pid");
                    window.location.href = "/html/product/producttransferdetail.html?producttransferid=" + producttransferid;
                    return false;
                });
                $("#producttransferlist").append(html);
                if (d.producttransferlist.length > 0) {
                    $.LoanMore($("#producttransferlist"), null, "producttransferlist(" + (pageindex += 1) + ")");
                } else {
                    $.LoanMore($("#producttransferlist"), "没有更多变现产品了");
                }
            } else {
                $.LoanMore($("#producttransferlist"), "没有更多变现产品了");
            }
        }
    });
}

/*活动banner*/
var loadBanner = function() {
    var data = {
        "type": "TopBanner"
    };
    $.AkmiiAjaxPost("/StoreServices.svc/anonymous/system/getbannerbytype", data, true).then(function(d) {
        $.preloaderFadeOut();
        if (d.result) {
            if (d.appbanners.length > 0) {
                var ha = [];
                var hao = [];
                $.each(d.appbanners, function(i, item) {
                    ha.push("<li class=\"\" onclick=\"javascript:window.location.href='" + item.link + "'\">");
                    ha.push("<img src=\"" + item.imageurl + "\" class=\"img-responsive new-img-res\" /></li>");
                    hao.push("<li class=\"\" data-orbit-slide=\"" + i + "\"></li>");
                });

                $("#divbanner").empty().html(ha.join(''));
                $(".orbit-bullets").empty().html(hao.join(''));
                $._imgLoad($("#divbanner").find("img"), function(img) {
                    $(img).attr("src", $(img).attr("data-src"));
                });
                $(document).foundation({
                    orbit: {
                        animation: 'slide',
                        pause_on_hover: false,
                        animation_speed: 5,
                        navigation_arrows: true,
                        bullets: false
                    }
                });
            }
        }
    }, function() {
        $.preloaderFadeOut();
    });
}

$(".current > .viewport.scroll").scroll(function(e) {
    //e.preventDefault();
    if ($(this).scrollTop() > 180) {
        $(".finances-nav").hide();
        $("#ptstitle").show();
        $(".fund-header").show().addClass("fix_top_s")
        $(".relize_eara > .fund-list").eq(0).addClass("mt-36")
    } else if ($(this).scrollTop() == 0) {
        $(".finances-nav").show();
        $("#ptstitle").hide();
        $(".fund-header").hide()
        $(".relize_eara > .fund-list").eq(0).removeClass("mt-36")
    }
})

//期望年化（样式）
function yuqiyear() {
    $(".fund-header-icontop").removeClass("active");
    $(".fund-header-iconbottom").removeClass("active");
    $("#orderByType2").addClass("yuqi-year");
    $("#orderByType3").addClass("yuqi-year");
}
//剩余期限（样式）
function duration() {
    $(".fund-header-icontop").removeClass("active");
    $(".fund-header-iconbottom").removeClass("active");
    $("#orderByType1").addClass("yuqi-year");
    $("#orderByType3").addClass("yuqi-year");
}
//转让价格（样式
function transfermoney() {
    $(".fund-header-icontop").removeClass("active");
    $(".fund-header-iconbottom").removeClass("active");
    $("#orderByType1").addClass("yuqi-year");
    $("#orderByType2").addClass("yuqi-year");
}

//期望年化
$("#orderByType1").click(function() {
    if (yuqiyeartemp == 0) {
        yuqiyeartemp = 1;
        durationtemp = 0;
        transfertemp = 0;
        orderbytype = 1;
        upordown = 1;
        yuqiyear();
        $("#orderByType1-ReverseOrder").addClass("active"); //小箭头
        $(this).removeClass("yuqi-year");
        producttransferlist(pageindex, temp);
    } else {
        yuqiyeartemp = 0;
        durationtemp = 0;
        transfertemp = 0;
        orderbytype = 1;
        upordown = 0;
        yuqiyear();
        $("#orderByType1-order").addClass("active"); //小箭头
        $(this).removeClass("yuqi-year");
        producttransferlist(pageindex, temp);
    }

});
//剩余期限
$("#orderByType2").click(function() {
    if (durationtemp == 0) {
        durationtemp = 1;
        yuqiyeartemp = 0;
        transfertemp = 0;
        orderbytype = 2;
        upordown = 0;
        duration();
        $("#orderByType2-order").addClass("active"); //小箭头
        $(this).removeClass("yuqi-year");
        producttransferlist(pageindex, temp);
    } else {
        durationtemp = 0;
        yuqiyeartemp = 0;
        transfertemp = 0;
        orderbytype = 2;
        upordown = 1;
        duration();
        $("#orderByType2-ReverseOrder").addClass("active"); //小箭头
        $(this).removeClass("yuqi-year");
        producttransferlist(pageindex, temp);
    }

});
//转让价格
$("#orderByType3").click(function() {
    if (transfertemp == 0) {
        transfertemp = 1;
        durationtemp = 0;
        yuqiyeartemp = 0;
        orderbytype = 3;
        upordown = 0;
        transfermoney();
        $("#orderByType3-order").addClass("active"); //小箭头
        $(this).removeClass("yuqi-year");
        producttransferlist(pageindex, temp);
    } else {
        transfertemp = 0;
        durationtemp = 0;
        yuqiyeartemp = 0;
        orderbytype = 3;
        upordown = 1;
        transfermoney();
        $("#orderByType3-ReverseOrder").addClass("active"); //小箭头
        $(this).removeClass("yuqi-year");
        producttransferlist(pageindex, temp);
    }

});