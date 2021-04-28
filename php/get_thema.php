<?php
$html = "";
$result = glob('../themes/*.json');
for ($i=0; $i < count($result); $i++) {
    $url = $result[$i];
    $json = file_get_contents($url); 
    $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
    $arr = json_decode($json,true);
    $file_name = preg_replace('/^..\/themes\//', '', $url);
    $file_name = preg_replace('/\.json/', '', $file_name);
    $html = $html.'<option value="'.$file_name.'">'.$arr['name'].'</option>';
}
if($_POST["data"] == "get"){
    print $html;
}
?>