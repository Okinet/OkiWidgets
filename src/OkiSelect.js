(function ($) {
        
    $.fn.OkiSelect = function(param) {
        
        function OkiSelectClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                sync : function() { sync(); return this.api; },
                getScrollApi : function() { return getScrollApi(); }
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
                cssClass              : 'select-filter',
                customOptionDb        : null,
                cloudWidth            : '231',
                cloudHeight           : '300',
                cloudComplex          : true,
                onlyCloudExpanded     : false,
                multipleNoneText      : 'Please choose something',
                multipleSelectedText  : 'Selected items: {items}'
            };
            var $select;
            var $selectCloud;
            var $selectOption;
            var $selectText;
            var $selectScroll;

            function init()
            {
                buildHtml(settings.cssClass);
                connectDependencies();
                sync();
                $this.hide();      // hide real select
            }
            
            function buildHtml(cssClass)
            {
                var html;
                
                if (settings.cloudComplex) {
                    html = '<div class="oki-select-base ' + cssClass + '">' +
                           '    <span><span><span></span></span></span>' +
                           '    <div class="s-cloud">' +
                           '        <div class="s-cloud-top"><div><div>&nbsp;</div></div></div>' +
                           '        <div class="s-cloud-middle">' +
                           '            <div>' +
                           '                <div>' +
                           '                    <div class="s-padd">' +
                           '                        <div class="scrollarea">' +
                           '                            <div class="sa-cont">' +
                           '                                <div class="sa-padd"></div>' +
                           '                            </div>' + 
                           '                        </div>' + 
                           '                    </div>' +
                           '                </div>' +
                           '            </div>' +
                           '        </div>' +
                           '        <div class="s-cloud-bottom"><div><div>&nbsp;</div></div></div>' +
                           '    </div>' +
                           '</div>';
                } else {
                    html = '<div class="oki-select-base ' + cssClass + '">' +
                           '    <span><span><span></span></span></span>' +
                           '    <div class="s-cloud">' +
                           '        <div class="s-padd">' + 
                           '            <div class="scrollarea">' +
                           '                <div class="sa-cont">' +
                           '                    <div class="sa-padd"></div>' +
                           '                </div>' + 
                           '            </div>' + 
                           '        </div>' +
                           '    </div>' +
                           '</div>';                    
                }
                
                $select = $(html);
                $selectCloud = $select.find("> .s-cloud");                
                $selectCloud.find('.s-padd:first').width(settings.cloudWidth);
                $selectCloud.find('.s-padd:first').height(settings.cloudHeight);
                $selectOption = $select.find('.sa-padd');
                $selectText = $select.find('> span > span > span');
                $selectScroll = $select.find('.scrollarea');
                if ($this.prop("multiple")) {
                    $select.addClass('s-multiple');
                }
                $this.after($select);
                
                if (settings.onlyCloudExpanded) {
                    $select.addClass('s-only-cloud');
                }
                
                /* // eeeee? it doesn't work... :/
                if (settings.cloudWidth=='auto') {
                    $selectCloud.find('.s-padd:first').width($this.width());
                }
                */
            }
            
            function connectDependencies()
            {
                $select.OkiCloud({
                    onShow: function() {
                                $selectScroll.OkiScrollArea('api').resize();
                            }
                });
                $selectScroll.OkiScrollArea();
                
                if (settings.onlyCloudExpanded) {
                    $selectScroll.OkiScrollArea('api').resize(); // TODO: check why it doesn't work
                }
            }
            
            function getScrollApi()
            {
                var scrollApi = null;
                
                try {
                    if ($selectScroll && $selectScroll.size()==1)
                        scrollApi = $selectScroll.OkiScrollArea('api');
                } catch(e) {
                }
                return scrollApi;
            }
            
            function sync()
            {
                var value, text, selected;
                var $tmpOption;
                
                $selectOption.html('');
                $this.find('option').each(function() {
                    selected = $(this).is(':selected');
                    value = $(this).attr('value');
                    text = $(this).html();
                    
                    if (typeof value === 'undefined')
                        value = '';
                    
                    $tmpOption = $('<a href="javascript:void(0)" data-value="' + value + '"><span>' + text + '</span></a>');
                    if (selected)
                        $tmpOption.addClass('active');
                    $selectOption.append($tmpOption);
                });
                
                $selectOption.find('> *').each(function() {
                    $(this).click(function() {
                        optionClick($(this).attr('data-value'));
                    });
                });
                setSelectedText( $this.find('option:selected').html() );
            }
            
            function setSelectedText(newText)
            {
                var text;
                
                if ($this.prop("multiple")) {
                    if ($this.find('option:selected').size()==0) {
                        $selectText.html(settings.multipleNoneText);
                    } else {
                        text = settings.multipleSelectedText;
                        text = text.replace('{items}', $this.find('option:selected').size());
                        $selectText.html(text);
                    }
                } else {
                    $selectText.html(newText);
                }
            }
            
            function optionClick(value)
            {
                var selectedOld, selectedNew;
                
                if ($this.prop("multiple")) {
                    selectedOld = $this.find('option[value=' + value + ']').is(':selected');
                    selectedNew = selectedOld ? false : true; // toggle
                    
                    $this.find('option[value=' + value + ']').prop('selected', selectedNew);
                    if (selectedNew) {
                        $selectOption.find('> *[data-value='+value+']').addClass('active');
                    } else {
                        $selectOption.find('> *[data-value='+value+']').removeClass('active');
                    }
                    setSelectedText('');
                
                } else {
                    $this.find('option').removeAttr('selected');
                    $this.find('option[value=' + value + ']').attr('selected', 'selected');
                    $selectOption.find('> *').removeClass('active');
                    $selectOption.find('> *[data-value='+value+']').addClass('active');
                    $select.OkiCloud('api').hide();
                    setSelectedText( $this.find('option[value=' + value + ']').html() );
                }
                
                $this.trigger("change");
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiSelect';
        
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
                pluginData = new OkiSelectClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
