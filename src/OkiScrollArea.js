(function ($) {
        
    $.fn.OkiScrollArea = function(param) {
        
        function OkiScrollAreaClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                setPositionX : function(newPosition) { setPositionX(newPosition); return this.api; },
                setPositionY : function(newPosition) { setPositionY(newPosition); return this.api; },
                addOffsetX : function(offset) { addOffsetX(offset); return this.api; },
                addOffsetY : function(offset) { addOffsetY(offset); return this.api; },
                setViewportHeight : function(h) { setViewportHeight(h); return this.api; },
                setViewportWidth : function(h) { setViewportWidth(h); return this.api; },
                resize : function() { resize(); return this.api; }
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

            // -----------------------------------------------------------------
            // private:
            var $this = null;
            var settings = {
                viewportHeight            : '100%',         // percent / px / auto
                viewportWidth             : '100%',         // percent / px / auto
                contentHeight             : 'auto',         // percent / px / auto
                contentWidth              : '100%',         // percent / px / auto
                shortenWhenSmallerWidth   : false,
                shortenWhenSmallerHeight  : false,
                autoUpdateInterval        : 0,              // in ms
                scrollHorizontal          : 'auto',         // auto / hidden / scroll
                scrollVertical            : 'auto',         // auto / hidden / scroll
                scrollHorizontalHeight    : 15,
                scrollVerticalWidth       : 15,
                scrollStep                : 20,
                flipMouseScroll           : false
            };
            
            var $sX = null, $sY = null;
            var $content;
            var contentSizeX;
            var contentSizeY;
            var viewportSizeX;
            var viewportSizeY;
            var contentPositionX;
            var contentPositionY;
            var contentPositionXSaved = null; // for restoring position after resize
            var contentPositionYSaved = null; // for restoring position after resize
            var contentOffsetX;
            var contentOffsetY;
            var viewportDividedByContentX;
            var viewportDividedByContentY;
            var contentOffsetMaxX;
            var contentOffsetMaxY;
            var scrollNeededX;
            var scrollNeededY;
            var scrollNeededXPrevious = null;         // for scrollBar widget resize
            var scrollNeededYPrevious = null;         // for scrollBar widget resize
            
            function setPositionX(newPosition)
            {
                newPosition = newPosition<0.0 ? 0.0 : newPosition;
                newPosition = newPosition>1.0 ? 1.0 : newPosition;
                
                contentOffsetX = Math.round(newPosition * contentOffsetMaxX);
                
                update();
            }
            
            function setPositionY(newPosition)
            {
                newPosition = newPosition<0.0 ? 0.0 : newPosition;
                newPosition = newPosition>1.0 ? 1.0 : newPosition;
                
                contentOffsetY = Math.round(newPosition * contentOffsetMaxY);
                
                update();
            }
            
            function strpos(haystack, needle, offset) 
            {
                var i = (haystack + '').indexOf(needle, (offset || 0));
                return i === -1 ? false : i;
            }
            
            function update()
            {
                var viewportHeightInteger;
                var viewportWidthInteger;
                
                contentSizeX = $content.width();
                contentSizeY = $content.height();
                viewportSizeX = $this.width();
                viewportSizeY = $this.height();
                
                // check if content is smaller than viewport - if true shorten viewport
                if (settings.shortenWhenSmallerHeight && strpos(settings.viewportHeight, 'px')!==false) {
                    viewportHeightInteger = parseInt( settings.viewportHeight.replace('px', '') );
                    if (contentSizeY<viewportHeightInteger) {
                        viewportSizeY = contentSizeY;
                        $this.height(viewportSizeY);
                    } else {
                        viewportSizeY = viewportHeightInteger;
                        $this.height(viewportHeightInteger);
                    }
                }
                
                // check if content is smaller than viewport - if true shorten viewport
                if (settings.shortenWhenSmallerWidth && strpos(settings.viewportWidth, 'px')!==false) {
                    viewportWidthInteger = parseInt( settings.viewportWidth.replace('px', '') );
                    if (contentSizeX<viewportWidthInteger) {
                        viewportSizeX = contentSizeX;
                        $this.width(viewportSizeX);
                    } else {
                        viewportSizeX = viewportWidthInteger;
                        $this.width(viewportWidthInteger);
                    }
                }

                scrollNeededX = (contentSizeX>viewportSizeX) ? true : false;
                scrollNeededY = (contentSizeY>viewportSizeY) ? true : false;
                
                if (scrollNeededX) {
                    $this.addClass('osa-horizontal-scrollbar-active');
                    $sY.css('padding-bottom', settings.scrollHorizontalHeight+'px');
                    if ($sY && scrollNeededYPrevious!==scrollNeededY) {
                        $sY.OkiScrollBar('api').resize();
                    }
                } else {
                    $this.removeClass('osa-horizontal-scrollbar-active');
                    $sY.css('padding-bottom', '0px');
                    if ($sY && scrollNeededYPrevious!==scrollNeededY) {
                        $sY.OkiScrollBar('api').resize();
                    }
                }
                if (scrollNeededY) {
                    $this.addClass('osa-vertical-scrollbar-active');
                    $sX.css('padding-right', settings.scrollVerticalWidth+'px');
                    if ($sX && scrollNeededXPrevious!==scrollNeededX) {
                        $sX.OkiScrollBar('api').resize();
                    }
                } else {
                    $this.removeClass('osa-vertical-scrollbar-active');
                    $sX.css('padding-right', '0px');
                    if ($sX && scrollNeededXPrevious!==scrollNeededX) {
                        $sX.OkiScrollBar('api').resize();
                    }
                }
                
                scrollNeededXPrevious = scrollNeededX;
                scrollNeededYPrevious = scrollNeededY;
                
                contentOffsetMaxX = contentSizeX - viewportSizeX;
                contentOffsetMaxY = contentSizeY - viewportSizeY;
                
                if (contentPositionXSaved!==null && contentPositionYSaved!==null) {
                    contentOffsetX = (contentOffsetMaxX>0) ? contentPositionXSaved*contentOffsetMaxX : 0;
                    contentOffsetY = (contentOffsetMaxY>0) ? contentPositionYSaved*contentOffsetMaxY : 0;
                    contentPositionXSaved = null;
                    contentPositionYSaved = null;
                }
                
                contentPositionX = (contentOffsetMaxX>0) ? (contentOffsetX/contentOffsetMaxX) : 0;
                contentPositionY = (contentOffsetMaxY>0) ? (contentOffsetY/contentOffsetMaxY) : 0;
                
                viewportDividedByContentX = contentSizeX>0 ? (viewportSizeX/contentSizeX) : 1;
                viewportDividedByContentY = contentSizeY>0 ? (viewportSizeY/contentSizeY) : 1;
                
                $content.css('top', '-'+contentOffsetY+'px');
                $content.css('left', '-'+contentOffsetX+'px');
            }
            
            function addOffsetX(offset)
            {
                if (!scrollNeededX)
                    return;
                
                contentOffsetX += offset;
                contentOffsetX = contentOffsetX<0 ? 0 : contentOffsetX;
                contentOffsetX = contentOffsetX>contentOffsetMaxX ? contentOffsetMaxX : contentOffsetX;
                contentPositionX = (contentOffsetMaxX>0) ? (contentOffsetX/contentOffsetMaxX) : 0;
                
                if ($sX)
                    $sX.OkiScrollBar('api').changePosition(contentPositionX);
                
                $content.css('left', '-'+contentOffsetX+'px');
            }
            
            function addOffsetY(offset)
            {
                if (!scrollNeededY)
                    return;
                
                contentOffsetY += offset;
                contentOffsetY = contentOffsetY<0 ? 0 : contentOffsetY;
                contentOffsetY = contentOffsetY>contentOffsetMaxY ? contentOffsetMaxY : contentOffsetY;
                contentPositionY = (contentOffsetMaxY>0) ? (contentOffsetY / contentOffsetMaxY) : 0;
                
                if ($sY)
                    $sY.OkiScrollBar('api').changePosition(contentPositionY);
                
                $content.css('top', '-'+contentOffsetY+'px');
            }
        
            function resize()
            {
                if (!$this.is(':visible'))
                    return;
                
                contentPositionXSaved = contentPositionX;
                contentPositionYSaved = contentPositionY;
                
                update();
                if ($sX) {
                    $sX.OkiScrollBar('api').changeSize(viewportDividedByContentX);
                    $sX.OkiScrollBar('api').changePosition(contentPositionX);
                    $sX.OkiScrollBar('api').resize();
                }
                if ($sY) {
                    $sY.OkiScrollBar('api').changeSize(viewportDividedByContentY);
                    $sY.OkiScrollBar('api').changePosition(contentPositionY);
                    $sY.OkiScrollBar('api').resize();
                }
            }
            
            function setupEvents()
            {
                $this.mousewheel(function(event, delta, deltaX, deltaY) {
                    event.preventDefault();
                    
                    if (settings.flipMouseScroll) {
                        if (deltaY<0)
                            addOffsetX(settings.scrollStep);
                        if (deltaY>0)
                            addOffsetX(-settings.scrollStep);
                        if (deltaX<0)
                            addOffsetY(settings.scrollStep);
                        if (deltaX>0)
                            addOffsetY(-settings.scrollStep);
                    } else {
                        if (deltaY<0)
                            addOffsetY(settings.scrollStep);
                        if (deltaY>0)
                            addOffsetY(-settings.scrollStep);
                        if (deltaX<0)
                            addOffsetX(settings.scrollStep);
                        if (deltaX>0)
                            addOffsetX(-settings.scrollStep);
                    }
                });
                

                // touch
                var touchStartX = 0;
                var touchStartY = 0;
                var windowScroll = 0;
                var moved = false;
                var moving = false;

                $this.unbind('touchstart').unbind('touchmove').unbind('touchend').unbind('click'
                ).bind(
                    'touchstart',
                    function (ev) {
                        var touch = ev.originalEvent.touches[0];
                        touchStartX = touch.pageX;
                        touchStartY = touch.pageY;
                        moving = true;
                        moved = false;
                        windowScroll = $(window).scrollTop();
                        
//                        ev.returnValue = false;
//                        ev.cancelBubble = true;
//                        if (ev.preventDefault) {
//                            ev.preventDefault();
//                        }
                        
//                        return true;
                    }
                ).bind(
                    'touchmove',
                    function (ev) {
                        var deltaX, deltaY;
                        var touch;

                        if (!moving) {
                            return false;
                        }
                        if (ev.originalEvent.touches.length > 1) {
                            return false;
                        }

                        touch = ev.originalEvent.touches[0];
                        deltaX = (touch.pageX - touchStartX);
                        deltaY = (touch.pageY - touchStartY);
                        touchStartX = touch.pageX;
                        touchStartY = touch.pageY;

                        // ----------------
                        addOffsetY(-deltaY);
                        addOffsetX(-deltaX);
                        // ----------------

                        moved = moved || Math.abs(touchStartX - touch.pageX) > 5 || Math.abs(touchStartY - touch.pageY) > 5;
                        
                        ev.returnValue = false;
                        ev.cancelBubble = true;
                        if (ev.preventDefault) {
                            ev.preventDefault();
                            ev.stopPropagation();
                        }
                        $(window).scrollTop(windowScroll);
                        

                        return false;  // ?? -> return true if there was no movement so rest of screen can scroll
                    }
                ).bind(
                    'touchend',
                    function (ev) {
                        moving = false;
                    }
                );
            }
            
            function setViewportHeight(h)
            {
                if (h!=settings.viewportHeight) {
                    settings.viewportHeight = h;
                    $this.height(settings.viewportHeight);

                    update();
                }
            }
            
            function setViewportWidth(w)
            {
                if (w!=settings.viewportWidth) {
                    settings.viewportWidth = w;
                    $this.width(settings.viewportWidth);

                    update();
                }
            }

            function init()
            {   
                $this.addClass('oki-scroll-area-base');
                
                $this.wrapInner('<div class="osa-padd"></div>');
                $this.find('> div.osa-padd').wrap('<div class="osa-cont"></div>');
                $content = $this.find('> div.osa-cont');
                $content.width(settings.contentWidth);
                $content.height(settings.contentHeight);
                
                                
                if (settings.scrollHorizontal=="auto" || settings.scrollHorizontal=="scroll") {
                    $this.append('<div class="osa-scrollbar-horizontal"></div>');
                    $sX = $this.find('div.osa-scrollbar-horizontal');
                    $sX.height(settings.scrollHorizontalHeight+'px');
                    $sX.OkiScrollBar({
                        orientation   : 'horizontal',
                        onChange      : function(position) {
                                            setPositionX(position);
                                        }
                    });
                }
                if (settings.scrollVertical=="auto" || settings.scrollVertical=="scroll") {
                    $this.append('<div class="osa-scrollbar-vertical"></div>');
                    $sY = $this.find('div.osa-scrollbar-vertical');
                    $sY.width(settings.scrollVerticalWidth+'px');
                    $sY.OkiScrollBar({
                        onChange      : function(position) {
                                            setPositionY(position);
                                        }
                    });
                }
                
                $this.width(settings.viewportWidth);
                $this.height(settings.viewportHeight);
                                
                contentPositionX = 0.0;
                contentPositionY = 0.0;
                contentOffsetX = 0;
                contentOffsetY = 0;

                resize();
                setupEvents();
                
                if (settings.autoUpdateInterval>0) {
                    setInterval(resize, settings.autoUpdateInterval);
                }
            }

        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiScrollArea';
        
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
                pluginData = new OkiScrollAreaClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
    $.fn.SwipeEvents = function() {
        return this.each(function() {
            var startX, startY,
            $this2 = $(this);

            $this2.bind('touchstart', touchstart);

            function touchstart(event) {
                var touches = event.originalEvent.touches;
                if (touches && touches.length) {
                    startX = touches[0].pageX;
                    startY = touches[0].pageY;
                    $this2.bind('touchmove', touchmove);
                }
            }

            function touchmove(event) {
                var touches = event.originalEvent.touches;
                if (touches && touches.length) {
                    var deltaX = startX - touches[0].pageX;
                    var deltaY = startY - touches[0].pageY;
                    var pixels = settings.swipePixels;

                    if (deltaX >= pixels) {
                        $this2.trigger("swipeLeft");
                    }
                    if (deltaX <= -pixels) {
                        $this2.trigger("swipeRight");
                    }
                    if (deltaY >= pixels) {
                        $this2.trigger("swipeUp");
                    }
                    if (deltaY <= -pixels) {
                        $this2.trigger("swipeDown");
                    }
                    if (Math.abs(deltaX) >= pixels || Math.abs(deltaY) >= pixels) {
                        $this2.unbind('touchmove', touchmove);
                    }
                }
            }
        });
    };
    
})(jQuery);