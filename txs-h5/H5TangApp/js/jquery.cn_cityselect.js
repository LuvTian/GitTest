/*
Ajax 三级省市联动
http://code.ciaoca.cn/
日期：2012-7-18

settings 参数说明
-----
url:省市数据josn文件路径
prov:默认省份
city:默认城市
dist:默认地区（县）
nodata:无数据状态
required:必选项
------------------------------ */
(function ($) {
    $.fn.citySelect = function (settings, pback, cback, dback) {
        if (this.length < 1) { return; };

        // 默认值
        settings = $.extend({
            url: $.resurl()+ "/js/cn_citytree.js",
            prov: null,
            city: null,
            dist: null,
            nodata: null,
            required: true
        }, settings);

        var box_obj = this;
        var prov_obj = box_obj.find(".prov");
        var city_obj = box_obj.find(".city");
        var dist_obj = box_obj.find(".dist");
        var prov_val = settings.prov;
        var city_val = settings.city;
        var dist_val = settings.dist;
        var select_prehtml = (settings.required) ? "" : "<option value=''>请选择</option>";
        var city_json;

        // 赋值市级函数
        var cityStart = function (isDefault) {
            var prov_id = prov_obj.get(0).selectedIndex;
            if (!settings.required) {
                prov_id--;
            };
            city_obj.empty().attr("disabled", true);
            dist_obj.empty().attr("disabled", true);

            if (prov_id < 0 || typeof (city_json.citylist[prov_id].C) == "undefined") {
                if (settings.nodata == "none") {
                    city_obj.css("display", "none");
                    dist_obj.css("display", "none");
                } else if (settings.nodata == "hidden") {
                    city_obj.css("visibility", "hidden");
                    dist_obj.css("visibility", "hidden");
                };
                return;
            };

            // 遍历赋值市级下拉列表
            temp_html = select_prehtml;
            $.each(city_json.citylist[prov_id].C, function (i, city) {
                if (isDefault && city.N == settings.city) {
                    temp_html += "<option value='" + city.I + "' selected='selected'>" + city.N + "</option>";
                } else {
                    temp_html += "<option value='" + city.I + "'>" + city.N + "</option>";
                }
            });
            city_obj.html(temp_html).attr("disabled", false).css({ "display": "", "visibility": "" });
            distStart(isDefault);
        };

        // 赋值地区（县）函数
        var distStart = function (isDefault) {
            var prov_id = prov_obj.get(0).selectedIndex;
            var city_id = city_obj.get(0).selectedIndex;
            if (!settings.required) {
                prov_id--;
                city_id--;
            };
            dist_obj.empty().attr("disabled", true);

            if (prov_id < 0 || city_id < 0 || typeof (city_json.citylist[prov_id].C[city_id].C) == "undefined") {
                if (settings.nodata == "none") {
                    dist_obj.css("display", "none");
                } else if (settings.nodata == "hidden") {
                    dist_obj.css("visibility", "hidden");
                };
                return;
            };

            // 遍历赋值市级下拉列表
            temp_html = select_prehtml;
            $.each(city_json.citylist[prov_id].C[city_id].C, function (i, dist) {
                if (isDefault && dist.N == settings.dist) {
                    temp_html += "<option value='" + dist.I + "' selected = 'selected'>" + dist.N + "</option>";
                } else {
                    temp_html += "<option value='" + dist.I + "'>" + dist.N + "</option>";
                }
            });
            dist_obj.html(temp_html).attr("disabled", false).css({ "display": "", "visibility": "" });
        };

        var init = function () {
            // 遍历赋值省份下拉列表
            temp_html = select_prehtml;
            $.each(city_json.citylist, function (i, prov) {
                if (prov.N == settings.prov) {
                    temp_html += "<option value='" + prov.I + "' selected='selected'>" + prov.N + "</option>";
                } else {
                    temp_html += "<option value='" + prov.I + "'>" + prov.N + "</option>";
                }
            });
            prov_obj.html(temp_html);

            if (settings.prov != null) {
                cityStart(true);
                if (settings.city != null) {
                    distStart(true);
                }
            }

            //// 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
            //setTimeout(function () {
            //    if (settings.prov != null) {
            //        //prov_obj.val(settings.prov);
            //        $(".prov option:contains('" + settings.prov + "')").attr("selected", true);
            //        cityStart();
            //        setTimeout(function () {
            //            if (settings.city != null) {
            //                //city_obj.val(settings.city);
            //                $(".city option:contains('" + settings.city + "')").attr("selected", true);
            //                distStart();
            //                setTimeout(function () {
            //                    if (settings.dist != null) {
            //                        //dist_obj.val(settings.dist);
            //                        $(".dist option:contains('" + settings.dist + "')").attr("selected", true);
            //                    };
            //                }, 1);
            //            };
            //        }, 1);
            //    };
            //}, 1);

            // 选择省份时发生事件
            prov_obj.bind("change", function () {
                if (pback && pback instanceof Function) {
                    pback(prov_obj.find("option:selected").text());
                }

                cityStart(false);
            });

            // 选择市级时发生事件
            city_obj.bind("change", function () {
                if (cback && cback instanceof Function) {
                    cback(city_obj.find("option:selected").text());
                }
                distStart(false);
            });
            // 选择市级时发生事件
            dist_obj.bind("change", function () {
                if (dback && dback instanceof Function) {
                    dback(dist_obj.find("option:selected").text());
                }
            });
        };

        // 设置省市json数据
        if (typeof (settings.url) == "string") {
            $.getJSON(settings.url, function (json) {
                city_json = json;
                init();
            });
        } else {
            city_json = settings.url;
            init();
        };
    };
})(jQuery);

