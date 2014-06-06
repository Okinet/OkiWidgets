(function ($) {
        
    $.fn.OkiDimensionParser = function(param) {
        
        function OkiDimensionParserClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                getActiveElementIndex: function() { return getActiveElementIndex(); },
                setActiveElementIndex: function(v) { setActiveElementIndex(v); return this.api; },
                getDimensionArray: function() { return getDimensionArray(); },
                recalculate: function() { return recalculate(); }
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
                elementsFindSelector : '> *',
                valFindCallback      : null,
                textFindCallback     : null,
                activeFindCallback   : null,
                orientation          : 'vertical'
            };
            var dimensionArray = null;
            var activeElementIndex = null;

            function init()
            {
            }
            
            function getDimensionArray()
            {
                return dimensionArray;
            }
            
            function getActiveElementIndex()
            {
                return activeElementIndex;
            }
            
            function setActiveElementIndex(v)
            {
                activeElementIndex = v;
            }
            
            function recalculate()
            {
                dimensionArray = null;
                calculate();
            }
            
            function calculate()
            {
                var previousOffset = 0;
                var i;
                var dim;
                
                if (dimensionArray!==null)
                    return;

                activeElementIndex = -1;
                dimensionArray = new Array();
                $this.find(settings.elementsFindSelector).each(function(i) {
                    dim = (settings.orientation)=='vertical' ? $(this).outerHeight(true) : $(this).outerWidth(true);
                    dimensionArray.push({
                        visible       : $(this).is(':visible'),
                        $element      : $(this),
                        val           : (typeof settings.valFindCallback === 'function') ? settings.valFindCallback($(this)) : null,
                        text          : (typeof settings.textFindCallback === 'function') ? settings.textFindCallback($(this)) : null,
                        offsetTop     : previousOffset,
                        offsetMiddle  : (previousOffset + 0.5*dim),
                        offsetBottom  : (previousOffset + dim),
                        unitPos       : null
                    });
                    
                    if ((typeof activeFindCallback == 'function') && activeFindCallback($(this)) && activeElementIndex==-1) {
                        activeElementIndex = i;
                    }
                   
                    previousOffset = previousOffset + dim;
                });
                
                for (i=0; i<dimensionArray.length; i++) {
                    dimensionArray[i].unitPos = dimensionArray[i].offsetTop/(dimensionArray[dimensionArray.length-1].offsetTop);
                }
                
                if (activeElementIndex==-1) {
                    activeElementIndex = 0;
                }
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiDimensionParser';
        
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
                pluginData = new OkiDimensionParserClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
