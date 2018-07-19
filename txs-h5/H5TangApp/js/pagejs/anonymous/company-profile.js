$(function() {
    //暂时设计每个slide大小需要一致
    barwidth = 17 //导航粉色条的长度px
    tSpeed = 300 //切换速度300ms
    var navSwiper = new Swiper('#nav', {
        slidesPerView: 'auto',
        freeMode: true,
        on: {
            init: function() {
                navSlideWidth = this.slides.eq(0).css('width'); //4个字时导航宽度
                // lastNavSlideWidth = this.slides.eq(this.slides.length - 1).css('width'); //6个字时导航宽度
                bar = this.$el.find('.bar'); //导航条容器
                bar.css('width', navSlideWidth);
                bar.transition(tSpeed);
                navSum = this.slides[this.slides.length - 1].offsetLeft //最后一个slide的位置
                clientWidth = parseInt(this.$wrapperEl.css('width')) //Nav的可视宽度
                navWidth = 0 // 导航总宽度
                for (i = 0; i < this.slides.length; i++) {
                    navWidth += parseInt(this.slides.eq(i).css('width'))
                }
                topBar = this.$el.parents('body').find('#top') //页头
            },
        },
    });

    var pageSwiper = new Swiper('#page', {
        watchSlidesProgress: true,
        resistanceRatio: 0,
        on: {
            touchMove: function() {
                progress = this.progress;
                bar.transition(0)
                bar.transform('translateX(' + navSum * progress + 'px)')
            },
            transitionStart: function() {
                activeIndex = this.activeIndex
                activeSlidePosition = navSwiper.slides[activeIndex].offsetLeft
                    //释放时导航粉色条移动过渡
                bar.transition(tSpeed)
                bar.transform('translateX(' + activeSlidePosition + 'px)')
                    //释放时文字变色过渡
                navSwiper.slides.eq(activeIndex).find('span').css('color', '#333').transition(tSpeed)
                if (activeIndex > 0) {
                    navSwiper.slides.eq(activeIndex - 1).find('span').css('color', '#999').transition(tSpeed);
                }
                if (activeIndex < this.slides.length) {
                    navSwiper.slides.eq(activeIndex + 1).find('span').css('color', '#999').transition(tSpeed);
                }
                //导航居中
                navActiveSlideLeft = navSwiper.slides[activeIndex].offsetLeft //activeSlide距左边的距离

                navSwiper.setTransition(tSpeed)
                if (navActiveSlideLeft < (clientWidth - parseInt(navSlideWidth)) / 2) {
                    navSwiper.setTranslate(0)
                } else if (navActiveSlideLeft > navWidth - (parseInt(navSlideWidth) + clientWidth) / 2) {
                    navSwiper.setTranslate(clientWidth - navWidth)
                } else {
                    navSwiper.setTranslate((clientWidth - parseInt(navSlideWidth)) / 2 - navActiveSlideLeft)
                }
            },
        }
    });
    navSwiper.$el.on('touchstart', function(e) {
        e.preventDefault() //去掉按压阴影
    })
    navSwiper.on('tap', function(e) {
        clickIndex = this.clickedIndex
        clickSlide = this.slides.eq(clickIndex)
        pageSwiper.slideTo(clickIndex, 0);
        this.slides.find('span').css('color', '#999');
        clickSlide.find('span').css('color', '#333');
    });
    //内容滚动	
    var scrollSwiper = new Swiper('.scroll', {
        slidesOffsetBefore: 0,
        direction: 'vertical',
        freeMode: true,
        slidesPerView: 'auto',
        mousewheel: {
            releaseOnEdges: true
        }
    });
    // 指定图表的配置项和数据
    // var educationPartData = {
    //     tooltip: {
    //         show: false,
    //         confine: true,
    //         trigger: 'item',
    //         formatter: "{a} <br/>{b}: {c}人 ({d}%)"
    //     },
    //     legend: {
    //         orient: 'horizontal',
    //         x: 'center',
    //         data: ['大专及以下', '本科', '硕士及以上'],
    //         bottom: 10,
    //         selectedMode: false,
    //         itemGap: 15
    //     },
    //     color: ['#06D1A1', '#4F97FD', '#FF4337'],
    //     series: [{
    //         name: '学历',
    //         type: 'pie',
    //         legendHoverLink: false,
    //         hoverAnimation: false,
    //         center: ['50%', '45%'],
    //         radius: ['28.47%', '46.34%'],
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'outside',
    //                 lineHeight: 200,
    //                 formatter: '{b} \n {c}人  {d}%'
    //             }
    //         },
    //         labelLine: {
    //             normal: {
    //                 show: true,
    //                 length: 8,
    //                 length2: 5
    //             }
    //         },
    //         itemStyle: {
    //             normal: {
    //                 label: {
    //                     show: true
    //                 }
    //             }
    //         },
    //         data: [{
    //             value: 45,
    //             name: '大专及以下',
    //             itemStyle: {
    //                 emphasis: { color: '#06D1A1' }
    //             }
    //         }, {
    //             value: 69,
    //             name: '本科',
    //             itemStyle: {
    //                 emphasis: { color: '#4F97FD' }
    //             }
    //         }, {
    //             value: 9,
    //             name: '硕士及以上',
    //             itemStyle: {
    //                 emphasis: { color: '#FF4337' }
    //             }
    //         }]
    //     }]
    // };
    // var agePartData = {
    //     tooltip: {
    //         show: false,
    //         confine: true,
    //         trigger: 'item',
    //         formatter: "{a} <br/>{b}: {c}人 ({d}%)"
    //     },
    //     legend: {
    //         orient: 'horizontal',
    //         x: 'center',
    //         data: ['25岁以下', '25-30岁', '30-35岁', '35-40岁', '40岁以上'],
    //         bottom: 10,
    //         itemGap: 15
    //     },
    //     color: ['#FFBF3E', '#7460FF', '#3AECBA', '#5EA8FF', '#FF7664'],
    //     series: [{
    //         name: '年龄',
    //         type: 'pie',
    //         legendHoverLink: false,
    //         hoverAnimation: false,
    //         center: ['50%', '43%'],
    //         radius: ['28.47%', '46.34%'],
    //         markPoint: {
    //             label: {
    //                 backgroundColor: '#000'
    //             }
    //         },
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'outside',
    //                 formatter: '{b}\n{c}人  {d}%'
    //             }
    //         },
    //         labelLine: {
    //             normal: {
    //                 show: true,
    //                 length: 8,
    //                 length2: 5
    //             }
    //         },
    //         itemStyle: {
    //             normal: {
    //                 label: {
    //                     show: true
    //                         // formatter: '{b} \n {c}人  {d}%'
    //                 }
    //             },
    //             emphasis: {

    //             }
    //         },
    //         data: [{
    //             value: 14,
    //             name: '25岁以下',
    //             itemStyle: {
    //                 emphasis: { color: '#FFBF3E' }
    //             }
    //         }, {
    //             value: 51,
    //             name: '25-30岁',
    //             itemStyle: {
    //                 emphasis: { color: '#7460FF' }
    //             }
    //         }, {
    //             value: 45,
    //             name: '30-35岁',
    //             itemStyle: {
    //                 emphasis: { color: '#3AECBA' }
    //             }
    //         }, {
    //             value: 11,
    //             name: '35-40岁',
    //             itemStyle: {
    //                 emphasis: { color: '#5EA8FF' }
    //             }
    //         }, {
    //             value: 2,
    //             name: '40岁以上',
    //             itemStyle: {
    //                 emphasis: { color: '#FF7664' }
    //             }
    //         }]
    //     }]
    // };
    // 基于准备好的dom，初始化echarts实例
    // var educationPart = echarts.init(document.getElementById('educationPart'));
    // var agePart = echarts.init(document.getElementById('agePart'));
    // 使用刚指定的配置项和数据显示图表。
    // educationPart.setOption(educationPartData);
    // agePart.setOption(agePartData);
});