(function ($) {
    $.fn.OkiBarSlider = function(param) {
        
        function OkiBarSliderClass()
        {
            // -----------------------------------------------------------------
            // public:
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

            // -----------------------------------------------------------------
            // private:
            var $this = null;
            var $bar = null;
            var $slides = null;
            var baseCss = {
                cssBase           : 'oki-bar-slider-base',
                cssBar            : 'obs-bar',
                cssSlide          : 'obs-slide'
            };
            var settings = {
                barObjSelector    : '> div.bar',
                slideObjSelector  : '> div.bar > div.slide',
                prevObjSelector   : null,
                nextObjSelector   : null,
                naviObjSelector   : null,
                naviStep          : 1,
                naviLinkCssClass  : '',
                naviLinkAlreadyTag: null,
                autoChangeTimeout : 0,
                transitionTimeout : 0
            };
            
            function init()
            {    
                $bar = $this.find(settings.barObjSelector);
                $slides = $this.find(settings.slideObjSelector);
                
                $this.addClass(baseCss.cssBase);
                $bar.addClass(baseCss.cssBar);
                $slides.addClass(baseCss.cssSlide);
            }
            
        }
        
        // ---------------------------------------------------------------------
        
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