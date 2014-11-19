(function ($) {
    $.fn.OkiBarSlider = function(param) {
        
        /*
         * TODO:
         *  - add option for 100% viewport slides
         */
        
        
        function OkiBarSliderClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
            this.api = {
                moveTo : function(index) { moveTo(index); return this.api; },
                resize : function(index) { resize(); return this.api; },
                stop : function() { stop(); return this.api; },
                start : function() { start(); return this.api; },
                resetTimout : function() { resetTimeout(); return this.api; }
            }

            this.init = function(o, param)
            {
                if ($this) {
                    throw 'ERROR: Already inited.';
                    return;
                }
                $this = o;
                if (typeof param === 'object')
                    $.extend(settings, param);
                init();
            }

            /* -------------------------------------------------------------- */
            /* private: */
            var $this = null;
            var $bar = null;
            var $slides = null;
            var $slideZeroWidthBegin = null;
            var $slideZeroWidthEnd = null;
            var $buttonPrev = null;
            var $buttonNext = null;
            var $navi = null;
            var baseCss = {
                cssBase           : 'oki-bar-slider-base',
                cssBar            : 'obs-bar',
                cssSlide          : 'obs-slide',
                cssSlideZeroWidth : 'obs-slide-zero-width',
                cssNavi           : 'obs-navi',
                cssNaviLink       : 'obs-navi-link'
            };
            var settings = {
                slideCssClass     : 'slide',
                prevObj           : null,
                nextObj           : null,
                naviObj           : null,
                naviLinkWithNumber: false,
                step              : 1,
                naviLinkAlreadyTag: null,
                autoChangeTimeout : 4000,
                transitionDuration: 250,
                blockOnMouseOver  : true,
                cloneAtFrontAndEnd: 2,
                fadeInsteadSlide  : false,
                onChange          : null
            };
            var timerId = null;
            var slidesSize = null;
            var direction = 1;          /* 0 - left, 1 - right */
            var pos = 0;
            var isAnimating = false;
            var stopped = false;
            var firstRun = true;
            var mouseInside = false;
            
            function init()
            {
                if (settings.fadeInsteadSlide) {
                    settings.cloneAtFrontAndEnd = 0;
                }
                
                $bar = $('<div></div>');
                $this.prepend($bar);
                $this.find('> .'+settings.slideCssClass).each(function() {
                    $bar.append($(this));
                });
                $slides = $bar.find('> *');
                $slides.addClass(baseCss.cssSlide);
                slidesSize = $slides.size();
                                
                $bar.addClass(baseCss.cssBar);
                $this.addClass(baseCss.cssBase);
                $slides.addClass(baseCss.cssSlide);

                $slideZeroWidthBegin = $('<span class="'+baseCss.cssSlideZeroWidth+'">&nbsp;</span>');
                $slideZeroWidthEnd = $('<span class="'+baseCss.cssSlideZeroWidth+'">&nbsp;</span>');
                $slides.first().before($slideZeroWidthBegin);
                $slides.last().after($slideZeroWidthEnd);
                
                if (settings.cloneAtFrontAndEnd>0) {
                    cloneAtFrontAndEnd();
                }
                $bar.find('> *').addClass('obs-visibility-hidden');
                
                findObjects();
                buildNaviLinks();
                setupEvents();
                resetTimeout();
                
                moveTo(pos);
            }
            
            function findObjects()
            {
                if (settings.naviObj && settings.naviObj.size()==1) {
                    $navi = settings.naviObj;
                }
                
                if (settings.prevObj && settings.prevObj.size()==1) {
                    $buttonPrev = settings.prevObj;
                }
                
                if (settings.nextObj && settings.nextObj.size()==1) {
                    $buttonNext = settings.nextObj;
                }
            }
            
            function resize()
            {
                firstRun = true;
                moveTo(pos);
            }
            
            function buildNaviLinks()
            {
                var i;

                if ($navi) {
                    if (settings.naviLinkAlreadyTag) {
                        for (i=0; i<slidesSize; i++) {
                            $navi.find("> "+settings.naviLinkAlreadyTag+":nth-child("+(i+1)+")").attr("pos", i).addClass(baseCss.cssNaviLink);
                        }
                        $navi.find('> .'+baseCss.cssNaviLink).click(function() {
                            moveTo(parseInt($(this).attr('pos')));
                        });
                    } else {
                        for (i=0; i<slidesSize; i++) {
                            $navi.append('<a href="javascript:void(0)" pos="'+i+'">'+ (!settings.naviLinkWithNumber ? '&nbsp;' : (i+1)) +'</a>').addClass(baseCss.cssNaviLink);
                        }
                        $navi.find('> a').click(function() {
                            moveTo(parseInt($(this).attr('pos')));
                        });
                    }
                    
                    $navi.addClass(baseCss.cssNavi);
                }
            }
            
            function getNextPos(p)
            {
                var step = settings.step % slidesSize;
                
                return (p + step) % slidesSize;
            }
            
            function getPrevPos(p)
            {
                var step = settings.step % slidesSize;
                var newPos;
                
                newPos = p - step;
                
                return newPos<0 ? newPos + slidesSize : newPos;
            }
            
            function cloneAtFrontAndEnd()
            {
                var slidesArr = new Array();
                var i, j;
                
                /* copy */
                $slides.each(function() {
                    slidesArr.push($(this).clone(true, true));
                });
                
                /* put */
                for (i=0; i<settings.cloneAtFrontAndEnd; i++) {
                    for (j=slidesArr.length-1; j>=0; j--) {
                        $bar.prepend( slidesArr[j].clone(true, true) );
                    }
                    for (j=0; j<slidesArr.length; j++) {
                        $bar.append( slidesArr[j].clone(true, true) );
                    }
                }
            }
            
            function stop()
            {
                stopped = true;
            }
            
            function start()
            {
                stopped = false;
                resetTimeout();
            }
            
            function setupEvents()
            {
                var newPos;
                
                if ($buttonPrev) {
                    $buttonPrev.click(function() {                        
                        newPos = getPrevPos(pos);
                        direction = 0;
                        moveTo(newPos);
                    });
                }
                if ($buttonNext) {
                    $buttonNext.click(function() {
                        newPos = getNextPos(pos);
                        direction = 1;
                        moveTo(newPos);
                    });
                }
                
                $this.mouseover(function() {
                    mouseInside = true;
                });
                
                $this.mouseleave(function() {
                    mouseInside = false;
                });
            }
            
            function timeout()
            {
                var newPos;
                
                if (stopped)
                    return;
                
                if (settings.blockOnMouseOver && mouseInside) {
                    resetTimeout();
                    return;
                }
                
                newPos = getNextPos(pos);
                direction = 1;
                moveTo(newPos);
            }
            
            function resetTimeout()
            {
                clearTimeout(timerId);
                if (settings.autoChangeTimeout>0) {
                    timerId = setTimeout(function() {
                        timeout();
                    }, settings.autoChangeTimeout);
                }
            }
            
            function moveToFade(newPos)
            {
                var oldPos = pos;
                
                if (moveToSlide(newPos)) {        /* use old 'slide' code */
                    /* TODO: implement it better way :)  */
                    if (oldPos==newPos) {
                        $slides.hide();
                        $slides.eq(newPos).show();
                    } else {
                        $slides.hide();
                        $slides.eq(oldPos).show();
                        $slides.eq(oldPos).fadeOut(settings.transitionDuration);
                        $slides.eq(newPos).fadeIn(settings.transitionDuration);    
                    }             
                }
            }
            
            function updateVisibility()
            {
                var barLeft = parseInt($bar.css('left'), 10);
                var vpWidth = $this.width();
                var left, right;
                
                $bar.find('> *').each(function(i) {
                    left = $(this).position().left + barLeft;
                    right = left + $(this).width();
                    if ( (left>=0 && left<=vpWidth) || (right>=0 && right<=vpWidth) || (left<0 && right>vpWidth) ) {
                        $(this).removeClass('obs-visibility-hidden');
                        
                        /*
                        if ($this.hasClass('api-slider-01')) {
                            console.log( $(this), 'pos='+i, 'left='+left, 'right='+right, 'vpWidth='+vpWidth );
                        }
                        */
                    } else {
                        $(this).addClass('obs-visibility-hidden');
                    }
                });
            }
            
            function moveToSlide(newPos)
            {
                var slidesWidth;
                var currentSlideLeft;
                var position;
                
                if (!firstRun) {
                    if (isAnimating) {
                        return false;
                    }

                    if (pos==newPos) {
                        return false;
                    }

                    $bar.stop(true, false);
                    if (direction==1 && newPos<pos) {
                        slidesWidth = $slideZeroWidthEnd.position().left - $slideZeroWidthBegin.position().left;
                        currentSlideLeft = $slides.eq( pos ).position();
                        $bar.css('left', (-(currentSlideLeft.left - slidesWidth))+'px');
                    }
                    if (direction==0 && newPos>pos) {
                        slidesWidth = $slideZeroWidthEnd.position().left - $slideZeroWidthBegin.position().left;
                        currentSlideLeft = $slides.eq( pos ).position();
                        $bar.css('left', (-(currentSlideLeft.left + slidesWidth))+'px');
                    }
                }
                
                pos = newPos;
                position = $slides.eq(pos).position();
                isAnimating = true;
                $bar.stop(true, false);
                updateVisibility();
                $bar.animate({left: (-1*(position.left))+'px'}, firstRun ? 0 : settings.transitionDuration, function() {
                    isAnimating = false;
                    updateVisibility();
                });
                
                firstRun = false;
                
                if (typeof settings.onChange === 'function') {
                    settings.onChange(newPos, slidesSize);
                }
                
                return true;
            }
            
            function moveTo(newPos)
            {                
                updateVisibility();
                
                if (slidesSize==0) {
                    return;
                }
                
                resetTimeout();

                if (settings.fadeInsteadSlide) {
                    moveToFade(newPos);
                } else {
                    moveToSlide(newPos);
                }
                
                resetTimeout();
                
                /* update dots and slides classes */
                if ($navi!==null) {
                    if (slidesSize<=1) {
                        $navi.hide();
                    } else {
                        $navi.show();
                        
                        if (settings.naviLinkAlreadyTag) {
                            $navi.find('> '+settings.naviLinkAlreadyTag).removeClass('active');
                            $navi.find('> '+settings.naviLinkAlreadyTag+'[pos='+pos+']').addClass('active');
                        } else {
                            $navi.find('> a').removeClass('active');
                            $navi.find('> a[pos='+pos+']').addClass('active');
                        }
                        
                        $slides.removeClass('active');
                        $slides.eq(pos).addClass('active');
                    }
                }
            }
            
        }
        
        /* ------------------------------------------------------------------ */
        
        var pluginData;
        var pluginDataName = 'OkiBarSlider';
        
        if (typeof param === 'string' && param == "api") {
            if (this.size()==1) {
                pluginData = this.data(pluginDataName);
                if (pluginData)
                    return pluginData.api; else 
                    throw 'ERROR: There is no API. Try to call $(_selector_).' + pluginDataName + '() first.';
            } else {
                throw 'ERROR: API can be fetched only for one jQuery object. Selector points to ' + this.size() + ' elements.';
            }
        }

        return this.each(function() {
            pluginData = $(this).data(pluginDataName);

            if (!pluginData) {
                pluginData = new OkiBarSliderClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
})(jQuery);