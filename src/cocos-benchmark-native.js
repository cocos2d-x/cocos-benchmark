/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/12/13
 * Time: 11:13 AM
 */
////////////////////////////////////////////////////////
//
// Default benchmark scene
//
////////////////////////////////////////////////////////
BenchmarkEntry = cc.Layer.extend({
    init: function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var layer = new cc.Layer();
        this.addChild(layer);

        var sprite = cc.Sprite.create(s_benchmark);
        sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        sprite.setScaleX(size.width/sprite.getContentSize().width);
        sprite.setScaleY(size.height/sprite.getContentSize().height);
        layer.addChild(sprite, 0);

        var startMenuItem = cc.MenuItemFont.create('Start', this.startBenchmark, this);
        var menu = cc.Menu.create(startMenuItem);
        layer.addChild(menu);

        this.setTouchEnabled(false);

        return true;
    },
    startBenchmark: function() {
        benchmarkControllerInstance.startBenchmark();
    }
});
