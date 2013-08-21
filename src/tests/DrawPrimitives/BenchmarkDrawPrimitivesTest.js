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

var DrawPrimitivesBaseBenchmark = cc.Layer.extend({
    ctor: function() {
        this._super();
        var drawNode = cc.DrawNode.create();
        var winSize = cc.Director.getInstance().getWinSize();
        this.addChild(drawNode, 10);
        this.drawTest(drawNode, winSize);
    },
    drawTest: function(drawNode, winSize) {
    }
});

var DrawPrimitivesDrawDotBenchmark = DrawPrimitivesBaseBenchmark.extend({
    drawTest: function(drawNode, winSize) {
        var CIRCLE_COUNT = Math.max(winSize.width, winSize.height);
        var i;
        for (i=0; i<CIRCLE_COUNT; i++) {
            drawNode.drawDot(
                cc.p(winSize.width / 2, winSize.height / 2),
                CIRCLE_COUNT - i,
                cc.c4f(Math.random(), Math.random(), Math.random(), 1)
            );
        }
    }
});

var DrawPrimitivesDrawPolyBenchmark = DrawPrimitivesBaseBenchmark.extend({
    _drawStar: function(drawNode, x, y, w, h) {
        var star = [
            cc.p(x-w, y-w), cc.p(x, y-h-w), cc.p(x+w, y-w),
            cc.p(x+h+w, y), cc.p(x+w, y+w),
            cc.p(x, y+h+w), cc.p(x-w, y+w), cc.p(x-h-w, y)
        ];
        drawNode.drawPoly(star, cc.c4f(1,0,0,1), 1, cc.c4f(0,0,1,1) );
    },
    drawTest: function(drawNode, winSize) {
        var w = 10;
        var h = 20;
        var row = 15, column = 15;
        var i, j;
        for (i=0; i<row; ++i) {
            for (j=0; j<column; ++j) {
                this._drawStar(
                    drawNode,
                    winSize.width / column * j,
                    winSize.height / row * i,
                    w,
                    h
                );
            }
        }
    }
});

var DrawPrimitivesDrawSegmentBenchmark = DrawPrimitivesBaseBenchmark.extend({
    drawTest: function(drawNode, winSize) {
        var SEGMENT_COUNT = 100;
        var RADIUS_UNIT = Math.sqrt(winSize.width * winSize.width + winSize.height * winSize.height) / SEGMENT_COUNT;
        var i;
        for (i=0; i<SEGMENT_COUNT; ++i) {
            var fromPoint = cc.p(winSize.width / 2 / SEGMENT_COUNT * i, winSize.height / 2 / SEGMENT_COUNT * i);
            var toPoint = cc.p(winSize.width - winSize.width / SEGMENT_COUNT / 2 * i, winSize.height - winSize.height / SEGMENT_COUNT / 2 * i);
            var radius = cc.pDistance(fromPoint, toPoint) / 2;
            drawNode.drawSegment(
                fromPoint,
                toPoint,
                radius,
                cc.c4f(Math.random(), Math.random(), Math.random(), 1)
            );
        }
    }
});
