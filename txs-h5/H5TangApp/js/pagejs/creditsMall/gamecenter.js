$(function(){
    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/xiyoupointsandtimes", {activitytype:6}, true).then(function (data) {
        if (data.result) {
            $("#gameList li").eq(0).find("span b").text(data.everytimepoints || "-");
        } else {
            $.alertF(data.errormsg);
        }
    })

    $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/xiyoupointsandtimes", {activitytype:3}, true).then(function (data) {
        if (data.result) {
            $("#gameList li").eq(1).find("span b").text(data.everytimepoints || "-");
        } else {
            $.alertF(data.errormsg);
        }
    })
    getrefcodeByInter($.getCookie("userid"), function (referralCode) {
		$.setCookie("refcode", referralCode);
	})
})




function jumpUrlWithLogin(url) {
	$.checkLogin(url);
}

/**
 * 通过接口获取用户邀请码
 * @param {String} 用户id
 * @param {function} 获取邀请码成功之后回调
 */
function getrefcodeByInter(userId, callback) {
	$.AkmiiAjaxPost(apiUrl_prefix + "/members/referralcode", {
		"accountId": userId
	}, true).then(function (data) {
		if (data.code == 200) {
			callback && callback(data.data.referralcode);
			//referralCode = data.data.referralcode; //邀请码
		}
	});
}