var bid = "";//分店id
var company = [];//总店信息
$(function () {
    bid = $.getQueryStringByName("bid");
    $('.small-3').each(function () {
        $(this).height($(this).prev().innerHeight() + 'px')
        $(this).css('line-height', $(this).prev().innerHeight() + 'px')
    })
    BindData();
});

var BindData = function () {
    var url = "/StoreServices.svc/store/getbranchcompanyinfo";
    var param = {
        branchid: bid
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            company = data;
            var userType = "1,2";
            if (userType.indexOf(data.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            var status = data.status;
            $("#branchname").text(data.branchname);
            $("#prov").text(data.province);
            $("#city").text(data.city);
            $("#dist").text(data.district);
            $("#branchaddress").text(data.branchaddress);
            $("#branchphone").text(data.branchphone);
            $("#opentime").text(data.opentime);
            $("#branchadminname").html(data.branchadminname);
            $("#branchadminphone").text(data.branchadminphone);
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    })
};
