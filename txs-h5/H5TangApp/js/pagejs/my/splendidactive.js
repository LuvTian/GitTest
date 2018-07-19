/// <reference path="//_references.js" />

var $shakelist = $(".shake-list");

$(function () {

    getBanner();

    function getBanner() {
        var data = { "type": "WonderfulActivities" };
        $.AkmiiAjaxPost("/StoreServices.svc/anonymous/system/getbannerbytype", data, true).then(function (d) {
            if (d.result) {
                if (d.appbanners.length > 0) {
                    var ha = [];
                    //var status = d.appbanners.status;
                    $.each(d.appbanners, function (i, item) {
                        ha.push('<article class="bg-white margin1 img-topic" data-src="' + item.link + '">');
                        ha.push('<img src="' + item.imageurl + '" alt="" class="img-responsive">');
                        ha.push('<div class="row">');
                        ha.push('<div class="small-8 left">');
                        var descript = $.Cutstring(item.description, 9);
                        ha.push('<span class="wxicon icon-circle"></span>' + descript + '');
                        ha.push(' <p class="gray">' + item.starttime + '</p></div>');
                        ha.push('<div class="small-4 left text-right shake-button">');
                        ha.push('<a href="' + item.link + '" class="bg-red">立即查看</a>');
                        ha.push('</div></div></article>');
                        var html = $(ha.join(''));
                        html.click(function () {
                            window.location.href = $(this).attr("data-src");
                        });
                        $shakelist.html(html);
                    });
                }
                else if(d.appbanners.length==0){
                    $.LoanMore($shakelist, "暂无精彩活动");
                }
            }
        });
    }
});