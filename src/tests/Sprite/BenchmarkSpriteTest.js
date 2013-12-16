/**
 * Created with JetBrains WebStorm.
 * User: sunzhuoshi
 * Date: 1/4/13
 * Time: 4:03 PM
 */
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
var MAX_SPRITES = 1000;
var SPRITES_TEST = 500;

var TAG_INFO_LAYER = 1;

var start=0;

////////////////////////////////////////////////////////
//
// SubTest
//
////////////////////////////////////////////////////////
var SubTest = cc.Class.extend({
    _subtestNumber:null,
    _batchNode:null,
    _parent:null,
    removeByTag:function (tag) {
        switch (this._subtestNumber) {
            case 1:
            case 4:
            case 7:
                this._parent.removeChildByTag(tag + 100, true);
                break;
            case 2:
            case 3:
            case 5:
            case 6:
            case 8:
            case 9:
                this._batchNode.removeChildAtIndex(tag, true);
                break;
            default:
                break;
        }
    },
   
    createSpriteWithTag:function (tag) {
        var idx, x, y, r, str;
        cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_2D_PIXEL_FORMAT_RGBA8888);

        var sprite;
        switch (this._subtestNumber) {
            case 1:
            {
                sprite = cc.Sprite.create(s_testSprite);
                this._parent.addChild(sprite, 0, tag + 100);
                break;
            }
            case 2:
            case 3:
            {
                sprite = cc.Sprite.createWithTexture(this._batchNode.getTexture(), cc.rect(0, 0, 52, 139));
                this._batchNode.addChild(sprite, 0, tag + 100);
                break;
            }
            case 4:
            {
                idx = parseInt(Math.random() * 14) + 1;
                idx = idx < 10 ? "0" + idx : idx.toString();
                str = "res/Images/grossini_dance_" + idx + ".png";
                sprite = cc.Sprite.create(str);
                this._parent.addChild(sprite, 0, tag + 100);
                break;
            }
            case 5:
            case 6:
            {
                idx = 0 | (Math.random() * 14);
                x = (idx % 5) * 85;
                y = (0 | (idx / 5)) * 121;
                sprite = cc.Sprite.createWithTexture(this._batchNode.getTexture(), cc.rect(x, y, 85, 121));
                this._batchNode.addChild(sprite, 0, tag + 100);
                break;
            }

            case 7:
            {
                r = 0 | (Math.random() * 64);

                y = parseInt(r / 8);
                x = parseInt(r % 8);

                str = "res/Images/sprites_test/sprite-" + x + "-" + y + ".png";
                sprite = cc.Sprite.create(str);
                this._parent.addChild(sprite, 0, tag + 100);
                break;
            }

            case 8:
            case 9:
            {
                r = 0 | (Math.random() * 64);

                y = (0 | (r / 8)) * 32;
                x = (r % 8) * 32;
                sprite = cc.Sprite.createWithTexture(this._batchNode.getTexture(), cc.rect(x, y, 32, 32));
                this._batchNode.addChild(sprite, 0, tag + 100);
                break;
            }

            default:
                break;
        }

        cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_2D_PIXEL_FORMAT_DEFAULT);

        return sprite;
    },
    initWithSubTest:function (subTest, p) {
        this._subtestNumber = subTest;
        this._parent = p;
        this._batchNode = null;
        /*
         * Tests:
         * 1: 1 (32-bit) PNG sprite of 52 x 139
         * 2: 1 (32-bit) PNG Batch Node using 1 sprite of 52 x 139
         * 3: 1 (16-bit) PNG Batch Node using 1 sprite of 52 x 139
         * 4: 1 (4-bit) PVRTC Batch Node using 1 sprite of 52 x 139

         * 5: 14 (32-bit) PNG sprites of 85 x 121 each
         * 6: 14 (32-bit) PNG Batch Node of 85 x 121 each
         * 7: 14 (16-bit) PNG Batch Node of 85 x 121 each
         * 8: 14 (4-bit) PVRTC Batch Node of 85 x 121 each

         * 9: 64 (32-bit) sprites of 32 x 32 each
         *10: 64 (32-bit) PNG Batch Node of 32 x 32 each
         *11: 64 (16-bit) PNG Batch Node of 32 x 32 each
         *12: 64 (4-bit) PVRTC Batch Node of 32 x 32 each
         */
    }
});

