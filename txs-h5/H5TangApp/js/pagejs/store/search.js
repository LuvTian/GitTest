/// <reference path="../../_references.js" />
"use strict"
$(document).foundation();

//jquery对象元素
var $hotHistory = $("#hot-history");
var $searchInput = $("#search-input");
var $searchReault = $("#search-reault");
var $clearKeyword = $(".clear-keyword");
var $searchForm = $("#search");
var $cancelSearch = $("#cancel-search");
var $historyArticle = $("#search-history-article");
var $historyKeyList = $historyArticle.find(".keyword-content");
var $hotArticle = $("#search-hot-article");
var $hotArticleList = $("#search-hot-article").find(".keyword-content");
var $clearHistory = $("#clear-history");
var $globalMask = $(".global-mask");
var $categoriesBig = $(".c-big");
var $categoriesSmall = $(".categories-small");
var $reaultList = $(".search-reault-list");
var $loadmore = $("#loadmore");
var $noSearch = $(".no-search");
var $reaultNoData = $(".reault-no-data");
var $categoriesTitle = $(".categories-title");
var $currentOrderby = $("#current-orderby");
var $currentCate = $("#current-cate");
var $menuActiveStatus = $(".categories-content,.ctc");
var $searchContent = $(".search-content");
var header = $(".search-header");
var body = $("body")

//reset form
$searchForm[0].reset();

//history search key
var STORE_HISTORY_SEARCH_KEY = "STORE_HISTORY_SEARCH_KEY";
var historyKeyArr = [];
var historyKeyArrDecode = [];
var localData = $.getLS(STORE_HISTORY_SEARCH_KEY);

//query param
var categoryBigId;
var categoryId;
var orderby = 1;
var longitude = $.getQueryStringByName("longitude") || 0;
var latitude = $.getQueryStringByName("latitude") || 0;
var isSearch = $.getQueryStringByName("search") || false;
var key = $.getQueryStringByName("key") || "";
var searchUrl = "/StoreServices.svc/couponactivity/getactivityinfolistbyintelligentsorting";
var categoryUrl = "/StoreServices.svc/system/getmadisondictionarylistbypcodeorpid";

//page data 
var pageindex = 1;
var pagesize = 15;
var pagenumber = 0;

//public
var noMore = false;
var datalist = [];
var $document = $(document);
var $window = $(window);
//need empty walfare html list
var needEmpty = false;
var scrollLoadMore;
var keyWord = "";
var resetPage;
var firstEnter = true;
var isLoading = false;

//menu category
var categoryParam;
var categoryData = {};
var menuArr = [];
var item;

