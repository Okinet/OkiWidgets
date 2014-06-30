(function ($) {
        
    $.fn.OkiInput = function(param) {
        
        function OkiInputClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
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
            var $html = null;
            var settings = {
                usePlaceHolder    : true,
                dissableSpellCheck: true,
                cssClass          : null,
                cssIcon           : null
            };
            
            function buildHtml()
            {
                var html;
                var placeHolder;
                
                html = '<span>' +
                       '    <span>' +
                       '        <span>' +
                       '            <span>' +
                       '                <span>' +
                       '                    <span class="oi-place-holder"></span>' +
                       '                    <span class="oi-place-holder-mask">&nbsp;</span>' +
                       '                </span>' +
                       '            </span>' +
                       '        </span>' +
                       '    </span>' +
                       '    <i class="oi-icon"></i>' +
                       '</span>';
                   
                $html = $(html);
                
                if ($this.data('cssClass') && $this.data('cssClass')!="") {
                    $html.addClass($this.data('cssClass'));
                } else 
                    if (settings.cssClass!="") {
                        $html.addClass(settings.cssClass);
                    }
                
                if ($this.data('cssIcon') && $this.data('cssIcon')!="") {
                    $html.addClass($this.data('cssIcon'));
                    $html.addClass('oi-icon-visible');
                } else 
                    if (settings.cssIcon && settings.cssIcon!="") {
                        $html.addClass(settings.cssIcon);
                        $html.addClass('oi-icon-visible');
                    }
                
                $this.after($html);
                $html.find('span.oi-place-holder-mask').after($this);

                if (settings.dissableSpellCheck) {
                    $this.attr('spellcheck', false);
                }
                
                if (settings.usePlaceHolder) {
                    placeHolder = $this.attr('placeHolder');
                    $this.removeAttr('placeHolder');
                    if (placeHolder && placeHolder.toString().length>0)
                        placeHolder = placeHolder.toString();
                        $html.find('span.oi-place-holder').html(placeHolder);
                }
            }

            function init()
            {
                buildHtml();
                sync();
                connectEvents();
                $html.addClass('oki-input-base');
            }
            
            function connectEvents()
            {
                $this.keydown(function() {
                    sync();
                });
                $this.keyup(function() {
                    sync();
                });
                $html.mouseover(function() {
                    $html.addClass('oi-hover');
                });
                $html.mouseleave(function() {
                    $html.removeClass('oi-hover');
                });
                $this.change(function() {
                    sync();
                });
            }
            
            function sync()
            {
                if (settings.usePlaceHolder) {
                    if ($this.val().toString().length>0) {
                        $html.removeClass('oi-has-place-holder');
                    } else {
                        $html.addClass('oi-has-place-holder');
                    }
                }
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiInput';
        
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
                pluginData = new OkiInputClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
