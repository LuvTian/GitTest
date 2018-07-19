$( function() {
  var getUserid = $.getQueryStringByName( "id" );
  var c = $.getQueryStringByName( "c" );
  var tel = $.getQueryStringByName( "tel" );
  //showNumber();
  showLeave();
  $( ".to_product" ).click( function() {
    window.location.replace( "/html/product/" )
  } )


  // function showNumber() {

  //     $.AkmiiAjaxPost("/StoreServices.svc/activity/newinvitenormal/config", {inviteby:c}, false).then(function (d) {
  //         if (d.result) {

  //         } else {
  //             $.alertF(d.errormsg)
  //         }
  //     })
  // };

  function showLeave() {
    //var id = $.getCookie("userid");
    $( "#tel" ).html( tel );
    var hd = [];
    var tipray = [ "初次升级为该等级会员即可获得", "每月发放一次礼包至会员账户", "生日当天发放相应礼包至会员帐户", "当前等级满60天即可获得感恩礼包", "每日完成签到即可获得唐果" ];
    $.AkmiiAjaxPost( apiUrl_prefix + "/members/info", {
      id: getUserid
    }, true ).then( function( d ) {
      if ( d.code == 200 ) {
        var level = d.data.level
        var defeatNum = d.data.rankProportion;
        switch ( level ) {
          case 0:
            $( "#levelgiftshow" ).text( "青铜会员可享权益" );
            $( ".ms_lv_show" ).attr( "src", $.resurl() + "/css/img2.0/img/ms_lv.png" );
            $( ".ms_text" ).text( "提升会员等级所获权益越多" );
            break;
          case 1:
            $( ".ms_lv_show" ).attr( "src", $.resurl() + "/css/img2.0/img/ms_lv1.png" );
            $( ".ms_text" ).html( "您的好友已击败<span class='show_money'>" + defeatNum + "</span>青铜用户" );
            break;
          case 2:
            $( ".ms_lv_show" ).attr( "src", $.resurl() + "/css/img2.0/img/ms_lv2.png" );
            $( ".ms_text" ).html( "您的好友已获得<span class='show_money'>3</span>大会员权益，快来围观！" );
            break;
          case 3:
            $( ".ms_lv_show" ).attr( "src", $.resurl() + "/css/img2.0/img/ms_lv3.png" );
            $( ".ms_text" ).html( "您的好友已获得<span class='show_money'>4</span>大会员权益，快来围观！" );
            break;
          case 4:
            $( ".ms_lv_show" ).attr( "src", $.resurl() + "/css/img2.0/img/ms_lv4.png" );
            $( ".ms_text" ).html( "您的好友已获得<span class='show_money'>5</span>大会员权益，快来围观！" );
            break;
        }
        $.AkmiiAjaxGet( apiUrl_prefix + "/privileges/{0}".replace( "{0}", encodeURIComponent( level ) ), true ).then( function( d ) {
          $.each( d.data, function( index, item ) {
            hd.push( '<div class="ms_item">' )
            hd.push( '<div class="flex_1">' )
            hd.push( '<div class="ms_logimgbox">' )
            hd.push( '<img src=' + item.imgPrivilege2d + '>' )
            hd.push( '</div>' )
            hd.push( '</div>' )
            hd.push( '<div class="flex_5 bor_bottom">' )
            hd.push( ' <div class="ms_contian_tips">' )
            hd.push( '<h3>' + item.name + '</h3>' )
            hd.push( '<p>' )
            switch ( d.data[ index ].giftBagType ) {
              case 1: //投资礼包
                hd.push( tipray[ 1 ] )
                break;
              case 2: //生日礼包
                hd.push( tipray[ 2 ] )
                break;
              case 3: //感恩礼包
                hd.push( tipray[ 3 ] )
                break;
              case 4: //首升礼包
                hd.push( tipray[ 0 ] )
                break;
              default: //糖果
                hd.push( tipray[ 4 ] )
            }
            hd.push( '</p>' )
            hd.push( '</div>' )
            hd.push( '</div>' )
            hd.push( '</div>' )
          } )
          var htmlist0 = hd.join( "" );
          $( ".con_box" ).append( htmlist0 );
          $( ".flex_5" ).last().removeClass( "bor_bottom" );
          $( ".ms_item" ).last().css( "margin-bottom", "2rem" );


        } )
      }
    } )

  };


} )