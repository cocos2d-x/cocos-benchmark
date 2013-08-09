/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 7/12/13
 * Time: 11:15 AM
 */
////////////////////////////////////////////////////////
//
// Default benchmark scene
//
////////////////////////////////////////////////////////
var BenchmarkEntry = cc.Layer.extend({
    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var layer = new cc.Layer();
        this.addChild(layer);

        var sprite = cc.Sprite.create(s_benchmark);
        sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        sprite.setScaleX(size.width/sprite.getContentSize().width);
        sprite.setScaleY(size.height/sprite.getContentSize().height);
        layer.addChild(sprite, 0);

        this.setTouchEnabled(false);

        return true;
    }
});

