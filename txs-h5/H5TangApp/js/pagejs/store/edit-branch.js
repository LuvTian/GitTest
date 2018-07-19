var bid = "";//分店id
var aboutUrl = "";
var company = [];//总店信息
$(function () {
    bid = $.getQueryStringByName("bid");
    $('.small-3').each(function () {
        $(this).height($(this).prev().innerHeight() + 'px')
        $(this).css('line-height', $(this).prev().innerHeight() + 'px')
    })
    $('#headquarters').click(function () {
        $(this).toggleClass('icon-choosed');
        if ($(this).hasClass('icon-choosed')) {
            $("#opentime").val(company.headquarters);
        } else {
            //$("#opentime").val(company.opentime);
            $("#opentime").val("");
        }
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
            if (("7,8").indexOf(status) > -1)//如果企业已冻结
            {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
            }
            $("#branchname").val(data.branchname);
            $("#prov").val(data.province);
            $("#city").val(data.city);
            $("#dist").val(data.district);
            $("#branchaddress").val(data.branchaddress);
            $("#branchphone").val(data.branchphone);
            $("#opentime").val(data.opentime);
            if (data.opentime == data.headquarters) {//同总店
                $("#headquarters").addClass("icon-choosed");
            } else {
                $("#headquarters").removeClass("icon-choosed");
            }
            $("#branchadminname").html(data.branchadminname);
            $("#branchadminphone").val(data.branchadminphone);
            $.ajaxSettings.async = false;
            BindRegion(data.province, data.city, data.district);
            $.ajaxSettings.async = true;
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

var BindRegion = function (province, city, district) {

    $(".selectPCD").citySelect({
        nodata: "none",
        required: false,
        prov: province,
        city: city,
        dist: district
    }, function (a) {
        if (a == "") {
            a = "请选择省份";
        }
        $("#prov").val(a);
        $("#city").val("请选择城市");
        $("#dist").val("请选择区县");
    }, function (a) {
        if (a == "") {
            a = "请选择城市";
        }
        $("#city").val(a);
        $("#dist").val("请选择区县");
    }, function (a) {
        if (a == "") a = "请选择区县";
        $("#dist").val(a);
    });
};

$("#editbranch").click(function () {
    var name = $("#branchname").val();
    var prov = $(".prov option:selected").val();
    var city = $(".city option:selected").val();
    var dist = $(".dist option:selected").val();
    var address = $("#branchaddress").val();
    var phone = $("#branchphone").val();
    var time = $("#opentime").val();
    var branchadminphone = $("#branchadminphone").val();
    if (name == "") {
        $.alertS("分店名称不能为空");
        return;
    }
    if (prov == "") {
        $.alertS("所在省不能为空");
        return;
    }
    if (city == "") {
        $.alertS("所在市不能为空");
        return;
    }
    if (dist == "") {
        $.alertS("所在区不能为空");
        return;
    }
    if (address == "") {
        $.alertS("地址信息不能为空");
        return;
    }
    if (phone == "") {
        $.alertS("分店电话不能为空");
        return;
    }
    if (time == "") {
        $.alertS("营业时间不能为空");
        return;
    }
    if (time.indexOf("-") == -1) {
        $.alertS("营业时间格式错误，eg: 09:00-18:00");
        return;
    }
    if (branchadminphone == "") {
        $.alertS("分店管理员不能为空");
        return;
    }
    if (!$.isMobilePhone(branchadminphone)) {
        $.alertS("分店管理员手机号不合法");
        return;
    }

    var url = "/StoreServices.svc/store/editbranchcompany";
    var param = {
        branchid: bid,
        branchname: name,
        province: prov,
        city: city,
        district: dist,
        branchaddress: address,
        branchphone: phone,
        opentime: time,
        branchadminphone: branchadminphone
    }
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            BindData();
            $.alertS("保存成功", function () { window.location.href = "/html/store/manage-branch.html"; });
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    })
});

$("#deletebranch").click(function () {
    $.confirmF("您确定要删除吗？", "", "", null, function () {
        var url = "/StoreServices.svc/store/deletebranchcompany";
        var param = {
            branchid: bid
        }
        $.AkmiiAjaxPost(url, param, false).then(function (data) {
            if (data.result) {
                $.alertS("删除成功", function () {
                    window.location.replace("manage-branch.html");
                });
            } else if (data.errorcode == "missAccountid") {
                $.alertS(data.errormsg, function () {
                    $.Loginlink();
                });
            } else {
                $.alertS(data.errormsg);
                return false;
            }
        })
    });
});
//当选中编辑分店管理员时，情况文本框值
$("#branchadminphone").bind('click', function () {
    $(this).val("");
    $("#branchadminname").html("");
});