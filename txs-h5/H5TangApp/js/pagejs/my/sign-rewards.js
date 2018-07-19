
var pageIndex = 1;
var signrewardslist;
function getRewardsListshow(){
     var url = "/StoreServices.svc/activity/getsigninrewardlist";
     var param ={"pageindex":pageIndex  }
     $.AkmiiAjaxPost(url, param).then(function(data){
         if(data.result){
            signrewardslist = data.signinrewardlist;
            var ha=[];
            if(signrewardslist.length>0){
                $.each(signrewardslist,function(index,item){
                   ha.push('<div class="rewards_contain bor_bottom">')
                   ha.push('<div class="sign_content clearfix">')
                   ha.push('<div class="time_sign">')
                   ha.push('<div class="time">'+item.rewarddate+'</div>')
                   ha.push(' <div class="tip_time">奖励时间</div>')
                   ha.push('</div>')
                   ha.push('<div class="rewards_sign clearfix">')
                   if(item.rewardtype==5){
                        ha.push('<div class="arrow_icon" data-href="/html/my/address_sign.html?time="><i></i></div>')
                   }
                   ha.push('<div class="weui_cells_checkbox2">')
                   ha.push('<div class="getrewards">'+item.rewardmemo+'</div>')
                   ha.push('<div class="rewards_tips">'+item.rewardsource+'</div>')
                   ha.push('</div>')
                   ha.push('</div>')
                   ha.push('</div>')
                   ha.push('</div>')
                })
                var htmlist0 = ha.join( "" );
                $(".sign_box").append(htmlist0); 
                $.LoanMore($(".sign_box"), null, "reloadgethistory()");
                getcontain();
            }else{
                $.LoanMore($(".sign_box"), "没有更多交易记录了");
            }
            function getcontain(){     
                $(".sign_box").delegate(".rewards_contain","click",function(){
                    var _dataHref=$(this).find(".arrow_icon").attr("data-href")
                    if(_dataHref){
                        var _time=$(this).find(".time").text()
                        window.location.href=_dataHref+_time;
                    }else{
                        return;
                    }
                        
                }) 
            }

         }else{
             $.alertF(data.errormsg)
         }
     })
    }
    
    function reloadgethistory(){
        pageIndex+=1;
        getRewardsListshow();
    }

$(function(){
    getRewardsListshow();
})