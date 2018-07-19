var pageindex = 1;
var pagesize = 10;
var rawassetid = $.getQueryStringByName("rawassetid"); //rawassetid
$(function() {
    pageinit();
});

function pageinit() {
    creditorlist(pageindex);
    $("#loadmoreProject").click(function() {
        creditorlist(pageindex += 1);
        return false;
    });
}

//债权列表
function creditorlist(pageindex) {
    var url = "/StoreServices.svc/product/projectrawrelatedinfolist";
    var paramter = {
        pageindex: pageindex,
        rawassetid: rawassetid
    }
    $.AkmiiAjaxPost(url, paramter, false).then(function(data) {
        if (data.result) {
            if (data.relatedinfolist.length != 0) {
                var ha = [];
                $.each(data.relatedinfolist, function(index, item) {
                    ha.push('<a href="javascript:void(0)" class="bb bg-white ggcss clearfloat" data-id=' + item.id + '>');
                    ha.push('<div class="width-1 fl">' + item.name + '</div>');
                    ha.push('<div class="width-2 fl tr"><span class="wxicon icon-right-arrow"></span></div>');
                    ha.push('</a>');
                });
                var html = $(ha.join(""));
                html.click(function() {
                    var id = $(this).attr("data-id");
                    window.location.href = "/html/product/creditordetail.html?id=" + id;
                });
                $("#creditorlist").append(html);
                if (data.relatedinfolist.length < pagesize) {
                    $("#loadmoreProject").html("没有更多债权了");
                    $("#loadmoreProject").unbind("click");
                } else {
                    return false;
                }
            } else {
                $("#loadmoreProject").html("没有更多债权了");
                $("#loadmoreProject").unbind("click");
            }
        }
    });
}