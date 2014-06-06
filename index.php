<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="UTF-8" />
        <title>OkiWidgets v2.0 alpha</title>
        
        <?php include_once dirname(__FILE__).'/functions.php'; ?>
        
        <!-- vendor scripts -->
        <script src="src/vendor/jquery-1.11.0.min.js"></script>
        <?php foreach (readDirAndFiles('src/vendor', null, '.js', array('jquery-1.11.0.min.js')) as $v): ?>
            <script src="src/vendor/<?php echo $v ?>"></script>
        <?php endforeach ?>
        <!-- vendor scripts END -->
        
        <!-- OkiWidgets scripts -->
        <?php foreach (readDirAndFiles('src', 'Oki', '.js') as $v): ?>
            <script src="src/<?php echo $v ?>"></script>
        <?php endforeach ?>
        <!-- OkiWidgets scripts END -->
        
        <!-- OkiWidgets css -->
        <link rel="stylesheet" href="src/css/_OkiCommon.css" />
        <?php foreach (readDirAndFiles('src/css', 'Oki', '_base.css', array('_OkiCommon.css')) as $v): ?>
            <link rel="stylesheet" href="src/css/<?php echo $v ?>" />
        <?php endforeach ?>
            
        <?php foreach (readDirAndFiles('src/css', 'Oki', '_theme.css') as $v): ?>
            <link rel="stylesheet" href="src/css/<?php echo $v ?>" />
        <?php endforeach ?>
        <!-- OkiWidgets css END -->
       
    </head>
    <body>
    
        <div class="wrapper">
            <div class="wrapper-center">
                <div class="main-container">

                    <div style="background-color: #d8dadb; font-size: 34px; line-height: 34px; color: #777; padding: 10px;">
                        OkiWidgets v2.0 alpha
                    </div>

                    <div class="main-container-padd">
                        
                        <div class="text-formated">
                            <p>
                                This page contains new version of OkiWidgets. Library was fully rewritten and has many improvements.
                                Each widget if separate jQuery plugin and can be use standalone. To use OkiWidget on you website
                                please follow the four steps below:
                            </p>
                        </div>
                        
                        <h3>1. Pull fresh code from repo</h3>
                        <div class="text-formated">
                            <p>
                                OkiWidget is still under development so at the begginig you should pull fresh code from git repository
                            </p>
                            <a class="button" href="javascript:void(0)" onClick="ajaxRun($(this), 'gitPull.php', $(this).next('div.ajax-log-box'))">git pull origin master</a>
                            <div class="ajax-log-box"></div>
                        </div>
                        
                        <h3>2. Build fresh JS and CSS</h3>
                        <div class="text-formated">
                            <p>
                                As you can see in source of this demo page all widgets was included <b>as separate files</b>.
                                For production environment please use link below to <b>join all files</b> to only two:
                            </p>
                            <a class="button" href="javascript:void(0)" onClick="ajaxRun($(this), 'build.php', $(this).next('div.ajax-log-box'))">Build</a>
                            <div class="ajax-log-box"></div>
                        </div>
                        
                        <h3>3. Download files</h3>
                        <div class="text-formated">
                            <p>
                                After building you can use link below to download JS and CSS
                            </p>
                            <a class="button" href="build/OkiWidgets-v2.0.js" target="_blank">Download OkiWidgets-v2.0.js</a><br/>
                            <a class="button" href="build/OkiWidgets-v2.0.css" target="_blank">Download OkiWidgets-v2.0.css</a>
                        </div>
                        
                        <h3>4. Use OkiWidgets on you website!</h3>
                        <div class="text-formated">
                            <p>
                                Put CSS and JS to proper places and just include them in head
                            </p>
                            <div class="code code-html"><?php 
                                echo htmlspecialchars('<script src="js/OkiWidgets-v2.0.js"></script>').'<br/>';
                                echo htmlspecialchars('<link rel="stylesheet" href="css/OkiWidgets-v2.0.css" />');
                            ?></div>
                        </div>
                        
                        <br/><br/><br/>
                        
                        
                        <?php foreach (readDirAndFiles('demo-site', 'Oki', '.html') as $v): ?>
                            <?php $title = str_replace('.html', '', $v) ?>

                            <div style="margin: 50px 0 0px 0; height: 1px; background-color: #eaeaea; overflow: hidden;">&nbsp;</div>
                            <div class="clear">&nbsp;</div>
                            <div>
                                <h2><?php echo $title ?></h2>
                            </div>
                            <div id="oki-<?php echo str_replace('.html', '', str_replace('oki', '', strtolower($v))) ?>-container">
                                <?php include_once dirname(__FILE__).'/demo-site/'.$v; ?>
                            </div>

                        <?php endforeach ?>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    
    </body>    
    
    <!-- demo site -->
    <script src="demo-site/js/script.js"></script>
    <link rel="stylesheet" href="demo-site/css/style.css" />
    <!-- demo site END -->
</html>