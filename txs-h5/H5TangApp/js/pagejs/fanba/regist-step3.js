/// <reference path="/jquery.cityselect.js" />
/// <reference path="/_references.js" />
var _BankMaintain = new BankMaintain();
//第三方返吧隱藏先去逛逛
    var activekey=$.getCookie("activekey")||"";
if(activekey=="Fanba"){$(".other").hide();}
var returnUrl=$.getQueryStringByName("returnurl")||"";//返吧回哪里
$(function () {
    
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
    var $BindBtn = $("#btn-ok");
    $(".selectProvinceCity").citySelect({
        nodata: "none",
        required: false
    }, function (a) {
        if (a == "") {
            a = "请选择省份";
        }
        $("#ProvinceInfo").text(a);
        $("#CityInfo").text("请选择城市");
    }, function (a) {
        if (a == "") {
            a = "请选择城市";
        }
        $("#CityInfo").text(a);
    });
    init();
    getUserInfo();

    function init() {
        //获取银行机构
        $.AkmiiAjaxPost("/StoreServices.svc/user/bankList").done(function (d) {
            if (d.result) {
                var OrganizationOptionHtml = "";
                BankOrganization = d.data;
                $.each(d.banklist, function (index, entry) {
                    var text = entry;
                    if (text == "建设银行") {
                        text = entry + "(推荐)";
                    }
                    OrganizationOptionHtml += "<option data-bankname=" + entry + " value=" + entry + ">" + text + "</option>";
                });
                $bankList.append(OrganizationOptionHtml);
            }
        });
    }

    $bankList.change(function () {
        var selectedBankValue = $bankList.find(":selected").val();
        if (selectedBankValue == "-1") {
            return;
        }
        var selectedName = $bankList.find(":selected").text();
        $bankInfo.html(selectedName);
        //银行维护通知
        var bankName = $bankList.find(":selected").data("bankname");
        _BankMaintain.getData(bankName)
            .done(function () {
                _BankMaintain.bindCardMaintain();
            });
    });


    //获取验证码
    $getyzm.bind("click", function () {
        var params = {
            bankname: $bankList.find(":selected").val(),
            bankcard: $("#BankCard").val(),
            bankmobile: $("#Phone").val(),
            province: $ProvinceList.find(":selected").text(),
            city: $CityList.find(":selected").text()
        };
        if (params.bankname == "-1") {
            $.alertF("请选择银行");
            return;
        }
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
        $.AkmiiAjaxPost("/StoreServices.svc/user/bindcard", params).then(function (d) {
            $.hideLoader();
            if (d.result) {
                $.GetYzm("btn-getbankcode", 120);
                $("#hid-tranId").val(d.tradeno);
            } else {
                $.alertF(d.errormsg);
            }
        }, function (d) {
            $.alertF(d.ErrorMsg);
            $.hideLoader();
        });
    });

    //绑定银行卡推进
    $BindBtn.bind("click", function () {
        var params = {
            smscode: $("#input-sinacode").val(),
            tradeno: $("#hid-tranId").val()
        };
        if (!$.isNumber(params.smscode)) {
            $.alertF("请填写验证码");
            return;
        }
        if ($.isNull(params.tradeno)) {
            $.alertF("请获取验证码");
            return;
        }
        $.showLoader();
        $.AkmiiAjaxPost("/StoreServices.svc/user/bindcardadvance", params).then(function (d) {
            $.hideLoader();
            //获取基本信息
            //GetUserInfo();
            if (d.result) {
                //绑卡转换代码
                _pyBindCardSuccess(account.referralcode, account.username, account.mobile);
                if (account.invitedby == _CHANNELCODE) {
                    _MVbindCard();
                }
                //新浪二期改造流程
                if (account.iswithholdauthoity == 0) {
                    if(activekey=="Fanba"){
                        var returnurl = window.location.origin + "/eback.html?r=" +decodeURIComponent(returnUrl);
                    }else{
                        var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin;
                    }
                    var result = $.showActiveSinaAccount(returnurl, currentDate, account.referralcode, account.iscashdesknewuser);
                    if (!result) {
                        window.location.replace(decodeURIComponent(returnUrl));
                    }
                } else {
                    window.location.replace(decodeURIComponent(returnUrl));
                }
            } else {
                $.alertF(d.errormsg);
            }
        }, function (d) {
            $.GetYzm("btn-getbankcode", 120);
            $.alertF(d.ErrorMsg);
            $.hideLoader();
        });
    });

});

