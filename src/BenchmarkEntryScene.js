/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/18/13
 * Time: 10:26 AM
 */
// Scene showed when no benchmark running
BenchmarkEntryScene = cc.Scene.extend({
    onEnter:function () {
        var layer = new BenchmarkEntry();
        layer.init();
        this.addChild(layer);
        benchmarkControllerInstance.ready = true;
    }
});

BenchmarkEntryScene._instance = null;

BenchmarkEntryScene.getInstance = function() {
    if (!this._instance) {
        this._instance = new BenchmarkEntryScene();
        this._instance.retain();
    }
    return this._instance;
};