(function ($) {

    /*重置页面*/
    resetPage = function () {
        $globalMask.hide();
        $categoriesTitle.addClass("display-none");
        $menuActiveStatus.removeClass('active');
        $hotHistory.removeClass('display-none');
        $searchReault.addClass("display-none");
        $noSearch.hide();
    }

    /*清除文本框*/
    $clearKeyword.click(function () {
        $searchInput.val('').focus();
        $(this).hide();
        return false;
    });

    /*搜索框keyup事件*/
    $searchInput.on('keyup', function () {
        if ($searchInput.val()) {
            $clearKeyword.show();
        }
        else {
            $clearKeyword.hide();
        }
    });

    /*搜索框click事件*/
    $searchInput.on('click', function () {
        if ($searchInput.val()) {
            $clearKeyword.show();
        }
        showSearchInit();
    });

    /*提交表单*/
    $searchForm.submit(function (event) {
        event.preventDefault();
        categoryId = "";//重置分类
        var _key = $.FilterXSS($searchInput.val().trim());
        if (!_key) {
            $.alertNew("请输入关键词");
            return false;
        }
        //save history search key in local
        var encode = _key;
        encode = encodeURIComponent(encode);
        var _index = historyKeyArr.indexOf(encode);
        if (_index === -1) {
            if (historyKeyArr.length >= 6) {
                $historyKeyList.children().last().remove();
                historyKeyArr.pop();
            }
            historyKeyArr.unshift(encode);
            $.setLS(STORE_HISTORY_SEARCH_KEY, historyKeyArr.join(','));
            $historyArticle.show();
            $historyKeyList.prepend('<a href="javascript:;" data-key=' + encode + '>' + $.Cutstring2(decodeURIComponent(_key), 9) + '</a>');
        }
        else {
            if (_index != 0) {
                //删除重新添加，重新排序
                historyKeyArr.splice(_index, 1);
                $historyKeyList.children().eq(_index).remove();
                historyKeyArr.unshift(encode);
                $.setLS(STORE_HISTORY_SEARCH_KEY, historyKeyArr.join(','));
                $historyArticle.show();
                $historyKeyList.prepend('<a href="javascript:;" data-key=' + encode + '>' + $.Cutstring2(decodeURIComponent(_key), 9) + '</a>');
            }
        }
        needEmpty = true;
        $hotHistory.addClass("display-none");
        var reg = /(key=)([^&?]*)/ig;
        if ((location.href).match(reg)) {
            window.location.replace((location.href).replace(reg, '$1' + encode));
        }
        else {
            window.location.replace(location.href + "&key=" + encode);
        }
        //sendSearch();
    });

    /*取消按钮*/
    $cancelSearch.click(function () {
        //$reaultList
        if ($hotHistory.hasClass('display-none')) {
            window.history.back();
        }
        else {
            if ($reaultList.html().trim()) {
                hideSearchInit();
            }
            else {
                window.history.back();
            }
        }
        return;
    });

    /*清除搜索历史记录*/
    $clearHistory.click(function () {
        historyKeyArr = [];
        historyKeyArrDecode = [];
        $.removeLS(STORE_HISTORY_SEARCH_KEY);
        $historyArticle.addClass("display-none").find(".keyword-content").html("");
    });

    /*关闭筛选菜单*/
    $(document).on("click", ".ctc.active a,.global-mask", function () {
        $globalMask.hide();
        $menuActiveStatus.removeClass('active');
    });

    /*点击菜单显示遮罩*/
    $categoriesTitle.find("a").not(".active").click(function () {
        $globalMask.show();
    });

    /*点击热门/历史关键词触发表单提交*/
    $(document).on("click", ".keyword-content a", function () {
        $searchInput.val(decodeURIComponent($(this).data("key")));
        $searchForm.submit();
    });

    /*
      *获取菜单分类
      *param.code=Industry:一级分类
      *param.prentid:父级ID
      *parentText:点击二级分类"全部"选项,当前所选分类应该为父级名称
      *二级分类可以避免重复请求
    */
    var getCategory = function (param, parentText) {
        var _key = param.code || param.prentid;
        if (!categoryData["categories_" + _key]) {
            categoryParam = param;
            $.AkmiiAjaxPost(categoryUrl, categoryParam, true).then(function (d) {
                if (d.result) {
                    var list = d.madisondictionarylist;
                    categoryFactory(param, list, parentText);
                }
            });
        }
        else {
            if (param.code) {
                $categoriesBig.append(categoryData["categories_" + _key]);
            }
            else {
                $categoriesSmall.empty().append(categoryData["categories_" + _key]).show();
            }
        }
    }

    /*菜单分类处理工厂*/
    var categoryFactory = function (param, list, parentText) {
        menuArr = [];
        if (param.code) {
            // 一级分类页面加载时获取
            menuArr.push('<p class="bb categories-big-all"><span class="wxicon icon-allkinds"></span>全部分类</p>');
            $.each(list, function (index, element) {
                item = ('<p class="bb " data-id=' + element.id + '><span class="wxicon ' + $.GetIconByCategory(element.id) + '"></span>' + element.text + '</p>');
                menuArr.push(item);
            });
            $categoriesBig.append(menuArr.join(''));
        }
        else {
            // 二级分类点击时获取
            menuArr.push('<p class="bb categories-small-all" data-id=' + param.prentid + ' data-parent=' + parentText + '>全部</p>');
            $.each(list, function (index, element) {
                item = ('<p class="bb " data-id=' + element.id + '>' + element.text + '</p>');
                menuArr.push(item);
            });
            categoryData["categories_" + param.prentid] = menuArr.join('');
            $categoriesSmall.empty().append(categoryData["categories_" + param.prentid]).show().animate({ scrollTop: 0 }, 100);;
        }
    }

    /*点击一级菜单事件*/
    $(document).on("click", '.c-big p', function () {
        var $this = $(this);
        $this.siblings().removeClass('cb-active').end().addClass('cb-active');
        if ($this.hasClass('categories-big-all')) {
            $currentCate.html($this.text());
            $categoriesSmall.hide();
            categoryId = "";
            needEmpty = true;
            if (isSearch) {
                var _key = $.FilterXSS($searchInput.val().trim());
                if (!_key) {
                    $.alertNew("请输入关键词");
                    return false;
                }
            }
            sendSearch({ "code": "Industry" });
        }
        else {
            getCategory({ "prentid": $this.data("id") }, $this.text());
        }
    });

    /*点击二级菜单事件*/
    $(document).on("click", '.categories-small p', function () {
        var $this = $(this);
        $this.siblings().removeClass('cs-active').end().addClass('cs-active');
        categoryId = $this.data("id");
        needEmpty = true;
        $globalMask.hide();
        $menuActiveStatus.removeClass('active');
        $currentCate.html($this.data("parent") || $this.html());
        var _key = $.FilterXSS($searchInput.val().trim());
        if (isSearch) {
            var _key = $.FilterXSS($searchInput.val().trim());
            if (!_key) {
                $.alertNew("请输入关键词");
                return false;
            }
        }
        sendSearch({ "prentid": categoryId });
    });

    /*距离/人气筛选*/
    $(".c-orderby p").click(function () {
        var _this = $(this);
        $currentOrderby.html(_this.html());
        orderby = _this.data("type");
        _this.addClass("cb-active").siblings().removeClass('cb-active');
        needEmpty = true;
        var _key = $.FilterXSS($searchInput.val().trim());
        if (isSearch) {
            var _key = $.FilterXSS($searchInput.val().trim());
            if (!_key) {
                $.alertNew("请输入关键词");
                return false;
            }
        }
        sendSearch();
    });

    /*搜索事件*/
    var sendSearch = function () {
        $.getLocationCity(getData, longitude, latitude);
    };

    /*搜索开始请求*/
    var getData = function (cityInfo) {
        keyWord = $.FilterXSS($searchInput.val().trim());
        isLoading = true;
        var data = {
            "keyword": keyWord,
            "orderby": orderby,
            "category": categoryId,
            "longitude": longitude,
            "latitude": latitude,
            "pageindex": pageindex,
            "pagesize": pagesize,
            "region": cityInfo.citycode
        };
        $.AkmiiAjaxPost(searchUrl, data).then(function (d) {
            if (d.result) {
                if ($searchInput.val()) {
                    $clearKeyword.show();
                }
                isLoading = false;
                $noSearch.hide();
                $reaultNoData.show();
                $loadmore.show().html("上拉加载更多");
                $categoriesTitle.removeClass('display-none');
                $searchReault.removeClass("display-none");
                $searchInput.blur();
                $hotHistory.addClass('display-none');
                $globalMask.hide();
                $menuActiveStatus.removeClass('active');
                if (needEmpty) {
                    noMore = false;
                    datalist = [];
                    $reaultList.empty();
                }
                pagenumber = Math.ceil(d.pagecount / pagesize);
                if (pagenumber == pageindex) {
                    noMore = true;
                    $loadmore.html("没有更多数据").attr("disabled", true);
                }
                var list = d.nearestlist;
                if (list.length <= 0) {
                    if (isSearch) {
                        //搜索没有结果，不显示筛选
                        $categoriesTitle.addClass('display-none');
                    }
                    noMore = true;
                    if (needEmpty) {
                        $noSearch.show();
                        $loadmore.hide();
                        return;
                    }
                }
                var result = searchResult(list);
                $reaultList.append(result);
                $._imgLoad($(".search-reault-list").find("img"), function (img) {
                    $(img).attr("src", $(img).attr("data-src"));
                });
            }
        }, function () {
            isLoading = false;
        });
    }

    /*热门搜索*/
    var getHotSearch = function () {
        try {
            $.getLocationCity(function (cityInfo) {
                var data = {
                    "region": cityInfo.citycode
                };
                $.AkmiiAjaxPost("/StoreServices.svc/couponactivity/activityhotsearchkeyword", data).then(function (d) {
                    if (d.result) {
                        var list = d.hotwordlist;
                        if (list.length > 0) {
                            $hotArticle.show();
                        }
                        var _hotArr = [];
                        list.map(function (item, index) {
                            _hotArr.push('<a href="javascript:;" data-key=' + item.KeyWord + '>' + item.KeyWord + '</a>');
                        });
                        $hotArticleList.append(_hotArr.join(''));
                    }
                }, function () { })
            }, longitude, latitude);
        }
        catch (e) {
        }
    }

    /*拼接搜索结果*/
    var searchResult = function (list) {
        var _array = [];
        var mapResult = list.map(function (element, index) {
            _array = [];
            if (datalist.indexOf(element.storeid) < 0) {
                datalist.push(element.storeid);
                _array.push('<a href="/html/Store/rock.html?storeid=' + element.storeid + '&activitytype=2&longitude=' + longitude + '&latitude=' + latitude + '" class="shop-list bb bg-white">');
                _array.push('<img data-src="' + element.couponimagesmall + '" src="'+$.resurl()+'/css/img2.0/imgload.gif" alt="" class="img-shop">');
                _array.push('<div class="shop-name oh">');
                _array.push('<div class="small-9 left text-overflow"><span class="wxicon ' + $.GetIconByCategory(element.storecategory) + '"></span> ' + (element.storename) + '</div>');
                _array.push('<div class="small-3 right text-right gray">' + $.ShopDistance(element.distance) + '</div>');
                _array.push('</div>');
                _array.push('<p class="tips oh">' + $.Cutstring(element.couponabstract, 14, "..") + '</p>');
                _array.push('<div class="gray oh">');
                _array.push('<div class="left">已出' + element.deliverycount + '件</div>');
                _array.push('<div class="right">共' + element.activitysum + '个福利<i class="wxicon icon-right-arrow"></i></div>');
                _array.push('</div>');
                _array.push('</a>');
                return _array.join('');
            }
            return ""
        });
        return mapResult
    }

    /*点击加载更多*/
    $loadmore.click(function () {
        if (!noMore) {
            $loadmore.attr("disabled", true).show();;
            pageindex = pageindex + 1;
            pageindex = pageindex > pagenumber ? (pagenumber <= 0 ? 1 : pagenumber) : pageindex;
            needEmpty = false;
            sendSearch();
        }
    });

    /*下拉加载更多*/
    scrollLoadMore = function () {
        if (!noMore && !isLoading && $hotHistory.is(":hidden")) {
            var headerH = header.outerHeight();
            var bodyH = body.outerHeight();
            var scrollOffset = $searchReault.offset().top;
            var content = $searchReault.outerHeight();
            var maxHeight = headerH + content;
            var scroll = headerH - (scrollOffset);

            if (maxHeight - scroll - bodyH < 5) {
                pageindex = pageindex + 1;
                pageindex = pageindex > pagenumber ? (pagenumber <= 0 ? 1 : pagenumber) : pageindex;
                needEmpty = false;
                sendSearch();
            }
        }
    }

    /*显示搜索框，页面初始化*/
    var showSearchInit = function () {
        $globalMask.hide();
        $categoriesTitle.addClass("display-none");
        $menuActiveStatus.removeClass('active');
        $searchReault.addClass("display-none");
        $hotHistory.removeClass('display-none');
    }

    /*关闭搜索框，页面初始化*/
    var hideSearchInit = function () {
        $hotHistory.addClass('display-none');
        $searchReault.removeClass("display-none");
        if ($noSearch.is(":hidden")) {
            $categoriesTitle.removeClass("display-none");
        }
    }

    //页面初始化*************************
    if (isSearch) {
        if (localData) {
            historyKeyArr = $.getLS(STORE_HISTORY_SEARCH_KEY).split(',');
            var hlist = [];
            historyKeyArr.forEach(function (item, index) {
                hlist.push('<a href="javascript:;" data-key=' + item + '>' + $.Cutstring2(decodeURIComponent(item), 9) + '</a>');
            });
            $historyArticle.removeClass("display-none").find(".keyword-content").append(hlist.join(''));
        }
        getHotSearch();
        if (key) {
            $searchInput.val(decodeURIComponent(key));
            needEmpty = true;
            sendSearch();
        } else {
            resetPage();
        }
    }
    else {
        $searchContent.hide();
        sendSearch();
    }
    getCategory({ "code": "Industry" });
})(jQuery);

/*滚动监听*/
$("section > .viewport").scroll(scrollLoadMore);
