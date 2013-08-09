/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/18/13
 * Time: 10:25 AM
 */
var BenchmarkTestScene = cc.Scene.extend({
    _ID: 0,
    _testClass: null,
    ctor: function(testClass) {
        this._super();
        this._ID = 0;
        this._testClass = testClass;
    },
    getID: function() {
        return this._ID;
    },
    setID: function(ID) {
        this._ID = ID;
    },
    onEnter: function() {
        this._super();
        BenchmarkController.getInstance().onEnterTestScene(this);
    },
    onExit: function() {
        this._super();
        BenchmarkController.getInstance().onExitTestScene(this);
    },
    runTest: function() {
        var layer = new this._testClass();
        if (layer) {
            this.addChild(layer);
            cc.Director.getInstance().replaceScene(this);
        }
    }
});

BenchmarkTestScene.create = function(testClass) {
    return new BenchmarkTestScene(testClass);
};