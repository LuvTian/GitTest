$(function () {

    var loanid = $.getQueryStringByName("loanid"); //
    var productid = $.getQueryStringByName("productid"); //

    var Data = {
        productid: productid,
        loanid: loanid
    }

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
            "<li><span>企业负债情况</span><em>{8}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span style='width:70%;'>借款前6个月征信报告中逾期次数</span><em style='width:30%'>{9}</em></li>" +
            "<li><span style='width:70%;'>借款前6个月征信报告中逾期金额</span><em style='width:30%'>{10}</em></li>" +
            "</ul>" +
            "<ul>" +
            "<li><span>借款记录</span><em>{11}</em></li>" +
            "<li><span>还款记录</span><em>{12}</em></li>" +
            "<li><span>待还金额</span><em>{13}</em></li>" +
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
            "<li><span>风险提示</span><em></em></li>" +
            "</ul>"
    }



    //贷后情况
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

            $(".swiper-slide").html(tab3_html);
        } else {
            $.alertF(res.errormsg)
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