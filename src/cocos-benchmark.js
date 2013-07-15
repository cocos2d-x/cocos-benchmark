/**
 * Created with JetBrains WebStorm.
 * User: sunzhuoshi
 * Date: 11/1/12
 * Time: 11:21 AM
 */
// If show debug info(FPS, particle count and etc.) when benchmarking
BENCHMARK_DEBUG = false; // if enabled, show debug info

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
        benchmarkControllerInstance.ready = true;
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

// Only for reference
/*
BenchmarkControllerDelegate = {
    onBeginTestCase: function(testInfo) {},
    onEndTestCase: function(testID, testInfo) {},
    onStartBenchmark: function() {}, // start action
    onStopBenchmark: function() {}, // stop action
    onEndBenchmark: function() {}, // all test cased done
    onError: function(e) {}
});
*/

BenchmarkController = cc.Class.extend({
    _testSceneBeginTime: 0,
    _testSceneEndTime: 0,
    _testSceneBeginFrames: 0,
    _testSceneEndFrames: 0,
    _testTransitionTimerID: 0,
    _testFPSList: [],
    _testScores: [],
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
        var testInfo = BenchmarkTestCases.getTestInfo(testScene.getID());
        this._testSceneBeginTime = (new Date).getTime();
        this._testSceneBeginFrames = cc.Director.getInstance().getTotalFrames();
        if (0 < testInfo.duration) {
            this._testTransitionTimerID = setTimeout(
                function() {
                    benchmarkControllerInstance._testTransitionTimerTimeout()
                },
                testInfo.duration
            );
        }
        if (this._delegate && this._delegate.onBeginTestCase) {
            this._delegate.onBeginTestCase(testInfo);
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
            this._saveTestData(testID, testInfo);
            if (this._delegate && this._delegate.onEndTestCase) {
                this._delegate.onEndTestCase(testID, testInfo)
            }
            if (testID >= BenchmarkTestCases.maxID()) {
                this.endBenchmark();
            }
        }
    },
    startBenchmark: function() {
        if (this.ready) {
            this._runTest(0);
            if (this._delegate && this._delegate.onStartBenchmark) {
                this._delegate.onStartBenchmark();
            }
        }
    },
    stopBenchmark: function() {
        cc.Director.getInstance().replaceScene(BenchmarkEntryScene.instance);
        if (this._testTransitionTimerID) {
            clearTimeout(this._testTransitionTimerID);
            this._testTransitionTimerID = 0;
        }
        if (this._delegate && this._delegate.onStopBenchmark) {
            this._delegate.onStopBenchmark();
        }
    },
    endBenchmark: function() {
        // use Harmonic Average value as the final score
        var sum = 0;
        var length = BenchmarkTestCases.maxID() + 1;
        for (var i=0; i<length; ++i) {
            sum += 1 / this._testScores[i];
        }
        this._finalScore = (length / sum).toFixed(2);
        if (this._delegate && this._delegate.onEndBenchmark) {
            this._delegate.onEndBenchmark();
        }
    },
    _ifCurrentTestEnds: function() {
        var testInfo = BenchmarkTestCases.getTestInfo(this._currentTestID);
        return !this._testTransitionTimerID;
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
                cc.log(testSceneName);
                var testScene = new window[testSceneName];
                this._currentTestID = ID;

                testScene.setID(ID);
                testScene.runTest();
            } catch (e) {
                this.stopBenchmark();
                if (this._delegate && this._delegate.onError) {
                    this._delegate.onError(e);
                }
            }
        }
    },
    _testTransitionTimerTimeout: function() {
        this._testTransitionTimerID = 0;
        if (this._ifCurrentTestEnds()) {
            this._runNextTest();
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

BenchmarkOnControllerLoadEnd(benchmarkControllerInstance);

// Test cases data
// category: API category
// duration: duration(ms)
// referenceFPS: FPS test value on the reference platform
BenchmarkTestCases = [
    {
        category: 'DrawPrimitives',
        defaultDuration: 2000,
        tests: [
            {
                name: 'Test',
                referenceFPS: 1.16
            }
        ]
    },
    {
        category: 'Particle',
        defaultDuration: 5000,
        tests: [
            {
                name: 'Size8',
                referenceFPS: 19.68
            },
            {
                name: 'BurstPipe',
                referenceFPS: 12.55
            },
            {
                name: 'Comet',
                referenceFPS: 7.83
            }
        ]
    },
    {
        category: 'Sprite',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Position',
                referenceFPS: 4.44
            },
            {
                name: 'Actions',
                referenceFPS: 3.03
            }
        ]
    },
    {
        category: 'TileMap',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Isometric',
                referenceFPS: 5 // TODO: fill the reference value
            }
        ]
    }
];

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
        referenceFPS: 0
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
    testInfo.referenceFPS = test.referenceFPS;
    return testInfo;
};