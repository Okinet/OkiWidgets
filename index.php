<!DOCTYPE html>
<html>
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
                        Demo page of new OkiWidgets that should be ready in near time. Demo page of new OkiWidgets that 
                        should be ready in near time. Demo page of new OkiWidgets that should be ready in near time. Demo 
                        page of new OkiWidgets that should be ready in near time. Demo page of new OkiWidgets that should 
                        be ready in near time. Demo page of new OkiWidgets that should be ready in near time. Demo page of 
                        new OkiWidgets that should be ready in near time. Demo page of new OkiWidgets that should be ready 
                        in near time. 
                        <br/><br/><br/>
                        <a href="build.php">Build</a><br/>
                        <a href="build/OkiWidgets.js" target="_blank">Download JS</a><br/>
                        <a href="build/OkiWidgets.css" target="_blank">Download CSS</a>
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