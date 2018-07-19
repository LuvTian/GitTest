$(function () {

    var str = '';
    var loanid = $.getQueryStringByName("loanid"); //
    var creditorNo = $.getQueryStringByName("creditorNo"); //
    var matchedAmount = $.getQueryStringByName("matchedAmount"); //
    var productCode = $.getQueryStringByName("productCode"); //
    var productid = $.getQueryStringByName("productid"); //
    var productbidid = $.getQueryStringByName("bid"); //



    var Data = {
        productid: productid,
        loanid: loanid,
        productbidid: productbidid
    }




    var Htmlobj = {
        headerHtml: "<h3>{0}</h3><p>出借金额<span>{1}</span></p>",
        tab3: "<div class='updateDay'>更新时间：{0}</div>" +
            "<ul>" +
            "<li><span>项目资金运用情况</span><em>{1}</em></li>" +
            "<li><span>经营情况及财务状况</span><em>{2}</em></li>" +
            "<li><span>还款能力追踪</span><em>{3}</em></li>" +
            "<li><span>涉诉情况</span><em>{4}</em></li>" +
            "<li><span>行政处罚情况</span><em>{5}</em></li>" +
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
            "<li><span>项目编号</span><em>{0}</em></li>" +
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
            "<li><span>风险提示</span><em><i class='rightArrow'></i></em></li>" +
            "</ul>"
    }



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

            var auditedlist_html = "";
            for (var i = 0; i < data.auditedlist.length; i++) {
                if (data.auditedlist[i].auditedvalue == "1") {
                    auditedlist_html += "<li>" + data.auditedlist[i].auditedname + "</li>";
                }
            }
            $(".infoList ul").html(auditedlist_html);
        } else {
            $.alertF(res.errormsg)
        }
    });


})