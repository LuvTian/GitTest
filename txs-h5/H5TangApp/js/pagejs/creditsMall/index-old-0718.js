$(function() {
	$("#advertisementContainer .close").click(function() {
		$("#advertisementContainer").slideUp();
	})
	footerBar.highlight(3);
	$.setLS("currtype", 0);
})

var welfare = {
	size: 10,
	page: 1,
	physical_tpl: '<li onclick="welfare.jumpToDetail(\'{0}\');{5}" style="{1}">\
			<img class="selectedItem_img" src="{2}" onerror="onerror=null;src=\'/css/img2.0/pointImg/default_pic.jpg\'">\
			<div class="selectedItem_desc">\
				<div class="selectedItem_name">{3}</div>\
				<div class="selectedItem_price"><span class="priceColor">{4}</span> 唐果</div>\
			</div>\
		</li>',
	virtual_tpl: '<div onclick="welfare.jumpToDetail(\'{0}\');{8}" class="{1}">\
					<span class="profit_money">{2}<span>{6}</span></span>\
					<div class="profit_intro">\
						<p class="profit_title">{3}</p>\
                        <p class="profit_content"><span class="point_color">{4}</span>唐果</p>\
					</div>\
                    <div class="change_icon"><a href="javascript:;" onclick="{5};{9}"><img src="{7}"></a></div>\
				</div>',
	getPhysical_list: function() {
		this._getCategoriesList("physical");
	},
	getVirtual_list: function() {
		this._getCategoriesList("virtual");
	},
	_getCategoriesList: function(code) {
		$.AkmiiAjaxGet(apiUrl_prefix + "/categories/" + code + "?size=" + this.size + "&page=" + this.page).then(function(d) {
			if (d.code == 200) {
				localStorage[code] = JSON.stringify(d.data.recordList);
				if (code == "physical") {
					welfare.renderPhysicalHtml(d.data.recordList, welfare.physical_tpl, "selectedItems");
				}
				if (code == "virtual") {
					welfare.renderVirtualHtml(d.data.recordList, welfare.virtual_tpl, "welfareContainer");
				}
			}
		})
	},
	renderPhysicalHtml: function(data, tpl, target_id) {
		var temp = "";
		var style_str = "margin-right:2%"
		for (var i = 0; i < Math.min(data.length, 2); i++) {
			var url = "choice_detail.html?category=physical&id=" + data[i].id;
			temp += tpl.format(
				url,
				i % 2 == 1 ? '' : style_str,
				data[i].homepageImgUrl,
				data[i].name,
				data[i].pointPayAmount,
				"_hmt.push(['_trackEvent', 'Integral Mall', 'Display_ObjBan" + i + "', '福利-小僧精选实物" + i + "', '福利-小僧精选实物']);"
			);
		}
		$("#" + target_id).append(temp);
	},
	renderVirtualHtml: function(data, tpl, target_id) {
		var temp = "";
		for (var i = 0; i < Math.min(data.length, 6); i++) {
			var url = "profit_detail.html?category=virtual&id=" + data[i].id;
			var type = data[i].itemType;
			var classL = "profit_list ";
			switch (type) {
				case "INTEREST":
					classL += "inner_bg_coupon";
					break;
				case "CINEMA_TICKET":
					classL += "out_bg_movie";
					break;
				case "PHONE_TRAFFIC":
					classL += "out_bg_data";
					break;
				case "COUPON":
					classL += "inner_bg_voucher";
					break;
				case "FINANCIAL":
					classL += "inner_bg_fund";
					break;
			}
			var clickEvent = "exchange('{0}', '{1}', '{2}', '{3}', '{4}','{5}','{6}')".format(
				data[i].name,
				data[i].pointPayAmount,
				data[i].id,
				data[i].pointPayAmount || "",
				data[i].itemType,
				data[i].virtualAmount || "",
				data[i].unit || ""
			);
			var coverImg = "/css/img2.0/pointImg/convert.png";
			if (data[i].inventory <= 0) {
				clickEvent = "function(e){e.stopPropagation();}";
				coverImg = "/css/img2.0/pointImg/sellout.png";
			}
			temp += tpl.format(
				url,
				classL,
				data[i].virtualAmount || "",
				data[i].name || "",
				data[i].pointPayAmount || "",
				clickEvent,
				data[i].unit || "",
				coverImg,
				"_hmt.push(['_trackEvent', 'Integral Mall', 'Display_Fictitious Ban" + i + "', '福利-小僧礼券入口" + i + "', '福利-小僧礼券入口']);",
				"_hmt.push(['_trackEvent', 'Integral Mall', 'Btn_Fictitious Ban" + i + "', '福利-小僧礼券兑" + i + "', '福利-小僧礼券兑']);"
			);
		}
		$("#" + target_id).append(temp);
	},
	getMemberInfo: function() {
		if (!$.CheckToken()) {
			return;
		}
		var data = {
			"id": this.checkLogin()
		}
		$.AkmiiAjaxPost(apiUrl_prefix + "/members/info", data, false).then(function(d) {
			var tpl = ["我的唐果 "];
			tpl.push("<span class='point_color'>" + d.data.points + "</span>");
			$("#credits a").attr("href", "myCredits.html").html(tpl.join(""));
			localStorage["points"] = d.data.points;
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


//替换模板
String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof(args) == "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}

welfare.getPhysical_list();
welfare.getVirtual_list();
welfare.getMemberInfo();
welfare.getBanner();



/*老的页面js*/
var $agame = $("#agame"); //西游机链接
var $rocklist = $("#rocklist"); //精品福利链接
var $happy_rock = $("#happy-rock"); //开心摇一摇链接
var $commercial_welfare = $("#neighbouringWelfareContainer"); //商户福利链接
var LocationCookie = $.getCookie("MadisonStoreBaiduLocation");
var $searchButton = $(".search-button");
var maxcount = 2;
if (!$.isNull(LocationCookie)) {
	Location = (new Function('return' + LocationCookie))();
	Success(Location);
} else {
	if ($.is_weixn() && !$.is_pcwechat()) {
		$.getWechatconfig("getLocation", Success, Failure);
	} else {
		$.getLocationFailure(false, Success);
	}
}

function Success(data) {
	Location = data;
	$.getLocationCity(getLocationCityFun);
	$agame.attr("href", "/Html/Store/Luckdraw.html?longitude=" + Location.lng + "&latitude=" + Location.lat);
	$rocklist.attr("href", "/Html/Store/rock.html?longitude=" + Location.lng + "&latitude=" + Location.lat + "&maxcount=" + maxcount);
	$commercial_welfare.find(".title a").attr("href", "/Html/Store/search.html?longitude=" + Location.lng + "&latitude=" + Location.lat);
	$searchButton.attr("href", "/Html/Store/search.html?search=true&longitude=" + Location.lng + "&latitude=" + Location.lat);
	$happy_rock.attr("href", "/Html/Store/rock.html?longitude=" + Location.lng + "&latitude=" + Location.lat + "&maxcount=" + maxcount);
	//获取当前城市
	//banner图
	// GetBanner();
	//获取置顶福利
	// getBoutique();
	//获取附近福利
	getNearest();
}

function getNearest() {
	$.getLocationCity(getData, Location.lng, Location.lat); //, "region": cityInfo.citycode
};

function Failure() {
	$.getLocationFailure(false, Success);
}

function getLocationCityFun(data) {
	if (data != null) {
		$("#city").html(data.city + " " + data.district);
	} else {
		$("#city").html("请选择");
	}
}


//获取附近福利 
function getData(cityInfo) {
	var data = {
		"longitude": "" + Location.lng,
		"latitude": "" + Location.lat,
		"region": cityInfo.citycode
	};
	$.AkmiiAjaxPost("/StoreServices.svc/store/activitygetnearest", data, true).then(function(d) {
		if (d) {
			var list = d.nearestlist;
			if (list.length <= 0) {
				$commercial_welfare.hide();
			}
			$("#NearestList").html("");
			var ha = [];
			var listResult = [];
			$.each(list, function(index, ele) {
				ha = [];
				ha.push('<li>');
				ha.push('<img src="' + ele.couponimagesmall + '" class="neighbouringWelfare_img">');
				ha.push('<div class="neighbouringWelfare_desc">');
				ha.push('<dl>');
				ha.push('<dt class="neighbouringWelfare_name">');
				ha.push(ele.storename);
				ha.push('<span class="neighbouringWelfare_distance">' + $.ShopDistance(ele.distance) + '</span>');
				ha.push('</dt>');
				ha.push('<dt class="neighbouringWelfare_price">');
				ha.push('<span class="priceColor">已出' + ele.deliverycount + '件</span>');
				ha.push('<span class="neighbouringWelfare_salesNum">共' + ele.activitysum + '个福利</span>');
				ha.push('</dt>');
				ha.push('</dl>');
				ha.push('</div>');
				ha.push('</li>');
				/*ha.push('<a href="javascript:void(0);" class="shop-list bb bg-white">');
				ha.push('<img src="/css/img2.0/imgload.gif" class="img-shop" data-src="' + ele.couponimagesmall + '">');
				ha.push('<div class="shop-name oh">');
				ha.push('<div class="small-9 left text-overflow">');
				ha.push('<img src="' + $.GetImgByCategory(ele.storecategory) + '" >' + (ele.storename) + '</div>');
				ha.push('<div class="small-3 right text-right gray">' + $.Distance(ele.distance) + 'm</div></div>');
				ha.push('<p class="tips oh">' + $.Cutstring(ele.couponabstract, 14, "...") + '</p>');
				ha.push('<div class="gray oh"><div class="left">已出' + ele.deliverycount + '件</div>');
				ha.push('<div class="right">共' + ele.activitysum + '个福利<i class="wxicon icon-right-arrow"></i></div></div></a>');*/
				var result = $(ha.join(''));
				result.click(function() {
					window.location.href = '/html/Store/rock.html?storeid=' + ele.storeid + '&activitytype=2&longitude=' + Location.lng + '&latitude=' + Location.lat;
				});
				listResult.push(result);
			});
			$("#neighbouringWelfares").append(listResult);
			// $._imgLoad($("#NearestList").find("img"), function (img) {
			//     $(img).attr("src", $(img).attr("data-src"));
			// });
		}
	});
}
$(function() {
	$("#credits a").click(function() {
		$.BaiduStatistics("Integral Mall", "Btn_Welfare_TangGuo", "福利-我的唐果"); //百度统计
	});
	$("#advertisementContainer a").click(function() {
		$.BaiduStatistics("Integral Mall", "Btn_Welfare_Banner", "福利-banner"); //百度统计
	});
	$("#selectedContainer .more").click(function() {
		$.BaiduStatistics("Integral Mall", "Btn_Obj_More", "福利-小僧精选更多");
	});
	$("#welfareContainer .more").click(function() {
		$.BaiduStatistics("Integral Mall", "Btn_Fictitious_More", "福利-小僧礼券更多");
	});
	$("#agame").click(function() {
		$.BaiduStatistics("Integral Mall", "Icon_Game", "福利-幸运游戏机");
	});
	$("#happy-rock").click(function() {
		$.BaiduStatistics("Integral Mall", "Icon_Shake", "福利-开心摇一摇");
	});
})