/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 2/25/13
 * Time: 11:51 AM
 */
BENCHMARK_TIMES = 10;

BenchmarkDevController = BenchmarkController.extend({
    _benchmarkTime: 0,
    _benchmarkScores: [],
    reset: function() {
        this._benchmarkTime = 0;
        this._benchmarkScores = [];
    },
    getStatisticalDispersion: function(dataArray) {
        var i, sum = 0, average, standardDeviation;
        for (i=0; i<dataArray.length; ++i) {
            sum += dataArray[i];
        }
        average = sum / dataArray.length;
        sum = 0;
        for (i=0; i<dataArray.length; ++i) {
            sum += (dataArray[i] - average) * (dataArray[i] - average);
        }
        standardDevication = Math.sqrt(sum / dataArray.length);
        return {
            average: average,
            standardDeviation: standardDevication
        }
    },
    outputTestResult: function() {
        var finalScores = [];
        var testScores = [];
        var i, j;
        for (i=0; i<this._benchmarkScores.length; ++i) {
            finalScores[i] = this._benchmarkScores[i].finalScore;
        }
        for (j=0; j<this._benchmarkScores[0].testScores.length; ++j) {
            testScores[j] = [];
            for (i=0; i<this._benchmarkScores.length; ++i) {
                testScores[j][i] = this._benchmarkScores[i].testScores[j];
            }
        }

        benchmarkOutputInstance.clear();
        for (j=0; j<testScores.length; ++j) {
            var testScoreStatisticalDispersion = this.getStatisticalDispersion(testScores[j]);
            benchmarkOutputInstance.writeln(BenchmarkTestCases.get(j).name, '%25', testScoreStatisticalDispersion.average.toFixed(2),
                ' +/- ' + (testScoreStatisticalDispersion.standardDeviation / testScoreStatisticalDispersion.average * 100).toFixed(1) + '%');
        }
        finalScoreStatisticalDispersion = this.getStatisticalDispersion(finalScores);
        benchmarkOutputInstance.writeln('Score:', '%25', finalScoreStatisticalDispersion.average.toFixed(2),
            ' +/- ' + (finalScoreStatisticalDispersion.standardDeviation / finalScoreStatisticalDispersion.average * 100).toFixed(1) + '%');
        benchmarkOutputInstance.writeln('####################################')
        benchmarkOutputInstance.writeln('Reference values:');
        for (j=0; j<testScores.length; ++j) {
            var testInfo = BenchmarkTestCases.get(j);
            var testScoreStatisticalDispersion = this.getStatisticalDispersion(testScores[j]);
            benchmarkOutputInstance.writeln(testInfo.name + ':', '%25',  'FPS=', (testInfo.referenceFPS * testScoreStatisticalDispersion.average).toFixed(2));
        }
    },
    benchmarkDone: function() {
        this._super();
        var benchmarkScore = {
            testScores: [],
            finalScore: this.getFinalScore()
        };
        var i;
        for (i=0; i<this._testScores.length; ++i) {
            benchmarkScore.testScores[i] = Number(this._testScores[i]);
        }
        this._benchmarkScores[this._benchmarkTime] = benchmarkScore;
        this._benchmarkTime ++;
        if (this._benchmarkTime === BENCHMARK_TIMES) {
            this.outputTestResult();
            this.reset();
        }
        else {
            this.startBenchmark();
        }
    }
});

benchmarkControllerInstance = new BenchmarkDevController;

if (typeof BenchmarkOnControllerLoadEnd === 'function') {
    BenchmarkOnControllerLoadEnd(benchmarkControllerInstance);
}

benchmarkVersionElement = document.getElementById('benchmark_version');
if (benchmarkVersionElement) {
    if (-1 === BENCHMARK_VERSION.indexOf('dev')) {
        benchmarkVersionElement.innerHTML = BENCHMARK_VERSION + '-dev';
    }
}
