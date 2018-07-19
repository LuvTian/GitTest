//企业信息
$(function () {
    BindData();
});

var BindData = function () {
    var url = "/StoreServices.svc/store/getbusinesscenterinfo";
    var param = {};
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            $("#companylogo").attr("src", data.companylogo);
            $("#companyname").html(data.companyname);
            $("#area").html(data.companyprovince + data.companycity + data.companydistrict);
            $("#address").html(data.companyaddress);
            $("#phone").html(data.phone);
            $("#opentime").html(data.opentimestart + "-" + data.opentimeend);
            $("#showimg").attr("src", data.showsmallimg);
            $("#companyid").html(data.companyid || "信息未登记");
            $("#legealperson").html(data.companylegal || "信息未登记");
            $("#legealphone").html(data.legalphone || "信息未登记");
            if (data.businesslicense) {
                $("#businesslicense").attr("src", data.businesslicense);
            }
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

function matchPhoneNumber(phoneNumber) {
    var reg = /^(\d{3})(\d{4})(\d{4})$/;
    var matches = reg.exec(phoneNumber);
    var newNum = matches[1] + '-' + matches[2] + '-' + matches[3];
    return newNum;
}