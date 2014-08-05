(function ($) {
        
    $.fn.OkiSelect = function(param) {
        
        function OkiSelectClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
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

            /* -------------------------------------------------------------- */
            /* private: */
            var $this = null;
            var settings = {
                cssClass              : '',
                cloudWidth            : 'auto',         /* integer or 'auto' */
                cloudHeight           : 200,            /* integer or 'auto' */
                cloudComplex          : false,
                onlyCloudExpanded     : false,
                multipleNoneText      : 'Please choose something',
                multipleSelectedText  : 'Selected items: {items}',
                handleKeyResetTime    : 1000
            };
            var $select;
            var $selectCloud;
            var $selectOption;
            var $selectText;
            var $selectScroll;
            var $cloudComplexLeftPaddDiv = null;
            var $cloudComplexRightPaddDiv = null;
            var dimensionParserApi = null;
            var dimensionArray = null;
            var activeElementIndex = 0;
            var keyTimer = null;
            var keyWord = '';

            function init()
            {
                buildHtml();
                connectDependencies();
                sync();
                $this.wrap('<div class="oki-select-base-hidden"></div>');
                
                if (settings.onlyCloudExpanded) {
                    $select.OkiCloud('api').show();
                }
            }
            
            function buildHtml()
            {
                var html;
                var cssClass = settings.cssClass;
                
                if (settings.cloudComplex) {
                    html = '<div class="oki-select-base">' +
                           '    <span><span><span></span></span></span>' +
                           '    <div class="os-cloud">' +
                           '        <div class="os-cloud-top"><div><div>&nbsp;</div></div></div>' +
                           '        <div class="os-cloud-middle">' +
                           '            <div>' +
                           '                <div>' +
                           '                    <div class="os-padd">' +
                           '                        <div class="scrollarea"></div>' +
                           '                    </div>' +
                           '                </div>' +
                           '            </div>' +
                           '        </div>' +
                           '        <div class="os-cloud-bottom"><div><div>&nbsp;</div></div></div>' +
                           '    </div>' +
                           '</div>';
                } else {
                    html = '<div class="oki-select-base">' +
                           '    <span><span><span></span></span></span>' +
                           '    <div class="os-cloud">' +
                           '        <div class="os-padd">' + 
                           '            <div class="scrollarea"></div>' +
                           '            </div>' + 
                           '        </div>' +
                           '    </div>' +
                           '</div>';
                }
                
                $select = $(html);
                
                if ($this.data('cssClass') && $this.data('cssClass')!="") {
                    $select.addClass($this.data('cssClass'));
                } else 
                    if (settings.cssClass!="") {
                        $select.addClass(settings.cssClass);
                    }
                
                $selectCloud = $select.find("> .os-cloud");
                $selectText = $select.find('> span > span > span');
                $selectScroll = $select.find('.scrollarea');
                if ($this.prop("multiple")) {
                    $select.addClass('os-multiple');
                }
                $this.after($select);
                
                if (settings.onlyCloudExpanded) {
                    $select.addClass('s-only-cloud');
                }
                
                if (settings.cloudComplex) {
                    $cloudComplexLeftPaddDiv = $select.find('.os-cloud-middle > div > div');
                    $cloudComplexRightPaddDiv = $select.find('.os-cloud-middle > div');
                }
            }
            
            function getCloundWidth()
            {
                var w = $this.attr('dataCloudWidth') ? $this.attr('dataCloudWidth') : settings.cloudWidth;
                
                if (w=='auto') {
                    if ($cloudComplexLeftPaddDiv && $cloudComplexRightPaddDiv) {
                        w = $select.width() - parseInt($cloudComplexLeftPaddDiv.css('padding-left').replace('px', '')) - parseInt($cloudComplexRightPaddDiv.css('padding-right').replace('px', ''));
                    } else {
                        w = $select.width();
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
            
            function updateOptionContent()
            {
                if (dimensionArray!==null)
                    return;
                
                dimensionParserApi.recalculate();
                dimensionArray = dimensionParserApi.getDimensionArray();
                activeElementIndex = dimensionParserApi.getActiveElementIndex();

                if (dimensionArray) {
                    setScrollAtUnitPos(dimensionArray[activeElementIndex].unitPos);
                }
            }
            
            function strpos(haystack, needle, offset) 
            {
                var i = (haystack + '').indexOf(needle, (offset || 0));
                return i === -1 ? false : i;
            }
            
            function connectDependencies()
            {
                $select.OkiCloud({
                    onShow: function() {
                                var api = getScrollApi();
                                
                                if (api) {
                                    api.setViewportWidth(getCloundWidth());
                                    api.setViewportHeight(getCloundHeight());
                                    api.resize();
                                    if (!okiTool.isMobile()) {
                                        $this.focus();
                                    }
                                    
                                    updateOptionContent();
                                }
                                $select.addClass('os-expanded');
                            },
                    onHide: function() {
                                $select.removeClass('os-expanded');
                            }
                });
                $selectScroll.OkiScrollArea({
                    viewportWidth             : '100px',
                    viewportHeight            : '250px',
                    shortenWhenSmallerHeight  : true,
                    scrollHorizontalHeight    : 5,
                    scrollVerticalWidth       : 5
                });
                
                $selectOption = $select.find('.osa-padd');
                
                $this.OkiKeyboard({
                    mergeLeftAndRightAlt  : false,
                    keyAutoRepeat         : { delayTime: 1000, repeatTime: 50 },
                    keyEventCallback      : function(data) {
                                                if (data.pressed || data.repeated) {
                                                    handleKey(data);
                                                }
                                                if (((data.keyCode>=OkiKb.KEY_A && data.keyCode<=OkiKb.KEY_Z) || (data.keyCode>=OkiKb.KEY_0 && data.keyCode<=OkiKb.KEY_9) || data.keyCode==OkiKb.KEY_SPACE || data.keyCode==OkiKb.KEY_BACKSPACE || data.keyCode==OkiKb.KEY_ARROW_UP || data.keyCode==OkiKb.KEY_ARROW_DOWN || data.keyCode==OkiKb.KEY_ENTER || data.keyCode==OkiKb.KEY_ESCAPE) && data.eventJS) {
                                                    data.eventJS.preventDefault();
                                                }
                                            }
                });
                
                $selectOption.OkiDimensionParser({
                    elementsFindSelector : '> a',
                    valFindCallback      : function($el) { return $el.attr('data-value'); },
                    textFindCallback     : function($el) { return $el.find('span').html().toUpperCase(); },
                    activeFindCallback   : function($el) { return $el.hasClass('active'); }
                });
                dimensionParserApi = $selectOption.OkiDimensionParser('api');
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
                dimensionArray = null;
                $this.find('option').each(function() {
                    selected = $(this).is(':selected');
                    value = $(this).attr('value');
                    text = $(this).html();
                    
                    if (typeof value === 'undefined')
                        value = '';
                    
                    $tmpOption = $('<a href="javascript:void(0)" data-value="' + value + '"><span>' + text + '</span></a>');
                    if (selected) {
                        $tmpOption.addClass('active');
                    }
                    $selectOption.append($tmpOption);
                });
                
                $selectOption.find('> *').each(function() {
                    $(this).click(function() {
                        optionClick($(this).attr('data-value'));
                    });
                });
                setSelectedText( $this.find('option:selected').html() );
            }
            
            function handleKey(data)
            {
                var activeElementIndexNew = activeElementIndex;
                var character, previousCharacter;
                var i, j, pos;
                
                if (dimensionArray===null || dimensionArray.length==0 || $this.prop("multiple"))
                    return;
                
                clearTimeout(keyTimer);
                keyTimer = setTimeout(function() {
                    keyWord = '';
                }, settings.handleKeyResetTime);
                
                
                character = null;
                if (data.keyCode>=OkiKb.KEY_A && data.keyCode<=OkiKb.KEY_Z) {
                    character = String.fromCharCode( (data.keyCode - OkiKb.KEY_A) + ("A").toString().charCodeAt(0) );   
                }
                if (data.keyCode>=OkiKb.KEY_0 && data.keyCode<=OkiKb.KEY_9) {
                    character = String.fromCharCode( (data.keyCode - OkiKb.KEY_0) + ("0").toString().charCodeAt(0) );   
                }                
                if (data.keyCode==OkiKb.KEY_SPACE) {
                    character = ' ';
                }
                
                if (character) {
                    /*
                    console.log(data.keyCode);
                    console.log(character);
                    console.log(keyWord);
                    console.log('------');
                    */
                    if (keyWord!='') {
                        previousCharacter = keyWord.charAt(keyWord.length-1);
                    } else {
                        previousCharacter = '';
                    }
                    
                    if (character==previousCharacter && keyWord.length==1) {
                        for (i=1; i<dimensionArray.length; i++) {
                            j = (i + activeElementIndex) % dimensionArray.length;
                            pos = strpos(dimensionArray[j].text, keyWord);
                            if (pos===0) {
                                activeElementIndexNew = j;
                                break;
                            }
                        }
                    } else {
                        keyWord = keyWord + character;
                        for (i=0; i<dimensionArray.length; i++) {
                            pos = strpos(dimensionArray[i].text, keyWord);
                            if (pos===0) {
                                activeElementIndexNew = i;
                                break;
                            }
                        }
                    }
                }
                
                if (data.keyCode==OkiKb.KEY_ARROW_DOWN) {
                    activeElementIndexNew = (activeElementIndex + 1) % dimensionArray.length;   
                }
                
                if (data.keyCode==OkiKb.KEY_ARROW_UP) {
                    activeElementIndexNew--;
                    activeElementIndexNew = activeElementIndexNew<0 ? dimensionArray.length-1 : activeElementIndexNew;
                }
                
                if (data.keyCode==OkiKb.KEY_ESCAPE || data.keyCode==OkiKb.KEY_ENTER) {
                    $select.OkiCloud('api').hide();
                }
                
                if (activeElementIndexNew!=activeElementIndex) {
                    activeElementIndex = activeElementIndexNew;                 
                    optionClick( dimensionArray[activeElementIndex].val, true );
                    setScrollAtUnitPos(dimensionArray[activeElementIndex].unitPos);
                }
            }
            
            function setScrollAtUnitPos(unitPos)
            {
                var api = getScrollApi();
                
                if (api) {
                    api.setPositionY(unitPos);
                    api.resize();
                }
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
            
            function optionClick(value, dontHideCloud)
            {
                var selectedOld, selectedNew;
                
                if ($this.prop("multiple")) {
                    selectedOld = $this.find("option[value=" + "'"+value+"'" + "]").is(':selected');
                    selectedNew = selectedOld ? false : true; /* toggle */
                    
                    if (selectedNew) {
                        $selectOption.find("> *[data-value=" + "'"+value+"'" + "]").addClass('active');
                        $this.find("option[value=" + "'"+value+"'" + "]").attr('selected', 'selected');
                    } else {
                        $selectOption.find("> *[data-value=" + "'"+value+"'" + "]").removeClass('active');
                        $this.find("option[value=" + "'"+value+"'" + "]").removeAttr('selected', 'selected');
                    }
                    $this.find("option[value=" + "'"+value+"'" + "]").prop('selected', selectedNew);
                    setSelectedText('');
                
                } else {
                    $this.find('option').removeAttr('selected');
                    $this.find("option[value=" + "'"+value+"'" + "]").attr('selected', 'selected');
                    $selectOption.find('> *').removeClass('active');
                    $selectOption.find("> *[data-value=" + "'"+value+"'" + "]").addClass('active');
                    if (typeof dontHideCloud === 'undefined' || dontHideCloud==false) {
                        $select.OkiCloud('api').hide();
                    }
                    setSelectedText( $this.find("option[value=" + "'"+value+"'" + "]").html() );
                }
                
                $this.trigger("change");
            }
        }
        
        /* ------------------------------------------------------------------ */
        
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
