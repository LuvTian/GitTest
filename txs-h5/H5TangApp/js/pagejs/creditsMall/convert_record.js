var pageSize = 10;
var pageIndexPhy = 1;
var pageIndexVir = 1;
var totalPagePhy = 1;
var totalPageVir = 1;
var category = $.getQueryStringByName("category"); //"virtual" //"physical" ////获取福利类型
var type = category;
var view = document.getElementById("move_up");
var userId = $.getCookie("userid"); //$.getCookie("userid");
var appkey = $.getQueryStringByName("appkey") || '';
var typeapp = $.getQueryStringByName("type") || '';
//apiUrl_prefix="http://192.168.3.30:8999";
$(function () {

	//价格保留两位小数点处理
	template.helper("pricefixed", function (price) {
		var strPrice = price + "";
		if (strPrice.indexOf(".") != -1) {
			var price = price.toFixed(2);
		} else {
			var price = price + ".00";
		}

		return price;
	});
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
	if (!$.CheckToken() && appkey == "") {
		if (typeapp == "ios") {
			PhoneMode && PhoneMode.callLogin("");
		} else if (typeapp == "android") {
			window.PhoneMode && window.PhoneMode.callLogin("");
		} else {
			$.Loginlink(); //未登录状态跳到登录页
		}

	}
	//兑换记录Tab切换
	$(".JS_tab li").click(function () {
		var index = $(this).index();
		$(".JS_tab li span").removeClass("tab_current");
		$(this).find("span").addClass("tab_current");
		//alert(index);
		$(".welfare_content >div").eq(index).show().siblings().hide();
		if (index == 0) {
			type = "physical";
			history.replaceState(null,null,'/html/store/convert_record.html?category=physical&type='+typeapp);
			//window.location.hash = "#physical";
		} else if (index == 1) {
			type = "virtual";
			history.replaceState(null,null,'/html/store/convert_record.html?category=virtual&type='+typeapp);
			//window.location.hash = "#virtual";
		}
		$.setLS("currtype", type);
	});
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
	//小僧精选兑换记录接口
	dataListPhy(pageIndexPhy);
	//小僧礼券兑换记录接口
	dataListVir(pageIndexVir);
	//小僧精选
	function dataListPhy(pageIndexPhy) {
		//type = "physical";
		var Data = {
			"orderType": "PHYSICAL",
			"pageSize": pageSize,
			"page": pageIndexPhy,
			"userId": userId
		}
		$.AkmiiAjaxPost(apiUrl_prefix + "/members/orders", Data, true).then(function (data) {
			if (data.code == 200) {
				var phy_list = data.data.recordList;
				var totalCount = data.data.totalCount;
				totalPagePhy = data.data.totalPage;
				var currentPage = data.data.currentPage;
				//小僧精选实物类型
				var source = $("#welfare_choice").html();
				var render = template.compile(source);
				if (phy_list != null && phy_list != ""　) {
					var html = render({
						list: phy_list || []
					});

					$(".welfare_choice").append(html); //小僧精选内容渲染
					$(".welfare_choice .more_product").remove();
					//$(".welfare_choice .no_record").hide();
				} else {
					//$(".welfare_choice .no_record").show();
					$(".more_product").remove();

				}
				if (pageIndexPhy == 1 && phy_list.length == 0) {
					$(".welfare_choice .no_record").show();
				} else {
					$(".welfare_choice .no_record").hide();
				}
				if (pageIndexPhy == totalPagePhy) {
					$(".welfare_choice").append('<p class="more_product">没有更多数据</p>');
				} else if (phy_list != null && phy_list != "") {
					$(".welfare_choice").append('<p class="more_product">上拉查看更多商品</p>');
				}
			} else {
				$.alertF(data.message)
			}
		});
	}
	//小僧礼券
	function dataListVir(pageIndexVir) {
		//type = "virtual";
		var Data = {
			"orderType": "VIRTUAL",
			"pageSize": pageSize,
			"page": pageIndexVir,
			"userId": userId
		}
		$.AkmiiAjaxPost(apiUrl_prefix + "/members/orders", Data, true).then(function (data) {
			if (data.code == 200) {
				var phy_list = data.data.recordList;
				var totalCount = data.data.totalCount;
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
					//$(".welfare_record .no_record").hide();
				} else {
					//$(".welfare_record .no_record").show();
					$(".more_product").remove();

				}
				if (pageIndexVir == 1 && phy_list.length == 0) {
					$(".welfare_record .no_record").show();
				} else {
					$(".welfare_record .no_record").hide();
				}
				if (pageIndexVir == totalPageVir) {
					$(".welfare_profit").append('<p class="more_product">没有更多数据</p>');

				} else if (phy_list != null && phy_list != "") {
					$(".welfare_profit").append('<p class="more_product">上拉查看更多商品</p>');
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

	function start() {
		if ($(window).height() + $(document).scrollTop() >= $("body").height()) {
			flag = 1;
		}
	}

	function move() {
		if (flag == 1) {
			flag = 2;
		}
		console.log(flag)
	}

	function end() {
		if (flag == 2) {
			//从接口读取页面渲染的数据
			if (type == "virtual") {
				if (pageIndexVir < totalPageVir) {
					pageIndexVir++;
					dataListVir(pageIndexVir);
					flag = 0;
					setTimeout(function () {
						$("body").scrollTop($(".more_product").position().top)
					}, 0);
				}
			} else if (type == "physical") {
				if (pageIndexPhy < totalPagePhy) {
					pageIndexPhy++;
					dataListPhy(pageIndexPhy);
					flag = 0;
					setTimeout(function () {
						$("body").scrollTop($(".more_product").position().top)
					}, 0);
				}
			}



		}
		flag = 0;


	}



$(window).scroll(function () {  
			// alert("1");      
			var $this = $(".view"),
				        viewH = $(window).height(), //可见高度
				        contentH = $(".view").height(), //内容高度
				        scrollTop = $(window).scrollTop(); //滚动高度
			        //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
			       
			if (((scrollTop + viewH) / contentH) >= 1) { //到达底部100px时,加载新内容
				if (type == "virtual") { //虚拟类型
					if (pageIndexVir < totalPageVir) {
						pageIndexVir++;
						dataListVir(pageIndexVir); //加载小僧礼券虚拟物品数据
						flag = 0;
						setTimeout(function () {
							$("body").scrollTop($(".more_product").position().top)
						}, 0);
					}
				} else if (type == "physical") { //实物类型
					if (pageIndexPhy < totalPagePhy) {
						pageIndexPhy++;
						dataListPhy(pageIndexPhy); //加载小僧精选实物数据
						flag = 0;
						setTimeout(function () {
							$("body").scrollTop($(".more_product").position().top)
						}, 0);
					}
				}      
			}    
		});
})