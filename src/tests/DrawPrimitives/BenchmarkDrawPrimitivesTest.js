/****************************************************************************
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
var DRAW_PRIMITIVES_TEST_LOOP = 20;

var DrawPrimitivesTestBenchmark = cc.Layer.extend({
    ctor: function() {
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();

        var draw = cc.DrawNode.create();
        this.addChild( draw, 10 );

        //
        // Circles
        //
        for( var i=0; i < 10; i++) {
            draw.drawDot( cc.p(winSize.width/2, winSize.height/2), 10*(10-i), cc.c4f( Math.random(), Math.random(), Math.random(), 1) );
        }

        //
        // Polygons
        //
        var points = [ cc.p(winSize.height/4,0), cc.p(winSize.width,winSize.height/5), cc.p(winSize.width/3*2,winSize.height) ];
        draw.drawPoly(points, cc.c4f(1,0,0,0.5), 4, cc.c4f(0,0,1,1) );

        // star poly (triggers bugs)
        var o=80;
        var w=20;
        var h=50;
        var star = [
                  cc.p(o+w,o-h), cc.p(o+w*2, o),                  // lower spike
                  cc.p(o + w*2 + h, o+w ), cc.p(o + w*2, o+w*2),  // right spike
                  cc.p(o +w, o+w*2+h), cc.p(o,o+w*2),             // top spike
                  cc.p(o -h, o+w), cc.p(o,o)                     // left spike
                  ];
        draw.drawPoly(star, cc.c4f(1,0,0,0.5), 1, cc.c4f(0,0,1,1) );

        // star poly (doesn't trigger bug... order is important un tesselation is supported.
        o=180;
        w=20;
        h=50;
        star = [
              cc.p(o,o), cc.p(o+w,o-h), cc.p(o+w*2, o),       // lower spike
              cc.p(o + w*2 + h, o+w ), cc.p(o + w*2, o+w*2),  // right spike
              cc.p(o +w, o+w*2+h), cc.p(o,o+w*2),             // top spike
              cc.p(o -h, o+w)                                 // left spike
              ];
        draw.drawPoly(star, cc.c4f(1,0,0,0.5), 1, cc.c4f(0,0,1,1) );

        //
        // Segments
        //
        draw.drawSegment( cc.p(20,winSize.height), cc.p(20,winSize.height/2), 10, cc.c4f(0, 1, 0, 1) );
        draw.drawSegment( cc.p(10,winSize.height/2), cc.p(winSize.width/2, winSize.height/2), 40, cc.c4f(1, 0, 1, 0.5) );
    }
});

var DrawPrimitivesTestBenchmarkScene = BenchmarkBaseTestScene.extend({
    runTest:function () {
        var layer = new DrawPrimitivesTestBenchmark();
        this.addChild(layer);
        cc.Director.getInstance().replaceScene(this);
    }
});

