$(function() {
    $.force_open(2);
    var url = location.href.slice(location.href.indexOf("?") + 7);
    $("#JS_open").click(function() {
        window.location.href = url;
    })
})