$(function() {
	"use strict";
	var url = "/StoreServices.svc/product/productgrouplist";
	var account = {};
	footerBar.highlight(2);
	userinfo();
	getBanner();
	getFinancialProduct();
	//获取用户账户信息
	function userinfo() {
		var url = "/StoreServices.svc/user/info?v=" + (new Date()).getTime();
		$.AkmiiAjaxPost(url, {}, true).then(function(data) {
			if (data.result) {
				account = data.accountinfo;
				// 僧财宝处理逻辑
				// 如果已经签订了僧财宝协议
				if (!account.issignmoneyboxandhtffund) {
					var uuid = account.referralcode + "";
					// 如果点击了弹框的x按钮表示不同意
					if (!$.getscbSigned(uuid)) { // 还没有弹出协议框
						$.scgSignAlert(uuid, true, function() {
							window.location.reload();
						}, function() {
							window.location.reload();
						});
					}
				}
			}
		});
	}
	//获取理财产品
	function getFinancialProduct() {
		$.AkmiiAjaxPost(url, {}, true).then(function(data) {
			if (data.result) {
				var product_type = data.financialpage.typelist;
				for (var i = 0; i < product_type.length; i++) {
					var typedetaillist = product_type[i].typedetaillist;
					switch (product_type[i].type) {
						case "1": //活期
							if (typedetaillist.length > 0) { //如果有活期产品
								var current_array = [];
								current_array.push('<div class="product_current new_product_current"><div class="product_list_title regular_title JS_curr_title">');
								current_array.push('<strong>' + substrNum(product_type[i].typename || "活期", 6) + '</strong><span>' + substrNum(product_type[i].typedesc || "存取灵活·急速到账", 16) + '</span></div>');
								current_array.push('<ul class="current_list regular_list"></ul></div>');
								var currenthtml = $(current_array.join(""));
								$("#mainBody").append(currenthtml);
								// $(".product_current").show();
								// $(".JS_curr_title strong").text((product_type[i].typename || "活期"));
								// $(".JS_curr_title span").text((product_type[i].typedesc || "存取灵活·急速到账"));
								var current_list_array = [];
								for (var j = 0; j < typedetaillist.length; j++) {
									var detailnameSub = substrNum(typedetaillist[j].detailname || "", 6);
									var ratedesc = substrNum(product_type[i].ratedesc || "期望年化收益率", 8);
									var item = typedetaillist[j];
									if (item.detailtype == 2) {
										current_list_array.push("<li class='cli_live regular_style' data-type={0} data-name=".replace(/\{0\}/g, item.detailtype) + (typedetaillist[j].detailname || '') + ">");
										current_list_array.push("<strong>" + detailnameSub + "</strong>");
										current_list_array.push('<li><span class="rate_text">' + ratedesc + '</span>');
										current_list_array.push('<span class="rate_percent">' + (typedetaillist[j].detailrate || 0.0) + '%</span>');
										current_list_array.push('<li class="quantity_icon"></li>');
									}

								};
								var html = $(current_list_array.join(""));
								$(".current_list").html(html);
								$(".current_list").click(function() {
									var type = $(this).find(".cli_live").data("type");
									var detailname = $(this).data("name");
									if (type == 1) { // 僧财宝
										if ($.CheckToken()) {
											if (account.issignmoneyboxandhtffund) {
												window.location.href = "/html/product/account-balance.html?detailname=" + detailname;
											} else {
												// 未开通
												if ($.getscbSigned(account.referralcode + "") == 0) {
													$.scgSignAlert(account.referralcode + "", false, function() {
														window.location.reload();
													}, function() {

													});
												}
											}
										} else { // 未登录
											$.Loginlink();
											//window.location.href = "/html/Anonymous/login.html?returnurl=/Html/Product/account-balance.html";
										}
									} else if (type == 2) { //至尊宝
										window.location.href = "/html/product/index-demand.html";
									}
								});
							} else {
								$(".product_current").hide();
							}
							break;
						case "2": //定期
							if (typedetaillist.length > 0) { //如果有定期产品
								var regular_array = [];
								regular_array.push('<div class="regular"><div class="product_list_title regular_title JS_regular_title">');
								regular_array.push('<strong>' + substrNum(product_type[i].typename || "定期", 6) + '</strong><span>' + substrNum(product_type[i].typedesc || "稳健回报·薪满益足", 16) + '</span></div>');
								var regularhtml = $(regular_array.join(""));
								$("#mainBody").append(regularhtml);
								// $(".JS_regular_title strong").text((product_type[i].typename || "定期"));
								// $(".JS_regular_title span").text((product_type[i].typedesc || "稳健回报·薪满益足"));
								var ratedesc = product_type[i].ratedesc || "期望年化收益率";
								var ratedescSub = substrNum(product_type[i].ratedesc || "期望年化收益率", 8);
								var durationdesc = product_type[i].durationdesc || "投资期限";
								var regular_list_array = [];
								for (var j = 0; j < typedetaillist.length; j++) {
									var detailtype = typedetaillist[j].detailtype || 0;
									var detailrate = typedetaillist[j].detailrate || "";
									var detailname = substrNum(typedetaillist[j].detailname || "", 7);
									regular_list_array.push("<ul class='regular_list' onclick='list_url(" + detailtype + "," + typedetaillist[j].productdurationmax + "," + typedetaillist

										[j].productdurationmin + ",\"" + (typedetaillist[j].detailname || "") + "\",\"" + ratedesc + "\",\"" + durationdesc + "\");'>");
									regular_list_array.push("<li class='regular_style'><strong>" + detailname + "</strong></li>");
									if (detailrate == null || detailrate == "") {
										regular_list_array.push("<li><span class='rate_text'>当前暂无产品在售</span></li>");
									} else {
										regular_list_array.push("<li><span class='rate_text'>" + ratedescSub + "</span>");
										regular_list_array.push("<span class='rate_percent'>" + detailrate + "</span></li>");
									}
									if (typedetaillist[j].detailcount == 0 || typedetaillist[j].detailcount == null) {
										regular_list_array.push("<li class='quantity_icon'><span class='arrow_icon'><i></i></span></li>");
									} else {
										regular_list_array.push("<li class='quantity_icon'><span class='quantity'>" + typedetaillist[j].detailcount + "</span><span class='arrow_icon'><i></i></span></li>");
									}

									regular_list_array.push("</ul>");
								};

								var html = $(regular_list_array.join(""));
								$(".regular").append(html);

							} else {

							}
							break;
						case "3": //变现专区
							var realization_array = [];
							realization_array.push('<div class="realization"><a href="/html/product/producttransferlist.html"><div class="product_list_title cls"><div class="realize">');
							realization_array.push('<strong>' + substrNum(product_type[i].typename || "变现专区", 6) + '</strong><span>' + substrNum(product_type[i].typedesc || "当日起息·期限灵活", 16) + '</span></div>');
							realization_array.push('<span class="arrow_icon realize_icon"><i></i></span></div></a></div>');
							var html = $(realization_array.join(""));
							$("#mainBody").append(html);
							var typename = product_type[i].typename || "";
							var ratedesc = product_type[i].ratedesc || "期望年化收益率";
							var durationdesc = product_type[i].durationdesc || "投资期限";
							$(".realization a").click(function() {
									window.location.href = "/html/product/producttransferlist.html?typename=" + typename + "&ratedesc=" + ratedesc + "&durationdesc=" + durationdesc;
								})
								// $(".realize strong").text((product_type[i].typename || "变现专区"));
								// $(".realize span").text((product_type[i].typedesc || "当日起息·期限灵活"));
							break;
						case "4": //节节僧
							var typename = (product_type[i].typename || "定活两便").substr(0, 6);
							var typedesc = (product_type[i].typedesc || "长存短取·收益递增").substr(0, 16);
							var jiejieseng_array = [];
							jiejieseng_array.push('<div class="jiejieseng"><div class="product_list_title regular_title JS_jiejieseng_title">');
							jiejieseng_array.push('<strong>' + typename + '<div class="wel_nlogo"></div></strong><span>' + typedesc + '</span></div></div>');
							var jiejiesenghtml = $(jiejieseng_array.join(""));
							$("#mainBody").append(jiejiesenghtml);

							// $(".JS_jiejieseng_title strong").text(typename);
							// $(".JS_jiejieseng_title span").text(typedesc);
							if (typedetaillist.length > 0) { //如果有节节僧产品
								var ratedesc = (product_type[i].ratedesc || "期望年化收益率").substr(0, 10);
								var jiejieseng_list_array = [];
								for (var j = 0; j < typedetaillist.length; j++) {
									var detailname = (typedetaillist[j].detailname || "").substr(0, 6);
									var detailrate = (typedetaillist[j].detailrate || "0.0%");
									jiejieseng_list_array.push('<ul class="regular_list jiejieseng_bg" onclick="window.location.href=\'/html/product/incremental-productdetail.html?detailname=' + detailname + '\'">');
									jiejieseng_list_array.push('<li class="regular_style"><strong>' + detailname + '</strong></li>');
									jiejieseng_list_array.push('<li><span class="rate_text">' + ratedesc + '</span>');
									jiejieseng_list_array.push('<span class="rate_percent">' + detailrate + '</span></li>');
									jiejieseng_list_array.push('<li class="quantity_icon"></li>');
									jiejieseng_list_array.push('</ul>');
								};
								var html = $(jiejieseng_list_array.join(""));
								$(".jiejieseng").append(html);
							}

					}
				}
				var wel_btm_array = [];
				wel_btm_array.push('<div class="wel_btm_com"><span class="wel_btm_comspan" onclick="window.location.href=\' / html / picc.html \'">账户资金防盗安全由新浪支付和太平财险共同保障</span><p>网贷有风险 出借需谨慎</p></div>');
				var wel_btmhtml = $(wel_btm_array.join(""));
				$("#mainBody").append(wel_btmhtml);
			}
		});
	}
	//字数过长截取
	function substrNum(content, len) {
		if (content.length > len) {
			return content.substr(0, len) + "...";
		} else {
			return content;
		}

	}
	//获取banner图片
	function getBanner() {
		var D = {
			type: "TopBanner",
			bannerversion: "1"
		};
		$.AkmiiAjaxPost("/StoreServices.svc/anonymous/system/getbannerbytypeandversion", D, true).then(function(d) {
			$.preloaderFadeOut();
			if (d.result) {
				if (d.appbanners.length > 0) {
					var width = $("body").width();
					var $li = $("#litpl").html();
					var $item = $("#itemtpl").html();
					var listr = [],
						itemstr = [];
					var $hdpointer, $btmpointer, flipsnap, intTimer;


					var setAnimate = function() {
						// 两张才进行轮播
						if (d.appbanners.length > 1) {
							intTimer = setInterval(function() {
								if (flipsnap.currentPoint == $btmpointer.size() - 1) {
									flipsnap.moveToPoint(0);
								} else {
									flipsnap.toNext();
								}
							}, 5000);
						}
					};
					$.each(d.appbanners, function(i, item) {
						var href = "window.location.href='{0}'".replace("{0}", item.link) || "";
						listr.push($li.replace("{0}", href).replace("{1}", item.imageurl));
						itemstr.push($item.replace("{0}", (i == 0 ? "cur" : "")));
					});

					$(".headbnlist").html(listr.join(""));
					d.appbanners.length > 1 && $(".headsp").show().html(itemstr.join(""));

					$._imgLoad($(".headbnlist").find("img"), function(img) {
						$(img).attr("src", $(img).data("src"));
					});

					$hdpointer = $(".headbnitem");
					$btmpointer = $(".headspitem");

					$hdpointer.width(width);
					$(".headbnlist").width(width * ($hdpointer.size() || 1));
					flipsnap = Flipsnap(".headbnlist", {
						distance: width
					});
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
			}
		}, function() {
			$.preloaderFadeOut();
		});
	}


});
//定期产品列表链接
function list_url(detailtype, productdurationmax, productdurationmin, detailname, ratedesc, durationdesc) {
	window.location.href = "/html/product/productfixedlist_new.html?detailtype=" + detailtype + "&productdurationmax=" + productdurationmax + "&productdurationmin=" + productdurationmin + "&detailname=" + detailname + "&ratedesc=" + ratedesc + "&durationdesc=" + durationdesc;
};