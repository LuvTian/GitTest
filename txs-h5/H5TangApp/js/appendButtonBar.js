var tpl = '<div {{fs}} class="footerBar_shadow"></div>\
		<div {{fs}} id="footerBarContainer">\
			<a {{fs}} href="/html/anonymous/welcome.html" id="footerBar_button1" class="footerBar_button">首页</a>\
			<a {{fs}} href="/html/product/index.html" id="footerBar_button2" class="footerBar_button">产品</a>\
			<div class="footerBar_button xdq_pt"></div>\
			<a {{fs}} href="/html/store/" id="footerBar_button3" class="footerBar_button">福利</a>\
			<a {{fs}} href="javascript:void(0)" onclick=checkLogin(\"/html/my/\") id="footerBar_button4" class="footerBar_button">我的</a>\
		</div>'
document.addEventListener('DOMContentLoaded', function () {
	var fontSize = fixedFundationSize(document, window);
	var FSstyle = "style='font-size:" + fontSize + "px'";
	if (!document.getElementById("footerBar")) {
		var footerBar = document.createElement("div");
		var footerdiv = document.createElement("div");
		footerBar.id = "footerBar";
		footerBar.innerHTML = tpl.replace(/{{fs}}/g, FSstyle);
		footerdiv.style.paddingBottom = "2.5rem";
		document.body.appendChild(footerdiv);
		document.body.appendChild(footerBar);
	}
})



function fixedFundationSize(doc, win) {
	var maxWidth = 720;
	var fontSize = 16;
	var docEl = doc.documentElement;

	var clientWidth = docEl.clientWidth;
	if (!clientWidth) return;
	if (clientWidth < 320) clientWidth = 320;
	if (clientWidth > maxWidth) clientWidth = maxWidth;
	fontSize = 16 * (clientWidth / 320);
	fontSize = (fontSize > 54) ? 54 : fontSize;
	//如果是pc访问
	if (!/windows phone|iphone|android/ig.test(window.navigator.userAgent)) {
		fontSize = 16 * maxWidth / 320;
	}
	return fontSize;
}

var footerBar = {
	highlight: function (i) {
		if (!document.getElementById("footerBarContainer")) {
			setTimeout(function () { footerBar.highlight(i) }, 100);
			return false;
		}
		if (i == 4) {
			checkLogin();
		}
		var fb_buttons = document.getElementById("footerBarContainer").getElementsByTagName("a");
		for (var j = 0; j < fb_buttons.length; j++) {
			fb_buttons[j].classList.remove("current");
		}
		fb_buttons[i - 1].classList.add("current");
	}
}

/*create cookie object*/
var cookie_obj = {};
(function () {
	var cookie_arr = document.cookie.split(";");
	for (var i = 0; i < cookie_arr.length; i++) {
		var d = cookie_arr[i].split("=");
		cookie_obj[d[0].replace(" ", "")] = d[1];
	}
})();


function checkLogin(url) {
	if (!cookie_obj["MadisonToken"]) {
		document.location.href = "/html/anonymous/login.html?returnurl=/html/my/"
	} else {
		if (url) {
			document.location.href = url;
		}
	}
}