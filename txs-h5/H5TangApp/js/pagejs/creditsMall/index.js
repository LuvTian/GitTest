// var apiUrl_prefix="http://192.168.90.140:8999";
var userId = $.getCookie("userid");

$(function() {
    renderHeadBottomBanner();
    welfare.getPhysical_list();
    welfare.getVirtual_list();
    welfare.getMemberInfo();

    footerBar.highlight(3); //高亮底部菜单
    $.setLS('currtype', 0);

    initZdq($.getLS("refcode"));

    $("#mainBody").append('<div class="bottom"><img src="' + $.resurl() + '/css/img2.0/pointImg/welfare_emotionImg.png" class="bottom_pic"/></div>');
})


function renderHeadBottomBanner() {

    $.AkmiiAjaxGet(apiUrl_prefix + "/operation/new_welfare").then(function(d) {
        if (d.code == "200") {
            if (d.data.welfare_top_new_banner.length > 0) {
                var data = d.data.welfare_top_new_banner;
                $.each(data, function(k, v) {
                    $("#headBannerPanel").append("<li><a href='" + v.linkAddress + "'><img src='" + v.logoPic + "' onerror='onerror=null;src=\'" + $.resurl() + "/css/img2.0/pointImg/banner-default@2x.png\'  /></a></li>");
                    $(".headsp").append('<div class="headspitem"></div>');
                })
                if (data.length == 0) {
                    $("#headBannerPanel").append("<li><img src='" + $.resurl() + "/css/img2.0/pointImg/banner-default@2x.png' /></li>");
                }



                $(".headspitem:first").addClass("cur");

                var width = $("body").width();
                $("#headBannerPanel").width(width * data.length);
                $("#headBannerPanel img").width(width);
                var flipsnap = Flipsnap("#headBannerPanel", {
                    distance: width
                });



                var setAnimate = function() {
                    // 两张才进行轮播
                    if (data.length > 1) {
                        intTimer = setInterval(function() {
                            if (flipsnap.currentPoint == $btmpointer.size() - 1) {
                                flipsnap.moveToPoint(0);
                            } else {
                                flipsnap.toNext();
                            }
                        }, 5000);
                    }
                };

                $hdpointer = $(".headbnitem");
                $btmpointer = $(".headspitem");

                flipsnap.element.addEventListener("fspointmove", function() {
                    $btmpointer.filter(".cur").removeClass("cur");
                    $btmpointer.eq(flipsnap.currentPoint).addClass("cur");
                }, false);
                flipsnap.element.addEventListener('fstouchstart', function(ev) {
                    clearInterval(intTimer);
                }, false);
                flipsnap.element.addEventListener('fstouchend', function(ev) {
                    setAnimate();
                }, false);

                setAnimate();
            }
            if (d.data.welfare_bottom_new_ad.length > 0) {
                var data = d.data.welfare_bottom_new_ad[0];
                $("#bottomBanner").append('<a href="' + data.linkAddress + '"><img src="' + data.logoPic + '" onerror="onerror=null;src=\'' + $.resurl() + '/css/img2.0/pointImg/under-banner@2x.png\'" alt="" style="width:100%;display:block;height: 4.693333rem;"></a>')
                $("#bottomBanner").show();
            }
        } else {
            $.alertF(data.message);
        }
    })




}





