$.extend({
    weuiLoading: function (text) {
        $.hideWeuiLoading();
        var text = text || "加载中";
        var a = [];
        a.push('<div class="weui_loading_toast common-weui-loadingtoast">');
        a.push('<div class="weui_mask_transparent"></div>');
        a.push('<div class="weui_toast">');
        a.push('<div class="weui_loading">');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_0"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_1"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_2"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_3"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_4"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_5"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_6"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_7"></div>');
        a.push('<div class="weui_loading_leaf weui_loading_leaf_8"></div>');
        a.push('</div>');
        a.push('<p class="weui_toast_content">' + (text) + '</p>');
        a.push('</div>');
        a.push('</div>');
        $("body").append(a.join(''));
    },
    txsToastHandle: function (msg) {
        msg && msg.trim() && $("body").append('<div id="_com_txstoast_handle"><div class="txs_toast_container"><div class="toast_img"><img src="/css/img2.0/unionopening/toast-ok.png" /></div><span class="txs_toast_text">开户处理中</span></div><div class="mask mask_bg_transparent"></div></div>');
        setTimeout(function () {
            $("#_com_txstoast_handle").hide(200, function () {
                $(this).remove();
            })
        }, 1800);
    }
}
);
