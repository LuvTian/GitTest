$(function(){
			 //var apiUrl_prefix = "http://192.168.3.30:8090";
			 
			 var addressmodify = "/html/store/addressmodify.html";
			 var returnUrl =$.getQueryStringByName("returnUrl");
			 var ha=[];
			 var pid=$.getQueryStringByName("pid");
			 var point=$.getQueryStringByName("point");
			 var first=false;
			 var canotadd=false;
			 var onlyone =false;
			 var info={id:[]};
			 var CaddressId=[];
			 var userId=$.getCookie("userid")
			 var gitList =function(){
				$.AkmiiAjaxPost(apiUrl_prefix+"/members/address/list",{accountId:userId},true).then(function(d){
				if(d.code==200){
						ha=[];
						info.id=[];
					if(d.data.length==0){
						$(".shownopic").show();
						first=true;
					}
					else if(d.data.length==1){
						onlyone=true;
							$.each(d.data,function(index,item){
							info.id.push(item.id);
							ha.push('<div class="content_box_address content_manage">');
							ha.push('<div class="con_name_tel">');
							ha.push('<div class="flex_1">'+item.receivingName+'</div>');
							ha.push('<div class="flex_1 flex_end">'+item.cellPhone+'</div>');
							ha.push('</div>');
							ha.push('<div class="address_details" contenteditable="false">'+item.provinceName+ item.cityName+item.countyName+item.address+'</div>');
							ha.push('<div class="con_name_tel bor_top col_333">');
							ha.push('<div class="flex_1 pd-left">');
							if(item.defaultAddress=="TRUE"){
								ha.push('<input type="checkbox" id=check_'+index+' class="chk_1" checked>');
								ha.push('<label for=check_'+index+'><img src="'+$.resurl()+'/css/img2.0/pointImg/choose.png" class="choosenimg" style="display:block" /></label> 默认地址');	
							}else{
								ha.push('<input type="checkbox" id=check_'+index+' class="chk_1">');
								ha.push('<label for=check_'+index+'><img src="'+$.resurl()+'/css/img2.0/pointImg/choose.png" class="choosenimg" style="display:none" /></label> 设为默认');	
							}		
							ha.push('</div>');
							ha.push('<div class="flex_1 flex_end pd-right">');
							ha.push('<t class="pd_right_9" id="edit" class="edit" onclick="window.location.href=\'/html/store/addressmodify.html?onlyone=true&Id='+item.id+'&pid='+pid+'&piont='+point+'\'" data-index="{0}">编辑</t><span class="e7 pd_right_9">|</span><t id="del" class="del">删除</t>')
							ha.push('</div>');
							ha.push('</div>');
							ha.push('</div>');
						})	
					}
					else{
						if(d.data.length>=10){
							canotadd=true;
						}else{
							canotadd=false;
						};
						$.each(d.data,function(index,item){
						info.id.push(item.id);
						ha.push('<div class="content_box_address content_manage">');
						ha.push('<div class="con_name_tel">');
						ha.push('<div class="flex_1">'+item.receivingName+'</div>');
						ha.push('<div class="flex_1 flex_end">'+item.cellPhone+'</div>');
						ha.push('</div>');
						ha.push('<div class="address_details" contenteditable="false">'+item.provinceName+ item.cityName+item.countyName+item.address+'</div>');
						ha.push('<div class="con_name_tel bor_top col_333">');
						ha.push('<div class="flex_1 pd-left">');
						if(item.defaultAddress=="TRUE"){
							ha.push('<input type="checkbox" id=check_'+index+' class="chk_1" checked>');
							ha.push('<label for=check_'+index+'><img src="'+$.resurl()+'/css/img2.0/pointImg/choose.png" class="choosenimg" style="display:block" /></label> 默认地址');	
						}else{
							ha.push('<input type="checkbox" id=check_'+index+' class="chk_1">');
							ha.push('<label for=check_'+index+'><img src="'+$.resurl()+'/css/img2.0/pointImg/choose.png" class="choosenimg" style="display:none" /></label> 设为默认');	
						}		
						ha.push('</div>');
						ha.push('<div class="flex_1 flex_end pd-right">');
						ha.push('<t class="pd_right_9" id="edit" class="edit" onclick="window.location.href=\'/html/store/addressmodify.html?Id='+item.id+'&pid='+pid+'&piont='+point+'\'" data-index="{0}">编辑</t><span class="e7 pd_right_9">|</span><t id="del" class="del">删除</t>')
						ha.push('</div>');
						ha.push('</div>');
						ha.push('</div>');
					})	
					}
	
				}
					var html0=ha.join("");
					$("#mainBody").append(html0);
					});
				}
				
			 	gitList();

				if($(".content_box_address").length==1){
					$(".pd-left").css("visibility","hidden")
				};

				$("#mainBody").delegate(".del","click",function(){	//删除
					var $this = $(this);
					var index_d = $(this).index(".del")	
					$.confirmF("确认删除该收货地址","取消","确认",function(){return},function(){
						$.AkmiiAjaxPost(apiUrl_prefix+"/members/address/disable",{addressId:info.id[index_d]},false).then(function(d){
						if(d.code==200){
							// $(".del").eq(index_d).parents(".content_box_address").remove();
							$(".content_box_address").remove();
							gitList();
						}else{
							$.alertF(d.message)
						}
					});
					})
				})

				$("#mainBody").delegate("label","click",function(){//选默认
					var $this = $(this);
					var c_index = $this.index("label");
					

					if($(".choosenimg").eq(c_index).css("display")=="none"){
						var data = {
							"addressId": info.id[c_index]
							};
					$.AkmiiAjaxPost(apiUrl_prefix+"/members/address/setUpDefault",data,false).then(function(d){
							if(d.code==200){
								$(".content_box_address").remove();
								gitList();
							}else{
								$.alertF(d.message)
							}
						})
					}else{
						$(".choosenimg").eq(c_index).css("display","block")
						return;
					}
					
				});



			$(".createNewaddress").click(function(){//编辑
				if(first){
					window.location.href="/html/store/addressmodify.html?first=true";
				}else if(canotadd){
					$.alertF("地址添加不得超过10条");
					return false;
				}
				else{
					window.location.href= addressmodify;
				}
			})


			
		})