var pageindex = 1;
$(function () {
    rewardlist();
});

var rewardlist=function(){
    var url = "/StoreServices.svc/user/getsigninrealcouponlist";
    var data = { "pageindex": pageindex};
    $.AkmiiAjaxPost(url, data, true).then(function (d) {
        if (d.result) {
            var list = d.usersigninrealcouponlist;
            var ha = [];
            if (list.length > 0) {
                pageindex = parseInt(pageindex) + 1;
                $.each(list, function (index, item) {
                    ha.push('<li class="bb clearfix"><span>' + item.rewardmemo + '</span><span>' + item.rewarddate + '</span><span>' + item.rewardsource + '</span></li>');
                });
                var html = $(ha.join(""));
                $(".listinfo").append(html);
            }
            if (list.length > 9) {
                $.LoanMore($(".listinfo"), null, "rewardlist()");
            } 
            else{
                $.LoanMore($(".listinfo"), "没有更多记录了");
            }
        }
    });
}