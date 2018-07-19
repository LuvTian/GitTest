var selectedCity = [];

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
    defaultAddress: false
}

var preventClick=false;


var url = window.location.href;
var parameters = url.indexOf("?") > 0 ? url.substr(url.indexOf("?")) : "";

$(function () {
    if (1==2/* sessionStorage */) {
        address = $.parseJSON(sessionStorage["address"]);
        var backUrlNum=parseInt(sessionStorage["backUrlNum"]);
        sessionStorage["backUrlNum"]=++backUrlNum;
    } else {
        address = $.parseJSON($.getCookie("address"));
        $.setCookie("hasnullstate","true");
    }
    $.AkmiiAjaxGet(apiUrl_prefix + "/dict/address/layered/1", {}, false).then(function (d) {
        if (d.code == "200") {
            renderCityList(d.data);
        } else {
            $.alertF(d.message);
        }
    })

})

function renderCityList(data) {
    var tpl = '<li onclick="renderNextList({1},\'{0}\')">{0}<i class="rightArrow"></i></li>'
    var temp = "";
    $.each(data, function (k, v) {
        temp += tpl.format(v.name, v.id);
    })
    $("#cityList").html($(temp));
}

function renderNextList(pid, cname) {
    if(preventClick){
        return false;
    }
    preventClick=true;
    selectedCity.push({
        cityId: pid,
        cityName: cname
    });
    if (selectedCity.length >= 3) {
        address.provinceId = selectedCity[0].cityId;
        address.provinceName = selectedCity[0].cityName;
        address.cityId = selectedCity[1].cityId;
        address.cityName = selectedCity[1].cityName;
        address.countyId = selectedCity[2].cityId;
        address.countyName = selectedCity[2].cityName;
        saveAddress();
        window.location.replace("/html/store/addressmodify.html" + parameters);
        return false;
    }
    $.AkmiiAjaxGet(apiUrl_prefix + "/dict/address/" + pid + "/childrens", {}, false).then(function (d) {
        if (d.code == "200") {
            renderCityList(d.data);
            preventClick=false;
        } else {
            $.alertF(d.message);
        }
    })
}

function saveAddress() {
    if (1==2/* sessionStorage */) {
        sessionStorage["address"] = JSON.stringify(address);
    } else {
        $.setCookie("address", JSON.stringify(address));
    }
}