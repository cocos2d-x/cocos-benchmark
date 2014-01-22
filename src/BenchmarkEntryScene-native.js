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
var BenchmarkEntry = cc.Layer.extend({
    init: function () {
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();

        var sprite = cc.Sprite.create(s_benchmark);
        sprite.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        sprite.setScaleX(winSize.width/sprite.getContentSize().width);
        sprite.setScaleY(winSize.height/sprite.getContentSize().height);
        sprite.setColor(cc.c4b(100, 100, 100, 255));
        this.addChild(sprite, 0);

        var panelSize = cc.size(400, 260);

        var colorLayer = cc.LayerColor.create(cc.c4b(150, 150, 150, 255), panelSize.width, panelSize.height);
        colorLayer.setPosition(cc.p((winSize.width - panelSize.width) / 2, (winSize.height - panelSize.height) / 2 + 50));
        this.addChild(colorLayer, 1);

        var infoLabel = cc.LabelTTF.create();
        infoLabel.setPosition(cc.p(panelSize.width / 2, panelSize.height / 2));
        infoLabel.setFontSize(30);
        var infoText = '    cocos-benchmark {version}\n\n' +
            ' Engine:       {engine}\n' +
            ' Model:       {model}\n' +
            ' OS:             {OS}\n' +
            ' Processor:  {processor}\n' +
            ' Memory:     {memory}';
        var version = __getVersion();
        var index1 = version.indexOf('-x-');
        var index2 = version.indexOf('-', index1 + 3);
        var version = version.substring(index1 + 3, index2);
        infoText = infoText.replace('{version}', BenchmarkConfig.VERSION);
        infoText = infoText.replace('{engine}', 'cocos2d-x ' + version);
        infoText = infoText.replace('{model}', 'Unknown');
        infoText = infoText.replace('{OS}', __getOS());
        infoText = infoText.replace('{processor}', 'Unknown');
        infoText = infoText.replace('{memory}', 'Unknown');

        infoLabel.setString(infoText);

        infoLabel.setDimensions(panelSize);
        colorLayer.addChild(infoLabel);

        var startMenuItem = cc.MenuItemFont.create('Start', this.startBenchmark, this);
        var aboutMenuItem = cc.MenuItemFont.create('About');
        aboutMenuItem.setEnabled(false);
        aboutMenuItem.setPosition(cc.p(0, -50));
        var menu = cc.Menu.create(startMenuItem, aboutMenuItem);
        menu.setPosition(cc.p(
            winSize.width / 2,
            colorLayer.getPosition().y - 50
        ));
        this.addChild(menu, 3);

        this.setTouchEnabled(false);

        return true;
    },
    startBenchmark: function() {
        BenchmarkController.getInstance().startBenchmark();
    }
});
