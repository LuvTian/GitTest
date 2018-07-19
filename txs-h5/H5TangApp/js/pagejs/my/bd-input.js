/// <reference path="../../vendor/jquery-2.2.0.js" />
/// <reference path="../../common.js" />

//add
var $add_storename = $("#add-storename");
var $add_storenum = $("#add-storenum");
var $add_storelegal = $("#add-storelegal");
var $add_storetel = $("#add-storetel");
var $add_storeaddress = $("#add-storeaddress");
var $add_submit_draft = $("#add-submit-draft");
var $add_submit = $("#add-submit");
//edit
var $edit_storename = $("#edit-storename");
var $edit_storenum = $("#edit-storenum");
var $edit_storelegal = $("#edit-storelegal");
var $edit_storetel = $("#edit-storetel");
var $edit_storeaddress = $("#edit-storeaddress");
var $edit_submit_draft = $("#edit-submit-draft");
var $edit_submit = $("#edit-submit");
var $approveopinion = $("#approveopinion");
//nav
var $bd_nav = $(".bd-nav");
//tag
var $bd_draft = $("#bd-draft");
var $bd_auditing = $("#bd-auditing");
var $bd_edit = $(".bd-edit");
var $bd_inpit_wrap = $(".bd-inpit-wrap");
var $bd_edit_input = $("#bd-edit-input");
//menu
var $nav_bd_draft = $("#nav-bd-draft a");
var $nav_bd_auditing = $("#nav-bd-auditing a");
var query;

