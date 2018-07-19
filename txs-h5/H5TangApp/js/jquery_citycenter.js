/// <reference path="common.js" />
/*
baidumap_citycenterlistpro.js
name：百度名字
I：城市ID
N：国家规定的城市名
P：父及ID
*/
var d = {};
var $searchlist = $("#searchlist");
var Location = {};//经纬度
var current_search_list = {};
$(function () {
    Search();
    CurrentCity();
    hotCity();
    loadAllCity();
    //搜索
    function Search() {
        //监听文本框输入
        var inputText = function () {
            var value = $(this).val().trim();
            if (!$.isNull(value)) {
                $searchlist.html("");
                current_search_list = {};
                $.getJSON('/js/baidumap_citycenterlistpro.js', function (json) {
                    $.each(json, function (index, element) {
                        if (element.N.indexOf(value) > -1 && !current_search_list[element.N]) {
                            $("#searchContainer").show();
                            current_search_list[element.N] = true;
                            var ha = [];
                            ha.push('<div class="row bg-white bt"><div class="small-12 columns az-padding0 az-text-center ">' + element.N + '</div></div>');
                            var item = $(ha.join(''));
                            item.click(function () {
                                $.confirmF("即将定位到" + element.N + "", null, null, null, function () {
                                    var Location = {
                                        lng: element.J,
                                        lat: element.W
                                    };
                                    $.setCookie("MadisonStoreBaiduLocation", JSON.stringify(Location), 30);
                                    var addComp = {
                                        province: "",
                                        city: element.N,
                                        citycode: element.I,
                                        district: "",
                                        street: "",
                                        streetNumber: ""
                                    };
                                    $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 30);
                                    CurrentCity();
                                    location.href = document.referrer;
                                });

                            });
                            $searchlist.append(item);
                        }
                    })
                });
            }
            else {
                $searchlist.html("");
                $("#searchContainer").hide();
            }
        }
        var bind_name = "input";
        if (navigator.userAgent.indexOf("MSIE") != -1) {
            bind_name = 'propertychange';
        }
        $("#search").unbind(bind_name).bind(bind_name, inputText);
    }

    //当前城市
    function CurrentCity() {

        //$.getWechatconfig("getLocation", Success, Failure);

        var LocationCityCookie = $.getCookie("MadisonStoreBaiduLocationCity");
        if (!$.isNull(LocationCityCookie)) {
            addComp = (new Function('return' + LocationCityCookie))();
            $("#currentcity").html(addComp.city);
        }
        else {
            $("#currentcity").html("未定位");
        }
    }

    //加载所有城市
    function loadAllCity() {
        $("#choosecitylist > div").hide();
        $.getJSON('/js/baidumap_citycenterlistpro.js', function (json) {
            $.each(json, function (index, element) {
                var cityelement = $("#" + element.Y + "city");
                if (cityelement.is(':hidden')) {
                    cityelement.show();
                }

                $("#" + element.Y.toLocaleLowerCase()).parent().show();
                var ha = [];
                ha.push('<div class="row bg-white bt"><div class="small-12 columns az-padding0 az-text-center ">' + element.N + '</div></div>');
                var item = $(ha.join(''));
                cityelement.append(item);

                item.click(function () {
                    $.confirmF("即将定位到" + element.N + "", null, null, null, function () {
                        var Location = {
                            lng: element.J,
                            lat: element.W
                        };
                        $.setCookie("MadisonStoreBaiduLocation", JSON.stringify(Location), 30);
                        var addComp = {
                            province: "",
                            city: element.N,
                            citycode: element.I,
                            district: "",
                            street: "",
                            streetNumber: ""
                        };
                        $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 30);
                        CurrentCity();
                        location.href = document.referrer;
                    });

                });
            });
        })
    }

    //加载热门城市
    function hotCity() {

        var hotlist = '[{ "I": "310000", "N": "上海市", "Y": "S", "B": "上海", "P": "100000", "J": 121.48789900000, "W": 31.24916200000 },{ "I": "110000", "N": "北京市", "Y": "B", "B": "北京", "P": "100000", "J": 116.39564500000, "W": 39.92998600000 },{ "I": "440100", "N": "广州市", "Y": "G", "B": "广州", "P": "440000", "J": 113.30765000000, "W": 23.12004900000 },{ "I": "440300", "N": "深圳市", "Y": "S", "B": "深圳", "P": "440000", "J": 114.02597400000, "W": 22.54605400000 }]';
        var json = eval("(" + hotlist + ")");//转换为json对象
        $.each(json, function (index, element) {
            var cityelement = $("#hotcity");
            var ha = [];
            ha.push('<div class="row bg-white bt"><div class="small-12 columns az-padding0 az-text-center">' + element.N + '</div></div>');
            var item = $(ha.join(''));
            cityelement.append(item);
            item.click(function () {
                $.confirmF("即将定位到" + element.N + "", null, null, null, function () {
                    var Location = {
                        lng: element.J,
                        lat: element.W
                    };
                    $.setCookie("MadisonStoreBaiduLocation", JSON.stringify(Location), 30);
                    var addComp = {
                        province: "",
                        city: element.N,
                        citycode: element.I,
                        district: "",
                        street: "",
                        streetNumber: ""
                    };
                    $.setCookie("MadisonStoreBaiduLocationCity", JSON.stringify(addComp), 30);
                    CurrentCity();
                    location.href = document.referrer;

                });

            });
        });
    }




    //loadBaiduMap_CityCenter();
    //获取百度城市默认经纬度
    function loadBaiduMap_CityCenter() {
        $.getJSON('/js/baidumap_citycenter_utf8.js', function (json) {
            //console.log(json);
            d = json;
            var citys = "";
            $.each(d.provinces, function (index, element) {
                $.each(element.cities, function (indexc, elementc) {
                    var ext = elementc.g.split('|')[1];
                    var lng = (elementc.g.split('|')[0]).split(',')[0];
                    var lat = (elementc.g.split('|')[0]).split(',')[1];
                    var name = elementc.n;
                    var name0 = name.substr(0, 1);
                    var py = (makePy(name0))[0];
                    citys += '{"py":"' + py + '","name":"' + elementc.n + '","lng":"' + lng + '","lat":"' + lat + '","ext":"' + ext + '"},';
                    //{"name":"xxx","lng":"000","lat":"xxx"},{"name":"xxx","ll":"000"}
                });
            });

            $.each(d.municipalities, function (indexc, elementc) {

                var ext = elementc.g.split('|')[1];
                var lng = (elementc.g.split('|')[0]).split(',')[0];
                var lat = (elementc.g.split('|')[0]).split(',')[1];

                var name = elementc.n;
                var name0 = name.substr(0, 1);
                var py = (makePy(name0))[0];


                citys += '{"py":"' + py + '","name":"' + elementc.n + '","lng":"' + lng + '","lat":"' + lat + '","ext":"' + ext + '"},';
                //{"name":"xxx","lng":"000","lat":"xxx"},{"name":"xxx","ll":"000"}
            });


            $.each(d.other, function (indexc, elementc) {

                var ext = elementc.g.split('|')[1];
                var lng = (elementc.g.split('|')[0]).split(',')[0];
                var lat = (elementc.g.split('|')[0]).split(',')[1];

                var name = elementc.n;
                var name0 = name.substr(0, 1);
                var py = (makePy(name0))[0];


                citys += '{"py":"' + py + '","name":"' + elementc.n + '","lng":"' + lng + '","lat":"' + lat + '","ext":"' + ext + '"},';
                //{"name":"xxx","lng":"000","lat":"xxx"},{"name":"xxx","ll":"000"}
            });
            //console.log(citys);
        });
    }

    //整合stev的城市和我的城市列表
    function aa() {
        $.getJSON('/js/baidumap_citycenterlist.js', function (json) {
            //console.log(json);
            $.each(json.cities, function (index, element) {
                $.getJSON('/js/baiducity.js', function (json2) {
                    $.each(json2, function (index2, element2) {
                        if (element.name == element2.B) {

                            citylist1 += "{\"py\": \"" + element.py + "\",\"name\": \"" + element.name + "\",\"lng\": \"" + element.lng + "\",\"lat\": \"" + element.lat + "\",\"I\": \"" + element2.I + "\",\"N\": \"" + element2.N + "\",\"P\": \"" + element2.P + "\"},";
                            if (index == 363) {
                                //console.log(citylist1);
                            }
                        }
                    });
                });
            });
        });
    }

});



// 重新定位
var map = new BMap.Map("allmap");
$("#reposition").click(function () {
    navigator.geolocation.getCurrentPosition(success, erroralert); //获取当前位置的经纬度
});


//获取成功
function success(position) {
    var lat = position.coords.latitude;//y，纬度
    var lon = position.coords.longitude;//x，经度
    var Location = {
        lng: lon,
        lat: lat
    };
    $.setCookie("MadisonStoreBaiduLocation", JSON.stringify(Location), 30);
    $.getrepositionLocationCity(getLocationCityFun, lon, lat);
}

//获取到当前位置弹框提示
function getLocationCityFun(data) {
    $.alertF("当前位置在" + data.city + " " + data.district + "", "确定", function () { window.location.href = "/html/store/index.html"; });
}

//获取失败
function erroralert() {
    $.alertF("获取失败，请稍后重试！");
}