////////////////////////////////////////////////////////
//
// SpriteMainScene
//
////////////////////////////////////////////////////////
var SpriteMainScene = BenchmarkTestScene.extend({
    _lastRenderedCount:null,
    _quantityNodes:null,
    _subTest:null,
    _subtestNumber:1,
    title:function () {
        return "No title";
    },
    initWithSubTest:function (asubtest, nodes) {
        this._subtestNumber = asubtest;
        this._subTest = new SubTest();
        this._subTest.initWithSubTest(asubtest, this);

        var s = cc.Director.getInstance().getWinSize();

        this._lastRenderedCount = 0;
        this._quantityNodes = 0;

        if (BenchmarkConfig.DEBUG) {
            // add title label
            var label = cc.LabelTTF.create(this.title(), "Arial", 40);
            this.addChild(label, 1);
            label.setPosition(cc.p(s.width / 2, s.height - 32));
            label.setColor(cc.c3b(255, 255, 40));

            var infoLabel = cc.LabelTTF.create("0 nodes", "Marker Felt", 30);
            infoLabel.setColor(cc.c3b(0, 200, 20));
            infoLabel.setPosition(cc.p(s.width / 2, s.height - 90));
            this.addChild(infoLabel, 1, TAG_INFO_LAYER);
        }

        while (this._quantityNodes < nodes) {
            this.onIncrease();
        }
    },
    updateNodes:function () {
        if (BenchmarkConfig.DEBUG) {
            if (this._quantityNodes != this._lastRenderedCount) {
                var infoLabel = this.getChildByTag(TAG_INFO_LAYER);
                var str = this._quantityNodes + " nodes";
                infoLabel.setString(str);

                this._lastRenderedCount = this._quantityNodes;
            }
        }
    },
    onIncrease:function () {
        if (this._quantityNodes >= MAX_SPRITES)
            return;

        var sprite = this._subTest.createSpriteWithTag(this._quantityNodes);
        this.doTest(sprite);
        this._quantityNodes++;
        this.updateNodes();
    }
});

var SpritePositionBenchmarkScene = SpriteMainScene.extend({
    runTest:function () {
        this.initWithSubTest(1, SPRITES_TEST);
        cc.Director.getInstance().replaceScene(this);
    },
    doTest:function (sprite) {
        var size = cc.Director.getInstance().getWinSize();
        sprite.setPosition(cc.p(parseInt(Math.random() * size.width), parseInt(Math.random() * size.height)));
    },
    title:function () {
        return "A (" + this._subtestNumber + ") position";
    }
});

var SpriteActionsBenchmarkScene = SpriteMainScene.extend({
    runTest:function () {
        this.initWithSubTest(1, SPRITES_TEST);
        cc.Director.getInstance().replaceScene(this);
    },
    doTest:function (sprite) {
        var size = cc.Director.getInstance().getWinSize();
        sprite.setPosition(cc.p(parseInt(Math.random() * size.width), parseInt(Math.random() * size.height)));

        var period = 0.5 + (Math.random() * 1000) / 500.0;
        var rot = cc.RotateBy.create(period, 360.0 * Math.random());
        var rot_back = rot.reverse();
        var permanentRotation = cc.RepeatForever.create(cc.Sequence.create(rot, rot_back));
        sprite.runAction(permanentRotation);

        var growDuration = 0.5 + (Math.random() * 1000) / 500.0;
        var grow = cc.ScaleBy.create(growDuration, 0.5, 0.5);
        var permanentScaleLoop = cc.RepeatForever.create(cc.Sequence.create(grow, grow.reverse()));
        sprite.runAction(permanentScaleLoop);
    },
    title:function () {
        return "F (" + this._subtestNumber + ") actions";
    }
});
