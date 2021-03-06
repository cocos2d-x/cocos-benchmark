/****************************************************************************
 Copyright (c) 2013-2014 Intel Corporation.
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


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

var BenchmarkController = cc.Class.extend({
    _benchmarkBeginTime: 0,
    _benchmarkEndTime: 0,
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
    _submitted: false,
    getTestFPS: function(testID) {
        return this._testFPSList[testID];
    },
    getTestScore: function(testID) {
        return this._testScores[testID];
    },
    getTimeUsed: function() {
        return this._benchmarkEndTime - this._benchmarkBeginTime;
    },
    getFinalScore: function() {
        return Number(this._finalScore);
    },
    setDelegate: function(delegate) {
        this._delegate = delegate;
    },
    onEnterTestScene: function(testScene) {
        var testCase = BenchmarkTestCases.get(testScene.getID());
        this._testSceneBeginTime = (new Date).getTime();
        this._testSceneBeginFrames = cc.Director.getInstance().getTotalFrames();
        if (0 < testCase.duration) {
            BenchmarkAPIWrapper.Scheduler.getInstance().schedule(
                this,
                this._runNextTest,
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
            this._benchmarkBeginTime = new Date().getTime();
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
        BenchmarkAPIWrapper.Scheduler.getInstance().unscheduleAll();
        if (this._delegate && this._delegate.onStopBenchmark) {
            this._delegate.onStopBenchmark();
        }
    },
    submitBenchmark: function() {
        if (!this._submitted) {
            var engineVersion = BenchmarkQueryParameters.engine;
            if (!engineVersion) { // debug version
                engineVersion = cc.ENGINE_VERSION;
            }
            var data = {
                benchmarkVersion: BENCHMARK_VERSION,
                engineVersion: engineVersion,
                language: navigator.language,
                platform: navigator.platform,
                vendor: navigator.vendor,
                deviceName: BenchmarkDevice.currentDeviceInfo().name,
                deviceMaker: BenchmarkDevice.currentDeviceInfo().maker,
                fpsList: [],
                scores: [],
                finalScore: 0,
                timeUsed: this.getTimeUsed()
            };
            var i;
            for (i=0; i<this._testFPSList.length; ++i) {
                data.fpsList[i] = this._testFPSList[i];
            }
            for (i=0; i<this._testScores.length; ++i) {
                data.scores[i] = this._testScores[i];
            }
            data.finalScore = this._finalScore;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'submit.php', false);
            xhr.send(JSON.stringify(data));
            if (xhr.responseText === '0') {
                this._submitted = true;
            }
            return xhr.responseText;
        }
        else {
            return BenchmarkController.E_ALREADY_SUBMITTED; // already submitted
        }
    },
    benchmarkDone: function() {
        this._benchmarkEndTime = new Date().getTime();
        // use Harmonic Average value as the final score
        var sum = 0;
        var length = BenchmarkTestCases.maxID() + 1;
        for (var i=0; i<length; ++i) {
            sum += 1 / this._testScores[i];
        }
        this._finalScore = (length / sum).toFixed(2);
        this._submitted = false;
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
            var testClassName = testCase.category + testCase.name + 'Benchmark';
            var testSceneName = testClassName + 'Scene';
            try {
                cc.log(testClassName);
                var testScene;
                if (eval('typeof ' + testSceneName) !== 'undefined') {
                    testScene = eval("new " + testSceneName + "()");
                }
                else {
                    testScene = eval('BenchmarkTestScene.create(' + testClassName + ')');
                }
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

BenchmarkController._instance = null;

BenchmarkController.E_SUCCESS = 0;
BenchmarkController.E_UNKNOWN = -1;
BenchmarkController.E_INVALID_PARAM = -2;
BenchmarkController.E_ALREADY_SUBMITTED = -3;

BenchmarkController.getInstance = function() {
    if (!this._instance) {
        this._instance = new BenchmarkController();
    }
    return this._instance;
};

if (typeof BenchmarkOnControllerLoadEnd === 'function') {
    BenchmarkOnControllerLoadEnd(BenchmarkController.getInstance());
}