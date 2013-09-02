<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 8/26/13
 * Time: 12:29 PM
 */
require_once( dirname(__FILE__) . '/config.php');
require_once( dirname(__FILE__) . '/lib/phpbrowscap/Browscap.php');

// The Browscap class is in the phpbrowscap namespace, so import it
use phpbrowscap\Browscap;

// Create a new Browscap object (loads or creates the cache)
$bc = new Browscap('lib/phpbrowscap');

// Get information about the current browser's user agent
$browser = $bc->getBrowser();

$data = json_decode($HTTP_RAW_POST_DATA);
$data->language = strtolower($data->language);

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

    $stmt = mysqli_prepare($con,
        "INSERT INTO result(
            benchmarkVersion,
            engineVersion,
            language,
            platform,
            vendor,
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
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
        )");
    mysqli_stmt_bind_param($stmt, "ssssssssssssssssssssssssssssssssssssssssssssss",
        $data->benchmarkVersion,
        $data->engineVersion,
        $data->language,
        $data->platform,
        $data->vendor,
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
    $ret = mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt); // CLOSE $stmt
    if (!$ret) {
        $error_no = mysqli_errno($con);
        error_log('Failed to insert, error: ' . mysqli_error($con));
    }
    mysqli_close($con);
}
echo $error_no;
