(function ($) {
    $.fn.OkiSlider = function(param) {
        
        function OkiSliderClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                moveTo : function(index) { moveTo(index); return this.api; },
                stop : function() { stop(); return this.api; },
                start : function() { start(); return this.api; },
                resetTimout : function() { resetInternal(); return this.api; }
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
                slidesObjSelector : 'div.slider-box',
                dotsObjSelector   : null,
                prevObjSelector   : null,
                nextObjSelector   : null,
                dotsCssClass      : '',
                dotsAlreadyTag    : null,
                autoChangeTimeout : 0,
                transitionTimeout : 0,
                doubleTransition  : false
            };
            var nextObj = null;
            var prevObj = null;
            var dotsObj = null;
            var count;
            var slidesObj;
            var currentPos = 0;
            var firstMove = true;
			var LOOP = true;
            var intervalId = null;
            var animationInProgress = false;

			function stop()
            {
				LOOP = false;
			}
			
            function start()
            {
                LOOP = true;
                resetInternal();
            }
            
            function init()
            {
                var i;
            
                slidesObj = $this.find(settings.slidesObjSelector);
                count = slidesObj.size();
                
                if (typeof settings.dotsObjSelector === "string") {
                    dotsObj = $this.find(settings.dotsObjSelector);
                    if (dotsObj.size()!=1)
                        dotsObj = null;
                } else {
                    if (settings.dotsObjSelector && settings.dotsObjSelector.size()==1) {
                        dotsObj = settings.dotsObjSelector;
                    }
                }
                
                if (typeof settings.nextObjSelector === "string") {
                    nextObj = $this.find(settings.nextObjSelector);
                    if (nextObj.size()!=1)
                        nextObj = null;
                } else {
                    if (settings.nextObjSelector && settings.nextObjSelector.size()==1) {
                        nextObj = settings.nextObjSelector;
                    }
                }
                
                if (typeof settings.prevObjSelector === "string") {
                    prevObj = $this.find(settings.prevObjSelector);
                    if (prevObj.size()!=1) 
                        prevObj = null;
                } else {
                    if (settings.prevObjSelector && settings.prevObjSelector.size()==1) {
                        prevObj = settings.prevObjSelector;
                    }
                }
                
                if (dotsObj!==null) {
                    if (settings.dotsAlreadyTag!==null) {
                        for (i=0; i<count; i++) {
                            dotsObj.find("> "+settings.dotsAlreadyTag+":nth-child("+(i+1)+")").attr("pos", i);
                        }
                        dotsObj.find("> "+settings.dotsAlreadyTag).click(function() {
                            resetInternal();
                            moveTo(parseInt($(this).attr('pos')));
                        });
                    } else {
                        for (i=0; i<count; i++) {
                            dotsObj.append('<a href="javascript:void(0)" class="'+settings.dotsCssClass+'" pos="'+i+'">&nbsp;</a>');
                        }
                        dotsObj.find('> a').click(function() {
                            resetInternal();
                            moveTo(parseInt($(this).attr('pos')));
                        });
                    }
                }
                
                if (prevObj)
                    prevObj.click(function() {
                        resetInternal();
                        moveTo( ((currentPos-1)<0) ? (count-1) : (currentPos-1) );
                    });
                if (nextObj)
                    nextObj.click(function() {
                        resetInternal();
                        moveTo((currentPos + 1) % count);
                    });
                
                moveTo(0);
                resetInternal();
            }
            
            function resetInternal()
            {
                if (count>1 && settings.autoChangeTimeout!=0) {
                    clearInterval(intervalId);
					intervalId = setInterval(autochange, settings.autoChangeTimeout);
                }
            }
            
            function autochange()
            {
				if (LOOP) {
					moveTo((currentPos+1)%count);
				}
            }
            
            function moveTo(index)
            {
                if (animationInProgress)
                    return;
                
                resetInternal();
                
                if (!firstMove && currentPos==index)
                    return;
            
                // reset
                slidesObj.each(function(i) {
                    $(this).stop(true, false);
                    $(this).css('opacity', '0.0').hide();
                    if (i==currentPos) {
                        $(this).css('opacity', '1.0').show();
                    }
                });
                
                if (!firstMove) {
                    animationInProgress = true;
                    slidesObj.each(function(i) {
                        // new slide
                        if (i==index) {
                            $(this).show();
                            $(this).animate({opacity: 1.0}, settings.transitionTimeout*1.3, function() {
                                animationInProgress = false;
                            });
                        }
                        // current slide
                        if (i==currentPos) {
                            $(this).animate({opacity: 0.0}, settings.transitionTimeout, function() {
                                $(this).hide();
                            });
                        }
                    });
                    
                    if (typeof settings.onChange === 'function') {
                        settings.onChange(index);
                    }
                }
                
                currentPos = index;
                firstMove = false;
                
                // update dots
                if (dotsObj!==null) {
                    if (count<=1) {
                        dotsObj.hide();
                    } else {
                        dotsObj.show();
                        
                        if (settings.dotsAlreadyTag) {
                            dotsObj.find('> '+settings.dotsAlreadyTag).removeClass('active');
                            dotsObj.find('> '+settings.dotsAlreadyTag+'[pos='+currentPos+']').addClass('active');                            
                        } else {
                            dotsObj.find('> a').removeClass('active');
                            dotsObj.find('> a[pos='+currentPos+']').addClass('active');
                        }   
                    }
                }
            }
            
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiSlider';
        
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
                pluginData = new OkiSliderClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
})(jQuery);