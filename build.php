<?php 

    include_once dirname(__FILE__).'/functions.php';
    
    echo '<pre>';
    
    $copyrightTest = 
"/*"."\n".
" *   OkiWidgets 2.0"."\n".
" *"."\n".
" *   Complete solution for UI on your website!"."\n".
" *"."\n".
" *                                                                Robert Rypula"."\n".
" *                                                   robert.rypula{at}okinet.pl"."\n".
" *                                                         http://www.okinet.pl"."\n".
" * -----------------------------------------------------------------------------"."\n".
" */"."\n\n\n";
    
    // build JS
    $jsFull = '';
    foreach (readDirAndFiles('src', 'Oki', '.js') as $v) {
        $js = file_get_contents(dirname(__FILE__).'/src/'.$v);
        echo 'Load OK - /src/'.$v.'<br/>';
        $jsFull .= $js;
        $jsFull .= "\n\n";
        $jsFull .= "/* -------------------------------------------------------------------------- */\n";
        $jsFull .= "/* -------------------------------------------------------------------------- */\n";
        $jsFull .= "\n\n";
    }
    
    $jsFull = $copyrightTest.$jsFull;
    file_put_contents(dirname(__FILE__).'/build/OkiWidgets-v2.0.js', $jsFull);
    echo '/build/OkiWidgets-v2.0.js - build OK!<br/><br/><br/>';
    
    
    // build CSS
    $cssFull = file_get_contents(dirname(__FILE__).'/src/css/_OkiCommon.css');
    foreach (readDirAndFiles('src/css', 'Oki', '_base.css') as $v) {
        $css = file_get_contents(dirname(__FILE__).'/src/css/'.$v);
        echo 'Load OK - /src/css/'.$v.'<br/>';
        $cssFull .= $css;
        $cssFull .= "\n\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "\n\n";
    }
    foreach (readDirAndFiles('src/css', 'Oki', '_theme.css') as $v) {
        $css = file_get_contents(dirname(__FILE__).'/src/css/'.$v);
        echo 'Load OK - /src/css/'.$v.'<br/>';
        $cssFull .= $css;
        $cssFull .= "\n\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "/* -------------------------------------------------------------------------- */\n";
        $cssFull .= "\n\n";
    }
    
    $cssFull = $copyrightTest.$cssFull;
    file_put_contents(dirname(__FILE__).'/build/OkiWidgets-v2.0.css', $cssFull);
    echo '/build/OkiWidgets-v2.0.css - build OK!<br/><br/><br/>';
    
    
    echo 'Scripts and styles files joined successfully!';
    
    echo '</pre>';