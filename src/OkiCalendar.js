(function ($) {
        
    $.fn.OkiCalendar = function(param) {
        
        function OkiCalendarClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                refresh : function() { refresh(); return this.api; },
                moveToDate : function(year, month) { moveToDate(year, month); return this.api; },
                movePrevMonth : function() { movePrevMonth(); return this.api; },
                moveNextMonth : function() { moveNextMonth(); return this.api; },
                getCurrent : function() { return getCurrent(); } 
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

            // -----------------------------------------------------------------
            // private:
            var $this = null;
            var settings = {
                month             : 'now',           // "now" or month number <1, 12>
                year              : 'now',           // "now" or year number <1970, 2099>
                mode              : 'table',         // "table" or "horizontal"
                showYearInHeader  : true,
                onChange          : null,            // callback after changed current state (year, month)
                onClick           : null,            // callback after clicked
                onMouseEnter      : null,            // callback after mouse enter
                onMouseLeave      : null,            // callback after mouse leave
                transDays         : new Array("PN", "WT", "\u015aR", "CZ", "PT", "SO", "N"),
                transMonths       : new Array("Stycze\u0144", "Luty", "Marzec", "Kwiecie\u0144", "Maj", "Czerwiec", "Lipiec", "Sierpie\u0144", "Wrzesie\u0144", "Pa\u017adziernik", "Listopad", "Grudzie\u0144")
            };
            var currentTableStartDay;
            var currentMonth;
            var currentYear;

            function init()
            {
                $this.addClass('oki-calendar-base');
                
                setupCurrentVars(settings.year, settings.month);
                buildBaseHtml();
                refreshCalendar();
                connectEvents();
            }
            
            function connectEvents()
            {
                if ($this.find('.oc-prev').size()==1) {
                    $this.find('.oc-prev').click(movePrevMonth);
                }
                if ($this.find('.oc-next').size()==1) {
                    $this.find('.oc-next').click(moveNextMonth);
                }
            }
        
            function moveNextMonth()
            {
                var currentDMY = new Date(currentYear, currentMonth-1, 15);
                
                currentDMY.setMonth(currentDMY.getMonth()+1);
                setupCurrentVars(currentDMY.getFullYear(), currentDMY.getMonth()+1);
                refreshCalendar();
            }
            
            function movePrevMonth()
            {
                var currentDMY = new Date(currentYear, currentMonth-1, 15);
                
                currentDMY.setMonth(currentDMY.getMonth()-1);
                setupCurrentVars(currentDMY.getFullYear(), currentDMY.getMonth()+1);
                refreshCalendar();
            }
            
            function moveToDate(year, month)
            {
                setupCurrentVars(year, month);
                refreshCalendar();
            }
            
            function refresh()
            {
                moveToDate(currentYear, currentMonth);
            }
            
            function getCurrent()
            {
                return getStateAfterChange();
            }
            
            function refreshCalendarTable()
            {
                var loopDate = new Date(currentTableStartDay);
                var todayDMY = new Date();
                var i, j, inCurrentMonth;
                var $tr, $td;
                
                $this.find('table tr:not(.oc-day-names)').remove();
                for (j=0; j<6; j++) {
                    $tr = $('<tr></tr>');
                    for (i=0; i<7; i++) {
                        inCurrentMonth = (loopDate.getMonth()+1)==currentMonth;
                        $td = $('<td></td>');
                        $td.attr('day', loopDate.getDate());
                        $td.attr('dayOfWeek', i);
                        $td.attr('month', loopDate.getMonth()+1);
                        $td.attr('year', loopDate.getFullYear());
                        if (!inCurrentMonth) {
                            $td.addClass('oc-ia');
                        }
                        if (loopDate.getDate()==todayDMY.getDate() && loopDate.getMonth()==todayDMY.getMonth() && loopDate.getFullYear()==todayDMY.getFullYear()) {
                            $td.addClass('oc-today');
                        }
                        $td.html(loopDate.getDate());
                        $tr.append($td);
                        loopDate.setDate(loopDate.getDate()+1);
                    }
                    $this.find('table').append($tr);
                }
                
                if ($this.find('.oc-header > span:last').size()==1) {
                    $this.find('.oc-header > span:last').html( settings.transMonths[currentMonth-1] + (settings.showYearInHeader ? (' '+currentYear) : '') );
                }
            }
            
            function refreshCalendarHorizontal()
            {
                var loopDate = new Date(currentYear, currentMonth-1, 1);
                var todayDMY = new Date();
                var i, j, inCurrentMonth;
                var normalizedDayOfWeek;
                var $cell;
                
                $this.find('.oc-day-name > *').remove();
                $this.find('.oc-custom-content > *').remove();
                $this.find('.oc-day-number > *').remove();
                
                for (i=0; i<31; i++) {
                    normalizedDayOfWeek = loopDate.getDay();
                    normalizedDayOfWeek = normalizedDayOfWeek==0 ? 7 : normalizedDayOfWeek;
                    normalizedDayOfWeek--;
                    
                    for (j=0; j<3; j++) {
                        if (j==0 || j==2) {
                            $cell = $('<div class="oc-tbl-c"><span class="oc-lbl"></span></div>');
                        } else {
                            $cell = $('<div class="oc-tbl-c"></div>');
                        }
                        
                        $cell.attr('day', loopDate.getDate());
                        $cell.attr('dayOfWeek', normalizedDayOfWeek);
                        $cell.attr('month', loopDate.getMonth()+1);
                        $cell.attr('year', loopDate.getFullYear());
                        if (loopDate.getDate()==todayDMY.getDate() && loopDate.getMonth()==todayDMY.getMonth() && loopDate.getFullYear()==todayDMY.getFullYear()) {
                            $cell.addClass('oc-today');
                        }
                        if (normalizedDayOfWeek==5 || normalizedDayOfWeek==6) {
                            $cell.addClass('oc-weekend');
                        }
                            
                        switch (j) {
                            case 0: $cell.find('span').html(settings.transDays[normalizedDayOfWeek]);
                                    $this.find('.oc-day-name').append($cell);
                                    break;
                            case 1: $this.find('.oc-custom-content').append($cell);
                                    break;
                            case 2: $cell.find('span').html(loopDate.getDate());
                                    $this.find('.oc-day-number').append($cell);
                                    break;
                        }
                    }
                    
                    loopDate.setDate(loopDate.getDate()+1);
                    
                    inCurrentMonth = (loopDate.getMonth()+1)==currentMonth;
                    if (!inCurrentMonth) {
                        break;
                    }
                }
            }
            
            function refreshCalendar()
            {
                if (settings.mode=='table') {
                    refreshCalendarTable();
                } else
                    if (settings.mode=='horizontal') {
                        refreshCalendarHorizontal();
                    }
                
                if (typeof settings.onChange === 'function') {
                    settings.onChange(getStateAfterChange());
                }
                
                if (typeof settings.onClick === 'function') {
                    $this.find('.oc-tbl-c, td').click(function() {
                        settings.onClick(getStateFromDayObject($(this)));
                    });
                }
                
                if (typeof settings.onMouseEnter === 'function') {
                    $this.find('.oc-tbl-c, td').mouseenter(function() {
                        settings.onMouseEnter(getStateFromDayObject($(this)));
                    });
                }
                
                if (typeof settings.onMouseLeave === 'function') {
                    $this.find('.oc-tbl-c, td').mouseleave(function() {
                        settings.onMouseLeave(getStateFromDayObject($(this)));
                    });
                }
            }
            
            function getStateAfterChange()
            {
                var $first, $last;
                var state = {
                    year              : currentYear,
                    month             : currentMonth,
                    monthName         : settings.transMonths[ currentMonth - 1 ],
                    visibleDateFirst  : null,
                    visibleDateLast   : null
                };
                
                if (settings.mode=='table') {
                    $first = $this.find('td:first');
                    $last = $this.find('td:last');
                } else
                    if (settings.mode=='horizontal') {
                        $first = $this.find('.oc-day-name > .oc-tbl-c:first');
                        $last = $this.find('.oc-day-name > .oc-tbl-c:last');
                    }
                if ($first && $last) {
                    state.visibleDateFirst = new Date(parseInt($first.attr('year')), parseInt($first.attr('month'))-1, parseInt($first.attr('day')));
                    state.visibleDateLast = new Date(parseInt($last.attr('year')), parseInt($last.attr('month'))-1, parseInt($last.attr('day')));
                }
                
                return state;
            }
            
            function getStateFromDayObject($obj)
            {
                var state = {
                    $obj      : $obj,
                    $dayName  : null,
                    $custom   : null,
                    $dayNumber: null,
                    year      : parseInt($obj.attr('year')),
                    month     : parseInt($obj.attr('month')),
                    day       : parseInt($obj.attr('day')),
                    dayOfWeek : parseInt($obj.attr('dayOfWeek')),
                    monthName : settings.transMonths[ parseInt($obj.attr('month')) - 1 ],
                    dayName   : settings.transDays[ parseInt($obj.attr('dayOfWeek')) ]
                }
                
                if (settings.mode=='horizontal') {
                    state.$dayName = $this.find('.oc-day-name .oc-tbl-c[day='+state.day+'][month='+state.month+'][year='+state.year+']');
                    state.$custom = $this.find('.oc-custom-content .oc-tbl-c[day='+state.day+'][month='+state.month+'][year='+state.year+']');
                    state.$dayNumber = $this.find('.oc-day-number .oc-tbl-c[day='+state.day+'][month='+state.month+'][year='+state.year+']');
                }
                
                return state;
            }
            
            function setupCurrentVars(y, m)
            {
                var dateNow = new Date();
                var lastDayOfPreviosMonth;
                var lastDayOfPreviosMonthDayOfWeek;
                
                currentMonth = m=='now' ? dateNow.getMonth() + 1 : parseInt(m);
                currentYear = y=='now' ? dateNow.getFullYear() : parseInt(y);
                
                currentMonth = currentMonth<1 ? 1 : currentMonth;
                currentMonth = currentMonth>12 ? 12 : currentMonth;
                currentYear = currentYear<1970 ? 1970 : currentYear;
                currentYear = currentYear>2099 ? 2099 : currentYear;
                
                lastDayOfPreviosMonth = new Date(currentYear, currentMonth-1, 0);
                lastDayOfPreviosMonthDayOfWeek = lastDayOfPreviosMonth.getDay();
                lastDayOfPreviosMonthDayOfWeek = lastDayOfPreviosMonthDayOfWeek==0 ? 7 : lastDayOfPreviosMonthDayOfWeek;
                lastDayOfPreviosMonthDayOfWeek--;
               
                currentTableStartDay = new Date(lastDayOfPreviosMonth);
                currentTableStartDay.setDate(lastDayOfPreviosMonth.getDate()- lastDayOfPreviosMonthDayOfWeek);
            }
            
            function buildBaseHtml()
            {
                var html, i;
                
                if (settings.mode=='table') {
                    html =  '<div class="oc-header">' +
                            '    <a href="javascript:void(0)" class="oc-prev">&nbsp;</a>' +
                            '    <a href="javascript:void(0)" class="oc-next">&nbsp;</a>' +
                            '    <span></span>' +
                            '</div>' +
                            '<div class="oc-body">' +
                            '    <table>' +
                            '       <tr class="oc-day-names"></tr>' +
                            '    </table>' +
                            '</div>';
                    $this.append(html);
                    for (i=0; i<7; i++) {
                        $this.find('table tr').append('<th>'+settings.transDays[i]+'</th>');
                    }
                } else
                    if (settings.mode=='horizontal') {
                        html =  '<div class="oc-tbl">' +
                                '    <div class="oc-tbl-r oc-day-name"></div>' +
                                '    <div class="oc-tbl-r oc-custom-content"></div>' +
                                '    <div class="oc-tbl-r oc-day-number"></div>' +
                                '</div>';
                        $this.append(html);
                    }
            }
        }
        
        // ---------------------------------------------------------------------
        
        var pluginData;
        var pluginDataName = 'OkiCalendar';
        
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
                pluginData = new OkiCalendarClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
