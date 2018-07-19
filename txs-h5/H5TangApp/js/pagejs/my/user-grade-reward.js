var referralcode = $.getQueryStringByName("referralcode");
$(function () {
    islogin = $.isNull($.getCookie("MadisonToken"))
    if (islogin) {
        $.delCookie("MadisonToken");
        $.Loginlink();
    }
    ReferralAdwards();
    InvitationRegister(1);
});

var pagesize = 10;
//好友列表
var InvitationRegister = function (index) {
    $("#invitelink").attr("href", "/html/my/qujin-invite.html?referralcode=" + referralcode);//邀请好友
    var paramter = {
        pageindex: index
    };
    $.AkmiiAjaxPost("/StoreServices.svc/Activity/getaccountreferral", paramter, true).then(function (d) {
        if (d.result) {
            var list = d.data;
            total = d.totalcount;
            if (list.length != 0) {
                var html = [];
                $.each(list, function (i, item) {
                    if(item.level==1)
                        {
                            txt="一级好友";
                        }
                        else{
                            txt="二级好友";
                        }
                    html.push('<article class="myreward-list bg-white text-center bt">');
                    html.push('<div class="small-3">' + item.mobile + '<p>'+txt+'</p></div>');
                    html.push('<div class="small-3 red">' + $.fmoney(item.totalamount) + '元</div>');
                    if (item.totalamount == 0)
                    {
                        html.push('<div class="small-3"> — </div>');
                    }
                    else
                    {
                        html.push('<div class="small-3">' + item.created + '</div>');
                    }
                    ////是否满千元
                    //if (item.isexceedthousand) {
                    //    html.push(' <div class="small-3"><img src="/css/img2.0/yes.png" class="img-status"></div>');
                    //} else {
                    //    html.push(' <div class="small-3"><img src="/css/img2.0/no.png" class="img-status"></div>');
                    //}
                    html.push('<div class="small-3">收益加成</div>');
                    html.push(' </article>');
                });
                var result = $(html.join(''));
                $("#referralfloweeadwardlist").append(result);
                if (list.length < pagesize)
                {
                    $.LoanMore($("#moneyloaddata"), "没有更多数据了");
                }
                index = parseInt(index) + 1;
                $.LoanMore($("#moneyloaddata"), null, "InvitationRegister(" + index + ")");
            }
            else {
                $.LoanMore($("#moneyloaddata"), "没有更多数据了");
            }
        }
    });
}


//推荐奖励
var ReferralAdwards=function () {
    var url = "/StoreServices.svc/Activity/getaccountlevel";
    $.AkmiiAjaxPost(url, {}, true).then(function (data) {
        if (data.result) {
            var list = data.data;
            $("#adwardssummary").html(list.adwardssummary); //累计奖励
        }
    });
}


