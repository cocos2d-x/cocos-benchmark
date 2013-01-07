/**
 * Created with JetBrains WebStorm.
 * User: sunzhuoshi
 * Date: 11/1/12
 * Time: 11:21 AM
 */

// If show debug info(FPS, particle count and etc.) when benchmarking
BENCHMARK_DEBUG = true;

////////////////////////////////////////////////////////
//
// Default scene stuff
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
        sprite.setScale(0.5);

        lazyLayer.addChild(sprite, 0);

        this.setTouchEnabled(false);
        lazyLayer.adjustSizeForCanvas();
        return true;
    }
});

BenchmarkEntryScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        // set the share instance to this
        BenchmarkEntryScene.instance = this;
    },
    onEnter:function () {
        var layer = new BenchmarkEntry();
        layer.init();
        this.addChild(layer);
    }
});

// share instance for BenchmarkEntryScene
BenchmarkEntryScene.instance = null;

BenchmarkBaseTestScene = cc.Scene.extend({
    _indices: {categoryIndex: null, testIndex: null},
    getIndices: function() {
        return this._indices;
    },
    setIndices: function(indices) {
        this._indices = indices;
    },
    onEnter: function() {
        this._super();
        benchmarkControllerInstance.onEnterTestScene(this);
    },
    onExit: function() {
        this._super();
        benchmarkControllerInstance.onExitTestScene(this);
    }
});


////////////////////////////////////////////////////////
//
// Base benchmark controller
// TODO: refactor it
//
////////////////////////////////////////////////////////
BenchmarkBaseController = cc.Class.extend({
    // test result organized by categories
    _testResults: [],
    // current running test indices(category index, test index)
    _currentTestIndices: {},
    // run a category of test(s) by index
    _runTest: function(indices) {},
    // called when enter category tests scene
    onEnterTestScene: function(testScene) {},
    // called when exit category tests scene
    onExitTestScene: function(testScene) {},
    startBenchmark: function(button) {
        BenchmarkSetActionStop(button);
        this._runTest({
            categoryIndex: 0,
            testIndex: 0
        });
    },
    stopBenchmark: function(button) {
        BenchmarkSetActionStart(button);
        cc.Director.getInstance().replaceScene(BenchmarkEntryScene.instance);
    },
    outputScore: function() {}
});

BenchmarkFPSController = BenchmarkBaseController.extend({
    _testBeginTime: 0,
    _testEndTime: 0,
    _testBeginFrames: 0,
    _testEndFrames: 0,
    _timer: 0, // ID of timer to stop tests
    _saveTestResult: function(testIndices) {
        var categoryIndex = testIndices.categoryIndex;
        var testIndex = testIndices.testIndex;
        var category = BenchmarkTestCases[categoryIndex].category;
        var name = BenchmarkTestCases[categoryIndex].tests[testIndex].name;
        var FPS = ((this._testEndFrames - this._testBeginFrames) / (this._testEndTime - this._testBeginTime) * 1000).toFixed(2);
        if (0 === testIndex) {
            this._testResults[categoryIndex] = [];
        }
        this._testResults[categoryIndex][testIndex] = {
            category: category,
            name: name,
            FPS: FPS
        };
        benchmarkOutputInstance.writeln('  ' + name + ': ' + FPS);
    },
    outputScore: function() {
        var score = 0;
        for (var i=0; i<this._testResults.length; ++i) {
            var categories = this._testResults[i];
            for (var j=0; j<categories.length; ++j) {
                score += Number(categories[j].FPS);
            }
        }
        score = score.toFixed(2);
        benchmarkOutputInstance.writeln('Score: ' + score);
    },
    onEnterTestScene: function(testScene) {
        var indices = testScene.getIndices();
        if (0 === indices.testIndex) {
            benchmarkOutputInstance.writeln(BenchmarkTestCases[indices.categoryIndex].category);
        }
        this._testBeginTime = (new Date).getTime();
        this._testBeginFrames = cc.Director.getInstance().getTotalFrames();
        var duration = BenchmarkTestCases[indices.categoryIndex].tests[indices.testIndex].duration;
        if (!duration) {
            duration = BenchmarkTestCases[indices.categoryIndex].defaultDuration;
        }
        this._timer = setTimeout(function() {
                benchmarkControllerInstance._timerTimeout()
            },
            duration);
    },
    onExitTestScene: function(testScene) {
        if (this._timer) { // stop manually
            clearTimeout(this._timer);
            this._timer = 0;
        } else {
            var indices = testScene.getIndices();
            var categoryIndex = indices.categoryIndex;
            var testIndex = indices.testIndex;
            this._testEndTime = (new Date).getTime();
            this._testEndFrames = cc.Director.getInstance().getTotalFrames();
            this._saveTestResult(indices);
            if (categoryIndex + 1 === BenchmarkTestCases.length &&
                testIndex + 1 === BenchmarkTestCases[categoryIndex].tests.length) { // last test ends, output result
                this.outputScore();
            }
        }
    },
    _runTest: function(indices) {
        var categoryIndex = indices.categoryIndex;
        var testIndex = indices.testIndex;
        if (0 <= categoryIndex && categoryIndex < BenchmarkTestCases.length &&
            0 <= testIndex && testIndex < BenchmarkTestCases[categoryIndex].tests.length) {
            var name = BenchmarkTestCases[categoryIndex].tests[testIndex].name;
            var category = BenchmarkTestCases[categoryIndex].category;
            this._currentTestIndices = indices;
            var testSceneName = category + name + 'BenchmarkScene';
            try {
                var testScene = new window[testSceneName];
                testScene.setIndices(indices);
                testScene.runTest();
            } catch (e) {
                benchmarkOutputInstance.writeln('Exception occurred, stopped:\n' + e);
                this.stopBenchmark();
            }
        }
    },
    _timerTimeout: function() {
        this._timer = 0;
        var indices = {
            categoryIndex: this._currentTestIndices.categoryIndex,
            testIndex: this._currentTestIndices.testIndex + 1
        }
        if (indices.testIndex === BenchmarkTestCases[indices.categoryIndex].tests.length) {
            indices.testIndex = 0;
            indices.categoryIndex += 1;
        }
        if (indices.categoryIndex < BenchmarkTestCases.length) {
            this._runTest(indices);
        } else {
            this.stopBenchmark();
        }
    },
    stopBenchmark: function() {
        this._super();
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = 0;
        }
    }
});

// current active benchmark controller
benchmarkControllerInstance = new BenchmarkFPSController;


BenchmarkTestCases = [
    {
        category: 'DrawPrimitives',
        defaultDuration: 2000,
        tests: [
            {
                name: 'Test01'
            }
        ]
    },
    {
        category: 'Particle',
        defaultDuration: 5000,
        tests: [
            {
                name: 'Size4'
            },
            {
                name: 'Size8'
            },
            {
                name: 'Size32'
            },
            {
                name: 'Size64'
            }
        ]
    },
    {
        category: 'Sprite',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Position'
            },
            {
                name: 'Scale'
            },
            {
                name: 'ScaleAndRotate'
            },
            {
                name: '100out'
            },
            {
                name: '80out'
            },
            {
                name: 'Actions'
            },
            {
                name: 'Actions80out'
            }
        ]
    }
];

