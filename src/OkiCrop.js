(function ($) {
        
    $.fn.OkiCrop = function(param) {
        
        function OkiCropClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
            this.api = {
                sync : function() { sync(); return this.api; },
                resize : function() { resize(); return this.api; },
                fitToImage : function() {  },
                fitToViewport : function() {  },
                editOn : function() {  },
                editOff : function() {  },
                serverCroppedOn : function() {  },
                serverCroppedOff : function() {  }
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
            var $viewport = null;
            var zeroDimensionFlag = false;
            var settings = {
                scrollZoomSpeed   : 0.01,               /* Zoom step on one mouse scroll tick */
                cropDataLocation  : null,               /* If null/'' plugin will look for cropData in $this element. You can put selector to any other tag. If You specify input[type=text] plugin will look in value attribute. */
                cropDataAtribute  : 'data-crop',        /* If cropDataLocation isn't input tag here you can specify in what attribute cropData is stored */
                orygImgAtribute   : 'data-oryg-img',    /* This is path to oryginal file before cropping */
                autoFitSize       : true,               /* Apply auto fit size if plugin can't find cropData */
                wrapWithParentTag : 'div',              /* Put here tag name for wraping $this or null if required parent already exists before plugin init */
                viewportWidth     : null,               /* ?? */
                viewportHeight    : null,               /* ?? */
                onChange          : null,
                precision         : 1000000,            /* presition of storing float values as integers in packed cropData state */
                serverCropped     : false
            };
            /* cropState (in unit float variables) */
            var unitZoomFactor;
            var unitPosX, unitPosY;
            /* edit state range */
            var rangeZoomFactorMin = null, rangeZoomFactorMax = null;
            var rangePosMinX = null, rangePosMaxX = null;
            var rangePosMinY = null, rangePosMaxY = null;
            /* viewport params */
            var viewportWidth;
            var viewportHeight;
            var viewportRatio;
            var viewportMinDimension;
            var viewportMaxDimension;
            /* image params */
            var imgMaxDimension;
            var imgMinDimension;
            var imgWidth;
            var imgHeight;
            var imgRatio;
            /* data for css */
            var cssLeft;
            var cssTop;
            var cssWidth;
            var cssHeight;

            function init()
            {
                findOrSetWraper();
                resize();
                setupMouseEvents();
            }
            
            function updateRanges()
            {
                var factorOfMinZoom;
                
                /* find zoom factor that fit entire image into viewport */
                if (viewportRatio>1.0) {
                    if (imgRatio>viewportWidth) {
                        rangeZoomFactorMin = viewportWidth / imgWidth;
                    } else {
                        rangeZoomFactorMin = viewportHeight / imgHeight;
                    }
                } else {
                    if (imgRatio>viewportWidth) {
                        rangeZoomFactorMin = viewportWidth / imgWidth;
                    } else {
                        rangeZoomFactorMin = viewportHeight / imgHeight;
                    }
                }
  
                rangePosMinX = viewportWidth/2;
                rangePosMaxX = 0;
                rangePosMinY = 0;
                rangePosMaxY = 0;
            }
            
            function resize()
            {
                /* image */
                $this.css('width', 'auto');
                $this.css('height', 'auto');
                imgWidth = $this.width();
                imgHeight = $this.height();
                imgMinDimension = imgWidth<=imgHeight ? imgWidth : imgHeight;
                imgMaxDimension = imgWidth>imgHeight ? imgWidth : imgHeight;
                if (imgWidth==0 || imgHeight==0) {
                    zeroDimensionFlag = true;
                    return;
                }
                imgRatio = imgWidth / imgHeight;
                
                /* viewport */
                if (!settings.viewportWidth || !settings.viewportHeight) {
                    viewportWidth = $viewport.width();
                    viewportHeight = $viewport.height();
                } else
                    if (settings.viewportWidth!='auto' && settings.viewportHeight!='auto' && settings.viewportWidth>0 && settings.viewportHeight>0) {
                        viewportWidth = settings.viewportWidth;
                        viewportHeight = settings.viewportHeight;
                    } else 
                        if (settings.viewportWidth=='auto' || settings.viewportHeight=='auto') {
                            throw "OkiCrop - can't use 'auto' in both viewportWidth and viewportHeight";
                        } else
                            if (settings.viewportWidth=='auto') {
                                viewportHeight = settings.viewportHeight;
                                viewportWidth = Math.round(imgRatio * viewportHeight);
                            } else 
                                if (settings.viewportHeight=='auto') {
                                    viewportWidth = settings.viewportWidth;
                                    viewportHeight = Math.round(viewportWidth/imgRatio);
                                }
                            
                viewportRatio = viewportWidth / viewportHeight;
                viewportMinDimension = viewportWidth<=viewportHeight ? viewportWidth : viewportHeight;
                viewportMaxDimension = viewportWidth>viewportHeight ? viewportWidth : viewportHeight;
                
                /* update ranges */
                updateRanges();
            }
            
            function getCropData()
            {
                var cropData = null;
                var $cdl;
                
                if (settings.cropDataLocation===null || settings.cropDataLocation===false || settings.cropDataLocation==='') {
                    cropData = $this.attr(settings.cropDataAtribute);
                } else {
                    $cdl = $this.parent().find(settings.cropDataLocation);
                    if ($cdl.is('input:text')) {
                        cropData = $cdl.val();
                    } else {
                        cropData = $cdl.attr(settings.cropDataAtribute);
                    }
                }
                
                return cropData;
            }
            
            function setCropData(cropData)
            {
                var $cdl;
                
                if (settings.cropDataLocation===null || settings.cropDataLocation===false || settings.cropDataLocation==='') {
                     $this.attr(settings.cropDataAtribute, cropData);
                } else {
                    $cdl = $this.parent().find(settings.cropDataLocation);
                    if ($cdl.is('input:text')) {
                        $cdl.val(cropData);
                    } else {
                        $cdl.attr(settings.cropDataAtribute, cropData);
                    }
                }
            }
            
            function pack()
            {
                var unitZoomFactorPack = Math.round(unitZoomFactor * settings.precision);
                var unitPosXPack = Math.round(unitPosX * settings.precision);
                var unitPosYPack = Math.round(unitPosY * settings.precision);
                
                setCropData(unitZoomFactorPack+'|'+unitPosXPack+'|'+unitPosYPack);
            }
            
            function unpack()
            {
                var cropData = getCropData();
                var cropDataArr = explode('|', cropData);
                
                if (cropDataArr && cropDataArr.length==3) {
                    unitZoomFactor = parseInt(cropDataArr[0]) / settings.precision;
                    unitPosX = parseInt(cropDataArr[1]) / settings.precision;
                    unitPosY = parseInt(cropDataArr[2]) / settings.precision;
                }
                
                if (unitZoomFactor<0.0 || unitZoomFactor>1.0 || unitPosX<0.0 || unitPosX>1.0 || unitPosY<0.0 || unitPosY>1.0) {
                    /* default values */
                    unitZoomFactor = 0.0;
                    unitPosX = 0.5;
                    unitPosY = 0.5;
                }
            }
            
            function findOrSetWraper()
            {
                var html;
                
                if (settings.wrapWithParentTag) {
                    html = '<'+settings.wrapWithParentTag+'><'+settings.wrapWithParentTag+'>';
                    $viewport = $(html);
                    $this.after($viewport);
                    $viewport.append($this);
                } else {
                    $viewport = $this.parent()
                }
            }
            
            function mouseMoved(diffX, diffY)
            {
                console.log(viewportWidth);
                console.log(viewportHeight);
                console.log(imgWidth);
                console.log(imgHeight);
                updateCrop();
            }
            
            function updateCrop()
            {
                cssLeft = 0;
                cssTop = 0;
                cssWidth = rangeZoomFactorMin * imgWidth;
                cssHeight = rangeZoomFactorMin * imgHeight;
                
                console.log(imgWidth + 'x' + imgHeight);
                console.log(cssWidth + 'x' + cssHeight);
                
                $this.css('left', cssLeft + 'px');
                $this.css('top', cssTop + 'px');
                $this.css('width', cssWidth + 'px');
                $this.css('height', cssHeight + 'px');
            }
            
            function serverCroppedOn()
            {
                settings.serverCropped = true;
                updateCrop();
            }
            
            function serverCroppedOff()
            {
                settings.serverCropped = false;
                $this.css('left', 'auto');
                $this.css('top', 'auto');
                $this.css('width', 'auto');
                $this.css('height', 'auto');
            }
            
            function setupMouseEvents()
            {
                var mouseSavedX = null, mouseSavedY = null;
                
                $viewport.mousedown(function(e) {
                    if (e.button==0) {
                        mouseSavedX = e.clientX;
                        mouseSavedY = e.clientY;
                    }
                    e.preventDefault();
                });
                
                $(document).mousemove(function(e) {
                    var diffX, diffY;
                    if (mouseSavedX===null || mouseSavedY===null) {
                        return;
                    }
                    diffX = e.clientX - mouseSavedX;
                    diffY = e.clientY - mouseSavedY;
                    mouseSavedX = e.clientX;
                    mouseSavedY = e.clientY;
                    
                    mouseMoved(diffX, diffY);
                });
                
                $(document).mouseup(function(e) {
                    mouseSavedX = null;
                    mouseSavedY = null;
                });
                
                $this.mousewheel(function(event, delta, deltaX, deltaY) {
                    event.preventDefault();
                    if (deltaY<0)
                        addOffsetY(settings.scrollStep);
                    if (deltaY>0)
                        addOffsetY(-settings.scrollStep);
                    if (deltaX<0)
                        addOffsetX(settings.scrollStep);
                    if (deltaX>0)
                        addOffsetX(-settings.scrollStep);
                });
            }
            
            function explode(delimiter, string, limit)
            {
                /*  discuss at: http://phpjs.org/functions/explode/ */
                /* original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net) */
                /*   example 1: explode(' ', 'Kevin van Zonneveld'); */
                /*   returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'} */
                
                if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
                if (delimiter === '' || delimiter === false || delimiter === null) return false;
                if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
                    'object') {
                    return {
                        0: ''
                    };
                }
                if (delimiter === true) delimiter = '1';
                
                /* Here we go... */
                delimiter += '';
                string += '';
                
                var s = string.split(delimiter);
                
                if (typeof limit === 'undefined') return s;
                
                /* Support for limit */
                if (limit === 0) limit = 1;
                
                /* Positive limit */
                if (limit > 0) {
                    if (limit >= s.length) return s;
                    return s.slice(0, limit - 1)
                    .concat([s.slice(limit - 1)
                        .join(delimiter)
                    ]);
                }
                
                /* Negative limit */
                if (-limit >= s.length) return [];
                
                s.splice(s.length + limit);
                return s;
            }
            
        }
        
        /* ------------------------------------------------------------------ */
        
        var pluginData;
        var pluginDataName = 'OkiCrop';
        
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
                pluginData = new OkiCropClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
