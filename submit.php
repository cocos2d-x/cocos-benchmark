<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 8/26/13
 * Time: 12:29 PM
 */
require_once( dirname(__FILE__) . '/config.php' );
require_once( dirname(__FILE__) . '/lib/phpbrowscap/Browscap.php' );
require_once( dirname(__FILE__) . '/errno.php' );

use phpbrowscap\Browscap;

$error_no = E_UNKNOWN;

if (isset($HTTP_RAW_POST_DATA)) {
    $bc = new Browscap('lib/phpbrowscap');
    $browser = $bc->getBrowser();
    $data = json_decode($HTTP_RAW_POST_DATA);
    $data->language = strtolower($data->language);
    if (!$data->deviceName || 'unknown' == $data->deviceName) {
        $data->deviceName = $browser->Device_Name;
    }
    if (!$data->deviceMaker || 'unknown' == $data->deviceMaker) {
        $data->deviceMaker = $browser->Device_Maker;
    }
    $mysqli = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);

    if ($mysqli->connect_errno) {
        $error_no = $mysqli->connect_errno;
        error_log("Failed to connect to MySQL, error no: $error_no, error: $mysqli->connect_error");
    }
    else {
        $now = date('Y-m-d h:i:s');
        $fpsList = json_encode($data->fpsList);
        $scores = json_encode($data->scores);
        $stmt = $mysqli->prepare(
            "INSERT INTO result(
                benchmarkVersion,
                engineVersion,
                language,
                platform,
                vendor,
                deviceName,
                deviceMaker,
                fpsList,
                scores,
                finalScore,
                timeUsed,
                time,
                userAgent,
                userAgent_browser_name,
                userAgent_browser_name_regex,
                userAgent_browser_name_pattern,
                userAgent_Parent,
                userAgent_Comment,
                userAgent_Browser,
                userAgent_Version,
                userAgent_MajorVer,
                userAgent_MinorVer,
                userAgent_Platform,
                userAgent_Platform_Version,
                userAgent_Platform_Description,
                userAgent_Alpha,
                userAgent_Beta,
                userAgent_Win16,
                userAgent_Win32,
                userAgent_Win64,
                userAgent_Frames,
                userAgent_IFrames,
                userAgent_Tables,
                userAgent_Cookies,
                userAgent_BackgroundSounds,
                userAgent_JavaScript,
                userAgent_VBScript,
                userAgent_JavaApplets,
                userAgent_ActiveXControls,
                userAgent_isMobileDevice,
                userAgent_isSyndicationReader,
                userAgent_Crawler,
                userAgent_CssVersion,
                userAgent_AolVersion,
                userAgent_Device_Name,
                userAgent_Device_Maker,
                userAgent_RenderingEngine_Name,
                userAgent_RenderingEngine_Version
            )
            VALUES(
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            )");
        $stmt->bind_param("ssssssssssssssssssssssssssssssssssssssssssssssss",
            $data->benchmarkVersion,
            $data->engineVersion,
            $data->language,
            $data->platform,
            $data->vendor,
            $data->deviceName,
            $data->deviceMaker,
            $fpsList,
            $scores,
            $data->finalScore,
            $data->timeUsed,
            $now,
            $_SERVER['HTTP_USER_AGENT'],
            $browser->browser_name,
            $browser->browser_name_regex,
            $browser->browser_name_pattern,
            $browser->Parent,
            $browser->Comment,
            $browser->Browser,
            $browser->Version,
            $browser->MajorVer,
            $browser->MinorVer,
            $browser->Platform,
            $browser->Platform_Version,
            $browser->Platform_Description,
            $browser->Alpha,
            $browser->Beta,
            $browser->Win16,
            $browser->Win32,
            $browser->Win64,
            $browser->Frames,
            $browser->IFrames,
            $browser->Tables,
            $browser->Cookies,
            $browser->BackgroundSounds,
            $browser->JavaScript,
            $browser->VBScript,
            $browser->JavaApplets,
            $browser->ActiveXControls,
            $browser->isMobileDevice,
            $browser->isSyndicationReader,
            $browser->Crawler,
            $browser->CssVersion,
            $browser->AolVersion,
            $browser->Device_Name,
            $browser->Device_Maker,
            $browser->RenderingEngine_Name,
            $browser->RenderingEngine_Version
        );
        $ret = $stmt->execute();
        $stmt->close();
        if ($ret) {
            session_start();
            $error_no = E_SUCCESS;
            $_SESSION['result'] = $HTTP_RAW_POST_DATA;
        }
        else {
            global $php_errormsg;
            $error_no = $mysqli->errno;
            if (!$error_no) {
                $error_no = E_UNKNOWN; // not mysql error, php error
            }
            error_log("Failed to insert, mysql error no: $mysqli->errno , msg: $mysqli->error");
            error_log("PHP error msg: $php_errormsg");
        }
        $mysqli->close();
    }
}
else {
    $error_no = E_INVALID_PARAM;
}

echo $error_no;
