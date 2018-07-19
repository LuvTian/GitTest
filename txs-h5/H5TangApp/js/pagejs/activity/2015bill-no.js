/// <reference path="/_references.js" />

$(function () {
    layzeLoadImg();
    $(".bill-music").click(function () {
        var audio = document.getElementById("music");
        if (audio != null) {
            if (audio.paused) {
                audio.play();
                $(".music-play").show();
                $(".music-stop").hide();
            }
            else {
                audio.pause();
                $(".music-stop").show();
                $(".music-play").hide();
            }
        }
    });

});

var layzeLoadImg = function () {
    var imgs = $("img");
    var s = 0;
    $._imgLoad(imgs, function () {
        s = s + 1;
        var d = parseInt(s * 100 / imgs.length);
        $("#imgsCount").text(d);
    });
};

