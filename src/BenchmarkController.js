/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/18/13
 * Time: 10:24 AM
 */
// Only for reference
/*
 BenchmarkControllerDelegate = {
 onBeginTestCase: function(testInfo) {},
 onEndTestCase: function(testID, testInfo) {},
 onStartBenchmark: function() {}, // start action
 onStopBenchmark: function() {}, // stop action
 onBenchmarkDone: function() {}, // all test cases done
 onError: function(e) {}
 });
 */

BenchmarkController = cc.Class.extend({
    _testSceneBeginTime: 0,
    _testSceneEndTime: 0,
    _testSceneBeginFrames: 0,
    _testSceneEndFrames: 0,
    _testFPSList: [],
    _testScores: [],
    _testInterrupted: false,
    _finalScore: 0,
    _currentTestID: 0,
    _delegate: null,
    ready: false,
    getTestFPS: function(testID) {
        return this._testFPSList[testID];
    },
    getTestScore: function(testID) {
        return this._testScores[testID];
    },
    getFinalScore: function() {
        return this._finalScore;
    },
    setDelegate: function(delegate) {
        this._delegate = delegate;
    },
    onEnterTestScene: function(testScene) {
        var testCase = BenchmarkTestCases.get(testScene.getID());
        this._testSceneBeginTime = (new Date).getTime();
        this._testSceneBeginFrames = cc.Director.getInstance().getTotalFrames();
        if (0 < testCase.duration) {
            cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(
                this,
                this._runNextTest,
                0,
                false,
                testCase.duration / 1000
            );
        }
        if (this._delegate && this._delegate.onBeginTestCase) {
            this._delegate.onBeginTestCase(testCase);
        }
    },
    onExitTestScene: function(testScene) {
        if (!this._testInterrupted) {
            var testID = testScene.getID();
            var testCase = BenchmarkTestCases.get(testID);
            this._testSceneEndTime = (new Date).getTime();
            this._testSceneEndFrames = cc.Director.getInstance().getTotalFrames();
            this._saveTestData(testID, testCase);
            if (this._delegate && this._delegate.onEndTestCase) {
                this._delegate.onEndTestCase(testID, testCase)
            }
            if (testID >= BenchmarkTestCases.maxID()) {
                this.benchmarkDone();
            }
        }
    },
    startBenchmark: function() {
        if (this.ready) {
            this._testInterrupted = false;
            this._runTest(0);
            if (this._delegate && this._delegate.onStartBenchmark) {
                this._delegate.onStartBenchmark();
            }
        }
    },
    stopBenchmark: function(interrupted) {
        if (typeof interrupted === 'undefined') {
            interrupted = true;
        }
        this._testInterrupted = interrupted;
        cc.Director.getInstance().getScheduler().unscheduleAllCallbacksForTarget(this);
        if (this._delegate && this._delegate.onStopBenchmark) {
            this._delegate.onStopBenchmark();
        }
    },
    benchmarkDone: function() {
        // use Harmonic Average value as the final score
        var sum = 0;
        var length = BenchmarkTestCases.maxID() + 1;
        for (var i=0; i<length; ++i) {
            sum += 1 / this._testScores[i];
        }
        this._finalScore = (length / sum).toFixed(2);
        if (this._delegate && this._delegate.onBenchmarkDone) {
            this._delegate.onBenchmarkDone();
        }
    },
    _runNextTest: function() {
        var ID = this._currentTestID;
        ID ++;
        if (ID <= BenchmarkTestCases.maxID()) {
            this._runTest(ID);
        } else {
            this.stopBenchmark(false);
        }
    },
    _runTest: function(ID) {
        if (0 <= ID && ID <= BenchmarkTestCases.maxID()) {
            var testCase = BenchmarkTestCases.get(ID);
            var testSceneName = testCase.category + testCase.name + 'BenchmarkScene';
            try {
                cc.log(testSceneName);
                var testScene = eval("new " + testSceneName + "()");
                this._currentTestID = ID;

                testScene.setID(ID);
                testScene.runTest();
            } catch (e) {
                cc.log(e);
                this.stopBenchmark();
                if (this._delegate && this._delegate.onError) {
                    this._delegate.onError(e);
                }
                throw e;
            }
        }
    },
    _saveTestData: function(testID, testInfo) {
        var FPS = ((this._testSceneEndFrames - this._testSceneBeginFrames) /
            (this._testSceneEndTime - this._testSceneBeginTime) * 1000).toFixed(2);
        this._testFPSList[testID] = FPS;
        this._testScores[testID] = (FPS / testInfo.referenceFPS).toFixed(2);
    }
});

benchmarkControllerInstance = new BenchmarkController;


if (typeof BenchmarkOnControllerLoadEnd === 'function') {
    BenchmarkOnControllerLoadEnd(benchmarkControllerInstance);
}