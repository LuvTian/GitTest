$( function() {
  var Balance = ( function() {
    var product;
    var account;
    var accountResult;
    var proportion;
    var lineChartData;
    var labels = [];
    var data_pro = [];
    var data_millionProceeds = [];
    var loginCookie = $.getCookie( "MadisonToken" );
    var maxpronumber;
    var minpronumber;
    var maxmillionproceeds;
    var minmillionproceeds;
    var _interval;

    function Balance() {
      var self = this;
      //切换曲线图
      $( ".chart-title li" ).unbind( "click" ).click( function() {
        var target = $( this ).data( "chart" );
        $( "#" + target + "-cont" ).removeClass( "abs-hide" ).siblings().addClass( "abs-hide" );
        $( "#" + target + "-title" ).addClass( "active" ).siblings().removeClass( "active" );
        self.LoadChar( target );
      } );
      //初始化投资按钮跳转链接
      $( "#btn-invest" ).click( function() {
        if ( $( this ).data( "href" ) != "" ) {
          window.location.href = $( this ).data( "href" );
        }
      } );
      //赎回按钮
      $( ".redeem" ).click( function() {
        window.location.href = "/html/paycenter/user-demand-redeem.html";
      } );
      if ( loginCookie ) {
        this.GetUserInfo();
      } else {
        $( "#navbar" ).hide();
        $( "#btn-login-out" ).removeClass( "hide" ).show().click( function() {
          $.Loginlink();
        } );
        $( ".on-line" ).hide();
        $( ".off-line" ).removeClass("hide");
        this.GetCurrentProduct();
      }
      var detailname = $.getQueryStringByName("detailname");
      !!detailname && $.UpdateTitle(decodeURIComponent(detailname));
      var Notice1 = new Notice();
    }
    Balance.prototype.GetUserInfo = function() {
      var self = this;
      var url = "/StoreServices.svc/user/info?t=" + new Date().getTime();
      $.AkmiiAjaxPost( url, {}, true ).then( function( data ) {
        if ( data.result ) {
          account = data.accountinfo;
          accountResult = data;
          var demandbalance = account.demandbalance + account.freezeamount; //至尊宝在投金额
          var demandyesterdayprofit = account.demandyesterdayprofit; //至尊宝昨日收益
          var demandprofitcount = account.demandprofitcount; //累计收益
          $( "#yesterday" ).text( "+" + $.fmoney( demandyesterdayprofit ) );
          $( "#total" ).text( "+" + $.fmoney( demandprofitcount ) );
          $( "#acc-investing-amount" ).text( $.fmoney( demandbalance ) ).unbind( "click" ).click( function() {
            window.location.href = "/html/product/demand-bill.html";
          } );
          $( ".acc-total,.acc-yesterday" ).unbind( "click" ).click( function() {
            window.location.href = "/html/product/demand-bill.html?type=5";
          } );
          //资金自动转入至尊宝
          if ( account.autoswitchdemand ) {
            $( "#autoswitchdemand" ).html( "已开通" );
            $( ".autoswitchdemand-warp" ).removeClass( "hide" ).attr( "href", "/html/Product/automatic-on.html" );
          } else {
            $( ".autoswitchdemand-warp" ).removeClass( "hide" ).click( function() {
              self.Checkiswithholdauthoity( "/html/Product/automatic.html", null );
            } );
          }
          if ( account.demandbalance == 0 ) {
            $( ".redeem" ).css( "color", "#979797" );
            $( ".redeem" ).unbind( "click" );
          }
          //系统维护,赎回页面已经做了控制
          // if (accountResult && accountResult.ismaintenance) {
          //     redeemHref = "/html/system/data-processing.html";
          // }
          // if (accountResult && accountResult.isglobalmaintenance) {
          //     redeemHref = "/html/system/system-maintenance.html";
          // }

        }
        self.GetCurrentProduct();
      } );
    }

    Balance.prototype.GetCurrentProduct = function() {
        var self = this;
        var url = "/StoreServices.svc/product/item";
        $.AkmiiAjaxPost( url, {
          "withlinechart": true
        }, true ).then( function( data ) {
          if ( data.result ) {
            maxpronumber = data.proportion.maxpronumber;
            minpronumber = data.proportion.minpronumber;
            maxmillionproceeds = data.proportion.maxmillionproceeds;
            minmillionproceeds = data.proportion.minmillionproceeds;
            product = data.productinfo;
            proportion = data.proportion;
            //七日年化
            $( "#char-avgpronumber" ).html( $.fmoney( proportion.avgpronumber ) );
            $( "#char-avgmillionproceeds" ).html( $.fmoney( proportion.lastmillionproceeds, 4 ) );
            if ( labels.length <= 0 ) {
              self.LoadChar( "chart1" );
            };
            if ( accountResult && accountResult.result ) {
              if ( product.status < 5 ) {
                self.initAppoint( product );
              } else if ( product.status < 6 ) {
                self.initSelling( product );
              } else {
                self.initSold( product );
              }
            }
          };
        } );
      }
      //初始化预约
    Balance.prototype.initAppoint = function( product ) {
      $( ".navbar" ).addClass( "hide" );
      $( "#btn-remind-redeem" ).removeClass( "hide" );
      if ( product.isappointment ) {
        $( "#btn-remind" ).text( "已提醒" ).unbind( "click" );
      } else {
        $( "#btn-remind" ).text( "开售提醒" ).unbind( "click" ).bind( "click", appoint );
      }
    };

    //预约事件
    Balance.prototype.appoint = function() {
      var data = {
        productid: product.productid
      };
      var url = "/StoreServices.svc/product/appoint";
      $.AkmiiAjaxPost( url, data ).then( function( data ) {
        if ( data.result ) {
          $.alertNew( "开售提醒成功，我们将会在产品开售前通过短信通知您，敬请留意！" );
          product.isappointment = true;
          $( "#btn-remind" ).text( "已提醒" ).unbind( "click" );
        } else if ( data.errorcode == "missing_parameter_accountid" ) {
          $.Loginlink();
        } else {
          $.alertF( data.errormsg, null, getCurrentProduct );
        }
      } );
    };

    //初始化在售
    Balance.prototype.initSelling = function( product ) {
      var self = this;
      $( ".navbar" ).addClass( "hide" );
      clearInterval( _interval );
      if ( product.countdownsecond > 0 ) {
        self.coundDownTimer();
        _interval = setInterval( function() {
          self.coundDownTimer()
        }, 1000 );
      } else {
        $( "#btn-invert-redeem" ).removeClass( "hide" );
        $( "#btn-invest" ).data( "href", "/html/product/productbuy.html" ).text( "投资" );
      }
    };
    //即将开售倒计时
    Balance.prototype.coundDownTimer = function() {
      var self = this;
      product.countdownsecond = product.countdownsecond - 1;
      var second = product.countdownsecond % 60;
      var minutes = parseInt( product.countdownsecond / 60 );
      if ( minutes <= 0 && second <= 0 ) {
        clearInterval( _interval );
        self.initSelling( product );
        return;
      }
      $( "#btn-invert-redeem" ).removeClass( "hide" );
      $( "#btn-invest" ).data( "href", "" ).text( "即将开售" );
    };

    //初始化售罄
    Balance.prototype.initSold = function( product ) {
      $( ".navbar" ).addClass( "hide" );
      $( "#btn-sold-redeem" ).removeClass( "hide" );
    };

    /**加载折线图 */
    Balance.prototype.LoadChar = function( chart ) {
      if ( !( labels & data_pro & data_millionProceeds & labels.length > 0 & data_pro.length > 0 & data_millionProceeds.length > 0 ) ) {
        labels = [];
        data_pro = [];
        data_millionProceeds = [];
        $.each( proportion.proportionlist, function( index, item ) {
          labels.push( item.ProTime );
          data_pro.push( item.ProNumber );
          data_millionProceeds.push( item.MillionProceeds );
        } );
      }
      lineChartData = {
        labels: labels,
        datasets: [ {
          fillColor: "rgba(255,223,209,1)",
          strokeColor: "rgba(255,255,255,1)",
          data: chart == "chart1" ? data_pro : data_millionProceeds,
        } ]
      };

      var ctx = document.getElementById( chart ).getContext( "2d" );
      if ( chart == "chart1" ) {
        new Chart( ctx ).Line( lineChartData, {
          responsive: true,
          scaleShowHorizontalLines: false,
          scaleShowVerticalLines: false,
          scaleOverride: true,
          scaleSteps: 5,
          scaleStepWidth: ( ( maxpronumber - minpronumber ) / 5 ).toFixed( 2 ),
          scaleStartValue: minpronumber
            //scaleBeginAtZero:true
        } );
      } else {
        new Chart( ctx ).Line( lineChartData, {
          responsive: true,
          scaleLabel: "<%=value%>",
          scaleShowHorizontalLines: false,
          scaleShowVerticalLines: false,
          scaleOverride: true,
          scaleSteps: 5,
          scaleStepWidth: ( ( maxmillionproceeds - minmillionproceeds ) / 5 ).toFixed( 4 ),
          scaleStartValue: minmillionproceeds
            //scaleBeginAtZero: true
        } );
      }
    }

    //检查新浪设置
    Balance.prototype.Checkiswithholdauthoity = function( url, withcallback ) {
      if ( account.customstatus < 3 ) {
        $.alertF( "您的资料还未完善，现在去完善吧", null, $.RegistSteplink );
        return;
      }
      //直连模式
      if ( account.iswithholdauthoity == 0 ) //未设置新浪支付密码
      {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
        $.SetSinaPayPassword( returnurl, accountResult.date, account.referralcode, account.iscashdesknewuser );
      } else if ( account.iswithholdauthoity == 1 ) //未设置委托代扣
      {
        var returnurl = window.location.origin + "/eback.html?r=" + window.location.href;
        $.WithholdAuthority( returnurl, withcallback, account.referralcode, true );
      } else {
        window.location.href = url;
      }
    }
    return Balance;
  }() );
  var balance = new Balance();
} );