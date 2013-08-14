/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 3/27/13
 * Time: 12:23 PM
 */
// TODO: find why cc.LayerColor.extend failed
var TileMapIsometricBenchmarkScene = BenchmarkTestScene.extend({
    ctor: function() {
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();
        var color = cc.LayerColor.create(cc.c4b(64, 64, 64, 255));
        this.addChild(color, -1);
        // TODO: fix display issue when using iso-test.tmx on iPhone5
        var map = cc.TMXTiledMap.create(s_testTileMap);
        this.addChild(map, 0);
         var ms = map.getMapSize();
         var ts = map.getTileSize();
         var scaleX = winSize.width / ms.width / ts.width;
         var scaleY = winSize.height / ms.height / ts.height;
         var scale = Math.min(scaleX, scaleY);
         map.setScale(scale);
         map.setAnchorPoint(cc.p(0.5, 0.5));
         map.setPosition(cc.p(winSize.width/2, winSize.height/2));
    },
    runTest: function () {
        cc.Director.getInstance().replaceScene(this);
    }
});