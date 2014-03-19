(function ($) {
        
    $.fn.OkiRange = function(param) {
        
        function OkiRangeClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                resize : function() { resize(); return this.api; },
                sync : function() { sync(); return this.api; },
                setDataRange : function(dr) { setDataRange(dr); return this.api; },
                setDataArray : function(da) { setDataArray(da); return this.api; }
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
                secondHandleInputObj    : null,
                dataArray               : null,
                dataRange               : null,       // example:  [0, 500, 0.01]    <--- min, max, step
                scaleShowPointEvery     : 1,          // example:  0.5 or null
                scaleFormatCallback     : null,
                onChange                : null
            };
            
            var $html;
            var mode = null;
            var secondHandle = false;
            var $inputFirst = null;
            var $inputSecond = null;
            var inputFirstPreviousVal = null;
            var inputSecondPreviousVal = null;
            var $handlerFirst = null;
            var $handlerSecond = null;
            var $handlerTooltipFirst = null;
            var $handlerTooltipSecond = null;
            var $rangeBar = null;
            var handlerFirstPos = 0.0;
            var handlerSecondPos = 0.0;
            var $scale = null;
            var $rangeArea = null;
            var width = 0;
            

            function init()
            {
                $inputFirst = $this;
                if (settings.secondHandleInputObj && settings.secondHandleInputObj.size()==1) {
                    secondHandle = true;
                    $inputSecond = settings.secondHandleInputObj;
                } else {
                    secondHandle = false;
                }
                
                if (settings.dataArray && settings.dataArray.length>0) {
                    mode = 'array';
                } else
                    if (settings.dataRange && settings.dataRange.length==3 && settings.dataRange[0]<=settings.dataRange[1] && ((settings.dataRange[1]-settings.dataRange[0])>0.0) && settings.dataRange[2]!=0.0) {
                        mode = 'range';
                    }
                
                if ( ! ((settings.scaleShowPointEvery===null) || (settings.scaleShowPointEvery!==null && /*isInt(settings.scaleShowPointEvery) && */settings.scaleShowPointEvery>0))) {
                    throw 'ERROR: scaleShowPointEvery must be null or >0';
                }
                
                if (mode==null) {
                    throw 'ERROR: No data';
                }
                
                
                buildHtml();
                sync();
                connectEvents();
                resize();

                // hide real inputs
                $inputFirst.hide();      
                if (secondHandle) {
                    $inputSecond.hide();
                }
            }
            
            function isInt(n) 
            {
                return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
            }
            
            function buildHtmlUpdateScale()
            {
                var elTpl = '<div><span><span><span></span></span></span></div>';
                var $el;
                var i, dCount;
                var posUnit;
                var posLeft;
                
                $scale.html('');
                if (settings.scaleShowPointEvery===null) {
                    return;
                }
                
                if (mode=='array') {
                    dCount = settings.dataArray.length;
                    
                    for (i=0; i<dCount; i++) {
                        if (settings.scaleShowPointEvery && i%settings.scaleShowPointEvery!=0) {
                            continue;
                        }
                        
                        posUnit = (dCount-1) ? (i/(dCount-1)) : 0.0;
                        posLeft = posUnit * width;
                        
                        $el = $(elTpl);
                        $el.css('left', posLeft+'px');
                        $el.find('> span > span > span').html(settings.dataArray[i]);
                        $scale.append($el);
                    }
                    
                } else
                    if (mode=='range') {
                        i = settings.dataRange[0];
                        while (i<=settings.dataRange[1]) {
                            posUnit = (i - settings.dataRange[0]) / (settings.dataRange[1] - settings.dataRange[0]);
                            posLeft = posUnit * width;

                            $el = $(elTpl);
                            $el.css('left', posLeft+'px');
                            if (typeof settings.scaleFormatCallback === 'function') {
                                $el.find('> span > span > span').html( settings.scaleFormatCallback(i) );
                            } else {
                                $el.find('> span > span > span').html(i);
                            }
                            $scale.append($el);

                            i += settings.scaleShowPointEvery;
                        }
                    }
            }
            
            function buildHtml()
            {
                var html;
                
                html = '<div class="oki-range">' +
                       '    <div class="r-barbg">' +
                       '        <div><div>&nbsp;</div></div>' +
                       '    </div>' +
                       '    <div class="r-area-cont">' +
                       '        <div class="r-a">' +
                       '            <div class="r-scale">' +

                       '            </div>' +
                       '            <div class="r-range-bar" style="width: 120px; left: 0px;">&nbsp;</div>' +
                       '            <div class="r-handle-pos" style="left: 0px;">' +
                       '                <a href="javascript:void(0)" class="r-handle">' +
                       '                    <div class="r-tooltip-pos">' +
                       '                        <div class="oki-tooltip">' +
                       '                            <div class="tt-interior">' +
                       '                                <div class="tt-cont"><div><div><b title=""></b></div></div></div>' +
                       '                                <div class="tt-arrow-cont"><div class="tt-arrow">&nbsp;</div></div>' +
                       '                            </div>' +
                       '                        </div>' +
                       '                    </div>' +
                       '                </a>' +
                       '            </div>' +
                       '            <div class="r-handle-pos" style="left: 120px;">' +
                       '                <a href="javascript:void(0)" class="r-handle">' +
                       '                    <div class="r-tooltip-pos">' +
                       '                        <div class="oki-tooltip">' +
                       '                            <div class="tt-interior">' +
                       '                                <div class="tt-cont"><div><div><b title=""></b></div></div></div>' +
                       '                                <div class="tt-arrow-cont"><div class="tt-arrow">&nbsp;</div></div>' +
                       '                            </div>' +
                       '                        </div>' +
                       '                    </div>' +
                       '                </a>' +
                       '            </div>' +
                       '        </div>' +
                       '    </div>' +
                       '</div>';
                $html = $(html);
                $this.after($html);
                
                $rangeArea = $html.find('div.r-a');
                width = $rangeArea.width();
                $scale = $html.find('div.r-scale');
                
                $handlerFirst = $html.find('div.r-handle-pos:first');
                $handlerTooltipFirst = $handlerFirst.find('div.tt-cont b');
                if (secondHandle) {
                    $handlerSecond = $html.find('div.r-handle-pos:last');
                    $handlerTooltipSecond = $handlerSecond.find('div.tt-cont b');
                    $rangeBar = $html.find('div.r-range-bar');
                } else {
                    $html.find('div.r-handle-pos:last').hide();
                    $html.find('div.r-range-bar').hide();
                }
                
                buildHtmlUpdateScale();
            }
            
            function sync()
            {
                var posUnit = 0.0;
                var i, handle;
                var val;
                
                for (handle=1; handle<=(secondHandle ? 2 : 1); handle++) {
                    switch (handle) {
                        case 1: val = $inputFirst.val(); break;
                        case 2: val = $inputSecond.val(); break;
                    }
                    
                    posUnit = 0.0;
                    
                    if (mode=='array') {
                        for (i=0; i<settings.dataArray.length; i++) {
                            if (settings.dataArray[i]==val) {
                                posUnit = (settings.dataArray.length-1)!=0 ? (i / (settings.dataArray.length-1)) : 0.0;
                                break;
                            }
                        }
                    } else 
                        if (mode=='range') {
                            val = parseFloat(val) ? parseFloat(val) : 0.0;
                            posUnit = (val - settings.dataRange[0]) / (settings.dataRange[1] - settings.dataRange[0]);
                        }
                    
                    switch (handle) {
                        case 1: setFirstValPos(posUnit); break;
                        case 2: setSecondValPos(posUnit); break;
                    }
                    
                }
            }
            
            function addFirstValPosOffset(offset)
            {
                var newPos;
                
                if (width!=0) {
                    newPos = handlerFirstPos + (offset/width);
                } else {
                    newPos = 0.0;
                }
                setFirstValPos(newPos);
            }
            
            function addSecondValPosOffset(offset)
            {
                var newPos;
                
                if (secondHandle) {
                    newPos = handlerSecondPos + offset/width;
                    setSecondValPos(newPos);
                }
            }
            
            function findAndSetValueForPos(pos, handle)
            {
                var i, val, onChangeData;
                
                val = null;
                onChangeData = null;
                if (mode=='array') {
                    i = Math.round( pos * (settings.dataArray.length-1) );
                    val = settings.dataArray[i];
                } else 
                    if (mode=='range') {
                        val = settings.dataRange[0] + Math.round( (pos * (settings.dataRange[1] - settings.dataRange[0])) / settings.dataRange[2] ) * settings.dataRange[2];
                    }
            
                if (val!==null) {
                    if (typeof settings.scaleFormatCallback === 'function') {
                        val = settings.scaleFormatCallback(val);
                    }
                    
                    if (handle==1) {
                        $inputFirst.val(val);
                        $handlerTooltipFirst.html(val);
                        $handlerTooltipFirst.attr('title', val);
                        $inputFirst.trigger("change");
                        
                        if (typeof settings.onChange === 'function' && inputFirstPreviousVal!=val) {
                            onChangeData = {
                                val   : val,
                                handle: 1
                            }
                            inputFirstPreviousVal = val;
                        }
                    }
                    if (handle==2 && secondHandle) {
                        $inputSecond.val(val);
                        $handlerTooltipSecond.html(val);
                        $handlerTooltipSecond.attr('title', val);
                        $inputSecond.trigger("change");
                        
                        if (typeof settings.onChange === 'function' && inputSecondPreviousVal!=val) {
                            onChangeData = {
                                val   : val,
                                handle: 2
                            }
                            inputSecondPreviousVal = val;
                        }
                    }
                }
                
                if (onChangeData!==null) {
                    settings.onChange(onChangeData);
                }
            }
            
            function setFirstValPos(pos)
            {
                pos = pos<0.0 ? 0.0 : pos;
                pos = pos>1.0 ? 1.0 : pos;
                if (secondHandle) {
                    pos = pos>handlerSecondPos ? handlerSecondPos : pos;
                }
                handlerFirstPos = pos;
                
                findAndSetValueForPos(handlerFirstPos, 1);
                resize();
            }
            
            function setSecondValPos(pos)
            {
                if (!secondHandle) {
                    return;
                }
                pos = pos<0.0 ? 0.0 : pos;
                pos = pos>1.0 ? 1.0 : pos;
                pos = pos<handlerFirstPos ? handlerFirstPos : pos;
                handlerSecondPos = pos;
                
                findAndSetValueForPos(handlerSecondPos, 2);
                resize();
            }
            
            function connectEvents()
            {
                var mouseSavedX = null;
                var clickedHandle = null;
                
                // mouse
                $handlerFirst.mousedown(function(e) {
                    if (e.button==0) {
                        mouseSavedX = e.clientX;
                        clickedHandle = 1;
                    }
                    e.preventDefault();
                });
                if (secondHandle) {
                    $handlerSecond.mousedown(function(e) {
                        if (e.button==0) {
                            mouseSavedX = e.clientX;
                            if (handlerFirstPos==1.0 && handlerSecondPos==1.0) {
                                // prevent locking when all are moved to right
                                clickedHandle = 1;
                            } else {
                                clickedHandle = 2;
                            }
                        }
                        e.preventDefault();
                    });
                }
                $(document).mousemove(function(e) {
                    var diffX;
                    if (mouseSavedX===null) {
                        return;
                    }
                    diffX = e.clientX - mouseSavedX;
                    mouseSavedX = e.clientX;
                    switch (clickedHandle) {
                        case 1: addFirstValPosOffset(diffX); break;
                        case 2: addSecondValPosOffset(diffX); break;
                    }
                    
                });
                $(document).mouseup(function(e) {
                    mouseSavedX = null;
                    clickedHandle = null;
                });
                

                // touch
                var touchStartX = 0;
                var moved = false;
                var moving = false;

                $rangeArea.unbind('touchstart').unbind('touchmove').unbind('touchend').unbind('click'
                ).bind(
                    'touchstart',
                    function (ev) {
                        var touch = ev.originalEvent.touches[0];
                        touchStartX = touch.pageX;
                        moving = true;
                        moved = false;
                    }
                ).bind(
                    'touchmove',
                    function (ev) {
                        var deltaX;
                        var touch;

                        if (!moving)
                            return false;
                        if (ev.originalEvent.touches.length > 1)
                            return false;

                        touch = ev.originalEvent.touches[0];
                        deltaX = (touch.pageX - touchStartX);
                        touchStartX = touch.pageX;

                        // ----------------
                        if (secondHandle) {
                            var distToFirst = touch.pageX - $handlerFirst.offset().left;
                            var distToSecond = touch.pageX - $handlerSecond.offset().left;
                            
                            distToFirst = distToFirst<0 ? -distToFirst : distToFirst;
                            distToSecond = distToSecond<0 ? -distToSecond : distToSecond;
                            if (distToFirst<distToSecond || (handlerFirstPos==1.0 && handlerSecondPos==1.0)) {
                                addFirstValPosOffset(deltaX);
                            } else {
                                addSecondValPosOffset(deltaX);
                            }
                        } else {
                            addFirstValPosOffset(deltaX);
                        }
                        // ----------------

                        moved = moved || Math.abs(touchStartX - touch.pageX) > 5;

                        return false;  // ?? -> return true if there was no movement so rest of screen can scroll
                    }
                ).bind(
                    'touchend',
                    function (ev) {
                        moving = false;
                    }
                )/*.bind(
                    'click',
                    function (ev) {
                        if (moved) {
                            moved = false;
                            return false;
                        }
                        return true;
                    }
                )*/;
            }
            
            function resize()
            {
                var hFirstLeft, hSecondLeft;
                
                hFirstLeft = handlerFirstPos*width;
                hSecondLeft = handlerSecondPos*width;
                $handlerFirst.css('left', (hFirstLeft)+'px');
                if (secondHandle) {
                    $handlerSecond.css('left', (hSecondLeft)+'px');
                    $rangeBar.width(hSecondLeft - hFirstLeft);
                    $rangeBar.css('left', hFirstLeft);
                }
            }
            
            function setDataRange(dr)
            {
                
            }
            
            function setDataArray(da)
            {
                
            }
            
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiRange';
        
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
                pluginData = new OkiRangeClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
