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
            require_once( dirname(__FILE__) . '/lib/phpbrowscap/Browscap.php' );
            require_once( dirname(__FILE__) . '/errno.php' );
            use phpbrowscap\Browscap;
            $bc = new Browscap('lib/phpbrowscap');
            $browserObject = $bc->getBrowser();
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
            class SeriesLabel {
                public $label;
                public function __construct($label) {
                    $this->label = $label;
                }
            }
            $resultMap = array();
            $platformList = array();
            $browserList = array();
            $currentPlatform = 'Your Score';
            $currentBrowser = $browserObject->Parent;
            if (!isset($_SESSION['result'])) {
                header('Location: ' . dirname($_SERVER['PHP_SELF']));
                session_destroy();
            }
            else {
                $currentScore = json_decode($_SESSION['result'])->finalScore;
                $mysqli = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
                if ($mysqli->connect_errno) {
                    $errorNo = $mysqli->connect_errno;
                    error_log("Failed to connect to MySQL: $errorNo");
                }
                else {
                    $platformList[$currentPlatform] = TRUE;
                    $browserList[$currentBrowser] = TRUE;
                    $query = "SELECT deviceName, userAgent_Parent, AVG(finalScore)
                        FROM result
                        WHERE deviceName <> 'unknown'
                        GROUP BY deviceName, userAgent_Parent";
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
                    $resultMap[ResultKeyString($currentPlatform, $currentBrowser)] = $currentScore;
                    $mysqli->close();
                    $series = array();
                    $seriesLabels = array();
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
                        array_push($series, $seriesItem->data);
                        array_push($seriesLabels, new SeriesLabel($seriesItem->name));
                    }
                    $categories = json_encode(array_keys($platformList));
                    $series = json_encode($series);
                    $seriesLabels = json_encode($seriesLabels);
                    echo '<link rel="stylesheet" type="text/css" href="lib/jqplot/jquery.jqplot.min.css">';
                    echo '<script type="text/javascript" src="lib/jqplot/jquery.jqplot.min.js"></script>';
                    echo '<script type="text/javascript" src="lib/jqplot/plugins/jqplot.barRenderer.min.js"></script>';
                    echo '<script type="text/javascript" src="lib/jqplot/plugins/jqplot.categoryAxisRenderer.min.js"></script>';
                    echo '<script type="text/javascript" src="lib/jqplot/plugins/jqplot.pointLabels.js"></script>';
                    echo '<script type="text/javascript">';
                    echo "
                    $(document).ready(function(){
                        // from their vertical bar counterpart.
                        var plot2 = $.jqplot('chart',
                            $series, {
                            animate: true,
                            title: 'cocos-benchmark rank',
                            seriesDefaults: {
                                renderer:$.jqplot.BarRenderer,
                                pointLabels: { show: true, location: 'e', formatString: '%.2f' },
                                rendererOptions: {
                                    barDirection: 'horizontal'
                                },
                                shadow: false
                            },
                            axes: {
                                xaxis: {

                                },
                                yaxis: {
                                    renderer: $.jqplot.CategoryAxisRenderer,
                                    ticks: $categories,
                                    tickOptions: {
                                        showGridline: false,
                                    }
                                }
                            },
                            grid: {
                                gridLineColor: '#c0c0c0',
                                background: '#ffffff',
                                borderColor: '#c0c0c0',
                                borderWidth: 0,
                                shadow: false
                            },
                            legend: {
                                show: true,
                                placement: 'e'
                            },
                            series: $seriesLabels
                        });
                    });
                    ";
                    echo '</script>';
                }
            }
        ?>
	</head>
	<body>
        <div id="chart" style="min-width: 310px; height: 720px; margin: 10px auto 20px" class="jqplot-target"></div>
        <div style="text-align: center">
            Powered by <a href="http://www.jqplot.com/">jqPlot</a> under <a href="http://www.jqplot.com/docs/files/MIT-LICENSE-txt.html">MIT</a> license
        </div>
    </body>
</html>
