/**
 * Created with JetBrains WebStorm.
 * User: sunzhuoshi
 * Date: 11/1/12
 * Time: 11:21 AM
 */
// If show debug info(FPS, particle count and etc.) when benchmarking
BENCHMARK_DEBUG = false; // if enabled, show debug info
BENCHMARK_FPS = true;
BENCHMARK_TIME = false;
BENCHMARK_TIME_MAX_DELTA_PERCENT = 15; // only <= value will be counted
benchmarkReady = false;

if ('0' === BenchmarkQueryParameters.time) {
    BENCHMARK_TIME = false;
    benchmarkOutputInstance.writeln('time off');
}
if ('0' === BenchmarkQueryParameters.fps) {
    BENCHMARK_FPS = false;
    benchmarkOutputInstance.writeln('FPS off');
}

////////////////////////////////////////////////////////
//
// Default benchmark scene
//
////////////////////////////////////////////////////////
BenchmarkEntry = cc.Layer.extend({
    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var lazyLayer = new cc.LazyLayer();
        this.addChild(lazyLayer);

        var sprite = cc.Sprite.create(s_benchmark);
        sprite.setPosition(cc.p(size.width / 2, size.height / 2));

        lazyLayer.addChild(sprite, 0);

        this.setTouchEnabled(false);
        lazyLayer.adjustSizeForCanvas();
        return true;
    }
});

// Scene showed when no benchmark running
BenchmarkEntryScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        // set the shared instance to this
        BenchmarkEntryScene.instance = this;
    },
    onEnter:function () {
        var layer = new BenchmarkEntry();
        layer.init();
        this.addChild(layer);
        benchmarkReady = true;
    }
});

// shared instance for BenchmarkEntryScene
BenchmarkEntryScene.instance = null;


BenchmarkBaseTestScene = cc.Scene.extend({
    _ID: 0,
    getID: function() {
        return this._ID;
    },
    setID: function(ID) {
        this._ID = ID;
    },
    onEnter: function() {
        this._super();
        benchmarkControllerInstance.onEnterTestScene(this);
    },
    onExit: function() {
        this._super();
        benchmarkControllerInstance.onExitTestScene(this);
    },
    runTest: function() {
        throw "runTest MUST be overridden";
    }
});

