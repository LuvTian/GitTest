var txt = [],
    wtxt = [],
    datalist = [],
    invot_money = "";
var apptype = $.getQueryStringByName('type');
$(function () {
    //  $(".JS_up").click(function () {
    //                 $(".mask").show();
    //                 $(".up_win").addClass("up_scale");
    //  })

    //我要投资按钮的跳转
    $(".JS_invote").click(function () {
        if (apptype == 'ios') {
            PhoneMode.jumpAppWithString({
                'controller': 'InvestmentViewController'
            });
        } else if (apptype == 'android') {
            //window.PhoneMode.callShare(JSON.stringify(jsondata));
            window.PhoneMode.callToPage("MainActivity", "licai");
        } else {
            window.location.href = "/html/product/index.html";
        }
    })
    var id = $.getCookie("userid");
    //var apiUrl_prefix = "http://192.168.90.182:8090";
    //会员说明接口
    $.AkmiiAjaxPost(apiUrl_prefix + "/vipcenter/members/introduce", {
        id: id
    }, true).then(function (data) {
        if (data.code == 200) {
            var current_contr = data.data.currentContribution; //当前贡献值
            var levelcontr_list = data.data.levelContributionIntervals;
            var level = data.data.currentLevelId;
            var desc = data.data.vipRule;
            var descArray = desc.split('\n');
            var listDesc = descArray.map(function (item, index) {
                return '<p>' + item + '</p>';
            })
            $(".content_desc").html(listDesc);
            levelcontr_list.sort(function (a, b) {
                return a.id - b.id
            });
            for (var i = 0; i < levelcontr_list.length; i++) {
                txt.push(levelcontr_list[i].contributionValueStart);
                wtxt.push(levelcontr_list[i].levelName);
                datalist.push(levelcontr_list[i].contributionValueStart);
            }
            //如果当期等级是铂金则显示的是我要投资按钮
            if (level == 4) {
                $(".JS_up").hide();
                $(".JS_my_invest").show();
            } else {
                $(".JS_up").show();
                $(".JS_my_invest").hide();
            }
            //如果升级弹框显示关闭
            $(".JS_up").click(function () {
                $(".mask").show();
                $(".up_win").addClass("up_scale");
                var up_array = [];
                if (level == 0) {
                    money1 = levelcontr_list[1].contributionValueStart - current_contr;
                    money2 = levelcontr_list[2].contributionValueStart - current_contr;
                    money3 = levelcontr_list[3].contributionValueStart - current_contr;
                    money4 = levelcontr_list[4].contributionValueStart - current_contr;
                    up_array.push('<li>升级至青铜会员还需出借：<span class="up_money">' + money1 + '</span>元</li>');
                    up_array.push('<li>升级至白银会员还需出借：<span class="up_money">' + money2 + '</span>元</li>');
                    up_array.push('<li>升级至黄金会员还需出借：<span class="up_money">' + money3 + '</span>元</li>');
                    up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                } else if (level == 1) {
                    money2 = levelcontr_list[2].contributionValueStart - current_contr;
                    money3 = levelcontr_list[3].contributionValueStart - current_contr;
                    money4 = levelcontr_list[4].contributionValueStart - current_contr;
                    up_array.push('<li>升级至白银会员还需出借：<span class="up_money">' + money2 + '</span>元</li>');
                    up_array.push('<li>升级至黄金会员还需出借：<span class="up_money">' + money3 + '</span>元</li>');
                    up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                } else if (level == 2) {
                    money3 = levelcontr_list[3].contributionValueStart - current_contr;
                    money4 = levelcontr_list[4].contributionValueStart - current_contr;
                    up_array.push('<li>升级至黄金会员还需出借：<span class="up_money">' + money3 + '</span>元</li>');
                    up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                } else if (level == 3) {
                    money4 = levelcontr_list[4].contributionValueStart - current_contr;
                    up_array.push('<li>升级至铂金会员还需出借：<span class="up_money">' + money4 + '</span>元</li>');
                }
                var html = $(up_array.join(""));
                $(".up_content").append(html);
            });
            $(".JS_close").click(function () {
                $(".mask").hide();
                $(".up_win").removeClass("up_scale");
                $(".up_content").html('');
            });
            drawForm(level, txt, wtxt, datalist, current_contr);
        } else {

        }
    })
})
//drawForm(4, [0, 10, 3000, 50000, 150000], ["普通会员", "青铜", "白银", "黄金", "铂金"], [0, 10, 3000, 50000, 150000], 160000);
function drawForm(level, txt, wtxt, datalist, invot_money) {
    //var datalist = [0,100,10000,50000,150000];
    // 获取上下文
    var a_canvas = document.getElementById('canvas');
    var context = a_canvas.getContext("2d");
    a_canvas.width = "600";
    a_canvas.height = "300";
    // 绘制背景
    var gradient = context.createLinearGradient(0, 0, 0, 300);
    //   gradient.addColorStop(0,"#e0e0e0");
    //   gradient.addColorStop(1,"#ffffff");
    context.fillStyle = gradient;
    context.fillRect(0, 0, a_canvas.width, a_canvas.height);

    // 描绘边框
    var grid_cols = datalist.length - 1;
    var grid_rows = 3;
    var canvasY = a_canvas.height - 25;
    var canvasX = a_canvas.width - 50;
    var cell_height = canvasY / grid_rows;
    var cell_width = canvasX / 5;
    // var invot_money=40000;//当前用户投资的钱
    var k = 5;
    context.lineWidth = 1;
    context.strokeStyle = "#F2F2F2";
    context.beginPath();
    // 准备画横线
    for (var col = 0; col <= 4; col++) {
        var x = col * cell_width;
        if (x <= 0) {
            x = k;
        }
        //console.log("aaaa" + x)
        context.moveTo(x, k);
        context.lineTo(x, canvasY);
    }
    // 准备画竖线
    for (var row = 0; row <= grid_rows; row++) {
        var y = row * cell_height;
        if (y <= 0) {
            y = k;
        }
        context.moveTo(k, y);
        context.lineTo(canvasX - 40, y);
    }
    context.lineWidth = 1;
    context.strokeStyle = "#F2F2F2";
    context.stroke();

    var max_v = 0;
    for (var i = 0; i < datalist.length; i++) {
        if (datalist[i] > max_v) {
            max_v = datalist[i]
        };
    }
    max_v = max_v * 1.5;
    // 将数据换算为坐标
    var points = [];
    for (var i = 0; i < datalist.length; i++) {
        var v = datalist[i];
        var px = (cell_width * 　i);
        if (px <= 0) {
            px = k;
        }
        // var py = a_canvas.height - a_canvas.height*(v / max_v);
        var h = a_canvas.height * (v / max_v);
        var py = (canvasY - h);
        points.push({
            "x": px,
            "y": py
        });
    }
    // 绘制折现
    context.beginPath();
    context.moveTo(k, canvasY);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.lineWidth = 1;
    context.strokeStyle = "#ee0000";
    context.stroke();
    context.closePath();
    //绘制坐标图形
    for (var i in points) {
        var p = points[i];
        context.beginPath();
        context.arc(p.x, p.y, 2.5, 0, 2 * Math.PI, false);
        context.linewidth = 1;
        context.fillStyle = "#fff";
        context.fill();
        context.strokeStyle = "#ee0000";
        context.stroke();
        context.closePath();
    }
    //绘制折线上点值，横坐标
    //折线上的点值 
    // var txt=["0","100","1万","5万","15万"] 
    for (var j = 0; j < txt.length; j++) {
        var t = points[j];
        if(txt[j]==invot_money){
            txt[j]='';
        }
        if (txt[j] >= 10000) {
            txt[j] = txt[j] / 10000 + "万";
        }
        context.beginPath();
        context.font = "18px  微软雅黑, sans-serif";
        context.fillStyle = "#666";
        context.fillText(txt[j], (t.x - 5), (t.y - 15));
    }
    //折线横坐标
    //var wtxt=["普通","青铜","白银","黄金","铂金"];
    for (var i = 0; i < wtxt.length; i++) {
        var w = points[i];
        context.font = "18px  微软雅黑, sans-serif";
        context.fillText(wtxt[i], (w.x - 5), canvasY + 21);
    }
    //invot_money=2300;
    var x0 = 0; //X轴的坐标
    if (level == 0) {
        x0 = cell_width * level + cell_width * ((invot_money - 0) / (datalist[level] - 0));
    } else {
        x0 = cell_width * level + cell_width * ((invot_money - datalist[level]) / (datalist[level + 1] - datalist[level]));
        // if (invot_money >= datalist[level]) {
        //     x0 = cell_width * level + cell_width * ((invot_money - datalist[level]) / (datalist[level + 1] - datalist[level]));
        // } else {
        //     x0 = cell_width * level + cell_width * ((invot_money - datalist[level - 1]) / (datalist[level] - datalist[level - 1]));
        // }

        //[0, 1, 220, 1100, 2201]

        if (x0 > 600) {
            x0 = 500;
        }
    }

    var result1;
    var result2;
    //console.log(datalist);
    for (var i = 0; i < datalist.length; i++) {
        if (invot_money >= datalist[i]) {
            result1 = datalist[i];
            result2 = datalist[i + 1];
            var points1 = points[i];
            var points2 = points[i + 1];
            continue;
        }
    }
    //console.log(result1, result2);

    // for(var k=0;k<datalist.length;k++){
    //     if(invot_money>datalist[i]&&invot_money<=datalist[i+1]){
    //         x0=cell_width*i+cell_width*((invot_money-datalist[i])/(datalist[i+1]-datalist[i]));
    //     }
    // if(invot_money>0&&invot_money<=100){
    //     x0=cell_width*0+cell_width*(invot_money/100);
    // }else if(invot_money>100&&invot_money<=10000){
    //     x0=cell_width*1+cell_width*((invot_money-100)/(10000-100));
    // }else if(invot_money>10000&&invot_money<=50000){
    //     x0=cell_width*2+cell_width*((invot_money-10000)/(50000-10000));
    // }else if(invot_money>50000&&invot_money<=150000){
    //     x0=cell_width*3+cell_width*((invot_money-50000)/(150000-50000));
    // }else if(invot_money>150000){
    //     x0=cell_width*3+cell_width*(invot_money/150000);
    // }
    //}
    var max_value = datalist[datalist.length - 1];
    if (invot_money > max_value) {
        max_value = invot_money;
    }
    var h = a_canvas.height * (invot_money / max_value);
    var y0 = (canvasY - h); //y轴的坐标
    //console.log(y0);
    //没有超出铂金的投资额显示的线条     
    if (level < 4) {

        //画进度条横线
        context.beginPath();
        context.moveTo(k, canvasY);
        context.lineTo(x0, canvasY);
        context.lineWidth = 1;
        context.strokeStyle = "#999";
        context.stroke();
        context.closePath();
        //画进度条竖线
        context.beginPath();
        context.moveTo(x0, canvasY);
        context.lineTo(x0, 50);
        context.lineWidth = 1;
        context.strokeStyle = "#FF7A04 ";
        context.stroke();
        context.closePath();
        //两实线交叉点

        var _y = points1.y - (points1.y - points2.y) * (invot_money - result1) / (result2 - result1) + 1;

        //console.log(points[3].y + "          1    " + _y, points[2].y - points[3].y, points[2].y)

        context.beginPath();
        context.arc(x0, _y, 3, 0, 2 * Math.PI, false);
        context.linewidth = 1;
        context.fillStyle = "#FF7A04";
        context.fill();
        context.closePath();
        //竖进度条上的文字
        context.font = "18px  微软雅黑, sans-serif";
        context.fillStyle = "#FF7A04";
        var str = invot_money.toString();
        var current_money = str.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
        context.fillText("昨日在投金额:" + current_money, (x0 - 50), 30);
    } else {
        //超出铂金的投资额显示的线条
        //画进度条横线
        context.beginPath();
        context.moveTo(k, canvasY);
        if (invot_money == 150000) {
            context.lineTo(440, canvasY);
        } else {
            context.lineTo(480, canvasY);
        }

        context.lineWidth = 1;
        context.strokeStyle = "#999";
        context.stroke();
        context.closePath();
        //两虚线交叉点
        context.beginPath();
        //  var h=a_canvas.height*(100000 / max_v);console.log(h+"xxxxx"+max_v);
        // var y1 = (canvasY - h)+37;
        if (invot_money == 150000) {
            context.arc(440, 76, 3, 0, 2 * Math.PI, false);
        } else {
            context.arc(480, 50, 3, 0, 2 * Math.PI, false);
        }

        context.linewidth = 1;
        context.fillStyle = "#FF7A04";
        context.fill();
        //context.stroke();
        context.closePath();
        //竖进度条上的文字
        context.font = "18px  微软雅黑, sans-serif";
        context.fillStyle = "#FF7A04";
        //var current_money = invot_money / 10000+"万";
        var str = invot_money.toString();
        var current_money =str.split('').reverse().join('').replace(/(\d{3})/g,'$1,').replace(/\,$/,'').split('').reverse().join('');
        var leftX=invot_money.toString().length*9+17*7;
        context.fillText("昨日在投金额：" + current_money, canvasX-leftX, 30);
        if (invot_money == 150000) {
            drawScreen2(440, canvasY); //投资额超过铂金的竖直虚线
        } else {
            drawScreen2(480, canvasY); //投资额超过铂金的竖直虚线
        }

    }

    drawScreen(px, py); //折线的虚线
    function drawScreen(x, y) {
        context.beginPath();
        context.setLineDash([3, 5]);
        context.lineWidth = 1;
        context.strokeStyle = '#f36';
        context.beginPath();
        context.moveTo(x + 5, y - 1.5);
        context.lineTo(canvasX - 40, 30);
        context.stroke();
        context.closePath();
    }

    function drawScreen2(x, y) {
        context.beginPath();
        context.setLineDash([3, 5]);
        context.lineWidth = 1;
        context.strokeStyle = '#f36';
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, 30);
        context.stroke();
        context.closePath();
    }
};