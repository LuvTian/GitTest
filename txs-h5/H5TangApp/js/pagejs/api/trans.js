define(["require", "exports"], function (require, exports) {
    "use strict";
    var Trans;
    (function (Trans) {
        function getHistory(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/trans/history";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Trans.getHistory = getHistory;
        function getFixedList(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/trans/productbidlist";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Trans.getFixedList = getFixedList;
    })(Trans = exports.Trans || (exports.Trans = {}));
});