var welfare = {
    size: 10,
    page: 1,
    physical_tpl: '<li onclick="welfare.jumpToDetail(\'{0}\');{5}">\
					<div class="product">\
						<div class="tagsContainer">{6}</div>\
						<img class="productImg" src="{1}" onerror="onerror=null;src=\'' + $.resurl() + '/css/img2.0/pointImg/product-default@2x.png\'" alt="" />\
					</div>\
					<div class="productName">{2}</div>\
					<div class="exchangeAmount"><span>{3}</span> 唐果 <b>{4}</b></div>\
				</li>',
    virtual_tpl: '<li onclick="welfare.jumpToDetail(\'{0}\');{7}">\
					<div class="quan">\
						<div class="tagsContainer">{8}</div>\
						<img class="quanImg" src="{1}" alt="" onerror="onerror=null;src=\'' + $.resurl() + '/css/img2.0/pointImg/ticket-default1@2x.png\'"/>\
						<div class="quanDesc">{2}<span>{3}</span></div>\
						<div class="quanType">{9}</div>\
					</div>\
					<div class="quanName">{4}</div>\
					<div class="exchangeAmount"><span>{5}</span> 唐果 <b>{6}</b></div>\
				</li>',
    getPhysical_list: function() {
        this._getCategoriesList("physical");
    },
    getVirtual_list: function() {
        this._getCategoriesList("virtual");
    },
    _getCategoriesList: function(code) {
        $.AkmiiAjaxGet(apiUrl_prefix + "/categories/top/" + code + "?size=" + this.size + "&page=" + this.page + "&userid=" + userId).then(function(d) {
            if (d.code == 200) {
                $.setLS(code, JSON.stringify(d.data.recordList));
                if (code == "physical") {
                    welfare.renderPhysicalHtml(d.data.recordList, welfare.physical_tpl, "selectedItems");
                }
                if (code == "virtual") {
                    welfare.renderVirtualHtml(d.data.recordList, welfare.virtual_tpl, "welfareList");
                }
            }
        })
    },
    renderPhysicalHtml: function(data, tpl, target_id) {
        var temp = "";
        if (data.length == 0) {
            $("#selectedContainer").hide();
        } else {
            for (var i = 0; i < data.length; i++) {
                var url = "choice_detail.html?category=physical&id=" + data[i].id;
                var tpl_tag = "<span class='tag{0}'>{1}</span>";
                var tags = "";
                for (var j = 0; j < data[i].tags.length; j++) {
                    var tag = data[i].tags[j];
                    if (tag.tag && tag.tag.length) {
                        tags += tpl_tag.format(tag.type, tag.tag);
                    }
                }
                var inventory = "";
                if (data[i].inventory) {
                    inventory = "仅剩" + data[i].inventory + "份";
                } else {
                    inventory = "售罄";
                }
                temp += tpl.format(
                    url,
                    data[i].mainImgUrl || "",
                    data[i].name || "",
                    data[i].pointPayAmount || "",
                    inventory,
                    "_hmt.push(['_trackEvent', 'Integral Mall', 'Display_ObjBan" + i + "', '福利-小僧精选实物" + i + "', '福利-小僧精选实物']);",
                    tags
                );
            }
            $("#" + target_id).append(temp);
            //修正那些宽大于高的图片显示
            $(".product .productImg").css("height", $(".product").css("width"));
        }
    },
    renderVirtualHtml: function(data, tpl, target_id) {
        var temp = "";
        if (data.length == 0) {
            $("#welfareContainer").hide();
        } else {
            for (var i = 0; i < data.length; i++) {
                var url = "profit_detail.html?category=virtual&id=" + data[i].id;
                var type = data[i].itemType;
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
                if (data[i].inventory <= 0) {
                    clickEvent = "function(e){e.stopPropagation();}";
                    coverImg = $.resurl() + "/css/img2.0/pointImg/sellout.png";
                }
                var tpl_tag = "<span class='tag{0}'>{1}</span>";
                var tags = "";
                for (var j = 0; j < data[i].tags.length; j++) {
                    var tag = data[i].tags[j];
                    if (tag.tag && tag.tag.length) {
                        tags += tpl_tag.format(tag.type, tag.tag);
                    }
                }
                var inventory = "";
                if (data[i].inventory) {
                    inventory = "仅剩" + data[i].inventory + "份";
                } else {
                    inventory = "售罄";
                }
                temp += tpl.format(
                    url,
                    imgSrc,
                    data[i].virtualAmount || "",
                    data[i].unit || "",
                    data[i].name || "",
                    data[i].pointPayAmount || "",
                    inventory,
                    "_hmt.push(['_trackEvent', 'Integral Mall', 'Display_Fictitious Ban" + i + "', '福利-小僧礼券入口" + i + "', '福利-小僧礼券入口']);",
                    tags,
                    data[i].virtualDesc1 || ""
                );
            }
            $("#" + target_id).append(temp);
        }
    },
    getMemberInfo: function() {
        if (!$.CheckToken()) {
            return;
        }
        var data = {
            "id": this.checkLogin()
        }
        $.AkmiiAjaxPost(apiUrl_prefix + "/members/info", data, false).then(function(d) {
            $(".tangguoNum span").text(d.data.points)
            $.setLS("points", d.data.points);
        })
    },
    getSurroundingWelfare: function() {
        getNearest();
    },
    getBanner: function() {
        $.AkmiiAjaxGet(apiUrl_prefix + "/home/banner").then(function(d) {
            if (d.code == 200) {
                $("#advertisementContainer a").attr("href", d.data.bannerUrl);
                $("#advertisementContainer img").attr("src", d.data.homeBanner);
            }
        })
    },
    jumpToDetail: function(url, _checkLogin) {
        if (_checkLogin) {
            this.checkLogin;
        }
        window.location.href = url;
    },
    checkLogin: function() {
        if ($.getCookie("MadisonToken") && $.getCookie("userid")) {
            return $.getCookie("userid");
        } else {
            document.location.href = "/html/Anonymous/login.html?returnUrl=/html/store/"
        }
    }
}

function jumpUrlWithLogin(url) {
    $.checkLogin(url);
}

function jumpUrlWithOutLogin(url) {
    window.location.href = url;
}