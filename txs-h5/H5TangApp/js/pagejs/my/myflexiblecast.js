$(function() {
    var MadisonToken = $.getCookie("MadisonToken");
    if ($.isNull(MadisonToken)) { //未登录
        window.location.href = "/html/anonymous/login.html?returnurl=/Html/my/myflexiblecast.html";
    }
    $.AkmiiAjaxPost("/StoreServices.svc/user/userbidflexiblelist", {}, false).then(function(data) {
        if (data.result) {
            $("#totalbidamount").html($.fmoney(data.bidtotalamount)); //持有本金
            $("#incomeinterest").html($.fmoney(data.totalincomeinterest)); //已计收益
            $("#totalarrivalinterest").html($.fmoney(data.totalarrivalinterest)); //累积收益
            var ha = '';
            $.each(data.producttypelist, function(i, v) {
                switch (v.saletype) {
                    case 0: //至尊宝
                        ha += '<li onclick="window.location.href=\'/Html/Product/index-demand.html\'">\
                        <div class="left">至尊宝</div>\
                        <div class="right"><span id="zzb">' + $.fmoney(v.bidtypeamount) + '</span><i class="icon"></i></div>\
                    </li>';
                        break;
                    case 98: //周周僧
                        ha += '<li onclick="window.location.href=\'/Html/my/my-incremental-detail.html?type=week\'">\
                            <div class="left">周周僧</div>\
                            <div class="right"><span id="zzs">' + $.fmoney(v.bidtypeamount) + '</span><i class="icon"></i></div>\
                        </li>';
                        break;
                    case 97: //月月僧
                        ha += '<li onclick="window.location.href=\'/Html/my/my-incremental-detail.html?type=month\'">\
                            <div class="left">月月僧</div>\
                            <div class="right"><span id="yys">' + $.fmoney(v.bidtypeamount) + '</span><i class="icon"></i></div>\
                        </li>';
                        break;
                    case 96: //季季僧
                        ha += '<li onclick="window.location.href=\'/Html/my/my-incremental-detail.html?type=season\'">\
                            <div class="left">季季僧</div>\
                            <div class="right"><span id="jjs">' + $.fmoney(v.bidtypeamount) + '</span><i class="icon"></i></div>\
                        </li>';
                        break;
                }
            });
            $(".moldlist").append(ha);
        } else {
            if (data.errorcode == 'missing_parameter_accountid') {
                window.location.href = "/html/anonymous/login.html?returnurl=/Html/my/myflexiblecast.html";
            } else {
                $.alertF(data.errormsg)
            }
        }
    })
})