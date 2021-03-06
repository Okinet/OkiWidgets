var okiTool = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    dateRangesDetails: function(dateStart, dateEnd, dateRangeStart, dateRangeEnd)
    {
        var todayPrecise = new Date();
        var today = new Date(todayPrecise.getFullYear(), todayPrecise.getMonth(), todayPrecise.getDate(), 0, 0, 0, 0);
        var ret = new Array();
        var loopDay;

        loopDay = new Date(dateStart);
        while (true) {
            ret.push({
                inRange       : (dateRangeStart<=loopDay  && loopDay<=dateRangeEnd),
                beforeRange   : (loopDay<dateRangeStart && loopDay<dateRangeEnd),
                afterRange    : (dateRangeStart<loopDay && dateRangeEnd<loopDay),
                atRangeStart  : (dateRangeStart.getFullYear()==loopDay.getFullYear() && dateRangeStart.getMonth()==loopDay.getMonth() && dateRangeStart.getDate()==loopDay.getDate()),
                atRangeEnd    : (dateRangeEnd.getFullYear()==loopDay.getFullYear() && dateRangeEnd.getMonth()==loopDay.getMonth() && dateRangeEnd.getDate()==loopDay.getDate()),
                isToday       : (today.getFullYear()==loopDay.getFullYear() && today.getMonth()==loopDay.getMonth() && today.getDate()==loopDay.getDate()),
                beforeToday   : loopDay<today,
                afterToday    : today<loopDay,
                dateJsObj     : new Date(loopDay),
                year          : loopDay.getFullYear(),
                month         : loopDay.getMonth() + 1,
                day           : loopDay.getDate()
            });

            loopDay.setDate(loopDay.getDate() + 1);  /* next day */
            if (loopDay>dateEnd) {
                break;
            }
        }

        return ret;
    },
    
    isMobile: function()
    {
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        return isMobile.any();
    },
    
    socialSharePinterest: function()
    {
        var e = document.createElement('script');
        
        e.setAttribute('type','text/javascript');
        e.setAttribute('charset','UTF-8');
        e.setAttribute('src','http://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);
        document.body.appendChild(e)
    },

    socialShareFacebook: function()
    {
        var u = document.location.href;
        var t = document.title;

        window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');
    },

    socialShareTweeter: function()
    {
        var width  = 575,
            height = 400,
            left   = ($(window).width()  - width)  / 2,
            top    = ($(window).height() - height) / 2,
            url    = 'http://twitter.com/share',
            opts   = 'status=1' +
                     ',width='  + width  +
                     ',height=' + height +
                     ',top='    + top    +
                     ',left='   + left;

        window.open(url, 'twitter', opts);
    },
    
    cleanWebUrl: function(url)
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
    },
    
    urlencode: function(str)
    {
        str = (str + '').toString();

        /* Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current */
        /* PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following. */
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
                                       replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    },
    
    urldecode: function(str)
    {
        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    },
    
    deg2rad: function(angle) 
    {
        return angle * 0.017453292519943295;
    },
    
    distanceHaversine: function(lon1, lat1, lon2, lat2)
    {
        var dLat = this.deg2rad(lat2-lat1);
        var dLon = this.deg2rad(lon2-lon1);
        lat1 = this.deg2rad(lat1);
        lat2 = this.deg2rad(lat2);

        var a = Math.sin(dLat/2.0) * Math.sin(dLat/2.0) + Math.sin(dLon/2.0) * Math.sin(dLon/2.0) * Math.cos(lat1) * Math.cos(lat2);
        var dist = 2.0 * 6371.0 * Math.atan2(sqrt(a), Math.sqrt(1.0-a));
        
        return Math.round(dist * 1000.0) / 1000.0;
    },
    
    distanceSphericalLawOfCosines: function(lon1, lat1, lon2, lat2)
    {
        var dist = Math.acos(Math.sin(this.deg2rad(lat1))*Math.sin(this.deg2rad(lat2)) + Math.cos(this.deg2rad(lat1))*Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(lon2-lon1))) * 6371.0;
        
        return Math.round(dist * 1000.0) / 1000.0;
    },
    
    getLonLatAtGivenDistanceFromCenter: function(centerLon, centerLat, pointLon, pointLat, newDistance)
    {
        var dist = this.distanceSphericalLawOfCosines(centerLon, centerLat, pointLon, pointLat);
        var factor = newDistance / dist;
        var lonDiff = pointLon - centerLon;
        var latDiff = pointLat - centerLat;
        
        return { lon: centerLon + lonDiff * factor,
                 lat: centerLat + latDiff * factor
               };
    },

    base64_encode: function(input) 
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
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    base64_decode: function(input) 
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

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
    },

    _utf8_encode: function(string) 
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
    },

    _utf8_decode: function(utftext) 
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
    },
    
    cookieCreate: function(name, value, min)
    {
        var expires;
    
        if (min) {
            var date = new Date();
            date.setTime(date.getTime()+(min*60*1000));
            expires = "; expires="+date.toGMTString();
        } else 
            expires = "";
    
        document.cookie = name+"="+value+expires+"; path=/";
    },

    cookieRead: function(name)
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
    },

    cookieErase: function(name) 
    {
        this.cookieCreate(name, "", -1);
    },

    getRandomInt: function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomFloat: function(min, max)
    {
        return min + (max-min)*Math.random();
    },
    
    generateChars: function(len, what)
    {
        var ret = "";
        for (var i=0; i<len; i++)
            ret = ret + what;
        return ret;
    },
    
    date: function(format, timestamp) 
    {
        var that = this;
        var jsdate, f;
        // Keep this here (works, but for code commented-out below for file size reasons)
        // var tal= [];
        var txt_words = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // trailing backslash -> (dropped)
        // a backslash followed by any character (including backslash) -> the character
        // empty string -> empty string
        var formatChr = /\\?(.?)/gi;
        var formatChrCb = function(t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function(n, c) {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            // Day
            d: function() {
                // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            D: function() {
                // Shorthand day name; Mon...Sun
                return f.l()
                        .slice(0, 3);
            },
            j: function() {
                // Day of month; 1..31
                return jsdate.getDate();
            },
            l: function() {
                // Full day name; Monday...Sunday
                return txt_words[f.w()] + 'day';
            },
            N: function() {
                // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            S: function() {
                // Ordinal suffix for day of month; st, nd, rd, th
                var j = f.j();
                var i = j % 10;
                if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            w: function() {
                // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            z: function() {
                // Day of year; 0..365
                var a = new Date(f.Y(), f.n() - 1, f.j());
                var b = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },
            // Week
            W: function() {
                // ISO-8601 week number
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                var b = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },
            // Month
            F: function() {
                // Full month name; January...December
                return txt_words[6 + f.n()];
            },
            m: function() {
                // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            M: function() {
                // Shorthand month name; Jan...Dec
                return f.F()
                        .slice(0, 3);
            },
            n: function() {
                // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            t: function() {
                // Days in month; 28...31
                return (new Date(f.Y(), f.n(), 0))
                        .getDate();
            },
            // Year
            L: function() {
                // Is leap year?; 0 or 1
                var j = f.Y();
                return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
            },
            o: function() {
                // ISO-8601 year
                var n = f.n();
                var W = f.W();
                var Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            Y: function() {
                // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            y: function() {
                // Last two digits of year; 00...99
                return f.Y()
                        .toString()
                        .slice(-2);
            },
            // Time
            a: function() {
                // am or pm
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            A: function() {
                // AM or PM
                return f.a()
                        .toUpperCase();
            },
            B: function() {
                // Swatch Internet time; 000..999
                var H = jsdate.getUTCHours() * 36e2;
                // Hours
                var i = jsdate.getUTCMinutes() * 60;
                // Minutes
                // Seconds
                var s = jsdate.getUTCSeconds();
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function() {
                // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function() {
                // 24-Hours; 0..23
                return jsdate.getHours();
            },
            h: function() {
                // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            H: function() {
                // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function() {
                // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function() {
                // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function() {
                // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },
            // Timezone
            e: function() {
                // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return that.date_default_timezone_get();
                 */
                throw 'Not supported (see source code of date() for timezone on how to add support)';
            },
            I: function() {
                // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var a = new Date(f.Y(), 0);
                // Jan 1
                var c = Date.UTC(f.Y(), 0);
                // Jan 1 UTC
                var b = new Date(f.Y(), 6);
                // Jul 1
                // Jul 1 UTC
                var d = Date.UTC(f.Y(), 6);
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            O: function() {
                // Difference to GMT in hour format; e.g. +0200
                var tzo = jsdate.getTimezoneOffset();
                var a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function() {
                // Difference to GMT w/colon; e.g. +02:00
                var O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            T: function() {
                // Timezone abbreviation; e.g. EST, MDT, ...
                // The following works, but requires inclusion of the very
                // large timezone_abbreviations_list() function.
                /*              var abbr, i, os, _default;
                 if (!tal.length) {
                 tal = that.timezone_abbreviations_list();
                 }
                 if (that.php_js && that.php_js.default_timezone) {
                 _default = that.php_js.default_timezone;
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 if (tal[abbr][i].timezone_id === _default) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 }
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 os = -jsdate.getTimezoneOffset() * 60;
                 if (tal[abbr][i].offset === os) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 */
                return 'UTC';
            },
            Z: function() {
                // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },
            // Full Date/Time
            c: function() {
                // ISO-8601 date.
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function() {
                // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function() {
                // Seconds since UNIX epoch
                return jsdate / 1000 | 0;
            }
        };
        this.date = function(format, timestamp) {
            that = this;
            jsdate = (
                timestamp === undefined ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
            );
            return format.replace(formatChr, formatChrCb);
        };
        return this.date(format, timestamp);
    },
    
    htmlspecialchars: function(string, quote_style, charset, double_encode)
    {
        var optTemp = 0,
        i = 0,
        noquotes = false;
        if (typeof quote_style === 'undefined' || quote_style === null) {
            quote_style = 2;
        }
        string = string.toString();
        if (double_encode !== false) {
            /* Put this first to avoid double-encoding */
            string = string.replace(/&/g, '&amp;');
        }
        string = string.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

        var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
        };
        if (quote_style === 0) {
            noquotes = true;
        }
        if (typeof quote_style !== 'number') {
            /* Allow for a single string or an array of string flags */
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                /* Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4 */
                if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                } else if (OPTS[quote_style[i]]) {
                    optTemp = optTemp | OPTS[quote_style[i]];
                }
            }
            quote_style = optTemp;
        }
        if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/'/g, '&#039;');
        }
        if (!noquotes) {
            string = string.replace(/"/g, '&quot;');
        }

        return string;
    },
    

    animateToIn: function($selector, ms)
    {
        if ($selector.size()==1)
            $('html, body').animate({scrollTop: $selector.offset().top}, ms);
    },
    
    inArray: function(needle, haystack, argStrict) 
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
    },
    
    strpos: function(haystack, needle, offset) 
    {
        var i = (haystack + '').indexOf(needle, (offset || 0));
        return i === -1 ? false : i;
    },
    
    explode: function(delimiter, string, limit) 
    {
        if ( arguments.length < 2 || typeof delimiter == 'undefined' || typeof string == 'undefined' ) return null;
        if ( delimiter === '' || delimiter === false || delimiter === null) return false;
        if ( typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object'){
            return {
                0: ''
            };
        }
        if ( delimiter === true ) delimiter = '1';
  
        /* Here we go... */
        delimiter += '';
        string += '';
  
        var s = string.split( delimiter );
  
        if ( typeof limit === 'undefined' ) return s;
  
        /* Support for limit */
        if ( limit === 0 ) limit = 1;
  
        /* Positive limit */
        if ( limit > 0 ){
            if ( limit >= s.length ) return s;
            return s.slice( 0, limit - 1 ).concat( [ s.slice( limit - 1 ).join( delimiter ) ] );
        }

        /* Negative limit */
        if ( -limit >= s.length ) return [];
  
        s.splice( s.length + limit );
        return s;
    },
    
    numberFormat: function(number, decimals, dec_point, thousands_sep) 
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
        /* Fix for IE parseFloat(0.55).toFixed(0) = 0; */
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    
    str_replace: function(search, replace, subject, count)
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
    },
    
    
    gmapOffsetCenter: function(latlng, offsetx, offsety)
    {
        /* latlng is the apparent centre-point */
        /* offsetx is the distance you want that point to move to the right, in pixels */
        /* offsety is the distance you want that point to move downwards, in pixels */
        /* offset can be negative */
        /* offsetx and offsety are both optional */

        var scale = Math.pow(2, map.getZoom());
        var nw = new google.maps.LatLng(
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getSouthWest().lng()
        );

        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
        var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y - pixelOffset.y
        );

        var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

        map.panTo(newCenter);
    },

    gmapFromLatLngToPoint: function(latLng, map)
    {
        var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
        var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
        var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
        var scale = Math.pow(2, map.getZoom());

        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    },
    
    gmapDrawHtmlMarker: function(map, lat, lon, anchorX, anchorY, anchorOpenedX, anchorOpenedY, markerHtml, markerArray, clickCallback)
    {
        var cssClosed = 'oki-gmap-marker-base ogm-closed';
        var cssOpened = 'oki-gmap-marker-base ogm-opened';
        var myLatLng = new google.maps.LatLng(lat, lon);
        var markerIconTransparent = {
            url    : '/transparent.png',
            size   : new google.maps.Size(1, 1),
            origin : new google.maps.Point(0, 0),
            anchor : new google.maps.Point(0, 0)
        };

        var markerGmapObj = new MarkerWithLabel({
            position       : myLatLng,
            map            : map,
            draggable      : false,
            icon           : markerIconTransparent,
            labelContent   : markerHtml,
            labelAnchor    : new google.maps.Point(anchorX, anchorY),
            labelClass     : cssClosed,
            isActive       : false
        });
        
        markerArray.push({
            lat           : lat,
            lon           : lon,
            latLonObj     : myLatLng,
            markerGmapObj : markerGmapObj,
            anchorX       : anchorX, 
            anchorY       : anchorY, 
            anchorOpenedX : anchorOpenedX, 
            anchorOpenedY : anchorOpenedY
        });
        
        google.maps.event.addListener(markerGmapObj, 'click', function() {
            for (var i=0; i<markerArray.length; i++) {
                if (markerGmapObj==markerArray[i].markerGmapObj && markerArray[i].markerGmapObj.labelClass==cssClosed) {
                    markerArray[i].markerGmapObj.labelClass = cssOpened;
                    markerArray[i].markerGmapObj.isActive = true;
                    markerArray[i].markerGmapObj.labelAnchor = new google.maps.Point(markerArray[i].anchorOpenedX, markerArray[i].anchorOpenedY);
                    markerArray[i].markerGmapObj.setZIndex(1000 + markerArray.length);
                } else {
                    markerArray[i].markerGmapObj.labelClass = cssClosed;
                    markerArray[i].markerGmapObj.isActive = false;
                    markerArray[i].markerGmapObj.labelAnchor = new google.maps.Point(markerArray[i].anchorX, markerArray[i].anchorY);
                    markerArray[i].markerGmapObj.setZIndex(1000 + i);
                }
                markerArray[i].markerGmapObj.label.setStyles();  /* force label to redraw (first method) */
                markerArray[i].markerGmapObj.label.draw();       /* force label to redraw (second method) */
                
                if (markerGmapObj==markerArray[i].markerGmapObj && (typeof clickCallback==='function')) {
                    clickCallback(i);
                }
            };
        });
    }
};

