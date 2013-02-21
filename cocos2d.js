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
var SINGLE_FILE = true; // use SINGLE_FILE in release version to reduce loading time
var APP_SINGLE_FILE = 'cocos-benchmark-' + BENCHMARK_VERSION + '.js';

(function () {
    var engines = {
        default: "v2.1.min",
        "v2.1.min": {
            file: "lib/Cocos2d-html5-v2.1.min.js"
        }
        // add more engine versions here
    };
    var config = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        showFPS:true,
        frameRate: 1000, // MAX frame rate possible
        loadExtension:false,
        tag:'Cocos2dGameContainer', //the dom element to run cocos2d on
        engineDir:'./lib/cocos2d/',
        appFiles:[
            'src/resources.js',
            'src/cocos-benchmark.js',
            'src/tests/DrawPrimitives/BenchmarkDrawPrimitivesTest.js',
            'src/tests/Particle/BenchmarkParticleTest.js',
            'src/tests/Sprite/BenchmarkSpriteTest.js'
        ]
    };
     function loadEnd() {
         if (SINGLE_FILE) {
             var engine = BenchmarkQueryParameters.engine;
             if (!engine) {
                 engine = engines.default;
             }
             var engineItem = engines[engine];
             if (engineItem) {
                 config.engineDir = null;
                 config.SingleEngineFile = engineItem.file;
                 config.appFiles = [APP_SINGLE_FILE];
                 var engineIDElement = document.getElementById('engine_id');
                 if (engineIDElement) {
                     engineIDElement.innerText = engine;
                 }
                 var engineLabelElement = document.getElementById('engine_label');
                 if (engineLabelElement) {
                     engineLabelElement.style.display = 'block';
                 }
             }
             else {
                 alert('invalid engine: ' + engine)
                 return;
             }
         }
        //first load engine file if specified
        var script = document.createElement('script');
        if (config.SingleEngineFile && !config.engineDir) {
            script.src = config.SingleEngineFile;
        }
        else if (config.engineDir && !config.SingleEngineFile) {
            script.src = config.engineDir + 'platform/jsloader.js';
        }
        else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        document.body.appendChild(script);
        document.ccConfig = config;
        script.id = 'cocos2d-html5';
    }
    window.addEventListener?
    window.addEventListener('DOMContentLoaded',loadEnd):window.attachEvent('DOMContentLoaded',loadEnd);
})();
