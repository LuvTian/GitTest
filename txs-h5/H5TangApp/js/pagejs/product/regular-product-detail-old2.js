var RegularProductDetailClass = (function () {
  function RegularProductDetailClass() {
    this.ProductId = $.getQueryStringByName("id");
    this.Bid = $.getQueryStringByName("bid");
    this.Bidid = $.getQueryStringByName("bidid");
    this.vtype = $.getQueryStringByName("vtype");
    this.ToggleTab(Number($.getQueryStringByName("tab")));
    this.isbid = $.getQueryStringByName("isbid") == "true";
    this.isoldpro = false;
    this.matchmode = 0;
    this.getDetail();
    this.lockduration = Number($.getQueryStringByName("lockduration"));
    this.isentrust = $.getQueryStringByName("isentrust") == "true";
    this.cantransfer = $.getQueryStringByName("cantransfer") == "true";
    this.interestcouponid = $.getQueryStringByName("interestcouponid");
    this.temp = 0;
    this.getproductItem();
    if (this.isbid) {
      $("#replayHead").hide();
      if (this.vtype == 1 && this.CurrentTab == 3) { // 如果是从节节僧过来的已购买
        this.getLadderBidRepayPlan();
        return;
      }
      this.getBidRepayPlan();
      this.getCurrentProductBid();
    } else {
      // if (this.vtype == 1 && this.CurrentTab == 3) { // 如果是从节节僧过来的未购买
      //   this.getLadderBidRepayPlan();
      //   return;
      // }
      this.getRepayPlan();
    }
  }
  RegularProductDetailClass.prototype.pageInit = function () {
    var topDom = this;
    $(".header-detail .small-3").map(function (index, item) {
      $(item).bind('click', function () {
        window.location.replace(window.location.pathname + "?id=" + topDom.ProductId + "&bid=" + topDom.Bid + "&tab=" + $(".header-detail .small-3").index(this) + "&isbid=" + topDom.isbid + "&vtype=" + topDom.vtype + "&interestcouponid=" + topDom.interestcouponid + "&bidid=" + topDom.Bidid);
      });
    });
    $("#productleavel").click(function () {
      window.location.href = "/Html/Product/productfixedinfo.html";
    });
    $("#entrustxieyi").click(function () {
      if (topDom.isbid) {
        if (topDom.vtype == 1) { // 周周僧
          window.location.href = "/Html/Product/contract/dingxiangweituozzs.html?bidid=" + topDom.Bidid;
          return;
        }
        if (topDom.matchmode <= 1) {
          window.location.href = "/Html/Product/contract/dingxiangweituoxieyi.html?bidid=" + topDom.Bidid;
        } else {
          window.location.href = "/Html/Product/contract/cxdingxiangweituoxieyi.html?bidid=" + topDom.Bidid;
        }
      } else {
        if (topDom.vtype == 1) { // 周周僧
          window.location.href = "/Html/Product/contract/dingxiangweituozzs.html";
          return;
        }
        if (topDom.matchmode <= 1) {
          window.location.href = "/Html/Product/contract/dingxiangweituoxieyi.html";
        } else {
          window.location.href = "/Html/Product/contract/cxdingxiangweituoxieyi.html";
        }
      }
    });
  };
  RegularProductDetailClass.prototype.ToggleTab = function (currentIndex) {
    this.CurrentTab = currentIndex;
    //$.UpdateTitle($(".header-detail .small-3").eq(currentIndex).text());
    $(".header-detail .small-3").removeClass("active");
    $(".header-detail .small-3").eq(currentIndex).addClass("active");
    $("#tab-content").children().hide();
    $("#tab-content").children().eq(currentIndex).show();
  };
  RegularProductDetailClass.prototype.getDetail = function () {
    var topDom = this;
    var url = "/StoreServices.svc/product/productdetail";
    var paramter = {
      productid: topDom.ProductId,
      bid: topDom.Bid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
      if (data.result) {
        var detail = data.regularproductdetail;
        topDom.matchmode = detail.matchmode;
        topDom.isoldpro = detail.isoldproduct;
        topDom.pageInit();
        if (topDom.lockduration == 0 && !topDom.isentrust && !detail.cantransfer && detail.type != 99 && detail.type != 3) {
          $("#redpenaltyhtml").show();
          $("#redpenalty").show().html("手续费=投资本金*2%");
        }
        if (Number(detail.saletype) == 12 ||
          Number(detail.saletype) == 1 || (topDom.isentrust && !topDom.cantransfer) || (detail.isentrust && !detail.cantransfer)) {
          //$("#transferpenalty").show();
          //$("#producttransferhtml").html("转让说明");
          //$("#earlyredemptionfee").html("不可转让");
          // $('#zr_218').show();
          $("#enddate").show();
        } else if (detail.cantransfer) {
          //$("#transferpenalty").show();
          $("#earlyredemptionfee").html(detail.earlyredemptionfee);
          $("#enddate").show();
          //$("#penalty").show();
          //$("#counterfee").html(detail.counterfee);
        } else {
          //$("#penalty").show();
          $("#redpenalty").show();
          $("#redtime").show();
        }
        $("#productleavel").html((detail.riskleveldesc || "").split('|')[2] + '<b class="zm">' + detail.riskleveltext + '</b>');
        if (detail.cantransfer) {
          $("#closedperiod").html("无");
        } else {
          $("#closedperiod").html(detail.closedperiod);
          $("#transferpenalty").hide();
          $("#enddate").hide();
        }
        $('#zr_218').show();
        $("#counterfee").html(detail.counterfee);
        $("#dateofinterest").html(detail.dateofinterest || "次日起息");
        $("#fitcustomertype").html((detail.riskleveldesc || "").split('|')[1]);
        $("#projectduration").html(detail.projectduration || "60天");
        $("#raisetotal").html((detail.raisetotal / 10000) + "万");
        $("#recruitmentperiod").html(detail.recruitmentperiod);
        $("#repaymentmethod").html(detail.repaymentmethod);
        var startAmount = parseInt(detail.startamountnote);
        $("#startamountnote").html("起投金额" + startAmount + "元,以" + detail.step + "元倍数递增,最高可投资金额" + $.fmoneytextV2(detail.amountmax) + "元");
        if (!detail.cantransfer) {
          //$("#productleavel").parent().hide();
          //$("#fitcustomer").hide();
          $("#product-right").hide();
          //$("#dateofinterest").text("次日起息");
          //$("#recruitmentperiod").parent().hide();
          //$("#projectduration").text(detail.duration + "天");
          $("#redeemday").text("2");
        }
        topDom.later218Hand(detail);
        topDom.checkContent(topDom.isoldpro, topDom.matchmode, detail);
        topDom.zzsHand(detail);
      } else if (data.errorcode == 'missing_parameter_accountid') {
        $.Loginlink();
      } else {
        $.alertF(data.errormsg);
      }
    });
  };

  // 周周僧操作
  // 产品详情object
  RegularProductDetailClass.prototype.zzsHand = function (detail) {
    // 如果是周周僧
    if (detail.saletype == 98) {
      var strhtml = $("#rulesay").html();
      $("#yuqirule").html("回款规则");
      $("#rulesay").html(strhtml.replace(/工作日/g, "自然日")); // 工作日改成自然日
      $("#zr_218").hide();
      $("#redtime").hide();
      $("#enddate").hide();
      $("#producttransferhtml").html("是否可转");
      $("#earlyredemptionfee").html((detail.cantransfer ? "是" : "否"));
    }
  };
  // 根据matchmode来显示不同的字段
  // isoldpro:是否是老产品
  // matchmode:是否是定向委托==1、非定向委托==0、承销结构==2
  // 产品详情object
  RegularProductDetailClass.prototype.checkContent = function (isoldpro, matchmode, detail) {
    var self = this;
    // 是否是老产品
    if (isoldpro || matchmode == 0) {
      $("#regamount").html("起投金额");
      $("#startamountnote").html(parseInt(detail.startamountnote) + "元/份，一份起投，投资金额为" + detail.step + "的整数倍");
      $(".old_218").show();
      $("#closedperiod").html(detail.closedperiod);
      $("#regrepaystyle").html("还款方式");
      $("#regreback").hide();
      $("#zr_218").hide();
      $("#producttransferhtml").html("提前赎回手续费");
      $("#enddate").find(".l").html("赎回到账时间");
      $("#enddate").find(".r").html("申请赎回后2个工作日内，具体以第三方支付公司到账时间为准");
    }
    // 非定向委托
    if (isoldpro) {
      $("#reglevel").hide();
      $("#regmuji").hide();
      $("#fitcustomer").hide();
    }
  }
  RegularProductDetailClass.prototype.getIntroductionDetail = function (matchmode, assetrecordid, publisher) {
    var topDom = this;
    var url = "/StoreServices.svc/product/projectintroduction";
    var paramter = {
      productid: topDom.ProductId,
      assetrecordid: assetrecordid,
      publisher: publisher
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
      if (data.result) {
        var projInfo = data.projectintroduction;
        var assetrecordmodel = data.assetrecordmodel
        if (matchmode == 2) {
          $("#issuername").html(assetrecordmodel.issuername); /// 发行机构
          $("#assettype").html(assetrecordmodel.assettype); /// 资产类型
          $("#financeamount").html($.fmoney(assetrecordmodel.financeamount)); /// 融资金额
          //$("#raisingamountthreshold").html($.fmoney(assetrecordmodel.raisingamountthreshold)); /// 成立条件
          //$("#repayindemnity").html(assetrecordmodel.repayindemnity);/// 还款保障措施
          $("#creditmeasure").html(assetrecordmodel.creditmeasure); /// 增信措施
          $("#issurecomments").html(assetrecordmodel.issurecomments); /// 发行机构介绍
          $("#publisher").html(assetrecordmodel.publisher); /// 受托机构
          $("#publishercomennts").html(assetrecordmodel.publishercomennts); /// 受托机构介绍
          $("#exchangename").html(assetrecordmodel.exchangename); /// 备案交易所
          $("#exchangecomments").html(assetrecordmodel.exchangecomments); /// 交易所简介
          //$("#registeredcapital").html(assetrecordmodel.registeredcapital/1000); /// 注册资本
        } else {
          $("#publisher").html(projInfo.spvinfo); /// 受托机构
          $("#publishercomennts").html(projInfo.transferor); /// 受托机构介绍

          // $("#title1").html("受托方介绍");
          $("#title2").html("标的物的合作机构介绍");
          $('#cooperativeorganization').find('.z1').text('合作机构名称');
          $('#cooperativeorganization').find('.z2').text('合作机构介绍');
          $("#exchangename").html(projInfo.cooperativeorganization); /// 合作机构名称
          $("#exchangecomments").html(projInfo.cooperativeorganizationinfo); /// 合作机构介绍
          $('#assetcont').text(projInfo.assetsafe); // 资产介绍
          $('#assetcomm').text(projInfo.assetprofile); // 资产简介
          // $("#issuername").html(projInfo.issuername); /// 发行机构
          // $("#assettype").html(projInfo.assettype); /// 资产类型
          // $("#financeamount").html($.fmoney(projInfo.financeamount)); /// 融资金额
          // $("#creditmeasure").html(projInfo.creditmeasure); /// 增信措施
          // $("#issurecomments").html(projInfo.issurecomments); /// 发行机构介绍
          $('.asseter').hide();
          // $("#title3").html("标的资产简介");
          //$("#cooperativeorganization").text(projInfo.cooperativeorganizationinfo);
          //$("#assetprofile").text(projInfo.assetprofile);
          //$("#transferor").text(projInfo.transferor);
        }
        if (!$.isNull(projInfo.documentdisplay)) {
          $("#insurance-images").append("<div class='small-4 left'><img src='" + projInfo.documentdisplay + "' /></div>");
        } else {
          $("#insurance-images").text("暂无文件");
        }
      }
    });
  };
  RegularProductDetailClass.prototype.getRepayPlan = function () {
    var topDom = this;
    var url = "/StoreServices.svc/product/smrepayplan";
    var damount = 10000;
    if (this.vtype == 1) {
      url = "/StoreServices.svc/product/ladderrepayplan";
    }
    var paramter = {
      productid: this.ProductId,
      bidamount: damount
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
      if (data.result) {
        if (topDom.CurrentTab == 3) {
          $(".firstplan").show();
        }
        $("#totalprincipae").html($.fmoney(data.bidamount || damount));
        $("#intereststotal").html($.fmoney(data.intereststotal));
        var ha = [];
        var firsttxt = "回款时间",
          middletxt = "月还本金",
          righttxt = "月还利息";
        if (topDom.vtype == 1) {
          firsttxt = "计息时间";
          middletxt = "持有天数";
          righttxt = "已计利息";
        }
        ha.push("<li> <div class='small-4 left text-left'>{0}</div> <div class='small-4 left text-center'>{1}</div> <div class='small-4 left text-right'>{2}</div> </li>".replace("{0}", firsttxt).replace("{1}", middletxt).replace("{2}", righttxt));
        $.each(data.repayplanlist, function (index, item) {
          var cap = topDom.vtype == 1 ? item.duration : $.fmoney(item.capital);
          ha.push("<li> <div class='small-4 left text-left'>" + (item.repayday || item.startdate) + "</div> <div class='small-4 left text-center'>" + cap + "</div> <div class='small-4 left text-right'>" + $.fmoney(item.interests || item.interest) + "</div> </li>");
        });
        $("#recordPlanList").append($(ha.join('')));
      }
    });
  };
  RegularProductDetailClass.prototype.getBidRepayPlan = function () {
    var topDom = this;
    var url = "/StoreServices.svc/product/repayplan2";
    var paramter = {
      productbidid: topDom.Bidid
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
      if (data.result) {
        if (topDom.CurrentTab == 3) {
          $(".firstplan").hide();
          $(".bidplan").show();
        }
        var list = data.repayplanlist;
        $(".jjseng").hide();
        $(".other").show();
        $("#totalbidprincipae").html($.fmoney(data.totalprincipae));
        $("#totalbidinterest").html($.fmoney(data.accumalateinterst));
        topDom.createListDom(data);
        if (data.iscalledaway || data.penalty > 0) {
          if (list[0].status == 4 || list[0].status == 5 || list[0].status == 13) {
            $("#totalBidMsg").html("提前赎回手续费" + $.fmoney(data.penalty) + "元");
          } else {
            $("#totalBidMsg").html("转让产品手续费" + $.fmoney(data.penalty) + "元");
          }
        }
      } else if (data.errorcode == 'missing_parameter_accountid') {
        $.Loginlink();
      } else {
        $.alertF(data.errormsg);
      }
    });
  };

  // 节节僧产品还款计划-已投资
  RegularProductDetailClass.prototype.getLadderBidRepayPlan = function () {
    var topDom = this;
    var url = "/StoreServices.svc/product/ladderbidrepayplan";
    var paramter = {
      productbidid: topDom.Bidid
    };
    var list = [];
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
      if (data.result) {
        if (topDom.CurrentTab == 3) {
          $(".firstplan").hide();
          $(".bidplan").show();
        }
        list = data.LadderRepayPlanList || list;
        $(".jjseng").show();
        $(".other").hide();
        // $("#totalbidprincipae").html($.fmoney(data.totalprincipae));
        // $("#totalbidinterest").html($.fmoney(data.totalinterest));
        $("#jtotalbidprincipae").html($.fmoney(data.totalprincipae));
        $("#jtotalbidinterest").html($.fmoney(data.accumalateinterst));
        $("#haddate").html(data.holddays || 0);
        $("#havingdate").html(data.leftdays || 0);
        $("#thisrate").html(data.currentrate || 0);
        $("#maxrate").html(data.maxrate || 0);
        topDom.createLadderListDom(data);
        if (data.iscalledaway || data.penalty > 0) {
          if (list[0].status == 4 || list[0].status == 5 || list[0].status == 13) {
            $("#totalBidMsg").html("提前赎回手续费" + $.fmoney(data.penalty) + "元");
          } else {
            $("#totalBidMsg").html("转让产品手续费" + $.fmoney(data.penalty) + "元");
          }
        }
      } else if (data.errorcode == 'missing_parameter_accountid') {
        $.Loginlink();
      } else {
        $.alertF(data.errormsg);
      }
    });
  };

  RegularProductDetailClass.prototype.getCurrentProductBid = function () {
    var topDom = this;
    var url = "/StoreServices.svc/product/bid";
    var data = {
      productbidid: topDom.Bidid || topDom.Bid
    };
    $.AkmiiAjaxPost(url, data, true).then(function (data) {
      if (data.result) {
        var product = data.productbid;
        var url = "/StoreServices.svc/product/targetanduseraccountinfo";
        var data = {
          "productbidid": topDom.Bidid
        };
        $.AkmiiAjaxPost(url, data, true).then(function (data) {
          if (data.result) {

            if ((!$.isNull(data.transfername_one) && !$.isNull(data.targetname_one)) || (!$.isNull(data.targetname_two))) {
              $(".xieyi").show();
              $(".xieyi").show().click(function () {
                window.location.href = "/html/my/equity-transfer-assignment-list.html?bidid=" + product.id;
              });
            }
          }
        });
      }
    });
  };
  // 218之后上线的产品处理
  RegularProductDetailClass.prototype.later218Hand = function (item) {
    var topDom = this;
    // 如果是218之后的产品
    if (item.isentrust) {
      $('.old_218').hide();
      // 如果是可转让的
      if (item.cantransfer) {
        $('#zr_218').show();
        // 产品转让锁定期
        if (item.transferlockday == 0) {
          $('#zr_218 .r').html('购买当天可转让');
        } else if (item.transferlockday > 0) {
          $('#zr_218 .r').html('持有{0}天后可转让'.replace('{0}', item.transferlockday));
        }
      }
    }
  };
  RegularProductDetailClass.prototype.getproductItem = function () {
    var topDom = this;
    var url = "/StoreServices.svc/product/item";
    var paramter = {
      productid: topDom.ProductId
    };
    $.AkmiiAjaxPost(url, paramter, true).then(function (data) {
      if (data.result) {
        topDom.getIntroductionDetail(data.productinfo.matchmode, data.productinfo.assetrecordid, data.productinfo.publisher);
        //topDom.later218Hand(data.productinfo);
      }
    });
  };
  RegularProductDetailClass.prototype.createListDom = function (data) {
    var topDom = this;
    var ha = [];
    $.each(data.repayplanlist, function (index, entry) {
      var repaytime = entry.repaytime.replace(/\-/gi, '/');
      if (topDom.interestcouponid != "0") {
        ha.push("<li class='bb'> <span class='useinterest'>" + repaytime + "</span> <span class='useinterest'>" + $.fmoney(entry.monthlyprincipal) + "</span> <span class='useinterest'>" + $.fmoney(entry.monthinterst) + "</span> <span class='useinterest'>" + $.fmoney(entry.interstprofit) + "</span> </li>");
      } else {
        $("#interestcolumn").hide();
        $(".retext").removeClass("retext4");
        $(".retext").addClass("retext3");
        if (topDom.temp == 0) {
          //$("#recordBidPlanList ul li span:last-child").remove();
          $("#recordBidPlanList li span").removeClass("useinterest").addClass("nouseinterest");
          topDom.temp++;
        }
        ha.push("<li class='bb'> <span class='nouseinterest'>" + repaytime + "</span> <span class='nouseinterest'>" + $.fmoney(entry.monthlyprincipal) + "</span> <span class='nouseinterest'>" + $.fmoney(entry.monthinterst) + "</span> </li>");
      }
    });
    $("#recordBidPlanList").append($(ha.join('')));
  };
  // 节节僧处理节点
  RegularProductDetailClass.prototype.createLadderListDom = function (data) {
    var topDom = this;
    var ha = [];
    ha.push("<li class='bb'> <span class='small-4 left text-left'>计息时间</span> <span class='small-4 left text-center'>持有天数</span><span class='small-4 left text-right'>已计利息</span></li>");
    $.each(data.repayplanlist, function (index, entry) {
      var startd = entry.startdate || "";
      var sinterest = entry.interest || "";
      var sduration = entry.duration || "";
      ha.push("<li> <span class='small-4 left text-left'>" + startd + "</span> <span class='small-4 left text-center'>" + sduration + "</span> <span class='small-4 left text-right'>" + sinterest + "</span> </li>");
    });
    //   var repaytime = entry.repaytime.replace(/\-/gi, '/');
    //   if (topDom.interestcouponid != "0") {
    //     ha.push("<li class='bb'> <span class='useinterest'>" + repaytime + "</span> <span class='useinterest'>" + $.fmoney(entry.monthlyprincipal) + "</span> <span class='useinterest'>" + $.fmoney(entry.monthinterst) + "</span> <span class='useinterest'>" + $.fmoney(entry.interstprofit) + "</span> </li>");
    //   } else {
    //     $("#interestcolumn").hide();
    //     $(".retext").removeClass("retext4");
    //     $(".retext").addClass("retext3");
    //     if (topDom.temp == 0) {
    //       //$("#recordBidPlanList ul li span:last-child").remove();
    //       $("#recordBidPlanList li span").removeClass("useinterest").addClass("nouseinterest");
    //       topDom.temp++;
    //     }
    //     ha.push("<li class='bb'> <span class='nouseinterest'>" + repaytime + "</span> <span class='nouseinterest'>" + $.fmoney(entry.monthlyprincipal) + "</span> <span class='nouseinterest'>" + $.fmoney(entry.monthinterst) + "</span> </li>");
    //   }
    // });
    $("#recordBidPlanList").html($(ha.join('')));
  };
  return RegularProductDetailClass;
}());
var regularPage = new RegularProductDetailClass();