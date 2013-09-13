<?php
    session_start();
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>cocos-benchmark rank</title>
		<script type="text/javascript" src="lib/jquery/jquery.min.js"></script>
        <?php
            require_once( dirname(__FILE__) . '/config.php' );
            require_once( dirname(__FILE__) . '/errno.php' );
            function ResultKeyString($platform, $browser) {
                return $platform . '|' . $browser;
            }
            class SeriesItem {
                public $name;
                public $data;
                public function __construct($name) {
                    $this->name = $name;
                    $this->data = array();
                }
            };
            $resultMap = array();
            $platformList = array();
            $browserList = array();

            if (!isset($_SESSION['result'])) {
                header('Location: ' . dirname($_SERVER['PHP_SELF']));
                session_destroy();
            }
            else {
                $mysqli = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
                if ($mysqli->connect_errno) {
                    $errorNo = $mysqli->connect_errno;
                    error_log("Failed to connect to MySQL: $errorNo");
                }
                else {
                    $query = "SELECT deviceName, userAgent_Parent, AVG(finalScore) FROM result GROUP BY platform , userAgent_Parent";
                    if ($result = $mysqli->query($query)) {
                        while ($row = $result->fetch_row()) {
                            $platform = $row[0];
                            $browser = $row[1];
                            $score = number_format($row[2], 2);
                            $resultMap[ResultKeyString($platform, $browser)] = $score;
                            $platformList[$platform] = TRUE;
                            $browserList[$browser] = TRUE;
                        }
                        $result->close();
                    }
                    $mysqli->close();
                    $series = array();
                    foreach($browserList as $browser => $browserDummy) {
                        $seriesItem = new SeriesItem($browser);
                        foreach ($platformList as $platform => $platformDummy) {
                            $key = ResultKeyString($platform, $browser);
                            $value = null;
                            if (array_key_exists($key, $resultMap)) {
                                $value = (float)$resultMap[$key];
                            }
                            array_push($seriesItem->data, $value);
                        }
                        array_push($series, $seriesItem);
                    }
                    $categories = json_encode(array_keys($platformList));
                    $series = json_encode($series);
                    echo '<script src="lib/highcharts/highcharts.js"></script>';
                    echo '<script src="lib/highcharts/modules/exporting.js"></script>';
                    echo '<script type="text/javascript">';
                    echo "
                        $(function () {
                            $('#container').highcharts({
                                chart: {
                                    type: 'bar'
                                },
                                title: {
                                    text: 'cocos-benchmark rank'
                                },
                                subtitle: {
                                    text: ''
                                },
                                xAxis: {
                                    categories: $categories,
                                    title: {
                                        text: null
                                    }
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: 'Score',
                                        align: 'high'
                                    },
                                    labels: {
                                        overflow: 'justify'
                                    }
                                },
                                tooltip: {
                                    valueSuffix: ' '
                                },
                                plotOptions: {
                                    bar: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'top',
                                    x: -40,
                                    y: 100,
                                    floating: true,
                                    borderWidth: 1,
                                    backgroundColor: '#FFFFFF',
                                    shadow: true
                                },
                                credits: {
                                    enabled: false
                                },
                                series: $series
                            });
                        });";
                    echo '</script>';
                }
            }
        ?>
	</head>
	<body>
        <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        <div style="text-align: center">
            Powered by <a href="http://www.highcharts.com/">highcharts</a>
        </div>
    </body>
</html>
