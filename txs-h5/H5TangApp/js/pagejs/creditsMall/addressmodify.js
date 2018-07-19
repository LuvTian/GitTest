//ios 会用新webview打开链接造成sessionStorage失效


var address = {
    id: "",
    accountId: "",
    receivingName: "",
    cellPhone: "",
    provinceId: "",
    provinceName: "",
    cityId: "",
    cityName: "",
    countyId: "",
    countyName: "",
    address: "",
    defaultAddress: "FALSE"
}

var oldAddress = null;

var unSaved = false;


var id = $.getQueryStringByName("id");
var first = $.getQueryStringByName("first") || false;
var onlyone = $.getQueryStringByName("onlyone") || false;
var url = decodeURIComponent(window.location.href);
var parameters = url.indexOf("?") > 0 ? url.substr(url.indexOf("?")) : "";
var returnUrl = url.indexOf("returnUrl") > 0 ? url.substr(url.indexOf("returnUrl") + 10) : "";

var backUrlNum = sessionStorage["backUrlNum"] || 1;

$(function () {
    if (!sessionStorage["backUrlNum"]) {
        sessionStorage["backUrlNum"] = 1;
    }
    if (id != "") {
        $("#cid").val(id);
        getAddress(id);
    } else {
        getAddress();
    }

    //数据提交服务器
    $("#btn_save").click(function () {
        $.checkLogin();
        saveAddressToObj();
        if (validate()) {
            if ($("#cid").val() != "") {
                $.AkmiiAjaxPost(apiUrl_prefix + "/members/address/update", address, true).then(function (d) {
                    if (d.code == "200") {
                        $.alertF("更新成功!", "确定", function () {
                            if (returnUrl != "") {
                                window.location.href = returnUrl;
                            } else {
                                window.location.href = "/html/store/manage-delivery-address.html";
                            }
                        })
                        unSaved = false;
                    } else {
                        $.alertF(d.message);
                    }
                })
            } else {
                $.AkmiiAjaxPost(apiUrl_prefix + "/members/address/add", address, true).then(function (d) {
                    if (d.code == "200") {
                        $.alertF("添加成功!", "确定", function (data) {
                            return function () {
                                if (returnUrl != "") {
                                    if (returnUrl.indexOf('?') != -1) {
                                        window.location.href = returnUrl + "&addressId=" + data.addressId;
                                    }
                                    else {
                                        window.location.href = returnUrl + "?addressId=" + data.addressId;
                                    }
                                } else {
                                    window.location.href = "/html/store/manage-delivery-address.html";
                                }
                            }
                        }(d.data)
                        )
                        unSaved = false;
                    } else {
                        $.alertF(d.message);
                    }
                })
            }
            clearAddress();
        }
    })

    $(".setDefault").click(function () {
        if ($(this).hasClass("disabled")) {
            return false;
        }
        if ($(this).hasClass("on")) {
            $(this).removeClass("on").addClass("off");
            address.defaultAddress = "FALSE";
        } else {
            $(this).removeClass("off").addClass("on");
            address.defaultAddress = "TRUE";
        }
    })

    $(".del").click(function () {
        if (address.id != "") {
            $.confirmF("确认删除该收货地址", "取消", "确认", function () {
                return
            }, function () {
                $.AkmiiAjaxPost(apiUrl_prefix + "/members/address/disable", {
                    addressId: address.id
                }, true).then(function (d) {
                    if (d.code == 200) {
                        $.alertF("地址删除成功", "确定", function () {
                            window.location.href = "/html/store/manage-delivery-address.html"
                        })
                    } else {
                        $.alertF(d.message)
                    }
                });
            })
        } else {
            $.alertF("地址状态异常", "确定", function () {
                window.location.href = "/html/store/manage-delivery-address.html"
            })
        }
    })



    //防止页面后退
    /* history.pushState({
        page: 1
    }, null, document.URL);
    window.onpopstate = function (e) {
        console.log(history.state);
        unSaved = checkNeedSave();
        if (!unSaved) {
            setTimeout(function () {
                history.back();
                console.log("back")
            }, 0);
        } else {
            $.confirmF("您有尚未保存的地址，是否不保存离开", "取消", "确定",
                function () {
                    history.pushState(null, null, document.URL);
                },
                function () {
                    sessionStorage.removeItem("backUrlNum");
                    history.go(-backUrlNum);
                });
        }
    }; */
})

