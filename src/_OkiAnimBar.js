(function ($) {
    $.fn.OkiAnimBar = function(par) {
        
        var _this = this;
        var settingsDefaults = { animFps          : 16.0,
                                 spaceBetweenBars : 55.0,
                                 speedMin         : 9.0,
                                 speedMax         : 20.0,
                                 colorCount       : 8
                               };
                               
        var dataContainer = { settings             : {},
                              splitPosArray        : new Array(),
                              splitPosArrayLength  : 0,
                              timeStarted          : null,
                              animFrameTime        : null,
                              unique               : null,
                              timerID              : null
                            };

        _this.init = function(par) 
        {
            var w;
            var lastDivPos;
            var divObjTmp; 
            
            if ($(_this).hasClass('fired'))
                return;
            
            $(_this).data('OkiAnimBar', dataContainer);
            
            $(_this).addClass('fired').addClass('OkiAnimBar');
            
            
            dataContainer.settings = $.extend({}, settingsDefaults, par);
            
            w = $(_this).width();
            lastDivPos = 0;
            do {
                divObjTmp = $('<div class="type-' + ( OkiAnimBarGetRandomInt(0, dataContainer.settings.colorCount-1) ) + '">&nbsp;</div>');
                $(_this).append(divObjTmp);
                dataContainer.splitPosArray.push({ posBase    : lastDivPos,
                                                   pos        : lastDivPos,
                                                   sinOffset  : Math.random(),
                                                   sinSpeed   : OkiAnimBarRandomFloatBetween(dataContainer.settings.speedMin, dataContainer.settings.speedMax, 4),
                                                   divObj     : divObjTmp
                                                 });
                dataContainer.splitPosArrayLength++;
                lastDivPos += dataContainer.settings.spaceBetweenBars;
            } while (lastDivPos<w);
            
            dataContainer.animFrameTime = 1000.0/dataContainer.settings.animFps;
            
            dataContainer.unique = (new Date().getTime()).toString(36) + '-' + (Math.floor(Math.random() * (1888999 - 1000000 + 1)) + 1000000).toString(36);
            $(_this).attr('unique', dataContainer.unique);
            
            dataContainer.timeStarted = (new Date().getTime());
            
            $(_this).OkiAnimBarAnimate();
        }

        _this.init(par);
    };

    $.fn.OkiAnimBarRedraw = function()
    {
        var _this = this;
        var dataContainer = $(_this).data('OkiAnimBar');
        var left, width;
        var i;

        for (i=0; i<dataContainer.splitPosArrayLength; i++) {
            left = dataContainer.splitPosArray[i].pos;
            width = (i==(dataContainer.splitPosArrayLength-1)) ? (dataContainer.settings.spaceBetweenBars) : (dataContainer.splitPosArray[i+1].pos - dataContainer.splitPosArray[i].pos + 1);

            dataContainer.splitPosArray[i].divObj.css('left', (left.toFixed(2))+'px').css('width', (width.toFixed(2))+'px');
        }
    }

    $.fn.OkiAnimBarAnimate = function()
    {
        var _this = this;
        var dataContainer = $(_this).data('OkiAnimBar');
        var now = (new Date().getTime());
        var timeSinceRun = (now - dataContainer.timeStarted)/1000.0;
        var i;

        for (i=0; i<dataContainer.splitPosArrayLength; i++) {
            dataContainer.splitPosArray[i].pos = dataContainer.splitPosArray[i].posBase + 
                                                 0.8*(dataContainer.settings.spaceBetweenBars/2.0)*Math.sin( (dataContainer.splitPosArray[i].sinOffset + timeSinceRun/dataContainer.splitPosArray[i].sinSpeed) * (2.0*Math.PI) );
        }

        $(_this).OkiAnimBarRedraw();
        clearTimeout(dataContainer.timerID);
        dataContainer.timerID = setTimeout("$('.OkiAnimBar[unique=" + dataContainer.unique + "]').OkiAnimBarAnimate();", dataContainer.animFrameTime);   
    }

})(jQuery);



function OkiAnimBarGetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function OkiAnimBarRandomFloatBetween(minValue, maxValue, precision)
{
    if (typeof(precision) == 'undefined') {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}
