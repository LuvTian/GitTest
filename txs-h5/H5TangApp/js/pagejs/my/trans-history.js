var flag = true;
var platIndex = 1; //交易记录分类//默认唐小僧
var transactionType = 0; //交易类型//默认全部
var transactionTabIndex = 0; //交易类型对应的tab index
var lastAccountId = 1; //每页数量
var platform = 1; //页码
var id = $.getCookie("userid");
var tab_remove = true;
var pageSize = 10;
var lastIdArr = [];
var lastrecodrId = 0;
var lastTransDateArr = [];
var lastTransDate = "";
// var apiUrl_prefix = "http://192.168.107.160:8991";
$(function() {
    init();
    showGuide();
    //引导层是否出现
    function showGuide() {
        if ($.getLS("gjscookie")) {
            $(".guide_mask,.tip").hide();
        } else {
            $(".guide_mask,.tip").show();
            $.setLS("gjscookie", id);
        }
    }
    //引导层关闭
    $(".JS_guide,.guide_mask").click(function() {
            $(".guide_mask,.tip").hide();
        })
        //平台分类下拉选择
    $(".JS_choose").click(function() {
        if (flag) {
            $(".choose_favourable").show();
            $(".JS_mask").show();
            $(".triangle").removeClass("triangle_up").addClass("triangle_down");
            flag = false;
            $("body").addClass("noscroll");
        } else {
            $(".choose_favourable").hide();
            $(".JS_mask").hide();
            $(".triangle").removeClass("triangle_down").addClass("triangle_up");
            flag = true;
            $("body").removeClass("noscroll");
        }

    });
    //选定当前展示的平台
    $(".title_favourable").delegate(".choose_favourable li", "click", function() {
            flag = true;
            tab_remove = true;
            var index = $(this).index();
            platIndex = index + 1;
            transactionType = 0;
            transactionTabIndex = 0;
            tradingRecord.get_tab_list();
            // tradingRecord.get_content_list(tab_remove);
            $(".triangle").removeClass("triangle_down").addClass("triangle_up");
            $(this).addClass("choosed_favourable")
                .siblings().removeClass("choosed_favourable");
            $(".choose_favourable").hide();
            $(".JS_mask").hide();
            $(".title_name").text($(this).text());
            $("body").removeClass("noscroll");
        })
        //平台分类下拉遮罩层关闭
    $(".JS_mask").click(function() {
        flag = true;
        $(".triangle").removeClass("triangle_down").addClass("triangle_up");
        $(this).addClass("choosed_favourable")
            .siblings().removeClass("choosed_favourable");
        $(".choose_favourable").hide();
        $(".JS_mask").hide();
        $("body").removeClass("noscroll");
    });
    //投资记录tab切换
    $(".JS_tab").delegate("li", "click", function(e) {
        var index = $(this).index();
        transactionTabIndex = index;
        transactionType = $(this).data("type_value");
        platform = 1;
        $(this).addClass("tab_selected").siblings().removeClass("tab_selected");
        $(".JS_content > div").eq(index).show()
            .siblings().hide();
        if (!$(".JS_content > div").eq(index).children(".pro_list").html()) {
            $("body").scrollTop("0");
            tab_remove = true;
            tradingRecord.get_content_list(tab_remove);
        }

    })

    function init() {
        tradingRecord.get_tab_list();
    }
})
var tradingRecord = {
    record_platform: '<li class="{1}">{0}</li>',
    record_tab_tpl: '<li class="{1} headspitem" data-type_value="{2}">{0}</li>', //tab_selected
    record_ul_tpl: '<div><ul class="pro_list"></ul></div>',
    record_content_tpl: '<li>\
                            <div>\
                                <span class="pro_name">{0}</span>\
                                <span class="time">{1}</span>\
                            </div>\
                            <div>\
                                <span class="pro_money {5}">{2}{3}</span>\
                                <span class="status">{4}</span>\
                            </div>\
                        </li>',
    get_tab_list: function() { //获取每种交易记录下的分类
        this._getTabList(platIndex);
    },
    get_content_list: function(tab_remove) { //获取每种分类下的内容
        this._getContentList(platIndex, transactionType, tab_remove);
    },
    _getTabList: function(platIndex) {
        var url = apiUrl_prefix + "/account/transaction/platform/list"
        $.AkmiiAjaxGet(url, false).then(function(d) {
            if (d.code == 200) {
                var platDataList = [];
                var dataList = [];
                var tab_data = d.data;
                for (var i = 0; i < tab_data.length; i++) {
                    platDataList.push(tab_data[i].platform);
                    dataList.push(tab_data[i].typeList);
                }
                tradingRecord.render_tab_html(dataList, tradingRecord.record_tab_tpl, tradingRecord.record_ul_tpl);
                tradingRecord.render_platform_html(platDataList, tradingRecord.record_platform);
            }
        })
    },
    _getContentList: function(platIndex, transactionType, tab_remove) {
        var lastId = 0;
        if (tab_remove && flag) { //如果是切换tab请求接口则lastrecodrId，lastTransDate都为默认的值
            lastrecodrId = lastIdArr[transactionTabIndex];
            lastTransDate = lastTransDateArr[transactionTabIndex];

        }
        var D = {
            platform: platIndex,
            transType: transactionType,
            lastId: lastrecodrId,
            pageSize: pageSize,
            lastTransDate: lastTransDate
        };
        var url = apiUrl_prefix + '/account/transaction/list';
        $.AkmiiAjaxPost(url, D, false).then(function(d) {
            if (d.code == 200) {
                var data = d.data;
                tradingRecord.render_content_html(data, transactionType, tradingRecord.record_content_tpl, tab_remove);
                if (data.length > 0) {
                    lastrecodrId = data[data.length - 1].id;
                    lastTransDate = data[data.length - 1].transDate ? data[data.length - 1].transDate.trim().replace(" ", "T") : '';
                }
                //console.log(lastrecodrId + "aaaa")
            } else {
                $.alertF(d.message);
            }
        })
    },
    render_platform_html: function(platDataList, tpl) { //交易记录类型渲染
        var temp = "";
        platDataList.forEach(function(item) {
            if (item.value == platIndex) { //value为1时表示默认是唐小僧
                selectPlat = "choosed_favourable";
            } else {
                selectPlat = "";
            }
            temp += tpl.format(item.name, selectPlat);
        })
        $(".title_name").text(platDataList[platIndex - 1].name);
        $(".choose_favourable").html("").append(temp);
        tradingRecord.get_content_list(tab_remove);
    },
    render_tab_html: function(data, tpl, url_tpl, plat_tpl) { //交易类型渲染
        var temp = "";
        var temp_url = "";
        var platData = data[platIndex - 1];
        platData.forEach(function(item) {
            if (item.value == transactionType) { //value为0时表示全部
                var selectclass = "tab_selected";
            } else {
                var selectclass = "";
            }
            temp += tpl.format(item.name, selectclass, item.value);
            temp_url += url_tpl;
        });
        $(".JS_tab").html("").append(temp);
        $(".JS_content").html("").append(temp_url);
        var tabL = $(".JS_tab li").length;
        for (var i = 0; i < tabL; i++) {
            lastIdArr.push(0);
            lastTransDateArr.push("");
        }
    },
    render_content_html: function(data, transactionType, tpl, tab_remove) { //交易类型对应的内容渲染
        var temp = "";
        $(".JS_content > div").eq(transactionTabIndex).find(".ondata").remove();
        $(".JS_content > div").eq(transactionTabIndex).append('<div class="ondata JS_ondata">点击加载更多</div>');
        if (data.length > 0) {
            data.forEach(function(item) {
                if (item.direction) {
                    var symbol = "+";
                    var color = "red_color";
                } else {
                    var symbol = "-";
                    var color = "green_color";
                }
                if (platIndex == 1 && transactionType == 0) { //platIndex==1表示是唐小僧平台，transactionType==0表示是全部
                    statustext = "余额：" + ($.fmoney(item.afterbalance) || "");
                } else {
                    statustext = item.statustext;
                }
                if (transactionType == 3) { //platIndex==1表示是唐小僧平台，transactionType==3表示是投资
                    productname = item.detailtext ? (item.detailtext + "-" + (item.productname || "")) : (item.productname || "");
                } else {
                    productname = item.detailtext || "";
                }
                if (transactionType == 0) {
                    $(".pro_list").parent("div").eq(transactionTabIndex).show().siblings().hide();
                }
                temp += tpl.format(
                    productname,
                    item.created || "",
                    symbol,
                    $.fmoney(item.tranamount) || "",
                    statustext || "",
                    color
                );
            })
            platform++;
            if (tab_remove) { //tab切换
                $(".JS_content > div").eq(transactionTabIndex).find("ul").html('').append(temp);
            } else { //加载更多
                $(".JS_content > div").eq(transactionTabIndex).find("ul").append(temp);
            }
            var Lindex = $(".pro_list").eq(transactionTabIndex).find("li").length;
            $(".pro_list li").eq(Lindex - 1).addClass("last_li").siblings().removeClass("last_li");

            // $(".ondata").text("点击加载更多");
            // $(".ondata").addClass("JS_ondata");
            $(".JS_ondata").unbind('click').click(function() {
                tab_remove = false;
                tradingRecord.get_content_list(tab_remove);
                // alert(1)
            });
            if (data.length < 10) { //如果接口返回的数据小于10条则显示“没有更多交易记录了”
                $(".JS_content > div").eq(transactionTabIndex).find(".ondata").text("没有更多交易记录了");
                $(".JS_content > div").eq(transactionTabIndex).find(".ondata").removeClass("JS_ondata");
                $(".JS_content > div").eq(transactionTabIndex).find(".ondata").unbind('click')
            }
        } else {
            $(".JS_content > div").eq(transactionTabIndex).find(".ondata").text("没有更多交易记录了");
            $(".JS_content > div").eq(transactionTabIndex).find(".ondata").removeClass("JS_ondata");
            $(".JS_content > div").eq(transactionTabIndex).find(".ondata").unbind('click')
        }
    }
}