(function ($) {
    $.fn.OkiScrollBar = function(param) {
        
        function OkiScrollBarClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                changePosition : function(newPosition) { changePosition(newPosition); return this.api; },
                changeSize : function(newSize) { changeSize(newSize); return this.api; },
                addOffset : function(offset) { addOffset(offset); return this.api; },
                getPosition : function() { return getPosition(); },
                getSize : function() { return getSize(); },
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
                orientation       : 'vertical',
                minHandleSize     : 10,
                marginFirst       : 8,
                marginLast        : 8,
                position          : 0.0,
                size              : 1.0,
                onChange          : null,
                htmlVertical      : '<div class="scrollbar-vertical"><div class="sb-int"><a href="javascript:void(0)" class="sb-handler">&nbsp;</a></div></div>',
                htmlHorizontal    : '<div class="scrollbar-horizontal"><div class="sb-int"><a href="javascript:void(0)" class="sb-handler">&nbsp;</a></div></div>',
                handlerSelector   : 'a.sb-handler'
                
            };
            var $handler;
            var size = null;
            var position = null;
            var handlerCssOffset = null;
            var handlerCssOffsetMin = null;
            var handlerCssOffsetMax = null;
            var handlerCssOffsetRange = null;
            var handlerSize = null;
            var mouseSavedX = null;
            var mouseSavedY = null;
            
            function getSize()
            {
                return size;
            }
            
            function getPosition()
            {
                return position;
            }
            
            function changePosition(newPosition)
            {
                newPosition = newPosition<0 ? 0 : newPosition;
                newPosition = newPosition>1 ? 1 : newPosition;
                
                position = newPosition;
                update();
            }
            
            function changeSize(newSize)
            {
                newSize = newSize<0 ? 0 : newSize;
                newSize = newSize>1 ? 1 : newSize;
                
                size = newSize;
                update();
            }
            
            function update()
            {
                var placeForScrollHandle;
                var cssProp;
                var parentSize;
                
                parentSize = (settings.orientation=='vertical') ? $this.height() : $this.width();
                placeForScrollHandle = parentSize - settings.marginFirst - settings.marginLast;
                if (placeForScrollHandle<settings.minHandleSize) {
                    handlerCssOffsetMin = null;
                    handlerCssOffsetMax = null;
                    handlerCssOffsetRange = null;
                    handlerSize = null;
                    $handler.hide();
                    return;
                } else {
                    $handler.show();
                }
                handlerSize = Math.round(placeForScrollHandle * size);
                handlerSize = handlerSize<settings.minHandleSize ? settings.minHandleSize : handlerSize;
                
                handlerCssOffsetRange = placeForScrollHandle - handlerSize;
                handlerCssOffsetMin = settings.marginFirst;
                handlerCssOffset = handlerCssOffsetMin + Math.round(handlerCssOffsetRange * position);
                handlerCssOffsetMax = handlerCssOffsetMin + handlerCssOffsetRange;
                
                if (settings.orientation=='vertical') {
                    $handler.height(handlerSize);
                } else {
                    $handler.width(handlerSize);
                }
                cssProp = (settings.orientation=='vertical') ? 'top' : 'left';
                $handler.css(cssProp, handlerCssOffset+'px');
            }
            
            function addOffset(offset)
            {
                var cssProp;
                
                if (handlerSize===null)
                    return;
                
                handlerCssOffset += offset;
                handlerCssOffset = handlerCssOffset<handlerCssOffsetMin ? handlerCssOffsetMin : handlerCssOffset;
                handlerCssOffset = handlerCssOffset>handlerCssOffsetMax ? handlerCssOffsetMax : handlerCssOffset;
                position = (handlerCssOffset - handlerCssOffsetMin) / handlerCssOffsetRange;
                
                cssProp = (settings.orientation=='vertical') ? 'top' : 'left';
                $handler.css(cssProp, handlerCssOffset+'px');
                
                if (typeof settings.onChange === 'function') {
                    settings.onChange(position);
                }
            }
        
            function resize()
            {
                update();
            }
            
            function setupEvents()
            {
                $handler.mousedown(function(e) {
                    if (e.button==0) {
                        mouseSavedX = e.clientX;
                        mouseSavedY = e.clientY;
                    }
                    e.preventDefault();
                });
                
                $(document).mousemove(function(e) {
                    var diffX, diffY;
                    if (mouseSavedX===null || mouseSavedY===null) {
                        return;
                    }
                    diffX = e.clientX - mouseSavedX;
                    diffY = e.clientY - mouseSavedY;
                    mouseSavedX = e.clientX;
                    mouseSavedY = e.clientY;
                    
                    if (settings.orientation=='vertical') {
                        addOffset(diffY);
                    } else {
                        addOffset(diffX);
                    }
                });
                
                $(document).mouseup(function(e) {
                    mouseSavedX = null;
                    mouseSavedY = null;
                });                
            }

            function init()
            {
                if (settings.orientation=="vertical") {
                    $this.append(settings.htmlVertical);
                } else {
                    $this.append(settings.htmlHorizontal);
                }
                
                size = settings.size;
                position = settings.position;
                $handler = $this.find(settings.handlerSelector);
                resize();
                
                setupEvents();
            }

        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiScrollBar';
        
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
                pluginData = new OkiScrollBarClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
})(jQuery);