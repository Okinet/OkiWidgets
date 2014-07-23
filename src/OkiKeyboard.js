/**
 * -----------------------------------------------------------------------------
 *                                                       OkiKeyboard plugin 1.0 
 *
 *  This plugin can be helpfull in cross browser key event handling
 *                                                 
 *                                                                   2014.04.24
 *                                                   robert.rypula(at)gmail.com
 * -----------------------------------------------------------------------------
 * 
 * 
 * Usefull links:
 *     http://www.javascripter.net/faq/keycodes.htm
 *     http://stackoverflow.com/questions/8562528/is-there-is-a-way-to-detect-which-side-the-alt-key-is-pressed
 *     http://www.branah.com/polishprogrammers
 * 
 * 
 *  delay rate  : 500 ms        (or 250, 500, 750, 1000 ms)
 *  repeat rate : 10.9 chars/s = 0.092 ms
 *
 *  (that is, the inter-character delay is (2 ^ B) * (D + 8) / 240 sec, where B gives Bits 4-3 and D gives Bits 2-0).
 *
 *  max is:  30.0 chars/s = 0.033 ms
 *  min is:   2.0 chars/s = 0.500 ms
 *  
 *           0         1         2         3         4         5         6         7
 *   0      30.0      26.7      24.0      21.8      20.0      18.5      17.1      16.0
 *   8      15.0      13.3      12.0      10.9      10.0       9.2       8.6       8.0
 *  16       7.5       6.7       6.0       5.5       5.0       4.6       4.3       4.0
 *  24       3.7       3.3       3.0       2.7       2.5       2.3       2.1       2.0
 */


var OkiKb = {};

OkiKb.KEY_0 = null; OkiKb.KEY_1 = null; OkiKb.KEY_2 = null; OkiKb.KEY_3 = null; OkiKb.KEY_4 = null; OkiKb.KEY_5 = null; 
OkiKb.KEY_6 = null; OkiKb.KEY_7 = null; OkiKb.KEY_8 = null; OkiKb.KEY_9 = null; OkiKb.KEY_A = null; OkiKb.KEY_B = null; 
OkiKb.KEY_C = null; OkiKb.KEY_D = null; OkiKb.KEY_E = null; OkiKb.KEY_F = null; OkiKb.KEY_G = null; OkiKb.KEY_H = null; 
OkiKb.KEY_I = null; OkiKb.KEY_J = null; OkiKb.KEY_K = null; OkiKb.KEY_L = null; OkiKb.KEY_M = null; OkiKb.KEY_N = null; 
OkiKb.KEY_O = null; OkiKb.KEY_P = null; OkiKb.KEY_Q = null; OkiKb.KEY_R = null; OkiKb.KEY_S = null; OkiKb.KEY_T = null; 
OkiKb.KEY_U = null; OkiKb.KEY_V = null; OkiKb.KEY_W = null; OkiKb.KEY_X = null; OkiKb.KEY_Y = null; OkiKb.KEY_Z = null; 
OkiKb.KEY_GRAVE_ACCENT = null; OkiKb.KEY_MINUS = null; OkiKb.KEY_EQUALS = null; OkiKb.KEY_BRACKET_LEFT = null; 
OkiKb.KEY_BRACKET_RIGHT = null; OkiKb.KEY_BACKSLASH = null; OkiKb.KEY_SEMICOLON = null; OkiKb.KEY_APOSTROPHE = null; 
OkiKb.KEY_COMMA = null; OkiKb.KEY_DOT = null; OkiKb.KEY_SLASH = null; OkiKb.KEY_BACKSPACE = null; OkiKb.KEY_TAB = null; 
OkiKb.KEY_ENTER = null; OkiKb.KEY_ESCAPE = null; OkiKb.KEY_SPACE = null; OkiKb.KEY_ALT_LEFT = null; OkiKb.KEY_CTRL_LEFT = null; 
OkiKb.KEY_SHIFT_LEFT = null; OkiKb.KEY_CAPS_LOCK = null; OkiKb.KEY_ARROW_UP = null; OkiKb.KEY_ARROW_DOWN = null; OkiKb.KEY_ARROW_LEFT = null;
OkiKb.KEY_ARROW_RIGHT = null; OkiKb.KEY_INSERT = null; OkiKb.KEY_DELETE = null; OkiKb.KEY_HOME = null; OkiKb.KEY_END = null; 
OkiKb.KEY_PAGE_UP = null; OkiKb.KEY_PAGE_DOWN = null; OkiKb.KEY_ALT_RIGHT = null; OkiKb.KEY_CTRL_RIGHT = null; 
OkiKb.KEY_SHIFT_RIGHT = null; OkiKb.KEY_NUM_LOCK = null; OkiKb.KEY_NUM_0 = null; OkiKb.KEY_NUM_1 = null; OkiKb.KEY_NUM_2 = null; 
OkiKb.KEY_NUM_3 = null; OkiKb.KEY_NUM_4 = null; OkiKb.KEY_NUM_5 = null; OkiKb.KEY_NUM_6 = null; OkiKb.KEY_NUM_7 = null; 
OkiKb.KEY_NUM_8 = null; OkiKb.KEY_NUM_9 = null; OkiKb.KEY_NUM_DOT = null; OkiKb.KEY_NUM_SLASH = null; OkiKb.KEY_NUM_ASTERISK = null; 
OkiKb.KEY_NUM_MINUS = null; OkiKb.KEY_NUM_PLUS = null; OkiKb.KEY_NUM_ENTER = null; OkiKb.KEY_F01 = null; OkiKb.KEY_F02 = null; 
OkiKb.KEY_F03 = null; OkiKb.KEY_F04 = null; OkiKb.KEY_F05 = null; OkiKb.KEY_F06 = null; OkiKb.KEY_F07 = null; OkiKb.KEY_F08 = null; 
OkiKb.KEY_F09 = null; OkiKb.KEY_F10 = null; OkiKb.KEY_F11 = null; OkiKb.KEY_F12 = null; OkiKb.KEY_PRINT_SCREEN = null; 
OkiKb.KEY_SCROLL_LOCK = null; OkiKb.KEY_PAUSE_BREAK = null; OkiKb.KEY_WIN_LEFT = null; OkiKb.KEY_WIN_RIGHT = null; OkiKb.KEY_MENU = null;


