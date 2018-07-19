$(function() {
	var productId = $.getQueryStringByName("itemId");
	$.AkmiiAjaxGet(apiUrl_prefix + "/items/" + productId, true).then(function(data) {
		if (data.code == 200) {
			var pic_list = data.data.descImg ? JSON.parse(data.data.descImg) : "";
			//alert(data.data.descImg);
			// var source = $("#pic_detail").html();
			// var render = template.compile(source);
			// if (pic_list != null && pic_list != "") {
			// 	var html = render({
			// 		list: pic_list || []
			// 	});
			// 	$(".pic_detail").append(html);
			// }
			for (var i = 0; i < pic_list.length; i++) {
				var img_url = pic_list[i].value == "" ? +$.resurl()+"/css/img2.0/pointImg/default_pic_big.jpg" : pic_list[i].value;
				$(".pic_detail").append('<img src= ' + img_url + ' />');
			}
		}
	})
})