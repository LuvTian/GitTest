
//店员管理(可能为企业的，也可能为分店的)
var index = 1;
var pageSize = 20;
var totalCount = 0;
$(function () {
    $("#btnDeleteClerk,#deleteClerk").unbind("click");
    bindList(index);
})

var bindList = function (index) {
    var url = "/StoreServices.svc/store/getclerklist";
    var param = {
        pageindex: index
    }
    $.AkmiiAjaxPost(url, param, false).then(function (data) {
        if (data.result) {
            var status = data.status;
            var listArry = data.clerklist;
            var userType = "1,2,3";
            if (index == 1) {
                totalCount = data.totalcouont;
            }
            if (userType.indexOf(data.usertype) < 0) {
                $.alertS("无访问权限", function () {
                    window.location.replace("/html/My/index.html");
                });
                return;
            }
            if (data.usertype == "3") {//如果为分店管理员
                if (status == 1) {//1 正常状态
                    $("#actionrow").show();
                } else {
                    $("#actionrow").remove();
                }
            } else {//如果为总店
                if (("1,4,5").indexOf(status) >= 0) {//1、4、5正常状态，7、8冻结中，6 管理员变更中
                    $("#actionrow").show();
                } else {
                    $("#actionrow").remove();
                }
            }
            if (listArry != null && listArry.length > 0) {
                var html = formatHtml(listArry, status, data.usertype);
                $("#listdata").append(html);
                var current = (index - 1 * pageSize) + 1;
                var listCount = $(".padd-tb1").length;
                if (listArry.length < pageSize||listCount==totalCount) {
                    //$.LoanMore($("#listdata"), "没有更多数据了");
                } else if (current < parseInt(totalCount)) {
                    index++;
                    $.LoanMore($("#listdata"), null, "bindList("+index+")");
                }
            } else if (totalCount <= 0) {
                $("#btnDeleteClerk").css("background-color", "lightgray").unbind("click");
                $("#listdata").append("<div style=\"color:red;font-size: 1.6rem;text-align: center;\">无店员，请添加</div>");
            }
        } else if (data.errorcode == "missAccountid") {
            $.alertS(data.errormsg, function () {
                window.location.replace("/html/anonymous/login.html");
            });
        } else {
            $.alertS(data.errormsg);
            return false;
        }
    })
};

var formatHtml = function (listArry,status,usetype) {
    var ha=[];
    $.each(listArry, function (index, entry) {
        ha.push("<div class=\"row bb padd-tb1 myrow\">");  
        ha.push("    <div name=\"ckIcon\" class=\"small-4 columns az-text-left az-padding0 col-9 fz-15\" onclick=\"ckUser(this)\">");
        var clerkName = entry.clerkname;
        if (clerkName == null) {
            clerkName = "<span style=\"color:red\">[未实名]</span>";
        }
        if (usetype == "3") {//如果为分店管理员
            if (status!=1) {//分店正常状态
                ha.push("     <span style=\"margin-left:10%\"> " + clerkName + "</span>");
            } else {
                ha.push("       <icon data-id=\"" + entry.clerkid + "\"  class=\"wechat icon-choose margin-r4x\"></icon>" + clerkName + "");
            }
        } else {
            if (("1,4,5").indexOf(status) < 0) {//1、4、5正常状态，7、8冻结中，6 管理员变更中
                ha.push("     <span style=\"margin-left:10%\"> " + clerkName + "</span>");
            } else {
                ha.push("       <icon data-id=\"" + entry.clerkid + "\"  class=\"wechat icon-choose margin-r4x\"></icon>" + clerkName + "");
            }
        }
        ha.push("    </div>");
        ha.push("    <div class=\"small-4 columns az-text-center az-padding0 col-9 fz-15\">"+entry.clerkphone+"</div>");
        ha.push("    <div class=\"small-4 columns az-text-right az-padding0 col-e60012 fz-15\">");
        ha.push("       "+entry.clerkseal+"");
        ha.push("    </div>");
        ha.push("    <p class=\"az-text-right fz-09 col-9\">添加日期：" + entry.createtime + "</p>");
        ha.push("</div>");
    });
    return ha.join("");
}

$("#addClerk").click(function () {
    window.location.replace("/html/store/addclerk.html");
});

var deleteUser = function () {
    var ids = "";
    if ($("icon").length == 0) {
        $.alertS("店员列表为空，不能删除");
        return;
    }
    $("icon").each(function () {
        if ($(this).hasClass("icon-choosed")) {
            ids += $(this).attr("data-id") + ",";
        }
    });
    ids = ids.substr(0, ids.length - 1);//移除最后一个逗号
    if (ids.length == 0) {
        $.alertS("请选择待删除的店员");
        return;
    }
    $.confirmF("您确定要删除吗？", "", "", null, function () {
        var url = "/StoreServices.svc/store/deleteclerk";
        var param = {
            clerkids: ids
        }
        $.AkmiiAjaxPost(url, param, false).then(function (data) {
            if (data.result) {
                $("#listdata").empty();
                bindList(1);
                $("#btnDeleteClerk").css("background-color", "lightgray").unbind("click");
                $.alertS("删除成功");
            } else if (data.errorcode == "missAccountid") {
                $.alertS(data.errormsg, function () {
                    $.Loginlink();
                });
            } else {
                $.alertS(data.errormsg);
                return false;
            }
        })
    });
}

var ckUser = function (obj) {
    var id = $(obj).find("icon").toggleClass('icon-choosed').attr("data-id");
    if ($(obj).find("icon").hasClass("icon-choosed"))
    {
        $("#btnDeleteClerk").css("background-color", "#cd3830").bind("click", function () {
            deleteUser();
        });
    }
    if (!$("#listdata icon").hasClass("icon-choosed"))
    {
        $("#btnDeleteClerk").css("background-color", "lightgray").unbind("click");
    }
}
//删除用户
var removeDelteUser = function (ids) {
    $.each($(".padd-tb1").find("icon"), function (index, entry) {
        var id = $(this).attr("data-id");
        if (ids.indexOf(id) > -1)
        {
            $(this).parents(".myrow").remove();
        }
    });
    var len = $(".padd-tb1").length;
    if (len <= pageSize)
    {

    }
}
