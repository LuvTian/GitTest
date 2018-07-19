var _time= $.getQueryStringByName("time")
//var apiUrl_prefix = "http://192.168.3.30:8090";
var userId=$.getCookie("userid")
var addressId = $.getQueryStringByName("addressId") || "";
var addressInfo="";
var receiveName="";
var receiveNumber="";

$(function(){

        var url = "/StoreServices.svc/activity/GetSignInInfoByDate";
        var param ={"signindate":_time}
        $.AkmiiAjaxPost(url, param).then(function(data){
            if(data.result){
                $(".sign_rewards_name").text(data.rewardname);
                $(".get_signrewards_time span").text(data.signindate);

                if(data.deliveryaddress){
                    $(".sign_received_address").text("收货地址："+data.deliveryaddress);
                    $(".sign_received_name span").text(data.consigneename)
                    $(".sign_received_tel").text(data.phone)                   
                    $(".fill-btn").hide();
                    $("#exist_address").show().unbind("click");
                }else{
                    $.AkmiiAjaxPost(apiUrl_prefix+"/members/address/list",{"accountId":userId},true).then(function(d){
                        if(d.code==200){
                            if((d.data||[]).length==0){ 
                                $("#no_address").show().click(function(){
                                    var timeshow=encodeURIComponent("/html/my/address_sign.html?time="+_time);
                                    window.location.href="/html/store/addressmodify.html?returnUrl="+decodeURIComponent(timeshow);
                                });
                                $(".fill-btn").unbind("click").addClass("bg-eebdbd");
                                $(".fill-btn span").css("color","#E2A761")
                            }else{
                                if(addressId){
                                    $.AkmiiAjaxGet(apiUrl_prefix + "/members/address/" + addressId, { "accountId": userId }, false).then(function(d){
                                        if(d.code==200){
                                            $("#exist_address").show().click(function(){
                                                var timeshow=encodeURIComponent("/html/my/address_sign.html?time="+_time);
                                                 window.location.href="/html/store/addressmodify.html?returnUrl="+decodeURIComponent(timeshow);
                                            })

                                            var info = d.data || {};
                                            addressInfo=info.provinceName+info.cityName+info.countyName+info.address;
                                            receiveName=info.receivingName;
                                            receiveNumber=info.cellPhone
                                            $(".sign_received_name span").text(info.receivingName)
                                            $(".sign_received_tel").text(info.cellPhone)
                                            $(".sign_received_address").text("收货地址:"+info.provinceName+info.cityName+info.countyName+info.address)

                                            $(".fill-btn").click(function(){
                                                $(".miss-tip,.mask").show();
                                                $(".miss-tip a").click(function(){
                                                var url = "/StoreServices.svc/activity/confirmaddress";
                                                var param = {"address":$(".sign_received_address").text().substring(5),"phone":$(".sign_received_tel").text(),"consigneename":$(".sign_received_name span").text()}
                                                $.AkmiiAjaxPost(url,param).then(function(data){
                                                    if(data.result){
                                                        window.location.href="/html/anonymous/welcome.html"
                                                    }else{
                                                        $.alertF(data.errormsg)
                                                    }
                                                })
                                                    
                                                })
                                            })
                                        }else{
                                            $.alertF(d.errormsg);  
                                        }
                                    })

                                }else{
                                    $.AkmiiAjaxPost(apiUrl_prefix+"/members/address/list",{"accountId":userId},true).then(function(d){
                                        if(d.code==200){
                                            $("#exist_address").show().click(function(){
                                            var timeshow2=encodeURIComponent("/html/my/address_sign.html?time="+_time);
                                                window.location.href="/html/store/select-delivery-address.html?returnUrl="+decodeURIComponent(timeshow2);
                                            })
                                            //var info = d.data || {};
                                            // addressInfo=info.provinceName+info.cityName+info.countyName+info.address;
                                            // receiveName=info.receivingName;
                                            // receiveNumber=info.cellPhone
                                            // $(".sign_received_name span").text(info.receivingName)
                                            // $(".sign_received_tel").text(info.cellPhone)
                                            // $(".sign_received_address").text("收货地址:"+info.provinceName+info.cityName+info.countyName+info.address)

                                            $(".fill-btn").click(function(){
                                                $(".miss-tip,.mask").show();
                                                $(".miss-tip a").click(function(){
                                                    var url = "/StoreServices.svc/activity/confirmaddress";
                                                     var param = {"address":$(".sign_received_address").text().substring(5),"phone":$(".sign_received_tel").text(),"consigneename":$(".sign_received_name span").text()}
                                                    $.AkmiiAjaxPost(url,param).then(function(data){
                                                        if(data.result){
                                                            window.location.href="/html/anonymous/welcome.html"
                                                        }else{
                                                            $.alertF(data.errormsg)
                                                        }
                                                    })  
                                                })
                                            })
                                            var info = d.data[0] || {};
                                            $(".sign_received_name span").text(info.receivingName)
                                            $(".sign_received_tel").text(info.cellPhone)
                                            $(".sign_received_address").text("收货地址:"+info.provinceName+info.cityName+info.countyName+info.address)
                                        }else{
                                            $.alertF(d.errormsg);  
                                        }
                                    })
                                }
                            }
                        }
                    })
                }

            }else{
                $.alertF(data.errormsg);  
            }
        })
    

})