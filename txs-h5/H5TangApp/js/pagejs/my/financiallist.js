/// <reference path="../../vendor/jquery-2.2.0.js" />
/// <reference path="../../common.js" />

//理财金券列表id
var $financiallist = $("#financiallist");
$(function () {
    financiallist();
});

//理财金券列表
function financiallist() {
    var url = "/StoreServices.svc/user/financiallist";
    $.AkmiiAjaxPost(url, {}).then(function (data) {
        if (data.result) {
            var list = data.userfinanciallist;
            //理财金总金额
            $("#sumamount").html($.fmoney(data.sumamount));
            if (list.length == 0) {
                $(".ondata").show();
            }
            else {
                $.each(list, function (index, item) {
                    //根据状态判断显示
                    $financiallist.append(financiallisthtml(item));
                    if (index == (list.length - 1)) {
                        //数据加载完成后显示列表和按钮
                        if (data.sumamount > 0) {
                            $("#btn-rightnow").fadeIn();
                        }
                        $financiallist.fadeIn();
                    }
                });
                //样式称高
                $('.h-ticket:last').css('margin-bottom', '7rem');
            }

        }
    });
}

//判断理财金券状态显示对应的效果
function financiallisthtml(item) {
    var ha = [];
    switch (item.status) {
        case 1:
            ha.push('<div class="h-ticket could-use">');
            ha.push(' <div class="mounets-num red">');
            ha.push(' <span class="mounets">' + item.amount + '</span>');
            ha.push('<span class="yuan">元</span></div>');
            ha.push(' <div class="h-ticket-content">');
            ha.push('<span class="name red">理财金</span>');
            ha.push('<span class="state border-col-eb7454 col-eb7454">可使用</span></div>');
            ha.push(' <div class="h-ticket-tip">');
            ha.push('<p>' + item.description + '</p>');
            ha.push(' <p>可投资指定理财产品</p>');
            ha.push('<p>有效期至：' + item.endtime + '</p>');
            ha.push('</div>');
            ha.push('<div class="h-ticket-qz">');
            ha.push(' <p>最终解释权归唐小僧理财</p>');
            ha.push(' </div></div>');
            break;
        case 2:
            ha.push('<div class="h-ticket used">');
            ha.push(' <div class="mounets-num col-91">');
            ha.push(' <span class="mounets">' + item.amount + '</span>');
            ha.push('<span class="yuan">元</span></div>');
            ha.push(' <div class="h-ticket-content">');
            ha.push('<span class="name col-91">理财金</span>');
            ha.push('<span class="state border-col-919191 col-91">已使用</span></div>');
            ha.push(' <div class="h-ticket-tip top2">');
            ha.push('<p>使用日期：' + item.modified + '</p>');
            ha.push('</div>');
            ha.push('<div class="h-ticket-qz bottom2">');
            ha.push(' <p>最终解释权归唐小僧理财</p>');
            ha.push(' </div></div>');
            break;
        case 3:
            ha.push('<div class="h-ticket overdue">');
            ha.push(' <div class="mounets-num col-62563d">');
            ha.push(' <span class="mounets">' + item.amount + '</span>');
            ha.push('<span class="yuan">元</span></div>');
            ha.push(' <div class="h-ticket-content">');
            ha.push('<span class="name col-62563d">理财金</span>');
            ha.push('<span class="state border-col-62563d col-62563d">已过期</span></div>');
            ha.push(' <div class="h-ticket-tip fb7">');
            ha.push('<p>' + item.description + '</p>');
            ha.push(' <p>可投资指定理财产品</p>');
            ha.push('<p>有效期至：' + item.endtime + '</p>');
            ha.push('</div>');
            ha.push('<div class="h-ticket-qz fb76">');
            ha.push(' <p>最终解释权归唐小僧理财</p>');
            ha.push(' </div></div>');
            break;
    }
    var result = $(ha.join(''));
    if (item.status == 1) {
        result.click(function () {
            window.location.href = "/html/product/productfinancialbuy.html";
        });
    }
    if (item.status == 2) {
        result.click(function () {
            window.location.href = "/html/my/my-financial-index.html";
        });
    }

    return result;
}