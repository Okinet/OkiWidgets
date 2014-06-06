$(document).ready(function() {
    $(document).on('click touchstart', function() {
        $('.oc-inited').each(function() {
            try {
                var api = $(this).OkiCloud('api');

                if (api && !$(this).find('> .oc-hidden-content').hasClass('oc-mouseover')) {
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
                cloudSelector : '> *:last',
                onShow        : null,
                onHide        : null,
                realHide      : true
            };
            var cloudTimerId;
            var hideBlockFlag = false;
            var $cloud;

            function init()
            {
                $this.addClass('oki-cloud-base');
                $cloud = $this.find(settings.cloudSelector);
                $cloud.addClass('oc-hidden-content');
                
                $cloud.mouseover(function() {
                    $(this).addClass('oc-mouseover');
                });
                $cloud.mouseleave(function() {
                    $(this).removeClass('oc-mouseover');
                });
                $this.click(function() {
                    show();
                });
                
                $this.addClass('oc-inited');
            }
            
            function show()
            {
                if ($cloud.hasClass('oc-showed')) {
                    return;
                }

                $cloud.addClass('oc-showed');
                if (settings.realHide) {
                    $cloud.show();
                }
                
                clearTimeout(cloudTimerId);
                cloudTimerId = setTimeout(function() {
                    hideBlockFlag = false;
                }, 10);
                hideBlockFlag = true;
                if (typeof settings.onShow === 'function') {
                    settings.onShow($this);
                }
            }
            
            function hide()
            {
                if (!$cloud.hasClass('oc-showed')) {
                    return;
                }
                
                if (hideBlockFlag) {
                    return;
                }
                // hide on next iteration of JS event loop - this code should run AFTER any bubbled show event!
                setTimeout(function() {
                    $cloud.removeClass('oc-showed');
                    if (settings.realHide) {
                        $cloud.hide();
                    }
                    if (typeof settings.onHide === 'function') {
                        settings.onHide($this);
                    }
                }, 1);
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