var account = [];
var currentDate = "";
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            account = data.accountinfo;
            currentDate = data.date;
            if (account.invitedby == _CHANNELCODE) {
                //MediaV-load
                _loadMVScript();
            }
            switch (data.accountinfo.customstatus) {
                case 0:
                    if (window.location.pathname != "/html/fanba/regist-step1.html") {
                        window.location.replace("/html/fanba/regist-step1.html?returnurl="+returnUrl);
                    }
                    break;
                case 1:
                    if (window.location.pathname != "/html/fanba/regist-step2.html") {
                        window.location.replace("/html/fanba/regist-step2.html?returnurl="+returnUrl);
                    }
                    break;
                case 2:
                    if (window.location.pathname != "/html/fanba/regist-step3.html") {
                        window.location.replace("/html/fanba/regist-step3.html?returnurl="+returnUrl);
                    }
                    break;
                case 3:
                    window.location.replace(decodeURIComponent(returnUrl));
                    break;
                default:
                    window.location.replace(decodeURIComponent(returnUrl));
                    break;
            }
        }
    });
};


//var showActiveSinaAccount = function () {

//    var returnurl = window.location.origin + "/eback.html?r=" + window.location.origin;
//    $.GetsinaAlertMessagesByType(1, function (item) {
//        var h = [];
//        h.push('<div style="width: 100%;height: 100%;background: #000;opacity: .5;position: fixed;top: 0;z-index: 20;overflow: hidden;"></div>');

//        h.push('<div style="background: #fff;border-radius: 5px;text-align: center;position: fixed;z-index: 2200;width: 85%;left: 50%;margin-left: -42%;top:23%;">');
//        h.push('<h1 style="font-size: 1.8rem;padding:1rem;">' + item.title + '</h1>');
//        h.push('<h3 style="font-size:1.4rem;text-align:left;padding:.5rem 1rem;">' + item.contents[0].title + '</h3>');
//        h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0rem 1rem;color:#979797;">' + item.contents[0].contents[0] + '</p>');
//        h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:0rem 1rem;color:#979797;">' + item.contents[0].contents[1] + '</p>');
//        h.push('<h3 style="font-size:1.4rem;text-align:left;padding:.5rem 1rem;">' + item.contents[1].title + '</h3>');
//        h.push('<p style="text-indent: 2.5rem;text-align: left;font-size: 1.4rem;padding:.5rem 1rem;color:#979797;">' + item.contents[1].contents[0] + '</p>');
//        h.push('<p style="text-align: left;font-size: 1rem;padding:.5rem 1rem;color:#979797;">' + item.contents[2].contents[0].replace(item.contents[2].linktitle[0], "") + '<a href="' + item.contents[2].linkurl[0] + '" style="color:#65A8F3;">' + item.contents[2].linktitle[0] + '</a></p>');
//        h.push('<div style="width:100%;height:1px;background:#ccc;margin-top:1rem"></div>');
//        h.push('<a id="gotosetting" href="javascript:void(0);" style="color:#c54846;font-size: 1.6rem;line-height:3;">' + item.btn1 + '</a>');
//        h.push('</div>');

//        var html = $(h.join(''));
//        html.find("#gotosetting").click(function () {
//            html.remove();
//            $.sinarequest(20, false, returnurl);
//        });
//        $("body").append(html);
//    });
//};
