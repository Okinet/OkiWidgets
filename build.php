<?php 

    include_once dirname(__FILE__).'/functions.php';
    
    
    // build JS
    $jsFull = '';
    foreach (readDirAndFiles('src', 'Oki', '.js') as $v) {
        $js = file_get_contents(dirname(__FILE__).'/src/'.$v);
        $jsFull .= $js;
        $jsFull .= "\n\n";
        $jsFull .= "/* -------------------------------------------------------------------------- */\n";
        $jsFull .= "/* -------------------------------------------------------------------------- */\n";
        $jsFull .= "\n\n";
    }
    
    file_put_contents(dirname(__FILE__).'/build/OkiWidgets.js', $jsFull);
    
    
    // build CSS
    $cssFull = file_get_contents(dirname(__FILE__).'/src/css/_OkiCommon.css');
    foreach (readDirAndFiles('src/css', 'Oki', '_base.css') as $v) {
        $css = file_get_contents(dirname(__FILE__).'/src/css/'.$v);
        $cssFull .= $css;
        $cssFull .= "\n\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "\n\n";
    }
    foreach (readDirAndFiles('src/css', 'Oki', '_theme.css') as $v) {
        $css = file_get_contents(dirname(__FILE__).'/src/css/'.$v);
        $cssFull .= $css;
        $cssFull .= "\n\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "\n\n";
    }
    
    file_put_contents(dirname(__FILE__).'/build/OkiWidgets.css', $cssFull);
    
    
    echo 'Builded! Go back to <a href="/">index page</a> and use "Download JS" and "Download CSS" links get fresh build.';