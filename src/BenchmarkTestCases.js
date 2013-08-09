/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/18/13
 * Time: 10:25 AM
 */
// Test cases data
// category: API category
// duration: duration(ms)
// referenceFPS: FPS test value on the reference platform
var BenchmarkTestCases = [
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

BenchmarkTestCases.get = function(ID) {
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