/**
 * Created with JetBrains WebStorm.
 * User: sunzhuoshi
 * Date: 11/1/12
 * Time: 11:21 AM
 */

// If show debug info(FPS, particle count and etc.) when benchmarking
$BENCHMARK_DEBUG = true;

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

////////////////////////////////////////////////////////
//
// Base scene for category tests
// NOTE: only 1 test in category for now
//
////////////////////////////////////////////////////////
BenchmarkCategoryScene = cc.Scene.extend({
    _categoryIndex: null, // save index in scene, due to "onExit" called delay
    getCategoryIndex: function() {
        return this._categoryIndex;
    },
    setCategoryIndex: function(index) {
        this._categoryIndex = index;
    },
    onEnter: function() {
        this._super();
        benchmarkControllerInstance.onEnterCategoryScene(this);
    },
    onExit: function() {
        this._super();
        benchmarkControllerInstance.onExitCategoryScene(this);
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
    _categoryTestResult: [],
    // current running test category index
    _currentCategoryIndex: 0,
    // run a category of test(s) by index
    _runCategoryTest: function(index) {},
    // called when enter category tests scene
    onEnterCategoryScene: function(categoryScene) {},
    // called when exit category tests scene
    onExitCategoryScene: function(categoryScene) {},
    // call it just before test code
    onTestBegin: function() {},
    // cal it just after test code
    onTestEnd: function() {},
    startBenchmark: function(button) {
        this._runCategoryTest(0);
        BenchmarkSetActionStop(button);
    },
    stopBenchmark: function(button) {
        cc.Director.getInstance().replaceScene(BenchmarkEntryScene.instance);
        BenchmarkSetActionStart(button);
    },
    outputResult: function() {}
});

////////////////////////////////////////////////////////
//
// Time mode benchmark controller
// TODO: refactor it
//
////////////////////////////////////////////////////////
BenchmarkTimeController = BenchmarkBaseController.extend({
    _testBeginTime: 0,
    _testRunTimes: 0,
    _testResult: [],
    _getValidTestResult:function(){
        var timeSum=0,meanTime=0;
        var validResult=[];
         for (var i=0; i<this._testResult.length; ++i) {
            var time = this._testResult[i];
            timeSum += time;
        }
         meanTime = timeSum / this._testResult.length;
          for (var i=0; i<this._testResult.length; ++i) {
             validResult[i]=Math.abs((this._testResult[i]-meanTime).toFixed(3));
          }
          var length=validResult.length;
          for(var i=0;i<length-1;i++){
            for(var j=i+1;j<length;j++){
                var temp;
              if(validResult[i]>validResult[j]){
                temp=validResult[i];
                validResult[i]=validResult[j];
                validResult[j]=temp;
                temp=this._testResult[i];
                this._testResult[i]=this._testResult[j];
                this._testResult[j]=temp;
              }
            }
          }
         return validResult;
    },
    _getConfidenceInterval:function(results,mean){
        var D2=0,current=0;
        var length=results.length - BenchmarkTestCases[this._currentCategoryIndex].invalidTimes;
        for(var i=0;i<length;i++){
            current=Math.abs(results[i]-mean)
            D2+=current*current;
        }
        return (Math.sqrt(D2/length*2.262)).toFixed(3);
    },
    _saveCurrentCategoryTestResult: function() {
        var abc=this._getValidTestResult();
        var timeSum = 0, minTime = 0, maxTime = 0, meanTime = 0, maxDeltaPercent = 0;
        var length = this._testResult.length - BenchmarkTestCases[this._currentCategoryIndex].invalidTimes;
        for (var i=0; i<length; ++i) {
            var time = this._testResult[i];
            timeSum += time;
            if (time > maxTime || 0 == maxTime) {
                maxTime = time;
            }
            if (time < minTime || 0 == minTime) {
                minTime = time;
            }
        }
        meanTime = (timeSum / length).toFixed(2);
        //maxDeltaPercent = (Math.max(maxTime-meanTime, meanTime-minTime) / meanTime * 100).toFixed(2);
        maxDeltaPercent = this._getConfidenceInterval(this._testResult,meanTime);
        maxDeltaPercent = (maxDeltaPercent/meanTime*100).toFixed(2);
        this._categoryTestResult[this._currentCategoryIndex] = {
            category: BenchmarkTestCases[this._currentCategoryIndex].category,
            meanTime: meanTime,
            maxDeltaPercent: maxDeltaPercent,
            results:this._testResult,
           // abc:abc
        }
    },
    _runCategoryTest: function(index) {
        if (0 <= index && index < BenchmarkTestCases.length) {
            this._testBeginTime = 0;
            this._currentCategoryIndex = index;
            this._testResult = [];
            this._testRunTimes = 0;
            var categoryTestScene = new window[BenchmarkTestCases[this._currentCategoryIndex].category + 'BenchmarkScene'];
            categoryTestScene.setCategoryIndex(index);
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
        /*for(var i=0;i<this._categoryTestResult[0].results.length;i++){
            benchmarkOutputInstance.writeln(this._categoryTestResult[0].results[i]+"---"+this._categoryTestResult[0].abc[i])
           benchmarkOutputInstance.writeln(this._categoryTestResult[0].results[i])
        }*/
    },
    onTestBegin: function() {
        this._testBeginTime = (new Date).getTime();
       // alert(this._testBeginTime)
    },
    onTestEnd: function() {
        var endTime= new Date().getTime();
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
            this._testResult[this._testRunTimes++] = endTime - this._testBeginTime;
        }
    }
});

////////////////////////////////////////////////////////
//
// FPS mode benchmark controller
// TODO: refactor it
//
////////////////////////////////////////////////////////
BenchmarkFPSController = BenchmarkBaseController.extend({
    _categoryTestBeginTime: 0,
    _categoryTestEndTime: 0,
    _categoryTestBeginFrames: 0,
    _categoryTestEndFrames: 0,
    _timer: 0, // ID of timer to stop category tests
    _saveCategoryTestResult: function(categoryIndex) {
        this._categoryTestResult[categoryIndex] = {
            category: BenchmarkTestCases[categoryIndex].category,
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
    onEnterCategoryScene: function(categoryScene) {
        this._categoryTestBeginTime = (new Date).getTime();
        this._categoryTestBeginFrames = cc.Director.getInstance().getTotalFrames();
        this._timer = setTimeout(function() {
                benchmarkControllerInstance._timerTimeout()
            },
            BenchmarkTestCases[categoryScene.getCategoryIndex()].duration);
    },
    onExitCategoryScene: function(categoryScene) {
        if (this._timer) { // stop manually
            clearTimeout(this._timer);
            this._timer = 0;
        } else {
            var categoryIndex = categoryScene.getCategoryIndex();
            this._categoryTestEndTime = (new Date).getTime();
            this._categoryTestEndFrames = cc.Director.getInstance().getTotalFrames();
            this._saveCategoryTestResult(categoryIndex);
            if (categoryScene.getCategoryIndex() + 1 == BenchmarkTestCases.length) { // last category ends, output result
                this.outputResult();
            }
        }
    },
    _runCategoryTest: function(index) {
        if (0 <= index && index < BenchmarkTestCases.length) {
            this._currentCategoryIndex = index;
            var categoryTestScene = new window[BenchmarkTestCases[index].category + 'BenchmarkScene'];
            categoryTestScene.setCategoryIndex(index);
            categoryTestScene.runTest();
        } else if (index == BenchmarkTestCases.length) {
            this.stopBenchmark();
        }
    },
    _timerTimeout: function() {
        this._timer = 0;
        this._runCategoryTest(this._currentCategoryIndex + 1);
    },
    stopBenchmark: function() {
        this._super();
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = 0;
        }
    }
});

benchmarkTimeControllerInstance = new BenchmarkTimeController;
benchmarkFPSControllerInstance = new BenchmarkFPSController;
// current active benchmark controller
benchmarkControllerInstance = null;

function BenchmarkSetMode(mode) {
    if (benchmarkControllerInstance) {
        benchmarkControllerInstance.stopBenchmark();
    }
    benchmarkOutputInstance.writeln('Benchmark mode set to: ' + mode);
    if ('time' == mode) {
        benchmarkControllerInstance = benchmarkTimeControllerInstance;
    }
    else if ('FPS' == mode) {
        benchmarkControllerInstance = benchmarkFPSControllerInstance;
    }
}

BenchmarkSetMode(benchmarkInitialMode);

// Test cases data
// category: API category
// times: run times in time mode
// duration: duration(ms) in FPS mode
// invalidTimes:it is applied in time mode.when some browsers such as firefox is not very stable,we can deduce the invalidtimes with times
BenchmarkTestCases = [
    {
        category: 'DrawPrimitives',
        times: 10,
        invalidTimes:0,
        duration: 5000
    },
    {
        category: 'Particle',
        times: 10,
        invalidTimes:0,
        duration: 5000
    },
    {
        category:'TouchesTest',
        times:10,
        invalidTimes:0,
        duration:5000
    },
    {
        category:'RotateWorldTest',
        times:0,// In time mode,we can't find a better method to test this API,so we set times to 0 so as to close it
        invalidTimes:0,
        duration:5000
    }
];


