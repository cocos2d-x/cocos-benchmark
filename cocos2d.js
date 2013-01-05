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
// TODO: support all in one?
var $ALL_IN_ONE = 0;
var $ALL_IN_ONE_FILE = 'cocos-benchmark-all.js';

(function () {
    var config = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        showFPS:true,
        frameRate: 1000, // MAX frame rate possible
        loadExtension:false,
        tag:'Cocos2dGameContainer', //the dom element to run cocos2d on
        engineDir:'./lib/cocos2d/',
        //SingleEngineFile:'',
        appFiles:[
            'src/resources.js',
            'src/cocos-benchmark.js',
            'src/tests/DrawPrimitives/BenchmarkDrawPrimitivesTest.js',
            'src/tests/Particle/BenchmarkParticleTest.js',
            'src/tests/TouchesTest/Paddle.js',
            'src/tests/TouchesTest/Ball.js',
            'src/tests/TouchesTest/TouchesTest.js',
            'src/tests/RotateWorldTest/RotateWorldTest.js'
        ]
    };
    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var script = document.createElement('script');
        if (!$ALL_IN_ONE) {
            if (config.SingleEngineFile && !config.engineDir) {
                script.src = config.SingleEngineFile;
            }
            else if (config.engineDir && !config.SingleEngineFile) {
                script.src = config.engineDir + 'platform/jsloader.js';
            }
            else {
                alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
            }
        }
        else {
            script.src = $ALL_IN_ONE_FILE;
        }
        document.body.appendChild(script);
        document.ccConfig=config;
        script.c = config;
        script.id = 'cocos2d-html5';
    });
})();
