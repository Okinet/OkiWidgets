(function ($) {
    $.fn.OkiSplitter = function(param) {
        
        function OkiSplitterClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
            this.api = {
                resize : function(parentWidth, parentHeight) { resize(parentWidth, parentHeight); return this.api; },
                changeSize : function(colIndex, newValue) { changeSize(colIndex, newValue); return this.api; }
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
                orientation                      : "horizontal",
                tag                              : "div",
                tagContent                       : "div",
                cells                            : new Array(),
                secondOrientationSizeFromContent : false,
                cellSizeContentChangeIntervalMs  : 50,
                onCellSizeContentChange          : null
            };
            var cellSizeContentChangeInterval;
            var cellSizeContentArr = null;

            function init()
            {
                $this.css('position', 'relative');
                $this.width(0);
                $this.height(0);
                
                $this.find('> '+settings.tag).each(function() {    
                    $(this).css('position', 'absolute');
                    $(this).css('top', '0px');
                    $(this).css('left', '0px');
                    $(this).width(0);
                    $(this).height(0);
                });
                
                cellSizeContentChangeInterval = setInterval(cellSizeContentChangeIntervalHandler, settings.cellSizeContentChangeIntervalMs);
            }
            
            function cellSizeContentChangeIntervalHandler()
            {
                var contentDiv;
                var w, h;
                var firstInit = false;
                var sizeContentChanged = false;
                var j;
                
                if (typeof settings.onCellSizeContentChange === 'function') {
                    
                    if (cellSizeContentArr===null) {
                        cellSizeContentArr = new Array();
                        firstInit = true;
                        sizeContentChanged = true;
                    }
                    
                    j = 0;
                    for (var i=0; i<settings.cells.length; i++) {
                        if (settings.cells[i].size=='content' || settings.cells[i].size=='auto') {
                            contentDiv = $this.find('> '+settings.tag).eq(i).find('> '+settings.tagContent);
                            w = contentDiv.width();
                            h = contentDiv.height();
                            
                            if (firstInit) {
                                cellSizeContentArr.push({width: w, height: h});
                            } else {
                                if (cellSizeContentArr[j].width!=w || cellSizeContentArr[j].height!=h) {
                                    sizeContentChanged = true;
                                }
                                cellSizeContentArr[j].width = w;
                                cellSizeContentArr[j].height = h;
                            }
                            j++;
                        }
                    }
                    
                    if (j!=0 && sizeContentChanged)
                        settings.onCellSizeContentChange();
                }
            }
            
            function changeSize(colIndex, newValue)
            {
                settings.cells[colIndex] = newValue;
            }

            function resize(parentWidth, parentHeight)
            {
                var i;
                var sizeLeft, size, sizeOffset, sizeMax, sizeSum;
                var countAuto, countContent;
                
                if (parseInt(parentWidth)>0 && parseInt(parentHeight)>0) {
                    parentWidth = parseInt(parentWidth);
                    parentHeight = parseInt(parentHeight);
                } else {
                    parentWidth = $this.parent().width();
                    parentHeight = $this.parent().height();
                }
               
                
                if (settings.orientation=="horizontal") {
                    
                    $this.width(parentWidth);
                    sizeLeft = parentWidth;
                    
                    if (settings.secondOrientationSizeFromContent)
                        $this.height('auto'); else
                        $this.height(parentHeight);


                    /* set non auto sizes */
                    countAuto = 0;
                    countContent = 0;
                    sizeSum = 0;
                    $this.find('> '+settings.tag).each(function(i) {
                        if (settings.secondOrientationSizeFromContent)
                            $(this).height('auto'); else
                            $(this).height(parentHeight);

                        size = 0;
                        switch (settings.cells[i].size) {
                            case 'auto'   : countAuto++;
                                            break;
                            case 'content': countContent++;
                                            size = $(this).find('> '+settings.tagContent).width();
                                            $(this).width( size );
                                            break;
                            default       : size = settings.cells[i].size;
                                            $(this).width( size );
                                            sizeLeft -= size;
                        }

                        sizeSum += size;
                    });

                    if (countAuto>0 && countContent>0) {
                        throw "ERROR: can't use both auto and content size (countAuto=" + countAuto + ", countContent=" + countContent + ")";
                        $this.hide();
                    }

                    /* update width if size is content based */
                    if (countContent>0) {
                        $this.width(sizeSum);
                    }

                    /* setup auto values and top offset */
                    sizeOffset = 0;
                    $this.find('> '+settings.tag).each(function(i) {
                        switch (settings.cells[i].size) {
                            case 'auto'   : size = Math.floor(sizeLeft/countAuto);
                                            size = size<0 ? 0 : size;
                                            $(this).width( size );
                                            sizeLeft -= size;
                                            countAuto--;
                                            break;
                            case 'content': size = $(this).width();
                                            break;
                            default       : size = settings.cells[i].size;
                        }

                        $(this).css('left', sizeOffset+'px');
                        sizeOffset += size;
                    });

                    /* find max height */
                    sizeMax = -1;
                    if (settings.secondOrientationSizeFromContent) {
                        $this.find('> '+settings.tag).each(function() {
                            sizeMax = $(this).height() > sizeMax ? $(this).height() : sizeMax;
                        });
                        
                        $this.height(sizeMax);
                        $this.find('> '+settings.tag).each(function() {
                            $(this).height(sizeMax);
                        });
                    }
                    
                } else
                    if (settings.orientation=="vertical") {
                        
                        $this.height(parentHeight);
                        sizeLeft = parentHeight;

                        if (settings.secondOrientationSizeFromContent) 
                            $this.width('auto'); else
                            $this.width(parentWidth);
                        

                        /* set non auto sizes */
                        countAuto = 0;
                        countContent = 0;
                        sizeSum = 0;
                        $this.find('> '+settings.tag).each(function(i) {
                            if (settings.secondOrientationSizeFromContent)
                                $(this).width('auto'); else
                                $(this).width(parentWidth);

                            size = 0;
                            switch (settings.cells[i].size) {
                                case 'auto'   : countAuto++;
                                                break;
                                case 'content': countContent++;
                                                size = $(this).find('> '+settings.tagContent).height();
                                                $(this).height( size );
                                                break;
                                default       : size = settings.cells[i].size;
                                                $(this).height( size );
                                                sizeLeft -= size;
                            }
                            
                            sizeSum += size;
                        });
                        
                        if (countAuto>0 && countContent>0) {
                            throw "ERROR: can't use both auto and content size (countAuto=" + countAuto + ", countContent=" + countContent + ")";
                            $this.hide();
                        }
                        
                        /* update height if size is content based */
                        if (countContent>0) {
                            $this.height(sizeSum);
                        }

                        /* setup auto values and left offset */
                        sizeOffset = 0;
                        $this.find('> '+settings.tag).each(function(i) {
                            switch (settings.cells[i].size) {
                                case 'auto'   : size = Math.floor(sizeLeft/countAuto);
                                                size = size<0 ? 0 : size;
                                                $(this).height( size );
                                                sizeLeft -= size;
                                                countAuto--;
                                                break;
                                case 'content': size = $(this).height();
                                                break;
                                default       : size = settings.cells[i].size;
                            }

                            $(this).css('top', sizeOffset+'px');
                            sizeOffset += size;
                        });
                        
                        /* find max width */
                        sizeMax = -1;
                        if (settings.secondOrientationSizeFromContent) {
                            $this.find('> '+settings.tag).each(function() {
                                sizeMax = $(this).width() > sizeMax ? $(this).width() : sizeMax;
                            });

                            $this.width(sizeMax);
                            $this.find('> '+settings.tag).each(function() {
                                $(this).width(sizeMax);
                            });
                        }
                        
                    }
            }

        }
        
        /* ------------------------------------------------------------------ */
        
        var pluginData;
        var pluginDataName = 'OkiSplitter';
        
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
                pluginData = new OkiSplitterClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
})(jQuery);