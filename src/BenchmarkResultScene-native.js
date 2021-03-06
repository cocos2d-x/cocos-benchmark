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
var BenchmarkTestResultBar = cc.Node.extend({
    _testName: null,
    _FPS: null,
    _score: null,
    _nameLabel: null,
    _scoreLabel: null,
    _scoreBarLayer: null,
    _updateScoreLabel: function() {
        this._scoreLabel.setString(this._FPS + '(' + this._score + ')');
    },
    setTestName: function(testName) {
        this._testName = testName;
        this._nameLabel.setString(testName);
    },
    setFPS: function(FPS) {
        this._FPS = FPS;
        this._updateScoreLabel();
    },
    setScore: function(score) {
        var ratio = score / 10;
        if (ratio > 1) {
            ratio = 1;
        }
        this._score = score;
        this._updateScoreLabel();
        this._scoreBarLayer.changeWidth(400 * ratio);
    },
    ctor: function() {
        this._super();
        this._testName = '';
        this._FPS = 0;
        this._score = 0;
        this._nameLabel = cc.LabelTTF.create();
        this._nameLabel.setFontSize(30);
        this._nameLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this._nameLabel.setAnchorPoint(cc.p(0, 0));
        this._scoreLabel = cc.LabelTTF.create();
        this._scoreBarLayer = cc.LayerColor.create(cc.c4b(150, 150, 150, 255), 100, 40);
        this._scoreBarLayer.setPosition(200, 0);
        this._scoreBarLayer.setColor(cc.BLUE);
        this._scoreLabel = cc.LabelTTF.create();
        this._scoreLabel.setFontSize(30);
        this._scoreLabel.setAnchorPoint(cc.p(0, 0));
        this._scoreLabel.setPosition(300, 0);
        this.addChild(this._nameLabel);
        this.addChild(this._scoreBarLayer);
        this.addChild(this._scoreLabel);
    }
});

BenchmarkTestResultBar.create = function(testName, FPS, score) {
    var result = new BenchmarkTestResultBar();
    result.setTestName(testName);
    result.setFPS(FPS);
    result.setScore(score);
    return result;
};

BenchmarkFinalScoreBar = cc.Node.extend({
    _nameLabel: null,
    _valueLabel: null,
    setScore: function(score) {
        this._valueLabel.setString(score);
    },
    ctor: function() {
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();
        this._nameLabel = cc.LabelTTF.create();
        this._nameLabel.setString('Score: ');
        this._nameLabel.setAnchorPoint(cc.p(0.5, 0));
        this._nameLabel.setFontSize(40);
        this._nameLabel.setPosition(winSize.width / 2 - 100, 0);
        this.addChild(this._nameLabel);
        this._valueLabel = cc.LabelTTF.create();
        this._valueLabel.setAnchorPoint(cc.p(0.5, 0));
        this._valueLabel.setFontSize(40);
        this._valueLabel.setPosition(winSize.width / 2 + 100, 0);
        this.addChild(this._valueLabel);
    }
});

BenchmarkFinalScoreBar.create = function(score) {
    var result = new BenchmarkFinalScoreBar();
    result.setScore(score);
    return result;
};

BenchmarkResult = cc.Layer.extend({
    _resultBars: null,
    _finalScoreBar: null,
    _tickCount: null,
    init: function () {
        this._super();
        this._tickCount ++;
        var winSize = cc.Director.getInstance().getWinSize();

        var sprite = cc.Sprite.create(s_benchmark);
        sprite.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        sprite.setScaleX(winSize.width/sprite.getContentSize().width);
        sprite.setScaleY(winSize.height/sprite.getContentSize().height);
        sprite.setColor(cc.c4b(100, 100, 100, 255));
        this.addChild(sprite, 0);

        this._resultBars = [];
        var i;
        for (i=0; i<BenchmarkTestCases.maxID(); ++i) {
            var resultBar = BenchmarkTestResultBar.create('', 0, 0);
            resultBar.setTestName(BenchmarkTestCases.get(i).name);
            this._resultBars.push(resultBar);
            resultBar.setPosition(200, winSize.height - 100 - 60 * i);
            this.addChild(resultBar);
        }
        this.finalScoreBar = BenchmarkFinalScoreBar.create(0);
        this.finalScoreBar.setPosition(0, 150);
        this.addChild(this.finalScoreBar);

        var backMenuItem = cc.MenuItemFont.create('Back', this.backToEntry, this);
        var submitMenuItem = cc.MenuItemFont.create('Submit');
        backMenuItem.setPosition(-100, 0);
        submitMenuItem.setPosition(100, 0);
        submitMenuItem.setEnabled(false);
        var menu = cc.Menu.create(backMenuItem, submitMenuItem);
        menu.setPosition(winSize.width / 2, 100);
        this.addChild(menu);
        return true;
    },
    _tick: function() {
        var benchmarkController = BenchmarkController.getInstance();
        var i;
        this._tickCount ++;
        for (i=0; i<this._resultBars.length; ++i) {
            var resultBar = this._resultBars[i];
            resultBar.setFPS(
                (benchmarkController.getTestFPS(i) * this._tickCount / BenchmarkResult.MAX_TICK_COUNT).toFixed(2)
            );
            resultBar.setScore(
                (benchmarkController.getTestScore(i) * this._tickCount / BenchmarkResult.MAX_TICK_COUNT).toFixed(2)
            )
        }
        this.finalScoreBar.setScore(
            (benchmarkController.getFinalScore() * this._tickCount / BenchmarkResult.MAX_TICK_COUNT).toFixed(2)
        );
    },
    backToEntry: function() {
        cc.Director.getInstance().replaceScene(
            BenchmarkEntryScene.getInstance()
        );
    },
    onEnter: function() {
        this._tickCount = 0;
        this.schedule(this._tick, 0.05, BenchmarkResult.MAX_TICK_COUNT);
    }
});

BenchmarkResult.MAX_TICK_COUNT = 40;

BenchmarkResultScene = cc.Scene.extend({
    _benchmarkResult: null,
    ctor: function() {
        this._super();
        this._benchmarkResult = new BenchmarkResult();
        this._benchmarkResult.init();
        this.addChild(this._benchmarkResult);
    }
});

BenchmarkResultScene._instance = null;

BenchmarkResultScene.getInstance = function() {
    if (!this._instance) {
        this._instance = new BenchmarkResultScene();
        this._instance.retain();
    }
    return this._instance;
};