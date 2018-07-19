
//总店ID
var company = [];//总店信息
var aboutUrl = "";

$(function () {
    getCompanyInfo();
    $('.small-3').each(function () {
        $(this).height($(this).prev().innerHeight() + 'px');
        $(this).css('line-height', $(this).prev().innerHeight() + 'px');
    });
    $('#headquarters').click(function () {
        $('#headquarters').toggleClass('icon-choosed');
        if ($('#headquarters').hasClass('icon-choosed')) {
            $("#opentime").val(company.opentimestart + "-" + company.opentimeend);
        } else {
            $("#opentime").val("");
        }
    });
});

//获取总店时间
var getCompanyInfo = function () {
    var url = "/StoreServices.svc/store/getbusinesscenterinfo";
    var param = {};
    $.AkmiiAjaxPost(url, param, true).then(function (data) {
        if (data.result) {
            company = data;
            var userType = "1,2";
            if (userType.indexOf(company.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            $("#prov").val(company.companyprovince);
            $("#city").val(company.companycity);
            $("#dist").val(company.companydistrict);
            BindRegion(company.companyprovince, company.companycity, company.companydistrict);
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                window.location.replace("/html/anonymous/login.html");
            });
        } else {
            $.alertS(data.errormsg);
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

$("#btnSubmit").click(function () {

    var name = $("#branchname").val();
    var prov = $(".prov option:selected").val();
    var city = $(".city option:selected").val();
    var dist = $(".dist option:selected").val();
    var address = $("#branchaddress").val();
    var phone = $("#branchphone").val();
    var time = $("#opentime").val();
    if (time == "") {
        time = $("#opentime").attr("placeholder");
    }
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
        $.alertS("分店管理员电话号码不合法！");
        return;
    }
    var url = "/StoreServices.svc/store/addbranchcompany";
    var param = {
        branchname: name,
        branchaddress: address,
        branchphone: phone,
        province: prov,
        city: city,
        district: dist,
        opentime: time,
        branchadminphone: branchadminphone
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            $.alertS("新增成功", function () {
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
