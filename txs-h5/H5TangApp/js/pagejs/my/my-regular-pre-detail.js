var obj = {}
$(document).ready(function () {
    if (!$.CheckToken()) {
        $.alertF("未检测到登录信息", "", function () {
            history.back();
        });
        return;
    }
    //复制订单编号
    var clipboard = new Clipboard('.copy-dom');
    clipboard.on('success', function (e) {
        $(".toast").addClass("toast-active");
        setTimeout(function () {
            $(".toast").removeClass("toast-active");
        }, 1000);
        console.log(e.text);
    });
    clipboard.on('error', function (e) {
        $(".toast").addClass("toast-active").html("复制失败");
        setTimeout(function () {
            $(".toast").removeClass("toast-active");
        }, 1000);
    });

    //保留小数位数
    template.helper('toFixed', function (number, decimal) {
        return $.fmoney(number);
    });
    template.helper('dataFormat', function (date, formatStr) {
        return (new Date(date.replace(/-/g, '/'))).Format(formatStr);
    });
    var bidid = $.getQueryStringByName("id");

    var bidurl = "/StoreServices.svc/product/bid";
    $.AkmiiAjaxPost(bidurl, {
            productbidid: bidid
        },
        false).then(function (data) {
        if (data.result) {
            //测试数据---------------------------------------------
            //data.productbid.status=8;
            //data.productbid.reservationbidstatus=2;
            //data.productbid.holdingsdays=300;
            // data.productbid.isreservation=false;
            // data.productbid.biddate="2017-09-8"
            // data.productbid.holdingsdays=2;
            // data.productbid.startdate="2017-09-08"
            // data.productbid={
            //     "id": "909781015231467520",
            //     "name": null,
            //     "bidamount": 100,
            //     "remandamount": 0,
            //     "productrate": 0,
            //     "realbiddate": null,
            //     "biddate": "2017-09-10 00:00",
            //     "productid": "909703934153723904",
            //     "rate": -1,
            //     "rateactivite": 1,
            //     "duration": 60,
            //     "title": "金刚A.1036期",
            //     "publishdate": null,
            //     "status": 2,
            //     "statustext": "申请中",
            //     "guaranteetypetext": null,
            //     "interest": 0.06,
            //     "currentinterest": 5,
            //     "daysremaining": 0,
            //     "penalty": 0,
            //     "typetext": "到期还本付息",
            //     "lockduration": 0,
            //     "startdate": "2017-09-16",
            //     "enddate": "2017-09-25",
            //     "amount": 0,
            //     "nextrepayday": null,
            //     "canredeem": false,
            //     "nextopenredeemdate": null,
            //     "risklevel": 0,
            //     "riskleveltext": null,
            //     "riskleveldesc": null,
            //     "bidcount": 0,
            //     "isoldproduct": false,
            //     "totalamount": "0",
            //     "paymentdate": null,
            //     "calledawaybenefit": 0,
            //     "interestcouponid": null,
            //     "transferaccountid": 0,
            //     "interestrate": 0,
            //     "interestenddate": null,
            //     "intereststartdate": null,
            //     "nexttransfertime": "0001-01-01T00:00:00",
            //     "cantransfer": false,
            //     "remainingamount": 0,
            //     "remainingdays": 0,
            //     "remaininginterest": 2,
            //     "transferlockday": 0,
            //     "transferlockdaydescription": null,
            //     "haveinterest": 0,
            //     "maxtransferamount": 0,
            //     "mintransferamount": 0,
            //     "defaulttransferamount": null,
            //     "holdingsdays": "59",
            //     "exptimedays": null,
            //     "producttype": 2,
            //     "paytype": null,
            //     "displayprofittime": null,
            //     "transferday": null,
            //     "transferamount": null,
            //     "isentrust": false,
            //     "transfer": false,
            //     "profitstart": 0,
            //     "matchmode": 0,
            //     "ismatchmoderaisingdate": false,
            //     "assetrecordid": null,
            //     "publisher": null,
            //     "redeemtime": null,
            //     "saletype": null,
            //     "ladderfreewithdrawaltime": null,
            //     "laddersaleintroduce": null,
            //     "ladderwithdrawalrule": null,
            //     "ladderendrule": null,
            //     "productcreated": "0001-01-01T00:00:00",
            //     "isoldproductintroduction": true,
            //     "reservationbidstatus": "0",
            //     "repaytime": null,
            //     "reservationtime": "2017-09-18 22:07",
            //     "transfersuccesstime": null
            // }
            //测试数据结束----------------------------------

            var reservationbidstatus = data.productbid.reservationbidstatus;
            var inappoint = reservationbidstatus == 1; //判断产品目前是预约中
            var isappoint = reservationbidstatus == 2||reservationbidstatus == 1; //是否是预约产品
            var source = document.getElementById("mainBody-tpl").innerHTML;
            var render = template.compile(source);
            var html = render({
                bid: data.productbid,
                regular: data.regularproductdetail,
                extra: {
                    inappoint: inappoint,
                    isappoint:isappoint
                }
            });
            document.getElementById('mainBody').innerHTML = html;

            //产品持有进度条
            var total = data.productbid.duration,
                cur = Number(data.productbid.holdingsdays),
                per,
                status = data.productbid.status, //持有产品状态
                screen_width,
                tip_width,
                progress_width,
                cur_progress_position,
                cur_tip_position,
                max_tip_position,
                min_tip_position,
                extra_width,
                start_point,
                progress_tip_width = $(".progress-tip").width(),
                progress_tip_span_width = $(".progress-tip span").width(),
                screen_width = Math.min($(document).width(), 720),
                _now = new Date(data.date.replace(/-/g, '/')), //服务器当前时间
                _biddate = new Date(data.productbid.biddate.replace(/-/g, '/')), //预约产品投资成功时间
                _startdate = new Date(data.productbid.startdate.replace(/-/g, '/')), //预约产品起息时间
                _enddate = new Date(data.productbid.enddate.replace(/-/g, '/')) //产品到期时间

            extra_width = 15 / 375 * screen_width * 2;
            screen_width = screen_width - extra_width;
            per = cur / total;
            progress_width = screen_width;
            tip_width = progress_width * 0.66;
            cur_progress_position = per * progress_width; //当前进度条位置
            cur_tip_position = cur_progress_position - (tip_width / 2); //当前进度条提示文字位置
            if (isappoint) {
                //如果是预约产品,起息后，进度条提示文字起始位置是第二个点
                if ((_now.getTime() - _startdate.getTime()) >= 0) {
                    min_tip_position = (progress_width - progress_tip_width) / 2 + 2;
                }
            } else {
                min_tip_position = -(progress_tip_width - progress_tip_span_width) / 2 + 2;
            }
            //控制进度条上的关键点的颜色
            //如果是预约产品则显示中间的point
            if (isappoint) {
                $(".p2").removeClass("visib-hide");
                //投资成功、起息投资进度条的状态
                if ((_now.getTime() - _biddate.getTime()) >= 0) {
                    //大于投资时间第一个点亮
                    $(".p1").addClass("white");
                }
                if ((_now.getTime() - _startdate.getTime()) >= 0) {
                    //大于起息时间第二个点亮
                    cur_progress_position = progress_width / 2 + per * progress_width / 2; //当前进度条位置
                    cur_tip_position = cur_progress_position - (tip_width / 2); //当前进度条提示文字位置
                    $(".p2").addClass("white");
                }
            } else {
                //普通产品大于起息时间第一个点亮
                if ((_now.getTime() - _startdate.getTime()) >= 0) {
                    $(".p1").addClass("white");
                }
            }
            //服务器时间大于产品到期时间，显示第三个点
            if ((_now.getTime() - _enddate.getTime()) >= 0) {
                $(".p3").addClass("white");
            }

            //持有天数大于0显示进度提示
            if (cur > 0) {
                $(".progress-tip").removeClass("visib-hide");
            }
            if (per >= 0.5) {}
            if (per >= 1) {}

            max_tip_position = progress_width - progress_tip_span_width - ((progress_tip_width - progress_tip_span_width) / 2) - 2;
            cur_tip_position = Math.min(cur_tip_position, max_tip_position);
            cur_tip_position = Math.max(cur_tip_position, min_tip_position);
            $(".cur-progress").css("width", cur_progress_position + "px");
            $(".progress-tip").css("left", cur_tip_position + "px");
            //如果已转让,赎回中，已赎回，已还款等，直接全部显示所有point，进度条100%长度
            if (",3,4,5,6,8".indexOf("," + status) >= 0) { //需要删除2在投中
                if(isappoint){
                    $(".p2,.p3").removeClass("visib-hide").addClass("white");
                }else{
                    $(".p3").removeClass("visib-hide").addClass("white");
                }
                $(".cur-progress").css("width", "100%");
                $(".progress-tip").css("left", max_tip_position + "px");
            }
        } else {
            $.alertF(data.errormsg);
        }
    });
});