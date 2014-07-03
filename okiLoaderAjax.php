<?php
    $data = array();
    $method = '';
    if (count($_GET)>0) {
        $data = $_GET;
        $method = 'GET';
    } else
        if (count($_POST)>0) {
            $data = $_POST;
            $method = 'POST';
        }
        
    if ($method!="") {
        if (isset($data['generateServerError']) && $data['generateServerError']=='1') {
            header('HTTP/1.1 500 Internal Server Error', true, 500);
            exit;
        }
        
        echo 'Method: '.$method."\n\n";
        print_r($data);
        if (isset($data['fakeDelayMs']) && intval($data['fakeDelayMs'])>0) {
            usleep(1000*intval($data['fakeDelayMs']));
        }
    }