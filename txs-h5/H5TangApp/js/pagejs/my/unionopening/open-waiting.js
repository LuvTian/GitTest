$(function() {
    // 检测登录状态
    if (!$.CheckToken()) {
        $.Loginlink();
    };
    // 浏览器回退事件监听 
    if (window.history && window.history.pushState) {
        var listenerBackHandler = {
            param: {
                isRun: false, //防止微信返回立即执行popstate事件  
            },
            listenerBack: function() {
                var state = {
                    title: "开户结果",
                    url: "#"
                };
                window.history.pushState(state, "开户结果", "#");
                window.addEventListener("popstate", function(e) {
                    if (listenerBackHandler.param.isRun) {
                        var apptype = phoneProxy.getPhoneType();
                        phoneProxy.jumpToPage("main");
                    }
                }, false);
            },
            //初始化返回事件  
            initBack: function() {
                window.addEventListener('pageshow', function() {
                    listenerBackHandler.param.isRun = false;
                    setTimeout(function() {
                        listenerBackHandler.param.isRun = true;
                    }, 1000); //防止微信返回立即执行popstate事件  
                    listenerBackHandler.listenerBack();
                });
            }
        };
        listenerBackHandler.initBack();
    };
    var txt_1 = 0,
        txt_2 = '',
        txt_3 = '';
    // 页面显示模板
    var template = [
        "<div class='acc-result-box'>",
        "<img src='" + $.resurl() + "/css/img2.0/unionopening/waiting-{0}.png' alt=''>",
        "<h3>{1}</h3>",
        "<p>{2}</p>",
        "</div>",
        "<div class='acc-button'>返回首页</div>",
        "<div class='serviceTxt'>",
        "<p class='kefu-wrap'>如有疑问请联系<a href='javascript:void(0)' class='kefu'>在线客服</a></p>",
        "<p>客服电话：<a href='tel:400-607-8587'>400-607-8587</a></p>",
        "</div>"
    ].join("");
    $.AkmiiAjaxGet(window.apiUrl_prefix + "/jys/member/register-binding-card/result", "", true)
        .done(function(result) {
            if (!result.data || result.data.length == 0) {
                if (result.code == 200) {
                    txt_2 = '赣金所账户未开通、侨金所账户未开通';
                };
            } else {
                txt_1 = getImgType(result);
                txt_2 = getAllStatusStr(result);
            };
            txt_3 = getMessage(result);
            var html = template.replace('{0}', txt_1).replace('{1}', txt_2).replace('{2}', txt_3);
            $("#content").html(html);
            setTimeout(function() {
                apptypeShow();
            }, 1000);
        });

    // data对象数组中存在‘开通中’或‘开通成功’的状态对象，即显示高亮图片
    function getImgType(obj) {
        for (var i = 0; i < obj.data.length; i++) {
            if (obj.data[i].activationStatus == '1' || obj.data[i].activationStatus == '3') {
                return '1';
            }
        }
        return '0';
    };
    // 根据平台标识，转字符串
    function platformToStr(platform) {
        var str = '';
        switch (platform) {
            case 'QJSTZ':
                str = '侨金所账户';
                break;
            case 'GJSTZ':
                str = '赣金所账户';
                break;
        }
        return str;
    };
    // 根据开通状态，转字符串
    function activationStatusToStr(activationStatus) {
        var str = '';
        switch (activationStatus) {
            case '0':
                str = '未开通';
                break;
            case '1':
                str = '开通中';
                break;
            case '2':
                str = '开通失败';
                break;
            case '3':
                str = '开通成功';
                break;
        }
        return str;
    };
    // 拼接开通状态提示文本
    function getAllStatusStr(obj) {
        var arr = [];
        for (var i = 0; i < obj.data.length; i++) {
            if (!!i) {
                arr.push('、');
            }
            arr.push(platformToStr(obj.data[i].platform));
            arr.push(activationStatusToStr(obj.data[i].activationStatus));
        }
        return arr.join('');
    };
    // 200取content,300、500取message
    function getMessage(obj) {
        var str = '';
        if (obj.code == 200) {
            var contentArr = [];
            for (var i = 0; i < obj.data.length; i++) {
                if (obj.data[i].content) {
                    if (contentArr.length) {
                        contentArr.push('、');
                    };
                    contentArr.push(obj.data[i].content);
                }
            };
            str = contentArr.join('');
        } else {
            str = code.message;
        };
        return str;
    };

    function apptypeShow() {
        // 获取设备类型
        var apptype = phoneProxy.getPhoneType();
        // 根据访问设备判断‘联系客服’按钮是否显示,ios & android显示
        if (apptype == 'h5') {
            $(".kefu-wrap").hide();
        } else {
            $(".kefu").click(function() {
                phoneProxy.onlineService();
            });
        };
        $(".acc-button").click(function() {
            phoneProxy.jumpToPage("main");
        });
    };
});