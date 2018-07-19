/// <reference path="/jquery.cityselect.js" />
/// <reference path="/_references.js" />

$(function() {
    var $bankList = $("#bankList"); //银行列表
    var $bankInfo = $("#bankInfo") //银行
    var $ProvinceList = $("#ProvinceList"); //省列表
    var $ProvinceInfo = $("#ProvinceInfo") //省信息
    var $CityList = $("#CityList"); //城市列表
    var $CityInfo = $("#CityInfo"); //城市
    var $getyzm = $("#btn-getbankcode"); //获取验证码
    var $Phone = $("#Phone");
    var BankOrganization = "";
    var provinceAndCityArray = "";
    var $BindBtn = $("#BindBtn");
    $(".selectProvinceCity").citySelect({
        nodata: "none",
        required: false
    }, function(a) {
        if (a == "") a = "请选择省份";
        $("#ProvinceInfo").text(a);
    }, function(a) {
        if (a == "") a = "请选择城市";
        $("#CityInfo").text(a);
    });
    init();

    function init() {
        ////获取银行机构
        $.AkmiiAjaxPost("/StoreServices.svc/user/bankList").done(function(d) {
            if (d.result) {
                var OrganizationOptionHtml = "";
                BankOrganization = d.data;
                $.each(d.banklist,function(index,entry){
                    OrganizationOptionHtml += "<option value=" + entry + ">" + entry + "</option>";
                });
                $bankList.append(OrganizationOptionHtml);
            }
        });
    }

    $bankList.change(function() {
        var selectedBankValue = $bankList.find(":selected").val();
        if (selectedBankValue == "-1") {
            return;
        }
        $bankInfo.html($bankList.find(":selected").text());
    });


    //获取验证码
    $getyzm.bind("click", function() {
        var params = {
            bankname: $bankList.find(":selected").text(),
            bankcard: $("#BankCard").val(),
            bankmobile: $("#Phone").val(),
            province: $ProvinceList.find(":selected").text(),
            city: $CityList.find(":selected").text()
        };
        if (params.bankcard.length < 16) {
            $.alertF("请确认卡号,长度为16到19位");
            return;
        }
        if (!$.isNumber(params.bankcard)) {
            $.alertF("请填写正确的卡号");
            return;
        }
        if (!$.isMobilePhone(params.bankmobile)) {
            $.alertF("请填写正确的手机号码");
            return;
        }
        if ($ProvinceList.find(":selected").val() == "") {
            $.alertF("请选择省份");
            return;
        }
        if ($CityList.find(":selected").val() == "") {
            $.alertF("请选择城市");
            return;
        }
        $.showLoader();
        $.AkmiiAjaxPost("/StoreServices.svc/user/bindcard", params).then(function(d) {

            $.hideLoader();
            if (d.result) {
                $.GetYzm("getyzm");
            } else {
                $.alertF(d.errormsg);
            }
        }, function(d) {
            $.alertF(d.ErrorMsg);
            $.hideLoader();
        });
    });

    //绑定银行卡推进
    $BindBtn.bind("click", function() {
        var params = {
            BankCode: $bankList.find(":selected").val(),
            BankName: $bankList.find(":selected").text(),
            BankCard: $("#BankCard").val(),
            BankMobile: $("#Phone").val(),
            Province: $ProvinceList.find(":selected").text(),
            City: $CityList.find(":selected").text(),
            Yzm: $("#yzm").val(),
        };
        if (!$.isNumber(params.Yzm)) {
            $.alertF("请填写验证码");
            return;
        }
        $.showLoader();
        $.AkmiiAjaxPost("/StoreServices.svc/user/bindcardadvance", params).then(function(d) {
            $.hideLoader();
            //获取基本信息
            //GetUserInfo();
            if (d.result) {
                //跳转
            } else {
                $.alertF(d.errormsg);
            }
        }, function(d) {
            $.GetYzm("getyzm", 1);
            $.alertF(d.ErrorMsg);
            $.hideLoader();
        });
    });

});