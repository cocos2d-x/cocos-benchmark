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
        infoLabel.setString('    cocos-benchmark v0.7.0\n\n' +
            ' Engine:  cocos2d-x 2.1.4\n' +
            ' Device:  iPhone 5\n' +
            ' OS:        iOS 6.1.4\n' +
            ' CPU:     A5\n' +
            ' MEM:    1GB'
            );
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
        benchmarkControllerInstance.startBenchmark();
    }
});
