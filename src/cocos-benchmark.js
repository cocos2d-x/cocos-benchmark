/**
 * Created with JetBrains WebStorm.
 * User: sunzhuoshi
 * Date: 11/1/12
 * Time: 11:21 AM
 */
BenchmarkEntry = cc.Layer.extend({
    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var lazyLayer = new cc.LazyLayer();
        this.addChild(lazyLayer);

        var sprite = cc.Sprite.create("res/background.png");
        sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        sprite.setScale(0.5);

        lazyLayer.addChild(sprite, 0);

        this.setTouchEnabled(false);
        lazyLayer.adjustSizeForCanvas();
        return true;
    }
});

benchmarkEntrySceneInstance = null;

BenchmarkEntryScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        benchmarkEntrySceneInstance = this;
    },
    onEnter:function () {
        var layer = new BenchmarkEntry();
        layer.init();
        this.addChild(layer);
    }
});

BenchmarkCategoryScene = cc.Scene.extend({
    onEnter: function() {
        benchmarkControllerInstance.onEnterCategoryScene();
    },
    onExit: function() {
        benchmarkControllerInstance.onExitCategoryScene();
    }
});

BenchmarkTestCases = [
    {
        category: 'DrawPrimitives',
        times: 100, // time mode
        time: 2000 // ms, FPS mode
    }/*,
    {
        category: 'Actions'
    },
    {
        category: 'Particle'
    }
    */
];

// TODO: refactor it
BenchmarkBaseController = cc.Class.extend({
    _categoryTestResult: [],
    _currentCategoryIndex: 0,
    _isBenchmarking: false,
    _runCategoryTest: function(index) {
    },
    onEnterCategoryScene: function() {
    },
    onExitCategoryScene: function() {
    },
    onTestBegin: function() {
    },
    onTestEnd: function() {
    },
    startBenchmark: function(button) {
        this._isBenchmarking = true;
        this._runCategoryTest(0);
        BenchmarkSetActionStop(button);
    },
    stopBenchmark: function(button) {
        this._isBenchmarking = false;
        cc.Director.getInstance().replaceScene(benchmarkEntrySceneInstance);
        BenchmarkSetActionStart(button);
    },
    isBenchmarking: function() {
        return this._isBenchmarking;
    },
    outputResult: function() {
    }
});

// TODO: refactor it
BenchmarkTimeController = BenchmarkBaseController.extend({
    _testBeginTime: 0,
    _testRunTimes: 0,
    _testResult: [],
    _saveCurrentCategoryTestResult: function() {
        var timeSum = 0, minTime = 0, maxTime = 0, meanTime = 0, maxDeltaPercent = 0;
        for (var i=0; i<this._testResult.length; ++i) {
            var time = this._testResult[i];
            timeSum += time;
            if (time > maxTime || 0 == maxTime) {
                maxTime = time;
            }
            if (time < minTime || 0 == minTime) {
                minTime = time;
            }
        }
        meanTime = timeSum / this._testResult.length;
        maxDeltaPercent = (Math.max(maxTime-meanTime, meanTime-minTime) / meanTime * 100).toFixed(2);
        this._categoryTestResult[this._currentCategoryIndex] = {
            category: BenchmarkTestCases[this._currentCategoryIndex].category,
            meanTime: meanTime,
            maxDeltaPercent: maxDeltaPercent
        }
    },
    _runCategoryTest: function(index) {
        if (0 <= index && index < BenchmarkTestCases.length) {
            this._testBeginTime = 0;
            this._currentCategoryIndex = index;
            this._testResult = [];
            this._testRunTimes = 0;
            var categoryTestScene = new window[BenchmarkTestCases[this._currentCategoryIndex].category + 'BenchmarkScene'];
            categoryTestScene.runTest();
        }
    },
    outputResult: function() {
        for (var i=0; i<this._categoryTestResult.length; ++i) {
            var result = this._categoryTestResult[i];
            benchmarkOutputInstance.writeln(result.category + ': ' +
                result.meanTime + 'ms' +
                ' +/- ' + result.maxDeltaPercent + '%');
        }
    },
    onTestBegin: function() {
        this._testBeginTime = (new Date).getTime();
    },
    onTestEnd: function() {
        if (this._testRunTimes >= BenchmarkTestCases[this._currentCategoryIndex].times) {
            this._saveCurrentCategoryTestResult();
            if (this._currentCategoryIndex == BenchmarkTestCases.length - 1) {
                this.stopBenchmark();
                this.outputResult();
            }
            else {
                this._runCategoryTest(this._currentCategoryIndex + 1);
            }
        }
        else {
            this._testResult[this._testRunTimes++] = (new Date).getTime() - this._testBeginTime;
        }
    }
});

