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
                cssClass          : 'oki-input'
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
                       '                    <span class="inp-ph"></span>' +
                       '                    <span class="inp-ph-mask">&nbsp;</span>' +
                       '                    <input type="text" spellcheck="false" value="" />' +
                       '                </span>' +
                       '            </span>' +
                       '        </span>' +
                       '    </span>' +
                       '</span>';
                   
                $html = $(html);
                
                if (settings.cssClass!="") {
                    $html.attr('class', settings.cssClass);
                }
                
                $this.after($html);
                $html.find('span.inp-ph-mask').after($this);

                if (settings.dissableSpellCheck) {
                    $this.attr('spellcheck', false);
                }
                
                if (settings.usePlaceHolder) {
                    placeHolder = $this.attr('placeHolder');
                    $this.removeAttr('placeHolder');
                    if (placeHolder && placeHolder.toString().length>0)
                        placeHolder = placeHolder.toString();
                        $html.find('span.inp-ph').html(placeHolder);
                }
            }

            function init()
            {
                buildHtml();
                sync();
                connectEvents();
            }
            
            function connectEvents()
            {
                $this.keydown(function() {
                    sync();
                });
                $this.keyup(function() {
                    sync();
                });
            }
            
            function sync()
            {
                if (settings.usePlaceHolder) {
                    if ($this.val().toString().length>0) {
                        $html.removeClass('place-holder');
                    } else {
                        $html.addClass('place-holder');
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
