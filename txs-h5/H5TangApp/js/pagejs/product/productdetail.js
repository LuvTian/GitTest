$(function () {
    getUserInfo();

    //出现投资小贴士
    $(".icon-help").click(function () {
        $(".mask").show();
        $(".capacity1").show();
        return false;
    });
    //关闭投资小贴士
    $(".icon-turnoff2").click(function () {
        $(".mask").hide();
        $(".capacity1").hide();
        return false;
    });

    $("#product-appoint").click(function () {
        appoint();
    });
});
var accountBalance = 0;
var product;
var _interval;
var account;
var accountResult;
var getUserInfo = function () {
    var url = "/StoreServices.svc/user/info";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
             //是否同意协议
            if (data.accountinfo.issignmoneyboxandhtffund) {
                $(".depositbtntext").html("转入");
            } 
            accountResult = data;
            account = data.accountinfo;
            accountBalance = account.basicbalance;
            setTimeout(function () {
                if (product && product.status == 5 && product.countdownsecond <= 0) {
                    $("#product-countdown").html("余额：" + $.fmoney(accountBalance) + "元");
                }
            }, 2000);
        }
        getCurrentProduct();
    });
};

var getCurrentProduct = function () {
    var data = {
        productid: $.getQueryStringByName("id")
    };
    var url = "/StoreServices.svc/product/item";
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
        if (data.result) {

            product = data.productinfo;
            $("#product-title").text(product.title);
            $("#product-desc").text(product.description);
            $("#product-rate").text(product.rate);
            $("#product-amount").text(product.totalamount / 10000);

            $("#product-remainingamount").text(product.remainingamount);
            $(".product-min-amoount").text(product.amountmin);
            $("#product-guaranteetype").text(product.guaranteetypetext);
            $("#product-prject-description").attr("href", "/html/product/projectdescription.html?id=" + product.productid);

            if (product.status < 5) {
                initAppoint(product);
            } else if (product.status < 6) {
                //***************************************阅读到此处 2016-2-29 18:16:32
                initSelling(product);
            } else {
                initSold(product);
            }

            if (product.status != 6 && data.activity && data.activity.title) {
                //$("#product-activity").show();
                //$("#product-activity").find(".cash").text(data.activity.title);
                //var img = $("<img>").attr("src", data.activity.detailicon);
                $(".tishi-hike-detail").html("<img src='" + data.activity.detailicon + "' />");
                $(".tishi-hike-detail").click(function () {
                    window.location.href = data.activity.link;
                });
                $("#product-activity").click(function () {
                    window.location.href = data.activity.link;
                });
            }

        } else {
            $.alertF(data.errormsg, null, history.back());
        }
    });
    setTimeout(getCurrentProduct, 30000);
};

var initAppoint = function (product) { //预约中
    $("#product-status-count").text(product.appointment);
    $("#product-status-text").text("预约记录");
    $("#product-status-text").parent().attr("href", "/html/product/productappointlist.html?id=" + product.productid);

    if (product.isappointment) {
        $("#product-appoint").removeClass('reserve').addClass("reserve-on").text("已预约").unbind("click").show();
    }
    $("#product-publish").hide();
    $(".buying").hide();
    $("#product-ready").show();
};
var initSelling = function (product) { //在售中
    clearInterval(_interval);
    if (product.countdownsecond > 0) {
        coundDownTimer();
        _interval = setInterval("coundDownTimer()", 1000);
    } else {
        var html = [];
        html.push("余额：" + $.fmoney(accountBalance) + "元");
        $("#product-buy-link").attr("href", "/html/product/productbuy.html?id=" + product.productid).text("立即抢购").css("background", "#e94a3d");

        //特殊渠道必须先买新手标
        if (accountResult && !accountResult.ismaintenance && !accountResult.isglobalmaintenance && account && account.isnewuser) {
            $("#product-buy-link").attr("href", "javascript:void(0);");
            $("#product-buy-link").click(function () {
                $.alertF(account.isnewusermsg, "立即投资", function () {
                    window.location.href = "/Html/Product/productfixedlist.html";
                });
            });
        }

        if (accountResult && accountResult.ismaintenance) {
            $("#product-buy-link").attr("href", "/html/system/data-processing.html")
        }
        if (accountResult && accountResult.isglobalmaintenance) {
            $("#product-buy-link").attr("href", "/html/system/system-maintenance.html");
        }
        $("#product-status-count").text(product.bidcount);
        $("#product-status-text").text("投资记录");
        $("#product-status-text").parent().attr("href", "/html/product/productbidlist.html?id=" + product.productid);

        $("#product-countdown").html(html.join(''));
    }


    $("#product-purchaseprogress").text(product.purchaseprogress + "%");
    $("#product-process").width(product.purchaseprogress + "%");

    $("#product-publish").show();
    $("#product-publish-date").text(product.publishjsondate);
    $(".buying").hide();
    $("#product-buy").show();
};
var initSold = function (product) { //实例化已售罄记录
    $("#product-purchaseprogress").text("100%");
    $("#product-remainingamount").text(0);
    $("#product-process").width("100%");
    $("#product-status-count").text(product.bidcount);
    $("#product-status-text").text("投资记录");
    $("#product-status-text").parent().attr("href", "/html/product/productbidlist.html?id=" + product.productid);
    $("#product-publish").show();
    $("#product-publish-date").text(product.publishjsondate);
    $(".buying").hide();
    $("#product-soldout").show();
};
var appoint = function () { //预约
    var data = {
        productid: $.getQueryStringByName("id")
    };
    var url = "/StoreServices.svc/product/appoint";
    $.AkmiiAjaxPost(url, data).then(function (data) {
        if (data.result) {
            $.alertF("预约成功，我们将会在产品开售前通过短信通知您，敬请留意！");
            $("#product-appoint").removeClass('reserve').addClass("reserve-on").text("已预约").unbind("click").show();

        } else if (data.errorcode == "missing_parameter_accountid") {
            $.Loginlink();
        } else {
            $.alertF(data.errormsg, null, getCurrentProduct);
        }
    });
};
var checkTime = function (i) { //格式化数字为双数
    i = parseInt(i);
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};

var coundDownTimer = function () {
    product.countdownsecond = product.countdownsecond - 1;
    var second = product.countdownsecond % 60;
    var minutes = parseInt(product.countdownsecond / 60);

    if (minutes <= 0 && second <= 0) {
        clearInterval(_interval);
        initSelling(product);
        return;
    }
    var html = [];
    html.push("<span class=\"wxicon icon-clock\"> <z id=\"product-countdown-timer\">" + checkTime(minutes) + ":" + checkTime(second) + "</z> 后开标</span>");
    $("#product-countdown").html(html.join(""));

    $("#product-status-count").text(product.appointment);
    $("#product-status-text").text("预约记录");
    $("#product-status-text").parent().attr("href", "/html/product/productappointlist.html?id=" + product.productid);
    $("#product-buy-link").text("即将开标").css("background", "#FFC2C1");
};