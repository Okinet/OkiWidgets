$(document).ready(function() {
    $(document).on('click touchstart', function() {
        $('.oki-cloud-inited').each(function() {
            try {
                var api = $(this).OkiCloud('api');

                if (api && !$(this).hasClass('oki-cloud-mouseover')) {
                    api.hide();
                }
            } catch(e) {
            }
        });
    });
});

(function ($) {
        
    $.fn.OkiCloud = function(param) {
        
        function OkiCloudClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                hide : function() { hide(); return this.api; },
                show : function() { show(); return this.api; }
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
                cloudSelector : '> div:last',
                onShow        : null
            };
            
            var $cloud;

            function init()
            {
                $cloud = $this.find(settings.cloudSelector);
                
                $this.mouseover(function() {
                    $(this).addClass('oki-cloud-mouseover');
                });
                $this.mouseleave(function() {
                    $(this).removeClass('oki-cloud-mouseover');
                });
                $this.click(function() {
                    show();
                });
                
                $this.addClass('oki-cloud-inited');
            }
            
            function show()
            {
                //$cloud.show();
                $cloud.addClass('s-cloud-showed');
                if (typeof settings.onShow === 'function') {
                    settings.onShow();
                }
            }
            
            function hide()
            {
                // hide on next iteration of JS event loop
                setTimeout(function() {
                    //$cloud.hide();
                    $cloud.removeClass('s-cloud-showed');
                }, 1)
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiCloud';
        
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
                pluginData = new OkiCloudClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
