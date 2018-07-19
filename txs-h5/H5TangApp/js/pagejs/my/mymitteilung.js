$(function() {
    "use strict";
    var User = {};
    User.GetMessageInfoList = function(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/getmessageinfolist?g=" + new Date().getTime();
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        //User.GetMessageInfoList = GetMessageInfoList;
    User.SelectMessageInfoUnRead = function(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/selectmessageinfounread";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        //User.SelectMessageInfoUnRead = SelectMessageInfoUnRead;
    var MyMitteilung = (function() {
        function MyMitteilung() {
            var conTopDom = this;
            this.PageIndex = 1;
            this.getMessageList(this.PageIndex);
        }
        MyMitteilung.prototype.getMessageList = function(startid) {
            var topDom = this;
            var data = {
                startid: startid
            };
            User.GetMessageInfoList(data, function(data) {
                if (data.result) {
                    var count = 0;
                    $.each(data.messageinfolist, function(i, item) {
                        topDom.initMessageInfoItem(item);
                        count++;
                    });
                    topDom.PageIndex = topDom.PageIndex + 1;
                    if (data.messageinfolist.length > 0) {
                        $.LoadMore($("#messageinfolist"), null, function() {
                            topDom.getMessageList(topDom.PageIndex);
                        });
                    } else {
                        $.LoadMore($("#messageinfolist"), "没有更多消息了", null);
                    }
                } else {
                    $.alertF(data.errormsg);
                }
            });
        };
        MyMitteilung.prototype.initMessageInfoItem = function(accountchatinfo) {
            var topDom = this;
            var html = [];
            var body = $.isNull(accountchatinfo.body) ? "" : accountchatinfo.body;
            var created = $.isNull(accountchatinfo.created) ? "" : accountchatinfo.created;
            if (accountchatinfo.isread == false) {
                html.push("<div style=\"margin-top:1rem;background-color:#F7F7F7;padding:2rem 1rem;font-size:1.33rem;\">");
                html.push("<p>" + body + "</p>");
                html.push("<div><span style=\"color:#979797;\">" + created + "</span><a class=\"right\">查看详情</a></div>");
            } else {
                html.push("<div style=\"margin-top:1rem;background-color:#F7F7F7;padding:2rem 1rem;font-size:1.33rem;\"  class=\"active\">");
                html.push("<p>" + body + "</p>");
                html.push("<div><span>" + created + "</span><a class=\"right active\">已查看</a></div>");
            }
            html.push("</div>");
            var result = $(html.join(''));
            $("#messageinfolist").append(result);
            result.click(function() {
                topDom.selectMessageUnRead(this, accountchatinfo.messageid, accountchatinfo.chatid, accountchatinfo.eventtype, accountchatinfo.eventtypeid, accountchatinfo.type, accountchatinfo.link);
                return false;
            });
        };
        MyMitteilung.prototype.selectMessageUnRead = function(dom, messageid, chatid, eventtype, eventtypeid, type, link) {
            var topDom = this;
            var data = {
                messageid: messageid,
                chatid: chatid,
                eventtype: eventtype,
                eventtypeid: eventtypeid
            };
            User.SelectMessageInfoUnRead(data, function(data) {
                if (data.result) {
                    //老代码
                    // if ( eventtype == 3 || eventtype == 4) {
                    //   $( dom ).addClass( 'active' ).unbind( 'click' ).find( 'a.right' ).html( '已查看' ).addClass( 'active' );
                    // } else {
                    //   window.location.href = "/html/my/my-regular-entrust-detail.html?id=" + eventtypeid;
                    // }
                    $(dom).addClass('active').unbind('click').find('a.right').html('已查看').addClass('active');
                    switch (type) {
                        case "1":
                            window.location.href = link;
                            break;
                        case "2":
                            window.location.href = "/html/my/my-regular-entrust-detail.html?id=" + eventtypeid;
                            break;
                        case "4":
                            window.location.href = "/html/anonymous/welcome.html";
                            break;
                        case "5":
                            window.location.href = "/html/product/index.html";
                            break;
                        case "6":
                            window.location.href = "/html/my/index.html";
                            break;
                        case "7":
                            window.location.href = "/html/product/producttransferlist.html";
                            break;
                            // case 8:
                            //     window.location.href = "/html/my/mymitteilung.html";
                            //     break;
                    }
                }
            });
        };
        return MyMitteilung;
    }());
    var myMitteilung = new MyMitteilung();
});
