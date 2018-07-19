/// <reference path="//_references.js" />
$(function () {
    getRank(1);
    getRank(2);
});
var getRank = function (type) {
    var url = "/StoreServices.svc/system/rank";
    $.AkmiiAjaxPost(url, { "type": type }, true).then(function (data) {
        var ranklist = data.ranklist;
        $.each(ranklist, function (index, entry) {
            var html = [];
            html.push("<div class=\"bg-white bb\">");
            html.push("<div class=\"small-6 fl\">" + (entry.username == "" ? "未实名" : entry.username) + "</div>");
            html.push("<div class=\"small-6 fl tr gray-font\">" + entry.mobile + "</div></div>");
            if (type == 1) {
                $("#invast").append(html.join(""));
            } else {
                $("#recommand").append(html.join(""));
            }
        });
    });
};