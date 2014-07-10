/* TODO: build plugin from code below */

(function ($) {
    $.fn.OkiParalax = function(par) {
        
        var _this = this;
        var settingsDefaults = { animFps: 40.0,
                                 observer: 20000,
                                 distances: null,
                                 renderCallback: null
                               };
        
        var dataContainer = { settings: {},
                              paralaxMouseDiffX: 0,
                              paralaxMouseDiffY: 0,
                              paralaxZoom: 1.0,
                              easeTo_paralaxMouseDiffX: 0,
                              easeTo_paralaxMouseDiffY: 0,
                              easeTo_zoom: 1.0,
                              curr_velX: 0.0,
                              curr_velY: 0.0,
                              curr_velZoom: 0.0,
                              animFrameTime: null,
                              distances: null,
                              distancesCount: 0,
                              unique: null,
                              timerID: null
                            };


        _this.init = function(par)
        {
            var i;
            if ($(_this).find('> div').size()==0)
                return;
            
            $(_this).data('OkiParalax', dataContainer);
            
            $(_this).addClass('OkiParalax');
            
            dataContainer.settings = $.extend({}, settingsDefaults, par);
            dataContainer.animFrameTime = 1000.0/dataContainer.settings.animFps;
            
            if (dataContainer.settings.distances!==null && dataContainer.settings.distances.length!=0) {
                dataContainer.distances = dataContainer.settings.distances;
                dataContainer.distancesCount = dataContainer.settings.distances.length;
            } else {
                dataContainer.distancesCount = $(_this).find('> div').size();
                dataContainer.distances = new Array();
                for (i=0; i<dataContainer.distancesCount; i++) {
                    dataContainer.distances.push( ((i+1)/(dataContainer.distancesCount-1 + 2))*dataContainer.settings.observer );
                }
            }

            $(document).mousemove(function(e) {
                var offset = $(_this).offset();
                var w = $(_this).width();
                var h = $(_this).height();
                var relX = e.pageX - offset.left;
                var relY = e.pageY - offset.top;
                var paralaxDivCenterX = (offset.left + w/2.0);
                var paralaxDivCenterY = (offset.top + h/2.0);
                
                dataContainer.easeTo_paralaxMouseDiffX = (relX - paralaxDivCenterX)*-1;
                dataContainer.easeTo_paralaxMouseDiffY = (relY - paralaxDivCenterY)*-1;
                dataContainer.easeTo_zoom = 1.2;
            });
            /*
            $(_this).mouseleave(function() {
                dataContainer.easeTo_paralaxMouseDiffX = 0;
                dataContainer.easeTo_paralaxMouseDiffY = 0;
                dataContainer.easeTo_zoom = 1.0;
            });
            */
            
            dataContainer.unique = (new Date().getTime()).toString(36) + '-' + (Math.floor(Math.random() * (1888999 - 1000000 + 1)) + 1000000).toString(36);
            $(_this).attr('unique', dataContainer.unique);
        
            $(_this).OkiParalaxAnimate();
        }
        
        _this.init(par);
    };
    
    $.fn.OkiParalaxRedraw = function()
    {
        var _this = this;
        var dataContainer = $(_this).data('OkiParalax');
        var top, left, zoom;

        $(_this).find('> div').each(function (i) {
            top = (dataContainer.distances[(i<dataContainer.distancesCount ? i : (dataContainer.distancesCount-1))] * dataContainer.paralaxMouseDiffY) / dataContainer.settings.observer;
            left = (dataContainer.distances[(i<dataContainer.distancesCount ? i : (dataContainer.distancesCount-1))] * dataContainer.paralaxMouseDiffX) / dataContainer.settings.observer;
            zoom = dataContainer.paralaxZoom;

            if (dataContainer.settings.renderCallback!==null) {
                dataContainer.settings.renderCallback($(this), left, top, zoom);
            } else {
                $(this).css('left', Math.round(left)+'px');
                $(this).css('top', Math.round(top)+'px');
            }
        });    
    }

    $.fn.OkiParalaxAnimate = function()
    {
        var _this = this;
        var dataContainer = $(_this).data('OkiParalax');
        

        var Fs_x, Fs_y, Fs_zoom, Faero_x, Faero_y, Faero_zoom, F_x, F_y, F_zoom, a_x, a_y, a_zoom, delta_x, delta_y, delta_zoom;
        var m = 4.0;
        var k = 150.0;
        var kAero = 30.0;
        var s_x, s_y, s_zoom;
        var V0_x, V0_y, V0_zoom;
        var dt;

        V0_x = dataContainer.curr_velX;
        V0_y = dataContainer.curr_velY;
        V0_zoom = dataContainer.curr_velZoom;
        s_x = dataContainer.paralaxMouseDiffX;
        s_y = dataContainer.paralaxMouseDiffY;
        s_zoom = dataContainer.paralaxZoom;

        /* physics engine */
        delta_x = dataContainer.easeTo_paralaxMouseDiffX - dataContainer.paralaxMouseDiffX;
        delta_y = dataContainer.easeTo_paralaxMouseDiffY - dataContainer.paralaxMouseDiffY;
        delta_zoom = dataContainer.easeTo_zoom - dataContainer.paralaxZoom;
        dt = dataContainer.animFrameTime/1000.0;

        Fs_x = k * delta_x;
        Fs_y = k * delta_y;
        Fs_zoom = k * delta_zoom;
        Faero_x = -kAero * V0_x;
        Faero_y = -kAero * V0_y;
        Faero_zoom = -kAero * V0_zoom;
        F_x = Fs_x + Faero_x;
        F_y = Fs_y + Faero_y;
        F_zoom = Fs_zoom + Faero_zoom;
        a_x = F_x / m;
        a_y = F_y / m;
        a_zoom = F_zoom / m;

        s_x = s_x + V0_x*dt + (a_x*dt*dt)/2.0;
        s_y = s_y + V0_y*dt + (a_y*dt*dt)/2.0;
        s_zoom = s_zoom + V0_zoom*dt + (a_zoom*dt*dt)/2.0;
        V0_x = V0_x + a_x*dt;
        V0_y = V0_y + a_y*dt;
        V0_zoom = V0_zoom + a_zoom*dt;
        /* physics engine end */

        dataContainer.curr_velX = V0_x;
        dataContainer.curr_velY = V0_y;
        dataContainer.curr_velZoom = V0_zoom;
        dataContainer.paralaxMouseDiffX = s_x;
        dataContainer.paralaxMouseDiffY = s_y;
        dataContainer.paralaxZoom = s_zoom;

        $(_this).OkiParalaxRedraw();
        clearTimeout(dataContainer.timerID);
        dataContainer.timerID = setTimeout("OkiParalaxAnimateUpdater('"+dataContainer.unique+"')", dataContainer.animFrameTime);
    }

})(jQuery);


function OkiParalaxAnimateUpdater(unique)
{
    $('.OkiParalax[unique='+unique+']').OkiParalaxAnimate();
}