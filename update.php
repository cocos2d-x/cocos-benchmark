<?php
/****************************************************************************
Copyright (c) 2013-2014 Intel Corporation.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ****************************************************************************/
require_once( dirname(__FILE__) . '/config.php' );
require_once( dirname(__FILE__) . '/lib/phpbrowscap/Browscap.php' );
require_once( dirname(__FILE__) . '/errno.php' );

use phpbrowscap\Browscap;

$errorNo = E_UNKNOWN;
$updateTime = date('Y-m-d h:i:s');
$toUpdateCount = 0;
$updateOKCount = 0;
$updateErrorCount = 0;

function CreateMysqlConnection() {
    $result = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
    if (mysqli_connect_errno()) {
        $errorNo = mysqli_connect_errno();
        error_log("Failed to connect to MySQL: $errorNo");
        $result = false;
    }
    return $result;
}

function UpdateResultRecord($mysqli, $id, $deviceName, $deviceMaker, $userAgent_Device_Name, $userAgent_Device_Maker, $updateTime) {
    $result = false;
    $stmt = $mysqli->prepare(
        "UPDATE result
        SET deviceName=?, deviceMaker=?, userAgent_Device_Name=?, userAgent_Device_Maker=?, updateTime=?
        WHERE id = ?"
    );
    if ($stmt) {
        $stmt->bind_param("sssssi",
            $deviceName,
            $deviceMaker,
            $userAgent_Device_Name,
            $userAgent_Device_Maker,
            $updateTime,
            $id
        );
        $result = $stmt->execute();
        $stmt->close();
    }
    else {
        error_log("mysql error: $mysqli->error");
    }
    return $result;
}

$readMysqli = CreateMysqlConnection();
$writeMysqli = CreateMysqlConnection();

if ($readMysqli && $writeMysqli) {
    $bc = new Browscap('lib/phpbrowscap');
    if ($result = $readMysqli->query('SELECT id, deviceName, deviceMaker, userAgent FROM result', MYSQLI_USE_RESULT)) {
        while ($row = $result->fetch_row()) {
            $toUpdateCount ++;
            $id = $row[0];
            $deviceName = $row[1];
            $deviceMaker = $row[2];
            $userAgent = $row[3];
            $browser = $bc->getBrowser($userAgent);
            if (!$deviceName || 'unknown' == $deviceName) {
                $deviceName = $browser->Device_Name;
            }
            if (!$deviceMaker || 'unknown' == $deviceMaker) {
                $deviceMaker = $browser->Device_Maker;
            }
            if (UpdateResultRecord($writeMysqli, $id, $deviceName, $deviceMaker, $browser->Device_Name, $browser->Device_Maker, $updateTime)) {
                $updateOKCount ++;
            }
            else {
                $updateErrorCount ++;
                error_log("Failed to update result! id: $id, deviceName: $deviceName, userAgent_DeviceName: $browser->Device_Name, userAgent_DeviceMaker: $browser->Device_Maker");
            }
        }
        $result->close();
        $errorNo = E_SUCCESS;
    }
}

if ($errorNo) {
    echo "Failed to update, errno: $errorNo";
}
else {
    echo "Updated: $updateOKCount/$toUpdateCount, $updateErrorCount error(s)";
}



