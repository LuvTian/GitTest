//商户改版-分店管理

var index = 0;
var pageSize = 20;

$(function () {
    $('article').last().prev().css('margin-bottom', '7rem');
    //$("#addbranch").attr("href", "addbranch.html");
    BindData();
});

var BindData = function () {
    var url = "/StoreServices.svc/store/getbranchcompanylist";
    var param = {
        pageindex: index
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            var status = data.status;
            var listArry = data.branchcompanylist;
            var userType = "1,2";
            if (userType.indexOf(data.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            var html = formatHtml(listArry, status);
            $("#listdata").append(html);
            if (status == "7" || status == "8") {
                $("#addbranch").remove();
            } else {
                $("#artAddbranch").show();
            }
            if (listArry.length < pageSize) {
                $.LoanMore($("#listdata"), "没有更多数据了");
            }
            else {
                index++;
                $.LoanMore($("#listdata"), null, "BindData()");
            }
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                $.Loginlink();
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    });
}

var formatHtml = function (listArry, status) {
    var ha = [];
    $.each(listArry, function (index, entry) {
        lastid = entry.companyid;
        ha.push("<article class=\"mar-t15 bg-white padd-15\" onclick=\"EditBranch('" + entry.companyid + "','"+status+"')\">");
        ha.push("    <div class=\"row bb padd-b15\">");
        ha.push("      <div class=\"small-8 columns\">");
        if (index == 0) {
            ha.push("        <span class=\"rink bg-ef5b67\">NO.1</span>");
        } else if (index == 1) {
            ha.push("        <span class=\"rink bg-f4d054\">NO.2</span>");
        }
        else if (index == 2) {
            ha.push("        <span class=\"rink bg-77d6f1\">NO.3</span>");
        } else {
            ha.push("        <span class=\"rink color-333\">NO." + (index + 1) + "</span>");
        }
        ha.push("        <span class=\"col-3 fz-15 shopname\">" + entry.companyname + "</span>");
        ha.push("      </div>");
        if (status == "7" || status == "8") { } else {
            ha.push("      <div class=\"small-4 columns az-text-right managershop line-eh2 \">");
            ha.push("         <a href=\"edit-branch.html?bid=" + entry.companyid + "\" style=\" color:black\">管理<icon class=\"wechat icon-right textInd3\"></icon></a>");
            ha.push("      </div>");
        }
        ha.push("    </div>");
        ha.push("    <div class=\"row padd-t15\">");
        ha.push("      <div class=\"small-4 columns az-text-center az-padding0\">");
        ha.push("        <p class=\"col-9 fz-15\">分店人数</p>");
        ha.push("        <p class=\"col-3 fz-15\">" + entry.personcount + "</p>");
        ha.push("      </div>");
        ha.push("      <div class=\"small-4 columns az-text-center az-padding0\">");
        ha.push("        <p class=\"col-9 fz-15\">累计推荐(人)</p>");
        ha.push("        <p class=\"col-3 fz-15\">" + entry.totalinvest + "</p>");
        ha.push("      </div>");
        ha.push("      <div class=\"small-4 columns az-text-center az-padding0\">");
        ha.push("        <p class=\"col-9 fz-15\">累计收益(元)</p>");
        ha.push("        <p class=\"col-3 fz-15 col-e60012\">" + entry.totalprofit + "</p>");
        ha.push("      </div>");
        ha.push("    </div>");
        ha.push("  </article>");
    });
    return ha.join("");
};
//打开编辑分店页
var EditBranch = function (branchid, status) {
    if (status == "7" || status == "8") {
        window.location.replace("branch-info.html?bid=" + branchid + "");
    } else {
        window.location.replace("edit-branch.html?bid=" + branchid + "");
    }
}
//新增分店
var addBranch = function () {
    window.location.replace("addbranch.html");
}