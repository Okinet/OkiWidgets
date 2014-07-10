(function ($) {
        
    $.fn.OkiAutoComplete = function(param) {
        
        function OkiAutoCompleteClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
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

            /* -------------------------------------------------------------- */
            /* private: */
            var $this = null;
            var settings = {
                cssClass              : 'autocomplete-default',
                cloudComplex          : false,
                cloudWidth            : 'auto',         /* integer or 'auto' */
                cloudHeight           : 200,            /* integer or 'auto' */
                onChangeCallback      : null,
                onClearCallback       : null,
                elementRenderCallback : null,
                dataSource            : null,
                dataLimit             : 10
            };
            var $autocomplete = null;
            var $cloudComplexLeftPaddDiv = null;
            var $cloudComplexRightPaddDiv = null;
            var $autocompleteCloud;
            var $autocompleteStatus;
            var $autocompleteOption;
            var $autocompleteScroll;
            var previousFilterText = null;
            var dimensionArray = null;
            var activeElementIndex = null;
            var preventCloudShow = false;
            var preventCloudShowTimer = null;

            function init()
            {
                buildHtml();
                connectDependencies();
            }
            
            function buildHtml()
            {
                var html;
                var cssClass = settings.cssClass;
                
                if (settings.cloudComplex) {
                    html = '<div class="oki-autocomplete-base ' + cssClass + '">' +
                           '    <div class="s-cloud">' +
                           '        <div class="s-cloud-top"><div><div>&nbsp;</div></div></div>' +
                           '        <div class="s-cloud-middle">' +
                           '            <div>' +
                           '                <div>' +
                           '                    <div class="s-padd">' +
                           '                        <div class="s-input-status"></div>' +
                           '                        <div class="scrollarea">' +
                           '                            <div class="osa-cont">' +
                           '                                <div class="osa-padd"></div>' +
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
                    html = '<div class="oki-autocomplete-base ' + cssClass + '">' +
                           '    <div class="s-cloud">' +
                           '        <div class="s-padd">' + 
                           '            <div class="s-input-status"></div>' +
                           '            <div class="scrollarea">' +
                           '                <div class="osa-cont">' +
                           '                    <div class="osa-padd"></div>' +
                           '                </div>' + 
                           '            </div>' + 
                           '        </div>' +
                           '    </div>' +
                           '</div>';
                }
                
                $autocomplete = $(html);
                $autocompleteCloud = $autocomplete.find("> .s-cloud");
                $autocompleteOption = $autocomplete.find('.osa-padd');
                $autocompleteStatus = $autocomplete.find('.s-input-status');
                $autocompleteScroll = $autocomplete.find('.scrollarea');
                
                if (settings.afterClosestElement!="") {
                    $this.closest(settings.afterClosestElement).after($autocomplete);
                } else {
                    $this.after($autocomplete);
                }
                
                if (settings.cloudComplex) {
                    $cloudComplexLeftPaddDiv = $autocomplete.find('.s-cloud-middle > div > div');
                    $cloudComplexRightPaddDiv = $autocomplete.find('.s-cloud-middle > div');
                }
            }
            
            function connectDependencies()
            {
                $autocompleteScroll.OkiScrollArea({
                    viewportWidth             : '100px',
                    viewportHeight            : '250px',
                    shortenWhenSmallerHeight  : true
                });
                
                $autocomplete.OkiCloud({
                    onShow: function() {
                                var api = $autocompleteScroll.OkiScrollArea('api');

                                api.setViewportWidth(getCloundWidth());
                                api.setViewportHeight(getCloundHeight());
                                api.resize();
                                updateOptionContent();
                            }
                });

                $this.OkiKeyboard({
                    mergeLeftAndRightAlt  : false,
                    keyAutoRepeat         : { delayTime: 1000, repeatTime: 50 },
                    keyEventCallback      : function(data) {
                                                if ($this.val().toString().length>0) {
                                                    if (!preventCloudShow) {
                                                        if (previousFilterText!==$this.val().toString()) {
                                                            newFilteredList($this.val().toString());
                                                            previousFilterText = $this.val().toString();
                                                        }                                                    
                                                        $autocomplete.OkiCloud('api').show();
                                                    }
                                                } else {
                                                    $autocomplete.OkiCloud('api').hide();
                                                    
                                                    if (typeof settings.onClearCallback === 'function') {
                                                        settings.onClearCallback(settings.dataSource);
                                                    }
                                                }
                        
                                                if (data.pressed || data.repeated) {
                                                    handleKey(data);
                                                }
                                                if ((data.keyCode==OkiKb.KEY_ARROW_UP || data.keyCode==OkiKb.KEY_ARROW_DOWN || data.keyCode==OkiKb.KEY_ENTER || data.keyCode==OkiKb.KEY_ESCAPE) && data.eventJS) {
                                                    data.eventJS.preventDefault();
                                                }
                                            }
                });
                
                $autocompleteOption.OkiDimensionParser({
                    elementsFindSelector : '> .elem',
                    valFindCallback      : function($el) { return $el.attr('data-value'); },
                    textFindCallback     : function($el) { return $el.attr('data-text'); },
                    activeFindCallback   : function($el) { return $el.hasClass('active'); }
                });
            }
            
            function newFilteredList(text)
            {
                var dataSource = new Array();
                
                if (typeof settings.dataSource === 'string') {
                    /* TODO: ajax here */

                } else if (settings.dataSource.size()==1 && settings.dataSource.find('> option').size()>0) {
                    /* select/option here */
                    settings.dataSource.find('> option').each(function() {
                        var element = {
                            value : $(this).val(),
                            text  : $(this).html()
                        }
                        if (strpos(element.text.toString().toUpperCase(), text.toString().toUpperCase())===0) {
                            dataSource.push(element);
                        }
                    });
                    newFilteredListReady(dataSource);
                    
                }
                
                dimensionArray = null;
                activeElementIndex = null;
            }
            
            function strpos(haystack, needle, offset) 
            {
                var i = (haystack + '').indexOf(needle, (offset || 0));
                return i === -1 ? false : i;
            }
            
            function newFilteredListReady(dataSource)
            {
                var $tmpOption;
                var renderedHtml;
                var i;
                
                $autocompleteOption.html('');
                for (i=0; i<Math.min(dataSource.length, settings.dataLimit); i++) {
                    if (typeof settings.elementRenderCallback === 'function') {
                        renderedHtml = settings.elementRenderCallback(dataSource[i]);
                    } else {
                        renderedHtml = dataSource[i].text;
                    }
                    
                    $tmpOption = $('<div class="elem" data-value="' + dataSource[i].value + '" data-text="' + dataSource[i].text + '">' + renderedHtml + '</div>');
                    $autocompleteOption.append($tmpOption);
                }
                $autocompleteOption.find('> .elem').each(function() {
                    $(this).click(function() {
                        optionClick($(this).attr('data-value'), $(this).attr('data-text'));
                    });
                });
                
                if (dataSource.length==0) {
                    $autocompleteStatus.html('Brak wyników').addClass('text-inside');
                } else {
                    $autocompleteStatus.html('').removeClass('text-inside');
                }
            }
            
            function handleKey(data)
            {
                var activeElementIndexNew = activeElementIndex;
                
                if (dimensionArray===null || dimensionArray.length==0)
                    return;
                
                if (data.keyCode==OkiKb.KEY_ARROW_DOWN) {
                    if (activeElementIndexNew!==null) {
                        activeElementIndexNew = (activeElementIndex + 1) % dimensionArray.length;   
                    } else {
                        activeElementIndexNew = 0;
                    }
                }
                
                if (data.keyCode==OkiKb.KEY_ARROW_UP) {
                    if (activeElementIndexNew!==null) {
                        activeElementIndexNew--;
                        activeElementIndexNew = activeElementIndexNew<0 ? dimensionArray.length-1 : activeElementIndexNew;
                    } else {
                        activeElementIndexNew = dimensionArray.length-1;
                    }
                }
                
                if (data.keyCode==OkiKb.KEY_ESCAPE || data.keyCode==OkiKb.KEY_ENTER) {
                    $autocomplete.OkiCloud('api').hide();
                }
                
                if (data.keyCode==OkiKb.KEY_ENTER && activeElementIndexNew!==null) {
                    optionClick( dimensionArray[activeElementIndexNew].val, dimensionArray[activeElementIndexNew].text );
                    setScrollAtUnitPos(dimensionArray[activeElementIndexNew].unitPos);
                }
                
                if (activeElementIndexNew!=activeElementIndex) {
                    activeElementIndex = activeElementIndexNew;                 
                    optionClick( dimensionArray[activeElementIndex].val, dimensionArray[activeElementIndex].text, true );
                    setScrollAtUnitPos(dimensionArray[activeElementIndex].unitPos);
                }
            }
            
            function setScrollAtUnitPos(unitPos)
            {
                var api = $autocompleteScroll.OkiScrollArea('api');
                
                api.setPositionY(unitPos);
                api.resize();
            }
            
            function updateOptionContent()
            {
                var api;
                
                if (dimensionArray!==null)
                    return;
                
                api = $autocompleteOption.OkiDimensionParser('api');
                api.recalculate();
                dimensionArray = api.getDimensionArray();
            }
            
            function optionClick(value, text, dontHideCloud)
            {
                $autocompleteOption.find('> *').removeClass('active');
                $autocompleteOption.find('> *[data-value='+value+']').addClass('active');
                if (typeof dontHideCloud === 'undefined' || dontHideCloud==false) {
                    $autocomplete.OkiCloud('api').hide();
                    $this.val(text);
                    
                    if (typeof settings.onChangeCallback === 'function') {
                        settings.onChangeCallback(value, text, settings.dataSource);
                    }
                    
                    preventCloudShow = true;
                    clearTimeout(preventCloudShowTimer);
                    preventCloudShowTimer = setTimeout(function() {
                        preventCloudShow = false;
                    }, 600);
                }
                
                $this.trigger("change");
            }
            
            function getCloundWidth()
            {
                var w = $this.attr('dataCloudWidth') ? $this.attr('dataCloudWidth') : settings.cloudWidth;
                
                if (w=='auto') {
                    if ($cloudComplexLeftPaddDiv && $cloudComplexRightPaddDiv) {
                        w = $autocomplete.width() - parseInt($cloudComplexLeftPaddDiv.css('padding-left').replace('px', '')) - parseInt($cloudComplexRightPaddDiv.css('padding-right').replace('px', ''));
                    } else {
                        w = $autocomplete.width();
                    }
                } else {
                    w = parseInt(w);
                }
                
                return w + 'px';
            }
            
            function getCloundHeight()
            {
                var h = $this.attr('dataCloudHeight') ? $this.attr('dataCloudHeight') : settings.cloudHeight;
                
                if (h=='auto') {
                    h = 250;
                } else {
                    h = parseInt(h);
                }
                
                return h + 'px';
            }
            
        }
        
        /* ------------------------------------------------------------------ */
        
        var pluginData;
        var pluginDataName = 'OkiAutoComplete';
        
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
                pluginData = new OkiAutoCompleteClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