(function ($) {
        
    /* $.browser support for jQuery >= 1.9 */
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ /]([w.]+)/.exec( ua ) ||
        /(webkit)[ /]([w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ /]([w.]+)/.exec( ua ) ||
        /(msie) ([w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([w.]+)|)/.exec( ua ) ||
        [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    /* Don't clobber any existing jQuery.browser in case it's different */
    if ( !jQuery.browser ) {
        matched = jQuery.uaMatch( navigator.userAgent );
        browser = {};

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
        }

        /* Chrome is Webkit, but Webkit is also Safari. */
        if ( browser.chrome ) {
            browser.webkit = true;
        } else if ( browser.webkit ) {
            browser.safari = true;
        }

        jQuery.browser = browser;
    }
    
    $.fn.OkiKeyboard = function(param) {
        
        function OkiKeyboardClass()
        {
            /* -------------------------------------------------------------- */
            /* public: */
            this.api = {
                hide : function() { hide(); return this.api; },
                show : function() { show(); return this.api; },
                getKeyboardDetails : function() { return getKeyboardDetails(); },
                detach : function() { return detach(); },
                getAllKeysInUseFlag : function() { return getAllKeysInUseFlag(); },
                getAllKeysPressedFlag : function() { return getAllKeysPressedFlag(); },
                isKeyPressed : function(keyCode) { return isKeyPressed(keyCode); }
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
                keyboardCanvas       : null, 
                zoom                 : 4.0, 
                keyboardLayout       : '104',
                mergeLeftAndRightAlt : false,
                keyAutoRepeat        : { delayTime: 1000, repeatTime: 50 },
                keyEventCallback     : null
            };
            

            var inited = false;
            var GS = 9;            /* grid unit size */
            var BS = 8;            /* button unit size */
            var CTRL_MAX_DELTA = 20;
            var PRINT_SCREEN_FAKE_HOLD_TIME = 100;
            var objToListenEvents;
            var keyboardCanvas;
            var keyboardLayout;
            var zoom;
            var buttonFill;
            var mergeLeftAndRightAlt;
            var lastKeyCodeInUse;
            var nowOnStart = (new Date()).getTime();
            var mouseLeftButton = false;
            var mouseHoveredKeyCodeList;
            var mouseHoveredKeyCodeListCount;
            var mousePressedKeyCodeList;
            var mousePressedKeyCodeListCount;
            var ctrlKeyPressedTimer = null;
            var ctrlKeyRelasedTimer = null;
            var ctrlKeyPressedTime = null;
            var ctrlKeyRelasedTime = null;
            var keyEventCallback = null;
            var keyAutoRepeat = { delayTime: 250, repeatTime: 50 };
            var lastPressedKeyCodeDelayTimer = null
            var lastPressedKeyCodeRepeatInterval = null;


            var keyboardBoundaries = {
                top    : null,
                right  : null,
                bottom : null,
                left   : null
            };

            var keyOrigin = {
                KEY_ORIGIN_ESC    : { x:   0, y:  0 },
                KEY_ORIGIN_F01    : { x:  16, y:  0 },
                KEY_ORIGIN_F05    : { x:  57, y:  0 },
                KEY_ORIGIN_F09    : { x:  98, y:  0 },
                KEY_ORIGIN_ALPNUM : { x:   0, y: 12 },
                KEY_ORIGIN_INS    : { x: 137, y: 12 },
                KEY_ORIGIN_ARROWS : { x: 137, y: 39 },
                KEY_ORIGIN_NUM    : { x: 167, y: 12 },
                KEY_ORIGIN_PRTSC  : { x: 137, y:  0 }
            };

            var keyData =
            [
                { keyName: "KEY_0",             gridPosX:    10, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: ')<br/>0', printableChar: { _: ['0', null], onlyShift: [')', null] } },
                { keyName: "KEY_1",             gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '!<br/>1', printableChar: { _: ['1', null], onlyShift: ['!', null] } },
                { keyName: "KEY_2",             gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '@<br/>2', printableChar: { _: ['2', null], onlyShift: ['@', null] } },
                { keyName: "KEY_3",             gridPosX:     3, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '#<br/>3', printableChar: { _: ['3', null], onlyShift: ['#', null] } },
                { keyName: "KEY_4",             gridPosX:     4, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '$<br/>4', printableChar: { _: ['4', null], onlyShift: ['$', null] } },
                { keyName: "KEY_5",             gridPosX:     5, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '%<br/>5', printableChar: { _: ['5', null], onlyShift: ['%', null] } },
                { keyName: "KEY_6",             gridPosX:     6, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '^<br/>6', printableChar: { _: ['6', null], onlyShift: ['^', null] } },
                { keyName: "KEY_7",             gridPosX:     7, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '&<br/>7', printableChar: { _: ['7', null], onlyShift: ['&', null] } },
                { keyName: "KEY_8",             gridPosX:     8, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '*<br/>8', printableChar: { _: ['8', null], onlyShift: ['*', null] } },
                { keyName: "KEY_9",             gridPosX:     9, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '(<br/>9', printableChar: { _: ['9', null], onlyShift: ['(', null] } },

                { keyName: "KEY_A",             gridPosX:     1, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'A', printableChar: { _: ['a', 'A'], onlyShift: ['A', 'a'], onlyAltR: ['ą', 'Ą'], altRShift: ['Ą', 'ą'] } },
                { keyName: "KEY_B",             gridPosX:     5, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'B', printableChar: { _: ['b', 'B'], onlyShift: ['B', 'b'] } },
                { keyName: "KEY_C",             gridPosX:     3, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'C', printableChar: { _: ['c', 'C'], onlyShift: ['C', 'c'], onlyAltR: ['ć', 'Ć'], altRShift: ['Ć', 'ć'] } },
                { keyName: "KEY_D",             gridPosX:     3, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'D', printableChar: { _: ['d', 'D'], onlyShift: ['D', 'd'] } },
                { keyName: "KEY_E",             gridPosX:     3, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'E', printableChar: { _: ['e', 'E'], onlyShift: ['E', 'e'], onlyAltR: ['ę', 'Ę'], onlyAltRShift: ['Ę', 'ę'] } },
                { keyName: "KEY_F",             gridPosX:     4, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'F', printableChar: { _: ['f', 'F'], onlyShift: ['F', 'f'] } },
                { keyName: "KEY_G",             gridPosX:     5, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'G', printableChar: { _: ['g', 'G'], onlyShift: ['G', 'g'] } },
                { keyName: "KEY_H",             gridPosX:     6, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'H', printableChar: { _: ['h', 'H'], onlyShift: ['H', 'h'] } },
                { keyName: "KEY_I",             gridPosX:     8, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'I', printableChar: { _: ['i', 'I'], onlyShift: ['I', 'i'] } },
                { keyName: "KEY_J",             gridPosX:     7, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'J', printableChar: { _: ['j', 'J'], onlyShift: ['J', 'j'] } },
                { keyName: "KEY_K",             gridPosX:     8, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'K', printableChar: { _: ['k', 'K'], onlyShift: ['K', 'k'] } },
                { keyName: "KEY_L",             gridPosX:     9, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'L', printableChar: { _: ['l', 'L'], onlyShift: ['L', 'l'], onlyAltR: ['ł', 'Ł'], onlyAltRShift: ['Ł', 'ł'] } },
                { keyName: "KEY_M",             gridPosX:     7, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'M', printableChar: { _: ['m', 'M'], onlyShift: ['M', 'm'] } },
                { keyName: "KEY_N",             gridPosX:     6, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'N', printableChar: { _: ['n', 'N'], onlyShift: ['N', 'n'], onlyAltR: ['ń', 'Ń'], onlyAltRShift: ['Ń', 'ń'] } },
                { keyName: "KEY_O",             gridPosX:     9, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'O', printableChar: { _: ['o', 'O'], onlyShift: ['O', 'o'], onlyAltR: ['ó', 'Ó'], onlyAltRShift: ['Ó', 'ó'] } },
                { keyName: "KEY_P",             gridPosX:    10, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'P', printableChar: { _: ['p', 'P'], onlyShift: ['P', 'p'] } },
                { keyName: "KEY_Q",             gridPosX:     1, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'Q', printableChar: { _: ['q', 'Q'], onlyShift: ['Q', 'q'] } },
                { keyName: "KEY_R",             gridPosX:     4, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'R', printableChar: { _: ['r', 'R'], onlyShift: ['R', 'r'] } },
                { keyName: "KEY_S",             gridPosX:     2, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'S', printableChar: { _: ['s', 'S'], onlyShift: ['S', 's'], onlyAltR: ['ś', 'Ś'], onlyAltRShift: ['Ś', 'ś'] } },
                { keyName: "KEY_T",             gridPosX:     5, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'T', printableChar: { _: ['t', 'T'], onlyShift: ['T', 't'] } },
                { keyName: "KEY_U",             gridPosX:     7, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'U', printableChar: { _: ['u', 'U'], onlyShift: ['U', 'u'] } },
                { keyName: "KEY_V",             gridPosX:     4, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'V', printableChar: { _: ['v', 'V'], onlyShift: ['V', 'v'] } },
                { keyName: "KEY_W",             gridPosX:     2, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'W', printableChar: { _: ['w', 'W'], onlyShift: ['W', 'w'] } },
                { keyName: "KEY_X",             gridPosX:     2, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'X', printableChar: { _: ['x', 'X'], onlyShift: ['X', 'x'], onlyAltR: ['ź', 'Ź'], onlyAltRShift: ['Ź', 'ź'] } },
                { keyName: "KEY_Y",             gridPosX:     6, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'Y', printableChar: { _: ['y', 'Y'], onlyShift: ['Y', 'y'] } },
                { keyName: "KEY_Z",             gridPosX:     1, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: 'Z', printableChar: { _: ['z', 'Z'], onlyShift: ['Z', 'z'], onlyAltR: ['ż', 'Ż'], onlyAltRShift: ['Ż', 'ż'] } },

                { keyName: "KEY_GRAVE_ACCENT",  gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '~<br/>`', printableChar: { _: ['`', null], onlyShift: ['~', null] } },
                { keyName: "KEY_MINUS",         gridPosX:    11, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '_<br/>-', printableChar: { _: ['-', null], onlyShift: ['_', null] } },
                { keyName: "KEY_EQUALS",        gridPosX:    12, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '+<br/>=', printableChar: { _: ['=', null], onlyShift: ['+', null] } },
                { keyName: "KEY_BRACKET_LEFT",  gridPosX:    11, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '{<br/>[', printableChar: { _: ['[', null], onlyShift: ['{', null] } },
                { keyName: "KEY_BRACKET_RIGHT", gridPosX:    12, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '}<br/>]', printableChar: { _: [']', null], onlyShift: ['}', null] } },
                { keyName: "KEY_BACKSLASH",     gridPosX:    13, gridPosY: 1, width:   1.5*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '|<br/>\\', printableChar: { _: ['\\', null], onlyShift: ['|', null] } },
                { keyName: "KEY_SEMICOLON",     gridPosX:    10, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: ':<br/>;', printableChar: { _: [';', null], onlyShift: [':', null] } },
                { keyName: "KEY_APOSTROPHE",    gridPosX:    11, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '"<br/>\'', printableChar: { _: ['\'', null], onlyShift: ['"', null] } },
                { keyName: "KEY_COMMA",         gridPosX:     8, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '&lt;<br/>,', printableChar: { _: [',', null], onlyShift: ['<', null] } },
                { keyName: "KEY_DOT",           gridPosX:     9, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '&gt;<br/>.', printableChar: { _: ['.', null], onlyShift: ['>', null] } },
                { keyName: "KEY_SLASH",         gridPosX:    10, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '?<br/>/', printableChar: { _: ['/', null], onlyShift: ['?', null] } },

                { keyName: "KEY_BACKSPACE",     gridPosX:    13, gridPosY: 0, width:   2.0*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '&#x21D0; Backspace' },
                { keyName: "KEY_TAB",           gridPosX:     0, gridPosY: 1, width:   1.5*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Tab &#x21b9;' },
                { keyName: "KEY_ENTER",         gridPosX:    12, gridPosY: 2, width:  2.25*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '&#x21b5; Enter' },
                { keyName: "KEY_ESCAPE",        gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_ESC", html: 'Esc' },
                { keyName: "KEY_SPACE",         gridPosX:     4, gridPosY: 4, width:  6.25*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: '&nbsp;', printableChar: { _: [' ', null] } },

                { keyName: "KEY_ALT_LEFT",      gridPosX:  25/9, gridPosY: 4, width:  1.25*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Alt' },
                { keyName: "KEY_CTRL_LEFT",     gridPosX:   0/9, gridPosY: 4, width: 1.625*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Ctrl' },
                { keyName: "KEY_SHIFT_LEFT",    gridPosX:     0, gridPosY: 3, width:   2.5*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: '&#x21d1; Shift' },
                { keyName: "KEY_CAPS_LOCK",     gridPosX:     0, gridPosY: 2, width: 1.875*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Caps Lock' },

                { keyName: "KEY_ARROW_UP",      gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ARROWS", html: '&#x21D1;' },
                { keyName: "KEY_ARROW_DOWN",    gridPosX:     1, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ARROWS", html: '&#x21D3;' },
                { keyName: "KEY_ARROW_LEFT",    gridPosX:     0, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ARROWS", html: '&#x21D0;' },
                { keyName: "KEY_ARROW_RIGHT",   gridPosX:     2, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ARROWS", html: '&#x21D2;' },

                { keyName: "KEY_INSERT",        gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_INS", html: 'Insert' },
                { keyName: "KEY_DELETE",        gridPosX:     0, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_INS", html: 'Delete' },
                { keyName: "KEY_HOME",          gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_INS", html: 'Home' },
                { keyName: "KEY_END",           gridPosX:     1, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_INS", html: 'End' },
                { keyName: "KEY_PAGE_UP",       gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_INS", html: 'Page<br/>Up' },
                { keyName: "KEY_PAGE_DOWN",     gridPosX:     2, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_INS", html: 'Page<br/>Down' },

                { keyName: "KEY_ALT_RIGHT",     gridPosX:  87/9, gridPosY: 4, width:  1.25*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Alt' },
                { keyName: "KEY_CTRL_RIGHT",    gridPosX: 120/9, gridPosY: 4, width: 1.625*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Ctrl' },
                { keyName: "KEY_SHIFT_RIGHT",   gridPosX:    11, gridPosY: 3, width:  2.75*BS, height:   1.0*BS, squareGrid: false, origin: "KEY_ORIGIN_ALPNUM", html: '&#x21d1; Shift' },

                { keyName: "KEY_NUM_LOCK",      gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: 'Num<br/>Lock' },
                { keyName: "KEY_NUM_0",         gridPosX:     0, gridPosY: 4, width: 2.125*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '0<br/>Ins' },
                { keyName: "KEY_NUM_1",         gridPosX:     0, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '1<br/>End' },
                { keyName: "KEY_NUM_2",         gridPosX:     1, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '2<br/>&#x21D3;' },
                { keyName: "KEY_NUM_3",         gridPosX:     2, gridPosY: 3, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '3<br/>Pg Dn' },
                { keyName: "KEY_NUM_4",         gridPosX:     0, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '4<br/>&#x21D0;' },
                { keyName: "KEY_NUM_5",         gridPosX:     1, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '5' },
                { keyName: "KEY_NUM_6",         gridPosX:     2, gridPosY: 2, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '6<br/>&#x21D2;' },
                { keyName: "KEY_NUM_7",         gridPosX:     0, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '7<br/>Home' },
                { keyName: "KEY_NUM_8",         gridPosX:     1, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '8<br/>&#x21D1;' },
                { keyName: "KEY_NUM_9",         gridPosX:     2, gridPosY: 1, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '9<br/>Pg Up' },
                { keyName: "KEY_NUM_DOT",       gridPosX:     2, gridPosY: 4, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '.<br/>Del' },
                { keyName: "KEY_NUM_SLASH",     gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '/' },
                { keyName: "KEY_NUM_ASTERISK",  gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '*' },
                { keyName: "KEY_NUM_MINUS",     gridPosX:     3, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '-' },
                { keyName: "KEY_NUM_PLUS",      gridPosX:     3, gridPosY: 1, width:   1.0*BS, height: 2.125*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: '+' },
                { keyName: "KEY_NUM_ENTER",     gridPosX:     3, gridPosY: 3, width:   1.0*BS, height: 2.125*BS, squareGrid:  true, origin:    "KEY_ORIGIN_NUM", html: 'Enter' },

                { keyName: "KEY_F01",           gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F01", html: 'F1' },
                { keyName: "KEY_F02",           gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F01", html: 'F2' },
                { keyName: "KEY_F03",           gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F01", html: 'F3' },
                { keyName: "KEY_F04",           gridPosX:     3, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F01", html: 'F4' },
                { keyName: "KEY_F05",           gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F05", html: 'F5' },
                { keyName: "KEY_F06",           gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F05", html: 'F6' },
                { keyName: "KEY_F07",           gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F05", html: 'F7' },
                { keyName: "KEY_F08",           gridPosX:     3, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F05", html: 'F8' },
                { keyName: "KEY_F09",           gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F09", html: 'F9' },
                { keyName: "KEY_F10",           gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F09", html: 'F10' },
                { keyName: "KEY_F11",           gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F09", html: 'F11' },
                { keyName: "KEY_F12",           gridPosX:     3, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:    "KEY_ORIGIN_F09", html: 'F12' },

                { keyName: "KEY_PRINT_SCREEN",  gridPosX:     0, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:  "KEY_ORIGIN_PRTSC", html: 'PrtSc<br/>SysRq' },
                { keyName: "KEY_SCROLL_LOCK",   gridPosX:     1, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:  "KEY_ORIGIN_PRTSC", html: 'Scr<br/>Lock' },
                { keyName: "KEY_PAUSE_BREAK",   gridPosX:     2, gridPosY: 0, width:   1.0*BS, height:   1.0*BS, squareGrid:  true, origin:  "KEY_ORIGIN_PRTSC", html: 'Pause<br/>Break' },

                { keyName: "KEY_WIN_LEFT",      gridPosX:  14/9, gridPosY: 4, width:  1.25*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Win' },
                { keyName: "KEY_WIN_RIGHT",     gridPosX:  98/9, gridPosY: 4, width:  1.25*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Win' },
                { keyName: "KEY_MENU",          gridPosX: 109/9, gridPosY: 4, width:  1.25*BS, height:   1.0*BS, squareGrid:  true, origin: "KEY_ORIGIN_ALPNUM", html: 'Menu' }
            ];

            function buildHtml()
            {
                var k, kD;
                var kc = keyboardCanvas;
                var kOv;
                var w, h, t, l;
                var originX, originY;
                var gridPosOffset;
                var br, spT, spL, fs, lh, pr;

                kc.addClass('oki-keyboard-canvas');

                /* reset keyboard boundaries */
                keyboardBoundaries.top = 1999111;
                keyboardBoundaries.right = -1999111;
                keyboardBoundaries.bottom = -1999111;
                keyboardBoundaries.left = 1999111;

                kc.html('');
                for (k=0; k<=lastKeyCodeInUse; k++) {
                    kD = keyData[k];

                    if (!kD.inUse)
                        continue;

                    w = kD.width * zoom;
                    h = kD.height * zoom;
                    t = kD.gridPosY * GS * zoom;

                    if (kD.squareGrid) {
                        /* normal grid */
                        l = kD.gridPosX * GS * zoom;
                    } else {
                        /* keyboard grid */
                        switch (kD.gridPosY % 4) {
                            case 0: gridPosOffset = 0; break;
                            case 1: gridPosOffset = 4; break;
                            case 2: gridPosOffset = 7; break;
                            case 3: gridPosOffset = 12; break;
                        }
                        l = gridPosOffset * zoom + kD.gridPosX * GS * zoom;
                    }

                    originX = keyOrigin[kD.origin].x * zoom;
                    originY = keyOrigin[kD.origin].y * zoom;
                    t = originY + t;
                    l = originX + l;

                    br = 1.0 * zoom;
                    spT = 1.0 * zoom;
                    spL = 1.0 * zoom;
                    fs = 2.0 * zoom;
                    lh = 3.0 * zoom;
                    pr = kD.pressed ? ' pressed ' : '';

                    /* fill buttons */
                    w = w + (buttonFill * (GS - BS)) * zoom;
                    h = h + (buttonFill * (GS - BS)) * zoom;

                    /* create place for hover flag */
                    kD.hovered = false;

                    /* save key boundaries */
                    kD.boundaries = {
                        top    : t,
                        right  : l + w,
                        bottom : t + h,
                        left   : l
                    };

                    /* save keyboard boundaries */
                    keyboardBoundaries.top = kD.boundaries.top < keyboardBoundaries.top ? kD.boundaries.top : keyboardBoundaries.top;
                    keyboardBoundaries.right = kD.boundaries.right > keyboardBoundaries.right ? kD.boundaries.right : keyboardBoundaries.right;
                    keyboardBoundaries.bottom = kD.boundaries.bottom > keyboardBoundaries.bottom ? kD.boundaries.bottom : keyboardBoundaries.bottom;
                    keyboardBoundaries.left = kD.boundaries.left < keyboardBoundaries.left ? kD.boundaries.left : keyboardBoundaries.left;

                    kc.append($('<a href="javascript:void(0)" ' + 
                                '   class="' + pr + ' key-' + kD.keyCode + '" ' +
                                '   keyName="' + kD.keyName + '" ' +
                                '   keyCode="' + kD.keyCode + '" ' + 
                                '   style="border-radius: ' + br + 'px; width: ' + w + 'px; height: ' + h + 'px; top: ' + t + 'px; left: ' + l + 'px;" ' +
                                '>' + 
                                    '<span style="padding: ' + spT + 'px 0 0 ' + spL + 'px; font-size: ' + fs + 'px; line-height: ' + lh + 'px">' + kD.html + '</span>' +
                                '</a>')
                             );
                }


                /* add mouse overlay */
                kOv = $('<div class="overlay"></div>');
                kc.append(kOv);

                /* set dimensions */
                kc.width(keyboardBoundaries.right);
                kc.height(keyboardBoundaries.bottom);
                kOv.width( keyboardBoundaries.right );
                kOv.height( keyboardBoundaries.bottom );
            }

            function printScreenRelase()
            {
                keyPressedUpdate(OkiKb.KEY_PRINT_SCREEN, false);
            }

            function ctrlChanged(pressed)
            {
                keyPressedUpdate(OkiKb.KEY_CTRL_LEFT, pressed);
                keyPressedUpdate(OkiKb.KEY_CTRL_RIGHT, pressed);
            }

            function mapJSKeyCode(keyJSCode, time, pressed, eventJS)
            {
                var found = true;
                var isRightAlt;

                /* numeric 0-9 */
                if (keyJSCode>=48 && keyJSCode<=57) {
                    keyPressedUpdate((keyJSCode-48) + OkiKb.KEY_0, pressed, false, eventJS);
                    return;
                }

                /* letters A-Z */
                if (keyJSCode>=65 && keyJSCode<=90) {
                    keyPressedUpdate((keyJSCode-65) + OkiKb.KEY_A, pressed, false, eventJS);
                    return;
                }

                /* letters F1-F12 */
                if (keyJSCode>=112 && keyJSCode<=123) {
                    keyPressedUpdate((keyJSCode-112) + OkiKb.KEY_F01, pressed, false, eventJS);
                    return;
                }

                /* normal keys with cross browser codes */
                switch (keyJSCode) {
                    case   8: keyPressedUpdate(OkiKb.KEY_BACKSPACE, pressed, false, eventJS); break;
                    case   9: keyPressedUpdate(OkiKb.KEY_TAB, pressed, false, eventJS); break;
                    case  13: keyPressedUpdate(OkiKb.KEY_NUM_ENTER, pressed, false, eventJS); 
                              keyPressedUpdate(OkiKb.KEY_ENTER, pressed, false, eventJS); 
                              break;
                    case  16: keyPressedUpdate(OkiKb.KEY_SHIFT_LEFT, pressed, false, eventJS); 
                              keyPressedUpdate(OkiKb.KEY_SHIFT_RIGHT, pressed, false, eventJS);
                              break;
                    case  17: if (pressed) {
                                  clearTimeout(ctrlKeyPressedTimer);
                                  ctrlKeyPressedTimer = setTimeout(function() { ctrlChanged(true) }, Math.round(CTRL_MAX_DELTA*1.15));
                                  ctrlKeyPressedTime = time;
                              } else {
                                  clearTimeout(ctrlKeyRelasedTimer);
                                  ctrlKeyRelasedTimer = setTimeout(function() { ctrlChanged(false); }, Math.round(CTRL_MAX_DELTA*1.15));
                                  ctrlKeyRelasedTime = time;
                              }
                              break;
                    case  18: isRightAlt = false;
                              if (pressed) {
                                  if (ctrlKeyPressedTimer!==null && (time-ctrlKeyPressedTime)<CTRL_MAX_DELTA) {
                                      clearTimeout(ctrlKeyPressedTimer);
                                      ctrlKeyPressedTimer = null;
                                      isRightAlt = true;
                                  }
                              } else {
                                  if (ctrlKeyRelasedTimer!==null && (time-ctrlKeyRelasedTime)<CTRL_MAX_DELTA) {
                                      clearTimeout(ctrlKeyRelasedTimer);
                                      ctrlKeyRelasedTimer = null;
                                      isRightAlt = true;
                                  }
                              }

                              if (mergeLeftAndRightAlt) {
                                  keyPressedUpdate(OkiKb.KEY_ALT_LEFT, pressed, false, eventJS);
                                  keyPressedUpdate(OkiKb.KEY_ALT_RIGHT, pressed, false, eventJS);
                              } else 
                                  if (isRightAlt)
                                      keyPressedUpdate(OkiKb.KEY_ALT_RIGHT, pressed, false, eventJS); else
                                      keyPressedUpdate(OkiKb.KEY_ALT_LEFT, pressed, false, eventJS);

                              break;
                    case  19: keyPressedUpdate(OkiKb.KEY_PAUSE_BREAK, pressed, false, eventJS); break;
                    case  20: keyPressedUpdate(OkiKb.KEY_CAPS_LOCK, pressed, false, eventJS); break;
                    case  27: keyPressedUpdate(OkiKb.KEY_ESCAPE, pressed, false, eventJS); break;
                    case  32: keyPressedUpdate(OkiKb.KEY_SPACE, pressed, false, eventJS); break;
                    case  33: keyPressedUpdate(OkiKb.KEY_PAGE_UP, pressed, false, eventJS); break;
                    case  34: keyPressedUpdate(OkiKb.KEY_PAGE_DOWN, pressed, false, eventJS); break;
                    case  35: keyPressedUpdate(OkiKb.KEY_END, pressed, false, eventJS); break;
                    case  36: keyPressedUpdate(OkiKb.KEY_HOME, pressed, false, eventJS); break;
                    case  37: keyPressedUpdate(OkiKb.KEY_ARROW_LEFT, pressed, false, eventJS); break;
                    case  38: keyPressedUpdate(OkiKb.KEY_ARROW_UP, pressed, false, eventJS); break;
                    case  39: keyPressedUpdate(OkiKb.KEY_ARROW_RIGHT, pressed, false, eventJS); break;
                    case  40: keyPressedUpdate(OkiKb.KEY_ARROW_DOWN, pressed, false, eventJS); break;
                    case  44: keyPressedUpdate(OkiKb.KEY_PRINT_SCREEN, true, false, eventJS);
                              setTimeout(function() { printScreenRelase(); }, PRINT_SCREEN_FAKE_HOLD_TIME);
                              break;
                    case  45: keyPressedUpdate(OkiKb.KEY_INSERT, pressed, false, eventJS); break;
                    case  46: keyPressedUpdate(OkiKb.KEY_DELETE, pressed, false, eventJS); break;
                    case  91: keyPressedUpdate(OkiKb.KEY_WIN_LEFT, pressed, false, eventJS);
                              keyPressedUpdate(OkiKb.KEY_WIN_RIGHT, pressed, false, eventJS);
                              break;
                    case  93: keyPressedUpdate(OkiKb.KEY_MENU, pressed, false, eventJS); break;
                    case 144: keyPressedUpdate(OkiKb.KEY_NUM_LOCK, pressed, false, eventJS); break;
                    case 145: keyPressedUpdate(OkiKb.KEY_SCROLL_LOCK, pressed, false, eventJS); break;
                    case 188: keyPressedUpdate(OkiKb.KEY_COMMA, pressed, false, eventJS); break;
                    case 190: keyPressedUpdate(OkiKb.KEY_DOT, pressed, false, eventJS); break;
                    case 191: keyPressedUpdate(OkiKb.KEY_SLASH, pressed, false, eventJS); break;
                    case 192: keyPressedUpdate(OkiKb.KEY_GRAVE_ACCENT, pressed, false, eventJS); break;
                    case 219: keyPressedUpdate(OkiKb.KEY_BRACKET_LEFT, pressed, false, eventJS); break;
                    case 220: keyPressedUpdate(OkiKb.KEY_BACKSLASH, pressed, false, eventJS); break;
                    case 221: keyPressedUpdate(OkiKb.KEY_BRACKET_RIGHT, pressed, false, eventJS); break;
                    case 222: keyPressedUpdate(OkiKb.KEY_APOSTROPHE, pressed, false, eventJS); break;
                    default : found = false;
                }

                if (found)
                    return;
                found = true;

                /* ;:   =+   -_ */
                if ($.browser.msie || $.browser.webkit || $.browser.opera) {
                    switch (keyJSCode) {
                        case 186: keyPressedUpdate(OkiKb.KEY_SEMICOLON, pressed, eventJS); break;
                        case 187: keyPressedUpdate(OkiKb.KEY_EQUALS, pressed, eventJS); break;
                        case 189: keyPressedUpdate(OkiKb.KEY_MINUS, pressed, eventJS); break;
                        default : found = false;
                    }
                } else
                    if ($.browser.mozilla) {   
                        switch (keyJSCode) {
                            case  59: keyPressedUpdate(OkiKb.KEY_SEMICOLON, pressed, eventJS); break;
                            case  61: keyPressedUpdate(OkiKb.KEY_EQUALS, pressed, eventJS); break;
                            case 173: keyPressedUpdate(OkiKb.KEY_MINUS, pressed, eventJS); break;

                            default : found = false;
                        }
                    }

                if (found)
                    return;
                found = true;

                /* numeric block */
                switch (keyJSCode) {
                    case  96: keyPressedUpdate(OkiKb.KEY_NUM_0, pressed, eventJS); break;
                    case  97: keyPressedUpdate(OkiKb.KEY_NUM_1, pressed, eventJS); break;
                    case  98: keyPressedUpdate(OkiKb.KEY_NUM_2, pressed, eventJS); break;
                    case  99: keyPressedUpdate(OkiKb.KEY_NUM_3, pressed, eventJS); break;
                    case 100: keyPressedUpdate(OkiKb.KEY_NUM_4, pressed, eventJS); break;
                    case  12: 
                    case 101: keyPressedUpdate(OkiKb.KEY_NUM_5, pressed, eventJS); 
                              break;
                    case 102: keyPressedUpdate(OkiKb.KEY_NUM_6, pressed, eventJS); break;
                    case 103: keyPressedUpdate(OkiKb.KEY_NUM_7, pressed, eventJS); break;
                    case 104: keyPressedUpdate(OkiKb.KEY_NUM_8, pressed, eventJS); break;
                    case 105: keyPressedUpdate(OkiKb.KEY_NUM_9, pressed, eventJS); break;
                    case 106: keyPressedUpdate(OkiKb.KEY_NUM_ASTERISK, pressed, eventJS); break;
                    case 107: keyPressedUpdate(OkiKb.KEY_NUM_PLUS, pressed, eventJS); break;
                    case 109: keyPressedUpdate(OkiKb.KEY_NUM_MINUS, pressed, eventJS); break;
                    case 110: keyPressedUpdate(OkiKb.KEY_NUM_DOT, pressed, eventJS); break;
                    case 111: keyPressedUpdate(OkiKb.KEY_NUM_SLASH, pressed, eventJS); break;
                    default : found = false;
                }

            }

            function fireKeyEventCallback(kD, _repeated, eventJS)
            {
                var mK = { altL       : keyData[OkiKb.KEY_ALT_LEFT].pressed,
                           ctrlL      : keyData[OkiKb.KEY_CTRL_LEFT].pressed,
                           shiftL     : keyData[OkiKb.KEY_SHIFT_LEFT].pressed,
                           altR       : keyData[OkiKb.KEY_ALT_RIGHT].pressed,
                           ctrlR      : keyData[OkiKb.KEY_CTRL_RIGHT].pressed,
                           shiftR     : keyData[OkiKb.KEY_SHIFT_RIGHT].pressed,
                           alt        : null,
                           ctrl       : null,
                           shift      : null,
                           onlyAltL   : null,
                           onlyCtrlL  : null,
                           onlyShiftL : null,
                           onlyAltR   : null,
                           onlyCtrlR  : null,
                           onlyShiftR : null,
                           onlyAlt    : null,
                           onlyCtrl   : null,
                           onlyShift  : null
                         };
                         
                if (typeof eventJS === 'undefined')
                    eventJS = null;

                mK.alt = mK.altL || mK.altR;
                mK.ctrl = mK.ctrlL || mK.ctrlR;
                mK.shift = mK.shiftL || mK.shiftR;

                mK.onlyAltL = mK.altL && !(mK.altR || mK.ctrlL || mK.ctrlR || mK.shiftL || mK.shiftR);
                mK.onlyAltR = mK.altR && !(mK.altL || mK.ctrlL || mK.ctrlR || mK.shiftL || mK.shiftR);

                mK.onlyCtrlL = mK.ctrlL && !(mK.altL || mK.altR || mK.ctrlR || mK.shiftL || mK.shiftR);
                mK.onlyCtrlR = mK.ctrlR && !(mK.altL || mK.altR || mK.ctrlL || mK.shiftL || mK.shiftR);

                mK.onlyShiftL = mK.shiftL && !(mK.altL || mK.altR || mK.ctrlL || mK.ctrlR || mK.shiftR);
                mK.onlyShiftR = mK.shiftR && !(mK.altL || mK.altR || mK.ctrlL || mK.ctrlR || mK.shiftL);

                mK.onlyAlt = mK.alt && !(mK.ctrl || mK.shift);
                mK.onlyCtrl = mK.ctrl && !(mK.alt || mK.shift);
                mK.onlyShift = mK.shift && !(mK.alt || mK.ctrl);


                /* TODO polish chars using:   modKeys.altR && !(modKeys.Ctrl || !modKeys.altL); */

                keyEventCallback({ keyName      : kD.keyName, 
                                   keyCode      : kD.keyCode, 
                                   pressed      : kD.pressed, 
                                   repeated     : _repeated, 
                                   modKeys      : mK,
                                   html         : kD.html, 
                                   eventJS      : eventJS,
                                   longerWidth  : (kD.width/BS>1.0 ? true : false) 
                                });
            }

            function keyPressedUpdate(keyCode, pressed, forcedByMouseMode, eventJS)
            {
                var kD;
                var canvasButton;
                
                if (typeof eventJS === 'undefined')
                    eventJS = null;

                if (keyCode>lastKeyCodeInUse)
                    return;

                kD = keyData[keyCode];
                if (!kD || !kD.inUse)
                    return;

                forcedByMouseMode = (typeof forcedByMouseMode === 'undefined') ? false : (forcedByMouseMode ? true : false);
                if (!forcedByMouseMode && kD.pressedForcedByMouse) 
                    return;                 /* prevent 'unpress' key when no in forcedByMouseMode */

                if ((kD.pressed != pressed) || forcedByMouseMode) {

                    if (forcedByMouseMode) {
                        kD.pressed = kD.pressed ? false : true;
                        kD.pressedForcedByMouse = kD.pressed;
                    } else {
                        kD.pressed = pressed;
                    }

                    if (keyEventCallback) {
                        fireKeyEventCallback(kD, false, eventJS);

                        if (keyAutoRepeat) {
                            clearTimeout(lastPressedKeyCodeDelayTimer);
                            clearInterval(lastPressedKeyCodeRepeatInterval);
                            if (kD.pressed) {
                                lastPressedKeyCodeDelayTimer = setTimeout(function() {
                                    fireKeyEventCallback(kD, true);

                                    clearInterval(lastPressedKeyCodeRepeatInterval);
                                    lastPressedKeyCodeRepeatInterval = setInterval(function() {
                                        fireKeyEventCallback(kD, true);
                                    }, keyAutoRepeat.repeatTime);

                                }, keyAutoRepeat.delayTime);
                            }
                        }
                    }

                    if (keyboardCanvas) {
                        canvasButton = keyboardCanvas.find('> a.key-' + keyCode);
                        if (kD.pressed)
                            canvasButton.addClass('pressed'); else
                            canvasButton.removeClass('pressed');
                    }
                }
            }

            function keyHoverUpdate(keyCode, isHovered)
            {
                var kD;
                var canvasButton;

                if (keyCode>lastKeyCodeInUse)
                    return;

                kD = keyData[keyCode];
                if (!kD || !kD.inUse)
                    return;

                if (kD.hovered != isHovered) {
                    kD.hovered = isHovered;

                    if (keyboardCanvas) {
                        canvasButton = keyboardCanvas.find('> a.key-' + keyCode);
                        if (isHovered)
                            canvasButton.addClass('hover'); else
                            canvasButton.removeClass('hover');
                    }
                }
            }

            function findKeyCodeInDiv(e, div)
            {
                var offset = div.offset();
                var relX = e.pageX - offset.left;
                var relY = e.pageY - offset.top;
                var kD;
                var i, b;

                for (i=0; i<=lastKeyCodeInUse; i++) {
                    kD = keyData[i];
                    if (!kD.inUse)
                        continue;

                    b = kD.boundaries;
                    if (b.left<relX && relX<b.right && b.top<relY && relY<b.bottom)
                        return kD.keyCode;
                }

                return null;
            }

            function assingMouseEvents()
            {
                var kOv;

                mousePressedKeyCodeList = new Array();
                mousePressedKeyCodeListCount = 0;
                mouseHoveredKeyCodeList = new Array();
                mouseHoveredKeyCodeListCount = 0;

                function clearHoveredKeyCodes(withoutKeyCode)
                {
                    for (var i=0; i<mouseHoveredKeyCodeListCount; i++)
                        if (withoutKeyCode==='all' || (withoutKeyCode!=='all' && mouseHoveredKeyCodeList[i]!=withoutKeyCode))
                            keyHoverUpdate(mouseHoveredKeyCodeList[i], false);

                    mouseHoveredKeyCodeList = new Array();
                    mouseHoveredKeyCodeListCount = 0;
                }

                function clearPressedKeyCodes(withoutKeyCode)
                {
                    for (var i=0; i<mousePressedKeyCodeListCount; i++)
                        if (withoutKeyCode==='all' || (withoutKeyCode!=='all' && mousePressedKeyCodeList[i]!=withoutKeyCode))
                            keyPressedUpdate(mousePressedKeyCodeList[i], false);

                    mousePressedKeyCodeList = new Array();
                    mousePressedKeyCodeListCount = 0;
                }

                kOv = keyboardCanvas.find('div.overlay');
                kOv.bind("contextmenu", function(e) { return false; });

                kOv.mousedown(function(e) {
                    var foundKeyCode;

                    if (e.which==1 || e.which==3) {
                        foundKeyCode = findKeyCodeInDiv(e, $(this));
                    }

                    switch (e.which) {
                        case 1: mouseLeftButton = true; 
                                if (foundKeyCode===null) {
                                    clearPressedKeyCodes('all');
                                } else {
                                    clearPressedKeyCodes(foundKeyCode);
                                    keyPressedUpdate(foundKeyCode, true);

                                    mousePressedKeyCodeList.push(foundKeyCode);
                                    mousePressedKeyCodeListCount++;
                                }
                                break;
                        case 3: if (foundKeyCode)
                                    keyPressedUpdate(foundKeyCode, true, true);
                                break;
                    }

                    e.preventDefault();
                });

                kOv.mouseup(function(e) {
                    switch (e.which) {
                        case 1: mouseLeftButton = false;  
                                clearPressedKeyCodes('all');
                                break;
                        case 3: break;
                    }
                    e.preventDefault();
                });

                kOv.mousemove(function(e) {
                    var foundKeyCode;

                    foundKeyCode = findKeyCodeInDiv(e, $(this));
                    if (foundKeyCode===null) {
                        clearHoveredKeyCodes('all');
                        clearPressedKeyCodes('all');
                    } else {
                        clearHoveredKeyCodes(foundKeyCode);
                        keyHoverUpdate(foundKeyCode, true);

                        mouseHoveredKeyCodeList.push(foundKeyCode);
                        mouseHoveredKeyCodeListCount++;

                        if (mouseLeftButton) {
                            clearPressedKeyCodes(foundKeyCode);
                            keyPressedUpdate(foundKeyCode, true);

                            mousePressedKeyCodeList.push(foundKeyCode);
                            mousePressedKeyCodeListCount++;
                        }
                    }

                    e.preventDefault();
                });

                kOv.mouseout(function() {
                    clearHoveredKeyCodes('all');
                    clearPressedKeyCodes('all');
                });
            }

            function configureChoosenLayout()
            {
                /*
                switch (keyboardLayout) {
                    case 'Layout1' : lastKeyCodeInUse = 55 - 1; break;
                    case 'Layout2' : lastKeyCodeInUse = 56 - 1; break;
                    case 'Layout3' : lastKeyCodeInUse = 60 - 1; break;
                    case 'Layout4' : lastKeyCodeInUse = 66 - 1; break;
                    case 'Layout5' : lastKeyCodeInUse = 69 - 1; break;
                    case 'Layout6' : lastKeyCodeInUse = 86 - 1; break;
                    case 'Layout7' : lastKeyCodeInUse = 98 - 1; break;
                    case 'Layout8' : lastKeyCodeInUse = 101 - 1; break;
                    case 'Layout9' : lastKeyCodeInUse = 104 - 1; break;
                    default        : keyboardLayout = 'Layout5';
                                     lastKeyCodeInUse = 69 - 1; 
                                     break;
                }
                */

                var usedKeys;

                usedKeys = parseInt(keyboardLayout.toString().replace('Layout', ''));
                usedKeys = usedKeys>keyData.length ? keyData.length : usedKeys;


                var k, kD;
                for (k=0; k<usedKeys; k++) {
                    kD = keyData[k];
                    kD.inUse = true;
                }
                lastKeyCodeInUse = usedKeys - 1;

                /* correct keys layout if needed */
                /*
                switch (keyboardLayout) {
                    case 'Layout1' : keyOrigin.KEY_ORIGIN_ALPNUM = { x: 0, y: 0 };
                                     keyData[OkiKb.KEY_ALT_LEFT].gridPosX = keyData[OkiKb.KEY_ALT_RIGHT].gridPosX;
                                     break;
                    case 'Layout2' : 
                    case 'Layout3' : 
                    case 'Layout4' : keyData[OkiKb.KEY_DELETE].gridPosX = 1; keyData[OkiKb.KEY_DELETE].gridPosY = 0; 
                                     keyData[OkiKb.KEY_HOME].gridPosX = 2; keyData[OkiKb.KEY_HOME].gridPosY = 0; 
                                     keyData[OkiKb.KEY_END].gridPosX = 3; keyData[OkiKb.KEY_END].gridPosY = 0; 
                                     keyData[OkiKb.KEY_PAGE_UP].gridPosX = 4; keyData[OkiKb.KEY_PAGE_UP].gridPosY = 0; 
                                     keyData[OkiKb.KEY_PAGE_DOWN].gridPosX = 5; keyData[OkiKb.KEY_PAGE_DOWN].gridPosY = 0; 
                                     keyData[OkiKb.KEY_ALT_LEFT].gridPosX = keyData[OkiKb.KEY_ALT_RIGHT].gridPosX;

                                     keyOrigin.KEY_ORIGIN_ARROWS = { x: 107, y: 39 };
                                     keyOrigin.KEY_ORIGIN_INS    = { x:  80, y:  0 };

                                     mergeLeftAndRightAlt = true;
                                     break;
                }
                */
            }

            function initFetchParamaters()
            {
                var par = settings;
                
                /* keyboardCanvas */
                keyboardCanvas = (typeof par.keyboardCanvas === 'undefined') ? null : par.keyboardCanvas;
                if (keyboardCanvas && keyboardCanvas.size()!=1)
                    keyboardCanvas = null;

                /* zoom */
                zoom = (typeof par.zoom === 'undefined') ? 4.0 : parseFloat(par.zoom);
                zoom = (zoom>10.0) ? 10.0 : zoom;
                zoom = (zoom<1.0) ? 1.0 : zoom;

                /* buttonFill */
                buttonFill = (typeof par.buttonFill === 'undefined') ? 0 : parseInt(par.buttonFill);
                buttonFill = (buttonFill<0 || buttonFill>2) ? 0 : buttonFill;
                buttonFill = buttonFill / 2.0;

                /* mergeLeftAndRightAlt */
                mergeLeftAndRightAlt = (typeof par.mergeLeftAndRightAlt === 'undefined') ? true : (par.mergeLeftAndRightAlt ? true : false);

                /* keyboardLayout */
                keyboardLayout = (typeof par.keyboardLayout === 'undefined') ? '' : par.keyboardLayout;
                /*
                switch (keyboardLayout) {
                    case 'Layout1' : 
                    case 'Layout2' : 
                    case 'Layout3' : 
                    case 'Layout4' : 
                    case 'Layout5' : 
                    case 'Layout6' : 
                    case 'Layout7' : 
                    case 'Layout8' : 
                    case 'Layout9' : break;
                    default        : keyboardLayout = 'Layout5';
                                     break;
                }
                */

                /* keyAutoRepeat */
                if ((typeof par.keyAutoRepeat === 'undefined') || !par.keyAutoRepeat) {
                    keyAutoRepeat = null;
                } else {    
                    keyAutoRepeat.delayTime = (typeof par.keyAutoRepeat.delayTime !== 'undefined') ? parseInt(par.keyAutoRepeat.delayTime) : keyAutoRepeat.delayTime;
                    keyAutoRepeat.repeatTime = (typeof par.keyAutoRepeat.repeatTime !== 'undefined') ? parseInt(par.keyAutoRepeat.repeatTime) : keyAutoRepeat.repeatTime;
                    keyAutoRepeat.delayTime = (keyAutoRepeat.delayTime<250) ? 250 : keyAutoRepeat.delayTime;
                    keyAutoRepeat.delayTime = (keyAutoRepeat.delayTime>1000) ? 1000 : keyAutoRepeat.delayTime;
                    keyAutoRepeat.repeatTime = (keyAutoRepeat.repeatTime<33) ? 33 : keyAutoRepeat.repeatTime;
                    keyAutoRepeat.repeatTime = (keyAutoRepeat.repeatTime>500) ? 500 : keyAutoRepeat.repeatTime;
                }

                /* keyEventCallback */
                keyEventCallback = (typeof par.keyEventCallback !== 'function') ? null : par.keyEventCallback;
            }

            function init()
            {
                var k, kD;

                if (inited)
                    return;
                inited = true;

                objToListenEvents = $this;
                initFetchParamaters();

                /* assign keyCode to keyName and add some extra fields to keyData */
                for (k=0; k<keyData.length; k++) {
                    kD = keyData[k];
                    OkiKb[kD.keyName] = k;
                    kD.keyCode = k;

                    /* create place for key stuff */
                    kD.hovered = false;
                    kD.pressed = false;
                    kD.pressedForcedByMouse = false;  /* by right click, this can be unpressed only by mouse or keyboard keyup */
                    kD.boundaries = {
                        top    : null,
                        right  : null,
                        bottom : null,
                        left   : null
                    };
                    kD.inUse = false; /* configureChoosenLayout() set inUse to true for only required keys */
                }

                /* setup layout */
                configureChoosenLayout();

                /* catch browser keydown event */
                objToListenEvents.keydown(function (e) {
                    var now = (new Date()).getTime();
                    mapJSKeyCode(parseInt(e.keyCode), now - nowOnStart, true, e);
                });

                /* catch browser keyup event */
                objToListenEvents.keyup(function (e) {
                    var now = (new Date()).getTime();

                    mapJSKeyCode(parseInt(e.keyCode), now - nowOnStart, false, e);
                });

                /* draw virtual keyboard */
                if (keyboardCanvas) {
                    buildHtml();
                    assingMouseEvents();        
                }
            }

            function isKeyPressed(keyCode)
            {
                var kD;

                if (!inited)
                    return null;

                if (keyCode>lastKeyCodeInUse)
                    return null;

                kD = keyData[keyCode];
                if (!kD || !kD.inUse)
                    return null;

                return kD.pressed;
            }

            function getAllKeysPressedFlag()
            {
                var flagBytesCount = Math.ceil( (lastKeyCodeInUse+1)/8 );
                var flagBytes = new Array();
                var tmpByte;
                var i, j;
                var keyCode;

                if (!inited)
                    return null;

                for (i=0; i<flagBytesCount; i++) {
                    tmpByte = 0;
                    for (j=0; j<8; j++) {
                        keyCode = i*8 + j;
                        if (keyCode>lastKeyCodeInUse)
                            break;
                        tmpByte = tmpByte + ((keyData[keyCode].pressed && keyData[keyCode].inUse) ? Math.pow(2, j) : 0);
                    }
                    flagBytes.push(tmpByte);
                }

                return { flagBytes      : flagBytes,
                         flagBytesCount : flagBytesCount
                       };
            }

            function getAllKeysInUseFlag()
            {
                var flagBytesCount = Math.ceil( (lastKeyCodeInUse+1)/8 );
                var flagBytes = new Array();
                var tmpByte;
                var i, j;
                var keyCode;

                if (!inited)
                    return null;

                for (i=0; i<flagBytesCount; i++) {
                    tmpByte = 0;
                    for (j=0; j<8; j++) {
                        keyCode = i*8 + j;
                        if (keyCode>lastKeyCodeInUse)
                            break;
                        tmpByte = tmpByte + ((keyData[keyCode].inUse) ? Math.pow(2, j) : 0);
                    }
                    flagBytes.push(tmpByte);
                }

                return { flagBytes      : flagBytes,
                         flagBytesCount : flagBytesCount
                       };
            }

            function getKeyboardDetails()
            {
                var details = { keys             : null,
                                keysCount        : null,
                                boundaries       : null,
                                width            : null,
                                height           : null,
                                lastKeyCodeInUse : null
                              };
                var tmpKey, kD;
                var i;

                if (!inited)
                    return null;


                /* keys data */
                details.keys = new Array();
                details.keysCount = 0;
                for (i=0; i<=lastKeyCodeInUse; i++) {
                    kD = keyData[i];

                    if (!kD.inUse)
                        continue;

                    tmpKey = { keyName    : kD.keyName,
                               keyCode    : kD.keyCode,
                               pressed    : kD.pressed,
                               width      : kD.width,
                               height     : kD.height,
                               boundaries : kD.boundaries,
                               html       : kD.html
                            };
                    details.keys.push(tmpKey);
                    details.keysCount++;
                }

                /* other current keyboard data */
                details.boundaries = {
                    top    : keyboardBoundaries.top,
                    right  : keyboardBoundaries.right,
                    bottom : keyboardBoundaries.bottom,
                    left   : keyboardBoundaries.left
                };

                details.width = keyboardBoundaries.right;
                details.height = keyboardBoundaries.bottom;
                details.lastKeyCodeInUse = lastKeyCodeInUse;

                return details;
            }

            function detach()
            {
                if (!inited)
                    return;

                inited = false;

                clearTimeout( ctrlKeyPressedTimer );
                clearTimeout( ctrlKeyRelasedTimer );
                clearTimeout( lastPressedKeyCodeDelayTimer );
                clearInterval( lastPressedKeyCodeRepeatInterval );

                objToListenEvents.unbind('keydown');
                objToListenEvents.unbind('keyup');
                if (keyboardCanvas) {
                    keyboardCanvas.find('> *').remove();
                    keyboardCanvas.css('width', '');
                    keyboardCanvas.css('height', '');
                }
            }
            
        }
        
        /* ------------------------------------------------------------------ */
        
        var pluginData;
        var pluginDataName = 'OkiKeyboard';
        
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
                pluginData = new OkiKeyboardClass();
                pluginData.init($(this), param);
                $(this).data(pluginDataName, pluginData);
            } else {
                throw 'ERROR: Already inited.';
            }
        });
    };
    
})(jQuery);
