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
