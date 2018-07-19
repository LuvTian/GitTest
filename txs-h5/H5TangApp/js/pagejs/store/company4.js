//企业中心 总店管理员
var listArry = [];
var maxData = 1000;
var stepWidth = 200;

$(function () {
    BindData();
});

$(window).load(function () {
    $('#myChart').width($('.currentpic').outerWidth(true) + "px");
    $('#myChart').height($('.currentpic').outerHeight(true) + "px");
});

var BindData = function () {
    var qrContent = window.location.origin + "/landing.html?c=";
    var url = "/StoreServices.svc/store/getbusinesscenterindex";
    var param = {
        qrcontent: qrContent
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            var status = data.status;
            var info = data.businesscenter;
            listArry = data.businesscenter.recommendlist;
            maxData = info.maxdata;
            var userType = "1,2";
            if (userType.indexOf(info.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            defaults.scaleStepWidth = info.stepwidth;
            if (status == "6") {//管理員变更中
                $.alertS("管理员变更中，不可访问", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            window.localStorage.setItem("storecodeimg", info.qr_codeimg);
            //if (info.hasbranch) {
            //$("#hasBranch").show();
            //$("#noBranch").hide();
            $("#manageBranch").attr("href", "/html/store/manage-branch.html");//分店管理
            $("#validateCode2").click(function () {//验证优惠券
                window.location.href = "/html/my/immerchant.html?storeid=" + info.companyid;
                //$.getWechatconfig("scanQRCode", scanQRCodefun);
            });
            $("#manageClerk2").attr("href", "/html/store/clerklist.html");//管理店员
            //}
            //else {
            //    $("#hasBranch").hide();
            //    $("#noBranch").show();
            //    $("#validateCode").click(function () {//验证优惠券
            //        window.location.href = "/html/my/immerchant.html";
            //        //$.getWechatconfig("scanQRCode", scanQRCodefun);
            //    });
            //    $("#storeMsg").attr("href", "/html/store/company-info.html");//商户信息
            //    $("#manageClerk").attr("href", "/html/store/clerklist.html");//管理店员
            //}
            $(".companyinfo").click(function () {//商户信息
                window.location.href = "/html/store/company-info.html";
            });
            $("#companyLogo").attr("src", info.companyimg);//商户图标
            $("#companyName").text(info.companyname);//企业名称
            var username = info.username;
            if (username == null) {
                $("#adminName").css("color", "red").text("[未实名]");
            } else {
                $("#adminName").text(username);//管理员名称
            }
            $("#modifyAdmin").attr("href", "/html/store/modify-admin.html");//更换管理员
            $("#totalProfit").text($.fmoney(info.totalprofit));//累计收益
            $("#amount").text($.fmoney(info.availablebalance));//可用余额
            $("#removeOut").attr("href", "company-profit-out.html");
            $("#profitDetail").attr("href", "/html/store/dailyincomeindex.html");//收益明细
            RecommendList();//近七天推荐收益
            $("#investPeople").attr("href", "/html/store/adminrefercode.html?code=" + encodeURIComponent(info.qr_code) + "&log=" + encodeURIComponent(info.companyimg));//点我推塔
            if (status == "7" || status == "8") {//企业被冻结
                $("#modifyAdmin,#removeOut").remove();
                $("#manageBranchTxt").text("查看分店");
                $("#manageClerk2Txt").text("查看店员");
                $("#profitDetail").css("width", "100%");
                $("#profitDetail").removeClass("border-r");
                //$("#storeMsg").removeClass("small-4").addClass("small-12");//当有一个是居中样式
            }
                }
            else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
                }
            else {
            $.alertS(data.errormsg);
            return false;
        }
    });
};

var labels = [];
var data = [];
var yesterdayProfit = 0;

var RecommendList = function () {

    $.each(listArry, function (index, entry) {
        yesterdayProfit = entry.profit;
        labels.push(entry.recommendtime);
        data.push(entry.profit);
    });
    $("#yesterdayprofit").val(yesterdayProfit);
    init();
}

//初始化折线图
var defaults = {
    scaleOverlay: false,
    scaleOverride: true,
    scaleSteps: 5,
    scaleStepWidth: stepWidth,
    scaleStartValue: 0,
    scaleLineColor: "#fc7883",
    scaleLineWidth: 1,
    scaleShowLabels: true,
    scaleLabel: "<%=value%>",
    scaleFontFamily: "'Arial'",
    scaleFontSize: 12,
    scaleFontStyle: "normal",
    scaleFontColor: "#979797",
    scaleShowGridLines: true,
    scaleGridLineColor: "rgba(0,0,0,.05)",
    scaleGridLineWidth: 2,
    bezierCurve: true,
    pointDot: false,
    pointDotRadius: 6,
    pointDotStrokeWidth: 5,
    datasetStroke: true,
    datasetStrokeWidth: 2,
    datasetFill: true,
    animation: true,
    animationSteps: 60,
    tooltipEvents: false,
    animationEasing: "easeOutQuart"
    // tooltipTemplate:

};

var init = function () {
    //七日年化收益
    var lineChartData = {
        labels: labels,
        datasets: [
            {
                fillColor: "rgba(255,152,106,.5)",
                strokeColor: "rgba(255,152,106,1)",
                // #e60012
                pointColor: "#fff",
                pointStrokeColor: "#fc7883",
                data: data
            },
            {
                fillColor: "transparent",
                strokeColor: "transparent",
                pointColor: "transparent",
                pointStrokeColor: "transparent",
                data: [0, maxData]
            }
        ]

    }

    var mycanvas = document.getElementById("myChart");
    var myLine = new Chart(mycanvas.getContext("2d")).Line(lineChartData, defaults);
};

//微信扫描结果
function scanQRCodefun(result) {
    alert(result);
    //验证优惠吗 方法
}

//更换管理员阻止冒泡
$("#changedadMin").click(function (e) {
    e.stopPropagation();
})