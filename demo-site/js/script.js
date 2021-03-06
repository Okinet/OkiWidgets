function ajaxRun($obj, url, $log)
{
    if ($obj.hasClass('ajax-running')) {
        return;
    }
    
    $obj.addClass('ajax-running');
    $log.html('Please wait...');
    
    $.ajax({
        url:    url,
        type:   'GET',
        success:function(data) {
                    $log.html(data);
                    $obj.removeClass('ajax-running');
                },
        error:  function(jqXHR, textStatus, errorThrown) {
                    alert('Error at Ajax request!');
                    $obj.removeClass('ajax-running');
                }
    });
}

function htmlspecialchars(string, quote_style, charset, double_encode) 
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
}

function findCodeCopy()
{
    var outerHTML, from, cloned;
    
    $('.code-copy').each(function() {
        from = $(this).attr('from');
        
        if ($(from).size()==1) {
            cloned = $(from).clone();
            if (cloned.is('script')) {
                cloned.removeAttr('class');
            }
            
            if ($(this).hasClass('code-copy-outer-too')) {
                outerHTML = $("<div />").append(cloned).html();
                outerHTML = htmlspecialchars(outerHTML);
                $(this).html(outerHTML);
            } else {
                $(this).html(htmlspecialchars($.trim(cloned.html())));
            }
        }
    });
}

function animateToIn($selector, ms)
{
    if ($selector.size()==1)
        $('html, body').animate({scrollTop: $selector.offset().top}, ms);
}


function createFixedMenu()
{
    var $link;
    
    $('h2').each(function(i) {
        $(this).attr('fixed-menu-id', i);
        $link = $('<a href="javascript:void(0)" fixed-menu-id="'+i+'">'+$(this).html()+'</a>');
        $link.on("click", function() {
            animateToIn($('h2[fixed-menu-id='+$(this).attr('fixed-menu-id')+']'), 300);
        });
        $('.fixed-menu-container > div.hidden').append($link);
    });
}


findCodeCopy();

$(document).ready(function() {
    createFixedMenu();
});