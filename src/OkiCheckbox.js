(function ($) {
        
    $.fn.OkiCheckbox = function(param) {
        
        function OkiCheckboxClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                sync : function() { sync(); return this.api; }
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
                checkboxSelector  : 'a',
                textSelector      : 'span',
                onChange          : null
            };
            var $checkbox = null;
            var $text = null;

            function init()
            {
                if (settings.checkboxSelector) {
                    $checkbox = $this.next(settings.checkboxSelector);
                    if ($checkbox.size()!=1)
                        $checkbox = null;
                }
                if (settings.textSelector) {
                    $text = $this.nextUntil('input[type=checkbox]').filter(settings.textSelector).eq(0);
                    if ($text.size()!=1)
                        $text = null;
                }

                sync();
                connectEvents();
                $this.hide();      // hide real select
            }
            
            function connectEvents()
            {
                if ($checkbox) {
                    $checkbox.click(function() {
                        fieldClick();
                    });
                }
                if ($text) {
                    $text.click(function() {
                        fieldClick();
                    });
                }
            }
            
            function sync()
            {                
                if ($this.is(':checked')) {
                    if ($checkbox) {
                        $checkbox.addClass('active');
                    }
                    if ($text) {
                        $text.addClass('active');
                    }
                } else {
                    if ($checkbox) {
                        $checkbox.removeClass('active');
                    }
                    if ($text) {
                        $text.removeClass('active');
                    }
                }
            }
            
            function fieldClick()
            {                
                if ($this.is(':checked')) {
                    $this.prop('checked', false);
                } else {
                    $this.prop('checked', true);
                }
                
                sync();
                
                $this.trigger("change");
                if (typeof settings.onChange === 'function') {
                    settings.onChange();
                }
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiCheckbox';
        
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
                pluginData = new OkiCheckboxClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
