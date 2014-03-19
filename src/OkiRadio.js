(function ($) {
        
    $.fn.OkiRadio = function(param) {
        
        function OkiRadioClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                sync : function() { sync(false); return this.api; }
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
                radioSelector     : 'a',
                textSelector      : 'span',
                onChange          : null
            };
            var $radio = null;
            var $text = null;

            function init()
            {
                if (settings.radioSelector) {
                    $radio = $this.next(settings.radioSelector);
                    if ($radio.size()!=1)
                        $radio = null;
                }
                if (settings.textSelector) {
                    $text = $this.nextUntil('input[type=radio]').filter(settings.textSelector).eq(0);
                    if ($text.size()!=1)
                        $text = null;
                }

                sync(false);
                connectEvents();
                $this.hide();      // hide real select
            }
            
            function connectEvents()
            {
                if ($radio) {
                    $radio.click(function() {
                        fieldClick();
                    });
                }
                if ($text) {
                    $text.click(function() {
                        fieldClick();
                    });
                }
            }
            
            function sync(all)
            {
                var name;
                var $form;
                var $radioCollection;
                
                if (all) {
                    
                    name = $this.attr('name');
                    $form = $this.closest('form');
                    if ($form.size()==1) {
                        $radioCollection = $form.find('input[type=radio][name]');
                    } else {
                        $radioCollection = $('input[type=radio][name]');
                    }                    
                    $radioCollection.each(function() {
                        var api = null;
                        try {
                            api = $(this).OkiRadio('api')
                        } catch(e) {
                        }
                        if (api!==null) {
                            api.sync();
                        }
                    })
                    
                } else {

                    if ($this.is(':checked')) {
                        if ($radio) {
                            $radio.addClass('active');
                        }
                        if ($text) {
                            $text.addClass('active');
                        }
                    } else {
                        if ($radio) {
                            $radio.removeClass('active');
                        }
                        if ($text) {
                            $text.removeClass('active');
                        }
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
                
                sync(true);
                
                $this.trigger("change");
                if (typeof settings.onChange === 'function') {
                    settings.onChange();
                }
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiRadio';
        
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
                pluginData = new OkiRadioClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
