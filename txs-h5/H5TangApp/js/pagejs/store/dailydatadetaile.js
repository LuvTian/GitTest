//文字大小根据分辨率大小自适应
; (function (doc, win) {
    var maxWidth = 720;
    var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if (clientWidth < 320) clientWidth = 320;
                if (clientWidth > maxWidth) clientWidth = maxWidth;
                var fontSize = 20 * (clientWidth / 320);
                fontSize = (fontSize > 54) ? 54 : fontSize;
                //如果是pc访问
                if (!/windows phone|iphone|android/ig.test(window.navigator.userAgent)) {
                    fontSize = 20 * maxWidth / 320;
                }
                docEl.style.fontSize = fontSize + 'px';
                var dpi = window.devicePixelRatio;
                var viewport = document.querySelector('meta[name="viewport"]');
                docEl.setAttribute('data-dpi', dpi);
                var scale = 1 / dpi;
            };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var time = "";
var pageSize = 20;
var index = 1;
var profitdate;
var list = [];
$(function () {
    time = $.getQueryStringByName("time");
    time = time.replace(".", '-');
    $(".data_date span").text(time);
    profitdate = time;
    bindData();
    //testbindData(DD);
});
//定义数据对象
var DD = {
    //基方法渲染
    baseRender: function (tpl, data) {
        var render = template.compile(tpl);
        return render(data);
    },
    //渲染数据明细
    renderdata: function (data) {
        //console.log(data);
        var source = $("#listptl").html();
        $(".member_list").html(DD.baseRender(source, data));
    }
}
var bindData = function () {
    var datalist = {
        "time": profitdate,
        "pageindex": index
    };
    ///StoreServices.svc/store/dailyprofitfromaccount
    $.AkmiiAjaxPost('/StoreServices.svc/store/dailyincomedetail', datalist, false).then(function (json) {
        console.log(json);
        if (json.result) {
            DD.renderdata({
                list: json.dailyprofitlist
            });
            if (list.length < pageSize) {
                $.LoanMore($("#more_data"), "没有更多数据了");
            } else {
                index++;
                $.LoanMore($("#more_data"), null, "bindData()");
            }

        } else if (json.errorcode == "missAccountid") {
            $.alertS(json.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertF(json.errormsg);
            return false;
        }
    });
}

//var testbindData = function () {
//    if(index>1)
//        list = list.concat(list);
//    console.log(list.length);
//    DD.renderdata({
//        list: list
//    });
//    if (list.length < pageSize) {
//        $.LoanMore($("#more_data"), "没有更多数据了");
//    } else {
//        index++;
//        $.LoanMore($("#more_data"), null, "testbindData()");
//    }
//}

//var list = [{
//    name: "cherish",
//    phonenum: "15900686720",
//    type: "2016-11-25",
//    operationdate: "2016-11-25",
//    profitamount: "新手标"

//},{
//    name: "cherish",
//    phonenum: "15900686720",
//    type: "2016-11-25",
//    operationdate: "2016-11-25",
//    profitamount: "新手标"

//}, {
//    name: "cherish",
//    phonenum: "15900686720",
//    type: "2016-11-25",
//    operationdate: "2016-11-25",
//    profitamount: "新手标"

//}, {
//    name: "cherish",
//    phonenum: "15900686720",
//    type: "2016-11-25",
//    operationdate: "2016-11-25",
//    profitamount: "新手标"

//}
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//},
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//},
//{
//    name: "cherish",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"

//},
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//},
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//},
//{
//    name: "cherish",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"

//},
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//},
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//},
//{
//    name: "cherish2",
//    phonenum: "15900686720",
//    dateofbindingcard: "2016-11-25",
//    dateoffirstinvestment: "2016-11-25",
//    nameoffirstinvestmentproduct: "新手标",
//    profitoffirstinvestment: "0",
//    productprofitamount: "0"
//}
//]
