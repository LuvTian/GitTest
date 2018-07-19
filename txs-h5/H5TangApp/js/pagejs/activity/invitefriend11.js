/// <reference path="/jquery-1.10.2.js" />
/// <reference path="/jquery.mobile-1.4.5.min.js" />
/// <reference path="/Common.js" />

(function ($) {
    if (!$.getCookie("MadisonToken")) {
        window.location.href = "/";
        return;
    }
    $(document).ready(function () { $(".weixincode").click(function () { $(this).hide(); }); }); $(function () { $(".weixinbg").click(function () { $(".weixincode").toggle(); }) })

    var pageInvite = $('#pageInvite');
    $(".rule-title").click(function () { $(".rule").toggle(); $(this).toggleClass('on'); });
    $(".tipswrap,#maxoutput").click(function () { $(this).hide(); });
    $(".button,.benefit-button,.inviteinvite").click(function () {
        $(".tipswrap").toggle();
        handAnimate(pageInvite.find(".tips"), true, 10);
    });
    pageInvite.find('.output').click(function () { $("#maxoutput").show(); });

    GetList();

    var lastID = "0";
    function initList() {
        $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/InvestFestivalList", { "pagesize": "5", "lastid": lastID }, true).then(function (d) {
            if (d) {
                var last = null;
                var k = 0;
                if (d.investlist.length > 0) {
                    $.each(d.investlist, function (i, product) {
                        last = product;
                        k = i;
                        pageInvite.find('.list').append(getLogHTML(product, i));
                    });

                    lastID = last.lastID;
                } else {
                    pageInvite.find(".noinvitation").show();
                    pageInvite.find('.list').hide();
                }

                $.AkmiiAjaxPost("/StoreServices.svc/Anonymous/Activity/InvestFestivalRecNum", {}, true).then(function (d2) {
                    if (d2) {
                        var urlcode = "http://www.txslicai.com/s.html?c=" + d2.referralcode;
                        $('#output22').qrcode(urlcode);
                        $('#maxoutput22').qrcode(urlcode);

                        wechartFunc(d2.referralcode);
                        $(".icode").html(d2.referralcode);
                        var ha = [];
                        ha.push('<div class="row"><div class="small-6 left text-left"><p>成功推荐 <em>');
                        ha.push(d2.recsuccessnum);
                        ha.push("</em> 名好友</p><p>昨日推荐收益：<em>");
                        ha.push(d2.profitamount);
                        ha.push("</em>元</p><p>累计推荐收益：<em>");
                        ha.push(d2.totalamount);
                        ha.push('</em>元</p></div><div class="small-6 left"><a href="userlevellist.html"><img src="/css/img2.0/more-btn.jpg" class="img-more"></a></div></div>');
                        if (d.investlist.length > 0) {
                            pageInvite.find('.list').append(ha.join(''));
                        }

                    }
                });
            }
        });
    }


    function GetList() {
        lastID = "0";
        pageInvite.find('.list').html('<div class="row bg-yellow"><div class="small-3 left"><b>姓名</b></div><div class="small-3 left"><b>手机号</b></div><div class="small-3 left"><b>投资奖励</b></div><div class="small-3 left"><b>投满千元</b></div></div>');
        initList();
    }

    //生成二维码方法
    function CreateCode(couponcode, id) {
        var qrcode = new QRCode(document.getElementById(id), {
            //width: 15,//设置宽高
            //height: 15
        });

        qrcode.makeCode(couponcode);
    }

    function getLogHTML(item, i) {
        var className = "row";
        if ((i + 1) % 2 == 0) { className = "row bg-yellow"; }
        var imgUrl = item.Status ? "/css/img2.0/ok.png" : "/css/img2.0/wrong.png";
        var ha = [];
        ha.push('<div class="' + className + '"><div class="small-3 left">');
        ha.push(item.Name);
        ha.push('</div><div class="small-3 left">');
        ha.push(item.Mobile);
        ha.push('</div><div class="small-3 left">');
        ha.push(item.Amount);
        ha.push('</div><div class="small-3 left"><img src="');
        ha.push(imgUrl);
        ha.push('" class="img-status"></div></div>');

        return ha.join('');
    }

    function handAnimate(obj, direction, time) {
        if (time > 0) {
            var d = {
                //right: '+=10',
                top: '+=10'
            }
            if (!direction)
                d = {
                    //right: '-=10',
                    top: '-=10'
                }
            obj.animate(d, 500, function () {
                time--;
                handAnimate(obj, !direction, time);
            });
        }
    }

    function wechartFunc(code) {
        $.AkmiiAjaxPost("/StoreServices.svc/user/wechatjsconfig", { "url": encodeURIComponent(window.location.href) }, true).then(function (d) {
            if (d) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: d.jsconfig.appId, // 必填，公众号的唯一标识
                    timestamp: d.jsconfig.timestamp, // 必填，生成签名的时间戳
                    nonceStr: d.jsconfig.nonceStr, // 必填，生成签名的随机串
                    signature: d.jsconfig.signature,// 必填，签名，见附录1
                    jsApiList: ['hideOptionMenu', 'showOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 onMenuShareAppMessage
                });
                wx.ready(function () {
                    //wx.showOptionMenu();
                    var shareUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + d.jsconfig.appId + '&redirect_uri=https%3a%2f%2fservice.txslicai.com%2fLanding.html%3fc%3d' + code + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';

                    wx.onMenuShareAppMessage({
                        title: '唐小僧活期理财节邀您来参与', // 分享标题
                        desc: '[有人@你]点击领取15元现金红包。速来唐小僧，参与投资得现金，享8%+活期收益！',
                        link: shareUrl, // 分享链接
                        imgUrl: 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
                        success: function () {
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareTimeline({
                        title: '唐小僧活期理财节邀您来参与', // 分享标题
                        link: shareUrl, // 分享链接
                        imgUrl: 'http://www.txslicai.com/images/wechaticon.png', // 分享图标
                        success: function () {
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //var urlcode = "http://www.txslicai.com/s.html?c=" + code;
                    //pageInvite.find('.icode').text(code);

                    //$('#output22').qrcode(urlcode);
                    //$('#maxoutput22').qrcode(urlcode);
                });
            }
        }, function (d) { });
    }
})(jQuery);