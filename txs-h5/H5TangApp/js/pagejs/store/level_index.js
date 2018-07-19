$(function () {
	// $(".cancle").click(function(){
	// 		$("#form,.mask").hide();
	// 		$("body").css("overflow","auto");
	// });



	// 	$("#luckydrawregister").newUserReg({			
	// 		phone: '#txtmobile', // 手机号编辑框
	// 		txtimgyzm: '#txtimgyzm', // 图形验证码编辑框
	// 		phoneyzm: '#txtsmsyzm', // 手机验证码编辑框
	// 		getyzm: '#getYZM', // 获取手机验证码
	// 		imgyzm: '#imgYZM', // 获取图形验证码
	// 		register: '#luckydrawregister', // 点击立即注册
	// 		InvitedBy: $.getQueryStringByName("c") || '', // 渠道号
	// 		regCallback: function (json) {
	// 			if (json.result) {         				  
	// 				window.location.replace("/html/product/index.html");
	// 			}
	// 			else {
	// 				$.alertF(json.errormsg);
	// 			}
	// 			//window.location.replace("/html/product/index.html");
	// 		} // 点击注册之后的callback
	// 	});


	$(".btn1").click(function () {
		if ($.getQueryStringByName("type") == "ios") {
			PhoneMode.jumpAppWithString({ 'controller': 'TXSMyCreditsViewController' });
		} else if ($.getQueryStringByName("type") == "android") {
			window.PhoneMode.callToPage("/main/myintegral", "");
		} else {
			window.location.href = '/html/store/myCredits.html';
		}

	})
})