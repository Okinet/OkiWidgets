(function ($) {
        
    $.fn.OkiCalendar = function(param) {
        
        function OkiCalendarClass()
        {
            // -----------------------------------------------------------------
            // public:
            this.api = {
                moveToDate : function(year, month) { moveToDate(year, month); return this.api; },
                movePrevMonth : function() { movePrevMonth(); return this.api; },
                moveNextMonth : function() { moveNextMonth(); return this.api; }
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
                onChange          : null,            // callback with current state (year, month)
                transDays         : new Array("PN", "WT", "ŚR", "CZ", "PT", "SO", "N"),
                transMonths       : new Array("Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień")
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
                
                
                /*  days names:
                    '        <div class="oc-tbl-c"><span class="oc-lbl">PT</span></div>' +
                    '        <div class="oc-tbl-c oc-weekend"><span class="oc-lbl">SO</span></div>' +
                    custom:
                    '        <div class="oc-tbl-c oc-weekend"></div>' +
                    day number:
                    '        <div class="oc-tbl-c"><span class="oc-lbl">6</span></div>' +
                    '        <div class="oc-tbl-c oc-weekend"><span class="oc-lbl">7</span></div>' +

                */
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
                    var state = {
                        year: currentYear,
                        month: currentMonth
                    };
                    settings.onChange(state);
                }
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
                        $this.find('table tr').append('<td>'+settings.transDays[i]+'</td>');
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
