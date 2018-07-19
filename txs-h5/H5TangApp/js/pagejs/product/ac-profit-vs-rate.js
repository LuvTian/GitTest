$(function () {
    var $pageNvaP = $(".page-nav p"),
        profited = [],
        rated = [];
    /**导航点击 */
    function changeNav(dom) {
        var translatex = dom.data("translatex");
        var linkage = dom.data("linkage");
        $pageNvaP.css("transform", "translateX(" + translatex + "%)");
        dom.siblings().removeClass("active").end().addClass("active");
        $(linkage).show().siblings().hide();
    }
    $(".page-nav li").click(function () {
        changeNav($(this))
    });
    var type = $.getQueryStringByName("type")
    getData();

    /**
     * 获取数据
     * 
     */
    function getData() {
        var url = "/StoreServices.svc/product/productmonkhistoryrate";
        $.AkmiiAjaxPost(url, {}, true).then(function (data) {
            if (data.result) {
                var list = data.producthistorylist;
                Mosaic(list);
                if (type == "rate") {
                    changeNav($(".li_rate"));
                }
            }
        })
    }

    function Mosaic(list) {
        var ha1=[],ha2=[];
        for (var i = 0; i < list.length; i++) {
            ha1.push('<li><p style="width: '+list[i].millionproceedswidthratio+'%;"><span>'+list[i].date.replace(/\//g, '-')+'</span><span class="fr">'+list[i].millionproceeds+'</span></p></li>');
            ha2.push('<li><p style="width: '+list[i].sevendaysannualratewidthratio+'%;"><span>'+list[i].date.replace(/\//g, '-')+'</span><span class="fr">'+list[i].sevendaysannualrate+'</span></p></li>');
        }
        $(".profit").html(ha1.join(''));
        $(".rate").html(ha2.join(''));
    }

    /**
     * 数据整理
     * 因为接口还未提供前，前段逻辑已写好
     * 提前定义的数据结构和接口不一致
     * 本方法调整一下
     * 
     */
    function arrangement(list) {
        var data = {
            profit: [],
            rate: []
        };
        for (var i = 0; i < list.length; i++) {
            data.profit.push({
                text: list[i].date.replace(/\//g, '-'),
                num: list[i].millionproceeds
            });
            data.rate.push({
                text: list[i].date.replace(/\//g, '-'),
                num: list[i].sevendaysannualrate
            });
        }
        return data;
    }

    /**
     * 加工数据
     * 
     */
    function machining(data) {
        var p_min = 0,
            p_max = 0,
            r_min = 0,
            r_max = 0,
            temp = 0,
            p_diff = 0,
            r_diff = 0,
            len_min = 0,
            len_max = 0,
            len_diff = 0;
        //计算最小值和最大值
        for (var i = 0; i < data.profit.length; i++) {
            temp = Number(data.profit[i].num);
            i == 0 && (p_min = temp, p_max = temp);
            if (temp > p_max) {
                p_max = temp;
            }
            if (temp < p_min) {
                p_min = temp;
            }
        }
        for (var i = 0; i < data.rate.length; i++) {
            temp = Number(data.rate[i].num);
            i == 0 && (r_min = temp, r_max = temp);
            if (temp > r_max) {
                r_max = temp;
            }
            if (temp < r_min) {
                r_min = temp;
            }
        }
        /**计算长度百分比*/
        p_diff = p_max - p_min;
        r_diff = r_max - r_min;
        //最小长度
        len_min = Number($(".page-data ul li p").css("min-width").replace("px", ""));
        //最大长度
        len_max = Number($(".page-data ul li").css("width").replace("px", ""));
        len_diff = len_max - len_min;

        //添加到html
        var p_ha = [],
            r_ha = [];
        for (var i = 0; i < data.profit.length; i++) {
            data.profit[i].len = len_min + (Number(data.profit[i].num) - p_min) / p_diff * len_diff;
            data.profit[i].displaynNum = $.fmoney(data.profit[i].num, 4);
            p_ha.push('<li>');
            p_ha.push('<p style="width:' + data.profit[i].len + 'px;">');
            p_ha.push('<span>' + data.profit[i].text + '</span>');
            p_ha.push('<span class="fr">' + data.profit[i].displaynNum + '</span>');
            p_ha.push('</p>');
            p_ha.push('</li>');
        }
        $(".page-data .profit").html(p_ha.join(''));
        for (var i = 0; i < data.rate.length; i++) {
            data.rate[i].len = len_min + (Number(data.rate[i].num) - r_min) / r_diff * len_diff;
            data.rate[i].displaynNum = $.fmoney(data.rate[i].num, 4);
            r_ha.push('<li>');
            r_ha.push('<p style="width:' + data.rate[i].len + 'px;">');
            r_ha.push('<span>' + data.rate[i].text + '</span>');
            r_ha.push('<span class="fr">' + data.rate[i].displaynNum + '</span>');
            r_ha.push('</p>');
            r_ha.push('</li>');
        }
        $(".page-data .rate").html(r_ha.join(''));

        //console.log(data.profit,data.rate);
    }
});