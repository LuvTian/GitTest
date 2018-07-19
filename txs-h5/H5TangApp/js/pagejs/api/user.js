define(["require", "exports"], function (require, exports) {
    "use strict";
    var User;
    (function (User) {
        function getUserInfo(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/info";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        User.getUserInfo = getUserInfo;
        function getNotificationChat(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/getnotificationchat";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        User.getNotificationChat = getNotificationChat;
        function GetMessageInfoList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/getmessageinfolist?g="+new Date().getTime();
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        User.GetMessageInfoList = GetMessageInfoList;
        function SelectMessageInfoUnRead(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/user/selectmessageinfounread";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        User.SelectMessageInfoUnRead = SelectMessageInfoUnRead;
        function UserSendSms(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/Anonymous/user/sendusersms";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        User.UserSendSms = UserSendSms;
    })(User = exports.User || (exports.User = {}));
});
