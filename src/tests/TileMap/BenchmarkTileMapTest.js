/****************************************************************************
 Copyright (c) 2013-2014 Intel Corporation.
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
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