var id = "", approveopinion = "", date = "";;
var $close = $(".close");
$(function () {

    /*点击菜单*/
    $bd_nav.find("a").click(function () {
        var targetid = $(this).data("target");
        var target = $("#" + targetid);
        if (target != "bd-new-input") {
            if (target.find(".bd-line").length == 0) {
                query(targetid, 0);
            }
        }
        target.siblings().hide();
        target.show();
    });

    /*添加草稿*/
    $add_submit_draft.click(function () {
        var add_storename = $.FilterXSS($add_storename.val());
        var add_storenum = $.FilterXSS($add_storenum.val());
        var add_storelegal = $.FilterXSS($add_storelegal.val());
        var add_storetel = $.FilterXSS($add_storetel.val());
        var add_storeaddress = $.FilterXSS($add_storeaddress.val());
        if (!add_storename) {
            $.alertNew("商户名称不正确");
            return;
        }
        var param = {
            address: add_storeaddress,
            businesslicensenumber: add_storenum,
            phone: add_storetel,
            name: add_storename,
            legalrepresentative: add_storelegal,
            status: 1,
            id: ""
        };
        $.AkmiiAjaxPost("/StoreServices.svc/store/bdinputstoreinfo", param).then(function (d) {
            if (d.result) {
                $.alert({ text: "已保存到草稿", icon: "icon-my-sigh-ok" });
                reset("add", $bd_draft);
            }
            else {
                $.alertNew(d.errormsg);
            }
        });
    });

    /*编辑草稿*/
    $edit_submit_draft.click(function () {
        var edit_storename = $.FilterXSS($edit_storename.val());
        var edit_storenum = $.FilterXSS($edit_storenum.val());
        var edit_storelegal = $.FilterXSS($edit_storelegal.val());
        var edit_storetel = $.FilterXSS($edit_storetel.val());
        var edit_storeaddress = $.FilterXSS($edit_storeaddress.val());
        if (!edit_storename) {
            $.alertNew("商户名称不正确");
            return;
        }
        if (!id) {
            $.alertNew("信息不正确,请检查");
            return;
        }
        var param = {
            address: edit_storeaddress,
            businesslicensenumber: edit_storenum,
            phone: edit_storetel,
            name: edit_storename,
            legalrepresentative: edit_storelegal,
            approveopinion: approveopinion,
            status: 1,
            id: id
        };
        $.AkmiiAjaxPost("/StoreServices.svc/store/bdinputstoreinfo", param).then(function (d) {
            if (d.result) {
                $.alert({ text: "已保存到草稿", icon: "icon-my-sigh-ok" });
                var item = {
                    Address: edit_storeaddress,
                    BusinessLicenseNumber: edit_storenum,
                    LegalRepresentative: edit_storelegal,
                    Name: edit_storename,
                    Phone: edit_storetel,
                    Status: 1
                };
                reset("edit", $bd_draft, item, id);
                $nav_bd_draft.click();
                history.back();
            }
            else {
                $.alertNew(d.errormsg);
            }
        });
    });

    /*提交审核*/
    $add_submit.click(function () {
        var storename = $.FilterXSS($add_storename.val());
        var storenum = $.FilterXSS($add_storenum.val());
        var storelegal = $.FilterXSS($add_storelegal.val());
        var storetel = $.FilterXSS($add_storetel.val());
        var storeaddress = $.FilterXSS($add_storeaddress.val());
        if (!storename) {
            $.alertNew("商户名称不正确");
            return;
        }
        if (!storetel) {
            $.alertNew("门店电话不正确");
            return;
        }
        if (!storeaddress) {
            $.alertNew("商户地址不正确");
            return;
        }
        var param = {
            address: storeaddress,
            businesslicensenumber: storenum,
            phone: storetel,
            name: storename,
            legalrepresentative: storelegal,
            status: 2,
            id: ""
        };
        $.AkmiiAjaxPost("/StoreServices.svc/store/bdinputstoreinfo", param).then(function (d) {
            if (d.result) {
                $.alertNew("已提交审核", "", "", "", "icon-my-sigh-ok");
                reset("add", $bd_auditing);
            }
            else {
                $.alertNew(d.errormsg);
            }
        });
    });

    /*编辑提交审核*/
    $edit_submit.click(function () {
        var storename = $.FilterXSS($edit_storename.val());
        var storenum = $.FilterXSS($edit_storenum.val());
        var storelegal = $.FilterXSS($edit_storelegal.val());
        var storetel = $.FilterXSS($edit_storetel.val());
        var storeaddress = $.FilterXSS($edit_storeaddress.val());

        if (!storename) {
            $.alertNew("商户名称不正确");
            return;
        }
        if (!storetel) {
            $.alertNew("门店电话不正确");
            return;
        }
        if (!storeaddress) {
            $.alertNew("商户地址不正确");
            return;
        }

        if (!id) {
            $.alertNew("信息不正确,请检查");
            return;
        }
        var param = {
            address: storeaddress,
            businesslicensenumber: storenum,
            phone: storetel,
            name: storename,
            legalrepresentative: storelegal,
            approveopinion: approveopinion,
            status: 2,
            id: id
        };
        $.AkmiiAjaxPost("/StoreServices.svc/store/bdinputstoreinfo", param).then(function (d) {
            if (d.result) {
                $.alert({ text: "已提交审核", icon: "icon-my-sigh-ok" });
                reset("edit", $bd_auditing, "", id);
                history.back();
            }
            else {
                $.alertNew(d.errormsg);
            }
        });
    });

    /*查询列表*/
    query = function (qtype, lastid) {
        var status;
        switch (qtype) {
            case "bd-draft":
                status = "1,4";
                break;
            case "bd-auditing":
                status = "2";
                break;
            case "bd-audit-pass":
                status = "3";
                break;
        }
        if (!status) {
            $.alertNew("查询异常,请稍后再试");
            return;
        }
        var param = {
            status: status,
            lastid: lastid
        };
        $.AkmiiAjaxPost("/StoreServices.svc/store/bdinputstoreinfolist", param).then(function (d) {
            if (d.result) {
                var list = d.list;
                var lastid = 0;
                var html = "";
                var result;
                var container = $("#" + qtype + " > div").eq(1);
                $.each(list, function (index, item) {
                    lastid = item.ID;
                    container.append(addLine(item));
                });
                if (list.length < 20) {
                    $.LoanMore($("#" + qtype + " > footer"), "没有更多数据", null);
                }
                else {
                    $.LoanMore($("#" + qtype + " > footer"), "", "query('" + qtype + "','" + lastid + "')");
                }

            }
            else {
                $.alertNew(d.errormsg);
            }
        });
    }

    /*行数据*/
    var addLine = function (item) {
        var arr = [];
        if (parseInt(item.Status) == 1 || parseInt(item.Status) == 4) {
            date = item.Created;
        }
        else {
            date = item.Modified;
        }
        arr.push('<div class="bg-white bd-line bb" id="line_' + item.ID + '" data-name="' + item.Name + '" data-phone="' + item.Phone + '" data-id="' + item.ID + '" data-address="' + item.Address + '" data-number="' + item.BusinessLicenseNumber + '" data-legal="' + item.LegalRepresentative + '" data-status="' + item.Status + '" data-approveopinion="' + item.ApproveOpinion + '" data-created="' + item.Created + '" data-modified="' + item.Modified + '">');
        arr.push('<div class="small-7 left text-left bd-input-title">' + item.Name + '</div>');
        arr.push('<div class="small-5 left text-right gray">' + date + '</div>');
        arr.push('</div>');
        result = $(arr.join(''));
        result.click(function () {
            setEditValue($(this));
        });
        return result;
    }

    /*
    重置
    功能:清空文本框，清空tab数据，移除行数据，替换行数据
    optype 操作类型add edit; targettab tab类型：草稿/审核, editeddata 行数据, id 行ID
    */
    var reset = function (optype, targettab, editeddata, id) {
        var emptytarget = {};
        if (targettab && targettab.length > 0 && targettab.children().eq(1).length > 0) {
            emptytarget = targettab.children().eq(1);
        }
        if (optype == "add") {
            $(".bd-new-input input").val("");
            if (emptytarget && emptytarget.length > 0) {
                emptytarget.empty();
            }
        }
        else {
            $(".bd-edit input").val("");
            if (targettab && targettab.length > 0 && targettab[0].id == "bd-draft") {
                var $line = $("#line_" + id);
                var _ID = $line.data("id");
                var _ApproveOpinion = $line.data("approveopinion");
                var _Created = $line.data("created");
                var _Modified = $line.data("modified");
                editeddata.ID = _ID;
                editeddata.ApproveOpinion = _ApproveOpinion;
                editeddata.Created = _Created;
                $("#line_" + id).replaceWith(addLine(editeddata));
            }
            else {
                $("#line_" + id).remove();
                if (emptytarget && emptytarget.length > 0) {
                    emptytarget.empty();
                }
            }
        }
    }

    /*编辑初始化*/
    var setEditValue = function (data) {
        reset("edit");
        $edit_storename.val(data.data("name"));
        $edit_storenum.val(data.data("number"));
        $edit_storelegal.val(data.data("legal"));
        $edit_storetel.val(data.data("phone"));
        $edit_storeaddress.val(data.data("address"));
        id = data.data("id");
        approveopinion = data.data("approveopinion");
        var status = data.data("status");
        if (status == 2 || status == 3) {
            $edit_storename.attr("disabled", "disabled");
            $edit_storenum.attr("disabled", "disabled");
            $edit_storelegal.attr("disabled", "disabled");
            $edit_storetel.attr("disabled", "disabled");
            $edit_storeaddress.attr("disabled", "disabled");
            $edit_submit_draft.hide();
            $edit_submit.hide();
            $bd_edit_input.find("aside").hide();
            $approveopinion.html("");
            if (approveopinion) {
                $bd_edit_input.find("aside").show();
                $approveopinion.html(approveopinion);
            }
        }
        else {
            $edit_storename.removeAttr("disabled");
            $edit_storenum.removeAttr("disabled");
            $edit_storelegal.removeAttr("disabled");
            $edit_storetel.removeAttr("disabled");
            $edit_storeaddress.removeAttr("disabled");
            $edit_submit_draft.show();
            $edit_submit.show();
            $bd_edit_input.find("aside").hide();
            $approveopinion.html("");
            if (approveopinion) {
                $bd_edit_input.find("aside").show();
                $approveopinion.html(approveopinion);
            }
        }
        $bd_edit.siblings().hide();
        $bd_edit.show();
        location.hash = "#bd-edit";
    }

    /*清空输入*/
    $close.click(function () {
        $close.prev("input").val("");
    });

    /*show tip*/
    $(".bd-inpit-wrap i.wxicon").click(function () {
        $(".bd-inpit-tip,.mask").show();
    });

    /*close tip*/
    $(".bd-inpit-tip i.wxicon").click(function () {
        $(".bd-inpit-tip,.mask").hide();
    });
});

window.onhashchange = function () {
    if (window.location.hash.length <= 0) {
        $bd_inpit_wrap.show();
        $bd_edit.hide();
    }
}