var id = $.getQueryStringByName("id") || 0;
$(function () {
    creditordetail();
})

function creditordetail() {
    var url = "/StoreServices.svc/product/projectrawrelateddetail";
    var paramter = {
        id: id
    }
    $.AkmiiAjaxPost(url, paramter, false).then(function (data) {
        if (data.result) {
            var info = data.relateddetailinfo;
            //增信措施为空不显示
            if (info.creditmessure == "" || info.creditmessure == null) {
                $("#zxcs").hide();
            } else {
                $("#creditmessure").html(info.creditmessure); //增信措施
            }
            //1个人2企业
            if (info.type == 1) {
                $("#typetitle").html("借款人");
                $("#persontitle").html("证件号码");
                $("#moneyuse").html("借款用途");
                $("#address").hide(); //注册地址
                $("#insertdate").hide(); //成立时间
                $("#registermoney").hide(); //注册资本
                $("#companypeoples").hide(); //公司规模
                $("#busin").hide(); //主营业务
                $("#blackpay").hide(); //还款来源
                $("#companyname").html(info.borrowname); //借款人
                $("#companylegalperson").html(info.borrowerid); //证件号码
                $("#companyborrowamount").html(info.borroweramount + "元"); //借款金额
                $("#funduse").html(info.borrowerfunduse); //资金用途
            } else {
                $("#companyname").html(info.companyname); //借款公司
                $("#companylegalperson").html(info.companylegalperson); //法定代表人
                // $("#companyborrowamount").html(info.companyborrowamount + "元"); //借款金额
                $("#companyborrowamount").parent().hide(); //借款金额
                $("#registeredaddress").html(info.registeredaddress); //注册地址
                $("#foundate").html(info.foundate); //成立时间
                $("#registeredcapital").html(info.registeredcapital); //注册资本
                $("#managementamount").html(info.managementamount); //公司规模
                $("#business").html(info.business); //主营业务
                $("#funduse").html(info.funduse); //资金用途
                $("#payment").html(info.payment); //还款来源
            }
        }
    });
}