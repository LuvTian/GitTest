//企业中心 分店管理员

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
            var status = data.status;//分店如果被冻结则状态为5
            var userType = "3";
            if (userType.indexOf(info.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            if (status == "5") {
                $("#manageClerkTxt").text("查看店员");
            }
            $("#companyLogo").attr("src", info.companyimg);//商户图标
            $("#companyName").text(info.companyname);//企业名称
            var username = info.username;
            if (username == null) {
                $("#adminName").css("color", "red").text("[未实名]");
            } else {
                $("#adminName").text(username);//管理员名称
            }
            $("#manageClerk").attr("href", "/html/store/clerklist.html");//管理店员
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
function createcode(couponcode) {
    var qrcode = new qrcode(document.getelementbyid("refercode"), {
        //width: 500,//设置宽高
        //height: 500 
    });
    var a = decodeuricomponent(couponcode);
    qrcode.makecode(a);
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