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


function OkiTool()
{ 
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
    
    this.cleanWebUrl = function(url)
    {
        if (!url)
            return '';
        
        var s = url+"";
        var i;
        
        if (s.length>0) {
            
            s = s.replace('http://', '');
            if (s[ s.length-1 ]=='/')
                s = s.substr(0, s.length-1);
            if (-1 != (i = s.search('www.facebook.com'))) {
                s = s.substr(i + 16);
              
                if (s[0] == '/') {
                    s = s.substr(1);
                }
              
                if(s.length) {
                    s = s + '.pl';
                }
            }
            
        } else {
            s = '';
        }
        
        return s;
    }
    
    this.urlencode = function(str)
    {
        str = (str + '').toString();

        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
                                       replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    }
    
    this.urldecode = function(str)
    {
        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    }
    
    this.deg2rad = function(angle) 
    {
        return angle * 0.017453292519943295;
    }
    
    this.distanceHaversine = function(lon1, lat1, lon2, lat2)
    {
        var dLat = this.deg2rad(lat2-lat1);
        var dLon = this.deg2rad(lon2-lon1);
        lat1 = this.deg2rad(lat1);
        lat2 = this.deg2rad(lat2);

        var a = Math.sin(dLat/2.0) * Math.sin(dLat/2.0) + Math.sin(dLon/2.0) * Math.sin(dLon/2.0) * Math.cos(lat1) * Math.cos(lat2);
        var dist = 2.0 * 6371.0 * Math.atan2(sqrt(a), Math.sqrt(1.0-a));
        
        return Math.round(dist * 1000.0) / 1000.0;
    }
    
    this.distanceSphericalLawOfCosines = function(lon1, lat1, lon2, lat2)
    {
        var dist = Math.acos(Math.sin(this.deg2rad(lat1))*Math.sin(this.deg2rad(lat2)) + Math.cos(this.deg2rad(lat1))*Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(lon2-lon1))) * 6371.0;
        
        return Math.round(dist * 1000.0) / 1000.0;
    }
    
    this.getLonLatAtGivenDistanceFromCenter = function(centerLon, centerLat, pointLon, pointLat, newDistance)
    {
        var dist = this.distanceSphericalLawOfCosines(centerLon, centerLat, pointLon, pointLat);
        var factor = newDistance / dist;
        var lonDiff = pointLon - centerLon;
        var latDiff = pointLat - centerLat;
        
        return { lon: centerLon + lonDiff * factor,
                 lat: centerLat + latDiff * factor
               };
    }

    this.base64_encode = function(input) 
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = this._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

        }

        return output;
    }


    this.base64_decode = function(input) 
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = this._utf8_decode(output);

        return output;

    }

    this._utf8_encode = function(string) 
    {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    this._utf8_decode = function(utftext) 
    {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
    
    this.cookieCreate = function(name, value, min)
    {
        var expires;
    
        if (min) {
            var date = new Date();
            date.setTime(date.getTime()+(min*60*1000));
            expires = "; expires="+date.toGMTString();
        } else 
            expires = "";
    
        document.cookie = name+"="+value+expires+"; path=/";
    }

    this.cookieRead = function(name)
    {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') 
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ)==0) 
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    this.cookieErase = function(name) 
    {
        cookieCreate(name, "", -1);
    }

    this.getRandomInt = function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.getRandomFloat = function(min, max)
    {
        return min + (max-min)*Math.random();
    }
    
    this.generateChars = function(len, what)
    {
        var ret = "";
        for (var i=0; i<len; i++)
            ret = ret + what;
        return ret;
    }
    
    this.inArray = function(needle, haystack, argStrict) 
    {
        var key = '',
        strict = !! argStrict;

        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true;
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
        }

        return false;
    }
    
    this.strpos = function(haystack, needle, offset) 
    {
        var i = (haystack + '').indexOf(needle, (offset || 0));
        return i === -1 ? false : i;
    }
    
    this.explode = function(delimiter, string, limit) 
    {
        if ( arguments.length < 2 || typeof delimiter == 'undefined' || typeof string == 'undefined' ) return null;
        if ( delimiter === '' || delimiter === false || delimiter === null) return false;
        if ( typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object'){
            return {
                0: ''
            };
        }
        if ( delimiter === true ) delimiter = '1';
  
        // Here we go...
        delimiter += '';
        string += '';
  
        var s = string.split( delimiter );
  
        if ( typeof limit === 'undefined' ) return s;
  
        // Support for limit
        if ( limit === 0 ) limit = 1;
  
        // Positive limit
        if ( limit > 0 ){
            if ( limit >= s.length ) return s;
            return s.slice( 0, limit - 1 ).concat( [ s.slice( limit - 1 ).join( delimiter ) ] );
        }

        // Negative limit
        if ( -limit >= s.length ) return [];
  
        s.splice( s.length + limit );
        return s;
    }
    
    this.numberFormat = function(number, decimals, dec_point, thousands_sep) 
    {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    } 
    
    this.str_replace = function(search, replace, subject, count) 
    {
        var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
        s = [].concat(s);
        if (count) {
            this.window[count] = 0;
        }

        for (i = 0, sl = s.length; i < sl; i++) {
            if (s[i] === '') {
                continue;
            }
            for (j = 0, fl = f.length; j < fl; j++) {
                temp = s[i] + '';
                repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
                s[i] = (temp).split(f[j]).join(repl);
                if (count && s[i] !== temp) {
                    this.window[count] += (temp.length - s[i].length) / f[j].length;
                }
            }
        }
        return sa ? s : s[0];
    }
}




var okiTool = new OkiTool();
var okiLoader = new OkiLoader();