function checkNeedSave() {
    saveAddressToObj();
    var flag = false;
    $.each(oldAddress, function (k, v) {
        if (k == "accountId") {
            return true;
        }
        if (address[k] != v) {
            flag = true;
            return false;
        }
    })
    return flag;
}


//跳到城市选择
function choiceCity() {
    saveAddressToObj();
    saveAddress();
    window.location.replace("/html/store/choicecity_new.html" + parameters);
}

//保存用户输入到本地存储
function saveAddress() {
    if (1 == 2/* sessionStorage */) {
        sessionStorage["address"] = JSON.stringify(address);
        if (oldAddress != null) {
            sessionStorage["oldAddress"] = JSON.stringify(oldAddress);
        }
    } else {
        $.setCookie("address", JSON.stringify(address));
        $.setCookie("oldAddress", JSON.stringify(oldAddress));
    }
}

//从本地或者服务端获取已存地址
function getAddress(id) {
    if (id != undefined && (!sessionStorage["address"] && $.getCookie("address") == "")) {
        $.AkmiiAjaxGet(apiUrl_prefix + "/members/address/" + id, {}, false).then(function (d) {
            if (d.code == "200") {
                address = d.data;
                initPage();
            } else {
                $.alertF(d.message);
            }
        })
    } else {
        /* if (sessionStorage && sessionStorage["address"]) {
            address = $.parseJSON(sessionStorage["address"])
        } */
        if ($.getCookie("address") != "") {
            address = $.parseJSON($.getCookie("address"));
        }
        /* if (sessionStorage && sessionStorage["oldAddress"]) {
            oldAddress = $.parseJSON(sessionStorage["oldAddress"])
        } */
        if ($.getCookie("oldAddress") != "") {
            oldAddress = $.parseJSON($.getCookie("oldAddress"));
        }
        initPage();
    }
}

//从本地存储渲染表单
function renderAddress() {
    $("#name").val(address.receivingName);
    $("#phone").val(address.cellPhone);
    $("#detailAddress").val(address.address);
    $("#cid").val(address.id);
    if (address.defaultAddress == "TRUE" || first) {
        $(".setDefault").removeClass("off").addClass("on");
    } else {
        $(".setDefault").removeClass("on").addClass("off");
    }
    if (onlyone) {
        $(".setDefault").closest("section").hide();
    }
    if (first) {
        $(".setDefault").addClass("disabled");
        $(".setDefault_txt").text("当前地址自动切为默认地址");
    }
    $(".selectedCity").text(address.provinceName + " " + address.cityName + " " + address.countyName);
}

function clearAddress() {
    if (1 == 2/* sessionStorage */) {
        sessionStorage.removeItem("address");
        sessionStorage.removeItem("oldAddress");
    } else {
        $.setCookie("address", "");
        $.setCookie("oldAddress", "");
    }
}

function updatePage() {
    if (address.id != "") {
        $.UpdateTitle("编辑地址");
    } else {
        $.UpdateTitle("添加地址");
        $(".del").hide();
    }
}

function initPage() {
    if (oldAddress == null) {
        oldAddress = $.extend({}, address);
    }
    updatePage();
    renderAddress();
    clearAddress();
}


function saveAddressToObj() {
    address.receivingName = $("#name").val().trim();
    address.cellPhone = $("#phone").val().trim();
    address.address = $("#detailAddress").val().trim();
    address.accountId = $.getCookie("userid");
    if ($(".setDefault").hasClass("on")) {
        address.defaultAddress = "TRUE";
    } else {
        address.defaultAddress = "FALSE";
    }
}

function validate() {
    if (address.accountId == "") {
        $.alertF("请重新登录");
        return false;
    }
    if (address.receivingName == "") {
        $.alertF("收货人不能为空");
        return false;
    }
    if (address.cellPhone == "") {
        $.alertF("收货人手机号码不能为空");
        return false;
    }
    if (!(/^1[1-9][0-9]\d{8}$/.test(address.cellPhone))) {
        $.alertF("收货人手机号码不正确");
        return false;
    }
    if (address.provinceId == "" || address.provinceName == "" || address.cityId == "" || address.cityName == "" || address.countyId == "" || address.countyName == "") {
        $.alertF("收货城市选择异常，请重新选择");
        return false;
    }
    if (address.address == "") {
        $.alertF("收货详细地址不能为空");
        return false;
    }
    return true;
}