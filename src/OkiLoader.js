(function ($) {
        
    $.fn.OkiLoader = function(param) {
        
        function OkiLoaderClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
            this.api = {
                submitRequest : function(url, method, parameters, successCallback, errorCallback) { submitRequest(url, method, parameters, successCallback, errorCallback); return this.api; }
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
                indicatorObj      : null,      /* selector to ajax indicator */
                indicatorFrames   : 12,        /* if you have PNG sprite put here number of frames */
                indicatorFps      : 25         /* animation fps of PNG sprite */
            };
            var AJAX_INC = 1;
            var AJAX_DEC = -1;
            var ajaxUrls = new Array();
            var activeUrlCounter = 0;
            var indicatorFrame = 0
            var indicatorFrameInterval = null;

            function init()
            {
                $this.addClass('oki-loader-base');
                
                if (settings.indicatorObj && settings.indicatorObj.size()>0) {
                    settings.indicatorObj.addClass('oki-loader-indicator-base');
                }
            }
            
            function indicatorShow()
            {
                if (settings.indicatorObj && settings.indicatorObj.size()>0) {
                    settings.indicatorObj.addClass('ol-visible');

                    if (settings.indicatorFrames>0 && indicatorFrameInterval===null) {
                        indicatorFrameInterval = setInterval(function() {
                            settings.indicatorObj.attr('okiLoaderFrame', indicatorFrame);
                            indicatorFrame = (indicatorFrame + 1) % settings.indicatorFrames;
                        }, Math.round(1000/settings.indicatorFps));
                    }
                }
            }

            function indicatorHide()
            {
                if (settings.indicatorObj && settings.indicatorObj.size()) {
                    settings.indicatorObj.removeClass('ol-visible');
                }
                if (indicatorFrameInterval!==null) {
                    clearInterval(indicatorFrameInterval);
                    indicatorFrameInterval = null;
                }
            }
            
            function ajaxIndicator(incOrDec)
            {
                switch (incOrDec) {
                    case -1:  activeUrlCounter--;  break;
                    case  1:  activeUrlCounter++;  break;
                }

                if (activeUrlCounter==0) {
                    indicatorHide();
                } else {
                    indicatorShow();
                }
            }
            
            function findAjaxUrl(url)
            {
                var i;
                for (i=0; i<ajaxUrls.length; i++)
                    if (ajaxUrls[i].url==url)
                        return ajaxUrls[i];

                return null;
            }

            function addAjaxUrl(url)
            {
                var newAjaxUrl = {url: url, ajax: null};
                ajaxUrls.push(newAjaxUrl);
                return newAjaxUrl;
            }
            
            function submitRequest(url, method, parameters, successCallback, errorCallback)
            {
                var ajaxUrl = findAjaxUrl(url);
                var $tmpInput, key;

                /* create new or stop previous ajax on URL from parameter */
                if (!ajaxUrl) {
                    ajaxUrl = addAjaxUrl(url);
                } else
                    if (ajaxUrl.ajax) {
                        ajaxUrl.ajax.abort();
                    }

                $this.html('');
                for (key in parameters) {
                    $tmpInput = $('<input type="text" />');
                    $tmpInput.attr('name', key);

                    if (typeof parameters[key] === 'string' || typeof parameters[key] === 'integer') {
                        $tmpInput.val(parameters[key]);
                    } else {
                        $tmpInput.val(JSON.stringify(parameters[key]));
                    }
                    
                    $this.append($tmpInput);
                }

                ajaxIndicator(AJAX_INC);
                ajaxUrl.ajax = $.ajax({
                    url:    url,
                    data:   $this.serialize(),
                    type:   method,
                    success:function(data) {
                                ajaxIndicator(AJAX_DEC);
                                ajaxUrl.ajax = null;
                                if (typeof successCallback === 'function') {
                                    successCallback(data, ajaxUrl.url);
                                }
                            },
                    error:  function(jqXHR) {
                                ajaxIndicator(AJAX_DEC);
                                ajaxUrl.ajax = null;
                                if (typeof errorCallback === 'function') {
                                    errorCallback(jqXHR, ajaxUrl.url);
                                }
                            }
                });
            }
        }
        
        /* ------------------------------------------------------------------ */
        
        var pluginData;
        var pluginDataName = 'OkiLoader';
        
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
                pluginData = new OkiLoaderClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
