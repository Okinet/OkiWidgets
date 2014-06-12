// TODO: build plugin from code below

function OkiLoader()
{
    var AJAX_INC = 1;
    var AJAX_DEC = -1;
    
    var ajaxUrls = new Array();
    var activeUrlCounter = 0;
    var _this = this;
    
    this.ajaxIndicatorShow = function()
    {
        $('#payback-ajax-container').addClass('active');
    }
    
    this.ajaxIndicatorHide = function()
    {
        $('#payback-ajax-container').removeClass('active');
    }
    
    this.findAjaxUrl = function(url)
    {
        var i;
        for (i=0; i<ajaxUrls.length; i++)
            if (ajaxUrls[i].url==url)
                return ajaxUrls[i];
        
        return null;
    }
    
    this.addAjaxUrl = function(url)
    {
        var newAjaxUrl = {url: url, ajax: null};
        ajaxUrls.push(newAjaxUrl);
        return newAjaxUrl;
    }
    
    this.ajaxIndicator = function(incOrDec)
    {
        switch (incOrDec) {
            case -1:  activeUrlCounter--;  break;
            case  1:  activeUrlCounter++;  break;
        }
        
        if (activeUrlCounter==0)
            this.ajaxIndicatorHide(); else
            this.ajaxIndicatorShow();
    }
    
    this.ajax = function(url, par, callbackFunc, notJson, callbackErrorFunc, urlEncodePar)
    {
        var ajaxUrl = this.findAjaxUrl(url);
        var tool = okiTool;
        var paramsArr = new Array();
        var paramsStr = "";
        var k;
        var parsedJson;
        
        // create new or stop previous ajax on URL from parameter
        if (!ajaxUrl) {
            ajaxUrl = this.addAjaxUrl(url);
        } else
            if (ajaxUrl.ajax)
                ajaxUrl.ajax.abort();
        
        for (k in par) {
            if (urlEncodePar===true) {
                paramsArr.push(k+"="+tool.urlencode(par[k]));
            } else {
                paramsArr.push(k+"="+par[k]);
            }
        }
        paramsStr = paramsArr.join('&');
        
        this.ajaxIndicator(AJAX_INC);
        ajaxUrl.ajax = $.ajax({
            url:    url,
            data:   paramsStr,
            type:   'POST',
            success:function(data) {
                        _this.ajaxIndicator(AJAX_DEC);
                        ajaxUrl.ajax = null;
                        
                        if (notJson===true) {
                            callbackFunc(data); 
                        } else {
                            try {
                                parsedJson = JSON.parse(data);
                            } catch(err) {
                                parsedJson = [];
                            }
                            
                            callbackFunc(parsedJson);
                        }
                    },
            error:  function(jqXHR, textStatus, errorThrown) {
                        _this.ajaxIndicator(AJAX_DEC);
                        ajaxUrl.ajax = null;

                        if (jqXHR.status==404)
                            alert('Strona nie istnieje!');
                        
                        if (typeof callbackErrorFunc === 'function')
                            callbackErrorFunc(jqXHR.status);
                    }
        });
    }
}

var okiLoader = new OkiLoader();