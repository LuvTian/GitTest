var bgColor = ["", "#C1966F", "#A4B4B9", "#E7A850", "#7F87B4"];

var userId = $.getCookie("userid");
// var userId ="HwhI7Pxdu81CkuawdRV5gSuqGMYLQcE7fSFSbdolb3o=";

var member = {
    level: 1,
    contributions: 0, //贡献值
    point: 0, //积分
    levelName: '',
    lastLevelDays: 0 //等级持续时间
}


$(function () {
    getUserInfo(getPrivilegesByid);
    $("#mainBody").delegate(".btn_showUpWin","click",function () {
        $(".upPopWin").show();
    })
    $(".upPopWin .up_cose").click(function () {
        $(".upPopWin").hide();
    })
})

function getPrivilegesByid() {
    var id = $.getQueryStringByName("id");
    var getAllPrivileges_url = apiUrl_prefix + "/vipcenter/privilege/single";
    $.AkmiiAjaxPost(getAllPrivileges_url, {
        privlegeId: id,
        id: userId
    }, false).then(function (d) {
        if (d.code == 200) {
            $(".privilegesBasicInfo").css("backgroundColor", bgColor[d.data.privilege4VipModel.level]);
            $(".pbi_name").text(d.data.privilege4VipModel.privilegeName || ".");
            $(".pbi_content").text(d.data.privilege4VipModel.privilegeNameTopShow);
            $(".pbi_img").attr("src", d.data.privilege4VipModel.imgPrivilege2d);
            $(".privilegesDesc").text(d.data.privilege4VipModel.describe);
            $(".privilegesLevel").text(d.data.privilege4VipModel.levelName + "会员");
            $(".useRules").html(d.data.privilege4VipModel.giftBagUseDesc ? d.data.privilege4VipModel.giftBagUseDesc.replace(/\n/g, "<br/>") : "");
            if (member.level == d.data.privilege4VipModel.level) {
                if (d.data.privilege4VipModel.privilegeType == 2) { //特权为唐果
                    switch (d.data.privilege4VipModel.sendStatus) {
                        case "NO_SEND":
                            $(".checkIn").show();
                            break;
                        case "HAS_SEND":
                            $(".alreadyCheckIn span").text(d.data.points);
                            $(".alreadyCheckIn").show();
                            break;
                    }
                    $(".forTangGuo").show();
                } else {
                    $(".forGift").show();
                    $(".currentLevelStatus span").text("");//d.data.privilege4VipModel.sendStatusTip
                    $(".currentLevelStatus").show();
                    if (d.data.privilege4VipModel.sendStatus == "HAS_SEND") {
                        var gbdl=d.data.privilege4VipModel.giftBagDetailList || [];
                        for(var i=0;i<gbdl.length;i++){
                            if(gbdl[i].giftBagDetailType==4){
                                $("#toUse").attr("src","/e/coupon/index.html");
                            }
                        }
                        $("#toUse").css("visibility", "visible");
                    }
                }
            } else {//非当前等级
                $(".notCurrentLevelStatus span").text("升级到" + d.data.privilege4VipModel.levelName + "会员可得");
                $(".notCurrentLevelStatus").show();
                if (d.data.privilege4VipModel.privilegeType == 2) {
                    $(".forTangGuo").show();
                } else {
                    $(".forGift").show();
                }
                $("#toUse").text("我要升级").addClass("btn_showUpWin").css({"visibility":"visible"}).attr({"href":"javascript:;"});
            }
            //渲染福利内容
            if (d.data.recommendItems && d.data.recommendItems.length>0) {
                $.each(d.data.recommendItems, function (k, v) {
                    switch (v.itemType) {
                        case "PHYSICAL":
                            welfare.renderPhysicalHtml(v);
                            break;
                        default:
                            welfare.renderVirtualHtml(v);
                            break;
                    }
                })
                welfare.repairHeigh();
            }else{
                $(".forTangGuo").hide();
            }
        }
    })
}

function getUserInfo(cb) {
    var getUserLevel_url = apiUrl_prefix + "/vipcenter/members/portal";
    $.AkmiiAjaxPost(getUserLevel_url, {
        id: userId
    }, false).then(function (d) {
        if (d.code == 200) {
            member.level = d.data.level;
            member.contributions = d.data.currentContribution;
            var tpl_upWin = '<li>升级至{0}会员还需投资：<span class="up_money">{1}</span>元</li>';
            $.each(d.data.levelContributionIntervals, function (k, v) {
                if (v.id > member.level) {
                    $(".up_content").append(tpl_upWin.format(v.levelName, v.contributionValueStart - member.contributions))
                }
            })
            if (cb) {
                cb.call();
            }
        } else {
            alert(d.message);
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
        var url = "/html/store/choice_detail.html?category=physical&id=" + data.itemId;
        var tpl_tag = "<span class='tag{0}'>{1}</span>";
        var tags = "";
        if (data.tags) {
            for (var j = 0; j < data.tags.length; j++) {
                var tag = data.tags[j];
                tags += tpl_tag.format(tag.type, tag.tag);
            }
        }
        var inventory = "";
        if (data.inventory) {
            inventory = "仅剩" + data.inventory + "份";
        } else {
            inventory = "售罄";
        }
        temp += tpl.format(
            url,
            data.mainImgUrl || "",
            data.name || "",
            data.pointPayAmount || "",
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
        var url = "/html/store/profit_detail.html?category=virtual&id=" + data.itemId;
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
        var inventory = "";
        if (data.inventory) {
            inventory = "仅剩" + data.inventory + "份";
        } else {
            inventory = "售罄";
        }
        temp += tpl.format(
            url,
            imgSrc,
            data.virtualAmount || "",
            data.unit || "",
            data.name || "",
            data.pointPayAmount || "",
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
    repairHeigh:function(){
        var imgWidth = $(".product").width();
        var rate=318/201;//图片加载慢时获取不到高度，现按固定比例修改
        var imgHeight=imgWidth/rate;
        $(".listContainer li.virtual").each(function(k,v){
            var tmp=$(v);
            var quan=tmp.find(".quan");
            quan.css("height",imgWidth+"px");
            var quanImg=quan.find(".quanImg");
            var mg=(imgWidth-imgHeight)/2;
            quanImg.css("marginTop",mg+"px");
            var quanDesc=quan.find(".quanDesc");
            quanDesc.css("top",(quanDesc.position().top+mg)+"px");
            var quanType=quan.find(".quanType");
            quanType.css("top",(quanType.position().top+mg)+"px");
        })
    }
}