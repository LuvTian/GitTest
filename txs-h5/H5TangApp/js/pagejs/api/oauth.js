define(["require", "exports"], function (require, exports) {
    "use strict";
    var Authorize;
    (function (Authorize) {
        function AuthorizeCode(request, success, needLoder, error, complete) {
            var url = "/StoreServices.svc/auth2/authorize";
            $.AkmiiAjaxPost(url, request, !needLoder).then(success);
        }
        Authorize.AuthorizeCode = AuthorizeCode;
    })(Authorize = exports.Authorize || (exports.Authorize = {}));
});
