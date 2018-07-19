$(function () {
	var returnurl=$.getQueryStringByName("returnurl");
    CheckAccountCustomStatusRedirectFanba();
    function CheckAccountCustomStatusRedirectFanba(redirctUrl){
    	var url = "/StoreServices.svc/user/info";
            $.AkmiiAjaxPost(url, {}, true).then(function (data) {
                if (data.result) {
                    switch (data.accountinfo.customstatus) {
                        case 0:
                            if (window.location.pathname != "/html/fanba/regist-step1.html") {
                                window.location.replace("/html/fanba/regist-step1.html?returnurl="+returnurl);
                            }
                            break;
                        case 1:
                            if (window.location.pathname != "/html/fanba/regist-step2.html") {
                                window.location.replace("/html/fanba/regist-step2.html?returnurl="+returnurl);
                            }
                            break;
                        case 2:
                            if (window.location.pathname != "/html/fanba/regist-step3.html") {
                                window.location.replace("/html/fanba/regist-step3.html?returnurl="+returnurl);
                            }
                            break;
                        default:
                            if (redirctUrl) {
                                window.location.replace(decodeURIComponent(redirctUrl));
                            } else {
                                window.location.replace(decodeURIComponent(returnurl));
                            }
                            break;
                    }
                } else if (data.errorcode == "missing_parameter_accountid") {
                    $.Loginlink();
                }
            });
    }
});
