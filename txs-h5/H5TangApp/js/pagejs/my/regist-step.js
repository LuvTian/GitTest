$(function () {
    var returnurl=$.getQueryStringByName("returnurl");
    //var skip_sina_process=$.getQueryStringByName("skip_sina_process");
    $.CheckAccountCustomStatusRedirect(returnurl);
});