BenchmarkController = cc.Class.extend({
    _testSceneBeginTime: 0,
    _testSceneEndTime: 0,
    _testSceneBeginFrames: 0,
    _testSceneEndFrames: 0,
    _testPassBeginTime: 0,
    _testTransitionTimerID: 0,
    _FPSTestResults: [],
    _timeTestResults: [],
    _testScores: [],
    _testPassResults: [],
    _currentTestID: 0,
    _currentTestPass: 0,
    // call it in a test case to start a test pass
    startTestPass: function() {
        this._testPassBeginTime = (new Date).getTime();
    },
    // call it in a test case to stop current running test pass
    stopTestPass: function() {
        var testInfo = BenchmarkTestCases.getTestInfo(this._currentTestID);
        if (this._currentTestPass <testInfo.times) {
            this._testPassResults[this._currentTestPass] = new Date().getTime() - this._testPassBeginTime;
        }
        this._currentTestPass ++;
        if (this._ifCurrentTestEnds()) {
            this._runNextTest();
        }
    },
    onEnterTestScene: function(testScene) {
        var testInfo = BenchmarkTestCases.getTestInfo(testScene.getID());
        this._testPassResults = [];
        if (testInfo.firstInCategory) {
            benchmarkOutputInstance.writeln(testInfo.category);
        }
        this._testSceneBeginTime = (new Date).getTime();
        this._testSceneBeginFrames = cc.Director.getInstance().getTotalFrames();
        if (0 < testInfo.duration) {
            this._testTransitionTimerID = setTimeout(function() {
                    benchmarkControllerInstance._testTransitionTimerTimeout()
                },
                testInfo.duration);
        }
    },
    onExitTestScene: function(testScene) {
        if (this._testTransitionTimerID) { // stop manually
            clearTimeout(this._testTransitionTimerID);
            this._testTransitionTimerID = 0;
        } else {
            var testID = testScene.getID();
            var testInfo = BenchmarkTestCases.getTestInfo(testID);
            this._testSceneEndTime = (new Date).getTime();
            this._testSceneEndFrames = cc.Director.getInstance().getTotalFrames();
            this._saveFPSTestResult(testID);
            this._saveTimeTestResult(testID, testInfo);
            this._saveTestScores(testID, testInfo);
            if (testID >= BenchmarkTestCases.maxID()) {
                this.outputScore();
            }
        }
    },
    startBenchmark: function(button) {
        if (!BENCHMARK_FPS && !BENCHMARK_TIME) {
            alert('Both FPS and time are off!');
            return;
        }
        if (benchmarkReady) {
            BenchmarkSetActionStop(button);
            this._runTest(0);
        }
    },
    stopBenchmark: function(button) {
        BenchmarkSetActionStart(button);
        cc.Director.getInstance().replaceScene(BenchmarkEntryScene.instance);
        if (this._testTransitionTimerID) {
            clearTimeout(this._testTransitionTimerID);
            this._testTransitionTimerID = 0;
        }
    },
    outputScore: function() {
        // use Harmonic Average value as the final score
        var sum = 0;
        var score;
        var length = BenchmarkTestCases.maxID() + 1;
        for (var i=0; i<length; ++i) {
            sum += 1 / this._testScores[i];
        }
        score = (length / sum).toFixed(2);
        benchmarkOutputInstance.writeln('Score: ' + score);
        benchmarkOutputInstance.writeln('####################################')
    },
    _ifCurrentTestEnds: function() {
        var testInfo = BenchmarkTestCases.getTestInfo(this._currentTestID);
        return !this._testTransitionTimerID && this._currentTestPass >= testInfo.times;
    },
    _runNextTest: function() {
        var ID = this._currentTestID;
        ID ++;
        if (ID <= BenchmarkTestCases.maxID()) {
            this._runTest(ID);
        } else {
            this.stopBenchmark();
        }
    },
    _runTest: function(ID) {
        if (0 <= ID && ID <= BenchmarkTestCases.maxID()) {
            var testInfo = BenchmarkTestCases.getTestInfo(ID);
            var testSceneName = testInfo.category + testInfo.name + 'BenchmarkScene';
            try {
                console.log(testSceneName);
                var testScene = new window[testSceneName];
                this._currentTestID = ID;
                this._currentTestPass = 0;
                
                testScene.setID(ID);
                testScene.runTest();
            } catch (e) {
                benchmarkOutputInstance.writeln('Exception occurred, stopped:\n' + e);
                this.stopBenchmark();
            }
        }
    },
    _saveFPSTestResult: function(testID) {
        this._FPSTestResults[testID] = ((this._testSceneEndFrames - this._testSceneBeginFrames) / (this._testSceneEndTime - this._testSceneBeginTime) * 1000).toFixed(2);
    },
    _testTransitionTimerTimeout: function() {
        this._testTransitionTimerID = 0;
        if (this._ifCurrentTestEnds()) {
            this._runNextTest();
        }
    },
    // TODO: used? by sunzhuoshi
    _getValidTestPassResults:function(){
        var timeSum = 0, meanTime;
        var validResults = [];
        var i;
        for (i=0; i<this._testPassResults.length; ++i) {
            timeSum += this._testPassResults[i];
        }
        meanTime = timeSum / this._testPassResults.length;
        for (i=0; i<this._testPassResults.length; ++i) {
            validResults[i] = Math.abs((this._testPassResults[i] - meanTime).toFixed(3));
        }
        var length = validResults.length;
        for (i=0; i<length-1; i++) {
            for (var j=i+1; j<length; j++) {
                var temp;
                if (validResults[i] > validResults[j]){
                    temp = validResults[i];
                    validResults[i] = validResults[j];
                    validResults[j] = temp;
                    temp = this._testPassResults[i];
                    this._testPassResults[i] = this._testPassResults[j];
                    this._testPassResults[j] = temp;
                }
            }
        }
        return validResults;
    },
    _getConfidenceInterval:function(results, mean){
        var invalidTimes = BenchmarkTestCases.getTestInfo(this._currentTestID).invalidTimes;
        var D2 = 0, current = 0;
        var length = results.length - invalidTimes;
        for(var i=0; i<length; i++){
            current = Math.abs(results[i] - mean);
            D2 += current * current;
        }
        return (Math.sqrt(D2/length*2.262)).toFixed(3);
    },
    _saveTimeTestResult: function(testID, testInfo) {
        var timeSum = 0, minTime = 0, maxTime = 0, meanTime, maxDeltaPercent;
        var length = this._testPassResults.length - testInfo.invalidTimes;
        for (var i=0; i<length; ++i) {
            var time = this._testPassResults[i];
            timeSum += time;
            if (time > maxTime || 0 === maxTime) {
                maxTime = time;
            }
            if (time < minTime || 0 === minTime) {
                minTime = time;
            }
        }
        meanTime = (timeSum / length).toFixed(2);
        maxDeltaPercent = this._getConfidenceInterval(this._testPassResults, meanTime);
        maxDeltaPercent = (maxDeltaPercent/meanTime*100).toFixed(2);
        this._timeTestResults[testID] = {
            meanTime: meanTime,
            maxDeltaPercent: maxDeltaPercent
        };
        if (BENCHMARK_DEBUG) {
            benchmarkOutputInstance.writeln('  ' + testInfo.name + '(time): ' + meanTime + ' +/-' + maxDeltaPercent + '%');
        }
    },
    _saveTestScores: function(testID, testInfo) {
        var FPSScore = 0;
        var timeScore = 0;
        var firstValue = true;
        benchmarkOutputInstance.write('  ' + testInfo.name + ': ');
        if (testInfo.duration && BENCHMARK_FPS) {
            FPSScore = (this._FPSTestResults[testID] / testInfo.referenceFPS).toFixed(2);
            benchmarkOutputInstance.write(this._FPSTestResults[testID] + '(' + FPSScore + ')');
            firstValue = false;
        }
        if (testInfo.times && BENCHMARK_TIME) {
            timeScore = (testInfo.referenceTime / this._timeTestResults[testID].meanTime).toFixed(2);
            if (!firstValue) {
                benchmarkOutputInstance.write(', ');
            }
            benchmarkOutputInstance.write(this._timeTestResults[testID].meanTime + '(' + timeScore + ')');
        }
        benchmarkOutputInstance.writeln('');
        if (FPSScore && timeScore) {
            if (this._timeTestResults[testID].maxDeltaPercent <= BENCHMARK_TIME_MAX_DELTA_PERCENT) {
                this._testScores[testID] = (Number(FPSScore) + Number(timeScore)) / 2;
            } else {
                this._testScores[testID] = FPSScore;
            }
        }
        else if (timeScore) {
            this._testScores[testID] = timeScore;
        }
        else {
            this._testScores[testID] = FPSScore;
        }
    }
});

