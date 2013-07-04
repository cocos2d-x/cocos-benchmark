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
var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AudioEngine.getInstance().init();
        if (cc.Loader.preload) {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        }
        else { // v2.1.1
            cc.Loader.getInstance().onloading = function () {
                cc.LoaderScene.getInstance().draw();
            };
            cc.Loader.getInstance().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            };
            cc.Loader.getInstance().preload(g_resources);
        }
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();
        // turn on/off display FPS
        if (BENCHMARK_DEBUG) {
            benchmarkOutputInstance.writeln('Debug mode: on');
            director.setDisplayStats(this.config['showFPS']);
        }

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        // create a scene, and run
        if (cc.Loader.preload) {
            cc.Loader.preload(g_resources, this.runStartScene, this);
        }
        else { // v2.1.1
            this.runStartScene();
        }
        return true;
    },
    runStartScene: function() {
        if (cc.Director.getInstance().getRunningScene()) {
            cc.Director.getInstance().replaceScene(new this.startScene());
        }
        else {
            cc.Director.getInstance().runWithScene(new this.startScene());
        }
    }
});
var benchmark = new cocos2dApp(BenchmarkEntryScene);

