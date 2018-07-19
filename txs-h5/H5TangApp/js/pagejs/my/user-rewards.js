/// <reference path="/_references.js" />


$(function() {
	getUserInfo();
});

var getUserInfo = function() {
	var url = "/StoreServices.svc/user/info";
	$.AkmiiAjaxPost(url, {}, true).then(function(data) {
		if (data.result) {
			var account = data.accountinfo;
		} else if (data.errorcode == 'missing_parameter_accountid') {
			$.alertF("请先登录", null, $.Loginlink);
		}
	});
};