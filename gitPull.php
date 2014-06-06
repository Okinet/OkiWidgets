<?php

echo '<pre>';
$lines = array();
exec('git pull origin master', $lines);
foreach ($lines as $k => $v) {
    echo $k.'. '.htmlspecialchars($v)."\n";
}
echo '</pre>';