

(function ($) {
    $.fn.slider = function (options) {
        var defalutOpts = {
            scale: 1,
            sensitivity: .15,
            duration: 300,
            hasNav: true,
            panelClass: "",
            cardClass: "",
            currentNo:0,
            scrolled: null
        }
        var opts = $.extend(defalutOpts, options);

        var cardsContainer = $(this);
        var touchStartX = null;
        var touchStartPosX = null;
        var w = $(window).width();
        var sliderFlag = 0;
        var deltaX=0;
        var currentNo = opts.currentNo;
        var cardPanels = opts.panelClass.length ? $("." + opts.panelClass) : $(this).find(">div");
        var cards = opts.cardClass.length ? $("." + opts.cardClass) : $(this).find(">div>div");
        var duration = opts.duration + "ms";
        var $this = $(this);


        var p = {
            sliderTo: function (i) {
                //console.log("i:" + i);
                var card = cardPanels.eq(i);
                var deltaX = -(card.position().left - (w - card.width()) / 2);
                cardsContainer.css({ "transform": "translate3d(" + deltaX + "px,0,0)", "transitionDuration": duration });

                cards.removeClass("current");
                card.find(opts.cardClass.length ? opts.cardClass : ">div").addClass("current");
                $(".cardsNavContainer span").removeClass("current").eq(i).addClass("current");
            },
            init: function () {
                var that = this;
                cardsContainer.on("touchstart", function (e) {
                    cardsContainer.css({ "transitionDuration": "0ms" });
                    touchStartX = e.originalEvent.targetTouches[0].clientX;
                    touchStartPosX = cardsContainer.position().left;
                    //console.log(touchStartX);
                })
                cardsContainer.on("touchmove", function (e) {
                    e.preventDefault();
                    deltaX = e.originalEvent.targetTouches[0].clientX - touchStartX;
                    var percent = Math.abs(e.originalEvent.targetTouches[0].clientX - touchStartX) / w;
                    cardsContainer.css("transform", "translate3d(" + (touchStartPosX + deltaX) + "px,0,0)");

                    var scaleV = Math.min((opts.scale - 1) * percent * 2, (opts.scale - 1));
                    var transform_to = { "transform": "scale(" + (opts.scale - scaleV) + ")", "transitionDuration": "0ms" };
                    var transform_from = { "transform": "scale(" + (1 + scaleV) + ")", "transitionDuration": "0ms" };
                    if (deltaX > 0 && currentNo > 0) {
                        cards.eq(currentNo).css(transform_to);
                        cards.eq(currentNo - 1).css(transform_from);
                    }
                    if (deltaX < 0 && currentNo < cards.length-1) {
                        cards.eq(currentNo).css(transform_to);
                        cards.eq(currentNo+1).css(transform_from);
                    }

                    if (percent >= opts.sensitivity && ((currentNo == 0 && deltaX < 0) || (currentNo == cards.length-1 && deltaX > 0) || (currentNo > 0 && currentNo < cards.length-1))) {
                        sliderFlag = deltaX;
                    } else {
                        sliderFlag = 0;
                    }
                })

                cardsContainer.on("touchend", function (e) {
                    var transform_to = { "transform": "scale(" + opts.scale + ")", "transitionDuration": duration };
                    var transform_from = { "transform": "scale(1)", "transitionDuration": duration }
                    if (sliderFlag > 0 && currentNo > 0) {
                        cards.eq(currentNo).css(transform_from);
                        cards.eq(currentNo - 1).css(transform_to);
                        that.sliderTo(--currentNo);
                        if (opts.scrolled) {
                            opts.scrolled.call(this, currentNo);
                        }
                    }
                    if (sliderFlag < 0 && currentNo < cards.length-1) {
                        cards.eq(currentNo).css(transform_from);
                        cards.eq(currentNo+1).css(transform_to);
                        that.sliderTo(++currentNo);
                        if (opts.scrolled) {
                            opts.scrolled.call(this, currentNo);
                        }
                    }
                    if (sliderFlag == 0 && deltaX > 0 && currentNo>0) {
                        cards.eq(currentNo).css(transform_to);
                        cards.eq(currentNo - 1).css(transform_from);
                        that.sliderTo(currentNo);
                        return ;
                    }
                    if (sliderFlag == 0 && deltaX<0 && currentNo < cards.length-1) {
                        cards.eq(currentNo).css(transform_to);
                        cards.eq(currentNo+1).css(transform_from);
                        that.sliderTo(currentNo);
                        return ;
                    }
                    if(sliderFlag ==0){
                        that.sliderTo(currentNo);
                        return ;
                    }
                    sliderFlag = 0;
                })

                if (opts.hasNav) {
                    var cardsNavContainer = $(".cardsNavContainer").length ? $(".cardsNavContainer") : $("<div class='cardsNavContainer'></div>");
                    for (var i = 0; i < cardPanels.length; i++) {
                        cardsNavContainer.append("<span></span>");
                    }
                    cardsNavContainer.delegate("span", "click", function () {
                        cards.css("transform", "");
                        var i = $(this).index(".cardsNavContainer span") + 1;
                        currentNo = i;
                        that.sliderTo(i);

                        if (opts.scrolled) {
                            opts.scrolled.call(this, currentNo);
                        }
                    })
                    $this.after(cardsNavContainer);
                }


                this.sliderTo(currentNo);//第一个显示
            }
        }

        p.init();

        return p;
    }
})(jQuery);