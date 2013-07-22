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
var SINGLE_FILE = false; // use SINGLE_FILE in release version to reduce loading time
var APP_SINGLE_FILE = 'cocos-benchmark-' + BENCHMARK_VERSION + '.js';

(function () {
    var engines = {
        'v2.1.0.min': {
            file: 'engines/Cocos2d-html5-v2.1.0.min.js'
        },
        "v2.1.1.min": {
            file: 'engines/Cocos2d-html5-v2.1.1.min.js'
        }
        // add more engine versions here
    };
    var config = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        showFPS:true,
        frameRate: 1000, // MAX frame rate possible
        loadExtension:false,
        renderMode: 1   , // 1 for canvas, 2 for WebGL
        tag:'Cocos2dGameContainer', //the dom element to run cocos2d on
        engineDir:'./lib/cocos2d-html5/cocos2d/',
        appFiles:[
            'src/resources.js',
            'src/BenchmarkConfig.js',
            'src/APIWrapper.js',
            'src/BenchmarkTestScene.js',
            'src/BenchmarkEntryScene.js',
            'src/BenchmarkEntryScene-html5.js',
            'src/BenchmarkTestCases.js',
            'src/BenchmarkController.js',
            //'src/BenchmarkDevController.js', // use it to test error and get reference values
            'src/tests/DrawPrimitives/BenchmarkDrawPrimitivesTest.js',
            'src/tests/Particle/BenchmarkParticleTest.js',
            'src/tests/Sprite/BenchmarkSpriteTest.js',
            'src/tests/TileMap/BenchmarkTileMapTest.js'
        ]
    };
     function loadEnd() {
         //< pc support hack
         if (BenchmarkQueryParameters.v == 'pc') {
             var PC_SIZE = '600px';
             var PC_TITLE_SUFFIX = '(for PC)';
             var gameContainer = document.getElementById('Cocos2dGameContainer');
             gameContainer.style.width = PC_SIZE;
             gameContainer.style.height = PC_SIZE;
             var i, rules = document.styleSheets[0].rules;
             for (i=0; i<rules.length; ++i) {
                 if (rules[i].selectorText == 'body > *') {
                     rules[i].style.width = PC_SIZE;
                     break;
                 }
             }
             document.title += PC_TITLE_SUFFIX;
         }
         //>
         if (SINGLE_FILE) {
             var currentEngineID = BenchmarkQueryParameters.engine;
             var currentEngineInfo, ID;
             if (currentEngineID) {
                 currentEngineInfo = engines[currentEngineID];
             }
             else {
                 for (ID in engines) {
                     if (engines.hasOwnProperty(ID)) {
                         currentEngineID = ID;
                         currentEngineInfo = engines[ID];
                         break;
                     }
                 }
             }
             if (currentEngineInfo) {
                 config.engineDir = null;
                 config.SingleEngineFile = currentEngineInfo.file;
                 config.appFiles = [APP_SINGLE_FILE];
                 var engineLength = 0;
                 for (ID in engines) {
                     engineLength ++;
                 }
                 if (1 === engineLength) {
                     var engineVersion = document.getElementById('engine_version');
                     if (engineVersion) {
                         engineVersion.innerHTML = currentEngineID;
                         engineVersion.style.display = 'block';
                     }
                 }
                 else if (1 < engineLength) {
                     var engineSelect = document.getElementById('engine_select');
                     if (engineSelect) {
                         for (ID in engines) {
                             var option = document.createElement("option");
                             option.value = ID;
                             option.text = ID;
                             if (currentEngineID === ID) {
                                 option.selected = 'selected';
                             }
                             engineSelect.options.add(option, null);
                         }
                         engineSelect.style.display = 'block';
                     }
                 }
                 var engineLabelElement = document.getElementById('engine_menu');
                 if (engineLabelElement) {
                     engineLabelElement.style.display = 'block';
                 }
                 benchmarkOutputInstance.writeln('Engine version: ' + currentEngineID);
             }
             else {
                 alert('invalid engine: ' + currentEngineID)
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