benchmarkControllerInstance = new BenchmarkController;

// Test cases data
// category: API category
// times: run times in time mode
// duration: duration(ms) in FPS mode
// invalidTimes: it is applied in time mode. when some browsers such as firefox is not very stable, we can deduce the invalid times with times
// referenceFPS: FPS test value on the reference platform
// referenceTime: time test value on the reference platform
// TODO: fill the correct reference FPS and time on K800
BenchmarkTestCases = [
    {
        category: 'DrawPrimitives',
        defaultDuration: 2000,
        defaultTimes: 10,
        tests: [
            {
                name: 'Test',
                referenceFPS: 1.04,
                referenceTime: 900
            }
        ]
    },
    {
        category: 'Particle',
        defaultDuration: 5000,
        defaultTimes: 10,
        tests: [
            {
                name: 'Size8',
                referenceFPS: 17.5,
                referenceTime: 52.2
            },
            {
                name: 'BurstPipe',
                referenceFPS: 20.5,
                referenceTime: 70.67
            },
            {
                name: 'Comet',
                referenceFPS: 8,
                referenceTime: 110
            }
        ]
    },
    {
        category: 'Sprite',
        defaultDuration: 3000,
        defaultTimes: 10,
        tests: [
            {
                name: 'Position',
                referenceFPS: 4.25,
                referenceTime: 115
            },
            {
                name: 'Actions',
                referenceFPS: 1.46,
                referenceTime: 270
            }
        ]
    }
];

BenchmarkTestCases.invalidTimes = 0; // TODO: check it

BenchmarkTestCases.IDToIndices = function(ID) {
    var tmp = 0;
    var indices = {
        categoryIndex: 0,
        testIndex: 0
    };
    for (var i=0; i<BenchmarkTestCases.length; ++i) {
        var oldTmp = tmp;
        tmp += BenchmarkTestCases[i].tests.length;
        if (tmp < ID) {
            indices.categoryIndex = i + 1;
        } else if (tmp === ID) {
            indices.categoryIndex = i + 1;
            break;
        } else {
            tmp = oldTmp;
            break;
        }
    }
    indices.testIndex = ID - tmp;
    return indices;
};

BenchmarkTestCases._maxID = 0;

BenchmarkTestCases.maxID = function() {
    if (!this._maxID) {
        for (var i=0; i<this.length; i++) {
            this._maxID += this[i].tests.length;
        }
        this._maxID --;
    }
    return this._maxID;
};

BenchmarkTestCases.getTestInfo = function(ID) {
    var testInfo = {
        category: '',
        firstInCategory: false,
        name: '',
        duration: 0,
        times: 0,
        invalidTimes: 0, // TODO: check it
        referenceFPS: 0,
        referenceTime: 0
    };
    var indices = this.IDToIndices(ID);
    var test = this[indices.categoryIndex].tests[indices.testIndex];
    var category = this[indices.categoryIndex];
    testInfo.category = category.category;
    testInfo.firstInCategory = (0 === indices.testIndex);
    testInfo.name = test.name;
    testInfo.duration = category.defaultDuration;
    if (typeof test.duration !== 'undefined') {
        testInfo.duration = test.duration;
    }
    testInfo.times = category.defaultTimes;
    if (typeof test.times !== 'undefined') {
        testInfo.times = test.times;
    }
    if (typeof test.invalidTimes !== 'undefined') {
        testInfo.invalidTimes = test.invalidTimes;
    }
    testInfo.referenceFPS = test.referenceFPS;
    if (typeof test.referenceTime !== 'undefined') {
        testInfo.referenceTime = test.referenceTime;
    }
    return testInfo;
};