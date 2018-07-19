//企业中心 店员
var company = [];
$(function () {
    BindData();
})

var BindData = function () {
    var qrContent = window.location.origin + "/landing.html?c=";
    var url = "/StoreServices.svc/store/getbusinesscenterindex";
    var param = {
        qrcontent: qrContent
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            var info = data.businesscenter;
            company = info;
            var userType = "4";
            if (userType.indexOf(info.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            $("#companyLogo").attr("src", info.companyimg);//商户图标
            $("#companyName").text(info.companyname);//企业名称
            var username = info.username;
            var username = info.username;
            if (username == null) {
                $("#adminName").css("color", "red").text("[未实名]");
            } else {
                $("#adminName").text(username);//管理员名称
            }
            $("#validateCode").click(function () {//验证优惠券
                window.location.href = "/html/my/immerchant.html?storeid=" + info.companyid;
                //$.getWechatconfig("scanQRCode", scanQRCodefun);
            });
            $("#refercode").attr("src", info.qr_codeimg);
            window.localStorage.setItem("storecodeimg", info.qr_codeimg);
            $("#investPeople").attr("href", "/html/store/img-qrcode.html?code=" + encodeURIComponent(qrContent + info.qr_code) + "&log=" + encodeURIComponent(info.companyimg));//点我推塔
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    });
};

//生成二维码方法
function CreateCode(couponcode) {
    var qrcode = new QRCode(document.getElementById("refercode"), {
        //width: 500,//设置宽高
        //height: 500 
    });
    var a = decodeURIComponent(couponcode);
    qrcode.makeCode(a);
}

//微信扫描结果
function scanQRCodefun(result) {
    alert(result);
    //验证优惠吗 方法
}
////点我推荐显示大图
//$(".weixincode").click(function () {
//    $(this).hide();
//});
//$("#investPeople").click(function () {
//    $(".weixincode").toggle();
//    var url = $("#refercode").attr("src");
//    $("#bigCode").attr("src", url);
//})