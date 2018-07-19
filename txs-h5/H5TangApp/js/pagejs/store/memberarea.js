// var apiUrl_prefix="";//测试用
var userId = $.getCookie("userid");
$(function () {
    welfare.getData();
    $(".loadMore").click(function () {
        welfare.getData();
    })
})




var welfare = {
    size: 10,
    page: 1,
    loadingData: false,
    physical_tpl: '<li onclick="welfare.jumpToDetail(\'{0}\');{5}">\
					<div class="product">\
						<div class="tagsContainer">{6}</div>\
						<img class="productImg" src="{1}" onerror="onerror=null;src=\'' + $.resurl() + '/css/img2.0/pointImg/product-default@2x.png\'" alt="" />\
					</div>\
					<div class="productName">{2}</div>\
					<div class="exchangeAmount"><span>{3}</span> 唐果 <b>{4}</b></div>\
				</li>',
    virtual_tpl: '<li class="virtual" onclick="welfare.jumpToDetail(\'{0}\');{7}">\
					<div class="quan">\
						<div class="tagsContainer">{8}</div>\
						<img class="quanImg" src="{1}" alt="" onerror="onerror=null;src=\'' + $.resurl() + '/css/img2.0/pointImg/ticket-default1@2x.png\'"/>\
						<div class="quanDesc">{2}<span>{3}</span></div>\
						<div class="quanType">{9}</div>\
					</div>\
					<div class="quanName">{4}</div>\
					<div class="exchangeAmount"><span>{5}</span> 唐果 <b>{6}</b></div>\
				</li>',
    renderPhysicalHtml: function (data) {
        var tpl = this.physical_tpl;
        var temp = "";
        var url = "/html/store/choice_detail.html?category=physical&id=" + data.id;
        var tpl_tag = "<span class='tag{0}'>{1}</span>";
        var tags = "";
        if (data.tags) {
            for (var j = 0; j < data.tags.length; j++) {
                var tag = data.tags[j];
                tags += tpl_tag.format(tag.type, tag.tag);
            }
        }
        var inventory = data.originPoint + "唐果";
        // if (data.inventory) {
        //     inventory = "仅剩" + data.inventory + "份";
        // } else {
        //     inventory = "售罄";
        // }
        temp += tpl.format(
            url,
            data.imgUrl || "",
            data.name || "",
            data.afterPoint || "",
            inventory,
            "_hmt.push(['_trackEvent', 'Integral Mall', 'Display_ObjBan', '福利-小僧精选实物', '福利-小僧精选实物']);",
            tags
        );
        $(".listContainer").append(temp);
        //修正那些宽大于高的图片显示
        var imgWidth = $(".product").css("width");
        $(".product .productImg").css({
            "height": imgWidth,
            "width": imgWidth
        });
    },
    renderVirtualHtml: function (data) {
        var tpl = this.virtual_tpl;
        var temp = "";
        var url = "/html/store/profit_detail.html?category=virtual&id=" + data.id;
        var type = data.itemType;
        var imgSrc = $.resurl() + "/css/img2.0/pointImg/";
        switch (type) {
            case "INTEREST":
                imgSrc += "quanBG_jxq.png";
                break;
            case "CINEMA_TICKET":
                imgSrc += "quanBG_dyp.png";
                break;
            case "PHONE_TRAFFIC":
                imgSrc += "quanBG_llq.png";
                break;
            case "COUPON":
                imgSrc += "quanBG_djq.png";
                break;
            case "FINANCIAL":
                imgSrc += "quanBG_lcj.png";
                break;
            case "REFUELING_CARD":
                imgSrc += "quanBG_jyk.png";
                break;
            default:
                imgSrc += "quanBG_qtq.png";

        }
        var coverImg = $.resurl() + "/css/img2.0/pointImg/convert.png";
        if (data.inventory <= 0) {
            clickEvent = "function(e){e.stopPropagation();}";
            coverImg = $.resurl() + "/css/img2.0/pointImg/sellout.png";
        }
        var tpl_tag = "<span class='tag{0}'>{1}</span>";
        var tags = "";
        if (data.tags) {
            for (var j = 0; j < data.tags.length; j++) {
                var tag = data.tags[j];
                tags += tpl_tag.format(tag.type, tag.tag);
            }
        }
        var inventory = data.originPoint + "唐果";
        // if (data.inventory) {
        //     inventory = "仅剩" + data.inventory + "份";
        // } else {
        //     inventory = "售罄";
        // }
        temp += tpl.format(
            url,
            imgSrc,
            data.virtualAmount || "",
            data.unit || "",
            data.name || "",
            data.afterPoint || "",
            inventory,
            "_hmt.push(['_trackEvent', 'Integral Mall', 'Display_Fictitious Ban', '福利-小僧礼券入口', '福利-小僧礼券入口']);",
            tags,
            data.virtualDesc1 || ""
        );



        $(".listContainer").append(temp);


    },
    jumpToDetail: function (url) {
        window.location.href = url;
    },
    repairHeigh: function () {
        var imgWidth = $(".product").width();
        var rate = 318 / 201; //图片加载慢时获取不到高度，现按固定比例修改
        var imgHeight = imgWidth / rate;
        $(".listContainer li.virtual").each(function (k, v) {
            var tmp = $(v);
            var quan = tmp.find(".quan");
            quan.css("height", imgWidth + "px");
            var quanImg = quan.find(".quanImg");
            var mg = (imgWidth - imgHeight) / 2;
            quanImg.css("marginTop", mg + "px");
            var quanDesc = quan.find(".quanDesc");
            quanDesc.css("top", (quanDesc.position().top + mg) + "px");
            var quanType = quan.find(".quanType");
            quanType.css("top", (quanType.position().top + mg) + "px");
        })
    },
    checkMoreData: function (f) {
        $(".loadMore").show();
        if (f) {
            $(".loadMore").text("点击查看更多商品");
        } else {
            $(".loadMore").text("没有更多数据").unbind("click");
        }
    },
    getData: function () {
        if (!this.loadingData) {
            this.loadingData = true;
            $.AkmiiAjaxGet(apiUrl_prefix + "/promotion/exclusive/current?id=" + userId + "&page=" + this.page + "&size=" + this.size, false).then(function (d) {
                this.loadingData = false;
                if (d.code == 200) {
                    welfare.page++;
                    welfare.checkMoreData(d.data.hasNext);
                    //渲染福利内容
                    if (d.data.recordList && d.data.recordList.length > 0) {
                        $.each(d.data.recordList, function (k, v) {
                            if (v) {
                                switch (v.itemType) {
                                    case "PHYSICAL":
                                        welfare.renderPhysicalHtml(v);
                                        break;
                                    default:
                                        welfare.renderVirtualHtml(v);
                                        break;
                                }
                            }
                        })
                        welfare.repairHeigh();
                        if($(".listContainer li").length==0){
                            $(".loadMore").hide();
                            $("#mainBody").addClass("noData");
                        }
                    } else {
                        if ($(".listContainer li").length == 0) {
                            $(".loadMore").hide();
                            $("#mainBody").addClass("noData");
                        }
                    }
                } else {
                    $.alertF(d.message);
                }
            });
        }
    }
}