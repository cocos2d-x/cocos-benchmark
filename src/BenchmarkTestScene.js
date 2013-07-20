/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/18/13
 * Time: 10:25 AM
 */
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