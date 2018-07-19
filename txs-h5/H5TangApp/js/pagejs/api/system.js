define(["require", "exports"], function (require, exports) {
    "use strict";
    var System;
    (function (System) {
        function getBannerByType(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/anonymous/system/getbannerbytype";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success, error);
        }
        System.getBannerByType = getBannerByType;
    })(System = exports.System || (exports.System = {}));
});