// TODO: refactor it
BenchmarkFPSController = BenchmarkBaseController.extend({
    _categoryTestBeginTime: 0,
    _categoryTestEndTime: 0,
    _categoryTestBeginFrames: 0,
    _categoryTestEndFrames: 0,
    _timer: 0,
    _saveCurrentCategoryTestResult: function() {
        this._categoryTestResult[this._currentCategoryIndex] = {
            category: BenchmarkTestCases[this._currentCategoryIndex].category,
            FPS: ((this._categoryTestEndFrames - this._categoryTestBeginFrames) /
                (this._categoryTestEndTime - this._categoryTestBeginTime) * 1000).toFixed(2)
        }
    },
    outputResult: function() {
        for (var i=0; i<this._categoryTestResult.length; ++i) {
            var result = this._categoryTestResult[i];
            benchmarkOutputInstance.writeln(result.category + ': ' + result.FPS);
        }
    },
    onEnterCategoryScene: function() {
        this._categoryTestBeginTime = (new Date).getTime();
        this._categoryTestBeginFrames = cc.Director.getInstance().getTotalFrames();
        this._timer = setTimeout(function() {
                benchmarkControllerInstance._timerTimeout()
            },
            BenchmarkTestCases[this._currentCategoryIndex].time);
    },
    onExitCategoryScene: function() {
        if (this._timer) { // stop manually
            clearTimeout(this._timer);
            this._timer = 0;
        } else {
            this._categoryTestEndTime = (new Date).getTime();
            this._categoryTestEndFrames = cc.Director.getInstance().getTotalFrames();
            this._saveCurrentCategoryTestResult();
            if (!this.isBenchmarking()) {
                this.outputResult(); // output result here, for "onExitCategoryScene" called the next frame after "stopBenchmark"
            }
        }
    },
    _runCategoryTest: function(index) {
        if (0 <= index && index < BenchmarkTestCases.length) {
            this._currentCategoryIndex = index;
            var categoryTestScene = new window[BenchmarkTestCases[this._currentCategoryIndex].category + 'BenchmarkScene'];
            categoryTestScene.runTest();
        } else if (index == BenchmarkTestCases.length) {
            this.stopBenchmark();
        }
    },
    _timerTimeout: function() {
        this._timer = 0;
        this._runCategoryTest(this._currentCategoryIndex + 1);
    }
});

benchmarkTimeControllerInstance = new BenchmarkTimeController;
benchmarkFPSControllerInstance = new BenchmarkFPSController;

benchmarkControllerInstance = benchmarkTimeControllerInstance;
benchmarkOutputInstance.writeln('Benchmark mode: time');

function BenchmarkSetMode(mode) {
    benchmarkControllerInstance.stopBenchmark();
    benchmarkOutputInstance.writeln('Benchmark mode set to: ' + mode);
    if ('time' == mode) {
        benchmarkControllerInstance = benchmarkTimeControllerInstance;
    }
    else if ('FPS' == mode) {
        benchmarkControllerInstance = benchmarkFPSControllerInstance;
    }
}

