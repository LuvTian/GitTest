// 会员等级公共管理对象
//https://uatjavaapi.txslicai.com

//显示特权弹窗
function showPrivilege() {
    var conulLen = $("#list li").length;
    var conli = $("#list li").width();
    var oModal = document.getElementById("modal");
    var oPoint = document.getElementById("point");
    var List = document.querySelector("#list");
    var startPoint = 0;
    var starX = 0;
    var translateX = 0;
    var pointList = $(".point ol");
    var allWidth = $("#list").width();
    var now = 0;
    var disX = 0;

    //点击特权弹出窗口显示对应特权内容
    translateX = -nowIndex * conli;
    List.style.WebkitTransform = List.style.transform = "translateX(" + translateX + "px)";
    $("#list li").eq(nowIndex).css("transform:", "translateX(" + translateX + "px)");
    pointList.removeClass("active");
    pointList.eq(nowIndex).addClass("active");
    //$("#modal,.mask").removeClass("mask_hide").addClass("mask_show");
    $("#modal,.privilege_mask").show().addClass("mask_show");
    //计算ul宽
    $("#list").width(conli * (conulLen + 1) + 'px');
}
//特权弹窗滑动效果
function bindPrivilegeEvent() {
    var conulLen = $("#list li").length;
    var conli = $("#list li").width();
    var oModal = document.getElementById("modal");
    var oPoint = document.getElementById("point");
    var List = document.querySelector("#list");
    var startPoint = 0;
    var starX = 0;
    var translateX = 0;
    var pointList = $(".point ol");
    var allWidth = $("#list").width();
    var now = 0;
    var disX = 0;
    //滑动
    oModal.addEventListener(
        "touchstart",
        function(e) {
            startPoint = e.changedTouches[0].pageX;
            starX = -$(".point ol.active").index() * conli;
            translateX = starX;
            disX = 0;
            List.style.WebkitTransitionDuration = List.style.transitionDuration = "0";
        },
        false
    );
    oModal.addEventListener(
        "touchmove",
        function(e) {
            e.preventDefault();
            var nowPoint = e.changedTouches[0].pageX;
            disX = nowPoint - startPoint;
            translateX = starX + disX;
            List.style.WebkitTransform = List.style.transform = "translateX(" + translateX + "px)";
            List.style.WebkitTransitionDuration = List.style.transitionDuration = "0ms";
        },
        false
    );
    oModal.addEventListener(
        "touchend",
        function(e) {

            if (translateX > 0) { //滑倒第一张
                now = 0;
                translateX = 0;
                List.style.WebkitTransform = List.style.transform = "translateX(0)";
                List.style.WebkitTransitionDuration = List.style.transitionDuration = "350ms";
            } else if (-translateX > conli * (pointList.length - 1)) { //滑倒最后张
                now = pointList.length - 1;
                translateX = -conli * (pointList.length - 1);
                List.style.WebkitTransform = List.style.transform = "translateX(" + translateX + "px)";
                List.style.WebkitTransitionDuration = List.style.transitionDuration = "350ms";
            } else {
                now = Math.floor(-translateX / oModal.offsetWidth);
                //if (-translateX - now * oModal.offsetWidth - oModal.offsetWidth * 0.15 < 0) {//滑动<15%
                if (Math.abs(disX) < .15 * oModal.offsetWidth) {
                    translateX = -oModal.offsetWidth * now;
                } else { //防PC上搞事情！！
                    if (disX < 0) { //滑动方向
                        translateX = -oModal.offsetWidth * (++now);
                    } else {
                        translateX = -oModal.offsetWidth * (now);
                    }
                };
                //if (-translateX >= oModal.offsetWidth * 3 / 2) {//防PC上搞事情！！
                //    now = Math.round((-translateX + 1 / 2) / oModal.offsetWidth);;
                //} else {
                //    now = Math.round(-translateX / oModal.offsetWidth);
                //}
                //translateX = -now * oModal.offsetWidth;
                List.style.WebkitTransform = List.style.transform = "translateX(" + translateX + "px)";
                List.style.WebkitTransitionDuration = List.style.transitionDuration = "350ms";
            }

            for (var i = 0; i < pointList.length; i++) {
                pointList[i].className = "";
            }
            pointList[now].className = "active";
        },
        false
    );
    //点击
    pointList.click(function() {
        now = $(this).index();
        translateX = -now * conli;
        List.style.WebkitTransform = List.style.transform = "translateX(" + translateX + "px)";
        pointList.removeClass("active");
        $(this).addClass("active");
    });
}
//页面中加入特权弹窗内容
function addPrivilege(list) {
    var priArray = [];
    priArray.push('<div class="mask privilege_mask"></div>');
    priArray.push('<div class="pop-up_window modal" id="modal">');
    priArray.push('<div class="close"><img src="'+$.resurl()+'/css/img2.0/img/close.png" alt=""></div>');
    priArray.push('<ul class="clearfix content_box" id="list">');
    //priArray.push('<li><img src="/css/img2.0/img/icon-01.png" alt="" class="win_topimg"><h2 class="pop-up_title">首升礼</h2><p class="pop-up_tips01"></p></li>');
    $.each(list, function(index, entry) {
        var describe = checkNull(entry.describe);
        var img_url = entry.showDisableImg ? checkNull(entry.disableImgPop2d) : checkNull(entry.imgPop2d);
        var describeArray = [];
        describeArray = describe.split("\n");
        var listDescribe = describeArray.map(function(item, index) {
            return '<p class="pop-up_tips01">' + item + '</p>'
        }).join('');
        priArray.push('<li>');
        priArray.push('<img src="' + img_url + '" alt="" class="win_topimg">');
        priArray.push('<h2 class="pop-up_title">' + checkNull(entry.name) + '</h2>');
        priArray.push(listDescribe);
        // priArray.push('<p class="pop-up_tips01">' + checkNull(entry.describe) + '</p>');
        priArray.push('<p class="daily_extend">' + checkNull(entry.issueDesc) + '</p>');
    });
    priArray.push('</ul>');
    priArray.push('<center>');
    priArray.push('<ul class="clearfix point" id="point">');
    $.each(list, function(index, entry) {
            priArray.push('<ol></ol>');
        })
        //priArray.push('</ul>');
        //priArray.push('<center>');
        //priArray.push('<ul class="clearfix point" id="point">');
        //priArray.push('<ol></ol>');
    priArray.push('</ul>');
    priArray.push('</center>');
    priArray.push('</div>');
    var priHtml = $(priArray.join(""));
    //关闭
    priHtml.find(".close").click(function() {
        //$(".modal,.mask").addClass("mask_hide").removeClass("mask_show");

        $("#modal,.privilege_mask").hide();

        //priHtml.remove();
    })
    $(".view").append(priHtml);
    bindPrivilegeEvent();
}
var MemberLevel = MemberLevel || {
    // 会员规则
    vipRule: function(text) {
        var rule = "";
        //会员规则
        if ($(".rule").length) {
            $(".rule_mask").show();
            $(".rule").removeClass("mask_hide");
            $(".rule").addClass("mask_show");
        } else {
            $.AkmiiAjaxGet(apiUrl_prefix + "/members/rule", true).then(function(data) {
                if (data.code == 200) {
                    rule = data.data;
                    var ruleArray = [];
                    ruleArray = rule.split("\n");
                    var list = ruleArray.map(function(item, index) {
                        return '<p class="rule_text">' + item + '</p>'
                    }).join('');
                    var tpl = '<div class="mask rule_mask"></div>' +
                        '<div class="rule modal">' +
                        '<div class="close"><img src="'+$.resurl()+'/css/img2.0/img/close.png" alt=""></div>' +
                        '<h2 class="rule_title"> 会员等级规则 </h2>' +
                        '<div class="content_box">' + list +
                        '</div><div class="to_rush">立即冲刺</div></div>';
                    var ruleHtml = $(tpl.format(rule));
                    ruleHtml.find(".close").click(function() {
                        $(".rule_mask").hide();
                        $(".rule").removeClass("mask_show");
                        $(".rule").addClass("mask_hide");
                    });
                    $(".view").append(ruleHtml);
                    //去冲刺按钮跳转页面
                    $(".to_rush").click(function() {
                        _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Rule_Sprint', '会员中心-立即冲刺', '会员规则中的立即冲刺按钮']); //百度统计
                        window.location.href = "/Html/Product/";
                    });
                    $(".rule_mask").show();
                    $(".rule").removeClass("mask_hide");
                    $(".rule").addClass("mask_show");
                }
            });
        }
    },
    // 会员特权
    privilege: function() {
        var list = [];
        //会员特权
        level = level;
        if ($("#modal").length) {
            //点击特权弹出窗口显示对应特权内容
            showPrivilege();
        } else {
            $.AkmiiAjaxGet(apiUrl_prefix + "/privileges/{0}".replace("{0}", encodeURIComponent(level)), true).then(function(data) {
                oldLevel = level;
                if (data.code == 200) {
                    var list = data.data;
                    //var source = $("#privilege_list").html();
                    //var render = template.compile(source);
                    //var html = render({ list: list || [] });
                    //$(".privilege_list").append(html);

                    var priArray = [];
                    if (!$("#modal").length) {
                        priArray.push('<div class="mask privilege_mask"></div>');
                        priArray.push('<div class="pop-up_window modal" id="modal">');
                        priArray.push('<div class="close"><img src="'+$.resurl()+'/css/img2.0/img/close.png" alt=""></div>');
                        priArray.push('<ul class="clearfix content_box" id="list">');
                        //priArray.push('<li><img src="/css/img2.0/img/icon-01.png" alt="" class="win_topimg"><h2 class="pop-up_title">首升礼</h2><p class="pop-up_tips01"></p></li>');

                        $.each(list, function(index, entry) {
                            var describe = checkNull(entry.describe);
                            var img_url = entry.showDisableImg ? checkNull(entry.disableImgPop2d) : checkNull(entry.imgPop2d);
                            var describeArray = [];
                            describeArray = describe.split("\n");
                            var listDescribe = describeArray.map(function(item, index) {
                                return '<p class="pop-up_tips01">' + item + '</p>'
                            }).join('');
                            priArray.push('<li>');
                            priArray.push('<img src="' + img_url + '" alt="" class="win_topimg">');
                            priArray.push('<h2 class="pop-up_title">' + checkNull(entry.name) + '</h2>');
                            priArray.push(listDescribe);
                            //priArray.push('<p class="pop-up_tips01">' + checkNull(entry.describe) + '</p>');
                            priArray.push('<p class="daily_extend">' + checkNull(entry.issueDesc) + '</p>');
                        });
                        priArray.push('</ul>');
                        priArray.push('<center>');
                        priArray.push('<ul class="clearfix point" id="point">');
                        $.each(list, function(index, entry) {
                                priArray.push('<ol></ol>');
                            })
                            //priArray.push('</ul>');
                            //priArray.push('<center>');
                            //priArray.push('<ul class="clearfix point" id="point">');
                            //priArray.push('<ol></ol>');
                        priArray.push('</ul>');
                        priArray.push('</center>');
                        priArray.push('</div>');
                    }
                    var priHtml = $(priArray.join(""));


                    //关闭
                    priHtml.find(".close").click(function() {
                        //$(".modal,.mask").addClass("mask_hide").removeClass("mask_show");

                        $("#modal,.privilege_mask").hide();

                        //priHtml.remove();
                    })
                    $(".view").append(priHtml);

                    showPrivilege();
                    bindPrivilegeEvent();
                }
            });
        }


    },
    // 会员规则弹窗
    alertRule: function(obj) {
        //会员规则弹窗
        //$(".modal,.mask").addClass("mask_hide");
        //".member_rule,#link_rule"
        $(obj).click(function() {
            MemberLevel.vipRule();
            _hmt.push(['_trackEvent', 'Member Grade', 'Btn_Grade_Rule', '会员中心-会员等级规则', '会员规则小问号按钮']); //百度统计

        });
    },
    // 特权点击事件统一封装
    powerLege: function(obj) {
        $(obj).click(function() {
            now = $(this).index();
            nowIndex = $(this).index();
            MemberLevel.privilege();
            _hmt.push(['_trackEvent', 'Member Grade', 'Icon_Privilege', '会员中心-单个特权', '点击单个特权按钮']); //百度统计


        });
    }
};

function checkNull(t) {
    return t ? t : '';
}



//替换模板
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}