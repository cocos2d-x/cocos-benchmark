<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>cocos-benchmark result</title>
		<script type="text/javascript" src="lib/jquery/jquery.min.js"></script>
	</head>
	<body>
    <?php
    session_start();
    if (!isset($_SESSION['result'])) {
        header('Location: ' . dirname($_SERVER['PHP_SELF']));
        session_destroy();
    }
    else {
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
                    text: 'cocos-benchmark result'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: ['K800', 'iPhone5', 'MI2S', 'SAMSUNGS4', 'SAMSUNGS2'],
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
                    valueSuffix: ' millions'
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
                series: [{
                    name: 'Safari',
                    data: [107, 31, 635, 203, 2]
                }, {
                    name: 'Chrome',
                    data: [133, 156, 947, 408, 6]
                }, {
                    name: 'UC',
                    data: [973, 914, 4054, 732, 34]
                }]
            });
        });";
        echo '</script>';
        echo '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>';
        echo '<div style="text-align: center">';
        echo    'Powered by <a href="http://www.highcharts.com/">highcharts</a>';
        echo '</div>';
    }
    ?>
    </body>
</html>
