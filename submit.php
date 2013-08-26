<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 8/26/13
 * Time: 12:29 PM
 */
require_once( dirname(__FILE__) . '/config.php');

$error_no = 0;
$data = json_decode($HTTP_RAW_POST_DATA);

$con = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
$error_no = mysqli_connect_errno($con);

if ($error_no)
{
    error_log("Failed to connect to MySQL: " . mysqli_connect_error());
}
else {
    $now = date('Y-m-d h:i:s');
    $fpsList = json_encode($data->fpsList);
    $scores = json_encode($data->scores);
    $ret = mysqli_query($con,
        "INSERT INTO result(benchmarkVersion, engineVersion, language, platform, userAgent, vendor, fpsList, scores, finalScore, time)
        VALUES (
          '$data->benchmarkVersion',
          '$data->engineVersion',
          '$data->language',
          '$data->platform',
          '$data->userAgent',
          '$data->vendor',
          '$fpsList',
          '$scores',
          '$data->finalScore',
          '$now')"
    );
    if (!$ret) {
        $error_no = mysqli_errno($con);
    }
    mysqli_close($con);
}
echo $error_no;