var okiTool = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    isMobile: function()
    {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        
        return check;
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

        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
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
            // Put this first to avoid double-encoding
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
            // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
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
        // latlng is the apparent centre-point
        // offsetx is the distance you want that point to move to the right, in pixels
        // offsety is the distance you want that point to move downwards, in pixels
        // offset can be negative
        // offsetx and offsety are both optional

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
			labelClass	   : cssClosed,
			isActive	   : false
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
				markerArray[i].markerGmapObj.label.setStyles();  // force label to redraw (first method)
                markerArray[i].markerGmapObj.label.draw();       // force label to redraw (second method)
                
                if (markerGmapObj==markerArray[i].markerGmapObj && (typeof clickCallback==='function')) {
                    clickCallback(i);
                }
			};
		});
	}
}