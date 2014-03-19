<?php


function readDirAndFiles($dirPath, $filePrefix, $fileSuffix, $excludeArray = array())
{
    $files = array();
    
    $dirPath = dirname(__FILE__).'/'.$dirPath;
    
    if ($handle = opendir($dirPath)) {
        while (false !== ($entry = readdir($handle))) {
            
            if (in_array($entry, $excludeArray))
                continue;
            
            if ($entry != "." && $entry != "..") {
                if (($filePrefix!==null ? strpos($entry, $filePrefix)===0 : true) && ($fileSuffix!==null ? (strpos($entry, $fileSuffix)!==false && strpos($entry, $fileSuffix)===(strlen($entry)-strlen($fileSuffix))) : true))
                    $files[] = $entry;
            }
        }
        closedir($handle);
    }
    
    return $files;
}


?>