<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>OkiWidgets v2.14.03.19.1013</title>
        
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
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Arial'; color: #6e6e70;">
    
        <div style="width: 100%; overflow: hidden;">
            <div style="width: 960px; min-height: 700px; background-color: #fff; margin: 0 auto;">
                
                <div style="background-color: #d8dadb; font-size: 34px; line-height: 34px; color: #582e92; padding: 10px;">
                    OkiWidgets v2.13.03.19.1013
                </div>
                
                <div style="padding: 20px;">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br/><br/><br/>
                    <a href="build.php" target="_blank">Build</a><br/>
                    <a href="build/OkiWidgets.js" target="_blank">Download JS</a><br/>
                    <a href="build/OkiWidgets.css" target="_blank">Download CSS</a>
                    <br/><br/><br/>
                    
                    
                    <?php foreach (readDirAndFiles('', 'Oki', '.html') as $v): ?>
                        <?php $title = str_replace('.html', '', $v) ?>
                    
                        <div style="margin: 50px 0 0px 0; height: 1px; background-color: #582e92; overflow: hidden;">&nbsp;</div>
                        <div class="clear">&nbsp;</div>
                        <div>
                            <h2><?php echo $title ?></h2>
                        </div>
                        <div id="oki-<?php echo str_replace('.html', '', str_replace('oki', '', strtolower($v))) ?>-container">
                            <?php include_once dirname(__FILE__).'/'.$v; ?>
                        </div>
                    

                    <?php endforeach ?>
                    
                
                </div>

            </div>
        </div>
    
    </body>    
</html>