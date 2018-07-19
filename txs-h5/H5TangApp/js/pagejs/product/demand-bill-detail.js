$(function () {
    var color, sign;
    var title = $.getQueryStringByName("title") || "";
    var amount = $.getQueryStringByName("amount") || "";
    var detail = $.getQueryStringByName("detail") || "";
    var time = $.getQueryStringByName("time");
    var balance = $.getQueryStringByName("balance") || "";
    var id = $.getQueryStringByName("id");
    var remark = $.getQueryStringByName("remark") || "";
    remark = decodeURIComponent(remark);
    detail = decodeURIComponent(detail);
    time = decodeURIComponent(time);
    amount = decodeURIComponent(amount);
    title = decodeURIComponent(title);
    balance = decodeURIComponent(balance);

    switch (title) {
        case "预约冻结":
            sign = '<span class="wxicon dj-icon"></span>'; color = "gray";
            break;
        case "投资冻结":
            sign = '<span class="wxicon dj-icon"></span>'; color = "gray";
            break;
        case "投资解冻":
            sign = '<span class="wxicon dj-icon1"></span>'; color = "gray";
            break;
        case "收益":
            sign = "+"; color = "red";
            break;
        case "投资":
            sign = '+'; color = "red";
            break;
        case "赎回":
            sign = '-'; color = "green";
            break;
    }

    document.title = title;
    if (remark.length > 0) { $("#remark").text(remark).parent().show(); }
    $("#amount").html(sign + amount).addClass(color);
    $("#detail").html(decodeURIComponent(detail));
    $("#time").html(decodeURIComponent(time));
    $("#balance").html(balance);
    $("#id").html(id);


});