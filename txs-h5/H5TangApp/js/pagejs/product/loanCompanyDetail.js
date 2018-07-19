$(function () {

    var str = '';
    var loanid = $.getQueryStringByName("loanid"); //
    var creditorNo = $.getQueryStringByName("creditorNo"); //
    var productCode = $.getQueryStringByName("productCode"); //
    var productid = $.getQueryStringByName("productid"); //
    var productbidid = $.getQueryStringByName("bid"); //
    var amount = $.getQueryStringByName("amount"); //



    //var url_yuming = 'http://msdmgrtest.17msd.com';
    /* var apiUrl_prefix_p2p = "https://www.easy-mock.com/mock/5af565645f3e6b593224354f/zd";
    var url = apiUrl_prefix_p2p + "/p2p/trading/order/assetDetail";

    var loan_a = $('.loan-note a');

    loan_a.each(function (index, item) {

        $(item).on('touchstart click', function (e) {
            if (index === 0) {
                window.location.href = url_yuming + "/msdmgr/EnterpriseInfoEntryController.do?getLoanAgreement&assetNo=" + creditorNo;

            } else {
                window.location.href = "/zdhtml/p2p_xproduct_contract.html";
            }

        });
    }) */



    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 500,
        autoHeight: true,
        on: {
            slideChange: function () {

                $(".tabs li.active").removeClass('active');
                $(".tabs li").eq(this.activeIndex).addClass('active');

                if (this.activeIndex === 2) {
                    // cont.init();
                    getAssetInfo();
                }

            }
        }
    })
    $(".tabs li").on('touchstart click', function (e) {
        e.preventDefault();
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index());
    });


    var cont = {
        elem_contView: $('.contView'),
        elem_mask: $('.mask'),
        swiper: null,
        init: function () {
            $('#alert').each(function (index, item) {
                $(item).on('touchstart click', function (e) {
                    e.preventDefault();
                    cont.elem_contView.show();
                    cont.elem_mask.show();
                    cont.elem_contView.find('.swiper-slide').html(str);
                    setTimeout(function () {
                        cont.newSiper();
                        cont.docUntouch();
                    }, 300);
                });
            });

            cont.elem_contView.find('.close').on('touchstart click', function () {
                cont.swiper.destroy(false);
                cont.elem_contView.hide();
                cont.elem_mask.hide();
                cont.docTouch();
            })
        },
        newSiper: function () {
            cont.swiper = new Swiper('#sContView', {
                direction: 'vertical',
                slidesPerView: 'auto',
                freeMode: true,
                scrollbar: {
                    el: '.swiper-scrollbar',
                    hide: true
                },
                mousewheel: true,
            });
        },
        eventDefault: function (e) {
            e.preventDefault();
        },
        docUntouch: function () {
            document.addEventListener('touchmove', cont.eventDefault, false);
        },
        docTouch: function () {
            document.removeEventListener('touchmove', cont.eventDefault, false);
        }

    }


    var url = apiUrl_prefix_p2p + "/p2p/trading/order/queryProductLoanRelationList";

    var Data = {
        productid: productid,
        loanid: loanid,
        productbidid: productbidid
    }

    /* $.AkmiiAjaxPost(url, Data, false).then(function (res) {

       if (res.respCode === '0000' && res.dataList.length > 0){
        //console.log(JSON.stringify(res,null,4))

            var data = res.dataList[0];
            var riskLevel = '',riskLevelText = '';

            // data.financeProjectDes = JSON.parse(data.financeProjectDes);
            // data.enterpriseInfo = JSON.parse(data.enterpriseInfo);
            // data.survivalPeriodInfo = JSON.parse(data.survivalPeriodInfo);


            data.financeProjectDes.repayWay = data.financeProjectDes.repayWay+'';
            switch(data.financeProjectDes.repayWay){
                case '1':
                    data.financeProjectDes.repayWay = '到期一次性还本付息';
                    break;
                case '2':
                    data.financeProjectDes.repayWay = '每月付息到期还本中';
                    break;
                case '3':
                    data.financeProjectDes.repayWay = '等额本息';
                    break;
                case '4':
                    data.financeProjectDes.repayWay = '等额本金';
                    break;
                case '5':
                    data.financeProjectDes.repayWay = '利息自动拨付本金复投';
                    break;
            }

            switch(data.riskLevel){
                case 'C':
                    riskLevel = '高';
                    riskLevelText = '进取型';
                    break;
                case 'A':
                case 'B':
                    riskLevel = '中';
                    riskLevelText = '进取型、成长型、平衡型、稳健性';
                    break;
                case 'AA':
                case 'AAA':
                    riskLevel = '低';
                    riskLevelText = '进取型、成长型、平衡型、稳健性、保守型';
                    break;
            }

            str = "根据借款人申报的借款人基本信息和项目基本信息，经我平台在授权和能力范围内通过第三方公开渠道对借款人涉诉情况和受到行政处罚并可能影响还款情况进行查询，本项目风险评估结果为<em>“风险较"+riskLevel+"”，适合评级结果为("+riskLevelText+")出借人投资</em>。投资本项目可能造成的后果为出借金额的本金和利息部分(全部)受到损失。";



            var Htmlobj = {
                headerHtml: "<h3>{0}</h3><p>出借金额<span>{1}元</span></p>",
                tab3: 
                        "<div class='updateDay'>更新时间：{0}</div>"+
                        "<ul>"+
                            "<li><span>项目资金运用情况</span><em>{1}</em></li>"+
                            "<li><span>经营情况及财务状况</span><em>{2}</em></li>"+
                            "<li><span>还款能力追踪</span><em>{3}</em></li>"+
                            "<li><span>涉诉情况</span><em>{4}</em></li>"+
                            "<li><span>行政处罚情况</span><em>{5}</em></li>"+
                            "<li><span>逾期情况</span><em>{6}</em></li>"+
                        "</ul>"+
                        "<ul>"+
                            "<li><span style='width:100%;position:static;'>其他可能影响借款人还款的重大信息</span><em style='text-align:left;'>{7}</em></li>"+
                        "</ul>",
                tab1: "<ul>"+
                            "<li><span>总借款金额</span><em>{0}元</em></li>"+
                        "</ul>"+
                        "<ul>"+
                            "<li><span>主体性质</span><em>{1}</em></li>"+
                            "<li><span>法定代表人</span><em>{1}</em></li>"+
                            "<li><span>注册资本</span><em>{2}万元</em></li>"+
                            "<li><span>成立时间</span><em>{3}</em></li>"+
                            "<li><span>所属行业</span><em>{4}</em></li>"+
                            "<li><span>注册地址</span><em>{5}</em></li>"+
                            "<li><span>收入情况</span><em>{6}万元</em></li>"+
                            "<li><span>企业负债情况</span><em>{7}</em></li>"+
                        "</ul>"+
                        "<ul>"+
                            "<li><span style='width:70%;'>借款前6个月征信报告中逾期次数</span><em>{8}</em></li>"+
                            "<li><span style='width:70%;'>借款前6个月征信报告中逾期金额</span><em>{8}</em></li>"+
                        "</ul>"+
                        "<ul>"+
                            "<li><span>借款记录</span><em>{9}</em></li>"+
                            "<li><span>还款记录</span><em>{10}</em></li>"+
                            "<li><span>待还金额</span><em>{10}</em></li>"+
                        "</ul>",
                tab2: "<ul>"+
                        "<li><span>项目编号</span><em>{0}</em></li>"+
                        "<li><span>项目简介</span><em>{1}</em></li>"+
                        "<li><span>借款期限</span><em>{2}天</em></li>"+
                        "<li><span>借款用途</span><em>{3}</em></li>"+
                        "<li><span>还款方式</span><em>{4}</em></li>"+
                        "<li><span>还款来源</span><em>{5}</em></li>"+
                        "<li><span>还款保障</span><em>{6}</em></li>"+
                    "</ul>"+
                    "<ul>"+
                        "<li><span>年化利率</span><em>{7}%</em></li>"+
                        "<li><span>起息日</span><em>{8}</em></li>"+
                        "<li><span>募集期</span><em>{9}</em></li>"+
                        "<li><span>项目风险等级</span><em>{10}<i id=\"alert\">?</i></em></li>"+
                        "<li><span>相关费用</span><em>{11}</em></li>"+
                    "</ul>"+
                    "<ul>"+
                        "<li><span>风险提示</span><em></em></li>"+
                    "</ul>"
            }


            Htmlobj.headerHtml = Htmlobj.headerHtml.format(
                data.enterpriseInfo.enCompanyName || '',
                $.fmoney(matchedAmount || 0.00)
            );
            Htmlobj.tab1 = Htmlobj.tab1.format(
                data.survivalPeriodInfo.operatingFunds || '正常',
                data.survivalPeriodInfo.financialSituation || '正常',
                data.survivalPeriodInfo.repaymentAbility || '无',
                data.survivalPeriodInfo.overdueSituation || '无',
                data.survivalPeriodInfo.involvingLitigation || '无',
                data.survivalPeriodInfo.administrativePenalty || '无',
                data.survivalPeriodInfo.otherEvents || '无',
                data.survivalPeriodInfo.otherEvents || '无'
            );

            Htmlobj.tab2 = Htmlobj.tab2.format(
                $.fmoney(data.loanAmount || 0.00),
                data.enterpriseInfo.enCorporateName || '',
                data.enterpriseInfo.registeredCapital/10000 || 0.00,
                data.enterpriseInfo.companySetupDate && data.enterpriseInfo.companySetupDate.match(/\d{4}-\d{2}-\d{2}/)[0] || '',
                data.enterpriseInfo.belongIndustry || '',
                data.enterpriseInfo.enCompanyAddress || '',
                data.enterpriseInfo.companyAnnualRevenue/10000 || 0.00,
                data.enterpriseInfo.companyDebt || '',
                data.enterpriseInfo.overdueCredit6month || '',
                data.enterpriseInfo.otherLoanPlatforms || '',
                '正常还款0次，逾期还款0次'
            );


            Htmlobj.tab3 = Htmlobj.tab3.format(
                data.financeProjectDes.projectNo || '',
                data.financeProjectDes.projectIntroduce || '',
                data.financeProjectDes.term || '',
                data.financeProjectDes.loanPurpose || '',
                data.financeProjectDes.repayWay || '',
                data.financeProjectDes.annualRate.toFixed(2) || '',
                data.valueStartTime && data.valueStartTime.match(/\d{4}-\d{2}-\d{2}/)[0] || '暂无',
                data.financeProjectDes.repaySource || '',
                data.financeProjectDes.repayMeasures || '',
                data.financeProjectDes.matchStartTime && data.financeProjectDes.matchStartTime.match(/\d{4}-\d{2}-\d{2}/)[0] || '',
                data.financeProjectDes.matchEndTime && data.financeProjectDes.matchEndTime.match(/\d{4}-\d{2}-\d{2}/)[0] || '',
                riskLevel || '',
                data.financeProjectDes.cost || ''
            );


            $(".loan-header").append(Htmlobj.headerHtml);

            $(".tab1").append(Htmlobj.tab1);

            $(".tab2").append(Htmlobj.tab2);

            $(".tab3").append(Htmlobj.tab3);
        }
    }) */




    var Htmlobj = {
        headerHtml: "<h3>{0}</h3><p>出借金额<span>{1}</span></p>",
        tab3: "<div class='updateDay'>更新时间：{0}</div>" +
            "<ul>" +
            "<li><span>借款资金运用情况</span><em>{1}</em></li>" +
            "<li><span>经营状况及财务状况</span><em>{2}</em></li>" +
            "<li><span>还款能力变化情况</span><em>{3}</em></li>" +
            "<li><span>涉诉情况</span><em>{4}</em></li>" +
            "<li><span>受行政处罚情况</span><em>{5}</em></li>" +
            "<li><span>逾期情况</span><em>{6}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span style='width:100%;position:static;'>其他可能影响借款人还款的重大信息</span><em style='text-align:left;width:100%;'>{7}</em></li>" +
            "</ul>",
        tab1: "<ul>" +
            "<li><span>总借款金额</span><em>{0}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span>主体性质</span><em>{1}</em></li>" +
            "<li><span>法定代表人</span><em>{2}</em></li>" +
            "<li><span>注册资本</span><em>{3}</em></li>" +
            "<li><span>成立时间</span><em>{4}</em></li>" +
            "<li><span>所属行业</span><em>{5}</em></li>" +
            "<li><span>注册地址</span><em>{6}</em></li>" +
            "<li><span>收入情况</span><em>{7}</em></li>" +
            "<li><span>负债情况</span><em>{8}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span>其他平台借款情况</span><em>{9}</em></li>" +
            "<li><span style='width:70%;'>借款前6个月征信报告中逾期次数</span><em style='width:30%'>{10}</em></li>" +
            "<li><span style='width:70%;'>借款前6个月征信报告中逾期金额</span><em style='width:30%'>{11}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span>借款记录</span><em>{12}</em></li>" +
            "<li><span>还款记录</span><em>{13}</em></li>" +
            "<li><span>待还金额</span><em>{14}</em></li>" +
            "</ul>",
        tab2: "<ul>" +
            "<li><span>项目名称</span><em>{0}</em></li>" +
            "<li><span>项目简介</span><em>{1}</em></li>" +
            "<li><span>借款期限</span><em>{2}</em></li>" +
            "<li><span>借款用途</span><em>{3}</em></li>" +
            "<li><span>还款方式</span><em>{4}</em></li>" +
            "<li><span>还款来源</span><em>{5}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span>年化利率</span><em>{6}%</em></li>" +
            "<li><span>起息日</span><em>{7}</em></li>" +
            "<li><span>募集期</span><em>{8}</em></li>" +
            "<li><span>项目风险等级</span><em>{9}-{10}<i id=\"alert\">?</i></em></li>" +
            "<li><span>相关费用</span><em>{11}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li onclick='location=\"/html/product/contract/txsp2ptipcontract.html\"'><span>风险提示</span><em><i class='rightArrow'></i></em></li>" +
            "</ul>"
    }


    //项目信息
    $.AkmiiAjaxPost("/StoreServices.svc/product/txsp2ploandetailinfo", Data, false).then(function (res) {
        if (res.result) {
            var data = res.detailinfo;
            var tab2_html = Htmlobj.tab2.format(
                data.productname || "&nbsp;", //项目编号
                data.projectintroduction || "&nbsp;", //项目简介
                data.borrowerduration || "&nbsp;", //借款期限
                data.borrowerusage || "&nbsp;", //借款用途
                data.repaymentmethod || "&nbsp;", //还款方式
                data.repaymentsource || "&nbsp;", //还款来源
                data.borrowerrate || "&nbsp;", //年化利率
                data.profitstartday || "&nbsp;", //起息日
                data.raisingduration || "&nbsp;", //募集期
                data.riskleveldesc || "&nbsp;", //项目风险等级
                data.risklevel || "&nbsp;", //项目风险等级
                data.relatedexpenses || "&nbsp;" //相关费用
            );
            $(".tab2").html(tab2_html);
            Data.loanid = data.loanid;
            str = "根据借款人申报的借款人基本信息和项目基本信息，经我平台在授权和能力范围内通过第三方公开渠道对借款人涉诉情况和受到行政处罚并可能影响还款情况进行查询，本项目风险评估结果为<em>“风险较" + data.riskleveldesc + "”，适合评级结果为(" + data.investleveldesc + ")出借人投资</em>。投资本项目可能造成的后果为出借金额的本金和利息部分(全部)受到损失。";
            cont.init();

        } else {
            $.alertF(res.errormsg)
        }
    });


    //借款人（企业）信息
    $.AkmiiAjaxPost("/StoreServices.svc/product/txsp2pborrowerdetailinfo", Data, false).then(function (res) {
        if (res.result) {
            var data = res.borrowerinfo;
            var tab1_html = Htmlobj.tab1.format(
                data.borroweramount || "&nbsp;", //总借款金额
                data.property || "&nbsp;", //主体性质
                data.legalperson || "&nbsp;", //法定代表人
                data.registeredcapital || "&nbsp;", //注册资本
                data.foundingdate || "&nbsp;", //成立时间
                data.industry || "&nbsp;", //所属行业
                data.registeredaddress || "&nbsp;", //注册地址
                data.income || "&nbsp;", //收入情况
                data.debt || "&nbsp;", //企业负债情况
                data.borrowinginotherplatforms || "&nbsp;", //其他平台借款情况
                data.overduenumber || "&nbsp;", //借款前6个月征信报告中逾期次数
                data.overdueamount || "&nbsp;", //借款前6个月征信报告中逾期金额
                data.loanrecord || "&nbsp;", //借款记录
                data.repaymentrecord || "&nbsp;", //还款记录
                data.unpaidamount || "&nbsp;" //待还金额
            );
            $(".tab1").html(tab1_html);
            //渲染头部
            $(".loan-header").html(Htmlobj.headerHtml.format(data.borrower || "&nbsp;", $.fmoney(amount || 0.00)))

            var auditedlist_html = "";
            for (var i = 0; i < data.auditedlist.length; i++) {
                if (data.auditedlist[i].auditedvalue == "1") {
                    auditedlist_html += "<li>" + data.auditedlist[i].auditedname + "</li>";
                }
            }
            $(".infoList ul").html(auditedlist_html);
            tabsSwiper.update();
        } else {
            $.alertF(res.errormsg)
        }
    });


    //贷后情况
    function getAssetInfo() {
        $.AkmiiAjaxPost("/StoreServices.svc/product/txsp2passetinfoafterloan", Data, false).then(function (res) {
            if (res.result) {
                var data = res.assetloaninfo;
                var tab3_html = Htmlobj.tab3.format(
                    formatDate(res.date) || "&nbsp;", //更新时间
                    data.loanfoundsusage || "&nbsp;", //项目资金运用情况
                    data.businessfinancialstate || "&nbsp;", //经营情况及财务状况
                    data.repaymentcapacitychange || "&nbsp;", //还款能力追踪
                    data.complaintcondition || "&nbsp;", //涉诉情况
                    data.administrativepenaltypunishment || "&nbsp;", //行政处罚情况
                    data.overduecondition || "&nbsp;", //逾期情况
                    data.importantinfoaffectrepayment || "&nbsp;" //其他可能影响借款人还款的重大信息
                )

                $(".tab3").html(tab3_html);
            } else {
                $.alertF(res.errormsg)
            }
        });
    }

    //电子合同链接
    $.AkmiiAjaxPost("/StoreServices.svc/user/txsp2puserelectroniccontract", Data, false).then(function (res) {
        if (res.result) {
            $("#link_loanAgreement").attr("href", res.url);
        } else {
            // $.alertF(res.errormsg)
            $("#link_loanAgreement").attr("href", "/Html/Product/contract/txsp2pcontractslease.html");
        }
    });


    function formatDate(d){
        if(d && d.length){
            var date=d.split(" ")[0];
            date=date.replace(/\//g,"-");
            return date;
        }else{
            return null;
        }
    }
})